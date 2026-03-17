import { useState, useEffect, useCallback, useRef } from "react";
import { progressionPlan, type Exercise, type Day, type Week, defaultWeekA, defaultWeekB } from "./data";
import { exerciseDatabase, muscleGroups, type ExerciseDbEntry } from "./exerciseDb";
import ExerciseAnimation from "./ExerciseAnimation";

// ── ExerciseDB API types ──
interface EdbExercise {
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  secondaryMuscles: string[];
  instructions: string[];
}

const EDB_API = "https://exercisedb.dev/api/v1";
const EDB_BODY_PARTS = ["chest", "back", "shoulders", "upper arms", "lower arms", "upper legs", "lower legs", "waist", "cardio", "neck"];

// --- Types for tracking ---
interface SetLog {
  completed: boolean;
  reps: number | null;
  weight: number | null;
}

interface ExerciseLog {
  exerciseId: string;
  exerciseName: string;
  sets: SetLog[];
}

interface WorkoutSession {
  id: string;
  weekType: string;
  weekNumber: number;
  dayId: string;
  date: string;
  exercises: ExerciseLog[];
  duration?: number;
}

interface ChangeLogEntry {
  date: string;
  type: "add" | "remove" | "edit";
  weekType: string;
  dayId: string;
  exerciseName: string;
  details: string;
}

// --- LocalStorage helpers ---
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

// --- Muscle group colors ---
const muscleColors: Record<string, string> = {
  Petto: "bg-red-500/20 text-red-300 border-red-500/30",
  Core: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Spalle: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Bicipiti: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Dorso: "bg-green-500/20 text-green-300 border-green-500/30",
  Gambe: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Tricipiti: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Glutei: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  Polpacci: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Avambracci: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  Trapezio: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

type View = "workout" | "catalog" | "history" | "changelog";

// --- Main App ---
export default function App() {
  const [selectedWeek, setSelectedWeek] = useState<"A" | "B">("A");
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [currentWeekNum, setCurrentWeekNum] = useState(() => load("gym-current-week", 1));
  const [sessions, setSessions] = useState<WorkoutSession[]>(() => load("gym-sessions", []));
  const [customValues, setCustomValues] = useState(() => load<Record<string, { reps?: string; weight?: string }>>("gym-custom-values", {}));
  const [activeWorkout, setActiveWorkout] = useState<WorkoutSession | null>(null);
  const [workoutStartTime, setWorkoutStartTime] = useState<number | null>(null);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [showProgressionInfo, setShowProgressionInfo] = useState(false);
  const [view, setView] = useState<View>("workout");
  const [catalogFilter, setCatalogFilter] = useState<string>("Tutti");
  const [catalogSearch, setCatalogSearch] = useState("");
  const [changeLog, setChangeLog] = useState<ChangeLogEntry[]>(() => load("gym-changelog", []));
  const [showAnimation, setShowAnimation] = useState<{ type: string; name: string } | null>(null);

  // Custom weeks (persisted)
  const [weekAData, setWeekAData] = useState<Week>(() => load("gym-week-a", defaultWeekA));
  const [weekBData, setWeekBData] = useState<Week>(() => load("gym-week-b", defaultWeekB));

  const week = selectedWeek === "A" ? weekAData : weekBData;
  const setWeekData = selectedWeek === "A" ? setWeekAData : setWeekBData;
  const day = week.days[selectedDayIdx];
  const progression = progressionPlan[currentWeekNum - 1];

  // Persist all state
  useEffect(() => save("gym-current-week", currentWeekNum), [currentWeekNum]);
  useEffect(() => save("gym-sessions", sessions), [sessions]);
  useEffect(() => save("gym-custom-values", customValues), [customValues]);
  useEffect(() => save("gym-changelog", changeLog), [changeLog]);
  useEffect(() => save("gym-week-a", weekAData), [weekAData]);
  useEffect(() => save("gym-week-b", weekBData), [weekBData]);

  const addChangeLog = useCallback((entry: Omit<ChangeLogEntry, "date">) => {
    setChangeLog((prev) => [{ ...entry, date: new Date().toISOString() }, ...prev]);
  }, []);

  // Add exercise from local catalog
  const addExerciseToPlan = useCallback((dbEntry: ExerciseDbEntry) => {
    const newEx: Exercise = {
      id: `${selectedWeek.toLowerCase()}-${day.id}-custom-${Date.now()}`,
      name: dbEntry.name,
      sets: 3,
      reps: "10",
      description: dbEntry.description,
      videoQuery: `${dbEntry.name} ${dbEntry.nameEn} tutorial`,
      muscleGroup: dbEntry.muscleGroup,
      animationType: dbEntry.animationType,
    };
    setWeekData((prev) => ({
      ...prev,
      days: prev.days.map((d, i) =>
        i === selectedDayIdx ? { ...d, exercises: [...d.exercises, newEx] } : d
      ),
    }));
    addChangeLog({
      type: "add",
      weekType: selectedWeek,
      dayId: day.id,
      exerciseName: dbEntry.name,
      details: `Aggiunto a ${day.name} (Sett. ${selectedWeek})`,
    });
    setView("workout");
  }, [selectedWeek, day, selectedDayIdx, setWeekData, addChangeLog]);

  // Add exercise from ExerciseDB API
  const addEdbExercise = useCallback((edbEx: EdbExercise) => {
    const muscleMap: Record<string, string> = {
      chest: "Petto", back: "Dorso", shoulders: "Spalle", "upper arms": "Braccia",
      "lower arms": "Avambracci", "upper legs": "Gambe", "lower legs": "Polpacci",
      waist: "Core", cardio: "Cardio", neck: "Collo",
    };
    const mg = muscleMap[edbEx.bodyParts[0]] || edbEx.bodyParts[0] || "Altro";
    const desc = edbEx.instructions.map(s => s.replace(/^Step:\d+\s*/i, "")).join(" ");
    const newEx: Exercise = {
      id: `${selectedWeek.toLowerCase()}-${day.id}-edb-${Date.now()}`,
      name: edbEx.name,
      sets: 3,
      reps: "10",
      description: desc || `Target: ${edbEx.targetMuscles.join(", ")}`,
      videoQuery: `${edbEx.name} tutorial`,
      muscleGroup: mg,
      animationType: "press",
    };
    // Save gifUrl in localStorage for this exercise name
    try {
      const cache = JSON.parse(localStorage.getItem("exercisedb-gif-cache") || "{}");
      cache[edbEx.name] = { url: edbEx.gifUrl, ts: Date.now() };
      localStorage.setItem("exercisedb-gif-cache", JSON.stringify(cache));
    } catch { /* */ }
    // Also add to static map at runtime
    import("./exerciseDbApi").then(mod => { mod.EXERCISE_GIF_MAP[edbEx.name] = edbEx.gifUrl; });

    setWeekData((prev) => ({
      ...prev,
      days: prev.days.map((d, i) =>
        i === selectedDayIdx ? { ...d, exercises: [...d.exercises, newEx] } : d
      ),
    }));
    addChangeLog({
      type: "add",
      weekType: selectedWeek,
      dayId: day.id,
      exerciseName: edbEx.name,
      details: `Aggiunto da ExerciseDB a ${day.name} (Sett. ${selectedWeek})`,
    });
    setView("workout");
  }, [selectedWeek, day, selectedDayIdx, setWeekData, addChangeLog]);

  // Remove exercise from current day
  const removeExercise = useCallback((exId: string, exName: string) => {
    if (!confirm(`Rimuovere "${exName}" dal ${day.name}?`)) return;
    setWeekData((prev) => ({
      ...prev,
      days: prev.days.map((d, i) =>
        i === selectedDayIdx ? { ...d, exercises: d.exercises.filter((e) => e.id !== exId) } : d
      ),
    }));
    addChangeLog({
      type: "remove",
      weekType: selectedWeek,
      dayId: day.id,
      exerciseName: exName,
      details: `Rimosso da ${day.name} (Sett. ${selectedWeek})`,
    });
  }, [day, selectedDayIdx, selectedWeek, setWeekData, addChangeLog]);

  // Update exercise sets count
  const updateExerciseSets = useCallback((exId: string, sets: number) => {
    setWeekData((prev) => ({
      ...prev,
      days: prev.days.map((d, i) =>
        i === selectedDayIdx
          ? { ...d, exercises: d.exercises.map((e) => (e.id === exId ? { ...e, sets } : e)) }
          : d
      ),
    }));
  }, [selectedDayIdx, setWeekData]);

  // Start workout
  const startWorkout = useCallback(() => {
    const session: WorkoutSession = {
      id: `session-${Date.now()}`,
      weekType: selectedWeek,
      weekNumber: currentWeekNum,
      dayId: day.id,
      date: new Date().toISOString(),
      exercises: day.exercises.map((ex) => ({
        exerciseId: ex.id,
        exerciseName: ex.name,
        sets: Array.from({ length: ex.sets }, () => ({
          completed: false,
          reps: null,
          weight: null,
        })),
      })),
    };
    setActiveWorkout(session);
    setWorkoutStartTime(Date.now());
  }, [selectedWeek, currentWeekNum, day]);

  const toggleSet = (exIdx: number, setIdx: number) => {
    if (!activeWorkout) return;
    setActiveWorkout((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      next.exercises[exIdx].sets[setIdx].completed = !next.exercises[exIdx].sets[setIdx].completed;
      return next;
    });
  };

  const updateSetValue = (exIdx: number, setIdx: number, field: "reps" | "weight", value: number | null) => {
    if (!activeWorkout) return;
    setActiveWorkout((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      next.exercises[exIdx].sets[setIdx][field] = value;
      return next;
    });
  };

  const finishWorkout = () => {
    if (!activeWorkout) return;
    const duration = workoutStartTime ? Math.round((Date.now() - workoutStartTime) / 1000 / 60) : 0;
    const completed = { ...activeWorkout, duration };
    setSessions((prev) => [...prev, completed]);
    setActiveWorkout(null);
    setWorkoutStartTime(null);
  };

  const cancelWorkout = () => {
    if (confirm("Sei sicuro di voler annullare l'allenamento?")) {
      setActiveWorkout(null);
      setWorkoutStartTime(null);
    }
  };

  const updateCustom = (exerciseId: string, field: "reps" | "weight", value: string) => {
    setCustomValues((prev: Record<string, { reps?: string; weight?: string }>) => ({
      ...prev,
      [exerciseId]: { ...prev[exerciseId], [field]: value },
    }));
  };

  const getLastLog = (exerciseId: string): ExerciseLog | null => {
    for (let i = sessions.length - 1; i >= 0; i--) {
      const found = sessions[i].exercises.find((e) => e.exerciseId === exerciseId);
      if (found) return found;
    }
    return null;
  };

  const completedSets = activeWorkout
    ? activeWorkout.exercises.reduce((sum, ex) => sum + ex.sets.filter((s) => s.completed).length, 0)
    : 0;
  const totalSets = activeWorkout
    ? activeWorkout.exercises.reduce((sum, ex) => sum + ex.sets.length, 0)
    : 0;

  // --- Catalog filtered ---
  const filteredCatalog = exerciseDatabase.filter((ex) => {
    const matchGroup = catalogFilter === "Tutti" || ex.muscleGroup === catalogFilter;
    const matchSearch = !catalogSearch || ex.name.toLowerCase().includes(catalogSearch.toLowerCase()) || ex.nameEn.toLowerCase().includes(catalogSearch.toLowerCase());
    return matchGroup && matchSearch;
  });

  // --- Animation fullscreen modal ---
  const animationModal = showAnimation && (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4" onClick={() => setShowAnimation(null)}>
      <ExerciseAnimation animationType={showAnimation.type} exerciseName={showAnimation.name} className="w-72 h-72" />
      <p className="text-white text-sm mt-3 font-medium">{showAnimation.name}</p>
      <p className="text-slate-400 text-xs mt-1">Tocca per chiudere</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 pb-24">
      {animationModal}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-white tracking-tight">GYM TRACKER</h1>
            <button
              onClick={() => setShowProgressionInfo(!showProgressionInfo)}
              className="text-xs bg-slate-800 px-3 py-1.5 rounded-full border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Sett. {currentWeekNum}/8 &middot; {progression?.phase}
            </button>
          </div>

          {showProgressionInfo && (
            <div className="mb-3 bg-slate-800 rounded-xl p-4 border border-slate-600">
              <h3 className="text-sm font-semibold text-white mb-3">Progressione 8 Settimane</h3>
              <div className="space-y-1.5">
                {progressionPlan.map((p) => (
                  <div key={p.week} className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-lg ${p.week === currentWeekNum ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "text-slate-400"}`}>
                    <span className="font-mono w-6">W{p.week}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${p.phase === "Deload" ? "bg-yellow-500/20 text-yellow-300" : p.phase === "Test" ? "bg-red-500/20 text-red-300" : p.phase === "Intensificazione" ? "bg-purple-500/20 text-purple-300" : "bg-green-500/20 text-green-300"}`}>{p.phase}</span>
                    <span className="flex-1">{p.note}</span>
                    <span className="font-mono">RPE {p.rpe}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={() => setCurrentWeekNum(Math.max(1, currentWeekNum - 1))} className="flex-1 py-2 bg-slate-700 rounded-lg text-sm font-medium hover:bg-slate-600" disabled={currentWeekNum <= 1}>&larr; Precedente</button>
                <button onClick={() => setCurrentWeekNum(Math.min(8, currentWeekNum + 1))} className="flex-1 py-2 bg-slate-700 rounded-lg text-sm font-medium hover:bg-slate-600" disabled={currentWeekNum >= 8}>Successiva &rarr;</button>
              </div>
            </div>
          )}

          {/* Week selector */}
          <div className="flex gap-2 mb-2">
            {(["A", "B"] as const).map((w) => (
              <button key={w} onClick={() => { setSelectedWeek(w); setExpandedExercise(null); }} className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${selectedWeek === w ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/25" : "bg-slate-800 text-slate-400 hover:bg-slate-700"}`}>
                Settimana {w}
              </button>
            ))}
          </div>

          {/* Day selector */}
          <div className="flex gap-1 mb-2">
            {week.days.map((d, i) => (
              <button key={d.id} onClick={() => { setSelectedDayIdx(i); setExpandedExercise(null); }} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${selectedDayIdx === i ? "bg-slate-700 text-white border border-slate-500" : "bg-slate-800/50 text-slate-500 hover:text-slate-300"}`}>
                {d.name.slice(0, 3)}
              </button>
            ))}
          </div>

          {/* View tabs */}
          <div className="flex gap-1">
            {([
              { id: "workout" as View, label: "Scheda" },
              { id: "catalog" as View, label: "Esercizi" },
              { id: "history" as View, label: "Storico" },
              { id: "changelog" as View, label: "Modifiche" },
            ]).map((tab) => (
              <button key={tab.id} onClick={() => setView(tab.id)} className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all ${view === tab.id ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "text-slate-500 hover:text-slate-300"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-4">
        {view === "workout" && (
          <WorkoutView
            day={day}
            activeWorkout={activeWorkout}
            completedSets={completedSets}
            totalSets={totalSets}
            customValues={customValues}
            expandedExercise={expandedExercise}
            onToggleExpand={(id) => setExpandedExercise(expandedExercise === id ? null : id)}
            onUpdateCustom={updateCustom}
            onUpdateSets={updateExerciseSets}
            getLastLog={getLastLog}
            onToggleSet={toggleSet}
            onUpdateSetValue={updateSetValue}
            onStartWorkout={startWorkout}
            onFinishWorkout={finishWorkout}
            onCancelWorkout={cancelWorkout}
            onRemoveExercise={removeExercise}
            onShowAnimation={(type, name) => setShowAnimation({ type, name })}
            onGoToCatalog={() => setView("catalog")}
          />
        )}
        {view === "catalog" && (
          <CatalogView
            filter={catalogFilter}
            onFilterChange={setCatalogFilter}
            search={catalogSearch}
            onSearchChange={setCatalogSearch}
            localExercises={filteredCatalog}
            onAddLocal={addExerciseToPlan}
            onAddEdb={addEdbExercise}
            dayName={day.name}
            weekType={selectedWeek}
            onShowAnimation={(type, name) => setShowAnimation({ type, name })}
          />
        )}
        {view === "history" && (
          <HistoryView sessions={sessions} onDeleteSession={(id) => {
            if (confirm("Eliminare questa sessione?")) {
              setSessions((prev) => prev.filter((s) => s.id !== id));
            }
          }} />
        )}
        {view === "changelog" && (
          <ChangeLogView entries={changeLog} />
        )}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// WORKOUT VIEW
// ═══════════════════════════════════════════════════════════════════════
function WorkoutView({
  day, activeWorkout, completedSets, totalSets, customValues, expandedExercise,
  onToggleExpand, onUpdateCustom, onUpdateSets, getLastLog, onToggleSet, onUpdateSetValue,
  onStartWorkout, onFinishWorkout, onCancelWorkout, onRemoveExercise, onShowAnimation, onGoToCatalog,
}: {
  day: Day;
  activeWorkout: WorkoutSession | null;
  completedSets: number;
  totalSets: number;
  customValues: Record<string, { reps?: string; weight?: string }>;
  expandedExercise: string | null;
  onToggleExpand: (id: string) => void;
  onUpdateCustom: (id: string, field: "reps" | "weight", value: string) => void;
  onUpdateSets: (id: string, sets: number) => void;
  getLastLog: (id: string) => ExerciseLog | null;
  onToggleSet: (exIdx: number, setIdx: number) => void;
  onUpdateSetValue: (exIdx: number, setIdx: number, field: "reps" | "weight", value: number | null) => void;
  onStartWorkout: () => void;
  onFinishWorkout: () => void;
  onCancelWorkout: () => void;
  onRemoveExercise: (id: string, name: string) => void;
  onShowAnimation: (type: string, name: string) => void;
  onGoToCatalog: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">{day.name}</h2>
          <p className="text-sm text-indigo-400 font-medium">{day.title}</p>
        </div>
      </div>

      {activeWorkout && (
        <div className="mb-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-indigo-300">Allenamento in corso</span>
            <span className="text-xs text-indigo-400 font-mono">{completedSets}/{totalSets} serie</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
            <div className="bg-indigo-500 h-2 rounded-full transition-all duration-300" style={{ width: `${totalSets > 0 ? (completedSets / totalSets) * 100 : 0}%` }} />
          </div>
          <div className="flex gap-2">
            <button onClick={onFinishWorkout} className="flex-1 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-400">Termina</button>
            <button onClick={onCancelWorkout} className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg text-sm hover:bg-slate-600">Annulla</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {day.exercises.map((exercise, exIdx) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            exIdx={exIdx}
            isExpanded={expandedExercise === exercise.id}
            onToggleExpand={() => onToggleExpand(exercise.id)}
            customValues={customValues[exercise.id]}
            onUpdateCustom={(field, value) => onUpdateCustom(exercise.id, field, value)}
            onUpdateSets={(sets) => onUpdateSets(exercise.id, sets)}
            lastLog={getLastLog(exercise.id)}
            activeWorkout={activeWorkout}
            onToggleSet={(setIdx) => onToggleSet(exIdx, setIdx)}
            onUpdateSetValue={(setIdx, field, value) => onUpdateSetValue(exIdx, setIdx, field, value)}
            onRemove={() => onRemoveExercise(exercise.id, exercise.name)}
            onShowAnimation={() => onShowAnimation(exercise.animationType, exercise.name)}
          />
        ))}
      </div>

      <div className="flex gap-2 mt-6">
        {!activeWorkout && (
          <button onClick={onStartWorkout} className="flex-1 py-4 bg-indigo-500 hover:bg-indigo-400 text-white rounded-2xl text-base font-bold shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98]">
            Inizia Allenamento
          </button>
        )}
        <button onClick={onGoToCatalog} className="py-4 px-5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-sm font-semibold border border-slate-700 transition-all">
          + Esercizio
        </button>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// EXERCISE CARD
// ═══════════════════════════════════════════════════════════════════════
function ExerciseCard({
  exercise, exIdx, isExpanded, onToggleExpand, customValues, onUpdateCustom, onUpdateSets,
  lastLog, activeWorkout, onToggleSet, onUpdateSetValue, onRemove, onShowAnimation,
}: {
  exercise: Exercise;
  exIdx: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  customValues?: { reps?: string; weight?: string };
  onUpdateCustom: (field: "reps" | "weight", value: string) => void;
  onUpdateSets: (sets: number) => void;
  lastLog: ExerciseLog | null;
  activeWorkout: WorkoutSession | null;
  onToggleSet: (setIdx: number) => void;
  onUpdateSetValue: (setIdx: number, field: "reps" | "weight", value: number | null) => void;
  onRemove: () => void;
  onShowAnimation: () => void;
}) {
  const colorClass = muscleColors[exercise.muscleGroup] || "bg-slate-500/20 text-slate-300 border-slate-500/30";
  const workoutSets = activeWorkout?.exercises[exIdx]?.sets;

  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700/50 overflow-hidden">
      <button onClick={onToggleExpand} className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-slate-700/30 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colorClass}`}>{exercise.muscleGroup}</span>
          </div>
          <h3 className="text-sm font-semibold text-white truncate">{exercise.name}</h3>
          <p className="text-xs text-slate-400">
            {exercise.sets}x{customValues?.reps || exercise.reps}
            {customValues?.weight ? ` @ ${customValues.weight}kg` : ""}
          </p>
        </div>
        {workoutSets && (
          <div className="flex gap-1">
            {workoutSets.map((s, i) => (
              <div key={i} className={`w-3 h-3 rounded-full border transition-colors ${s.completed ? "bg-green-400 border-green-400" : "bg-transparent border-slate-500"}`} />
            ))}
          </div>
        )}
        <svg className={`w-4 h-4 text-slate-500 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-slate-700/50 pt-3">
          {/* Animation preview */}
          <div className="flex gap-3">
            <button onClick={onShowAnimation} className="w-24 h-24 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-center hover:border-indigo-500/50 transition-colors flex-shrink-0 overflow-hidden">
              <ExerciseAnimation animationType={exercise.animationType} exerciseName={exercise.name} className="w-20 h-20" />
            </button>
            <div className="flex-1">
              <p className="text-xs text-slate-400 leading-relaxed mb-2">{exercise.description}</p>
              <button onClick={onShowAnimation} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium">
                Tocca per ingrandire il tutorial
              </button>
            </div>
          </div>

          {/* Custom reps/weight/sets */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Rep</label>
              <input type="text" value={customValues?.reps || ""} onChange={(e) => onUpdateCustom("reps", e.target.value)} placeholder={exercise.reps}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none" />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Peso (kg)</label>
              <input type="text" value={customValues?.weight || ""} onChange={(e) => onUpdateCustom("weight", e.target.value)} placeholder="—"
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none" />
            </div>
            <div className="w-20">
              <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Serie</label>
              <div className="flex items-center gap-1">
                <button onClick={() => onUpdateSets(Math.max(1, exercise.sets - 1))} className="w-8 h-9 bg-slate-900 border border-slate-600 rounded-lg text-slate-400 hover:text-white text-sm">-</button>
                <span className="text-sm text-white font-mono w-5 text-center">{exercise.sets}</span>
                <button onClick={() => onUpdateSets(exercise.sets + 1)} className="w-8 h-9 bg-slate-900 border border-slate-600 rounded-lg text-slate-400 hover:text-white text-sm">+</button>
              </div>
            </div>
          </div>

          {/* Last session */}
          {lastLog && (
            <div className="bg-slate-900/50 rounded-lg p-2.5">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">Ultima sessione</p>
              <div className="flex gap-1.5 flex-wrap">
                {lastLog.sets.map((s, i) => (
                  <span key={i} className={`text-xs px-2 py-1 rounded ${s.completed ? "bg-green-500/15 text-green-400" : "bg-slate-800 text-slate-500"}`}>
                    S{i + 1}: {s.reps ?? "—"}rep {s.weight ? `@ ${s.weight}kg` : ""}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Workout tracking */}
          {workoutSets && (
            <div className="space-y-2">
              <p className="text-[10px] text-indigo-400 uppercase tracking-wider font-semibold">Tracking serie</p>
              {workoutSets.map((set, setIdx) => (
                <div key={setIdx} className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${set.completed ? "bg-green-500/10 border border-green-500/20" : "bg-slate-900/50"}`}>
                  <button onClick={() => onToggleSet(setIdx)} className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${set.completed ? "bg-green-500 text-white" : "bg-slate-700 text-slate-400 hover:bg-slate-600"}`}>
                    {set.completed ? "\u2713" : setIdx + 1}
                  </button>
                  <input type="number" placeholder="Rep" value={set.reps ?? ""} onChange={(e) => onUpdateSetValue(setIdx, "reps", e.target.value ? Number(e.target.value) : null)}
                    className="w-16 bg-slate-800 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-white text-center focus:border-indigo-500 focus:outline-none" />
                  <span className="text-xs text-slate-500">rep</span>
                  <input type="number" placeholder="Kg" value={set.weight ?? ""} onChange={(e) => onUpdateSetValue(setIdx, "weight", e.target.value ? Number(e.target.value) : null)}
                    className="w-16 bg-slate-800 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-white text-center focus:border-indigo-500 focus:outline-none" />
                  <span className="text-xs text-slate-500">kg</span>
                </div>
              ))}
            </div>
          )}

          {/* Remove button */}
          {!activeWorkout && (
            <button onClick={onRemove} className="w-full py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
              Rimuovi esercizio
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CATALOG VIEW — ExerciseDB API + Local fallback
// ═══════════════════════════════════════════════════════════════════════
function CatalogView({
  filter, onFilterChange, search, onSearchChange, localExercises, onAddLocal, onAddEdb, dayName, weekType, onShowAnimation,
}: {
  filter: string;
  onFilterChange: (f: string) => void;
  search: string;
  onSearchChange: (s: string) => void;
  localExercises: ExerciseDbEntry[];
  onAddLocal: (ex: ExerciseDbEntry) => void;
  onAddEdb: (ex: EdbExercise) => void;
  dayName: string;
  weekType: string;
  onShowAnimation: (type: string, name: string) => void;
}) {
  const [tab, setTab] = useState<"edb" | "local">("edb");
  const [edbResults, setEdbResults] = useState<EdbExercise[]>([]);
  const [edbLoading, setEdbLoading] = useState(false);
  const [edbBodyPart, setEdbBodyPart] = useState("chest");
  const [edbSearch, setEdbSearch] = useState("");
  const [expandedEdb, setExpandedEdb] = useState<string | null>(null);
  const [edbFullscreen, setEdbFullscreen] = useState<EdbExercise | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

  // Fetch exercises from ExerciseDB by body part
  const fetchByBodyPart = useCallback(async (bp: string) => {
    setEdbLoading(true);
    try {
      const res = await fetch(`${EDB_API}/bodyparts/${encodeURIComponent(bp)}/exercises?limit=25`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) setEdbResults(data.data || []);
      }
    } catch { /* */ }
    setEdbLoading(false);
  }, []);

  // Fetch exercises from ExerciseDB by search query
  const fetchBySearch = useCallback(async (q: string) => {
    if (q.length < 2) return;
    setEdbLoading(true);
    try {
      const res = await fetch(`${EDB_API}/exercises/search?q=${encodeURIComponent(q)}&limit=25`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) setEdbResults(data.data || []);
      }
    } catch { /* */ }
    setEdbLoading(false);
  }, []);

  // Load initial body part
  useEffect(() => {
    if (tab === "edb" && edbResults.length === 0) fetchByBodyPart("chest");
  }, [tab]);

  // Debounced search
  useEffect(() => {
    if (tab !== "edb") return;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (edbSearch.length >= 2) {
      searchTimer.current = setTimeout(() => fetchBySearch(edbSearch), 500);
    } else if (edbSearch.length === 0) {
      fetchByBodyPart(edbBodyPart);
    }
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [edbSearch]);

  const bodyPartLabels: Record<string, string> = {
    chest: "Petto", back: "Dorso", shoulders: "Spalle", "upper arms": "Braccia",
    "lower arms": "Avambracci", "upper legs": "Gambe", "lower legs": "Polpacci",
    waist: "Core", cardio: "Cardio", neck: "Collo",
  };

  return (
    <>
      <div className="mb-3">
        <h2 className="text-lg font-bold text-white mb-1">Catalogo Esercizi</h2>
        <p className="text-xs text-slate-400">Aggiungi a {dayName} (Sett. {weekType})</p>
      </div>

      {/* Tabs: ExerciseDB vs Local */}
      <div className="flex gap-2 mb-3">
        <button onClick={() => setTab("edb")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "edb" ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
          🌐 ExerciseDB
        </button>
        <button onClick={() => setTab("local")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${tab === "local" ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
          📋 Locale
        </button>
      </div>

      {/* ─── EXERCISEDB TAB ─── */}
      {tab === "edb" && (
        <>
          {/* Fullscreen GIF modal */}
          {edbFullscreen && (
            <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4" onClick={() => setEdbFullscreen(null)}>
              <img src={edbFullscreen.gifUrl} alt={edbFullscreen.name}
                className="max-w-[320px] max-h-[320px] rounded-xl object-contain" />
              <p className="text-white text-sm mt-3 font-medium capitalize">{edbFullscreen.name}</p>
              <div className="mt-2 flex flex-wrap gap-1 justify-center">
                {edbFullscreen.targetMuscles.map(m => (
                  <span key={m} className="text-[10px] px-2 py-0.5 bg-red-500/20 text-red-300 rounded-full">{m}</span>
                ))}
                {edbFullscreen.secondaryMuscles.map(m => (
                  <span key={m} className="text-[10px] px-2 py-0.5 bg-slate-700 text-slate-300 rounded-full">{m}</span>
                ))}
              </div>
              <p className="text-slate-400 text-xs mt-3">Tocca per chiudere</p>
            </div>
          )}

          {/* Search */}
          <input
            type="text"
            placeholder="Search exercises... (es. bench press, squat, curl)"
            value={edbSearch}
            onChange={(e) => setEdbSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none mb-3"
          />

          {/* Body part filter */}
          <div className="flex gap-1.5 flex-wrap mb-3">
            {EDB_BODY_PARTS.map((bp) => (
              <button key={bp} onClick={() => { setEdbBodyPart(bp); setEdbSearch(""); fetchByBodyPart(bp); }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${edbBodyPart === bp && !edbSearch ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
                {bodyPartLabels[bp] || bp}
              </button>
            ))}
          </div>

          {edbLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <p className="text-xs text-slate-500 mb-2">{edbResults.length} esercizi da ExerciseDB</p>
              <div className="space-y-2">
                {edbResults.map((ex) => {
                  const isExp = expandedEdb === ex.exerciseId;
                  return (
                    <div key={ex.exerciseId} className="bg-slate-800/80 rounded-xl border border-slate-700/50 overflow-hidden">
                      <div className="p-3 flex items-start gap-3">
                        {/* GIF thumbnail */}
                        <button onClick={() => setEdbFullscreen(ex)}
                          className="w-16 h-16 bg-slate-900 rounded-lg border border-slate-700 flex-shrink-0 hover:border-indigo-500/50 overflow-hidden transition-colors">
                          <img src={ex.gifUrl} alt={ex.name} className="w-full h-full object-cover" loading="lazy" />
                        </button>
                        <div className="flex-1 min-w-0" onClick={() => setExpandedEdb(isExp ? null : ex.exerciseId)}>
                          {/* Tags */}
                          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                            {ex.bodyParts.map(bp => (
                              <span key={bp} className="text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-indigo-500/15 text-indigo-300 border-indigo-500/30">{bodyPartLabels[bp] || bp}</span>
                            ))}
                            {ex.equipments.map(eq => (
                              <span key={eq} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">{eq}</span>
                            ))}
                          </div>
                          <h3 className="text-sm font-semibold text-white capitalize">{ex.name}</h3>
                          <div className="flex gap-1 flex-wrap mt-0.5">
                            {ex.targetMuscles.map(m => (
                              <span key={m} className="text-[10px] text-red-400">🎯 {m}</span>
                            ))}
                            {ex.secondaryMuscles.length > 0 && (
                              <span className="text-[10px] text-slate-500">+ {ex.secondaryMuscles.join(", ")}</span>
                            )}
                          </div>
                        </div>
                        {/* Add button */}
                        <button onClick={() => onAddEdb(ex)}
                          className="flex-shrink-0 w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-300 hover:bg-indigo-500/30 transition-colors">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>
                      </div>
                      {/* Expanded: instructions */}
                      {isExp && ex.instructions.length > 0 && (
                        <div className="px-3 pb-3 border-t border-slate-700/50 pt-2">
                          <p className="text-[11px] text-slate-500 uppercase tracking-wider mb-1.5 font-semibold">Instructions</p>
                          <ol className="space-y-1">
                            {ex.instructions.map((step, i) => (
                              <li key={i} className="text-xs text-slate-300 flex gap-2">
                                <span className="text-indigo-400 font-bold flex-shrink-0">{i + 1}.</span>
                                <span>{step.replace(/^Step:\d+\s*/i, "")}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </>
      )}

      {/* ─── LOCAL TAB ─── */}
      {tab === "local" && (
        <>
          <input
            type="text"
            placeholder="Cerca esercizio..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none mb-3"
          />
          <div className="flex gap-1.5 flex-wrap mb-4">
            <button onClick={() => onFilterChange("Tutti")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === "Tutti" ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
              Tutti
            </button>
            {muscleGroups.map((mg) => (
              <button key={mg} onClick={() => onFilterChange(mg)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === mg ? "bg-indigo-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`}>
                {mg}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mb-2">{localExercises.length} esercizi</p>
          <div className="space-y-2">
            {localExercises.map((ex) => {
              const colorClass = muscleColors[ex.muscleGroup] || "bg-slate-500/20 text-slate-300 border-slate-500/30";
              return (
                <div key={ex.id} className="bg-slate-800/80 rounded-xl border border-slate-700/50 p-3">
                  <div className="flex items-start gap-3">
                    <button onClick={() => onShowAnimation(ex.animationType, ex.name)} className="w-14 h-14 bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center flex-shrink-0 hover:border-indigo-500/50 overflow-hidden">
                      <ExerciseAnimation animationType={ex.animationType} exerciseName={ex.name} className="w-12 h-12" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colorClass}`}>{ex.muscleGroup}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${ex.difficulty === "base" ? "bg-green-500/15 text-green-400" : ex.difficulty === "intermedio" ? "bg-yellow-500/15 text-yellow-400" : "bg-red-500/15 text-red-400"}`}>
                          {ex.difficulty}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-white">{ex.name}</h3>
                      <p className="text-[11px] text-slate-500">{ex.nameEn}</p>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{ex.description}</p>
                      {ex.secondaryMuscles.length > 0 && (
                        <p className="text-[10px] text-slate-500 mt-1">Secondari: {ex.secondaryMuscles.join(", ")}</p>
                      )}
                    </div>
                    <button onClick={() => onAddLocal(ex)} className="flex-shrink-0 w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-300 hover:bg-indigo-500/30 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// HISTORY VIEW
// ═══════════════════════════════════════════════════════════════════════
function HistoryView({ sessions, onDeleteSession }: { sessions: WorkoutSession[]; onDeleteSession: (id: string) => void }) {
  const reversed = [...sessions].reverse();
  const totalWorkouts = sessions.length;
  const totalVolume = sessions.reduce((sum, s) => sum + s.exercises.reduce((eSum, ex) => eSum + ex.sets.reduce((sSum, set) => sSum + (set.completed && set.weight && set.reps ? set.weight * set.reps : 0), 0), 0), 0);

  return (
    <>
      <h2 className="text-lg font-bold text-white mb-4">Storico Allenamenti</h2>

      {/* Stats summary */}
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
          <p className="text-2xl font-bold text-white">{sessions.reduce((s, sess) => s + (sess.duration || 0), 0)}</p>
          <p className="text-[10px] text-slate-400 uppercase">Minuti tot.</p>
        </div>
      </div>

      {reversed.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">Nessun allenamento registrato.</p>
      ) : (
        <div className="space-y-3">
          {reversed.map((session) => (
            <div key={session.id} className="bg-slate-800/80 rounded-xl border border-slate-700/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-white">
                    {new Date(session.date).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}
                  </p>
                  <p className="text-xs text-indigo-400">
                    Sett. {session.weekType} &middot; W{session.weekNumber}
                    {session.duration ? ` \u00B7 ${session.duration} min` : ""}
                  </p>
                </div>
                <button onClick={() => onDeleteSession(session.id)} className="text-xs text-slate-600 hover:text-red-400 transition-colors p-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
              {session.exercises.map((exLog, i) => (
                <div key={i} className="mb-1.5 last:mb-0">
                  <p className="text-xs text-slate-300 font-medium">{exLog.exerciseName}</p>
                  <div className="flex gap-1 mt-0.5 flex-wrap">
                    {exLog.sets.map((s, j) => (
                      <span key={j} className={`text-[10px] px-1.5 py-0.5 rounded ${s.completed ? "bg-green-500/15 text-green-400" : "bg-slate-700 text-slate-600"}`}>
                        {s.reps ?? "—"}x{s.weight ?? "—"}kg
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════
// CHANGELOG VIEW
// ═══════════════════════════════════════════════════════════════════════
function ChangeLogView({ entries }: { entries: ChangeLogEntry[] }) {
  return (
    <>
      <h2 className="text-lg font-bold text-white mb-4">Registro Modifiche</h2>
      {entries.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">Nessuna modifica registrata.</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, i) => (
            <div key={i} className="bg-slate-800/80 rounded-xl border border-slate-700/50 p-3 flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                entry.type === "add" ? "bg-green-500/20 text-green-400" :
                entry.type === "remove" ? "bg-red-500/20 text-red-400" :
                "bg-blue-500/20 text-blue-400"
              }`}>
                {entry.type === "add" ? "+" : entry.type === "remove" ? "-" : "~"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium">{entry.exerciseName}</p>
                <p className="text-xs text-slate-400">{entry.details}</p>
                <p className="text-[10px] text-slate-600 mt-1">
                  {new Date(entry.date).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
