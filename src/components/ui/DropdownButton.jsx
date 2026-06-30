import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// A button that opens a small menu of options. Width is never fixed — it
// always shrink-wraps to whatever label is passed in, so the same component
// works for "New entry", a short label like "Sort", or anything longer.
export default function DropdownButton({ label, options, variant = "filled" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  let triggerClasses;
  if (variant === "filled") {
    triggerClasses = open
      ? "bg-primary text-dark-bg"
      : "bg-secondary text-dark-bg hover:bg-primary";
  } else {
    triggerClasses = open
      ? "border border-primary text-primary"
      : "border border-dark-border text-secondary hover:text-primary hover:border-primary";
  }

  return (
    <div ref={rootRef} className="relative inline-block">
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileTap={{ scale: 0.97 }}
        className={`relative inline-flex items-center gap-2.5 px-5 py-2.5 text-sm font-bold uppercase cursor-pointer tracking-widest whitespace-nowrap transition-colors duration-200 ${triggerClasses}`}
      >
        {label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
            open ? "" : "rotate-180"
          }`}
          viewBox="0 0 24 24"
          fill="none"
        >
          {/* Angular rune mark in place of a generic chevron */}
          <path
            d="M4 7L12 17L20 7"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          <path
            d="M12 11L12 17"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="square"
          />
        </svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute inset-x-0 top-full pt-1 z-20"
          >
            <div className="bg-dark-muted border border-dark-border flex flex-col w-full">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setOpen(false);
                    opt.onClick();
                  }}
                  className="text-left px-4 py-2.5 text-xs uppercase tracking-wide text-secondary hover:text-primary cursor-pointer hover:bg-dark-bg transition-colors duration-150"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
