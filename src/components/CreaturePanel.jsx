import { useState } from "react";

export default function CreaturePanel({
  creatures,
  loading,
  onSelect,
  onDelete,
  onNew,
  selectedId,
}) {
  const [search, setSearch] = useState("");

  const filtered = creatures.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-80 min-h-screen bg-[#0f0f1f] border-l border-[#1e1e3a] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-[#1e1e3a]">
        <h2 className="text-lg font-bold text-white uppercase tracking-widest">
          Creatures
        </h2>
        <button
          onClick={onNew}
          className="text-[#c9a84c] hover:text-white transition-colors text-2xl leading-none"
          title="New Creature"
        >
          +
        </button>
      </div>

      {/* Search */}
      <div className="px-6 py-3 border-b border-[#1e1e3a]">
        <input
          type="text"
          placeholder="Search creatures..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border border-[#1e1e3a] text-white text-sm placeholder-[#8a8a9a] px-3 py-2 focus:outline-none focus:border-[#c9a84c] transition-colors"
        />
      </div>

      {/* Creature list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="text-[#8a8a9a] text-sm px-6 py-8">Loading...</p>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-[#8a8a9a] text-sm">
              {search ? "No creatures match your search." : "No creatures yet."}
            </p>
            <p className="text-[#8a8a9a] text-xs mt-2">
              Click + to create your first one.
            </p>
          </div>
        ) : (
          filtered.map((creature) => (
            <div
              key={creature.id}
              onClick={() => onSelect(creature)}
              className={`relative group border-b border-[#1e1e3a] px-6 py-4 cursor-pointer transition-all duration-200 hover:bg-[#1a1a3a] ${
                selectedId === creature.id
                  ? "bg-[#1a1a3a] border-l-2 border-l-[#c9a84c]"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-white text-sm font-semibold">
                    {creature.name}
                  </span>
                  <span className="text-[#8a8a9a] text-xs">
                    HP {creature.hp} · AC {creature.ac} · CR {creature.cr}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(creature.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-[#8a8a9a] hover:text-red-400 transition-all duration-200 text-xs uppercase tracking-widest"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
