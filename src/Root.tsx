import { useState, useEffect } from "react";
import GymApp from "./App";

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

  // Back bar component
  const BackBar = () => (
    <div className="sticky top-0 z-[999] bg-slate-950/95 backdrop-blur-sm border-b border-slate-700/50">
      <div className="max-w-lg mx-auto px-4 py-2 flex items-center gap-3">
        <button onClick={() => openTool(null)}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {settings.hubTitle}
        </button>
      </div>
    </div>
  );

  if (activeTool === "gym") {
    return (
      <div className="min-h-screen bg-slate-900">
        <BackBar />
        <GymApp />
      </div>
    );
  }

  if (activeTool === "budget") {
    return (
      <div className="min-h-screen bg-slate-900">
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
        <BackBar />
        <SettingsPage settings={settings} onSave={updateSettings} />
      </div>
    );
  }

  return <ToolsHome settings={settings} onOpenTool={openTool} />;
}

// ══════════════════════════════════════════════════════════
// TOOLS HOME
// ══════════════════════════════════════════════════════════
function ToolsHome({ settings, onOpenTool }: { settings: AppSettings; onOpenTool: (tool: ActiveTool) => void }) {
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
function SettingsPage({ settings, onSave }: { settings: AppSettings; onSave: (s: AppSettings) => void }) {
  const [draft, setDraft] = useState<AppSettings>(settings);
  const [saved, setSaved] = useState(false);

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
      <p className="text-sm text-slate-400 mb-6">Personalizza nomi, icone e descrizioni</p>

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
            <span className="text-white font-mono">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>Piattaforma</span>
            <span className="text-white">React + Vite + Tailwind</span>
          </div>
          <div className="flex justify-between">
            <span>Storage</span>
            <span className="text-white">localStorage</span>
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
