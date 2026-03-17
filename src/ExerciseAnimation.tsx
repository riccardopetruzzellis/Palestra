import { useMemo, useState, useEffect } from "react";
import { getExerciseGif, EXERCISE_GIF_MAP } from "./exerciseDbApi";

interface Props {
  animationType: string;
  className?: string;
  exerciseName?: string;
  gifUrl?: string;
}

let uid = 0;

export default function ExerciseAnimation({ animationType, className = "", exerciseName, gifUrl: propGifUrl }: Props) {
  const id = useMemo(() => `ex${++uid}`, []);
  const Comp = ANIMS[animationType] || ANIMS["squat"];

  const [gifUrl, setGifUrl] = useState<string>(propGifUrl || "");
  const [gifLoaded, setGifLoaded] = useState(false);
  const [gifError, setGifError] = useState(false);

  useEffect(() => {
    if (propGifUrl) {
      setGifUrl(propGifUrl);
      return;
    }
    if (exerciseName) {
      // Check static map first (synchronous)
      const staticUrl = EXERCISE_GIF_MAP[exerciseName];
      if (staticUrl) {
        setGifUrl(staticUrl);
        return;
      }
      // Fetch from API
      getExerciseGif(exerciseName).then(url => {
        if (url) setGifUrl(url);
      });
    }
  }, [exerciseName, propGifUrl]);

  // If we have a GIF URL and it loaded successfully, show GIF
  if (gifUrl && !gifError) {
    return (
      <div className={className} style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {!gifLoaded && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{
              width: 32, height: 32, border: "3px solid rgba(99,102,241,0.3)",
              borderTopColor: "#6366f1", borderRadius: "50%",
              animation: "spin 0.8s linear infinite"
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}
        <img
          src={gifUrl}
          alt={exerciseName || animationType}
          onLoad={() => setGifLoaded(true)}
          onError={() => setGifError(true)}
          style={{
            width: "100%", height: "100%", objectFit: "contain",
            borderRadius: 8, opacity: gifLoaded ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>
    );
  }

  // Fallback: SVG animation
  return (
    <div className={className} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg viewBox="0 0 200 240" style={{ width: "100%", height: "100%" }}>
        <defs>
          {/* ── SKIN GRADIENTS ── */}
          <radialGradient id={`${id}-sk`} cx="50%" cy="35%" r="58%">
            <stop offset="0%" stopColor="#fad5b5" />
            <stop offset="45%" stopColor="#e8b48a" />
            <stop offset="80%" stopColor="#d49a6e" />
            <stop offset="100%" stopColor="#b87a50" />
          </radialGradient>
          <radialGradient id={`${id}-skS`} cx="50%" cy="35%" r="58%">
            <stop offset="0%" stopColor="#e8c0a0" />
            <stop offset="45%" stopColor="#d0a078" />
            <stop offset="80%" stopColor="#b88860" />
            <stop offset="100%" stopColor="#986848" />
          </radialGradient>
          {/* Muscle highlight (for contracting muscles) */}
          <radialGradient id={`${id}-mhl`} cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="rgba(255,220,190,0.5)" />
            <stop offset="100%" stopColor="rgba(255,220,190,0)" />
          </radialGradient>
          {/* ── ARM CYLINDER GRADIENTS ── */}
          <linearGradient id={`${id}-aL`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#b87a50" />
            <stop offset="15%" stopColor="#d49a6e" />
            <stop offset="35%" stopColor="#f0c8a0" />
            <stop offset="55%" stopColor="#fad5b5" />
            <stop offset="75%" stopColor="#e8b48a" />
            <stop offset="100%" stopColor="#a86a42" />
          </linearGradient>
          <linearGradient id={`${id}-aR`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a06838" />
            <stop offset="20%" stopColor="#c08858" />
            <stop offset="45%" stopColor="#daa878" />
            <stop offset="65%" stopColor="#d09868" />
            <stop offset="85%" stopColor="#b88050" />
            <stop offset="100%" stopColor="#906038" />
          </linearGradient>
          {/* ── LEG CYLINDER GRADIENTS ── */}
          <linearGradient id={`${id}-lL`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#b07848" />
            <stop offset="18%" stopColor="#d09868" />
            <stop offset="40%" stopColor="#e8b890" />
            <stop offset="60%" stopColor="#f0c8a0" />
            <stop offset="80%" stopColor="#d8a070" />
            <stop offset="100%" stopColor="#a06838" />
          </linearGradient>
          <linearGradient id={`${id}-lR`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#986038" />
            <stop offset="20%" stopColor="#b88858" />
            <stop offset="45%" stopColor="#d0a070" />
            <stop offset="65%" stopColor="#c89060" />
            <stop offset="85%" stopColor="#a87848" />
            <stop offset="100%" stopColor="#886030" />
          </linearGradient>
          {/* ── TORSO SKIN ── */}
          <linearGradient id={`${id}-tsk`} x1="0.15" y1="0" x2="0.85" y2="0">
            <stop offset="0%" stopColor="#c08858" />
            <stop offset="20%" stopColor="#daa878" />
            <stop offset="40%" stopColor="#f0c8a0" />
            <stop offset="60%" stopColor="#f0c8a0" />
            <stop offset="80%" stopColor="#daa878" />
            <stop offset="100%" stopColor="#c08858" />
          </linearGradient>
          <linearGradient id={`${id}-tskV`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,220,190,0.25)" />
            <stop offset="40%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
          </linearGradient>
          {/* Pec shadow */}
          <radialGradient id={`${id}-pec`} cx="50%" cy="60%" r="55%">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="70%" stopColor="rgba(0,0,0,0.04)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
          </radialGradient>
          {/* ── SHORTS ── */}
          <linearGradient id={`${id}-sh`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a3a3a" />
            <stop offset="40%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#181818" />
          </linearGradient>
          <linearGradient id={`${id}-shH`} x1="0.3" y1="0" x2="0.7" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.02)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.08)" />
          </linearGradient>
          {/* ── METAL ── */}
          <linearGradient id={`${id}-mt`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e0e8f0" />
            <stop offset="20%" stopColor="#c8d0d8" />
            <stop offset="50%" stopColor="#90a0b0" />
            <stop offset="80%" stopColor="#607080" />
            <stop offset="100%" stopColor="#485868" />
          </linearGradient>
          <linearGradient id={`${id}-mtH`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#607080" />
            <stop offset="12%" stopColor="#a0b0c0" />
            <stop offset="28%" stopColor="#d8e0e8" />
            <stop offset="45%" stopColor="#e8f0f5" />
            <stop offset="60%" stopColor="#c0c8d0" />
            <stop offset="75%" stopColor="#a8b8c8" />
            <stop offset="88%" stopColor="#c0d0d8" />
            <stop offset="100%" stopColor="#506070" />
          </linearGradient>
          {/* ── WEIGHT PLATE ── */}
          <linearGradient id={`${id}-pl`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#505050" />
            <stop offset="25%" stopColor="#383838" />
            <stop offset="75%" stopColor="#222" />
            <stop offset="100%" stopColor="#161616" />
          </linearGradient>
          <radialGradient id={`${id}-plR`} cx="38%" cy="32%">
            <stop offset="0%" stopColor="#585858" />
            <stop offset="40%" stopColor="#383838" />
            <stop offset="100%" stopColor="#181818" />
          </radialGradient>
          {/* ── BENCH PAD ── */}
          <linearGradient id={`${id}-pd`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d83030" />
            <stop offset="30%" stopColor="#c02020" />
            <stop offset="70%" stopColor="#a01818" />
            <stop offset="100%" stopColor="#701010" />
          </linearGradient>
          {/* ── SHOE ── */}
          <linearGradient id={`${id}-sho`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#505050" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>
          <linearGradient id={`${id}-sol`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eee" />
            <stop offset="100%" stopColor="#aaa" />
          </linearGradient>
          {/* ── HAIR ── */}
          <radialGradient id={`${id}-hr`} cx="50%" cy="25%">
            <stop offset="0%" stopColor="#5a4838" />
            <stop offset="60%" stopColor="#3a2818" />
            <stop offset="100%" stopColor="#221810" />
          </radialGradient>
          {/* ── FILTERS ── */}
          <filter id={`${id}-ds`} x="-12%" y="-12%" width="124%" height="132%">
            <feDropShadow dx="1.2" dy="2" stdDeviation="1.8" floodColor="#000" floodOpacity="0.35" />
          </filter>
          <filter id={`${id}-gl`} x="-6%" y="-6%" width="112%" height="112%">
            <feDropShadow dx="0.4" dy="0.8" stdDeviation="0.6" floodColor="#000" floodOpacity="0.18" />
          </filter>
          {/* Muscle definition lines */}
          <filter id={`${id}-ml`} x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>
        <Comp id={id} />
      </svg>
    </div>
  );
}

type AC = React.FC<{ id: string }>;

/* ══════════════════════════════════════════════════════
   ANATOMICAL BODY PARTS — FRONT VIEW
   ══════════════════════════════════════════════════════ */

function Head({ id, cx, cy, r = 14 }: { id: string; cx: number; cy: number; r?: number }) {
  return (
    <g filter={`url(#${id}-gl)`}>
      {/* Neck */}
      <path d={`M${cx - 5},${cy + r - 1} L${cx - 6},${cy + r + 7} L${cx + 6},${cy + r + 7} L${cx + 5},${cy + r - 1}`}
        fill={`url(#${id}-sk)`} />
      {/* Trapezius hint on neck */}
      <path d={`M${cx - 6},${cy + r + 4} Q${cx - 14},${cy + r + 10} ${cx - 18},${cy + r + 8}
               M${cx + 6},${cy + r + 4} Q${cx + 14},${cy + r + 10} ${cx + 18},${cy + r + 8}`}
        stroke="rgba(160,100,60,0.3)" strokeWidth="2.5" fill="none" />
      {/* SCM muscle lines */}
      <line x1={cx - 3} y1={cy + r} x2={cx - 5} y2={cy + r + 6} stroke="rgba(0,0,0,0.06)" strokeWidth="0.8" />
      <line x1={cx + 3} y1={cy + r} x2={cx + 5} y2={cy + r + 6} stroke="rgba(0,0,0,0.06)" strokeWidth="0.8" />
      {/* Hair back volume */}
      <ellipse cx={cx} cy={cy - 1} rx={r + 2} ry={r + 1.5} fill={`url(#${id}-hr)`} />
      {/* Face */}
      <ellipse cx={cx} cy={cy + 2} rx={r - 2} ry={r} fill={`url(#${id}-sk)`} />
      {/* Jaw line */}
      <path d={`M${cx - r + 3},${cy + 1} Q${cx - r + 5},${cy + r - 2} ${cx},${cy + r + 1} Q${cx + r - 5},${cy + r - 2} ${cx + r - 3},${cy + 1}`}
        stroke="rgba(160,100,60,0.15)" strokeWidth="0.8" fill="none" />
      {/* Hair top */}
      <path d={`M${cx - r + 1},${cy - 2}
               Q${cx - r + 3},${cy - r - 5} ${cx - 3},${cy - r - 3}
               Q${cx},${cy - r - 4} ${cx + 3},${cy - r - 3}
               Q${cx + r - 3},${cy - r - 5} ${cx + r - 1},${cy - 2}
               Q${cx + r - 2},${cy - r + 3} ${cx},${cy - r + 2}
               Q${cx - r + 2},${cy - r + 3} ${cx - r + 1},${cy - 2} Z`}
        fill={`url(#${id}-hr)`} />
      {/* Ears with detail */}
      <ellipse cx={cx - r + 2} cy={cy + 2} rx={2.5} ry={4} fill="#daa070" />
      <ellipse cx={cx - r + 2.5} cy={cy + 2} rx={1.2} ry={2.5} fill="#c89060" />
      <ellipse cx={cx + r - 2} cy={cy + 2} rx={2.5} ry={4} fill="#c89060" />
      <ellipse cx={cx + r - 2.5} cy={cy + 2} rx={1.2} ry={2.5} fill="#b88050" />
      {/* Forehead highlight */}
      <ellipse cx={cx} cy={cy - 5} rx={6} ry={3} fill="rgba(255,230,210,0.2)" />
      {/* Eyes — anatomical with iris, pupil, lid */}
      <ellipse cx={cx - 4.5} cy={cy - 0.5} rx={2.8} ry={1.8} fill="#fff" />
      <ellipse cx={cx + 4.5} cy={cy - 0.5} rx={2.8} ry={1.8} fill="#fff" />
      <circle cx={cx - 4} cy={cy - 0.3} r={1.4} fill="#5a4030" />
      <circle cx={cx + 5} cy={cy - 0.3} r={1.4} fill="#5a4030" />
      <circle cx={cx - 3.8} cy={cy - 0.4} r={0.7} fill="#1a1008" />
      <circle cx={cx + 5.2} cy={cy - 0.4} r={0.7} fill="#1a1008" />
      {/* Pupil highlights */}
      <circle cx={cx - 3.4} cy={cy - 0.8} r={0.35} fill="#fff" />
      <circle cx={cx + 5.6} cy={cy - 0.8} r={0.35} fill="#fff" />
      {/* Upper eyelids */}
      <path d={`M${cx - 7},${cy - 1} Q${cx - 4.5},${cy - 3} ${cx - 2},${cy - 1}`}
        stroke="#5a4030" strokeWidth="0.8" fill="none" />
      <path d={`M${cx + 2},${cy - 1} Q${cx + 4.5},${cy - 3} ${cx + 7},${cy - 1}`}
        stroke="#5a4030" strokeWidth="0.8" fill="none" />
      {/* Eyebrows with thickness */}
      <path d={`M${cx - 8},${cy - 3.5} Q${cx - 4.5},${cy - 6} ${cx - 1.5},${cy - 3.8}`}
        stroke="#3a2818" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d={`M${cx + 1.5},${cy - 3.8} Q${cx + 4.5},${cy - 6} ${cx + 8},${cy - 3.5}`}
        stroke="#3a2818" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* Nose with bridge and nostrils */}
      <path d={`M${cx - 0.5},${cy - 2} L${cx - 1},${cy + 3.5} Q${cx - 2.5},${cy + 5} ${cx - 3},${cy + 4.5}`}
        stroke="#c8956a" strokeWidth="0.7" fill="none" />
      <path d={`M${cx + 0.5},${cy - 2} L${cx + 1},${cy + 3.5} Q${cx + 2.5},${cy + 5} ${cx + 3},${cy + 4.5}`}
        stroke="#c8956a" strokeWidth="0.7" fill="none" />
      <ellipse cx={cx - 1.8} cy={cy + 4.8} rx={1} ry={0.6} fill="rgba(0,0,0,0.08)" />
      <ellipse cx={cx + 1.8} cy={cy + 4.8} rx={1} ry={0.6} fill="rgba(0,0,0,0.08)" />
      {/* Mouth */}
      <path d={`M${cx - 4},${cy + 7} Q${cx - 1},${cy + 8.5} ${cx},${cy + 8}
               Q${cx + 1},${cy + 8.5} ${cx + 4},${cy + 7}`}
        stroke="#b86858" strokeWidth="1.2" fill="none" />
      <path d={`M${cx - 3.5},${cy + 7.3} Q${cx},${cy + 7.8} ${cx + 3.5},${cy + 7.3}`}
        stroke="#c87868" strokeWidth="0.6" fill="none" />
    </g>
  );
}

/** Anatomical front torso — visible pecs, abs, serratus, obliques */
function AnaTorso({ id, cx, top, h = 52, w = 42 }: { id: string; cx: number; top: number; h?: number; w?: number }) {
  const sw = w / 2 + 6; // shoulder width
  const ww = w / 2 - 2; // waist width
  const bot = top + h;
  return (
    <g filter={`url(#${id}-ds)`}>
      {/* Base torso shape — V taper */}
      <path d={`M${cx - sw},${top + 5}
                Q${cx - sw + 1},${top - 1} ${cx},${top - 2}
                Q${cx + sw - 1},${top - 1} ${cx + sw},${top + 5}
                L${cx + ww + 1},${bot}
                Q${cx},${bot + 2} ${cx - ww - 1},${bot}
                Z`}
        fill={`url(#${id}-tsk)`} />
      {/* Vertical light overlay */}
      <path d={`M${cx - sw},${top + 5}
                Q${cx - sw + 1},${top - 1} ${cx},${top - 2}
                Q${cx + sw - 1},${top - 1} ${cx + sw},${top + 5}
                L${cx + ww + 1},${bot}
                Q${cx},${bot + 2} ${cx - ww - 1},${bot}
                Z`}
        fill={`url(#${id}-tskV)`} />

      {/* ── DELTOID CAPS ── */}
      <ellipse cx={cx - sw + 3} cy={top + 6} rx={7} ry={5} fill="rgba(240,200,160,0.5)" />
      <ellipse cx={cx + sw - 3} cy={top + 6} rx={7} ry={5} fill="rgba(210,170,130,0.4)" />
      <path d={`M${cx - sw + 1},${top + 10} Q${cx - sw + 4},${top + 2} ${cx - sw + 10},${top + 3}`}
        stroke="rgba(0,0,0,0.08)" strokeWidth="0.7" fill="none" />
      <path d={`M${cx + sw - 1},${top + 10} Q${cx + sw - 4},${top + 2} ${cx + sw - 10},${top + 3}`}
        stroke="rgba(0,0,0,0.06)" strokeWidth="0.7" fill="none" />

      {/* ── PECTORALS ── */}
      {/* Left pec */}
      <path d={`M${cx - 2},${top + 6} Q${cx - 14},${top + 8} ${cx - sw + 6},${top + 12}
                Q${cx - 14},${top + 22} ${cx - 2},${top + 20}`}
        fill={`url(#${id}-pec)`} />
      {/* Right pec */}
      <path d={`M${cx + 2},${top + 6} Q${cx + 14},${top + 8} ${cx + sw - 6},${top + 12}
                Q${cx + 14},${top + 22} ${cx + 2},${top + 20}`}
        fill={`url(#${id}-pec)`} />
      {/* Pec division line */}
      <line x1={cx} y1={top + 5} x2={cx} y2={top + 20}
        stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
      {/* Pec lower fold */}
      <path d={`M${cx - 2},${top + 20} Q${cx - 12},${top + 22} ${cx - sw + 8},${top + 16}`}
        stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" fill="none" filter={`url(#${id}-ml)`} />
      <path d={`M${cx + 2},${top + 20} Q${cx + 12},${top + 22} ${cx + sw - 8},${top + 16}`}
        stroke="rgba(0,0,0,0.08)" strokeWidth="0.8" fill="none" filter={`url(#${id}-ml)`} />

      {/* ── ABS (6-pack) ── */}
      {/* Linea alba (center line) */}
      <line x1={cx} y1={top + 20} x2={cx} y2={bot - 2}
        stroke="rgba(0,0,0,0.1)" strokeWidth="0.7" />
      {/* Ab rows */}
      {[0, 1, 2].map(i => {
        const ay = top + 24 + i * 9;
        return (
          <g key={i}>
            <path d={`M${cx - 1},${ay} Q${cx - 6},${ay + 1} ${cx - 10},${ay}`}
              stroke="rgba(0,0,0,0.08)" strokeWidth="0.6" fill="none" filter={`url(#${id}-ml)`} />
            <path d={`M${cx + 1},${ay} Q${cx + 6},${ay + 1} ${cx + 10},${ay}`}
              stroke="rgba(0,0,0,0.06)" strokeWidth="0.6" fill="none" filter={`url(#${id}-ml)`} />
            {/* Ab block highlight */}
            <ellipse cx={cx - 6} cy={ay + 4} rx={5} ry={3.5}
              fill="rgba(255,220,190,0.08)" />
            <ellipse cx={cx + 6} cy={ay + 4} rx={5} ry={3.5}
              fill="rgba(255,220,190,0.05)" />
          </g>
        );
      })}

      {/* ── SERRATUS (side ribs) ── */}
      {[0, 1, 2].map(i => (
        <g key={`s${i}`}>
          <path d={`M${cx - sw + 5},${top + 16 + i * 6} Q${cx - sw + 8},${top + 18 + i * 6} ${cx - 12},${top + 20 + i * 6}`}
            stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" fill="none" />
          <path d={`M${cx + sw - 5},${top + 16 + i * 6} Q${cx + sw - 8},${top + 18 + i * 6} ${cx + 12},${top + 20 + i * 6}`}
            stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" fill="none" />
        </g>
      ))}

      {/* ── OBLIQUES ── */}
      <path d={`M${cx - ww},${bot - 6} Q${cx - ww - 4},${bot - 14} ${cx - sw + 4},${top + 28}`}
        stroke="rgba(0,0,0,0.06)" strokeWidth="1" fill="none" />
      <path d={`M${cx + ww},${bot - 6} Q${cx + ww + 4},${bot - 14} ${cx + sw - 4},${top + 28}`}
        stroke="rgba(0,0,0,0.05)" strokeWidth="1" fill="none" />

      {/* Navel */}
      <ellipse cx={cx} cy={bot - 6} rx={1.5} ry={2} fill="rgba(0,0,0,0.12)" />
    </g>
  );
}

/** Anatomical arm — bicep, tricep, forearm muscles, veins */
function AnaArm({ id, pts, w = 10, side = "L" }: { id: string; pts: [number, number, number, number, number, number]; w?: number; side?: "L" | "R" }) {
  const [sx, sy, ex, ey, hx, hy] = pts;
  const grad = side === "L" ? `url(#${id}-aL)` : `url(#${id}-aR)`;
  const mult = side === "L" ? 1 : -1;

  // Upper arm
  const udx = ex - sx, udy = ey - sy;
  const ulen = Math.sqrt(udx * udx + udy * udy) || 1;
  const unx = (-udy / ulen) * w / 2, uny = (udx / ulen) * w / 2;
  const umx = (sx + ex) / 2, umy = (sy + ey) / 2;

  // Forearm
  const fw = w * 0.75;
  const fdx = hx - ex, fdy = hy - ey;
  const flen = Math.sqrt(fdx * fdx + fdy * fdy) || 1;
  const fnx = (-fdy / flen) * fw / 2, fny = (fdx / flen) * fw / 2;
  const fmx = (ex + hx) / 2, fmy = (ey + hy) / 2;

  return (
    <g filter={`url(#${id}-gl)`}>
      {/* Upper arm with bicep bulge */}
      <path
        d={`M${sx + unx * 0.85},${sy + uny * 0.85}
            Q${umx + unx * 1.55},${umy + uny * 1.55} ${ex + unx * 0.75},${ey + uny * 0.75}
            L${ex - unx * 0.75},${ey - uny * 0.75}
            Q${umx - unx * 1.0},${umy - uny * 1.0} ${sx - unx * 0.85},${sy - uny * 0.85}
            Z`}
        fill={grad} />
      {/* Bicep peak highlight */}
      <ellipse cx={umx + unx * 0.8} cy={umy + uny * 0.8} rx={w * 0.5} ry={w * 0.35}
        fill="rgba(255,220,190,0.15)"
        transform={`rotate(${Math.atan2(udy, udx) * 180 / Math.PI}, ${umx + unx * 0.8}, ${umy + uny * 0.8})`} />
      {/* Bicep/tricep separation line */}
      <line x1={sx} y1={sy} x2={ex} y2={ey}
        stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />

      {/* Forearm with brachioradialis bulge */}
      <path
        d={`M${ex + fnx * 1.0},${ey + fny * 1.0}
            Q${fmx + fnx * 1.25},${fmy + fny * 1.0} ${hx + fnx * 0.4},${hy + fny * 0.4}
            L${hx - fnx * 0.4},${hy - fny * 0.4}
            Q${fmx - fnx * 0.8},${fmy - fny * 0.7} ${ex - fnx * 1.0},${ey - fny * 1.0}
            Z`}
        fill={grad} />
      {/* Forearm muscle line */}
      <path d={`M${ex},${ey} Q${fmx + fnx * 0.3},${fmy + fny * 0.3} ${hx},${hy}`}
        stroke="rgba(0,0,0,0.05)" strokeWidth="0.4" fill="none" />
      {/* Vein on forearm */}
      <path d={`M${ex + fnx * 0.3},${ey + fny * 0.3} Q${fmx + fnx * 0.5},${fmy + fny * 0.2} ${hx + fnx * 0.1},${hy + fny * 0.1}`}
        stroke="rgba(80,120,160,0.12)" strokeWidth="0.5" fill="none" />

      {/* Elbow */}
      <ellipse cx={ex} cy={ey} r={w * 0.4} fill={side === "L" ? "#daa070" : "#c08858"} />
      {/* Hand with fingers hint */}
      <ellipse cx={hx} cy={hy} rx={w * 0.48} ry={w * 0.42}
        fill={side === "L" ? "#f0c8a0" : "#daa878"} />
      <path d={`M${hx - w * 0.2},${hy + w * 0.2} L${hx - w * 0.15},${hy + w * 0.5}
               M${hx},${hy + w * 0.25} L${hx},${hy + w * 0.55}
               M${hx + w * 0.2},${hy + w * 0.2} L${hx + w * 0.15},${hy + w * 0.45}`}
        stroke={side === "L" ? "rgba(180,120,70,0.25)" : "rgba(150,100,60,0.25)"}
        strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </g>
  );
}

/** Anatomical leg — quad, calf, knee */
function AnaLeg({ id, pts, w = 13, side = "L" }: { id: string; pts: [number, number, number, number, number, number]; w?: number; side?: "L" | "R" }) {
  const [hx, hy, kx, ky, ax, ay] = pts;
  const grad = side === "L" ? `url(#${id}-lL)` : `url(#${id}-lR)`;

  // Thigh
  const tdx = kx - hx, tdy = ky - hy;
  const tlen = Math.sqrt(tdx * tdx + tdy * tdy) || 1;
  const tnx = (-tdy / tlen) * w / 2, tny = (tdx / tlen) * w / 2;
  const tmx = (hx + kx) / 2, tmy = (hy + ky) / 2;

  // Calf
  const cw = w * 0.78;
  const cdx = ax - kx, cdy = ay - ky;
  const clen = Math.sqrt(cdx * cdx + cdy * cdy) || 1;
  const cnx = (-cdy / clen) * cw / 2, cny = (cdx / clen) * cw / 2;
  const cmx = (kx + ax) / 2, cmy = (ky + ay) / 2;
  // Calf bulge is higher (upper 1/3)
  const cbx = kx + (ax - kx) * 0.3, cby = ky + (ay - ky) * 0.3;

  return (
    <g filter={`url(#${id}-gl)`}>
      {/* Thigh — quad sweep */}
      <path
        d={`M${hx + tnx * 1.15},${hy + tny * 1.15}
            Q${tmx + tnx * 1.6},${tmy + tny * 1.6} ${kx + tnx * 0.75},${ky + tny * 0.75}
            L${kx - tnx * 0.75},${ky - tny * 0.75}
            Q${tmx - tnx * 1.1},${tmy - tny * 1.1} ${hx - tnx * 1.15},${hy - tny * 1.15}
            Z`}
        fill={grad} />
      {/* Quad muscle lines */}
      <path d={`M${hx + tnx * 0.3},${hy} Q${tmx + tnx * 0.5},${tmy + tny * 0.3} ${kx + tnx * 0.2},${ky}`}
        stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" fill="none" />
      <path d={`M${hx - tnx * 0.2},${hy} Q${tmx - tnx * 0.3},${tmy} ${kx - tnx * 0.1},${ky}`}
        stroke="rgba(0,0,0,0.04)" strokeWidth="0.5" fill="none" />
      {/* Quad highlight */}
      <ellipse cx={tmx + tnx * 0.5} cy={tmy} rx={w * 0.45} ry={tlen * 0.2}
        fill="rgba(255,220,190,0.08)"
        transform={`rotate(${Math.atan2(tdy, tdx) * 180 / Math.PI}, ${tmx + tnx * 0.5}, ${tmy})`} />

      {/* Calf — gastrocnemius */}
      <path
        d={`M${kx + cnx * 0.95},${ky + cny * 0.95}
            Q${cbx + cnx * 1.45},${cby + cny * 1.3} ${ax + cnx * 0.35},${ay + cny * 0.35}
            L${ax - cnx * 0.35},${ay - cny * 0.35}
            Q${cbx - cnx * 0.9},${cby - cny * 0.85} ${kx - cnx * 0.95},${ky - cny * 0.95}
            Z`}
        fill={grad} />
      {/* Calf muscle split */}
      <path d={`M${kx},${ky + 2} Q${cbx + cnx * 0.3},${cby} ${cmx},${cmy}`}
        stroke="rgba(0,0,0,0.05)" strokeWidth="0.4" fill="none" />

      {/* Kneecap */}
      <ellipse cx={kx} cy={ky} rx={w * 0.38} ry={w * 0.32}
        fill={side === "L" ? "#daa878" : "#c08858"} />
      <ellipse cx={kx} cy={ky - w * 0.05} rx={w * 0.25} ry={w * 0.2}
        fill="rgba(255,220,190,0.2)" />
    </g>
  );
}

/** Shorts with stitching and folds */
function Shorts({ id, cx, top, h = 19, w = 38 }: { id: string; cx: number; top: number; h?: number; w?: number }) {
  const hw = w / 2;
  return (
    <g filter={`url(#${id}-gl)`}>
      <path
        d={`M${cx - hw - 1},${top}
            L${cx + hw + 1},${top}
            L${cx + hw},${top + h}
            L${cx + 3},${top + h - 3}
            L${cx - 3},${top + h - 3}
            L${cx - hw},${top + h}
            Z`}
        fill={`url(#${id}-sh)`} />
      <path
        d={`M${cx - hw - 1},${top}
            L${cx + hw + 1},${top}
            L${cx + hw},${top + h}
            L${cx + 3},${top + h - 3}
            L${cx - 3},${top + h - 3}
            L${cx - hw},${top + h}
            Z`}
        fill={`url(#${id}-shH)`} />
      {/* Waistband */}
      <rect x={cx - hw - 1} y={top} width={w + 2} height={3} rx={1.5} fill="rgba(60,60,60,0.8)" />
      {/* Center fold */}
      <line x1={cx} y1={top + 4} x2={cx} y2={top + h - 4} stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      {/* Side seam */}
      <line x1={cx - hw} y1={top + 3} x2={cx - hw} y2={top + h} stroke="rgba(255,255,255,0.04)" strokeWidth="0.4" />
      <line x1={cx + hw} y1={top + 3} x2={cx + hw} y2={top + h} stroke="rgba(0,0,0,0.06)" strokeWidth="0.4" />
    </g>
  );
}

function Shoe({ id, cx, cy }: { id: string; cx: number; cy: number }) {
  return (
    <g filter={`url(#${id}-gl)`}>
      <path d={`M${cx - 7},${cy - 3} Q${cx - 8},${cy} ${cx - 7},${cy + 2}
                L${cx + 7},${cy + 2} Q${cx + 8},${cy} ${cx + 7},${cy - 3} Z`}
        fill={`url(#${id}-sho)`} />
      <path d={`M${cx - 7.5},${cy + 1} L${cx + 7.5},${cy + 1}
                L${cx + 8},${cy + 4} L${cx - 8},${cy + 4} Z`}
        fill={`url(#${id}-sol)`} />
      <line x1={cx - 2} y1={cy - 2} x2={cx + 2} y2={cy - 2} stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" />
      <line x1={cx - 1.5} y1={cy - 0.5} x2={cx + 1.5} y2={cy - 0.5} stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" />
    </g>
  );
}

function Dumbbell({ id, cx, cy, vert = true }: { id: string; cx: number; cy: number; vert?: boolean }) {
  if (!vert) {
    return (
      <g filter={`url(#${id}-ds)`}>
        <rect x={cx - 15} y={cy - 2.5} width={30} height={5} rx={2.5} fill={`url(#${id}-mtH)`} />
        <rect x={cx - 18} y={cy - 6} width={7} height={12} rx={2} fill={`url(#${id}-pl)`} />
        <rect x={cx + 11} y={cy - 6} width={7} height={12} rx={2} fill={`url(#${id}-pl)`} />
        <rect x={cx - 17} y={cy - 5.5} width={5} height={1.5} rx={0.5} fill="#555" opacity="0.3" />
        <rect x={cx + 12} y={cy - 5.5} width={5} height={1.5} rx={0.5} fill="#555" opacity="0.3" />
      </g>
    );
  }
  return (
    <g filter={`url(#${id}-ds)`}>
      <rect x={cx - 2.5} y={cy - 15} width={5} height={30} rx={2.5} fill={`url(#${id}-mtH)`} />
      <rect x={cx - 6} y={cy - 18} width={12} height={7} rx={2} fill={`url(#${id}-pl)`} />
      <rect x={cx - 6} y={cy + 11} width={12} height={7} rx={2} fill={`url(#${id}-pl)`} />
    </g>
  );
}

function BarbellH({ id, x, y, w }: { id: string; x: number; y: number; w: number }) {
  return (
    <g filter={`url(#${id}-ds)`}>
      <rect x={x} y={y} width={w} height={5.5} rx={2.75} fill={`url(#${id}-mtH)`} />
      {/* Collars */}
      <rect x={x + 10} y={y - 1} width={4} height={7.5} rx={1} fill="#888" />
      <rect x={x + w - 14} y={y - 1} width={4} height={7.5} rx={1} fill="#888" />
      {/* Plates */}
      <rect x={x + 1} y={y - 8} width={9} height={21.5} rx={2} fill={`url(#${id}-pl)`} />
      <rect x={x + w - 10} y={y - 8} width={9} height={21.5} rx={2} fill={`url(#${id}-pl)`} />
      <rect x={x + 2} y={y - 7} width={7} height={2} rx={0.5} fill="#555" opacity="0.3" />
      <rect x={x + w - 9} y={y - 7} width={7} height={2} rx={0.5} fill="#555" opacity="0.3" />
    </g>
  );
}

function Bench({ id, x, y, w, h = 12 }: { id: string; x: number; y: number; w: number; h?: number }) {
  return (
    <g filter={`url(#${id}-ds)`}>
      <rect x={x} y={y} width={w} height={h} rx={4} fill={`url(#${id}-pd)`} />
      <line x1={x + 6} y1={y + h / 2} x2={x + w - 6} y2={y + h / 2} stroke="rgba(0,0,0,0.12)" strokeWidth="0.5" strokeDasharray="3,2" />
      <rect x={x + 10} y={y + h} width={6} height={32} rx={2} fill={`url(#${id}-mt)`} />
      <rect x={x + w - 16} y={y + h} width={6} height={32} rx={2} fill={`url(#${id}-mt)`} />
      <rect x={x + 4} y={y + h + 30} width={18} height={4} rx={2} fill="#506070" />
      <rect x={x + w - 22} y={y + h + 30} width={18} height={4} rx={2} fill="#506070" />
    </g>
  );
}

function Ground({ y = 218 }: { y?: number }) {
  return <line x1="5" y1={y} x2="195" y2={y} stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />;
}

/* ══════════════════════════════════════════════════════
   EXERCISE ANIMATIONS
   ══════════════════════════════════════════════════════ */

const PressAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-p { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-22px); } }
      .${id}-p { animation: ${id}-p 2.2s ease-in-out infinite; }
    `}</style>
    <Bench id={id} x={25} y={140} w={150} />
    <Head id={id} cx={100} cy={124} r={12} />
    <path d={`M72,134 Q100,128 128,134 L124,152 Q100,156 76,152 Z`} fill={`url(#${id}-tsk)`} filter={`url(#${id}-ds)`} />
    <path d={`M72,134 Q100,128 128,134 L124,152 Q100,156 76,152 Z`} fill={`url(#${id}-tskV)`} />
    {/* Pec outline on supine torso */}
    <path d="M98,134 Q88,136 78,140" stroke="rgba(0,0,0,0.08)" strokeWidth="0.6" fill="none" />
    <path d="M102,134 Q112,136 122,140" stroke="rgba(0,0,0,0.06)" strokeWidth="0.6" fill="none" />
    <Shorts id={id} cx={100} top={150} h={10} w={30} />
    <AnaLeg id={id} pts={[88, 160, 84, 182, 82, 210]} side="L" w={10} />
    <AnaLeg id={id} pts={[112, 160, 116, 182, 118, 210]} side="R" w={10} />
    <Shoe id={id} cx={80} cy={216} />
    <Shoe id={id} cx={120} cy={216} />
    <g className={`${id}-p`}>
      <AnaArm id={id} pts={[74, 138, 56, 122, 56, 104]} side="L" w={9} />
      <AnaArm id={id} pts={[128, 138, 144, 122, 144, 104]} side="R" w={9} />
      <BarbellH id={id} x={16} y={100} w={168} />
    </g>
  </>
);

const FlyAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-fL { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(38deg); } }
      @keyframes ${id}-fR { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-38deg); } }
      .${id}-fL { animation: ${id}-fL 2.4s ease-in-out infinite; transform-origin: 74px 64px; }
      .${id}-fR { animation: ${id}-fR 2.4s ease-in-out infinite; transform-origin: 126px 64px; }
    `}</style>
    <rect x="6" y="6" width="6" height="220" rx="3" fill={`url(#${id}-mt)`} filter={`url(#${id}-ds)`} />
    <rect x="188" y="6" width="6" height="220" rx="3" fill={`url(#${id}-mt)`} filter={`url(#${id}-ds)`} />
    <rect x="6" y="6" width="26" height="6" rx="3" fill={`url(#${id}-mtH)`} />
    <rect x="168" y="6" width="26" height="6" rx="3" fill={`url(#${id}-mtH)`} />
    <rect x="8" y="26" width="12" height="42" rx="2" fill={`url(#${id}-pl)`} filter={`url(#${id}-ds)`} />
    <rect x="180" y="26" width="12" height="42" rx="2" fill={`url(#${id}-pl)`} filter={`url(#${id}-ds)`} />
    <AnaLeg id={id} pts={[88, 132, 84, 166, 82, 204]} side="L" w={12} />
    <AnaLeg id={id} pts={[112, 132, 116, 166, 118, 204]} side="R" w={12} />
    <Shoe id={id} cx={80} cy={210} />
    <Shoe id={id} cx={120} cy={210} />
    <Shorts id={id} cx={100} top={116} />
    <AnaTorso id={id} cx={100} top={58} h={60} />
    <Head id={id} cx={100} cy={40} />
    <g className={`${id}-fL`}>
      <line x1="20" y1="10" x2="54" y2="100" stroke="#999" strokeWidth="1.2" />
      <AnaArm id={id} pts={[74, 64, 54, 86, 54, 104]} side="L" w={9} />
    </g>
    <g className={`${id}-fR`}>
      <line x1="180" y1="10" x2="146" y2="100" stroke="#999" strokeWidth="1.2" />
      <AnaArm id={id} pts={[126, 64, 146, 86, 146, 104]} side="R" w={9} />
    </g>
    <Ground />
  </>
);

const PullDownAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-pd { 0%,100% { transform: translateY(0); } 50% { transform: translateY(32px); } }
      .${id}-pd { animation: ${id}-pd 2.2s ease-in-out infinite; }
    `}</style>
    <rect x="95" y="2" width="7" height="230" rx="3" fill={`url(#${id}-mt)`} filter={`url(#${id}-ds)`} />
    <rect x="72" y="2" width="55" height="7" rx="3" fill={`url(#${id}-mtH)`} />
    <rect x="103" y="36" width="14" height="62" rx="2" fill={`url(#${id}-pl)`} filter={`url(#${id}-ds)`} />
    <rect x="26" y="158" width="62" height="8" rx="4" fill={`url(#${id}-pd)`} filter={`url(#${id}-ds)`} />
    <rect x="28" y="146" width="58" height="7" rx="3" fill={`url(#${id}-pd)`} filter={`url(#${id}-ds)`} />
    <rect x="54" y="166" width="5" height="30" rx="2" fill={`url(#${id}-mt)`} />
    <Head id={id} cx={58} cy={86} />
    <AnaTorso id={id} cx={58} top={104} h={40} w={30} />
    <Shorts id={id} cx={58} top={142} h={14} w={32} />
    <AnaLeg id={id} pts={[46, 156, 34, 180, 30, 208]} side="L" w={9} />
    <AnaLeg id={id} pts={[70, 156, 80, 180, 86, 208]} side="R" w={9} />
    <Shoe id={id} cx={28} cy={214} />
    <Shoe id={id} cx={88} cy={214} />
    <g className={`${id}-pd`}>
      <line x1="98" y1="8" x2="58" y2="44" stroke="#999" strokeWidth="1.2" />
      <rect x="22" y="42" width="74" height="5" rx="2.5" fill={`url(#${id}-mtH)`} filter={`url(#${id}-ds)`} />
      <AnaArm id={id} pts={[42, 108, 30, 82, 28, 48]} side="L" w={8} />
      <AnaArm id={id} pts={[74, 108, 84, 82, 90, 48]} side="R" w={8} />
    </g>
  </>
);

const SquatAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-sq { 0%,100% { transform: translateY(0); } 50% { transform: translateY(32px); } }
      @keyframes ${id}-sqL { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(0.58); } }
      .${id}-sq { animation: ${id}-sq 2.8s ease-in-out infinite; }
      .${id}-sqL { animation: ${id}-sqL 2.8s ease-in-out infinite; transform-origin: 100px 148px; }
    `}</style>
    <g className={`${id}-sq`}>
      <Head id={id} cx={100} cy={26} />
      <BarbellH id={id} x={24} y={40} w={152} />
      <AnaTorso id={id} cx={100} top={48} h={50} />
      <AnaArm id={id} pts={[74, 54, 54, 48, 42, 46]} side="L" w={9} />
      <AnaArm id={id} pts={[126, 54, 146, 48, 158, 46]} side="R" w={9} />
      <Shorts id={id} cx={100} top={96} />
    </g>
    <g className={`${id}-sqL`}>
      <AnaLeg id={id} pts={[88, 114, 80, 152, 78, 202]} side="L" w={13} />
      <AnaLeg id={id} pts={[112, 114, 120, 152, 122, 202]} side="R" w={13} />
      <Shoe id={id} cx={76} cy={210} />
      <Shoe id={id} cx={124} cy={210} />
    </g>
    <Ground />
  </>
);

const CurlAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-cL { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-130deg); } }
      @keyframes ${id}-cR { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(130deg); } }
      .${id}-cL { animation: ${id}-cL 2s ease-in-out infinite; transform-origin: 66px 126px; }
      .${id}-cR { animation: ${id}-cR 2s ease-in-out infinite; transform-origin: 134px 126px; }
    `}</style>
    <AnaLeg id={id} pts={[88, 126, 84, 162, 82, 204]} side="L" />
    <AnaLeg id={id} pts={[112, 126, 116, 162, 118, 204]} side="R" />
    <Shoe id={id} cx={80} cy={210} />
    <Shoe id={id} cx={120} cy={210} />
    <Shorts id={id} cx={100} top={108} />
    <AnaTorso id={id} cx={100} top={52} h={58} />
    <Head id={id} cx={100} cy={34} />
    <AnaArm id={id} pts={[74, 58, 66, 92, 66, 126]} side="L" w={10} />
    <AnaArm id={id} pts={[126, 58, 134, 92, 134, 126]} side="R" w={10} />
    <g className={`${id}-cL`}>
      <path d="M60,126 Q60,144 60,160 L72,160 Q72,144 72,126 Z" fill={`url(#${id}-aL)`} filter={`url(#${id}-gl)`} />
      <Dumbbell id={id} cx={66} cy={166} />
    </g>
    <g className={`${id}-cR`}>
      <path d="M128,126 Q128,144 128,160 L140,160 Q140,144 140,126 Z" fill={`url(#${id}-aR)`} filter={`url(#${id}-gl)`} />
      <Dumbbell id={id} cx={134} cy={166} />
    </g>
    <Ground />
  </>
);

const LateralRaiseAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-lL { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-82deg); } }
      @keyframes ${id}-lR { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(82deg); } }
      .${id}-lL { animation: ${id}-lL 2.4s ease-in-out infinite; transform-origin: 72px 60px; }
      .${id}-lR { animation: ${id}-lR 2.4s ease-in-out infinite; transform-origin: 128px 60px; }
    `}</style>
    <AnaLeg id={id} pts={[88, 126, 84, 162, 82, 204]} side="L" />
    <AnaLeg id={id} pts={[112, 126, 116, 162, 118, 204]} side="R" />
    <Shoe id={id} cx={80} cy={210} />
    <Shoe id={id} cx={120} cy={210} />
    <Shorts id={id} cx={100} top={108} />
    <AnaTorso id={id} cx={100} top={52} h={58} />
    <Head id={id} cx={100} cy={34} />
    <g className={`${id}-lL`}>
      <AnaArm id={id} pts={[72, 60, 58, 92, 56, 122]} side="L" w={9} />
      <Dumbbell id={id} cx={56} cy={128} vert={false} />
    </g>
    <g className={`${id}-lR`}>
      <AnaArm id={id} pts={[128, 60, 142, 92, 144, 122]} side="R" w={9} />
      <Dumbbell id={id} cx={144} cy={128} vert={false} />
    </g>
    <Ground />
  </>
);

const DipAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-d { 0%,100% { transform: translateY(0); } 50% { transform: translateY(28px); } }
      .${id}-d { animation: ${id}-d 2.2s ease-in-out infinite; }
    `}</style>
    <rect x="18" y="80" width="5" height="140" rx="2" fill={`url(#${id}-mt)`} filter={`url(#${id}-ds)`} />
    <rect x="177" y="80" width="5" height="140" rx="2" fill={`url(#${id}-mt)`} filter={`url(#${id}-ds)`} />
    <rect x="18" y="78" width="60" height="5" rx="2.5" fill={`url(#${id}-mtH)`} filter={`url(#${id}-ds)`} />
    <rect x="122" y="78" width="60" height="5" rx="2.5" fill={`url(#${id}-mtH)`} filter={`url(#${id}-ds)`} />
    <g className={`${id}-d`}>
      <Head id={id} cx={100} cy={32} />
      <AnaTorso id={id} cx={100} top={50} h={50} />
      <Shorts id={id} cx={100} top={98} />
      <AnaArm id={id} pts={[72, 56, 50, 64, 48, 80]} side="L" w={10} />
      <AnaArm id={id} pts={[128, 56, 150, 64, 152, 80]} side="R" w={10} />
      <AnaLeg id={id} pts={[90, 116, 88, 148, 90, 180]} side="L" w={11} />
      <AnaLeg id={id} pts={[110, 116, 112, 148, 110, 180]} side="R" w={11} />
    </g>
  </>
);

const PullupAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-pu { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-32px); } }
      .${id}-pu { animation: ${id}-pu 2.4s ease-in-out infinite; }
    `}</style>
    <rect x="10" y="8" width="180" height="6" rx="3" fill={`url(#${id}-mtH)`} filter={`url(#${id}-ds)`} />
    <rect x="8" y="4" width="6" height="16" rx="3" fill={`url(#${id}-mt)`} />
    <rect x="186" y="4" width="6" height="16" rx="3" fill={`url(#${id}-mt)`} />
    <g className={`${id}-pu`}>
      <circle cx="60" cy="14" r="5.5" fill={`url(#${id}-sk)`} />
      <circle cx="140" cy="14" r="5.5" fill={`url(#${id}-skS)`} />
      <AnaArm id={id} pts={[60, 18, 72, 42, 76, 60]} side="L" w={9} />
      <AnaArm id={id} pts={[140, 18, 128, 42, 124, 60]} side="R" w={9} />
      <Head id={id} cx={100} cy={50} />
      <AnaTorso id={id} cx={100} top={68} h={50} />
      <Shorts id={id} cx={100} top={116} />
      <AnaLeg id={id} pts={[90, 134, 88, 166, 86, 202]} side="L" w={11} />
      <AnaLeg id={id} pts={[110, 134, 112, 166, 114, 202]} side="R" w={11} />
    </g>
  </>
);

const RowAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-rw { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-24px); } }
      .${id}-rw { animation: ${id}-rw 2s ease-in-out infinite; }
    `}</style>
    <rect x="162" y="38" width="7" height="175" rx="3" fill={`url(#${id}-mt)`} filter={`url(#${id}-ds)`} />
    <rect x="152" y="38" width="28" height="6" rx="3" fill={`url(#${id}-mtH)`} />
    <rect x="170" y="58" width="14" height="52" rx="2" fill={`url(#${id}-pl)`} filter={`url(#${id}-ds)`} />
    <rect x="28" y="142" width="62" height="7" rx="3" fill={`url(#${id}-pd)`} filter={`url(#${id}-ds)`} />
    <rect x="56" y="149" width="5" height="28" rx="2" fill={`url(#${id}-mt)`} />
    <rect x="122" y="124" width="6" height="42" rx="2" fill={`url(#${id}-mt)`} filter={`url(#${id}-ds)`} />
    <Head id={id} cx={60} cy={82} r={12} />
    <AnaTorso id={id} cx={60} top={100} h={38} w={28} />
    <Shorts id={id} cx={60} top={136} h={10} w={28} />
    <AnaLeg id={id} pts={[50, 146, 82, 148, 120, 136]} side="L" w={9} />
    <AnaLeg id={id} pts={[70, 146, 92, 150, 120, 152]} side="R" w={9} />
    <Shoe id={id} cx={122} cy={136} />
    <Shoe id={id} cx={122} cy={156} />
    <g className={`${id}-rw`}>
      <AnaArm id={id} pts={[46, 104, 56, 122, 82, 118]} side="L" w={8} />
      <AnaArm id={id} pts={[74, 104, 68, 122, 82, 122]} side="R" w={8} />
      <rect x="80" y="112" width="5" height="16" rx="2" fill={`url(#${id}-mtH)`} />
      <line x1="85" y1="120" x2="165" y2="44" stroke="#999" strokeWidth="1.2" />
    </g>
    <Ground />
  </>
);

const PushdownAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-pdL { 0%,100% { transform: rotate(-82deg); } 50% { transform: rotate(0deg); } }
      @keyframes ${id}-pdR { 0%,100% { transform: rotate(82deg); } 50% { transform: rotate(0deg); } }
      .${id}-pdL { animation: ${id}-pdL 2s ease-in-out infinite; transform-origin: 80px 114px; }
      .${id}-pdR { animation: ${id}-pdR 2s ease-in-out infinite; transform-origin: 120px 114px; }
    `}</style>
    <rect x="92" y="2" width="7" height="230" rx="3" fill={`url(#${id}-mt)`} filter={`url(#${id}-ds)`} />
    <rect x="78" y="2" width="34" height="7" rx="3" fill={`url(#${id}-mtH)`} />
    <rect x="100" y="22" width="14" height="52" rx="2" fill={`url(#${id}-pl)`} filter={`url(#${id}-ds)`} />
    <AnaLeg id={id} pts={[88, 134, 84, 168, 82, 206]} side="L" />
    <AnaLeg id={id} pts={[112, 134, 116, 168, 118, 206]} side="R" />
    <Shoe id={id} cx={80} cy={212} />
    <Shoe id={id} cx={120} cy={212} />
    <Shorts id={id} cx={100} top={118} />
    <AnaTorso id={id} cx={100} top={60} h={60} />
    <Head id={id} cx={100} cy={42} />
    <AnaArm id={id} pts={[76, 66, 80, 90, 80, 114]} side="L" w={9} />
    <AnaArm id={id} pts={[124, 66, 120, 90, 120, 114]} side="R" w={9} />
    <g className={`${id}-pdL`}>
      <path d="M74,114 L74,148 L86,148 L86,114 Z" fill={`url(#${id}-aL)`} filter={`url(#${id}-gl)`} />
      <circle cx="80" cy="150" r="4.5" fill="#f0c8a0" />
      <line x1="80" y1="114" x2="95" y2="8" stroke="#999" strokeWidth="1.2" />
    </g>
    <g className={`${id}-pdR`}>
      <path d="M114,114 L114,148 L126,148 L126,114 Z" fill={`url(#${id}-aR)`} filter={`url(#${id}-gl)`} />
      <circle cx="120" cy="150" r="4.5" fill="#daa878" />
      <line x1="120" y1="114" x2="95" y2="8" stroke="#999" strokeWidth="1.2" />
    </g>
    <Ground />
  </>
);

const LungeAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-lu { 0%,100% { transform: translateY(0); } 50% { transform: translateY(22px); } }
      .${id}-lu { animation: ${id}-lu 2.6s ease-in-out infinite; }
    `}</style>
    <Bench id={id} x={130} y={162} w={52} h={8} />
    <g className={`${id}-lu`}>
      <Head id={id} cx={88} cy={26} />
      <AnaTorso id={id} cx={88} top={44} h={50} w={36} />
      <Shorts id={id} cx={88} top={92} w={34} />
      <AnaArm id={id} pts={[66, 50, 56, 76, 54, 104]} side="L" w={8} />
      <AnaArm id={id} pts={[110, 50, 120, 76, 122, 104]} side="R" w={8} />
      <Dumbbell id={id} cx={54} cy={110} />
      <Dumbbell id={id} cx={122} cy={110} />
    </g>
    <AnaLeg id={id} pts={[78, 110, 70, 148, 68, 200]} side="L" w={12} />
    <Shoe id={id} cx={66} cy={208} />
    <AnaLeg id={id} pts={[98, 110, 122, 134, 150, 160]} side="R" w={10} />
    <Ground />
  </>
);

const LegRaiseAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-lr { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-82deg); } }
      .${id}-lr { animation: ${id}-lr 2.2s ease-in-out infinite; transform-origin: 100px 134px; }
    `}</style>
    <rect x="10" y="8" width="180" height="6" rx="3" fill={`url(#${id}-mtH)`} filter={`url(#${id}-ds)`} />
    <rect x="8" y="4" width="6" height="16" rx="3" fill={`url(#${id}-mt)`} />
    <rect x="186" y="4" width="6" height="16" rx="3" fill={`url(#${id}-mt)`} />
    <circle cx="64" cy="14" r="5.5" fill={`url(#${id}-sk)`} />
    <circle cx="136" cy="14" r="5.5" fill={`url(#${id}-skS)`} />
    <AnaArm id={id} pts={[64, 18, 74, 44, 78, 62]} side="L" w={8} />
    <AnaArm id={id} pts={[136, 18, 126, 44, 122, 62]} side="R" w={8} />
    <Head id={id} cx={100} cy={54} />
    <AnaTorso id={id} cx={100} top={72} h={48} />
    <Shorts id={id} cx={100} top={118} />
    <g className={`${id}-lr`}>
      <AnaLeg id={id} pts={[90, 136, 86, 168, 82, 204]} side="L" w={11} />
      <AnaLeg id={id} pts={[110, 136, 114, 168, 118, 204]} side="R" w={11} />
    </g>
  </>
);

const PlankAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-pk { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
      .${id}-pk { animation: ${id}-pk 3s ease-in-out infinite; }
    `}</style>
    <g className={`${id}-pk`}>
      <Head id={id} cx={100} cy={94} r={12} />
      <AnaArm id={id} pts={[72, 116, 60, 130, 54, 152]} side="L" w={8} />
      <AnaArm id={id} pts={[128, 116, 140, 130, 146, 152]} side="R" w={8} />
      <path d={`M70,110 Q100,104 130,110 L126,148 Q100,152 74,148 Z`} fill={`url(#${id}-tsk)`} filter={`url(#${id}-ds)`} />
      <path d={`M70,110 Q100,104 130,110 L126,148 Q100,152 74,148 Z`} fill={`url(#${id}-tskV)`} />
      <ellipse cx={88} cy={162} rx={6} ry={4} fill={`url(#${id}-sho)`} />
      <ellipse cx={112} cy={162} rx={6} ry={4} fill={`url(#${id}-sho)`} />
    </g>
    <line x1="10" y1="160" x2="190" y2="160" stroke="#334155" strokeWidth="1.5" />
  </>
);

const PlankSideAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-sp { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
      .${id}-sp { animation: ${id}-sp 3s ease-in-out infinite; }
    `}</style>
    <g className={`${id}-sp`}>
      <Head id={id} cx={100} cy={40} r={12} />
      <AnaArm id={id} pts={[100, 56, 100, 30, 100, 12]} side="L" w={7} />
      <path d={`M80,62 Q100,56 120,62 L130,140 Q100,146 70,140 Z`} fill={`url(#${id}-tsk)`} filter={`url(#${id}-ds)`} />
      <AnaArm id={id} pts={[120, 66, 142, 104, 150, 152]} side="R" w={8} />
      <Shorts id={id} cx={100} top={138} h={14} w={36} />
      <AnaLeg id={id} pts={[90, 152, 72, 166, 54, 158]} side="L" w={9} />
      <AnaLeg id={id} pts={[110, 152, 82, 168, 62, 162]} side="R" w={9} />
      <Shoe id={id} cx={52} cy={160} />
      <Shoe id={id} cx={60} cy={166} />
    </g>
    <line x1="10" y1="168" x2="190" y2="168" stroke="#334155" strokeWidth="1.5" />
  </>
);

const JumpAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-j {
        0%,15% { transform: translateY(0); }
        25% { transform: translateY(10px); }
        50% { transform: translateY(-52px); }
        75%,100% { transform: translateY(0); }
      }
      .${id}-j { animation: ${id}-j 2s ease-in-out infinite; }
    `}</style>
    <rect x="56" y="168" width="88" height="44" rx="4" fill="#506070" filter={`url(#${id}-ds)`} />
    <rect x="58" y="170" width="84" height="4" rx="2" fill="#607080" />
    <g className={`${id}-j`}>
      <Head id={id} cx={100} cy={36} />
      <AnaTorso id={id} cx={100} top={54} h={48} />
      <Shorts id={id} cx={100} top={100} />
      <AnaArm id={id} pts={[72, 60, 58, 72, 52, 52]} side="L" w={8} />
      <AnaArm id={id} pts={[128, 60, 142, 72, 148, 52]} side="R" w={8} />
      <AnaLeg id={id} pts={[88, 118, 84, 148, 82, 180]} side="L" w={12} />
      <AnaLeg id={id} pts={[112, 118, 116, 148, 118, 180]} side="R" w={12} />
      <Shoe id={id} cx={80} cy={186} />
      <Shoe id={id} cx={120} cy={186} />
    </g>
    <Ground />
  </>
);

const CrunchAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-cL { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-72deg); } }
      @keyframes ${id}-cR { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(72deg); } }
      .${id}-cL { animation: ${id}-cL 2.5s ease-in-out infinite; transform-origin: 88px 142px; }
      .${id}-cR { animation: ${id}-cR 2.5s ease-in-out infinite; transform-origin: 112px 142px; }
    `}</style>
    <rect x="18" y="152" width="164" height="6" rx="3" fill="#3a5060" />
    <Head id={id} cx={100} cy={128} r={11} />
    <path d={`M76,138 Q100,132 124,138 L120,154 Q100,158 80,154 Z`} fill={`url(#${id}-tsk)`} filter={`url(#${id}-ds)`} />
    <Shorts id={id} cx={100} top={152} h={8} w={28} />
    <AnaArm id={id} pts={[78, 138, 68, 122, 62, 106]} side="L" w={7} />
    <AnaArm id={id} pts={[122, 138, 132, 122, 138, 106]} side="R" w={7} />
    <g className={`${id}-cL`}>
      <AnaLeg id={id} pts={[88, 160, 80, 180, 74, 200]} side="L" w={9} />
    </g>
    <g className={`${id}-cR`}>
      <AnaLeg id={id} pts={[112, 160, 120, 180, 126, 200]} side="R" w={9} />
    </g>
  </>
);

const DeadliftAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-dl { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(52deg); } }
      .${id}-dl { animation: ${id}-dl 2.8s ease-in-out infinite; transform-origin: 100px 110px; }
    `}</style>
    <g className={`${id}-dl`}>
      <Head id={id} cx={100} cy={28} />
      <AnaTorso id={id} cx={100} top={46} h={48} />
      <AnaArm id={id} pts={[74, 52, 68, 78, 64, 102]} side="L" w={9} />
      <AnaArm id={id} pts={[126, 52, 132, 78, 136, 102]} side="R" w={9} />
      <BarbellH id={id} x={20} y={100} w={160} />
    </g>
    <Shorts id={id} cx={100} top={96} />
    <AnaLeg id={id} pts={[88, 114, 82, 152, 80, 200]} side="L" />
    <AnaLeg id={id} pts={[112, 114, 118, 152, 120, 200]} side="R" />
    <Shoe id={id} cx={78} cy={208} />
    <Shoe id={id} cx={122} cy={208} />
    <Ground />
  </>
);

const ShrugAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-sh { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      .${id}-sh { animation: ${id}-sh 1.8s ease-in-out infinite; }
    `}</style>
    <AnaLeg id={id} pts={[88, 126, 84, 162, 82, 204]} side="L" />
    <AnaLeg id={id} pts={[112, 126, 116, 162, 118, 204]} side="R" />
    <Shoe id={id} cx={80} cy={210} />
    <Shoe id={id} cx={120} cy={210} />
    <Shorts id={id} cx={100} top={108} />
    <g className={`${id}-sh`}>
      <Head id={id} cx={100} cy={34} />
      <AnaTorso id={id} cx={100} top={52} h={58} />
      <AnaArm id={id} pts={[72, 58, 62, 88, 60, 120]} side="L" w={9} />
      <AnaArm id={id} pts={[128, 58, 138, 88, 140, 120]} side="R" w={9} />
      <Dumbbell id={id} cx={60} cy={126} />
      <Dumbbell id={id} cx={140} cy={126} />
    </g>
    <Ground />
  </>
);

const CalfRaiseAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-cr { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
      .${id}-cr { animation: ${id}-cr 1.6s ease-in-out infinite; }
    `}</style>
    <rect x="54" y="202" width="92" height="10" rx="4" fill="#506070" filter={`url(#${id}-ds)`} />
    <g className={`${id}-cr`}>
      <Head id={id} cx={100} cy={30} />
      <AnaTorso id={id} cx={100} top={48} h={52} />
      <Shorts id={id} cx={100} top={98} />
      <AnaArm id={id} pts={[72, 54, 66, 80, 64, 106]} side="L" w={8} />
      <AnaArm id={id} pts={[128, 54, 134, 80, 136, 106]} side="R" w={8} />
      <AnaLeg id={id} pts={[88, 116, 84, 152, 82, 196]} side="L" />
      <AnaLeg id={id} pts={[112, 116, 116, 152, 118, 196]} side="R" />
      <Shoe id={id} cx={80} cy={202} />
      <Shoe id={id} cx={120} cy={202} />
    </g>
  </>
);

const HipThrustAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-ht { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-18px); } }
      .${id}-ht { animation: ${id}-ht 2.2s ease-in-out infinite; }
    `}</style>
    <Bench id={id} x={92} y={114} w={72} h={10} />
    <Head id={id} cx={132} cy={98} r={11} />
    <path d={`M110,108 Q128,102 150,106 L148,122 Q128,126 114,122 Z`} fill={`url(#${id}-tsk)`} filter={`url(#${id}-ds)`} />
    <AnaArm id={id} pts={[114, 112, 108, 124, 100, 114]} side="L" w={7} />
    <AnaArm id={id} pts={[146, 112, 154, 124, 160, 114]} side="R" w={7} />
    <g className={`${id}-ht`}>
      <Shorts id={id} cx={80} top={116} h={12} w={34} />
      <BarbellH id={id} x={28} y={112} w={104} />
    </g>
    <AnaLeg id={id} pts={[70, 128, 56, 154, 48, 162]} side="L" w={10} />
    <AnaLeg id={id} pts={[90, 128, 74, 154, 66, 162]} side="R" w={10} />
    <Shoe id={id} cx={46} cy={168} />
    <Shoe id={id} cx={64} cy={168} />
    <line x1="10" y1="174" x2="190" y2="174" stroke="#334155" strokeWidth="1.5" />
  </>
);

const ExtensionAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-ex { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(125deg); } }
      .${id}-ex { animation: ${id}-ex 2.2s ease-in-out infinite; transform-origin: 100px 40px; }
    `}</style>
    <AnaLeg id={id} pts={[88, 126, 84, 162, 82, 204]} side="L" />
    <AnaLeg id={id} pts={[112, 126, 116, 162, 118, 204]} side="R" />
    <Shoe id={id} cx={80} cy={210} />
    <Shoe id={id} cx={120} cy={210} />
    <Shorts id={id} cx={100} top={108} />
    <AnaTorso id={id} cx={100} top={52} h={58} />
    <Head id={id} cx={100} cy={34} />
    <AnaArm id={id} pts={[82, 56, 90, 36, 96, 24]} side="L" w={8} />
    <AnaArm id={id} pts={[118, 56, 110, 36, 104, 24]} side="R" w={8} />
    <g className={`${id}-ex`}>
      <path d="M94,24 L94,6 L106,6 L106,24 Z" fill={`url(#${id}-aL)`} filter={`url(#${id}-gl)`} />
      <Dumbbell id={id} cx={100} cy={2} vert={false} />
    </g>
    <Ground />
  </>
);

const FrontRaiseAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-fr { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-82deg); } }
      .${id}-frL { animation: ${id}-fr 2.4s ease-in-out infinite; transform-origin: 72px 60px; }
      .${id}-frR { animation: ${id}-fr 2.4s ease-in-out infinite; transform-origin: 128px 60px; animation-delay: -1.2s; }
    `}</style>
    <AnaLeg id={id} pts={[88, 126, 84, 162, 82, 204]} side="L" />
    <AnaLeg id={id} pts={[112, 126, 116, 162, 118, 204]} side="R" />
    <Shoe id={id} cx={80} cy={210} />
    <Shoe id={id} cx={120} cy={210} />
    <Shorts id={id} cx={100} top={108} />
    <AnaTorso id={id} cx={100} top={52} h={58} />
    <Head id={id} cx={100} cy={34} />
    <g className={`${id}-frL`}>
      <AnaArm id={id} pts={[72, 60, 62, 90, 58, 120]} side="L" w={8} />
      <Dumbbell id={id} cx={58} cy={126} vert={false} />
    </g>
    <g className={`${id}-frR`}>
      <AnaArm id={id} pts={[128, 60, 138, 90, 142, 120]} side="R" w={8} />
      <Dumbbell id={id} cx={142} cy={126} vert={false} />
    </g>
    <Ground />
  </>
);

const ReverseFlyAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-rfL { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-58deg); } }
      @keyframes ${id}-rfR { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(58deg); } }
      .${id}-rfL { animation: ${id}-rfL 2.4s ease-in-out infinite; transform-origin: 80px 86px; }
      .${id}-rfR { animation: ${id}-rfR 2.4s ease-in-out infinite; transform-origin: 120px 86px; }
    `}</style>
    <Head id={id} cx={100} cy={52} r={12} />
    <path d={`M74,66 Q100,58 126,66 L122,110 Q100,114 78,110 Z`} fill={`url(#${id}-tsk)`} filter={`url(#${id}-ds)`} />
    <path d={`M74,66 Q100,58 126,66 L122,110 Q100,114 78,110 Z`} fill={`url(#${id}-tskV)`} />
    <Shorts id={id} cx={100} top={108} />
    <AnaLeg id={id} pts={[88, 126, 84, 162, 82, 204]} side="L" w={12} />
    <AnaLeg id={id} pts={[112, 126, 116, 162, 118, 204]} side="R" w={12} />
    <Shoe id={id} cx={80} cy={210} />
    <Shoe id={id} cx={120} cy={210} />
    <g className={`${id}-rfL`}>
      <AnaArm id={id} pts={[80, 86, 64, 100, 54, 114]} side="L" w={8} />
      <Dumbbell id={id} cx={54} cy={120} vert={false} />
    </g>
    <g className={`${id}-rfR`}>
      <AnaArm id={id} pts={[120, 86, 136, 100, 146, 114]} side="R" w={8} />
      <Dumbbell id={id} cx={146} cy={120} vert={false} />
    </g>
    <Ground />
  </>
);

const PullHorizontalAnim: AC = ({ id }) => (
  <>
    <style>{`
      @keyframes ${id}-ph { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-22px); } }
      .${id}-ph { animation: ${id}-ph 2s ease-in-out infinite; }
    `}</style>
    <rect x="160" y="42" width="7" height="172" rx="3" fill={`url(#${id}-mt)`} filter={`url(#${id}-ds)`} />
    <rect x="150" y="42" width="28" height="6" rx="3" fill={`url(#${id}-mtH)`} />
    <rect x="168" y="62" width="14" height="50" rx="2" fill={`url(#${id}-pl)`} filter={`url(#${id}-ds)`} />
    <rect x="26" y="144" width="60" height="7" rx="3" fill={`url(#${id}-pd)`} filter={`url(#${id}-ds)`} />
    <rect x="54" y="151" width="5" height="28" rx="2" fill={`url(#${id}-mt)`} />
    <Head id={id} cx={58} cy={84} r={12} />
    <AnaTorso id={id} cx={58} top={102} h={38} w={28} />
    <Shorts id={id} cx={58} top={138} h={10} w={28} />
    <AnaLeg id={id} pts={[48, 148, 80, 150, 118, 140]} side="L" w={8} />
    <AnaLeg id={id} pts={[68, 148, 90, 152, 118, 156]} side="R" w={8} />
    <Shoe id={id} cx={120} cy={140} />
    <Shoe id={id} cx={120} cy={160} />
    <g className={`${id}-ph`}>
      <AnaArm id={id} pts={[44, 106, 54, 122, 80, 118]} side="L" w={7} />
      <AnaArm id={id} pts={[72, 106, 66, 122, 80, 122]} side="R" w={7} />
      <rect x="78" y="112" width="5" height="16" rx="2" fill={`url(#${id}-mtH)`} />
      <line x1="83" y1="120" x2="163" y2="48" stroke="#999" strokeWidth="1.2" />
    </g>
    <Ground />
  </>
);

// ════════════════════════════════════════════════════════
const ANIMS: Record<string, AC> = {
  "press": PressAnim,
  "fly": FlyAnim,
  "pull-down": PullDownAnim,
  "pull-horizontal": PullHorizontalAnim,
  "squat": SquatAnim,
  "curl": CurlAnim,
  "lateral-raise": LateralRaiseAnim,
  "front-raise": FrontRaiseAnim,
  "reverse-fly": ReverseFlyAnim,
  "dip": DipAnim,
  "pullup": PullupAnim,
  "row": RowAnim,
  "pushdown": PushdownAnim,
  "lunge": LungeAnim,
  "leg-raise": LegRaiseAnim,
  "plank-hold": PlankAnim,
  "plank-side": PlankSideAnim,
  "jump": JumpAnim,
  "crunch": CrunchAnim,
  "deadlift": DeadliftAnim,
  "shrug": ShrugAnim,
  "calf-raise": CalfRaiseAnim,
  "hip-thrust": HipThrustAnim,
  "extension": ExtensionAnim,
};
