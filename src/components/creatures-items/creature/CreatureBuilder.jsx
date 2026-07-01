import { useState, useCallback } from "react";
import ChoiceCard from "../ChoiceCard";
import Open5eSearch from "./Open5eSearch";
import CreatureForm from "./CreatureForm";
import CreatureStatBlockPreview from "./CreatureStatBlockPreview";
import Breadcrumb from "./Breadcrumb";
import { EMPTY_CREATURE } from "./creatureConstants";

const FADE_MS = 140;

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

export default function CreatureBuilder({ onSave, isSaving, onLabelChange }) {
  const [view, setView] = useState("choice");
  const [method, setMethod] = useState(null);
  const [creature, setCreature] = useState(EMPTY_CREATURE);
  const [autoCalc, setAutoCalc] = useState(true);
  const [fading, setFading] = useState(false);
  const [pendingImport, setPendingImport] = useState(null); // creature selected in search
  const [importing, setImporting] = useState(false);

  // Fade everything out, run updates while invisible, fade back in.
  const switchView = useCallback((newView, onSwitch) => {
    setFading(true);
    setTimeout(() => {
      setView(newView);
      if (onSwitch) onSwitch();
      setFading(false);
    }, FADE_MS);
  }, []);

  const handleCreatureChange = (updated) => {
    setCreature(updated);
    if (onLabelChange) onLabelChange(updated.name || "New creature");
  };

  const handleImport = (imported) => {
    switchView("form", () => {
      setCreature(imported);
      if (onLabelChange) onLabelChange(imported.name || "New creature");
    });
  };

  const handleSave = async () => {
    if (!creature.name?.trim()) return;
    if (onSave) await onSave(creature);
  };

  const methodLabel =
    method === "import" ? "Import from Open5e" : "Build manually";

  const breadcrumbSteps =
    view === "import"
      ? [
          { label: "New creature", onClick: () => switchView("choice") },
          { label: "Import from Open5e" },
        ]
      : view === "form" && method === "import"
        ? [
            { label: "New creature" },
            {
              label: "Import from Open5e",
              onClick: () =>
                switchView("import", () => {
                  setCreature(EMPTY_CREATURE);
                  setPendingImport(null);
                  if (onLabelChange) onLabelChange("New creature");
                }),
              tooltip: "Go back — your current changes will be lost",
            },
            { label: creature.name?.trim() || "Stat block" },
          ]
        : view === "form" && method === "manual"
          ? [
              {
                label: "New creature",
                onClick: () =>
                  switchView("choice", () => {
                    setCreature(EMPTY_CREATURE);
                    if (onLabelChange) onLabelChange("New creature");
                  }),
                tooltip: "Go back — your current changes will be lost",
              },
              { label: creature.name?.trim() || "Stat block" },
            ]
          : null;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Everything fades together — header + views as one unit */}
      <div
        className="flex flex-col flex-1 min-h-0"
        style={{
          opacity: fading ? 0 : 1,
          transition: `opacity ${FADE_MS}ms ease`,
        }}
      >
        {/* Header — always rendered at fixed height to prevent layout shifts */}
        <div
          className="flex items-center justify-between pt-4 pb-3 shrink-0"
          style={{ minHeight: "56px" }}
        >
          {breadcrumbSteps && <Breadcrumb steps={breadcrumbSteps} />}

          {/* Import button — shows in header when a creature is selected in the search */}
          {view === "import" && pendingImport && (
            <button
              onClick={() => {
                if (importing) return;
                setImporting(true);
                setTimeout(() => {
                  handleImport(pendingImport);
                  setPendingImport(null);
                  setImporting(false);
                }, 300);
              }}
              className="px-5 py-2 text-xs font-bold uppercase tracking-widest transition-colors duration-150 shrink-0 ml-auto bg-secondary text-dark-bg hover:bg-primary cursor-pointer"
            >
              {importing ? "Importing..." : "Import creature"}
            </button>
          )}

          {/* Save button — shows on the form view */}
          {view === "form" && (
            <button
              onClick={handleSave}
              disabled={!creature.name?.trim() || isSaving}
              className={`px-5 py-2 text-xs font-bold uppercase tracking-widest transition-colors duration-150 shrink-0 ml-auto ${
                creature.name?.trim() && !isSaving
                  ? "bg-secondary text-dark-bg hover:bg-primary cursor-pointer"
                  : "bg-dark-muted text-secondary cursor-not-allowed"
              }`}
            >
              {isSaving ? "Saving..." : "Save creature"}
            </button>
          )}
        </div>

        {/* Views — all mounted, opacity controls which is visible */}
        <div className="relative flex-1 min-h-0">
          {/* Choice */}
          <div
            className="absolute inset-0 flex flex-col gap-6 pt-4 overflow-y-auto"
            style={{ display: view === "choice" ? "flex" : "none" }}
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
                onClick={() => switchView("import", () => setMethod("import"))}
              />
              <ChoiceCard
                icon={<ManualIcon />}
                title="Build manually"
                description="Fill in the stat block yourself from scratch or adapt a homebrew creature."
                onClick={() =>
                  switchView("form", () => {
                    setMethod("manual");
                    setCreature(EMPTY_CREATURE);
                  })
                }
              />
            </div>
          </div>

          {/* Import search */}
          <div
            className="absolute inset-0 flex flex-col"
            style={{ display: view === "import" ? "flex" : "none" }}
          >
            <Open5eSearch
              active={view === "import"}
              selected={pendingImport}
              onSelectCreature={setPendingImport}
            />
          </div>

          {/* Form + live preview */}
          <div
            className="absolute inset-0 flex gap-0"
            style={{ display: view === "form" ? "flex" : "none" }}
          >
            <div className="overflow-y-auto pr-6" style={{ flex: "0 0 65%" }}>
              <CreatureForm
                creature={creature}
                onChange={handleCreatureChange}
                autoCalc={autoCalc}
                onAutoCalcToggle={() => setAutoCalc((a) => !a)}
              />
            </div>
            <div className="border-l border-dark-border shrink-0" />
            <div className="flex-1 overflow-y-auto pl-6 py-2">
              <p className="text-[10px] uppercase tracking-widest text-secondary mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block animate-pulse" />
                Live preview
              </p>
              <CreatureStatBlockPreview creature={creature} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
