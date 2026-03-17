import { useState } from "react";
import GymApp from "./App";

type ActiveTool = null | "gym" | "budget";

export default function Root() {
  const [activeTool, setActiveTool] = useState<ActiveTool>(() => {
    // Check hash for deep linking
    const hash = window.location.hash.slice(1);
    if (hash === "gym") return "gym";
    if (hash === "budget") return "budget";
    return null;
  });

  const openTool = (tool: ActiveTool) => {
    setActiveTool(tool);
    if (tool) window.location.hash = tool;
    else window.history.replaceState(null, "", window.location.pathname);
  };

  // Handle browser back
  useState(() => {
    const handler = () => {
      const hash = window.location.hash.slice(1);
      if (hash === "gym") setActiveTool("gym");
      else if (hash === "budget") setActiveTool("budget");
      else setActiveTool(null);
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  });

  if (activeTool === "gym") {
    return (
      <div className="min-h-screen bg-slate-900">
        {/* Back to tools bar */}
        <div className="sticky top-0 z-[999] bg-slate-950/95 backdrop-blur-sm border-b border-slate-700/50">
          <div className="max-w-lg mx-auto px-4 py-2 flex items-center gap-3">
            <button onClick={() => openTool(null)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Macchellis Tools
            </button>
          </div>
        </div>
        <GymApp />
      </div>
    );
  }

  if (activeTool === "budget") {
    // Placeholder — will be replaced with the actual budget app
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="sticky top-0 z-[999] bg-slate-950/95 backdrop-blur-sm border-b border-slate-700/50">
          <div className="max-w-lg mx-auto px-4 py-2 flex items-center gap-3">
            <button onClick={() => openTool(null)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Macchellis Tools
            </button>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <p className="text-6xl mb-4">💰</p>
          <h2 className="text-xl font-bold text-white mb-2">Macchellis Budget</h2>
          <p className="text-sm text-slate-400">In arrivo...</p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  // TOOLS HOME
  // ═══════════════════════════════════════════
  return <ToolsHome onOpenTool={openTool} />;
}

function ToolsHome({ onOpenTool }: { onOpenTool: (tool: ActiveTool) => void }) {
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Buongiorno";
    if (h < 18) return "Buon pomeriggio";
    return "Buonasera";
  })();

  const tools: { id: ActiveTool; name: string; icon: string; desc: string; gradient: string; border: string; shadow: string; ready: boolean }[] = [
    {
      id: "gym",
      name: "Macchellis Gym",
      icon: "🏋️",
      desc: "Schede allenamento, tracking esercizi, cicli e progressi",
      gradient: "from-indigo-500/20 to-purple-500/10",
      border: "border-indigo-500/30 hover:border-indigo-400/60",
      shadow: "hover:shadow-indigo-500/20",
      ready: true,
    },
    {
      id: "budget",
      name: "Macchellis Budget",
      icon: "💰",
      desc: "Gestione spese, budget condiviso e report",
      gradient: "from-emerald-500/20 to-green-500/10",
      border: "border-emerald-500/30 hover:border-emerald-400/60",
      shadow: "hover:shadow-emerald-500/20",
      ready: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950">
      <div className="max-w-lg mx-auto px-5 py-10">
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 rotate-3 hover:rotate-0 transition-transform">
            <span className="text-3xl font-black text-white">M</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Macchellis Tools</h1>
          <p className="text-slate-400 text-sm mt-2">{greeting}! Scegli uno strumento</p>
        </div>

        {/* Tools Grid */}
        <div className="space-y-4">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => onOpenTool(tool.id)}
              className={`w-full text-left rounded-2xl border bg-gradient-to-br ${tool.gradient} ${tool.border} p-5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg ${tool.shadow}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl">{tool.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-white">{tool.name}</h2>
                    {!tool.ready && (
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
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-[11px] text-slate-600">Made with ❤️ for Richi & Giuli</p>
        </div>
      </div>
    </div>
  );
}
