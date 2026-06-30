import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TYPE_FILTERS = [
  { id: "all", label: "All" },
  { id: "creature", label: "Creature" },
  { id: "npc", label: "NPC" },
  { id: "item", label: "Item" },
];

const TYPE_META = {
  creature: { label: "Creature" },
  npc: { label: "NPC" },
  item: { label: "Item" },
};

function entrySubtitle(entry) {
  if (entry.type === "creature") {
    return entry.cr ? `Creature \u2014 CR ${entry.cr}` : "Creature";
  }
  if (entry.type === "item") {
    return entry.rarity ? `Item \u2014 ${entry.rarity}` : "Item";
  }
  return TYPE_META[entry.type]?.label ?? "";
}

export default function LibraryPanel({
  entries,
  loading,
  activeEntryId,
  onSelectEntry,
  collapsed,
  onToggleCollapsed,
}) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = entries.filter((entry) => {
    const matchesType = typeFilter === "all" || entry.type === typeFilter;
    const matchesSearch = entry.name
      ?.toLowerCase()
      .includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  if (collapsed) {
    return (
      <div className="w-12 self-stretch border-l border-dark-border flex flex-col items-center pt-5 shrink-0">
        <button
          onClick={onToggleCollapsed}
          title="Expand library"
          className="text-secondary hover:text-primary transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="w-72 self-stretch border-l border-dark-border shrink-0 flex flex-col px-5 py-6 gap-5">
      <div className="flex items-center justify-between">
        <span className="text-primary text-sm uppercase tracking-widest">
          Library
        </span>
        <button
          onClick={onToggleCollapsed}
          title="Collapse library"
          className="text-secondary hover:text-primary transition-colors duration-200"
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
              strokeWidth={1.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="bg-transparent border border-dark-border text-primary placeholder-secondary focus:outline-none focus:border-primary transition-colors text-[13px] px-3 py-2.5"
      />

      <div className="flex gap-2 flex-wrap">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setTypeFilter(f.id)}
            className={`uppercase tracking-wide border transition-colors duration-200 text-[11px] px-2.5 py-1.5 ${
              typeFilter === f.id
                ? "border-secondary text-primary"
                : "border-dark-border text-secondary hover:text-primary"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-0.5 -mx-1">
        {loading ? (
          <p className="text-secondary text-xs px-1 py-4">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-secondary text-xs px-1 py-4">
            {entries.length === 0
              ? "Nothing here yet."
              : "Nothing matches your search."}
          </p>
        ) : (
          filtered.map((entry) => (
            <button
              key={entry.id}
              onClick={() => onSelectEntry(entry)}
              className={`text-left px-2 py-2 transition-colors duration-150 ${
                activeEntryId === entry.id
                  ? "bg-dark-muted border-l-2 border-l-secondary"
                  : "border-l-2 border-l-transparent hover:bg-dark-muted"
              }`}
            >
              <div
                className={`text-sm truncate ${
                  activeEntryId === entry.id ? "text-primary" : "text-[#c9c3b0]"
                }`}
              >
                {entry.name || "Untitled"}
              </div>
              <div className="text-secondary text-[11px]">
                {entrySubtitle(entry)}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
