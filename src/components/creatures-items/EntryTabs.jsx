import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const MAX_LABEL_LENGTH = 14;

function trimLabel(label) {
  if (!label) return "Untitled";
  return label.length > MAX_LABEL_LENGTH
    ? label.slice(0, MAX_LABEL_LENGTH).trimEnd() + "…"
    : label;
}

// The SidebarButton arrow, mathematically rotated 90° clockwise to point downward.
// The horizontal stroke at y=1.4 aligns seamlessly with the border-t-2 on either side of it,
// creating the same "border morphs into arrow" illusion as SidebarButton.
function ArrowDown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 67.5 35.9"
      style={{
        width: "45px",
        height: "24px",
        flexShrink: 0,
        display: "block",
        overflow: "visible",
      }}
      fill="none"
    >
      <polyline
        points="0,1.4 33.7,34.5 67.5,1.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      <polyline
        points="50.3,17.9 33.7,1.4 17.2,17.9"
        stroke="currentColor"
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      <polyline
        points="67.5,1.4 50.3,1.4 33.7,17.9 17.2,1.4 0,1.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeMiterlimit="10"
      />
    </svg>
  );
}

function EntryTab({ tab, isActive, onSelect, onClose }) {
  const [hovered, setHovered] = useState(false);
  const showArrow = isActive || hovered;
  const borderColorClass = isActive ? "border-primary" : "border-secondary";
  const textColorClass = isActive ? "text-primary" : "text-secondary";

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={tab.label}
      className="flex flex-col cursor-pointer select-none relative"
    >
      {/* Close badge — only shown on selected state */}
      {isActive && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          title="Close"
          className="absolute -top-3 -right-3 z-10 w-6 h-6 rounded-full border-2 border-primary bg-dark-bg flex items-center justify-center transition-all duration-150 group"
          style={{}}
          onMouseEnter={(e) =>
            (e.currentTarget.style.cssText =
              "background:#7f1d1d;border-color:#7f1d1d;filter:drop-shadow(0 0 5px rgba(127,29,29,0.7))")
          }
          onMouseLeave={(e) => (e.currentTarget.style.cssText = "")}
        >
          <span className="text-primary transition-colors duration-150 text-lg font-bold leading-none">
            ×
          </span>
        </button>
      )}

      {/* Rectangle body — full border always, solid on idle */}
      <div
        className={`border-2 ${borderColorClass} flex items-center gap-2 px-4 py-2.5 transition-colors duration-150`}
      >
        {tab.dirty && (
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? "bg-primary" : "bg-secondary"}`}
          />
        )}
        <span
          className={`text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-colors duration-150 ${textColorClass}`}
        >
          {trimLabel(tab.label)}
        </span>
      </div>

      {/* Arrow grows downward from behind the bottom border on hover/active */}
      <motion.div
        animate={{ height: showArrow ? 24 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`flex items-start overflow-hidden ${textColorClass}`}
        style={{ marginTop: "-2px" }}
      >
        <div
          className={`flex-1 border-t-2 ${borderColorClass} transition-colors duration-150`}
        />
        <ArrowDown />
        <div
          className={`flex-1 border-t-2 ${borderColorClass} transition-colors duration-150`}
        />
      </motion.div>
    </div>
  );
}

export default function EntryTabs({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
}) {
  return (
    <AnimatePresence initial={false}>
      {tabs.map((tab) => (
        <motion.div
          key={tab.tabId}
          layout
          initial={{ opacity: 0, scale: 0.85, x: -12 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.85, x: -12 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <EntryTab
            tab={tab}
            isActive={tab.tabId === activeTabId}
            onSelect={() => onSelectTab(tab.tabId)}
            onClose={() => onCloseTab(tab.tabId)}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
