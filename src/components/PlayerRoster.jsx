import { useState } from "react";

const CLASSES = [
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
  "Artificer",
  "Blood Hunter",
];

function PlayerRow({ player, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    characterName: player.characterName,
    playerName: player.playerName,
    class: player.class,
    level: player.level,
  });

  const handleSave = () => {
    onUpdate(player.id, form);
    setEditing(false);
  };

  const isDead = player.status === "dead" || player.status === "gone";

  return (
    <div
      className={`border-b border-[#1e1e3a] px-4 py-3 transition-all ${isDead ? "opacity-40" : ""}`}
    >
      {editing ? (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              className="flex-1 bg-transparent border border-[#c9a84c] text-white text-xs px-2 py-1 focus:outline-none"
              placeholder="Character name"
              value={form.characterName}
              onChange={(e) =>
                setForm({ ...form, characterName: e.target.value })
              }
            />
            <input
              className="flex-1 bg-transparent border border-[#c9a84c] text-white text-xs px-2 py-1 focus:outline-none"
              placeholder="Player name"
              value={form.playerName}
              onChange={(e) => setForm({ ...form, playerName: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="flex-1 bg-[#0f0f1f] border border-[#c9a84c] text-white text-xs px-2 py-1 focus:outline-none"
              value={form.class}
              onChange={(e) => setForm({ ...form, class: e.target.value })}
            >
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              max={20}
              className="w-16 bg-transparent border border-[#c9a84c] text-white text-xs px-2 py-1 focus:outline-none"
              placeholder="Lvl"
              value={form.level}
              onChange={(e) =>
                setForm({ ...form, level: Number(e.target.value) })
              }
            />
          </div>
          <div className="flex gap-2 mt-1">
            <button
              onClick={handleSave}
              className="text-xs text-[#c9a84c] uppercase tracking-widest hover:text-white transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-xs text-[#8a8a9a] uppercase tracking-widest hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between group">
          <div className="flex flex-col gap-0.5">
            <span
              className={`text-sm font-semibold ${isDead ? "line-through text-[#8a8a9a]" : "text-white"}`}
            >
              {player.characterName}
              {isDead && (
                <span className="ml-2 text-xs text-red-400 no-underline">
                  {player.status}
                </span>
              )}
            </span>
            <span className="text-xs text-[#8a8a9a]">
              {player.playerName} · {player.class} · Level {player.level}
            </span>
          </div>
          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setEditing(true)}
              className="text-xs text-[#8a8a9a] hover:text-[#c9a84c] uppercase tracking-widest transition-colors"
            >
              Edit
            </button>
            {!isDead ? (
              <button
                onClick={() => onUpdate(player.id, { status: "dead" })}
                className="text-xs text-[#8a8a9a] hover:text-red-400 uppercase tracking-widest transition-colors"
              >
                Dead
              </button>
            ) : (
              <button
                onClick={() => onUpdate(player.id, { status: "active" })}
                className="text-xs text-[#8a8a9a] hover:text-green-400 uppercase tracking-widest transition-colors"
              >
                Revive
              </button>
            )}
            <button
              onClick={() => onRemove(player.id)}
              className="text-xs text-[#8a8a9a] hover:text-red-400 uppercase tracking-widest transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlayerRoster({
  players,
  onAdd,
  onUpdate,
  onRemove,
  playerCount,
}) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    characterName: "",
    playerName: "",
    class: "Fighter",
    level: 1,
  });
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!form.characterName.trim() || !form.playerName.trim()) {
      setError("Please fill in character and player name.");
      return;
    }
    onAdd(form);
    setForm({ characterName: "", playerName: "", class: "Fighter", level: 1 });
    setAdding(false);
    setError("");
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e3a]">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">
            Player Roster
          </h3>
          <p className="text-xs text-[#8a8a9a] mt-0.5">
            {playerCount} active players
          </p>
        </div>
        <button
          onClick={() => setAdding(!adding)}
          className="text-[#c9a84c] hover:text-white transition-colors text-xl leading-none"
        >
          +
        </button>
      </div>

      {/* Add player form */}
      {adding && (
        <div className="px-4 py-3 border-b border-[#1e1e3a] bg-[#12122a] flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              className="flex-1 bg-transparent border border-[#c9a84c] text-white text-xs px-2 py-1 focus:outline-none placeholder-[#8a8a9a]"
              placeholder="Character name"
              value={form.characterName}
              onChange={(e) =>
                setForm({ ...form, characterName: e.target.value })
              }
              autoFocus
            />
            <input
              className="flex-1 bg-transparent border border-[#c9a84c] text-white text-xs px-2 py-1 focus:outline-none placeholder-[#8a8a9a]"
              placeholder="Player name"
              value={form.playerName}
              onChange={(e) => setForm({ ...form, playerName: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="flex-1 bg-[#0f0f1f] border border-[#c9a84c] text-white text-xs px-2 py-1 focus:outline-none"
              value={form.class}
              onChange={(e) => setForm({ ...form, class: e.target.value })}
            >
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              max={20}
              className="w-16 bg-transparent border border-[#c9a84c] text-white text-xs px-2 py-1 focus:outline-none placeholder-[#8a8a9a]"
              placeholder="Lvl"
              value={form.level}
              onChange={(e) =>
                setForm({ ...form, level: Number(e.target.value) })
              }
            />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              className="text-xs text-[#c9a84c] uppercase tracking-widest hover:text-white transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setError("");
              }}
              className="text-xs text-[#8a8a9a] uppercase tracking-widest hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Player list */}
      {players.length === 0 && !adding ? (
        <p className="text-xs text-[#8a8a9a] px-4 py-4">
          No players yet. Click + to add.
        </p>
      ) : (
        players.map((p) => (
          <PlayerRow
            key={p.id}
            player={p}
            onUpdate={onUpdate}
            onRemove={onRemove}
          />
        ))
      )}
    </div>
  );
}
