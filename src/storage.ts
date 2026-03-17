// ══════════════════════════════════════════════════════════
// STORAGE — Profile-scoped localStorage
// ══════════════════════════════════════════════════════════
import type { Profile, ProfileData, ProfileInfo } from "./types";
import { emptyProfileData, emptyProfileInfo } from "./types";

const PROFILES_KEY = "gym-profiles";
const ACTIVE_KEY = "gym-active-profile";
const DATA_PREFIX = "gym-profile-";

// ── Helpers ──
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

// ── Profiles ──
const defaultProfiles: Profile[] = [
  { id: "richi", displayName: "Richi", photoDataUrl: null, info: emptyProfileInfo },
  { id: "giuli", displayName: "Giuli", photoDataUrl: null, info: emptyProfileInfo },
];

export function getProfiles(): Profile[] {
  const profiles = load<Profile[]>(PROFILES_KEY, defaultProfiles);
  // Ensure all profiles have info field (migration from older format)
  return profiles.map(p => ({ ...p, info: p.info || emptyProfileInfo }));
}

export function saveProfiles(profiles: Profile[]) {
  save(PROFILES_KEY, profiles);
}

export function updateProfilePhoto(profileId: string, dataUrl: string) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx >= 0) {
    profiles[idx].photoDataUrl = dataUrl;
    saveProfiles(profiles);
  }
}

export function updateProfileInfo(profileId: string, info: ProfileInfo) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx >= 0) {
    profiles[idx].info = info;
    saveProfiles(profiles);
  }
}

export function updateProfileName(profileId: string, name: string) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profileId);
  if (idx >= 0) {
    profiles[idx].displayName = name;
    saveProfiles(profiles);
  }
}

// ── Active Profile ──
export function getActiveProfileId(): string | null {
  return load<string | null>(ACTIVE_KEY, null);
}

export function setActiveProfileId(id: string | null) {
  save(ACTIVE_KEY, id);
}

// ── Profile Data ──
export function loadProfileData(profileId: string): ProfileData {
  const data = load<ProfileData>(DATA_PREFIX + profileId, emptyProfileData);
  // Ensure all fields exist (in case of older stored data)
  return {
    ...emptyProfileData,
    ...data,
  };
}

export function saveProfileData(profileId: string, data: ProfileData) {
  save(DATA_PREFIX + profileId, data);
}

// ── Migration from old single-user format ──
export function migrateOldData() {
  // Check if old data exists
  const oldSessions = localStorage.getItem("gym-sessions");
  const oldWeekA = localStorage.getItem("gym-week-a");
  if (!oldSessions && !oldWeekA) return;

  // Ensure profiles exist
  if (!localStorage.getItem(PROFILES_KEY)) {
    saveProfiles(defaultProfiles);
  }

  // Build plan from old week data
  try {
    const weekA = oldWeekA ? JSON.parse(oldWeekA) : null;
    const weekB = localStorage.getItem("gym-week-b") ? JSON.parse(localStorage.getItem("gym-week-b")!) : null;

    const weeks = [];
    if (weekA) {
      weeks.push({
        id: "migrated-a",
        label: "Settimana A",
        days: weekA.days || [],
      });
    }
    if (weekB) {
      weeks.push({
        id: "migrated-b",
        label: "Settimana B",
        days: weekB.days || [],
      });
    }

    const plan = {
      id: "migrated-plan",
      name: "Scheda Originale",
      createdAt: new Date().toISOString(),
      weeks,
    };

    const sessions = oldSessions ? JSON.parse(oldSessions) : [];
    const customValues = localStorage.getItem("gym-custom-values")
      ? JSON.parse(localStorage.getItem("gym-custom-values")!)
      : {};
    const changeLog = localStorage.getItem("gym-changelog")
      ? JSON.parse(localStorage.getItem("gym-changelog")!)
      : [];

    const profileData: ProfileData = {
      activePlanId: plan.id,
      plans: weeks.length > 0 ? [plan] : [],
      sessions,
      cycleProgress: null,
      cycleHistory: [],
      customValues,
      changeLog,
    };

    saveProfileData("richi", profileData);

    // Clean old keys
    ["gym-sessions", "gym-week-a", "gym-week-b", "gym-custom-values",
     "gym-changelog", "gym-current-week", "gym-selected-week",
     "gym-active-workout"].forEach(k => localStorage.removeItem(k));
  } catch {
    // Migration failed, ignore
  }
}

// ── Image resize helper ──
export function resizeImage(dataUrl: string, maxSize: number = 200): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let w = img.width, h = img.height;
      if (w > h) { h = (h / w) * maxSize; w = maxSize; }
      else { w = (w / h) * maxSize; h = maxSize; }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.src = dataUrl;
  });
}
