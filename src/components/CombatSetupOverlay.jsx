import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreatures } from "../hooks/useCreatures";
import { useAuth } from "../context/AuthContext";

export default function CombatSetupOverlay({
  isOpen,
  onClose,
  onBegin,
  players,
}) {
  const { user } = useAuth();
  const { creatures } = useCreatures(user?.uid);
  const [initiatives, setInitiatives] = useState({});
  const [enemies, setEnemies] = useState([]);
  const [showCreaturePicker, setShowCreaturePicker] = useState(false);
  const [search, setSearch] = useState("");

  // Reset when overlay opens
  useEffect(() => {
    if (isOpen) {
      const initial = {};
      players.forEach((p) => {
        initial[p.id] = "";
      });
      setInitiatives(initial);
      setEnemies([]);
      setSearch("");
    }
  }, [isOpen, players]);

  const handleInitiativeChange = (id, value) => {
    setInitiatives((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddEnemy = (creature) => {
    const instanceId = `${creature.id}-${Date.now()}`;
    setEnemies((prev) => [
      ...prev,
      {
        ...creature,
        instanceId,
        hp: Number(creature.hp),
        maxHp: Number(creature.hp),
        type: "enemy",
      },
    ]);
    setInitiatives((prev) => ({ ...prev, [instanceId]: "" }));
    setShowCreaturePicker(false);
    setSearch("");
  };

  const handleRemoveEnemy = (instanceId) => {
    setEnemies((prev) => prev.filter((e) => e.instanceId !== instanceId));
    setInitiatives((prev) => {
      const next = { ...prev };
      delete next[instanceId];
      return next;
    });
  };

  const handleBegin = () => {
    const playerCombatants = players.map((p) => ({
      id: p.id,
      name: p.characterName,
      class: p.class,
      level: p.level,
      type: "player",
      initiative: Number(initiatives[p.id]) || 0,
    }));

    const enemyCombatants = enemies.map((e) => ({
      ...e,
      initiative: Number(initiatives[e.instanceId]) || 0,
    }));

    onBegin([...playerCombatants, ...enemyCombatants]);
  };

  const filteredCreatures = creatures.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/70 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Overlay */}
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[#12122a] border border-[#c9a84c] p-8 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-[#c9a84c] uppercase tracking-widest">
                Combat Setup
              </h2>
              <p className="text-[#8a8a9a] text-xs mt-1 uppercase tracking-widest">
                Enter initiative rolls for each combatant
              </p>
            </div>

            {/* Players */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs text-[#8a8a9a] uppercase tracking-widest">
                Players
              </h3>
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between border border-[#1e1e3a] px-4 py-3 bg-[#0f0f1f]"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-white text-sm font-semibold">
                      {player.characterName}
                    </span>
                    <span className="text-[#8a8a9a] text-xs">
                      {player.playerName} · {player.class} · Level{" "}
                      {player.level}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <label className="text-[#8a8a9a] text-xs uppercase tracking-widest">
                      Initiative
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={initiatives[player.id] ?? ""}
                      onChange={(e) =>
                        handleInitiativeChange(player.id, e.target.value)
                      }
                      className="w-16 bg-transparent border border-[#c9a84c] text-white text-center text-lg font-bold px-2 py-1 focus:outline-none focus:border-white transition-colors"
                      placeholder="—"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Enemies */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs text-[#8a8a9a] uppercase tracking-widest">
                Enemies
              </h3>

              {enemies.length === 0 && (
                <p className="text-[#8a8a9a] text-xs">No enemies added yet.</p>
              )}

              {enemies.map((enemy) => (
                <div
                  key={enemy.instanceId}
                  className="flex items-center justify-between border border-[#1e1e3a] px-4 py-3 bg-[#0f0f1f]"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-white text-sm font-semibold">
                      {enemy.name}
                    </span>
                    <span className="text-[#8a8a9a] text-xs">
                      HP {enemy.hp} · AC {enemy.ac}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <label className="text-[#8a8a9a] text-xs uppercase tracking-widest">
                        Initiative
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={initiatives[enemy.instanceId] ?? ""}
                        onChange={(e) =>
                          handleInitiativeChange(
                            enemy.instanceId,
                            e.target.value,
                          )
                        }
                        className="w-16 bg-transparent border border-[#c9a84c] text-white text-center text-lg font-bold px-2 py-1 focus:outline-none focus:border-white transition-colors"
                        placeholder="—"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveEnemy(enemy.instanceId)}
                      className="text-[#8a8a9a] hover:text-red-400 transition-colors text-xs uppercase tracking-widest mt-4"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

              {/* Add enemy button */}
              <button
                onClick={() => setShowCreaturePicker(!showCreaturePicker)}
                className="border border-dashed border-[#3a3a5a] text-[#8a8a9a] py-3 text-xs uppercase tracking-widest hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all duration-200"
              >
                + Add Enemy from Bestiary
              </button>

              {/* Creature picker */}
              {showCreaturePicker && (
                <div className="border border-[#1e1e3a] bg-[#0f0f1f] flex flex-col">
                  <div className="px-4 py-2 border-b border-[#1e1e3a]">
                    <input
                      type="text"
                      placeholder="Search bestiary..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-transparent text-white text-sm placeholder-[#8a8a9a] focus:outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {filteredCreatures.length === 0 ? (
                      <p className="text-[#8a8a9a] text-xs px-4 py-3">
                        No creatures found. Build some in the Bestiary first!
                      </p>
                    ) : (
                      filteredCreatures.map((creature) => (
                        <button
                          key={creature.id}
                          onClick={() => handleAddEnemy(creature)}
                          className="w-full text-left px-4 py-3 border-b border-[#1e1e3a] hover:bg-[#1a1a3a] transition-colors"
                        >
                          <span className="text-white text-sm">
                            {creature.name}
                          </span>
                          <span className="text-[#8a8a9a] text-xs ml-2">
                            HP {creature.hp} · AC {creature.ac}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 border border-[#3a3a5a] text-[#8a8a9a] py-3 uppercase tracking-widest text-sm hover:border-white hover:text-white transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleBegin}
                className="flex-1 bg-[#c9a84c] text-[#12122a] py-3 uppercase tracking-widest text-sm font-bold hover:bg-white transition-all duration-300"
              >
                ⚔ Begin Combat
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
