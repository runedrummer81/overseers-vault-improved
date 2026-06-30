import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChoiceCard from "../ChoiceCard";
import Open5eSearch from "./Open5eSearch";
import CreatureForm from "./CreatureForm";
import CreatureStatBlockPreview from "./CreatureStatBlockPreview";
import { EMPTY_CREATURE } from "./creatureConstants";

function ImportIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-11 h-11"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      />
    </svg>
  );
}

function ManualIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-11 h-11"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );
}

function BackButton({ onClick, label = "Back" }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-secondary hover:text-primary transition-colors duration-150 text-xs uppercase tracking-widest w-fit shrink-0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      {label}
    </button>
  );
}

export default function CreatureBuilder({ onSave, isSaving, onLabelChange }) {
  const [view, setView] = useState("choice");
  const [creature, setCreature] = useState(EMPTY_CREATURE);
  const [autoCalc, setAutoCalc] = useState(true);

  const handleCreatureChange = (updated) => {
    setCreature(updated);
    if (onLabelChange) {
      onLabelChange(updated.name || "New creature");
    }
  };

  const handleImport = (imported) => {
    setCreature(imported);
    if (onLabelChange) onLabelChange(imported.name || "New creature");
    setView("form");
  };

  const handleSave = async () => {
    if (!creature.name?.trim()) return;
    if (onSave) await onSave(creature);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <AnimatePresence mode="wait">
        {/* Choice screen */}
        {view === "choice" && (
          <motion.div
            key="choice"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-6 justify-center py-8"
          >
            <div>
              <p className="text-primary text-xl uppercase tracking-widest mb-1">
                New creature
              </p>
              <p className="text-secondary text-sm">
                How would you like to create this creature?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <ChoiceCard
                icon={<ImportIcon />}
                title="Import from Open5e"
                description="Search the SRD monster library and import a full stat block in one click."
                onClick={() => setView("import")}
              />
              <ChoiceCard
                icon={<ManualIcon />}
                title="Build manually"
                description="Fill in the stat block yourself from scratch or adapt a homebrew creature."
                onClick={() => {
                  setCreature(EMPTY_CREATURE);
                  setView("form");
                }}
              />
            </div>
          </motion.div>
        )}

        {/* Import search */}
        {view === "import" && (
          <motion.div
            key="import"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="py-4 flex flex-col flex-1 min-h-0"
          >
            <Open5eSearch
              onImport={handleImport}
              onBack={() => setView("choice")}
            />
          </motion.div>
        )}

        {/* Form + live preview — layout B */}
        {view === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-1 min-h-0"
          >
            {/* Top bar: back + save */}
            <div className="flex items-center justify-between py-4 shrink-0">
              <BackButton
                onClick={() => setView("choice")}
                label="Start over"
              />
              <button
                onClick={handleSave}
                disabled={!creature.name?.trim() || isSaving}
                className={`px-5 py-2 text-xs font-bold uppercase tracking-widest transition-colors duration-150 ${
                  creature.name?.trim() && !isSaving
                    ? "bg-secondary text-dark-bg hover:bg-primary"
                    : "bg-dark-muted text-secondary cursor-not-allowed"
                }`}
              >
                {isSaving ? "Saving..." : "Save creature"}
              </button>
            </div>

            {/* 65/35 split */}
            <div className="flex flex-1 min-h-0 gap-0">
              {/* Form — 65%, scrollable */}
              <div className="overflow-y-auto pr-6" style={{ flex: "0 0 65%" }}>
                <CreatureForm
                  creature={creature}
                  onChange={handleCreatureChange}
                  autoCalc={autoCalc}
                  onAutoCalcToggle={() => setAutoCalc((a) => !a)}
                />
              </div>

              {/* Divider */}
              <div className="border-l border-dark-border shrink-0" />

              {/* Live stat block preview — 35%, scrollable */}
              <div className="flex-1 overflow-y-auto pl-6 py-2">
                <p className="text-[10px] uppercase tracking-widest text-secondary mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block animate-pulse" />
                  Live preview
                </p>
                <CreatureStatBlockPreview creature={creature} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
