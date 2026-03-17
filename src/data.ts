export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  description: string;
  videoQuery: string;
  muscleGroup: string;
  animationType: string;
}

export interface Day {
  id: string;
  name: string;
  title: string;
  exercises: Exercise[];
}

export interface Week {
  id: string;
  label: string;
  days: Day[];
}

const lunExercises: Exercise[] = [
  {
    id: "lun-1",
    name: "Panca inclinata manubri",
    sets: 4,
    reps: "6-8",
    description: "Schiena aderente alla panca, scapole addotte, controllo eccentrico 3 secondi.",
    videoQuery: "panca inclinata manubri esecuzione corretta",
    muscleGroup: "Petto",
    animationType: "press",
  },
  {
    id: "lun-2",
    name: "Dip",
    sets: 3,
    reps: "8",
    description: "Leggera inclinazione avanti per enfatizzare il petto.",
    videoQuery: "dip chest petto esecuzione",
    muscleGroup: "Petto",
    animationType: "dip",
  },
  {
    id: "lun-3",
    name: "Croci ai cavi alte",
    sets: 3,
    reps: "12",
    description: "Movimento controllato, fermo 1 secondo in chiusura.",
    videoQuery: "croci ai cavi alti cable fly high",
    muscleGroup: "Petto",
    animationType: "fly",
  },
  {
    id: "lun-4",
    name: "Pallof press",
    sets: 3,
    reps: "12/lato",
    description: "Anti-rotazione, core contratto.",
    videoQuery: "pallof press tutorial",
    muscleGroup: "Core",
    animationType: "press",
  },
  {
    id: "lun-5",
    name: "Dead bug",
    sets: 3,
    reps: "10",
    description: "Movimento lento, zona lombare sempre neutra.",
    videoQuery: "dead bug exercise tutorial",
    muscleGroup: "Core",
    animationType: "crunch",
  },
];

const marExercises: Exercise[] = [
  {
    id: "mar-1",
    name: "Shoulder press macchina",
    sets: 4,
    reps: "8",
    description: "Schiena completamente supportata.",
    videoQuery: "shoulder press machine tutorial",
    muscleGroup: "Spalle",
    animationType: "press",
  },
  {
    id: "mar-2",
    name: "Alzate laterali",
    sets: 4,
    reps: "12-15",
    description: "Movimento lento senza slancio.",
    videoQuery: "alzate laterali esecuzione corretta lateral raise",
    muscleGroup: "Spalle",
    animationType: "lateral-raise",
  },
  {
    id: "mar-3",
    name: "Croci inverse",
    sets: 4,
    reps: "15",
    description: "Focus su deltoide posteriore.",
    videoQuery: "croci inverse reverse fly rear delt",
    muscleGroup: "Spalle",
    animationType: "reverse-fly",
  },
  {
    id: "mar-4",
    name: "Curl bilanciere",
    sets: 3,
    reps: "8-10",
    description: "Gomiti fermi.",
    videoQuery: "curl bilanciere bicipiti tecnica",
    muscleGroup: "Bicipiti",
    animationType: "curl",
  },
  {
    id: "mar-5",
    name: "Hammer curl",
    sets: 3,
    reps: "10",
    description: "Controllo completo del movimento.",
    videoQuery: "hammer curl esecuzione tecnica",
    muscleGroup: "Bicipiti",
    animationType: "curl",
  },
];

const gioExercises: Exercise[] = [
  {
    id: "gio-1",
    name: "Lat machine presa neutra",
    sets: 4,
    reps: "8-10",
    description: "Petto aperto, niente slanci.",
    videoQuery: "lat machine presa neutra tutorial",
    muscleGroup: "Dorso",
    animationType: "pull-down",
  },
  {
    id: "gio-2",
    name: "Rematore con supporto toracico",
    sets: 3,
    reps: "10",
    description: "Nessun carico sulla zona lombare.",
    videoQuery: "chest supported row rematore supporto toracico",
    muscleGroup: "Dorso",
    animationType: "row",
  },
  {
    id: "gio-3",
    name: "Bulgarian split squat",
    sets: 3,
    reps: "6/lato",
    description: "Core attivo, busto leggermente inclinato avanti.",
    videoQuery: "bulgarian split squat tutorial tecnica",
    muscleGroup: "Gambe",
    animationType: "lunge",
  },
  {
    id: "gio-4",
    name: "Box jump monopodalico basso",
    sets: 3,
    reps: "4/lato",
    description: "Atterraggio morbido e stabile.",
    videoQuery: "single leg box jump tutorial",
    muscleGroup: "Gambe",
    animationType: "jump",
  },
  {
    id: "gio-5",
    name: "Push down corda",
    sets: 3,
    reps: "12",
    description: "Estensione completa del tricipite.",
    videoQuery: "tricep pushdown rope cable tutorial",
    muscleGroup: "Tricipiti",
    animationType: "pushdown",
  },
];

const venExercises: Exercise[] = [
  {
    id: "ven-1",
    name: "Trazioni esplosive",
    sets: 5,
    reps: "3",
    description: "Movimento rapido verso l'alto, controllo in discesa.",
    videoQuery: "explosive pull ups trazioni esplosive",
    muscleGroup: "Dorso",
    animationType: "pullup",
  },
  {
    id: "ven-2",
    name: "Croci alte",
    sets: 3,
    reps: "12",
    description: "Tensione continua.",
    videoQuery: "high cable fly croci cavi alte",
    muscleGroup: "Petto",
    animationType: "fly",
  },
  {
    id: "ven-3",
    name: "Alzate laterali ai cavi",
    sets: 4,
    reps: "15",
    description: "Movimento fluido.",
    videoQuery: "cable lateral raise alzate laterali cavo",
    muscleGroup: "Spalle",
    animationType: "lateral-raise",
  },
  {
    id: "ven-4",
    name: "Hanging knee raise",
    sets: 3,
    reps: "12",
    description: "Addome attivo, niente oscillazioni.",
    videoQuery: "hanging knee raise tutorial",
    muscleGroup: "Core",
    animationType: "leg-raise",
  },
  {
    id: "ven-5",
    name: "Side plank",
    sets: 3,
    reps: "40s/lato",
    description: "Corpo in linea retta.",
    videoQuery: "side plank tutorial form",
    muscleGroup: "Core",
    animationType: "plank-side",
  },
];

function prefixExercises(exercises: Exercise[], weekPrefix: string): Exercise[] {
  return exercises.map((ex) => ({ ...ex, id: `${weekPrefix}-${ex.id}` }));
}

export const weekA: Week = {
  id: "A",
  label: "Settimana A",
  days: [
    { id: "lun", name: "Lunedì", title: "Petto Forza + Core", exercises: prefixExercises(lunExercises, "a") },
    { id: "mar", name: "Martedì", title: "Spalle + Bicipiti", exercises: prefixExercises(marExercises, "a") },
    { id: "gio", name: "Giovedì", title: "Dorso Safe + Monopodalico", exercises: prefixExercises(gioExercises, "a") },
    { id: "ven", name: "Venerdì", title: "Potenza Sbarra + Petto Metabolico", exercises: prefixExercises(venExercises, "a") },
  ],
};

export const weekB: Week = {
  id: "B",
  label: "Settimana B",
  days: [
    { id: "lun", name: "Lunedì", title: "Petto Forza + Core", exercises: prefixExercises(lunExercises, "b") },
    { id: "mar", name: "Martedì", title: "Spalle + Bicipiti", exercises: prefixExercises(marExercises, "b") },
    { id: "gio", name: "Giovedì", title: "Dorso Safe + Monopodalico", exercises: prefixExercises(gioExercises, "b") },
    { id: "ven", name: "Venerdì", title: "Potenza Sbarra + Petto Metabolico", exercises: prefixExercises(venExercises, "b") },
  ],
};

export const defaultWeekA = structuredClone(weekA);
export const defaultWeekB = structuredClone(weekB);

export const progressionPlan = [
  { week: 1, phase: "Costruzione", rpe: 7, note: "Costruzione tecnica" },
  { week: 2, phase: "Costruzione", rpe: 7, note: "Costruzione tecnica" },
  { week: 3, phase: "Costruzione", rpe: 7, note: "Costruzione tecnica" },
  { week: 4, phase: "Deload", rpe: 5, note: "Volume -30%, Carico -10%" },
  { week: 5, phase: "Intensificazione", rpe: 8, note: "+5% carico esercizi principali" },
  { week: 6, phase: "Intensificazione", rpe: 8, note: "+5% carico esercizi principali" },
  { week: 7, phase: "Intensificazione", rpe: 8, note: "+5% carico esercizi principali" },
  { week: 8, phase: "Test", rpe: 9, note: "Test tecnico - rep massime controllate" },
];
