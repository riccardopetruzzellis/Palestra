import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
import type {
  Profile, ProfileData, WorkoutPlan, PlanWeek, Exercise,
  WorkoutSession, CycleProgress, WeekProgress,
} from "./types";
import { emptyProfileData } from "./types";
import {
  getProfiles, updateProfilePhoto, getActiveProfileId, setActiveProfileId,
  loadProfileData, saveProfileData, migrateOldData, resizeImage,
} from "./storage";
import { exerciseDatabase, type ExerciseDbEntry } from "./exerciseDb";
import ExerciseAnimation from "./ExerciseAnimation";
import { EXERCISE_GIF_MAP } from "./exerciseDbApi";

// ── ExerciseDB API types ──
interface EdbExercise {
  exerciseId: string; name: string; gifUrl: string;
  targetMuscles: string[]; bodyParts: string[]; equipments: string[];
  secondaryMuscles: string[]; instructions: string[];
}
const EDB_API = "https://exercisedb.dev/api/v1";
const EDB_BODY_PARTS = ["chest","back","shoulders","upper arms","lower arms","upper legs","lower legs","waist","cardio","neck"];

// ── Context ──
interface AppCtx {
  profileId: string;
  data: ProfileData;
  setData: (d: ProfileData) => void;
  save: (d: ProfileData) => void;
}
const AppContext = createContext<AppCtx>(null!);
function useApp() { return useContext(AppContext); }

// ── Muscle colors ──
const muscleColors: Record<string, string> = {
  Petto: "bg-red-500/15 text-red-400 border-red-500/30",
  Dorso: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Spalle: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  Bicipiti: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Tricipiti: "bg-pink-500/15 text-pink-400 border-pink-500/30",
  Gambe: "bg-green-500/15 text-green-400 border-green-500/30",
  Core: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Glutei: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  Polpacci: "bg-teal-500/15 text-teal-400 border-teal-500/30",
  Avambracci: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  Braccia: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  Cardio: "bg-lime-500/15 text-lime-400 border-lime-500/30",
  Collo: "bg-stone-500/15 text-stone-400 border-stone-500/30",
};
const bodyPartLabels: Record<string, string> = {
  chest: "Petto", back: "Dorso", shoulders: "Spalle", "upper arms": "Braccia",
  "lower arms": "Avambracci", "upper legs": "Gambe", "lower legs": "Polpacci",
  waist: "Core", cardio: "Cardio", neck: "Collo",
};

// ══════════════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════════════
export default function App() {
  const [activeProfileId, setActiveProfile] = useState<string | null>(() => {
    migrateOldData();
    return getActiveProfileId();
  });
  const [profiles, setProfilesState] = useState<Profile[]>(() => getProfiles());
  const [profileData, setProfileData] = useState<ProfileData>(emptyProfileData);

  useEffect(() => {
    if (activeProfileId) {
      setProfileData(loadProfileData(activeProfileId));
    }
  }, [activeProfileId]);

  const save = useCallback((d: ProfileData) => {
    if (activeProfileId) {
      saveProfileData(activeProfileId, d);
      setProfileData(d);
    }
  }, [activeProfileId]);

  const handleSelectProfile = (id: string) => {
    setActiveProfileId(id);
    setActiveProfile(id);
  };

  const handleLogout = () => {
    setActiveProfileId(null);
    setActiveProfile(null);
  };

  const handleUpdatePhoto = async (profileId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const resized = await resizeImage(reader.result as string, 200);
      updateProfilePhoto(profileId, resized);
      setProfilesState(getProfiles());
    };
    reader.readAsDataURL(file);
  };

  if (!activeProfileId) {
    return <ProfileSelectScreen profiles={profiles} onSelect={handleSelectProfile} onUpdatePhoto={handleUpdatePhoto} />;
  }

  const profile = profiles.find(p => p.id === activeProfileId)!;

  return (
    <AppContext.Provider value={{ profileId: activeProfileId, data: profileData, setData: setProfileData, save }}>
      <MainApp profile={profile} onLogout={handleLogout} />
    </AppContext.Provider>
  );
}

// ══════════════════════════════════════════════════════════
// PROFILE SELECT SCREEN
// ══════════════════════════════════════════════════════════
function ProfileSelectScreen({ profiles, onSelect, onUpdatePhoto }: {
  profiles: Profile[];
  onSelect: (id: string) => void;
  onUpdatePhoto: (id: string, file: File) => void;
}) {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black text-white tracking-tight mb-1">🏋️ GYM TRACKER</h1>
        <p className="text-slate-400 text-sm">Seleziona il tuo profilo</p>
      </div>
      <div className="flex gap-6">
        {profiles.map(p => (
          <div key={p.id} className="flex flex-col items-center gap-3">
            <button
              onClick={() => onSelect(p.id)}
              className="w-32 h-32 rounded-3xl bg-slate-800 border-2 border-slate-700 hover:border-indigo-500 transition-all overflow-hidden flex items-center justify-center shadow-xl hover:shadow-indigo-500/20 hover:scale-105 active:scale-95"
            >
              {p.photoDataUrl ? (
                <img src={p.photoDataUrl} alt={p.displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl font-black text-slate-500">{p.displayName[0]}</span>
              )}
            </button>
            <span className="text-white font-bold text-lg">{p.displayName}</span>
            <label className="text-[10px] text-indigo-400 cursor-pointer hover:text-indigo-300">
              Cambia foto
              <input type="file" accept="image/*" className="hidden"
                onChange={e => { if (e.target.files?.[0]) onUpdatePhoto(p.id, e.target.files[0]); }} />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// MAIN APP (after profile selected)
// ══════════════════════════════════════════════════════════
type View = "dashboard" | "plans" | "plan-editor" | "workout" | "catalog" | "history" | "changelog" | "cycle";

function MainApp({ profile, onLogout }: { profile: Profile; onLogout: () => void }) {
  const { data } = useApp();
  const [view, setView] = useState<View>("dashboard");
  const [editPlanId, setEditPlanId] = useState<string | null>(null);
  const [workoutWeekIdx, setWorkoutWeekIdx] = useState(0);
  const [workoutDayIdx, setWorkoutDayIdx] = useState(0);

  const activePlan = data.plans.find(p => p.id === data.activePlanId) || null;

  const goToWorkout = (wIdx: number, dIdx: number) => {
    setWorkoutWeekIdx(wIdx);
    setWorkoutDayIdx(dIdx);
    setView("workout");
  };

  const goToEditPlan = (planId: string) => {
    setEditPlanId(planId);
    setView("plan-editor");
  };

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <button onClick={onLogout} className="w-8 h-8 rounded-full overflow-hidden border border-slate-600 hover:border-indigo-500 transition-colors">
                {profile.photoDataUrl ? (
                  <img src={profile.photoDataUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="flex items-center justify-center text-xs font-bold text-slate-400 bg-slate-800 w-full h-full">{profile.displayName[0]}</span>
                )}
              </button>
              <h1 className="text-lg font-bold text-white">GYM TRACKER</h1>
            </div>
            {activePlan && <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-1 rounded-full">{activePlan.name}</span>}
          </div>
          {/* Navigation */}
          <div className="flex gap-1">
            {(["dashboard", "plans", "history", "changelog"] as View[]).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${view === v ? "bg-indigo-500 text-white" : "text-slate-400 hover:text-white"}`}>
                {v === "dashboard" ? "🏠 Home" : v === "plans" ? "📋 Schede" : v === "history" ? "📊 Storico" : "📝 Log"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-4">
        {view === "dashboard" && <DashboardView activePlan={activePlan} onGoToWorkout={goToWorkout} onGoToPlans={() => setView("plans")} onGoToCycle={() => setView("cycle")} />}
        {view === "plans" && <PlansView onEdit={goToEditPlan} onGoToDashboard={() => setView("dashboard")} />}
        {view === "plan-editor" && editPlanId && <PlanEditorView planId={editPlanId} onBack={() => setView("plans")} />}
        {view === "workout" && activePlan && <WorkoutViewNew plan={activePlan} weekIdx={workoutWeekIdx} dayIdx={workoutDayIdx} onDone={() => setView("dashboard")} />}
        {view === "catalog" && <CatalogViewNew onBack={() => setView(editPlanId ? "plan-editor" : "workout")} targetPlanId={editPlanId || data.activePlanId} targetWeekIdx={workoutWeekIdx} targetDayIdx={workoutDayIdx} />}
        {view === "history" && <HistoryView />}
        {view === "changelog" && <ChangeLogView />}
        {view === "cycle" && activePlan && <CycleOverview plan={activePlan} onGoToWorkout={goToWorkout} />}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// DASHBOARD — Next step, cycle progress
// ══════════════════════════════════════════════════════════
function DashboardView({ activePlan, onGoToWorkout, onGoToPlans, onGoToCycle }: {
  activePlan: WorkoutPlan | null;
  onGoToWorkout: (w: number, d: number) => void;
  onGoToPlans: () => void;
  onGoToCycle: () => void;
}) {
  const { data, save } = useApp();
  const [showCycleComplete, setShowCycleComplete] = useState(false);

  if (!activePlan) {
    return (
      <div className="text-center py-16">
        <p className="text-6xl mb-4">🏋️</p>
        <h2 className="text-xl font-bold text-white mb-2">Nessuna scheda attiva</h2>
        <p className="text-sm text-slate-400 mb-6">Crea una nuova scheda o selezionane una esistente</p>
        <button onClick={onGoToPlans} className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-400 transition-all">
          Vai alle Schede
        </button>
      </div>
    );
  }

  // Find next step
  const cp = data.cycleProgress;
  let nextWeekIdx = 0, nextDayIdx = 0;
  let cycleComplete = false;

  if (cp && cp.planId === activePlan.id) {
    let found = false;
    for (let w = 0; w < cp.weekProgress.length && !found; w++) {
      for (let d = 0; d < cp.weekProgress[w].dayProgress.length && !found; d++) {
        if (!cp.weekProgress[w].dayProgress[d].completed) {
          nextWeekIdx = w;
          nextDayIdx = d;
          found = true;
        }
      }
    }
    if (!found) cycleComplete = true;
  }

  // Start new cycle
  const startCycle = () => {
    const wp: WeekProgress[] = activePlan.weeks.map(w => ({
      weekId: w.id,
      dayProgress: w.days.map(d => ({ dayId: d.id, completed: false, sessionId: null })),
    }));
    const newCp: CycleProgress = {
      planId: activePlan.id,
      cycleNumber: cp ? cp.cycleNumber + 1 : 1,
      startedAt: new Date().toISOString(),
      completedAt: null,
      weekProgress: wp,
    };
    const newHistory = cp && cp.completedAt ? [...data.cycleHistory, cp] : data.cycleHistory;
    save({ ...data, cycleProgress: newCp, cycleHistory: newHistory });
    setShowCycleComplete(false);
  };

  // Count progress
  let totalDays = 0, completedDays = 0;
  if (cp && cp.planId === activePlan.id) {
    cp.weekProgress.forEach(w => w.dayProgress.forEach(d => { totalDays++; if (d.completed) completedDays++; }));
  }

  const nextWeek = activePlan.weeks[nextWeekIdx];
  const nextDay = nextWeek?.days[nextDayIdx];

  return (
    <>
      {/* Cycle complete modal */}
      {(cycleComplete || showCycleComplete) && (
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6 mb-4 text-center">
          <p className="text-4xl mb-2">🎉</p>
          <h2 className="text-xl font-bold text-white mb-1">Ciclo completato!</h2>
          <p className="text-sm text-slate-300 mb-4">
            Hai completato {completedDays} giorni di allenamento. Vuoi ricominciare un nuovo ciclo?
          </p>
          <button onClick={startCycle} className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-400 transition-all">
            🔄 Nuovo Ciclo
          </button>
        </div>
      )}

      {/* Progress card */}
      {cp && cp.planId === activePlan.id && totalDays > 0 && !cycleComplete && (
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/50 p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-white">Ciclo #{cp.cycleNumber}</span>
            <button onClick={onGoToCycle} className="text-xs text-indigo-400 hover:text-indigo-300">Vedi tutto →</button>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 bg-slate-700 rounded-full h-3">
              <div className="bg-indigo-500 h-3 rounded-full transition-all" style={{ width: `${(completedDays / totalDays) * 100}%` }} />
            </div>
            <span className="text-xs text-slate-400 font-mono">{completedDays}/{totalDays}</span>
          </div>
          {/* Week pills */}
          <div className="flex gap-1 flex-wrap">
            {cp.weekProgress.map((w, wi) => {
              const done = w.dayProgress.every(d => d.completed);
              const partial = w.dayProgress.some(d => d.completed);
              return (
                <span key={w.weekId} className={`text-[10px] px-2 py-0.5 rounded-full ${done ? "bg-green-500/20 text-green-400" : partial ? "bg-yellow-500/20 text-yellow-400" : "bg-slate-700 text-slate-500"}`}>
                  S{wi + 1} {done ? "✓" : ""}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* No cycle started */}
      {(!cp || cp.planId !== activePlan.id) && (
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700/50 p-6 mb-4 text-center">
          <h3 className="text-white font-bold mb-2">Inizia il ciclo di "{activePlan.name}"</h3>
          <p className="text-xs text-slate-400 mb-4">{activePlan.weeks.length} settimane, {activePlan.weeks.reduce((s, w) => s + w.days.length, 0)} giorni totali</p>
          <button onClick={startCycle} className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-400">
            ▶️ Inizia Ciclo
          </button>
        </div>
      )}

      {/* Next workout card */}
      {nextDay && !cycleComplete && cp && cp.planId === activePlan.id && (
        <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/30 rounded-2xl p-4 mb-4">
          <p className="text-[10px] text-indigo-400 uppercase tracking-wider mb-1 font-semibold">Prossimo allenamento</p>
          <h3 className="text-lg font-bold text-white">{nextDay.name}</h3>
          <p className="text-sm text-indigo-300 mb-1">{nextDay.title}</p>
          <p className="text-xs text-slate-400 mb-3">{nextWeek.label} · {nextDay.exercises.length} esercizi</p>
          <button onClick={() => onGoToWorkout(nextWeekIdx, nextDayIdx)}
            className="w-full py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-400 transition-all active:scale-[0.98]">
            Inizia Allenamento
          </button>
        </div>
      )}

      {/* Quick access to all days */}
      <h3 className="text-sm font-semibold text-slate-400 mb-2">Tutti i giorni</h3>
      <div className="space-y-2">
        {activePlan.weeks.map((week, wi) => (
          <div key={week.id}>
            <p className="text-xs text-slate-500 font-semibold mb-1">{week.label}</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {week.days.map((day, di) => {
                const dp = cp?.weekProgress[wi]?.dayProgress[di];
                const done = dp?.completed ?? false;
                return (
                  <button key={day.id} onClick={() => onGoToWorkout(wi, di)}
                    className={`p-3 rounded-xl border text-left transition-all ${done ? "bg-green-500/10 border-green-500/30" : "bg-slate-800/80 border-slate-700/50 hover:border-indigo-500/50"}`}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-semibold text-white">{day.name}</span>
                      {done && <span className="text-green-400 text-xs">✓</span>}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{day.title}</p>
                    <p className="text-[10px] text-slate-500">{day.exercises.length} esercizi</p>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ══════════════════════════════════════════════════════════
// PLANS LIST
// ══════════════════════════════════════════════════════════
function PlansView({ onEdit, onGoToDashboard }: { onEdit: (id: string) => void; onGoToDashboard: () => void }) {
  const { data, save } = useApp();
  const [newName, setNewName] = useState("");

  const createPlan = () => {
    if (!newName.trim()) return;
    const plan: WorkoutPlan = {
      id: `plan-${Date.now()}`,
      name: newName.trim(),
      createdAt: new Date().toISOString(),
      weeks: [{ id: `w-${Date.now()}`, label: "Settimana 1", days: [] }],
    };
    save({ ...data, plans: [...data.plans, plan] });
    setNewName("");
    onEdit(plan.id);
  };

  const deletePlan = (id: string) => {
    if (!confirm("Eliminare questa scheda?")) return;
    const newPlans = data.plans.filter(p => p.id !== id);
    const newActivePlanId = data.activePlanId === id ? null : data.activePlanId;
    const newCp = data.cycleProgress?.planId === id ? null : data.cycleProgress;
    save({ ...data, plans: newPlans, activePlanId: newActivePlanId, cycleProgress: newCp });
  };

  const setActive = (id: string) => {
    save({ ...data, activePlanId: id });
    onGoToDashboard();
  };

  return (
    <>
      <h2 className="text-lg font-bold text-white mb-4">Le tue Schede</h2>

      {/* Create new */}
      <div className="flex gap-2 mb-4">
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nome nuova scheda..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
          onKeyDown={e => e.key === "Enter" && createPlan()} />
        <button onClick={createPlan} className="px-4 py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-indigo-400 text-sm">+ Crea</button>
      </div>

      {data.plans.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">Nessuna scheda creata. Crea la tua prima scheda!</p>
      ) : (
        <div className="space-y-3">
          {data.plans.map(plan => {
            const isActive = data.activePlanId === plan.id;
            const totalDays = plan.weeks.reduce((s, w) => s + w.days.length, 0);
            const totalEx = plan.weeks.reduce((s, w) => s + w.days.reduce((s2, d) => s2 + d.exercises.length, 0), 0);
            return (
              <div key={plan.id} className={`rounded-2xl border p-4 ${isActive ? "bg-indigo-500/10 border-indigo-500/30" : "bg-slate-800/80 border-slate-700/50"}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-bold text-white">{plan.name}</h3>
                      {isActive && <span className="text-[10px] px-2 py-0.5 bg-indigo-500/30 text-indigo-300 rounded-full">ATTIVA</span>}
                    </div>
                    <p className="text-xs text-slate-400">{plan.weeks.length} settimane · {totalDays} giorni · {totalEx} esercizi</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => onEdit(plan.id)} className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-600">✏️ Modifica</button>
                  {!isActive && <button onClick={() => setActive(plan.id)} className="px-3 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-medium hover:bg-indigo-500/30">▶️ Attiva</button>}
                  <button onClick={() => deletePlan(plan.id)} className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/20 ml-auto">🗑</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════
// PLAN EDITOR — add/remove weeks, days, exercises
// ══════════════════════════════════════════════════════════
function PlanEditorView({ planId, onBack }: { planId: string; onBack: () => void }) {
  const { data, save } = useApp();
  const plan = data.plans.find(p => p.id === planId);
  if (!plan) return <p className="text-red-400">Scheda non trovata</p>;

  const updatePlan = (updated: WorkoutPlan) => {
    save({ ...data, plans: data.plans.map(p => p.id === planId ? updated : p) });
  };

  const addWeek = () => {
    const newWeek: PlanWeek = { id: `w-${Date.now()}`, label: `Settimana ${plan.weeks.length + 1}`, days: [] };
    updatePlan({ ...plan, weeks: [...plan.weeks, newWeek] });
  };

  const removeWeek = (wIdx: number) => {
    if (!confirm("Eliminare questa settimana?")) return;
    updatePlan({ ...plan, weeks: plan.weeks.filter((_, i) => i !== wIdx) });
  };

  const duplicateWeek = (wIdx: number) => {
    const src = plan.weeks[wIdx];
    const copy: PlanWeek = {
      id: `w-${Date.now()}`,
      label: `${src.label} (copia)`,
      days: src.days.map(d => ({ ...d, id: `d-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, exercises: d.exercises.map(e => ({ ...e, id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` })) })),
    };
    const weeks = [...plan.weeks];
    weeks.splice(wIdx + 1, 0, copy);
    updatePlan({ ...plan, weeks });
  };

  const updateWeekLabel = (wIdx: number, label: string) => {
    const weeks = plan.weeks.map((w, i) => i === wIdx ? { ...w, label } : w);
    updatePlan({ ...plan, weeks });
  };

  const addDay = (wIdx: number) => {
    const days = [...plan.weeks[wIdx].days, { id: `d-${Date.now()}`, name: `Giorno ${plan.weeks[wIdx].days.length + 1}`, title: "Nuovo giorno", exercises: [] }];
    const weeks = plan.weeks.map((w, i) => i === wIdx ? { ...w, days } : w);
    updatePlan({ ...plan, weeks });
  };

  const removeDay = (wIdx: number, dIdx: number) => {
    const days = plan.weeks[wIdx].days.filter((_, i) => i !== dIdx);
    const weeks = plan.weeks.map((w, i) => i === wIdx ? { ...w, days } : w);
    updatePlan({ ...plan, weeks });
  };

  const updateDay = (wIdx: number, dIdx: number, field: "name" | "title", value: string) => {
    const days = plan.weeks[wIdx].days.map((d, i) => i === dIdx ? { ...d, [field]: value } : d);
    const weeks = plan.weeks.map((w, i) => i === wIdx ? { ...w, days } : w);
    updatePlan({ ...plan, weeks });
  };

  const removeExercise = (wIdx: number, dIdx: number, eIdx: number) => {
    const exercises = plan.weeks[wIdx].days[dIdx].exercises.filter((_, i) => i !== eIdx);
    const days = plan.weeks[wIdx].days.map((d, i) => i === dIdx ? { ...d, exercises } : d);
    const weeks = plan.weeks.map((w, i) => i === wIdx ? { ...w, days } : w);
    updatePlan({ ...plan, weeks });
  };

  // State for which day we're adding exercises to
  const [addTarget, setAddTarget] = useState<{ wIdx: number; dIdx: number } | null>(null);
  const [showEdbSearch, setShowEdbSearch] = useState(false);
  const [edbResults, setEdbResults] = useState<EdbExercise[]>([]);
  const [edbLoading, setEdbLoading] = useState(false);
  const [edbQuery, setEdbQuery] = useState("");
  const [edbBodyPart, setEdbBodyPart] = useState("chest");
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchEdb = async (q?: string, bp?: string) => {
    setEdbLoading(true);
    try {
      const url = q && q.length >= 2
        ? `${EDB_API}/exercises/search?q=${encodeURIComponent(q)}&limit=20`
        : `${EDB_API}/bodyparts/${encodeURIComponent(bp || edbBodyPart)}/exercises?limit=20`;
      const res = await fetch(url);
      if (res.ok) { const d = await res.json(); if (d.success) setEdbResults(d.data || []); }
    } catch { /* */ }
    setEdbLoading(false);
  };

  const openAddExercise = (wIdx: number, dIdx: number) => {
    setAddTarget({ wIdx, dIdx });
    setShowEdbSearch(true);
    if (edbResults.length === 0) fetchEdb(undefined, "chest");
  };

  const addExerciseFromEdb = (edbEx: EdbExercise) => {
    if (!addTarget) return;
    const mg = bodyPartLabels[edbEx.bodyParts[0]] || edbEx.bodyParts[0] || "Altro";
    const desc = edbEx.instructions.map(s => s.replace(/^Step:\d+\s*/i, "")).join(" ");
    const newEx: Exercise = {
      id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: edbEx.name,
      sets: 3, reps: "10",
      description: desc || `Target: ${edbEx.targetMuscles.join(", ")}`,
      videoQuery: edbEx.name, muscleGroup: mg, animationType: "press",
    };
    EXERCISE_GIF_MAP[edbEx.name] = edbEx.gifUrl;
    try { const c = JSON.parse(localStorage.getItem("exercisedb-gif-cache") || "{}"); c[edbEx.name] = { url: edbEx.gifUrl, ts: Date.now() }; localStorage.setItem("exercisedb-gif-cache", JSON.stringify(c)); } catch { /* */ }

    const { wIdx, dIdx } = addTarget;
    const exercises = [...plan.weeks[wIdx].days[dIdx].exercises, newEx];
    const days = plan.weeks[wIdx].days.map((d, i) => i === dIdx ? { ...d, exercises } : d);
    const weeks = plan.weeks.map((w, i) => i === wIdx ? { ...w, days } : w);
    updatePlan({ ...plan, weeks });
  };

  const addExerciseFromLocal = (dbEx: ExerciseDbEntry) => {
    if (!addTarget) return;
    const newEx: Exercise = {
      id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: dbEx.name, sets: 3, reps: "10",
      description: dbEx.description, videoQuery: dbEx.nameEn,
      muscleGroup: dbEx.muscleGroup, animationType: dbEx.animationType,
    };
    const { wIdx, dIdx } = addTarget;
    const exercises = [...plan.weeks[wIdx].days[dIdx].exercises, newEx];
    const days = plan.weeks[wIdx].days.map((d, i) => i === dIdx ? { ...d, exercises } : d);
    const weeks = plan.weeks.map((w, i) => i === wIdx ? { ...w, days } : w);
    updatePlan({ ...plan, weeks });
  };

  // Exercise search modal
  if (showEdbSearch && addTarget) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => setShowEdbSearch(false)} className="text-slate-400 hover:text-white text-lg">←</button>
          <h2 className="text-lg font-bold text-white">Aggiungi esercizio</h2>
        </div>
        <p className="text-xs text-slate-400 mb-3">a {plan.weeks[addTarget.wIdx].days[addTarget.dIdx].name}</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-3">
          <button onClick={() => { setEdbQuery(""); fetchEdb(undefined, edbBodyPart); }}
            className="flex-1 py-2 rounded-lg text-xs font-semibold bg-indigo-500 text-white">🌐 ExerciseDB</button>
        </div>

        <input value={edbQuery} onChange={e => { setEdbQuery(e.target.value); clearTimeout(searchTimer.current); if (e.target.value.length >= 2) searchTimer.current = setTimeout(() => fetchEdb(e.target.value), 500); }}
          placeholder="Search exercises..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none mb-3" />

        <div className="flex gap-1.5 flex-wrap mb-3">
          {EDB_BODY_PARTS.map(bp => (
            <button key={bp} onClick={() => { setEdbBodyPart(bp); setEdbQuery(""); fetchEdb(undefined, bp); }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${edbBodyPart === bp && !edbQuery ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400"}`}>
              {bodyPartLabels[bp] || bp}
            </button>
          ))}
        </div>

        {edbLoading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" /></div>
        ) : (
          <div className="space-y-2">
            {edbResults.map(ex => (
              <div key={ex.exerciseId} className="bg-slate-800/80 rounded-xl border border-slate-700/50 p-3 flex items-start gap-3">
                <img src={ex.gifUrl} alt={ex.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white capitalize">{ex.name}</h3>
                  <p className="text-[10px] text-slate-400">{ex.targetMuscles.join(", ")} · {ex.equipments.join(", ")}</p>
                </div>
                <button onClick={() => addExerciseFromEdb(ex)} className="flex-shrink-0 w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-300 hover:bg-indigo-500/30">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Local exercises section */}
        <h3 className="text-sm font-semibold text-slate-400 mt-4 mb-2">📋 Esercizi locali</h3>
        <div className="space-y-2">
          {exerciseDatabase.slice(0, 20).map(ex => (
            <div key={ex.id} className="bg-slate-800/80 rounded-xl border border-slate-700/50 p-3 flex items-center gap-3">
              <ExerciseAnimation animationType={ex.animationType} exerciseName={ex.name} className="w-10 h-10" />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-semibold text-white">{ex.name}</h3>
                <p className="text-[10px] text-slate-500">{ex.muscleGroup}</p>
              </div>
              <button onClick={() => addExerciseFromLocal(ex)} className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-300 text-sm">+</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="text-slate-400 hover:text-white text-lg">←</button>
        <h2 className="text-lg font-bold text-white flex-1">{plan.name}</h2>
      </div>

      {/* Plan name edit */}
      <input value={plan.name} onChange={e => updatePlan({ ...plan, name: e.target.value })}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white mb-4 focus:border-indigo-500 focus:outline-none" />

      {/* Weeks */}
      {plan.weeks.map((week, wIdx) => (
        <div key={week.id} className="mb-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 p-3">
          <div className="flex items-center gap-2 mb-2">
            <input value={week.label} onChange={e => updateWeekLabel(wIdx, e.target.value)}
              className="flex-1 bg-transparent text-sm font-bold text-white focus:outline-none" />
            <button onClick={() => duplicateWeek(wIdx)} className="text-[10px] text-slate-400 hover:text-indigo-400 px-2">📋</button>
            {plan.weeks.length > 1 && <button onClick={() => removeWeek(wIdx)} className="text-[10px] text-red-400 hover:text-red-300 px-2">🗑</button>}
          </div>

          {/* Days */}
          {week.days.map((day, dIdx) => (
            <div key={day.id} className="mb-2 bg-slate-900/50 rounded-xl p-2.5">
              <div className="flex gap-2 mb-1.5">
                <input value={day.name} onChange={e => updateDay(wIdx, dIdx, "name", e.target.value)} placeholder="Nome giorno"
                  className="flex-1 bg-transparent text-xs font-semibold text-white focus:outline-none" />
                <button onClick={() => removeDay(wIdx, dIdx)} className="text-[10px] text-red-400 px-1">✕</button>
              </div>
              <input value={day.title} onChange={e => updateDay(wIdx, dIdx, "title", e.target.value)} placeholder="Descrizione (es. Petto + Core)"
                className="w-full bg-transparent text-[11px] text-slate-400 focus:outline-none mb-1.5" />

              {/* Exercises in day */}
              {day.exercises.map((ex, eIdx) => (
                <div key={ex.id} className="flex items-center gap-2 py-1 border-t border-slate-700/30">
                  <ExerciseAnimation animationType={ex.animationType} exerciseName={ex.name} className="w-8 h-8 flex-shrink-0" />
                  <span className="text-xs text-white flex-1 truncate">{ex.name}</span>
                  <span className="text-[10px] text-slate-500">{ex.sets}x{ex.reps}</span>
                  <button onClick={() => removeExercise(wIdx, dIdx, eIdx)} className="text-[10px] text-red-400 px-1">✕</button>
                </div>
              ))}
              <button onClick={() => openAddExercise(wIdx, dIdx)}
                className="w-full mt-1.5 py-1.5 border border-dashed border-slate-600 rounded-lg text-xs text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50">
                + Aggiungi esercizio
              </button>
            </div>
          ))}
          <button onClick={() => addDay(wIdx)} className="w-full py-2 border border-dashed border-slate-600 rounded-xl text-xs text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50 mt-1">
            + Aggiungi giorno
          </button>
        </div>
      ))}

      <button onClick={addWeek} className="w-full py-3 border border-dashed border-slate-600 rounded-2xl text-sm text-slate-400 hover:text-indigo-400 hover:border-indigo-500/50">
        + Aggiungi settimana
      </button>
    </>
  );
}

// ══════════════════════════════════════════════════════════
// WORKOUT VIEW — Active workout session
// ══════════════════════════════════════════════════════════
function WorkoutViewNew({ plan, weekIdx, dayIdx, onDone }: {
  plan: WorkoutPlan; weekIdx: number; dayIdx: number; onDone: () => void;
}) {
  const { data, save } = useApp();
  const week = plan.weeks[weekIdx];
  const day = week?.days[dayIdx];
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [expandedEx, setExpandedEx] = useState<string | null>(null);
  const [showAnim, setShowAnim] = useState<{ type: string; name: string } | null>(null);
  const startTimeRef = useRef<number>(0);

  if (!day) return <p className="text-red-400">Giorno non trovato</p>;

  const customValues = data.customValues;

  const startWorkout = () => {
    startTimeRef.current = Date.now();
    const session: WorkoutSession = {
      id: `sess-${Date.now()}`, planId: plan.id, weekId: week.id, dayId: day.id,
      date: new Date().toISOString(),
      exercises: day.exercises.map(ex => ({
        exerciseId: ex.id, exerciseName: ex.name,
        sets: Array.from({ length: ex.sets }, () => ({ completed: false, reps: null, weight: null })),
      })),
    };
    setActiveSession(session);
  };

  const toggleSet = (exIdx: number, setIdx: number) => {
    if (!activeSession) return;
    const newSession = { ...activeSession, exercises: activeSession.exercises.map((ex, ei) =>
      ei === exIdx ? { ...ex, sets: ex.sets.map((s, si) => si === setIdx ? { ...s, completed: !s.completed } : s) } : ex
    )};
    setActiveSession(newSession);
  };

  const updateSetValue = (exIdx: number, setIdx: number, field: "reps" | "weight", value: number | null) => {
    if (!activeSession) return;
    const newSession = { ...activeSession, exercises: activeSession.exercises.map((ex, ei) =>
      ei === exIdx ? { ...ex, sets: ex.sets.map((s, si) => si === setIdx ? { ...s, [field]: value } : s) } : ex
    )};
    setActiveSession(newSession);
  };

  const finishWorkout = () => {
    if (!activeSession) return;
    const duration = Math.round((Date.now() - startTimeRef.current) / 60000);
    const finalSession = { ...activeSession, duration };

    // Mark day as completed in cycle progress
    let newCp = data.cycleProgress;
    if (newCp && newCp.planId === plan.id) {
      newCp = { ...newCp, weekProgress: newCp.weekProgress.map((w, wi) =>
        wi === weekIdx ? { ...w, dayProgress: w.dayProgress.map((d, di) =>
          di === dayIdx ? { ...d, completed: true, sessionId: finalSession.id } : d
        )} : w
      )};
      // Check if cycle complete
      const allDone = newCp.weekProgress.every(w => w.dayProgress.every(d => d.completed));
      if (allDone) newCp = { ...newCp, completedAt: new Date().toISOString() };
    }

    save({
      ...data,
      sessions: [...data.sessions, finalSession],
      cycleProgress: newCp,
    });
    setActiveSession(null);
    onDone();
  };

  const updateCustom = (exId: string, field: "reps" | "weight", value: string) => {
    const curr = customValues[exId] || {};
    save({ ...data, customValues: { ...customValues, [exId]: { ...curr, [field]: value } } });
  };

  const completedSets = activeSession?.exercises.reduce((s, e) => s + e.sets.filter(x => x.completed).length, 0) ?? 0;
  const totalSets = activeSession?.exercises.reduce((s, e) => s + e.sets.length, 0) ?? 0;

  // Check if already completed
  const dp = data.cycleProgress?.weekProgress[weekIdx]?.dayProgress[dayIdx];
  const alreadyDone = dp?.completed ?? false;

  return (
    <>
      {/* Fullscreen animation */}
      {showAnim && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4" onClick={() => setShowAnim(null)}>
          <ExerciseAnimation animationType={showAnim.type} exerciseName={showAnim.name} className="w-72 h-72" />
          <p className="text-white text-sm mt-3 font-medium">{showAnim.name}</p>
          <p className="text-slate-400 text-xs mt-1">Tocca per chiudere</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-[10px] text-slate-500">{week.label}</p>
          <h2 className="text-lg font-bold text-white">{day.name}</h2>
          <p className="text-sm text-indigo-400">{day.title}</p>
        </div>
        {alreadyDone && !activeSession && <span className="text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded-full">✓ Completato</span>}
      </div>

      {/* Active workout bar */}
      {activeSession && (
        <div className="mb-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-indigo-300">Allenamento in corso</span>
            <span className="text-xs text-indigo-400 font-mono">{completedSets}/{totalSets}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
            <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${totalSets > 0 ? (completedSets / totalSets) * 100 : 0}%` }} />
          </div>
          <div className="flex gap-2">
            <button onClick={finishWorkout} className="flex-1 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-400">Termina</button>
            <button onClick={() => setActiveSession(null)} className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600">Annulla</button>
          </div>
        </div>
      )}

      {/* Exercises */}
      <div className="space-y-3">
        {day.exercises.map((exercise, exIdx) => {
          const isExp = expandedEx === exercise.id;
          const cv = customValues[exercise.id];
          const colorClass = muscleColors[exercise.muscleGroup] || "bg-slate-500/20 text-slate-300 border-slate-500/30";
          const sessionSets = activeSession?.exercises[exIdx]?.sets;

          return (
            <div key={exercise.id} className="bg-slate-800/80 rounded-2xl border border-slate-700/50 overflow-hidden">
              <button onClick={() => setExpandedEx(isExp ? null : exercise.id)} className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-slate-700/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colorClass}`}>{exercise.muscleGroup}</span>
                  <h3 className="text-sm font-semibold text-white truncate mt-0.5">{exercise.name}</h3>
                  <p className="text-xs text-slate-400">{exercise.sets}x{cv?.reps || exercise.reps}{cv?.weight ? ` @ ${cv.weight}kg` : ""}</p>
                </div>
                {sessionSets && (
                  <div className="flex gap-1">
                    {sessionSets.map((s, i) => (
                      <div key={i} className={`w-3 h-3 rounded-full border ${s.completed ? "bg-green-400 border-green-400" : "border-slate-500"}`} />
                    ))}
                  </div>
                )}
                <svg className={`w-4 h-4 text-slate-500 transition-transform ${isExp ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isExp && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-700/50 pt-3">
                  <div className="flex gap-3">
                    <button onClick={() => setShowAnim({ type: exercise.animationType, name: exercise.name })} className="w-20 h-20 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex-shrink-0">
                      <ExerciseAnimation animationType={exercise.animationType} exerciseName={exercise.name} className="w-full h-full" />
                    </button>
                    <div className="flex-1">
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{exercise.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] text-slate-500 uppercase">Rep</label>
                      <input type="text" value={cv?.reps || ""} onChange={e => updateCustom(exercise.id, "reps", e.target.value)} placeholder={exercise.reps}
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none" />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] text-slate-500 uppercase">Peso (kg)</label>
                      <input type="text" value={cv?.weight || ""} onChange={e => updateCustom(exercise.id, "weight", e.target.value)} placeholder="—"
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none" />
                    </div>
                  </div>
                  {/* Set tracking during workout */}
                  {sessionSets && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-slate-500 uppercase font-semibold">Serie</p>
                      {sessionSets.map((s, si) => (
                        <div key={si} className="flex items-center gap-2">
                          <button onClick={() => toggleSet(exIdx, si)}
                            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all ${s.completed ? "bg-green-500 border-green-500 text-white" : "border-slate-600 text-slate-500 hover:border-green-500/50"}`}>
                            {s.completed ? "✓" : si + 1}
                          </button>
                          <input type="number" placeholder="rep" value={s.reps ?? ""} onChange={e => updateSetValue(exIdx, si, "reps", e.target.value ? Number(e.target.value) : null)}
                            className="w-16 bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none" />
                          <input type="number" placeholder="kg" value={s.weight ?? ""} onChange={e => updateSetValue(exIdx, si, "weight", e.target.value ? Number(e.target.value) : null)}
                            className="w-16 bg-slate-900 border border-slate-600 rounded-lg px-2 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Start workout button */}
      {!activeSession && (
        <button onClick={startWorkout} className="w-full mt-4 py-4 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98]">
          {alreadyDone ? "Ripeti Allenamento" : "Inizia Allenamento"}
        </button>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════
// CATALOG VIEW (standalone, for adding exercises)
// ══════════════════════════════════════════════════════════
function CatalogViewNew({ onBack, targetPlanId, targetWeekIdx, targetDayIdx }: {
  onBack: () => void; targetPlanId: string | null; targetWeekIdx: number; targetDayIdx: number;
}) {
  const { data, save } = useApp();
  const [edbResults, setEdbResults] = useState<EdbExercise[]>([]);
  const [edbLoading, setEdbLoading] = useState(false);
  const [edbSearch, setEdbSearch] = useState("");
  const [edbBodyPart, setEdbBodyPart] = useState("chest");
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchEdb = async (q?: string, bp?: string) => {
    setEdbLoading(true);
    try {
      const url = q && q.length >= 2
        ? `${EDB_API}/exercises/search?q=${encodeURIComponent(q)}&limit=25`
        : `${EDB_API}/bodyparts/${encodeURIComponent(bp || edbBodyPart)}/exercises?limit=25`;
      const res = await fetch(url);
      if (res.ok) { const d = await res.json(); if (d.success) setEdbResults(d.data || []); }
    } catch { /* */ }
    setEdbLoading(false);
  };

  useEffect(() => { fetchEdb(undefined, "chest"); }, []);

  const addExercise = (edbEx: EdbExercise) => {
    if (!targetPlanId) return;
    const plan = data.plans.find(p => p.id === targetPlanId);
    if (!plan) return;
    const mg = bodyPartLabels[edbEx.bodyParts[0]] || edbEx.bodyParts[0] || "Altro";
    const desc = edbEx.instructions.map(s => s.replace(/^Step:\d+\s*/i, "")).join(" ");
    const newEx: Exercise = {
      id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: edbEx.name, sets: 3, reps: "10",
      description: desc, videoQuery: edbEx.name,
      muscleGroup: mg, animationType: "press",
    };
    EXERCISE_GIF_MAP[edbEx.name] = edbEx.gifUrl;
    const weeks = plan.weeks.map((w, wi) => wi === targetWeekIdx ? {
      ...w, days: w.days.map((d, di) => di === targetDayIdx ? { ...d, exercises: [...d.exercises, newEx] } : d)
    } : w);
    save({ ...data, plans: data.plans.map(p => p.id === targetPlanId ? { ...p, weeks } : p) });
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <button onClick={onBack} className="text-slate-400 hover:text-white text-lg">←</button>
        <h2 className="text-lg font-bold text-white">Catalogo ExerciseDB</h2>
      </div>
      <input value={edbSearch} onChange={e => { setEdbSearch(e.target.value); clearTimeout(searchTimer.current); if (e.target.value.length >= 2) searchTimer.current = setTimeout(() => fetchEdb(e.target.value), 500); }}
        placeholder="Search exercises..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none mb-3" />
      <div className="flex gap-1.5 flex-wrap mb-3">
        {EDB_BODY_PARTS.map(bp => (
          <button key={bp} onClick={() => { setEdbBodyPart(bp); setEdbSearch(""); fetchEdb(undefined, bp); }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium ${edbBodyPart === bp && !edbSearch ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400"}`}>
            {bodyPartLabels[bp] || bp}
          </button>
        ))}
      </div>
      {edbLoading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-2">
          {edbResults.map(ex => (
            <div key={ex.exerciseId} className="bg-slate-800/80 rounded-xl border border-slate-700/50 p-3 flex items-start gap-3">
              <img src={ex.gifUrl} alt={ex.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" loading="lazy" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white capitalize">{ex.name}</h3>
                <p className="text-[10px] text-slate-400">🎯 {ex.targetMuscles.join(", ")} · {ex.equipments.join(", ")}</p>
              </div>
              <button onClick={() => addExercise(ex)} className="flex-shrink-0 w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-300 hover:bg-indigo-500/30">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════
// CYCLE OVERVIEW — Visual progress
// ══════════════════════════════════════════════════════════
function CycleOverview({ plan, onGoToWorkout }: { plan: WorkoutPlan; onGoToWorkout: (w: number, d: number) => void }) {
  const { data } = useApp();
  const cp = data.cycleProgress;
  if (!cp || cp.planId !== plan.id) return <p className="text-slate-400 text-center py-8">Nessun ciclo attivo</p>;

  return (
    <>
      <h2 className="text-lg font-bold text-white mb-1">Ciclo #{cp.cycleNumber}</h2>
      <p className="text-xs text-slate-400 mb-4">Iniziato il {new Date(cp.startedAt).toLocaleDateString("it-IT")}</p>
      {plan.weeks.map((week, wi) => {
        const wp = cp.weekProgress[wi];
        if (!wp) return null;
        const allDone = wp.dayProgress.every(d => d.completed);
        return (
          <div key={week.id} className={`mb-3 rounded-2xl border p-3 ${allDone ? "bg-green-500/5 border-green-500/20" : "bg-slate-800/50 border-slate-700/50"}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white">{week.label}</h3>
              {allDone && <span className="text-xs text-green-400">✓ Completata</span>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {week.days.map((day, di) => {
                const dp = wp.dayProgress[di];
                const done = dp?.completed ?? false;
                return (
                  <button key={day.id} onClick={() => onGoToWorkout(wi, di)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${done ? "bg-green-500/10 border-green-500/30" : "bg-slate-900/50 border-slate-700/50 hover:border-indigo-500/50"}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">{day.name}</span>
                      {done ? <span className="text-green-400">✓</span> : <span className="text-slate-600">○</span>}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{day.title}</p>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

// ══════════════════════════════════════════════════════════
// HISTORY VIEW
// ══════════════════════════════════════════════════════════
function HistoryView() {
  const { data, save } = useApp();
  const reversed = [...data.sessions].reverse();
  const totalWorkouts = data.sessions.length;
  const totalVolume = data.sessions.reduce((sum, s) => sum + s.exercises.reduce((eSum, ex) => eSum + ex.sets.reduce((sSum, set) => sSum + (set.completed && set.weight && set.reps ? set.weight * set.reps : 0), 0), 0), 0);

  const deleteSession = (id: string) => {
    if (!confirm("Eliminare questa sessione?")) return;
    save({ ...data, sessions: data.sessions.filter(s => s.id !== id) });
  };

  return (
    <>
      <h2 className="text-lg font-bold text-white mb-4">Storico Allenamenti</h2>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700/50">
          <p className="text-2xl font-bold text-white">{totalWorkouts}</p>
          <p className="text-[10px] text-slate-400 uppercase">Sessioni</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700/50">
          <p className="text-2xl font-bold text-white">{Math.round(totalVolume)}</p>
          <p className="text-[10px] text-slate-400 uppercase">Volume (kg)</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-3 text-center border border-slate-700/50">
          <p className="text-2xl font-bold text-white">{data.sessions.reduce((s, sess) => s + (sess.duration || 0), 0)}</p>
          <p className="text-[10px] text-slate-400 uppercase">Minuti</p>
        </div>
      </div>
      {reversed.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">Nessun allenamento registrato.</p>
      ) : (
        <div className="space-y-3">
          {reversed.map(session => (
            <div key={session.id} className="bg-slate-800/80 rounded-xl border border-slate-700/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-white">
                  {new Date(session.date).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}
                </p>
                <button onClick={() => deleteSession(session.id)} className="text-[10px] text-red-400">🗑</button>
              </div>
              {session.duration && <p className="text-xs text-slate-400 mb-1">{session.duration} minuti</p>}
              <div className="space-y-1">
                {session.exercises.map(ex => (
                  <div key={ex.exerciseId} className="flex items-center gap-2">
                    <span className="text-xs text-white flex-1 truncate">{ex.exerciseName}</span>
                    <div className="flex gap-1">
                      {ex.sets.map((s, i) => (
                        <span key={i} className={`text-[10px] px-1.5 py-0.5 rounded ${s.completed ? "bg-green-500/15 text-green-400" : "bg-slate-700 text-slate-500"}`}>
                          {s.reps ?? "—"}{s.weight ? `@${s.weight}` : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ══════════════════════════════════════════════════════════
// CHANGELOG VIEW
// ══════════════════════════════════════════════════════════
function ChangeLogView() {
  const { data } = useApp();
  return (
    <>
      <h2 className="text-lg font-bold text-white mb-4">Registro Modifiche</h2>
      {data.changeLog.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">Nessuna modifica registrata.</p>
      ) : (
        <div className="space-y-2">
          {data.changeLog.map((entry, i) => (
            <div key={i} className="bg-slate-800/80 rounded-xl border border-slate-700/50 p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${entry.type === "add" ? "bg-green-500/15 text-green-400" : entry.type === "remove" ? "bg-red-500/15 text-red-400" : "bg-yellow-500/15 text-yellow-400"}`}>
                  {entry.type === "add" ? "Aggiunto" : entry.type === "remove" ? "Rimosso" : "Modificato"}
                </span>
                <span className="text-[10px] text-slate-500">{new Date(entry.date).toLocaleDateString("it-IT")}</span>
              </div>
              <p className="text-xs text-white">{entry.exerciseName}</p>
              <p className="text-[10px] text-slate-400">{entry.details}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
