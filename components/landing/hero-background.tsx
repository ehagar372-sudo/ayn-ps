/**
 * Decorative animated backdrop for the landing hero: a faded grid, two soft
 * glows, a schematic road network with moving dashes and a slow scan line.
 * Pure CSS/SVG (no client JS); motion is disabled by prefers-reduced-motion.
 */
export function HeroBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />

      <div className="absolute -top-44 left-1/2 size-[42rem] rounded-full bg-blue/20 blur-3xl animate-drift" />
      <div className="absolute -bottom-52 -right-32 size-[32rem] rounded-full bg-violet/15 blur-3xl animate-drift-reverse" />

      <svg
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full opacity-70 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]"
      >
        <g fill="none" strokeLinecap="round">
          <g className="stroke-blue" strokeOpacity="0.22" strokeWidth="3">
            <path d="M-20 170 C 200 120, 380 260, 600 210 S 980 120, 1220 190" />
            <path d="M-20 440 C 180 400, 360 480, 590 430 S 960 380, 1220 450" />
            <path d="M210 -20 C 250 160, 170 330, 260 620" />
            <path d="M610 -20 C 580 170, 650 340, 620 620" />
            <path d="M980 -20 C 1030 150, 940 330, 1040 620" />
          </g>
          <g className="stroke-cyan animate-road-flow" strokeOpacity="0.55" strokeWidth="2" strokeDasharray="10 54">
            <path d="M-20 170 C 200 120, 380 260, 600 210 S 980 120, 1220 190" />
            <path d="M-20 440 C 180 400, 360 480, 590 430 S 960 380, 1220 450" />
            <path d="M210 -20 C 250 160, 170 330, 260 620" />
            <path d="M980 -20 C 1030 150, 940 330, 1040 620" />
          </g>
        </g>
        <g className="text-cyan">
          {[
            [600, 210],
            [260, 330],
            [980, 175],
            [590, 430],
            [1040, 470],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" fill="currentColor" className="animate-pulse-dot" />
          ))}
        </g>
      </svg>

      <div className="absolute inset-x-0 top-0 h-full">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan/60 to-transparent animate-hero-scan" />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}
