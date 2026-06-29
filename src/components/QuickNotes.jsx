import { useState } from "react";

export const CATEGORIES = [
  { id: "combat", label: "Combat", color: "#ef4444" },
  { id: "npc", label: "NPC", color: "#c9a84c" },
  { id: "loot", label: "Loot", color: "#22c55e" },
  { id: "special_event", label: "Special Event", color: "#a855f7" },
];

function NoteItem({ note, onDelete }) {
  const category = CATEGORIES.find((c) => c.id === note.category);

  return (
    <div className="group flex items-start gap-2 py-2 border-b border-[#1e1e3a]">
      <div
        className="mt-1 w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: category?.color ?? "#8a8a9a" }}
      />
      <div className="flex-1 flex flex-col gap-0.5">
        <span
          className="text-xs uppercase tracking-widest"
          style={{ color: category?.color ?? "#8a8a9a" }}
        >
          {category?.label ?? note.category}
        </span>
        <p className="text-white text-sm leading-snug">{note.text}</p>
      </div>
      <button
        onClick={() => onDelete(note.id)}
        className="opacity-0 group-hover:opacity-100 text-[#8a8a9a] hover:text-red-400 transition-all text-xs shrink-0 mt-1"
      >
        ✕
      </button>
    </div>
  );
}

export default function QuickNotes({ notes, loading, onAdd, onDelete }) {
  const [selectedCategory, setSelectedCategory] = useState("combat");
  const [text, setText] = useState("");

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text.trim(), selectedCategory);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#12122a] border border-[#1e1e3a]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1e1e3a]">
        <h3 className="text-sm font-bold text-white uppercase tracking-widest">
          Quick Notes
        </h3>
      </div>

      {/* Category selector */}
      <div className="px-4 py-3 border-b border-[#1e1e3a] flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className="text-xs px-2 py-1 uppercase tracking-widest transition-all duration-150 border"
            style={{
              borderColor: selectedCategory === cat.id ? cat.color : "#1e1e3a",
              color: selectedCategory === cat.id ? cat.color : "#8a8a9a",
              backgroundColor:
                selectedCategory === cat.id ? `${cat.color}15` : "transparent",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-b border-[#1e1e3a] flex gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a note and press Enter..."
          className="flex-1 bg-transparent text-white text-sm placeholder-[#8a8a9a] focus:outline-none resize-none h-16"
        />
        <button
          onClick={handleAdd}
          className="text-[#c9a84c] hover:text-white transition-colors text-xl leading-none self-end pb-1"
        >
          +
        </button>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        {loading ? (
          <p className="text-[#8a8a9a] text-xs py-4">Loading...</p>
        ) : notes.length === 0 ? (
          <p className="text-[#8a8a9a] text-xs py-4">
            No notes yet. Start adding key events during your session!
          </p>
        ) : (
          notes.map((note) => (
            <NoteItem key={note.id} note={note} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
}
