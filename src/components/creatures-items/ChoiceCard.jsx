import { motion } from "framer-motion";

// The SVG corner ornament from public/images/arrow-head.svg,
// inlined with stroke="currentColor" so color is fully CSS-driven.
// The SVG is designed for the top-right corner — rotate via transforms for other positions.
function ArrowHeadCorner() {
  return (
    <svg
      viewBox="0 0 37 36"
      fill="none"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M35.178,1.558l0,32.25"
        stroke="currentColor"
        strokeWidth="2.08"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M35.178,1.558l-33.179,0"
        stroke="currentColor"
        strokeWidth="2.08"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26.941,9.558l0,16.06"
        stroke="currentColor"
        strokeWidth="2.08"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26.941,25.571l8.237,8.237"
        stroke="currentColor"
        strokeWidth="2.08"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.999,1.558l8,8"
        stroke="currentColor"
        strokeWidth="2.08"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.911,1.558l0,16.06"
        stroke="currentColor"
        strokeWidth="2.08"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26.941,9.558l-16.705,0"
        stroke="currentColor"
        strokeWidth="2.08"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34.971,17.588l-16.06,0"
        stroke="currentColor"
        strokeWidth="2.08"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Corner size in px — must match the w-14 (56px) on the corner divs below
// AND the left/right/top/bottom offsets on the edge lines.
const C = 56;

// The outer paths in the SVG sit at x≈53px and y≈2.4px within the 56px rendered area.
// Edge lines start/end at 52px from each side to slightly overlap, hiding any sub-pixel gap.
const EDGE_INSET = 52;
const EDGE_OFFSET = 1.5; // px from top/bottom/left/right edge to center the line

export default function ChoiceCard({
  icon,
  title,
  description,
  onClick,
  disabled = false,
  comingSoon = false,
}) {
  const colorIdle = disabled
    ? "text-dark-border"
    : "text-dark-border group-hover:text-secondary group-active:text-primary";
  const bgIdle = disabled
    ? "bg-dark-border"
    : "bg-dark-border group-hover:bg-secondary group-active:bg-primary";

  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { y: -4 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`relative flex flex-col items-center justify-center gap-6 p-14 text-center w-full transition-colors duration-200 group ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
    >
      {/* ── Corner SVGs ──────────────────────────────────────────────
          Top-right: as-is.
          Top-left:  mirror horizontally (scaleX -1).
          Bottom-right: mirror vertically (scaleY -1).
          Bottom-left: mirror both (scale -1 -1).
      ───────────────────────────────────────────────────────────── */}
      <div
        className={`pointer-events-none absolute w-14 h-14 transition-colors duration-200 ${colorIdle}`}
        style={{ top: 0, right: 0 }}
      >
        <ArrowHeadCorner />
      </div>
      <div
        className={`pointer-events-none absolute w-14 h-14 transition-colors duration-200 ${colorIdle}`}
        style={{ top: 0, left: 0, transform: "scaleX(-1)" }}
      >
        <ArrowHeadCorner />
      </div>
      <div
        className={`pointer-events-none absolute w-14 h-14 transition-colors duration-200 ${colorIdle}`}
        style={{ bottom: 0, right: 0, transform: "scaleY(-1)" }}
      >
        <ArrowHeadCorner />
      </div>
      <div
        className={`pointer-events-none absolute w-14 h-14 transition-colors duration-200 ${colorIdle}`}
        style={{ bottom: 0, left: 0, transform: "scale(-1,-1)" }}
      >
        <ArrowHeadCorner />
      </div>

      {/* ── Edge lines connecting the corners ──────────────────────── */}
      {/* Top */}
      <div
        className={`pointer-events-none absolute transition-colors duration-200 ${bgIdle}`}
        style={{
          top: EDGE_OFFSET,
          left: EDGE_INSET,
          right: EDGE_INSET,
          height: 2,
        }}
      />
      {/* Bottom */}
      <div
        className={`pointer-events-none absolute transition-colors duration-200 ${bgIdle}`}
        style={{
          bottom: EDGE_OFFSET,
          left: EDGE_INSET,
          right: EDGE_INSET,
          height: 2,
        }}
      />
      {/* Left */}
      <div
        className={`pointer-events-none absolute transition-colors duration-200 ${bgIdle}`}
        style={{
          left: EDGE_OFFSET,
          top: EDGE_INSET,
          bottom: EDGE_INSET,
          width: 2,
        }}
      />
      {/* Right */}
      <div
        className={`pointer-events-none absolute transition-colors duration-200 ${bgIdle}`}
        style={{
          right: EDGE_OFFSET,
          top: EDGE_INSET,
          bottom: EDGE_INSET,
          width: 2,
        }}
      />

      {/* ── Content ─────────────────────────────────────────────────── */}
      <div
        className={`transition-colors duration-200 ${
          disabled
            ? "text-secondary"
            : "text-secondary group-hover:text-primary"
        }`}
      >
        {icon}
      </div>

      <div className="flex flex-col items-center gap-1.5">
        <p
          className={`text-base uppercase tracking-widest font-bold transition-colors duration-200 ${
            disabled
              ? "text-secondary"
              : "text-secondary group-hover:text-primary"
          }`}
        >
          {title}
        </p>
        {comingSoon && (
          <span className="text-[10px] uppercase tracking-widest text-dark-border border border-dark-border px-2 py-0.5">
            Coming soon
          </span>
        )}
      </div>

      <p className="text-secondary text-sm leading-relaxed max-w-[220px]">
        {description}
      </p>
    </motion.button>
  );
}
