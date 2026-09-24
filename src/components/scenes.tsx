import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Spark } from "@/components/Spark";
import { WorldEmblem } from "@/components/WorldPortals";

/**
 * The "night journey" scenery: stars, moons, layered hills, dotted trails,
 * arches and a handful of flat illustrations. Pure SVG, no gradients.
 */

export const C = {
  night: "hsl(var(--night))",
  dusk: "hsl(var(--dusk))",
  dusk2: "hsl(var(--dusk-2))",
  dusk3: "hsl(var(--dusk-3))",
  paper: "hsl(var(--background))",
  lav: "hsl(var(--primary-soft))",
  ink: "hsl(var(--foreground))",
  spark: "hsl(var(--primary))",
  sparkDark: "hsl(var(--primary-dark))",
  gold: "hsl(var(--secondary))",
  goldDark: "hsl(var(--secondary-dark))",
  goldInk: "hsl(var(--secondary-foreground))",
  goldSoft: "#FFF6D6",
  goldLight: "#FFD34D",
  blue: "hsl(var(--safe))",
  blueDark: "hsl(var(--safe-dark))",
  blueSoft: "hsl(var(--safe-soft))",
  blueLight: "#45ADF6",
  pink: "hsl(var(--stronger))",
  pinkDark: "hsl(var(--stronger-dark))",
  pinkSoft: "hsl(var(--stronger-soft))",
  pinkLight: "#F5709F",
  pinkMid: "#D94A83",
};

// ---------- geometry ----------

/** Small deterministic random generator, so scenes look the same on every render. */
export const rng = (seed: number) => {
  let s = (seed * 2654435761) >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

type Pt = [number, number];

export const smooth = (pts: Pt[], closeTo?: number) => {
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const [p1, p2] = [pts[i], pts[i + 1]];
    const p3 = pts[i + 2] ?? p2;
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  if (closeTo !== undefined) d += ` V${closeTo} H${pts[0][0].toFixed(1)} Z`;
  return d;
};

export const archPath = (w: number, h: number, rb = 28) => {
  const r = w / 2;
  return `M0 ${r} A${r} ${r} 0 0 1 ${w} ${r} V${h - rb} Q${w} ${h} ${w - rb} ${h} H${rb} Q0 ${h} 0 ${h - rb} Z`;
};

// ---------- primitives ----------

export const Stars = ({ w, h, n, seed, x0 = 0, y0 = 0, maxR = 2.4, color = "#fff" }: { w: number; h: number; n: number; seed: number; x0?: number; y0?: number; maxR?: number; color?: string }) => {
  const r = rng(seed);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={x0 + r() * w} cy={y0 + r() * h} r={0.8 + r() * (maxR - 0.8)} fill={color} fillOpacity={0.35 + r() * 0.6} />
      ))}
    </g>
  );
};

export const Twinkle = ({ x, y, s = 10, color = "#fff" }: { x: number; y: number; s?: number; color?: string }) => {
  const k = s * 0.18;
  return (
    <path
      d={`M${x} ${y - s} Q${x + k} ${y - k} ${x + s} ${y} Q${x + k} ${y + k} ${x} ${y + s} Q${x - k} ${y + k} ${x - s} ${y} Q${x - k} ${y - k} ${x} ${y - s} Z`}
      fill={color}
    />
  );
};

export const Moon = ({ x, y, r, sky, color = C.goldSoft }: { x: number; y: number; r: number; sky: string; color?: string }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={color} />
    <circle cx={x - r * 0.35} cy={y - r * 0.3} r={r * 0.88} fill={sky} />
  </g>
);

export const Hill = ({ w, h, base, amp, seed, color, n = 6 }: { w: number; h: number; base: number; amp: number; seed: number; color: string; n?: number }) => {
  const r = rng(seed);
  const pts: Pt[] = Array.from({ length: n + 1 }, (_, i) => [-40 + ((w + 80) * i) / n, base + (r() * 2 - 1) * amp]);
  return <path d={smooth(pts, h + 2)} fill={color} />;
};

export const Dotted = ({ pts, color, width = 5, gap = 12, opacity = 1 }: { pts: Pt[]; color: string; width?: number; gap?: number; opacity?: number }) => (
  <path d={smooth(pts)} fill="none" stroke={color} strokeOpacity={opacity} strokeWidth={width} strokeLinecap="round" strokeDasharray={`0.1 ${gap}`} />
);

type Layer = { base: number; amp: number; seed: number; color: string };

/** Hills along the bottom of a section, stretched to full width. The last layer is the next section's colour. */
export const SceneEdge = ({ layers, className }: { layers: Layer[]; className?: string }) => (
  <svg viewBox="0 0 1440 110" preserveAspectRatio="none" aria-hidden className={cn("pointer-events-none absolute inset-x-0 -bottom-px block h-16 w-full sm:h-24", className)}>
    {layers.map((l, i) => (
      <Hill key={i} w={1440} h={110} {...l} />
    ))}
  </svg>
);

/** A starry sky that covers its (relative) parent. */
export const StarSky = ({ seed, count = 110, className, children }: { seed: number; count?: number; className?: string; children?: ReactNode }) => (
  <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}>
    <Stars w={1440} h={900} n={count} seed={seed} />
    {children}
  </svg>
);

// ---------- hero portal ----------

/** A gold-framed arch with a night sky, sized by what it holds. */
export const HeroPortal = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("relative w-full", className)}>
    <svg viewBox="0 0 520 262" className="block h-auto w-full" aria-hidden>
      <defs>
        <clipPath id="hero-portal-cap">
          <path d="M4 262 A256 256 0 0 1 516 262 Z" />
        </clipPath>
      </defs>
      <path d="M4 262 A256 256 0 0 1 516 262 Z" fill={C.spark} />
      <g clipPath="url(#hero-portal-cap)">
        <Stars w={520} h={262} n={34} seed={41} />
        <Twinkle x={120} y={150} s={12} color={C.goldLight} />
        <Twinkle x={420} y={120} s={9} />
      </g>
      <path d="M4 262 A256 256 0 0 1 516 262" fill="none" stroke={C.gold} strokeWidth={8} />
    </svg>
    <div className="relative -mt-px rounded-b-[28px] border-x-[8px] border-b-[8px] border-secondary bg-primary px-[5%] pb-16 shadow-[0_12px_0_#0E0B2E] sm:pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-b-[20px]">
        <svg viewBox="0 0 520 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-20 w-full sm:h-24">
          <Hill w={520} h={120} base={50} amp={14} seed={42} color={C.sparkDark} n={4} />
          <Hill w={520} h={120} base={84} amp={10} seed={43} color={C.dusk3} n={4} />
        </svg>
      </div>
      <div className="relative -mt-[28%] flex justify-center">{children}</div>
    </div>
  </div>
);

// ---------- mini-game arches (208 x 250) ----------

export type GameKind = "veeg" | "speur" | "bouw" | "kies" | "volgorde";

const GAME_BG: Record<GameKind, [string, string]> = {
  veeg: [C.blueSoft, "#CBE6FB"],
  speur: [C.goldSoft, "#FFE7A3"],
  bouw: [C.pinkSoft, "#FFD3E3"],
  kies: [C.lav, "#DAD2FF"],
  volgorde: [C.blueSoft, "#CBE6FB"],
};

const GameArt = ({ kind }: { kind: GameKind }) => {
  switch (kind) {
    case "veeg":
      return (
        <g>
          <g transform="rotate(-9 104 150)">
            <rect x={54} y={104} width={100} height={116} rx={16} fill={C.blueLight} />
            <rect x={54} y={98} width={100} height={116} rx={16} fill="#fff" />
            <circle cx={104} cy={136} r={18} fill={C.blue} />
            <path d="M96 136 l6 6 l10 -11" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <rect x={72} y={166} width={64} height={8} rx={4} fill={C.blueSoft} />
            <rect x={80} y={182} width={48} height={8} rx={4} fill={C.blueSoft} />
          </g>
          <path d="M40 176 q-18 -14 -8 -34 M30 138 l2 10 l10 -2" stroke={C.blueDark} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M168 176 q18 -14 8 -34 M178 138 l-2 10 l-10 -2" stroke={C.blueDark} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    case "speur":
      return (
        <g>
          <rect x={30} y={92} width={130} height={104} rx={18} fill="#fff" />
          <path d="M50 196 l-4 20 l22 -20 Z" fill="#fff" />
          <rect x={46} y={112} width={96} height={9} rx={4.5} fill="#EFE3C4" />
          <rect x={46} y={130} width={70} height={9} rx={4.5} fill={C.pink} />
          <rect x={46} y={148} width={88} height={9} rx={4.5} fill="#EFE3C4" />
          <rect x={46} y={166} width={54} height={9} rx={4.5} fill="#EFE3C4" />
          <circle cx={128} cy={140} r={30} fill="#fff" fillOpacity={0.35} stroke={C.ink} strokeWidth={8} />
          <path d="M150 162 l26 26" stroke={C.ink} strokeWidth={12} strokeLinecap="round" />
        </g>
      );
    case "bouw":
      return (
        <g>
          {[
            [44, 176, 120, C.sparkDark, C.spark],
            [58, 134, 92, C.goldDark, C.gold],
            [72, 92, 64, C.pinkDark, C.pink],
          ].map(([x, y, w, d, c]) => (
            <g key={String(y)}>
              <rect x={x as number} y={(y as number) + 5} width={w as number} height={34} rx={10} fill={d as string} />
              <rect x={x as number} y={y as number} width={w as number} height={34} rx={10} fill={c as string} />
            </g>
          ))}
          <rect x={60} y={189} width={50} height={7} rx={3.5} fill="#fff" fillOpacity={0.7} />
          <rect x={74} y={147} width={40} height={7} rx={3.5} fill={C.goldInk} fillOpacity={0.45} />
          <rect x={86} y={105} width={30} height={7} rx={3.5} fill="#fff" fillOpacity={0.7} />
          <Twinkle x={162} y={88} s={9} color={C.gold} />
        </g>
      );
    case "kies":
      return (
        <g>
          {[96, 138, 180].map((y, i) => {
            const sel = i === 1;
            return (
              <g key={y}>
                <rect x={36} y={y} width={136} height={32} rx={12} fill={sel ? C.spark : "#fff"} />
                <circle cx={54} cy={y + 16} r={7} fill={sel ? "#fff" : "#E6E1F0"} />
                <rect x={70} y={y + 12} width={sel ? 70 : 84} height={8} rx={4} fill={sel ? "#fff" : "#E6E1F0"} fillOpacity={sel ? 0.8 : 1} />
              </g>
            );
          })}
          <path d="M148 150 l0 34 l9 -9 l7 14 l6 -3 l-7 -14 l12 0 Z" fill={C.ink} stroke="#fff" strokeWidth={3} strokeLinejoin="round" />
        </g>
      );
    case "volgorde": {
      const pts: Pt[] = [
        [52, 196],
        [104, 160],
        [156, 124],
      ];
      return (
        <g>
          <Dotted pts={pts} color={C.blueDark} gap={10} />
          {pts.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y + 4} r={18} fill={C.blueDark} />
              <circle cx={x} cy={y} r={18} fill={C.blue} />
              <text x={x} y={y + 6} textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={17} fill="#fff">
                {i + 1}
              </text>
            </g>
          ))}
          <rect x={170} y={70} width={3} height={40} fill={C.ink} />
          <path d="M173 70 L196 78 L173 86 Z" fill={C.gold} />
        </g>
      );
    }
  }
};

export const GameArch = ({ kind, className }: { kind: GameKind; className?: string }) => {
  const [bg, ground] = GAME_BG[kind];
  const arch = archPath(208, 250, 22);
  return (
    <svg viewBox="0 0 208 258" aria-hidden className={cn("block h-auto w-full", className)}>
      <defs>
        <clipPath id={`game-${kind}`}>
          <path d={arch} />
        </clipPath>
      </defs>
      <path d={arch} fill="hsl(var(--border))" transform="translate(0 7)" />
      <g clipPath={`url(#game-${kind})`}>
        <rect width={208} height={250} fill={bg} />
        <Stars w={208} h={70} n={6} seed={kind.length * 7} />
        <path d="M0 214 C60 200 150 210 208 202 V250 H0 Z" fill={ground} />
        <GameArt kind={kind} />
      </g>
    </svg>
  );
};

// ---------- framed scene helper ----------

const Framed = ({ id, w, h, depth, label, children, className }: { id: string; w: number; h: number; depth: string; label: string; children: ReactNode; className?: string }) => {
  const arch = archPath(w, h, 28);
  return (
    <svg viewBox={`0 0 ${w} ${h + 10}`} role="img" aria-label={label} className={cn("block h-auto w-full", className)}>
      <defs>
        <clipPath id={id}>
          <path d={arch} />
        </clipPath>
      </defs>
      <path d={arch} fill={depth} transform="translate(0 10)" />
      <g clipPath={`url(#${id})`}>{children}</g>
    </svg>
  );
};

/** Nested Spark, placed inside another SVG. */
const SparkAt = ({ x, y, size, waving = true }: { x: number; y: number; size: number; waving?: boolean }) => (
  <g transform={`translate(${x} ${y})`}>
    <Spark size={size} mood="happy" waving={waving} animate={false} />
  </g>
);

// ---------- house at night (parents) ----------

export const HouseScene = ({ className }: { className?: string }) => (
  <Framed id="house" w={460} h={560} depth={C.sparkDark} label="Een huis bij nacht met verlichte ramen, en Spark in de tuin" className={className}>
    <rect width={460} height={560} fill={C.dusk} />
    <Stars w={460} h={300} n={34} seed={5} />
    <Moon x={360} y={110} r={38} sky={C.dusk} />
    <Twinkle x={96} y={120} s={10} color={C.gold} />
    <Twinkle x={250} y={70} s={7} />
    <Hill w={460} h={560} base={380} amp={30} seed={3} color={C.dusk2} />
    <Hill w={460} h={560} base={430} amp={22} seed={8} color={C.dusk3} />
    <circle cx={84} cy={360} r={52} fill={C.sparkDark} />
    <circle cx={60} cy={392} r={40} fill={C.sparkDark} />
    <rect x={78} y={390} width={12} height={70} rx={4} fill={C.ink} />
    <rect x={262} y={206} width={30} height={60} fill={C.pinkDark} />
    <rect x={140} y={292} width={190} height={170} fill={C.paper} />
    <path d="M118 298 L235 204 L352 298 Z" fill={C.pink} />
    <path d="M118 298 L235 204 L235 298 Z" fill={C.pinkLight} fillOpacity={0.5} />
    {[162, 254].map((x) => (
      <g key={x}>
        <rect x={x} y={322} width={54} height={50} rx={8} fill={C.gold} />
        <path d={`M${x + 27} 322 V372 M${x} 347 H${x + 54}`} stroke={C.goldDark} strokeWidth={5} />
      </g>
    ))}
    <path d="M214 462 V408 C214 396 222 388 235 388 C248 388 256 396 256 408 V462 Z" fill={C.sparkDark} />
    <circle cx={248} cy={428} r={3.5} fill={C.gold} />
    <Hill w={460} h={560} base={470} amp={16} seed={13} color={C.spark} />
    <Dotted pts={[[235, 470], [220, 500], [250, 530], [230, 570]]} color={C.goldSoft} />
    <SparkAt x={320} y={380} size={118} />
  </Framed>
);

// ---------- school by day (teachers) ----------

export const SchoolScene = ({ className }: { className?: string }) => (
  <Framed id="school" w={460} h={540} depth={C.blueDark} label="Een school in de zon" className={className}>
    <rect width={460} height={540} fill={C.blueLight} />
    <circle cx={360} cy={96} r={60} fill={C.gold} fillOpacity={0.25} />
    <circle cx={360} cy={96} r={44} fill={C.gold} />
    <rect x={60} y={86} width={96} height={28} rx={14} fill="#fff" />
    <rect x={86} y={68} width={48} height={32} rx={16} fill="#fff" />
    <Hill w={460} h={540} base={370} amp={26} seed={4} color={C.blue} />
    <circle cx={52} cy={380} r={40} fill={C.blueDark} />
    <rect x={47} y={400} width={10} height={60} rx={4} fill={C.ink} />
    <circle cx={412} cy={372} r={34} fill={C.blueDark} />
    <rect x={407} y={392} width={10} height={60} rx={4} fill={C.ink} />
    <rect x={88} y={270} width={284} height={180} fill={C.paper} />
    <rect x={80} y={258} width={300} height={18} rx={6} fill={C.pinkDark} />
    <rect x={176} y={206} width={108} height={70} fill={C.paper} />
    <path d="M164 212 L230 156 L296 212 Z" fill={C.pink} />
    <circle cx={230} cy={232} r={20} fill="#fff" stroke={C.ink} strokeWidth={4} />
    <path d="M230 221 V232 L238 238" stroke={C.ink} strokeWidth={3.5} fill="none" strokeLinecap="round" />
    <rect x={228} y={116} width={3} height={42} fill={C.ink} />
    <path d="M231 116 L256 124 L231 132 Z" fill={C.gold} />
    {[104, 144, 300, 340].flatMap((x) =>
      [298, 352].map((y) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width={26} height={30} rx={6} fill={C.blue} />
          <path d={`M${x + 13} ${y} V${y + 30}`} stroke="#fff" strokeWidth={3} />
        </g>
      )),
    )}
    <path d="M206 450 V392 C206 378 216 368 230 368 C244 368 254 378 254 392 V450 Z" fill={C.sparkDark} />
    <path d="M0 446 C120 430 330 440 460 428 V540 H0 Z" fill={C.blueDark} />
    <Dotted pts={[[230, 452], [200, 480], [260, 506], [230, 545]]} color={C.blueSoft} />
  </Framed>
);

// ---------- the €0 coin ----------

export const CoinScene = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 440 380" role="img" aria-label="Een gouden munt met €0" className={cn("block h-auto w-full", className)}>
    <circle cx={220} cy={190} r={178} fill={C.goldSoft} />
    <Twinkle x={70} y={90} s={14} color={C.gold} />
    <Twinkle x={380} y={120} s={11} color={C.gold} />
    <Twinkle x={350} y={300} s={9} color={C.pink} />
    <Twinkle x={88} y={290} s={8} color={C.spark} />
    <circle cx={220} cy={200} r={118} fill={C.goldDark} />
    <circle cx={220} cy={188} r={118} fill={C.gold} />
    <circle cx={220} cy={188} r={94} fill="none" stroke={C.goldLight} strokeWidth={12} />
    <text x={220} y={226} textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={112} fill={C.goldInk}>
      €0
    </text>
    <path d="M168 102 q30 -18 70 -10" stroke="#fff" strokeOpacity={0.6} strokeWidth={10} fill="none" strokeLinecap="round" />
  </svg>
);

// ---------- sunrise (closing call to action) ----------

const SunriseArt = ({ w, h, sun, sunR, peak, spark }: { w: number; h: number; sun: Pt; sunR: number; peak: Pt; spark: [number, number, number] }) => {
  const [px, py] = peak;
  return (
    <>
      <rect width={w} height={h} fill={C.pink} />
      <Stars w={w} h={h * 0.35} n={Math.round(w / 30)} seed={31} />
      <circle cx={sun[0]} cy={sun[1]} r={sunR * 1.35} fill={C.pinkLight} />
      <circle cx={sun[0]} cy={sun[1]} r={sunR} fill={C.gold} />
      <Hill w={w} h={h} base={h * 0.72} amp={h * 0.08} seed={17} color={C.pinkMid} n={5} />
      <path d={`M${px} ${py} L${px - h * 0.55} ${h} L${px} ${h} Z`} fill={C.pinkLight} />
      <path d={`M${px} ${py} L${px + h * 0.55} ${h} L${px} ${h} Z`} fill={C.pinkDark} />
      <path d={`M${px} ${py} L${px - 26} ${py + 42} L${px - 12} ${py + 36} L${px} ${py + 50} L${px + 12} ${py + 36} L${px + 26} ${py + 42} Z`} fill={C.pinkSoft} />
      <g transform={`translate(${px - 38} ${py - 92}) scale(0.8)`}>
        <WorldEmblem pillar="stronger" main="#fff" depth={C.pinkDark} inner={C.pink} />
      </g>
      <Hill w={w} h={h} base={h * 0.86} amp={h * 0.04} seed={21} color={C.dusk} n={5} />
      <SparkAt x={spark[0]} y={spark[1]} size={spark[2]} />
    </>
  );
};

export const SunriseScene = () => (
  <>
    <svg viewBox="0 0 1440 720" preserveAspectRatio="xMidYMax slice" aria-hidden className="pointer-events-none absolute inset-0 hidden h-full w-full md:block">
      <SunriseArt w={1440} h={720} sun={[720, 540]} sunR={150} peak={[1110, 300]} spark={[170, 470, 190]} />
    </svg>
    <svg viewBox="0 0 390 760" preserveAspectRatio="xMidYMax slice" aria-hidden className="pointer-events-none absolute inset-0 h-full w-full md:hidden">
      <SunriseArt w={390} h={760} sun={[210, 560]} sunR={90} peak={[300, 420]} spark={[20, 560, 130]} />
    </svg>
  </>
);
