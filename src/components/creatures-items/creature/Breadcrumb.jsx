import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SEPARATOR = "›";

function BreadcrumbStep({ step, isLast }) {
  const [hovered, setHovered] = useState(false);

  if (step.onClick) {
    return (
      <div
        className="relative flex items-center"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <button
          onClick={step.onClick}
          className="text-secondary hover:text-primary transition-colors duration-150 text-sm uppercase tracking-widest cursor-pointer"
        >
          {step.label}
        </button>

        <AnimatePresence>
          {hovered && step.tooltip && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 pointer-events-none"
            >
              <div className="bg-primary text-dark-bg text-xs font-bold uppercase tracking-wide px-4 py-2 whitespace-nowrap">
                {step.tooltip}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <span
      className={`text-sm uppercase tracking-widest ${isLast ? "text-primary" : "text-secondary"}`}
    >
      {step.label}
    </span>
  );
}

export default function Breadcrumb({ steps }) {
  return (
    <div className="flex flex-col gap-2 w-fit">
      <nav className="flex items-center gap-2">
        <AnimatePresence mode="popLayout">
          {steps.map((step, i) => (
            <motion.span
              key={step.label}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="flex items-center gap-2"
            >
              {i > 0 && (
                <span className="text-secondary text-sm select-none">
                  {SEPARATOR}
                </span>
              )}
              <BreadcrumbStep step={step} isLast={i === steps.length - 1} />
            </motion.span>
          ))}
        </AnimatePresence>
      </nav>

      {/* Glowing underline */}
      <div className="relative h-px w-full">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--color-secondary) 35%, var(--color-secondary) 65%, transparent)",
            filter: "blur(3px)",
            opacity: 0.7,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--color-secondary) 35%, var(--color-secondary) 65%, transparent)",
          }}
        />
      </div>
    </div>
  );
}
