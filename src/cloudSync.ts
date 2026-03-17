// ══════════════════════════════════════════════════════════
// CLOUD SYNC — Firebase Realtime Database
// ══════════════════════════════════════════════════════════
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getDatabase, ref, set, get, onValue, type Database } from "firebase/database";

const CONFIG_KEY = "macchellis-firebase-config";

// Keys to sync to cloud
const SYNC_KEYS = [
  "gym-profiles",
  "gym-active-profile",
  "gym-profile-richi",
  "gym-profile-giuli",
  "macchellis-settings",
];

let firebaseApp: FirebaseApp | null = null;
let db: Database | null = null;
let listeners: (() => void)[] = [];
let syncEnabled = false;

// ── Config management ──
export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export function getSavedFirebaseConfig(): FirebaseConfig | null {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) {
      const config = JSON.parse(raw);
      if (config.apiKey && config.databaseURL && config.projectId) return config;
    }
  } catch { /* */ }
  return null;
}

export function saveFirebaseConfig(config: FirebaseConfig) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function clearFirebaseConfig() {
  localStorage.removeItem(CONFIG_KEY);
  disconnectSync();
}

export function isSyncEnabled(): boolean {
  return syncEnabled;
}

// ── Initialize Firebase ──
export function initSync(config?: FirebaseConfig): boolean {
  const cfg = config || getSavedFirebaseConfig();
  if (!cfg) return false;

  try {
    if (firebaseApp) {
      // Already initialized
      return true;
    }
    firebaseApp = initializeApp(cfg);
    db = getDatabase(firebaseApp);
    syncEnabled = true;
    return true;
  } catch (e) {
    console.error("Firebase init failed:", e);
    syncEnabled = false;
    return false;
  }
}

// ── Disconnect ──
export function disconnectSync() {
  listeners.forEach(unsub => unsub());
  listeners = [];
  syncEnabled = false;
  firebaseApp = null;
  db = null;
}

// ── Save to cloud ──
export async function saveToCloud(key: string, data: unknown): Promise<boolean> {
  if (!db || !syncEnabled) return false;
  if (!SYNC_KEYS.includes(key)) return false;

  try {
    const dataRef = ref(db, `macchellis/${key}`);
    await set(dataRef, {
      data: JSON.stringify(data),
      updatedAt: Date.now(),
    });
    return true;
  } catch (e) {
    console.error(`Cloud save failed for ${key}:`, e);
    return false;
  }
}

// ── Load from cloud ──
export async function loadFromCloud(key: string): Promise<unknown | null> {
  if (!db || !syncEnabled) return null;

  try {
    const dataRef = ref(db, `macchellis/${key}`);
    const snapshot = await get(dataRef);
    if (snapshot.exists()) {
      const val = snapshot.val();
      return JSON.parse(val.data);
    }
  } catch (e) {
    console.error(`Cloud load failed for ${key}:`, e);
  }
  return null;
}

// ── Push all local data to cloud ──
export async function pushAllToCloud(): Promise<number> {
  if (!db || !syncEnabled) return 0;
  let count = 0;
  for (const key of SYNC_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        const ok = await saveToCloud(key, data);
        if (ok) count++;
      } catch { /* */ }
    }
  }
  return count;
}

// ── Pull all cloud data to local ──
export async function pullAllFromCloud(): Promise<number> {
  if (!db || !syncEnabled) return 0;
  let count = 0;
  for (const key of SYNC_KEYS) {
    const data = await loadFromCloud(key);
    if (data !== null) {
      localStorage.setItem(key, JSON.stringify(data));
      count++;
    }
  }
  return count;
}

// ── Listen for real-time changes ──
export function listenForChanges(onUpdate: (key: string, data: unknown) => void): void {
  if (!db || !syncEnabled) return;

  for (const key of SYNC_KEYS) {
    const dataRef = ref(db, `macchellis/${key}`);
    const unsub = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        try {
          const val = snapshot.val();
          const data = JSON.parse(val.data);
          // Only update if cloud is newer than local
          const localRaw = localStorage.getItem(key);
          if (localRaw !== JSON.stringify(data)) {
            localStorage.setItem(key, JSON.stringify(data));
            onUpdate(key, data);
          }
        } catch { /* */ }
      }
    });
    // onValue returns an unsubscribe function
    listeners.push(unsub);
  }
}

// ── Smart sync: merge local and cloud ──
export async function smartSync(): Promise<{ pulled: number; pushed: number }> {
  if (!db || !syncEnabled) return { pulled: 0, pushed: 0 };

  let pulled = 0, pushed = 0;

  for (const key of SYNC_KEYS) {
    try {
      const dataRef = ref(db, `macchellis/${key}`);
      const snapshot = await get(dataRef);
      const localRaw = localStorage.getItem(key);

      if (snapshot.exists() && localRaw) {
        const cloudVal = snapshot.val();
        const cloudData = JSON.parse(cloudVal.data);
        const localData = JSON.parse(localRaw);
        // If cloud has data and it's different from local, use cloud (it's newer from another device)
        if (JSON.stringify(cloudData) !== JSON.stringify(localData)) {
          // Pull cloud data (prefer cloud for cross-device sync)
          localStorage.setItem(key, JSON.stringify(cloudData));
          pulled++;
        }
      } else if (snapshot.exists() && !localRaw) {
        // Cloud has data, local doesn't — pull
        const cloudVal = snapshot.val();
        const cloudData = JSON.parse(cloudVal.data);
        localStorage.setItem(key, JSON.stringify(cloudData));
        pulled++;
      } else if (!snapshot.exists() && localRaw) {
        // Local has data, cloud doesn't — push
        const localData = JSON.parse(localRaw);
        await saveToCloud(key, localData);
        pushed++;
      }
    } catch { /* */ }
  }

  return { pulled, pushed };
}
