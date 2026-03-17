/**
 * ExerciseDB API integration
 * Cerca GIF animate di esercizi da exercisedb.dev (open source v1)
 * Cache in localStorage per evitare chiamate ripetute
 */

const API_BASE = "https://exercisedb.dev/api/v1";
const CACHE_KEY = "exercisedb-gif-cache";
const CACHE_TTL = 1000 * 60 * 60 * 24 * 7; // 7 giorni

// ── Mappa statica: nome esercizio italiano → search query inglese + ID noto ──
// Questa mappa copre tutti gli esercizi della scheda + i più comuni del catalogo
export const EXERCISE_GIF_MAP: Record<string, string> = {
  // Scheda workout
  "Panca inclinata manubri": "https://static.exercisedb.dev/media/bfiHMpI.gif",
  "Dip": "https://static.exercisedb.dev/media/9WTm7dq.gif",
  "Croci ai cavi alte": "https://static.exercisedb.dev/media/0CXGHya.gif",
  "Pallof press": "https://static.exercisedb.dev/media/9pa4H5m.gif",
  "Dead bug": "https://static.exercisedb.dev/media/iny3m5y.gif",
  "Shoulder press macchina": "https://static.exercisedb.dev/media/67n3r98.gif",
  "Alzate laterali": "https://static.exercisedb.dev/media/DsgkuIt.gif",
  "Croci inverse": "https://static.exercisedb.dev/media/aqvSOQE.gif",
  "Curl bilanciere": "https://static.exercisedb.dev/media/25GPyDY.gif",
  "Hammer curl": "https://static.exercisedb.dev/media/slDvUAU.gif",
  "Lat machine presa neutra": "https://static.exercisedb.dev/media/0V2YQjW.gif",
  "Rematore con supporto toracico": "https://static.exercisedb.dev/media/hvV79Si.gif",
  "Bulgarian split squat": "https://static.exercisedb.dev/media/W31mMjd.gif",
  "Box jump monopodalico basso": "https://static.exercisedb.dev/media/iPm26QU.gif",
  "Push down corda": "https://static.exercisedb.dev/media/gAwDzB3.gif",
  "Trazioni esplosive": "https://static.exercisedb.dev/media/0V2YQjW.gif",
  "Croci alte": "https://static.exercisedb.dev/media/0CXGHya.gif",
  "Alzate laterali ai cavi": "https://static.exercisedb.dev/media/DsgkuIt.gif",
  "Hanging knee raise": "https://static.exercisedb.dev/media/I3tsCnC.gif",
  "Side plank": "https://static.exercisedb.dev/media/5VXmnV5.gif",
};

// ── Mappa query inglesi per ricerca automatica ──
const SEARCH_QUERIES: Record<string, string> = {
  "Panca inclinata manubri": "dumbbell incline press",
  "Dip": "chest dip",
  "Croci ai cavi alte": "cable crossover",
  "Pallof press": "pallof press",
  "Dead bug": "dead bug",
  "Shoulder press macchina": "lever shoulder press",
  "Alzate laterali": "dumbbell lateral raise",
  "Croci inverse": "cable reverse fly",
  "Curl bilanciere": "barbell curl",
  "Hammer curl": "dumbbell hammer curl",
  "Lat machine presa neutra": "pull up neutral grip",
  "Rematore con supporto toracico": "cable seated row",
  "Bulgarian split squat": "bulgarian split squat",
  "Box jump monopodalico basso": "box jump",
  "Push down corda": "cable triceps pushdown",
  "Trazioni esplosive": "pull up",
  "Croci alte": "cable crossover",
  "Alzate laterali ai cavi": "cable lateral raise",
  "Hanging knee raise": "hanging leg raise",
  "Side plank": "side plank",
};

interface CacheEntry {
  url: string;
  ts: number;
}

function getCache(): Record<string, CacheEntry> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function setCache(key: string, url: string) {
  const cache = getCache();
  cache[key] = { url, ts: Date.now() };
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch { /* storage full */ }
}

/** Restituisce la GIF URL per un esercizio dato il nome.
 *  1. Cerca nella mappa statica
 *  2. Cerca nella cache localStorage
 *  3. Chiama l'API ExerciseDB (con fallback)
 */
export async function getExerciseGif(exerciseName: string): Promise<string> {
  // 1. Mappa statica
  const staticUrl = EXERCISE_GIF_MAP[exerciseName];
  if (staticUrl) return staticUrl;

  // 2. Cache
  const cache = getCache();
  const cached = cache[exerciseName];
  if (cached && (Date.now() - cached.ts < CACHE_TTL)) {
    return cached.url;
  }

  // 3. API search
  const query = SEARCH_QUERIES[exerciseName] || exerciseName;
  try {
    const res = await fetch(
      `${API_BASE}/exercises/search?q=${encodeURIComponent(query)}&limit=1&threshold=0.4`
    );
    if (!res.ok) return "";
    const data = await res.json();
    if (data.success && data.data?.length > 0) {
      const gifUrl = data.data[0].gifUrl || "";
      setCache(exerciseName, gifUrl);
      return gifUrl;
    }
  } catch {
    // network error, silently fail
  }
  setCache(exerciseName, "");
  return "";
}

/** Cerca esercizi sull'API ExerciseDB per il catalogo */
export async function searchExercises(query: string, limit = 10): Promise<Array<{
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  secondaryMuscles: string[];
  instructions: string[];
}>> {
  try {
    const res = await fetch(
      `${API_BASE}/exercises/search?q=${encodeURIComponent(query)}&limit=${limit}&threshold=0.3`
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (data.success) return data.data || [];
  } catch { /* */ }
  return [];
}

/** Cerca esercizi per gruppo muscolare */
export async function getExercisesByMuscle(muscle: string, limit = 10): Promise<Array<{
  exerciseId: string;
  name: string;
  gifUrl: string;
  targetMuscles: string[];
  bodyParts: string[];
  equipments: string[];
  instructions: string[];
}>> {
  try {
    const res = await fetch(
      `${API_BASE}/muscles/${encodeURIComponent(muscle.toLowerCase())}/exercises?limit=${limit}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (data.success) return data.data || [];
  } catch { /* */ }
  return [];
}
