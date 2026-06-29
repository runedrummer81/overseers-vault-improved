import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function HPControl({ current, max, onChange, resistances, immunities }) {
  const [delta, setDelta] = useState("");
  const [showReminder, setShowReminder] = useState(false);
  const reminderRef = useRef(null);

  const hasReminder = resistances?.trim() || immunities?.trim();

  useEffect(() => {
    if (!showReminder) return;
    const handleClick = () => setShowReminder(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showReminder]);

  const handleDamage = (e) => {
    e.stopPropagation();
    const amount = Number(delta);
    if (!amount) return;
    onChange(Math.max(0, current - amount));
    setDelta("");
    if (hasReminder) setShowReminder(true);
  };

  const handleHeal = (e) => {
    e.stopPropagation();
    const amount = Number(delta);
    if (!amount) return;
    onChange(Math.min(max, current + amount));
    setDelta("");
    setShowReminder(false);
  };

  const percentage = Math.max(0, (current / max) * 100);
  const barColor =
    percentage > 50 ? "#22c55e" : percentage > 25 ? "#f59e0b" : "#ef4444";

  return (
    <div
      className="flex flex-col gap-1 mt-2"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-[#1e1e3a] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${percentage}%`, backgroundColor: barColor }}
          />
        </div>
        <span className="text-xs font-bold" style={{ color: barColor }}>
          {current}/{max}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <input
          type="number"
          min={0}
          value={delta}
          onChange={(e) => setDelta(e.target.value)}
          placeholder="Amount"
          className="w-20 bg-transparent border border-[#1e1e3a] text-white text-xs px-2 py-1 focus:outline-none focus:border-[#c9a84c] transition-colors"
          onKeyDown={(e) => {
            if (e.key === "Enter") handleDamage(e);
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={handleDamage}
          className="text-xs px-2 py-1 border border-red-500/50 text-red-400 hover:bg-red-500/20 transition-colors"
        >
          DMG
        </button>
        <button
          onClick={handleHeal}
          className="text-xs px-2 py-1 border border-green-500/50 text-green-400 hover:bg-green-500/20 transition-colors"
        >
          HEAL
        </button>
      </div>

      <AnimatePresence>
        {showReminder && hasReminder && (
          <motion.div
            ref={reminderRef}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="mt-1 flex flex-col gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {resistances?.trim() && (
              <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/30 px-3 py-2">
                <span className="text-yellow-400 text-xs shrink-0">⚠</span>
                <div>
                  <p className="text-yellow-400 text-xs uppercase tracking-widest font-bold">
                    Resistant to
                  </p>
                  <p className="text-yellow-200 text-xs mt-0.5">
                    {resistances}
                  </p>
                </div>
              </div>
            )}
            {immunities?.trim() && (
              <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 px-3 py-2">
                <span className="text-red-400 text-xs shrink-0">🛡</span>
                <div>
                  <p className="text-red-400 text-xs uppercase tracking-widest font-bold">
                    Immune to
                  </p>
                  <p className="text-red-200 text-xs mt-0.5">{immunities}</p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CombatTracker({
  combatants: initialCombatants,
  onEndCombat,
  onSelectCombatant,
  selectedCombatantId,
}) {
  const sorted = [...initialCombatants].sort(
    (a, b) => b.initiative - a.initiative,
  );
  const [combatants, setCombatants] = useState(sorted);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [round, setRound] = useState(1);

  const handleNextTurn = () => {
    if (currentIndex + 1 >= combatants.length) {
      setCurrentIndex(0);
      setRound((r) => r + 1);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleHpChange = (combatantId, newHp) => {
    setCombatants((prev) =>
      prev.map((c) =>
        c.instanceId === combatantId || c.id === combatantId
          ? { ...c, hp: newHp }
          : c,
      ),
    );
  };

  return (
    <div className="w-80 min-h-screen bg-[#0f0f1f] border-l border-[#1e1e3a] flex flex-col shrink-0">
      {/* Round counter */}
      <div className="px-6 py-6 border-b border-[#1e1e3a] flex items-center justify-between">
        <div>
          <p className="text-xs text-[#8a8a9a] uppercase tracking-widest">
            Round
          </p>
          <p className="text-3xl font-bold text-[#c9a84c]">{round}</p>
        </div>
        <button
          onClick={handleNextTurn}
          className="bg-[#c9a84c] text-[#12122a] px-4 py-2 text-xs uppercase tracking-widest font-bold hover:bg-white transition-all duration-300"
        >
          Next Turn →
        </button>
      </div>

      {/* Initiative order */}
      <div className="flex-1 overflow-y-auto">
        {combatants.map((combatant, index) => {
          const isActive = index === currentIndex;
          const isEnemy = combatant.type === "enemy";
          const isDead = isEnemy && combatant.hp <= 0;
          const isSelected =
            (combatant.instanceId ?? combatant.id) === selectedCombatantId;

          return (
            <div
              key={combatant.instanceId ?? combatant.id}
              onClick={() => isEnemy && onSelectCombatant(combatant)}
              className={`relative border-b border-[#1e1e3a] px-6 py-4 transition-all duration-300 ${
                isActive ? "bg-[#1e1e3a]" : ""
              } ${isDead ? "opacity-40" : ""} ${
                isEnemy ? "cursor-pointer hover:bg-[#1a1a3a]" : ""
              } ${isSelected ? "ring-1 ring-[#c9a84c] ring-inset" : ""}`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#c9a84c]" />
              )}

              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-0.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm font-bold ${
                        isActive ? "text-[#c9a84c]" : "text-white"
                      } ${isDead ? "line-through" : ""}`}
                    >
                      {combatant.name}
                    </span>
                    <span
                      className={`text-xs px-1.5 py-0.5 uppercase tracking-widest ${
                        isEnemy
                          ? "text-red-400 border border-red-400/30"
                          : "text-blue-400 border border-blue-400/30"
                      }`}
                    >
                      {isEnemy ? "Enemy" : combatant.class}
                    </span>
                    {isDead && (
                      <span className="text-xs text-red-400 uppercase tracking-widest">
                        Dead
                      </span>
                    )}
                  </div>

                  <span className="text-[#8a8a9a] text-xs">
                    Initiative: {combatant.initiative}
                  </span>

                  {isEnemy && (
                    <HPControl
                      current={combatant.hp}
                      max={combatant.maxHp}
                      onChange={(newHp) =>
                        handleHpChange(
                          combatant.instanceId ?? combatant.id,
                          newHp,
                        )
                      }
                      resistances={combatant.resistances}
                      immunities={combatant.immunities}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* End combat */}
      <div className="px-6 py-4 border-t border-[#1e1e3a]">
        <button
          onClick={() => {
            if (
              window.confirm("End combat? This will return you to the session.")
            ) {
              onEndCombat();
            }
          }}
          className="w-full border border-red-500/50 text-red-400 py-3 text-xs uppercase tracking-widest hover:bg-red-500/10 transition-all duration-300"
        >
          End Combat
        </button>
      </div>
    </div>
  );
}
