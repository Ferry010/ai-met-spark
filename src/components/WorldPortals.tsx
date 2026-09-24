import type { ReactNode } from "react";
import type { Pillar, World } from "@/content/missions";
import { cn } from "@/lib/utils";

/**
 * The three worlds as arched "portals", each with a small flat scene:
 * Veilig = a castle with a shield, Slim = a lighthouse that checks everything,
 * Sterker = a mountain with a star on top. A trail of mission stops (1–5)
 * leads to the boss (crown) at the landmark.
 */

const INK = "hsl(var(--foreground))";
const CROWN = "M2 17 L1 5 L8 10 L13 2 L18 10 L25 5 L24 17 Z";
const ARCH = "M0 176 A176 176 0 0 1 352 176 V412 Q352 440 324 440 H28 Q0 440 0 412 Z";
const SHIELD = "M48 8 L84 20 V48 C84 72 68 88 48 96 C28 88 12 72 12 48 V20 Z";

const STAR = (() => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? 42 : 18;
    const a = ((-90 + 36 * i) * Math.PI) / 180;
    return `${(48 + r * Math.cos(a)).toFixed(1)} ${(50 + r * Math.sin(a)).toFixed(1)}`;
  });
  return `M${pts.join(" L")} Z`;
})();

const COLORS: Record<Pillar, { c: string; d: string; s: string; fg: string; light: string; deep: string }> = {
  safe: {
    c: "hsl(var(--safe))",
    d: "hsl(var(--safe-dark))",
    s: "hsl(var(--safe-soft))",
    fg: "hsl(var(--safe-foreground))",
    light: "#45ADF6",
    deep: "#0B4671",
  },
  smart: {
    c: "hsl(var(--smart))",
    d: "hsl(var(--smart-dark))",
    s: "hsl(var(--smart-soft))",
    fg: "hsl(var(--smart-foreground))",
    light: "#FFD34D",
    deep: "hsl(var(--smart-dark))",
  },
  stronger: {
    c: "hsl(var(--stronger))",
    d: "hsl(var(--stronger-dark))",
    s: "hsl(var(--stronger-soft))",
    fg: "hsl(var(--stronger-foreground))",
    light: "#F5709F",
    deep: "#7E1640",
  },
};

type Pt = [number, number];

/** Smooth dotted trail through the stops. */
const Trail = ({ pts, color }: { pts: Pt[]; color: string }) => {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const [p1, p2] = [pts[i], pts[i + 1]];
    const p3 = pts[i + 2] ?? p2;
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return <path d={d} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeDasharray="0.1 11" />;
};

/** How far a kid got at a stop on the trail. */
export type StopState = "open" | "done" | "current";

const GOLD = "hsl(var(--secondary))";
const GOLD_DARK = "hsl(var(--secondary-dark))";
const GOLD_INK = "hsl(var(--secondary-foreground))";

const Stop = ({ at: [x, y], n, fill, depth, text, state = "open" }: { at: Pt; n: number; fill: string; depth: string; text: string; state?: StopState }) => {
  if (state === "done") {
    return (
      <g>
        <circle cx={x} cy={y + 3} r={13} fill={GOLD_DARK} />
        <circle cx={x} cy={y} r={13} fill={GOLD} />
        <path d={`M${x - 5.5} ${y + 0.5} l3.8 3.8 l7.2 -7.6`} stroke={GOLD_INK} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  }
  return (
    <g>
      {state === "current" && (
        <>
          <circle cx={x} cy={y} r={21} fill="none" stroke={GOLD} strokeWidth={4} />
          <circle cx={x} cy={y} r={28} fill="none" stroke={GOLD} strokeOpacity={0.35} strokeWidth={3} />
        </>
      )}
      <circle cx={x} cy={y + 3} r={13} fill={depth} />
      <circle cx={x} cy={y} r={13} fill={fill} />
      <text x={x} y={y + 4.5} textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={13} fill={text}>
        {n}
      </text>
    </g>
  );
};

const Boss = ({ at: [x, y], state = "open" }: { at: Pt; state?: StopState }) => (
  <g>
    {state === "current" && <circle cx={x} cy={y} r={28} fill="none" stroke={GOLD} strokeWidth={4} />}
    <circle cx={x} cy={y + 4} r={20} fill="#000" fillOpacity={0.3} />
    <circle cx={x} cy={y} r={20} fill={state === "done" ? GOLD : INK} />
    <path d={CROWN} fill={state === "done" ? GOLD_INK : GOLD} transform={`translate(${x - 11.5} ${y - 8}) scale(0.9)`} />
  </g>
);

type SceneProps = { states: StopState[] };
const OPEN: StopState[] = ["open", "open", "open", "open", "open", "open"];

const Stars = ({ pts }: { pts: [number, number, number][] }) => (
  <>
    {pts.map(([x, y, r]) => (
      <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#fff" fillOpacity={0.85} />
    ))}
  </>
);

/** The three world emblems (the badges on the diploma), drawn in a 96×101 box. */
export const WorldEmblem = ({ pillar, main, depth, inner = "#fff" }: { pillar: Pillar; main?: string; depth?: string; inner?: string }) => {
  const col = COLORS[pillar];
  const m = main ?? col.c;
  const dp = depth ?? col.d;
  if (pillar === "safe") {
    return (
      <g>
        <path d={SHIELD} fill={dp} transform="translate(0 5)" />
        <path d={SHIELD} fill={m} />
        <path d="M48 8 V96 C28 88 12 72 12 48 V20 Z" fill={main ? m : col.light} />
        <path d="M32 51 L44 63 L65 39" stroke={inner} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  }
  if (pillar === "smart") {
    return (
      <g>
        <circle cx={48} cy={53} r={42} fill={dp} />
        <circle cx={48} cy={48} r={42} fill={m} />
        <circle cx={48} cy={48} r={30} fill={inner} />
        {[0, 90, 180, 270].map((a) => (
          <rect key={a} x={46} y={23} width={4} height={9} rx={2} fill={dp} transform={`rotate(${a} 48 48)`} />
        ))}
        <path d="M48 22 L57 48 L39 48 Z" fill="hsl(var(--stronger))" />
        <path d="M48 74 L57 48 L39 48 Z" fill={INK} />
        <circle cx={48} cy={48} r={5} fill={inner} />
      </g>
    );
  }
  return (
    <g>
      <path d={STAR} fill={dp} stroke={dp} strokeWidth={7} strokeLinejoin="round" transform="translate(0 5)" />
      <path d={STAR} fill={m} stroke={m} strokeWidth={7} strokeLinejoin="round" />
      <path d="M60 26 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 l7 -3 Z" fill={inner} />
    </g>
  );
};

const GROUND: Pt[] = [
  [44, 404],
  [110, 372],
  [178, 404],
  [248, 372],
  [300, 338],
  [176, 300],
];
const MOUNTAIN: Pt[] = [
  [96, 412],
  [246, 390],
  [130, 346],
  [226, 300],
  [150, 254],
  [176, 200],
];

const CastleScene = ({ states }: SceneProps) => {
  const k = COLORS.safe;
  return (
    <>
      <rect width={352} height={440} fill={k.c} />
      <Stars pts={[[58, 70, 2.5], [112, 112, 2], [196, 58, 2.5], [318, 154, 2], [36, 150, 2], [150, 36, 1.8]]} />
      <circle cx={272} cy={86} r={30} fill={k.s} />
      <circle cx={260} cy={78} r={26} fill={k.c} />
      <path d="M0 262 C70 226 150 240 210 256 C270 272 320 246 352 236 V440 H0 Z" fill={k.light} />
      <rect x={100} y={104} width={3} height={34} fill={INK} />
      <path d="M103 104 L124 111 L103 118 Z" fill="hsl(var(--secondary))" />
      <rect x={249} y={104} width={3} height={34} fill={INK} />
      <path d="M252 104 L273 111 L252 118 Z" fill="hsl(var(--secondary))" />
      {[80, 96, 112, 228, 244, 260].map((x) => (
        <rect key={x} x={x} y={136} width={12} height={18} fill="#fff" />
      ))}
      <rect x={80} y={152} width={44} height={170} fill="#fff" />
      <rect x={228} y={152} width={44} height={170} fill="#fff" />
      {[124, 146, 168, 190, 212].map((x) => (
        <rect key={x} x={x} y={176} width={16} height={18} fill={k.s} />
      ))}
      <rect x={124} y={192} width={104} height={130} fill={k.s} />
      <rect x={96} y={190} width={12} height={22} rx={6} fill={k.d} />
      <rect x={244} y={190} width={12} height={22} rx={6} fill={k.d} />
      <g transform="translate(158 198) scale(0.38)">
        <WorldEmblem pillar="safe" />
      </g>
      <path d="M150 322 V278 C150 262 162 252 176 252 C190 252 202 262 202 278 V322 Z" fill={k.d} />
      <path d="M0 316 C90 296 220 312 352 298 V440 H0 Z" fill={k.d} />
      <Trail pts={GROUND} color={k.s} />
      {GROUND.slice(0, 5).map((p, i) => (
        <Stop key={i} at={p} n={i + 1} fill="#fff" depth={k.deep} text={k.d} state={states[i]} />
      ))}
      <Boss at={GROUND[5]} state={states[5]} />
    </>
  );
};

const LighthouseScene = ({ states }: SceneProps) => {
  const k = COLORS.smart;
  return (
    <>
      <rect width={352} height={440} fill={k.c} />
      <g transform="translate(40 48) scale(0.72)">
        <WorldEmblem pillar="smart" main={k.s} />
      </g>
      <rect x={244} y={66} width={80} height={24} rx={12} fill={k.s} />
      <rect x={264} y={50} width={40} height={28} rx={14} fill={k.s} />
      <path d="M190 146 L352 104 L352 196 Z" fill={k.s} fillOpacity={0.6} />
      <path d="M162 146 L0 112 L0 196 Z" fill={k.s} fillOpacity={0.6} />
      <path d="M0 270 C80 240 170 256 240 268 C300 278 330 262 352 256 V440 H0 Z" fill={k.light} />
      <path d="M150 322 L160 172 L192 172 L202 322 Z" fill="#fff" />
      <path d="M153.5 268 L198.5 268 L200 290 L152 290 Z" fill="hsl(var(--stronger))" />
      <path d="M156.9 212 L195.1 212 L196.6 234 L155.4 234 Z" fill="hsl(var(--stronger))" />
      <rect x={150} y={166} width={52} height={9} rx={4.5} fill={INK} />
      <rect x={158} y={132} width={36} height={36} rx={6} fill={INK} />
      <rect x={164} y={138} width={24} height={24} rx={4} fill={k.s} />
      <path d="M152 134 L176 108 L200 134 Z" fill={INK} />
      <circle cx={176} cy={106} r={4} fill={INK} />
      <path d="M166 322 V304 C166 296 186 296 186 304 V322 Z" fill={INK} />
      <path d="M0 316 C90 296 220 312 352 298 V440 H0 Z" fill={k.s} />
      <Trail pts={GROUND} color={k.d} />
      {GROUND.slice(0, 5).map((p, i) => (
        <Stop key={i} at={p} n={i + 1} fill={k.c} depth={k.d} text={k.fg} state={states[i]} />
      ))}
      <Boss at={GROUND[5]} state={states[5]} />
    </>
  );
};

const MountainScene = ({ states }: SceneProps) => {
  const k = COLORS.stronger;
  return (
    <>
      <rect width={352} height={440} fill={k.c} />
      <Stars pts={[[46, 60, 2.5], [98, 120, 2], [300, 70, 2.5], [316, 170, 2], [40, 190, 2], [250, 30, 1.8]]} />
      <path d="M-40 440 L60 280 L170 440 Z" fill="#D94A83" />
      <path d="M190 440 L304 246 L400 440 Z" fill="#D94A83" />
      <path d="M176 132 L-14 440 L176 440 Z" fill={k.light} />
      <path d="M176 132 L366 440 L176 440 Z" fill={k.d} />
      <path d="M176 132 L146 180 L162 174 L176 190 L190 174 L206 180 Z" fill={k.s} />
      <g transform="translate(138 30) scale(0.8)">
        <WorldEmblem pillar="stronger" main="#fff" inner={k.c} />
      </g>
      <Trail pts={MOUNTAIN} color={k.s} />
      {MOUNTAIN.slice(0, 5).map((p, i) => (
        <Stop key={i} at={p} n={i + 1} fill="#fff" depth={k.deep} text={k.d} state={states[i]} />
      ))}
      <Boss at={MOUNTAIN[5]} state={states[5]} />
    </>
  );
};

const SCENES: Record<Pillar, { scene: (p: SceneProps) => ReactNode; label: string }> = {
  safe: { scene: CastleScene, label: "een kasteel met een schild" },
  smart: { scene: LighthouseScene, label: "een vuurtoren die alles checkt" },
  stronger: { scene: MountainScene, label: "een berg met een ster op de top" },
};

const DARK_TEXT: Record<Pillar, string> = {
  safe: "text-safe-dark",
  smart: "text-smart-dark",
  stronger: "text-stronger-dark",
};

/** Just the arched scene. `states` marks each of the 6 stops; `locked` dims the world behind a padlock. */
export const WorldPortalArt = ({ world, states = OPEN, locked = false, className }: { world: World; states?: StopState[]; locked?: boolean; className?: string }) => {
  const { scene: Scene, label } = SCENES[world.pillar];
  const k = COLORS[world.pillar];
  return (
    <svg viewBox="0 0 352 448" className={cn("block h-auto w-full", className)} role="img" aria-label={`Wereld ${world.name}: ${label}${locked ? " (op slot)" : ""}`}>
      <defs>
        <clipPath id={`portal-${world.pillar}`}>
          <path d={ARCH} />
        </clipPath>
      </defs>
      <path d={ARCH} fill={k.d} transform="translate(0 8)" />
      <g clipPath={`url(#portal-${world.pillar})`}>
        <Scene states={states} />
        {locked && (
          <>
            <rect width={352} height={440} fill="hsl(var(--night))" fillOpacity={0.62} />
            <circle cx={176} cy={200} r={44} fill="hsl(var(--night))" fillOpacity={0.85} />
            <g transform="translate(152 176) scale(2)" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <rect x={5} y={11} width={14} height={10} rx={2} />
              <path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </g>
          </>
        )}
      </g>
    </svg>
  );
};

export const WorldPortal = ({ world }: { world: World }) => {
  return (
    <article className="flex flex-col gap-6">
      <WorldPortalArt world={world} />
      <div className="flex flex-col gap-1.5 px-1">
        <span className={cn("text-sm font-semibold uppercase tracking-[0.08em]", DARK_TEXT[world.pillar])}>
          Wereld {world.id} · {world.missions.length} missies
        </span>
        <h3 className="text-4xl leading-none sm:text-5xl">{world.name}</h3>
        <p className="text-lg text-muted-foreground">{world.tagline}</p>
      </div>
    </article>
  );
};
