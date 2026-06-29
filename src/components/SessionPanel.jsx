import { useState } from "react";

function timeAgo(timestamp) {
  if (!timestamp) return "";
  const seconds = Math.floor((Date.now() - timestamp.seconds * 1000) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function SessionPanel({
  sessions,
  loading,
  onNew,
  onImport,
  onDelete,
  onOpen,
}) {
  const [showImport, setShowImport] = useState(false);
  const [importForm, setImportForm] = useState({
    number: "",
    name: "",
    summary: "",
    date: "",
  });
  const [hoveredId, setHoveredId] = useState(null);

  const handleImport = () => {
    if (!importForm.number || !importForm.name.trim()) return;
    onImport(
      Number(importForm.number),
      importForm.name.trim(),
      importForm.summary.trim(),
      importForm.date,
    );
    setImportForm({ number: "", name: "", summary: "", date: "" });
    setShowImport(false);
  };

  return (
    <div className="w-80 min-h-screen bg-[#0f0f1f] border-l border-[#1e1e3a] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-[#1e1e3a]">
        <h2 className="text-lg font-bold text-white uppercase tracking-widest">
          Sessions
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImport(!showImport)}
            className="text-xs text-[#8a8a9a] hover:text-[#c9a84c] uppercase tracking-widest transition-colors"
          >
            Import
          </button>
          <button
            onClick={onNew}
            className="text-[#c9a84c] hover:text-white transition-colors text-2xl leading-none"
          >
            +
          </button>
        </div>
      </div>

      {/* Import form */}
      {showImport && (
        <div className="px-6 py-4 border-b border-[#1e1e3a] bg-[#12122a] flex flex-col gap-3">
          <p className="text-xs text-[#8a8a9a] uppercase tracking-widest">
            Import Past Session
          </p>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="# No."
              value={importForm.number}
              onChange={(e) =>
                setImportForm({ ...importForm, number: e.target.value })
              }
              className="w-16 bg-transparent border border-[#c9a84c] text-white text-xs px-2 py-1 focus:outline-none placeholder-[#8a8a9a]"
            />
            <input
              type="text"
              placeholder="Session name"
              value={importForm.name}
              onChange={(e) =>
                setImportForm({ ...importForm, name: e.target.value })
              }
              className="flex-1 bg-transparent border border-[#c9a84c] text-white text-xs px-2 py-1 focus:outline-none placeholder-[#8a8a9a]"
            />
          </div>
          <input
            type="date"
            value={importForm.date}
            onChange={(e) =>
              setImportForm({ ...importForm, date: e.target.value })
            }
            className="bg-transparent border border-[#c9a84c] text-white text-xs px-2 py-1 focus:outline-none"
          />
          <textarea
            placeholder="Brief summary of what happened..."
            value={importForm.summary}
            onChange={(e) =>
              setImportForm({ ...importForm, summary: e.target.value })
            }
            className="bg-transparent border border-[#c9a84c] text-white text-xs px-2 py-1 focus:outline-none placeholder-[#8a8a9a] resize-none h-20"
          />
          <div className="flex gap-3">
            <button
              onClick={handleImport}
              className="text-xs text-[#c9a84c] uppercase tracking-widest hover:text-white transition-colors"
            >
              Import
            </button>
            <button
              onClick={() => setShowImport(false)}
              className="text-xs text-[#8a8a9a] uppercase tracking-widest hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Session list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="text-[#8a8a9a] text-sm px-6 py-8">Loading...</p>
        ) : sessions.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-[#8a8a9a] text-sm">No sessions yet.</p>
            <p className="text-[#8a8a9a] text-xs mt-2">
              Click + to create your first session.
            </p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="relative group border-b border-[#1e1e3a] px-6 py-4 cursor-pointer hover:bg-[#1a1a3a] transition-all duration-200"
              onMouseEnter={() => setHoveredId(session.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onOpen(session)}
            >
              {/* Gold left border on hover */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-0.5 bg-[#c9a84c] transition-opacity duration-200 ${hoveredId === session.id ? "opacity-100" : "opacity-0"}`}
              />

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#c9a84c] text-xs font-bold">
                      #{session.number}
                    </span>
                    {session.type === "imported" && (
                      <span className="text-[#8a8a9a] text-xs border border-[#3a3a5a] px-1">
                        imported
                      </span>
                    )}
                  </div>
                  <span className="text-white text-sm font-semibold">
                    {session.name}
                  </span>
                  {session.summary && (
                    <span className="text-[#8a8a9a] text-xs line-clamp-1">
                      {session.summary}
                    </span>
                  )}
                  <span className="text-[#8a8a9a] text-xs">
                    {session.date?.seconds
                      ? new Date(
                          session.date.seconds * 1000,
                        ).toLocaleDateString()
                      : ""}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(session.id);
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
