import { useState, useEffect } from "react";
import GymApp from "./App";
import {
  getSavedFirebaseConfig, saveFirebaseConfig, clearFirebaseConfig,
  initSync, pushAllToCloud, pullAllFromCloud, smartSync,
  listenForChanges, type FirebaseConfig,
} from "./cloudSync";

// ── Settings types & storage ──
interface ToolConfig {
  name: string;
  icon: string;
  desc: string;
}

interface AppSettings {
  hubTitle: string;
  hubSubtitle: string;
  footerText: string;
  tools: {
    gym: ToolConfig;
    budget: ToolConfig;
  };
}

const defaultSettings: AppSettings = {
  hubTitle: "Macchellis Tools",
  hubSubtitle: "Scegli uno strumento",
  footerText: "Made with ❤️ for Richi & Giuli",
  tools: {
    gym: {
      name: "Macchellis Gym",
      icon: "🏋️",
      desc: "Schede allenamento, tracking esercizi, cicli e progressi",
    },
    budget: {
      name: "Macchellis Budget",
      icon: "💰",
      desc: "Gestione spese, budget condiviso e report",
    },
  },
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem("macchellis-settings");
    if (raw) return { ...defaultSettings, ...JSON.parse(raw), tools: { ...defaultSettings.tools, ...(JSON.parse(raw).tools || {}) } };
  } catch { /* */ }
  return defaultSettings;
}

function saveSettings(s: AppSettings) {
  localStorage.setItem("macchellis-settings", JSON.stringify(s));
}

// ── Routing ──
type ActiveTool = null | "gym" | "budget" | "settings";

export default function Root() {
  const [activeTool, setActiveTool] = useState<ActiveTool>(() => {
    const hash = window.location.hash.slice(1);
    if (hash === "gym") return "gym";
    if (hash === "budget") return "budget";
    if (hash === "settings") return "settings";
    return null;
  });
  const [settings, setSettingsState] = useState<AppSettings>(loadSettings);
  const [syncReady, setSyncReady] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Initialize Firebase sync on mount
  useEffect(() => {
    const config = getSavedFirebaseConfig();
    if (config) {
      const ok = initSync(config);
      if (ok) {
        setSyncReady(true);
        // Smart sync on load
        smartSync().then(({ pulled, pushed }) => {
          if (pulled > 0) {
            // Reload settings if they were pulled
            setSettingsState(loadSettings());
            setSyncMessage(`Sincronizzato: ${pulled} aggiornamenti dal cloud`);
            setTimeout(() => setSyncMessage(null), 3000);
            // Force a full page state reload by dispatching a storage event
            window.dispatchEvent(new Event("cloud-sync-update"));
          }
          if (pushed > 0) {
            setSyncMessage(`Caricati ${pushed} elementi sul cloud`);
            setTimeout(() => setSyncMessage(null), 3000);
          }
        });
        // Listen for real-time changes from other devices
        listenForChanges((key, _data) => {
          if (key === "macchellis-settings") {
            setSettingsState(loadSettings());
          }
          // Notify other components about cloud updates
          window.dispatchEvent(new Event("cloud-sync-update"));
        });
      }
    }
  }, []);

  const updateSettings = (s: AppSettings) => {
    saveSettings(s);
    setSettingsState(s);
  };

  const openTool = (tool: ActiveTool) => {
    setActiveTool(tool);
    if (tool) window.location.hash = tool;
    else window.history.replaceState(null, "", window.location.pathname);
  };

  // Handle browser back
  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash.slice(1);
      if (hash === "gym") setActiveTool("gym");
      else if (hash === "budget") setActiveTool("budget");
      else if (hash === "settings") setActiveTool("settings");
      else setActiveTool(null);
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  // Sync status toast
  const SyncToast = () => syncMessage ? (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] bg-indigo-600 text-white text-xs font-medium px-4 py-2 rounded-full shadow-xl animate-pulse">
      ☁️ {syncMessage}
    </div>
  ) : null;

  // Back bar component
  const BackBar = () => (
    <div className="sticky top-0 z-[999] bg-slate-950/95 backdrop-blur-sm border-b border-slate-700/50">
      <div className="max-w-lg mx-auto px-4 py-2 flex items-center justify-between">
        <button onClick={() => openTool(null)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {settings.hubTitle}
        </button>
        {syncReady && (
          <span className="text-[10px] text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span>
            Sync
          </span>
        )}
      </div>
    </div>
  );

  if (activeTool === "gym") {
    return (
      <div className="min-h-screen bg-slate-900">
        <SyncToast />
        <BackBar />
        <GymApp />
      </div>
    );
  }

  if (activeTool === "budget") {
    return (
      <div className="min-h-screen bg-slate-900">
        <SyncToast />
        <BackBar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <p className="text-6xl mb-4">{settings.tools.budget.icon}</p>
          <h2 className="text-xl font-bold text-white mb-2">{settings.tools.budget.name}</h2>
          <p className="text-sm text-slate-400">In arrivo...</p>
        </div>
      </div>
    );
  }

  if (activeTool === "settings") {
    return (
      <div className="min-h-screen bg-slate-900">
        <SyncToast />
        <BackBar />
        <SettingsPage settings={settings} onSave={updateSettings} syncReady={syncReady} onSyncReady={setSyncReady} />
      </div>
    );
  }

  return (
    <>
      <SyncToast />
      <ToolsHome settings={settings} onOpenTool={openTool} syncReady={syncReady} />
    </>
  );
}

// ══════════════════════════════════════════════════════════
// TOOLS HOME
// ══════════════════════════════════════════════════════════
function ToolsHome({ settings, onOpenTool, syncReady }: { settings: AppSettings; onOpenTool: (tool: ActiveTool) => void; syncReady: boolean }) {
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Buongiorno";
    if (h < 18) return "Buon pomeriggio";
    return "Buonasera";
  })();

  const toolStyles: Record<string, { gradient: string; border: string; shadow: string; ready: boolean }> = {
    gym: {
      gradient: "from-indigo-500/20 to-purple-500/10",
      border: "border-indigo-500/30 hover:border-indigo-400/60",
      shadow: "hover:shadow-indigo-500/20",
      ready: true,
    },
    budget: {
      gradient: "from-emerald-500/20 to-green-500/10",
      border: "border-emerald-500/30 hover:border-emerald-400/60",
      shadow: "hover:shadow-emerald-500/20",
      ready: false,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950">
      <div className="max-w-lg mx-auto px-5 py-10">
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 rotate-3 hover:rotate-0 transition-transform">
            <span className="text-3xl font-black text-white">M</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">{settings.hubTitle}</h1>
          <p className="text-slate-400 text-sm mt-2">{greeting}! {settings.hubSubtitle}</p>
          {syncReady && (
            <div className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-green-400">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span>
              Sincronizzazione cloud attiva
            </div>
          )}
        </div>

        {/* Tools Grid */}
        <div className="space-y-4">
          {(["gym", "budget"] as const).map(toolId => {
            const tool = settings.tools[toolId];
            const style = toolStyles[toolId];
            return (
              <button
                key={toolId}
                onClick={() => onOpenTool(toolId)}
                className={`w-full text-left rounded-2xl border bg-gradient-to-br ${style.gradient} ${style.border} p-5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg ${style.shadow}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">{tool.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-bold text-white">{tool.name}</h2>
                      {!style.ready && (
                        <span className="text-[10px] px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full font-semibold">PRESTO</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{tool.desc}</p>
                  </div>
                  <svg className="w-5 h-5 text-slate-500 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>

        {/* Settings button */}
        <div className="mt-8 flex justify-center">
          <button onClick={() => onOpenTool("settings")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600 transition-all text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Gestione App
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-slate-600">{settings.footerText}</p>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// SETTINGS PAGE
// ══════════════════════════════════════════════════════════
function SettingsPage({ settings, onSave, syncReady, onSyncReady }: {
  settings: AppSettings;
  onSave: (s: AppSettings) => void;
  syncReady: boolean;
  onSyncReady: (v: boolean) => void;
}) {
  const [draft, setDraft] = useState<AppSettings>(settings);
  const [saved, setSaved] = useState(false);

  // Firebase config state
  const [fbConfig, setFbConfig] = useState<Partial<FirebaseConfig>>(() => {
    return getSavedFirebaseConfig() || {};
  });
  const [fbSaving, setFbSaving] = useState(false);
  const [fbMessage, setFbMessage] = useState<string | null>(null);
  const [showFbFields, setShowFbFields] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const handleSave = () => {
    onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (!confirm("Ripristinare tutte le impostazioni predefinite?")) return;
    setDraft(defaultSettings);
    onSave(defaultSettings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveFirebase = async () => {
    if (!fbConfig.apiKey || !fbConfig.databaseURL || !fbConfig.projectId) {
      setFbMessage("Compila almeno apiKey, databaseURL e projectId");
      setTimeout(() => setFbMessage(null), 3000);
      return;
    }
    setFbSaving(true);
    const config = fbConfig as FirebaseConfig;
    saveFirebaseConfig(config);
    const ok = initSync(config);
    if (ok) {
      onSyncReady(true);
      // Push local data to cloud on first connect
      const pushed = await pushAllToCloud();
      setFbMessage(`Connesso! ${pushed} elementi sincronizzati`);
      listenForChanges(() => {
        window.dispatchEvent(new Event("cloud-sync-update"));
      });
    } else {
      setFbMessage("Errore di connessione. Controlla la configurazione.");
    }
    setFbSaving(false);
    setTimeout(() => setFbMessage(null), 4000);
  };

  const handleDisconnectFirebase = () => {
    if (!confirm("Disconnettere la sincronizzazione cloud? I dati locali rimarranno.")) return;
    clearFirebaseConfig();
    onSyncReady(false);
    setFbConfig({});
    setFbMessage("Disconnesso dal cloud");
    setTimeout(() => setFbMessage(null), 3000);
  };

  const handleForceSync = async () => {
    setSyncing(true);
    const pulled = await pullAllFromCloud();
    if (pulled > 0) {
      window.dispatchEvent(new Event("cloud-sync-update"));
      setFbMessage(`Scaricati ${pulled} aggiornamenti dal cloud`);
    } else {
      setFbMessage("Tutto aggiornato!");
    }
    setSyncing(false);
    setTimeout(() => setFbMessage(null), 3000);
  };

  const handleForcePush = async () => {
    setSyncing(true);
    const pushed = await pushAllToCloud();
    setFbMessage(`Caricati ${pushed} elementi sul cloud`);
    setSyncing(false);
    setTimeout(() => setFbMessage(null), 3000);
  };

  const updateTool = (toolId: "gym" | "budget", field: keyof ToolConfig, value: string) => {
    setDraft({
      ...draft,
      tools: {
        ...draft.tools,
        [toolId]: { ...draft.tools[toolId], [field]: value },
      },
    });
  };

  const inputClass = "w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none mt-1";
  const labelClass = "text-[10px] text-slate-500 uppercase font-semibold tracking-wider";

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-white mb-1">Gestione App</h2>
      <p className="text-sm text-slate-400 mb-6">Personalizza nomi, icone, descrizioni e sincronizzazione</p>

      {/* ═══ Cloud Sync Section ═══ */}
      <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-2xl border border-blue-500/30 p-4 mb-4">
        <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <span className="text-lg">☁️</span>
          Sincronizzazione Cloud
        </h3>
        <p className="text-[11px] text-slate-400 mb-3">
          Sincronizza i dati tra dispositivi con Firebase Realtime Database (gratuito)
        </p>

        {syncReady ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-green-400 font-medium">Connesso al cloud</span>
            </div>

            {fbMessage && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-2 text-xs text-blue-300">
                {fbMessage}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button onClick={handleForceSync} disabled={syncing}
                className="py-2.5 rounded-xl text-xs font-bold bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 disabled:opacity-50 transition-all">
                {syncing ? "..." : "⬇️ Scarica dal Cloud"}
              </button>
              <button onClick={handleForcePush} disabled={syncing}
                className="py-2.5 rounded-xl text-xs font-bold bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30 disabled:opacity-50 transition-all">
                {syncing ? "..." : "⬆️ Carica sul Cloud"}
              </button>
            </div>

            <button onClick={handleDisconnectFirebase}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all">
              Disconnetti Cloud
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {fbMessage && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-2 text-xs text-yellow-300">
                {fbMessage}
              </div>
            )}

            {!showFbFields ? (
              <div className="space-y-3">
                <button onClick={() => setShowFbFields(true)}
                  className="w-full py-3 rounded-xl text-sm font-bold bg-blue-500 text-white hover:bg-blue-400 transition-all shadow-lg shadow-blue-500/25">
                  Configura Firebase
                </button>
                <div className="bg-slate-800/50 rounded-xl p-3 text-[11px] text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-300">Come configurare (2 minuti):</p>
                  <p>1. Vai su <span className="text-blue-400">console.firebase.google.com</span></p>
                  <p>2. Crea un nuovo progetto (gratis)</p>
                  <p>3. Vai su Realtime Database &rarr; Crea database</p>
                  <p>4. Nelle regole, imposta read/write su <span className="font-mono text-white">true</span></p>
                  <p>5. Vai su Impostazioni &rarr; Le tue app &rarr; Web &rarr; Copia la config</p>
                  <p>6. Incolla i valori qui sotto</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {(["apiKey", "authDomain", "databaseURL", "projectId", "storageBucket", "messagingSenderId", "appId"] as const).map(field => (
                  <div key={field}>
                    <label className={labelClass}>{field}</label>
                    <input
                      value={(fbConfig as Record<string, string>)[field] || ""}
                      onChange={e => setFbConfig({ ...fbConfig, [field]: e.target.value })}
                      placeholder={field === "databaseURL" ? "https://xxx.firebaseio.com" : field === "projectId" ? "my-project-id" : ""}
                      className={inputClass + " font-mono text-xs"}
                    />
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button onClick={() => setShowFbFields(false)}
                    className="py-2.5 rounded-xl text-xs font-bold bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all">
                    Annulla
                  </button>
                  <button onClick={handleSaveFirebase} disabled={fbSaving}
                    className="py-2.5 rounded-xl text-xs font-bold bg-blue-500 text-white hover:bg-blue-400 disabled:opacity-50 transition-all">
                    {fbSaving ? "Connessione..." : "Connetti"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hub settings */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/50 p-4 mb-4">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <span className="w-6 h-6 bg-indigo-500/20 rounded-lg flex items-center justify-center text-xs">🏠</span>
          Pagina Principale
        </h3>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Titolo Hub</label>
            <input value={draft.hubTitle} onChange={e => setDraft({ ...draft, hubTitle: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Sottotitolo</label>
            <input value={draft.hubSubtitle} onChange={e => setDraft({ ...draft, hubSubtitle: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Testo Footer</label>
            <input value={draft.footerText} onChange={e => setDraft({ ...draft, footerText: e.target.value })} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Tool settings */}
      {(["gym", "budget"] as const).map(toolId => {
        const tool = draft.tools[toolId];
        const colorBg = toolId === "gym" ? "bg-indigo-500/20" : "bg-emerald-500/20";
        return (
          <div key={toolId} className="bg-slate-800/80 rounded-2xl border border-slate-700/50 p-4 mb-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className={`w-6 h-6 ${colorBg} rounded-lg flex items-center justify-center text-xs`}>{tool.icon}</span>
              App: {tool.name}
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-[1fr_80px] gap-3">
                <div>
                  <label className={labelClass}>Nome</label>
                  <input value={tool.name} onChange={e => updateTool(toolId, "name", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Icona</label>
                  <input value={tool.icon} onChange={e => updateTool(toolId, "icon", e.target.value)} className={inputClass + " text-center text-lg"} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Descrizione</label>
                <textarea value={tool.desc} onChange={e => updateTool(toolId, "desc", e.target.value)} rows={2}
                  className={inputClass + " resize-none"} />
              </div>
            </div>
          </div>
        );
      })}

      {/* Info card */}
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/30 p-4 mb-4">
        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
          <span className="text-sm">ℹ️</span> Informazioni
        </h3>
        <div className="space-y-1.5 text-xs text-slate-400">
          <div className="flex justify-between">
            <span>Versione</span>
            <span className="text-white font-mono">2.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>Piattaforma</span>
            <span className="text-white">React + Vite + Tailwind</span>
          </div>
          <div className="flex justify-between">
            <span>Storage</span>
            <span className="text-white">{syncReady ? "localStorage + Firebase Cloud" : "localStorage"}</span>
          </div>
          <div className="flex justify-between">
            <span>URL</span>
            <span className="text-indigo-400 font-mono">macchellis.vercel.app</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button onClick={handleSave}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${saved ? "bg-green-500 text-white" : "bg-indigo-500 text-white hover:bg-indigo-400"}`}>
          {saved ? "✓ Salvato!" : "Salva Modifiche"}
        </button>
        <button onClick={handleReset}
          className="w-full py-3 rounded-xl font-bold text-sm bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-slate-600 transition-all">
          Ripristina Predefiniti
        </button>
      </div>
    </div>
  );
}
