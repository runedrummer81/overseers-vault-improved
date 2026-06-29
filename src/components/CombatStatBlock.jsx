import { useState } from "react";
import { rollD20, rollDamage, rollRecharge } from "../utils/dice";

function RollResult({ result, onClose }) {
  if (!result) return null;
  return (
    <div className="mt-2 bg-[#1e1e3a] border border-[#c9a84c]/30 px-3 py-2 flex items-center justify-between">
      <div>
        <p className="text-[#c9a84c] text-xs uppercase tracking-widest">
          {result.label}
        </p>
        <p className="text-white font-bold text-lg">{result.total}</p>
        <p className="text-[#8a8a9a] text-xs">{result.detail}</p>
      </div>
      <button
        onClick={onClose}
        className="text-[#8a8a9a] hover:text-white text-xs"
      >
        ✕
      </button>
    </div>
  );
}

function ActionCard({ action }) {
  const [result, setResult] = useState(null);

  const handleRollToHit = () => {
    const { roll, modifier, total } = rollD20(Number(action.toHit));
    setResult({
      label: `${action.name} — To Hit`,
      total,
      detail: `d20 (${roll}) + ${modifier} = ${total}`,
    });
  };

  const handleRollDamage = () => {
    const { rolls, total } = rollDamage(
      action.damageDice,
      action.damageModifier,
    );
    setResult({
      label: `${action.name} — Damage`,
      total,
      detail: `${action.damageDice} [${rolls.join(", ")}] + ${action.damageModifier} = ${total} ${action.damageType}`,
    });
  };

  const handleRollRecharge = () => {
    const { roll, recharged } = rollRecharge(action.recharge);
    setResult({
      label: `${action.name} — Recharge`,
      total: roll,
      detail: recharged
        ? `✓ Recharged! (rolled ${roll}, needed ${action.recharge})`
        : `✗ Not recharged (rolled ${roll}, needed ${action.recharge})`,
    });
  };

  const handleRollSaveDamage = () => {
    const { rolls, total } = rollDamage(
      action.damageDice,
      action.damageModifier,
    );
    setResult({
      label: `${action.name} — Damage`,
      total,
      detail: `${action.damageDice} [${rolls.join(", ")}] + ${action.damageModifier ?? 0} = ${total} ${action.damageType} (DC ${action.saveDC} ${action.saveStat})`,
    });
  };

  return (
    <div className="border border-[#1e1e3a] p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-white text-sm font-bold">{action.name}</span>
          <span className="text-[#8a8a9a] text-xs ml-2 uppercase tracking-widest">
            {action.actionCost}
          </span>
        </div>
        <span
          className={`text-xs px-2 py-0.5 uppercase tracking-widest border ${
            action.type === "Attack"
              ? "text-red-400 border-red-400/30"
              : action.type === "Save"
                ? "text-blue-400 border-blue-400/30"
                : action.type === "Recharge"
                  ? "text-purple-400 border-purple-400/30"
                  : "text-[#8a8a9a] border-[#3a3a5a]"
          }`}
        >
          {action.type}
        </span>
      </div>

      {/* Attack info + buttons */}
      {action.type === "Attack" && (
        <div className="flex flex-col gap-2">
          <p className="text-[#8a8a9a] text-xs">
            +{action.toHit} to hit · {action.damageDice}+{action.damageModifier}{" "}
            {action.damageType}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleRollToHit}
              className="text-xs px-3 py-1.5 border border-[#c9a84c]/50 text-[#c9a84c] hover:bg-[#c9a84c]/10 transition-colors uppercase tracking-widest"
            >
              🎲 Roll Hit
            </button>
            <button
              onClick={handleRollDamage}
              className="text-xs px-3 py-1.5 border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors uppercase tracking-widest"
            >
              🎲 Roll DMG
            </button>
          </div>
        </div>
      )}

      {/* Save info + buttons */}
      {action.type === "Save" && (
        <div className="flex flex-col gap-2">
          <p className="text-[#8a8a9a] text-xs">
            DC {action.saveDC} {action.saveStat} · {action.damageDice}
            {action.damageModifier ? `+${action.damageModifier}` : ""}{" "}
            {action.damageType}
          </p>
          <button
            onClick={handleRollSaveDamage}
            className="text-xs px-3 py-1.5 border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors uppercase tracking-widest w-fit"
          >
            🎲 Roll DMG
          </button>
        </div>
      )}

      {/* Recharge info + buttons */}
      {action.type === "Recharge" && (
        <div className="flex flex-col gap-2">
          <p className="text-[#8a8a9a] text-xs">
            Recharge {action.recharge} · DC {action.saveDC} {action.saveStat} ·{" "}
            {action.damageDice}
            {action.damageModifier ? `+${action.damageModifier}` : ""}{" "}
            {action.damageType}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleRollRecharge}
              className="text-xs px-3 py-1.5 border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transition-colors uppercase tracking-widest"
            >
              🎲 Recharge
            </button>
            <button
              onClick={handleRollSaveDamage}
              className="text-xs px-3 py-1.5 border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors uppercase tracking-widest"
            >
              🎲 Roll DMG
            </button>
          </div>
        </div>
      )}

      {/* Special — just description */}
      {action.type === "Special" && (
        <p className="text-[#8a8a9a] text-xs leading-relaxed">
          {action.description}
        </p>
      )}

      {/* Roll result */}
      <RollResult result={result} onClose={() => setResult(null)} />
    </div>
  );
}

function SavingThrowRoller({ combatant }) {
  const [result, setResult] = useState(null);
  const stats = [
    { stat: "str", label: "STR" },
    { stat: "dex", label: "DEX" },
    { stat: "con", label: "CON" },
    { stat: "int", label: "INT" },
    { stat: "wis", label: "WIS" },
    { stat: "cha", label: "CHA" },
  ];

  const handleRollSave = (stat, label) => {
    const modifier = combatant[`${stat}Save`] ?? combatant[`${stat}Mod`] ?? "0";
    const numericMod = parseInt(modifier.toString().replace("+", "")) || 0;
    const { roll, total } = rollD20(numericMod);
    setResult({
      label: `${label} Saving Throw`,
      total,
      detail: `d20 (${roll}) + (${modifier}) = ${total}`,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 flex-wrap">
        {stats.map(({ stat, label }) => (
          <button
            key={stat}
            onClick={() => handleRollSave(stat, label)}
            className="text-xs px-3 py-1.5 border border-[#1e1e3a] text-[#8a8a9a] hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all uppercase tracking-widest"
          >
            🎲 {label}{" "}
            {combatant[`${stat}Save`]
              ? `(${combatant[`${stat}Save`]})`
              : combatant[`${stat}Mod`]
                ? `(${combatant[`${stat}Mod`]})`
                : ""}
          </button>
        ))}
      </div>
      <RollResult result={result} onClose={() => setResult(null)} />
    </div>
  );
}

export default function CombatStatBlock({ combatant }) {
  if (!combatant) {
    return (
      <div className="flex-1 bg-[#12122a] border border-[#1e1e3a] flex items-center justify-center">
        <p className="text-[#8a8a9a] text-sm uppercase tracking-widest text-center px-8">
          Click an enemy in the initiative order to view their stat block
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#12122a] border border-[#1e1e3a] overflow-y-auto p-8">
      <div className="flex flex-col gap-6">
        {/* Name */}
        <div className="border-b border-[#c9a84c] pb-4">
          <h2 className="text-2xl font-bold text-[#c9a84c] uppercase tracking-widest">
            {combatant.name}
          </h2>
          <p className="text-[#8a8a9a] text-xs mt-1 uppercase tracking-widest">
            HP {combatant.hp}/{combatant.maxHp} · AC {combatant.ac}
          </p>
        </div>

        {/* Speed */}
        {combatant.speed && (
          <div>
            <p className="text-xs text-[#8a8a9a] uppercase tracking-widest mb-1">
              Speed
            </p>
            <p className="text-white text-sm">{combatant.speed}</p>
          </div>
        )}

        {/* Ability scores */}
        {(combatant.str || combatant.dex || combatant.con) && (
          <div>
            <p className="text-xs text-[#8a8a9a] uppercase tracking-widest mb-3">
              Ability Scores
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { stat: "str", label: "STR" },
                { stat: "dex", label: "DEX" },
                { stat: "con", label: "CON" },
                { stat: "int", label: "INT" },
                { stat: "wis", label: "WIS" },
                { stat: "cha", label: "CHA" },
              ].map(({ stat, label }) => (
                <div
                  key={stat}
                  className="flex flex-col items-center border border-[#1e1e3a] py-2 px-1"
                >
                  <span className="text-xs text-[#8a8a9a] uppercase tracking-widest">
                    {label}
                  </span>
                  <span className="text-white font-bold text-sm mt-1">
                    {combatant[stat] || "—"}
                  </span>
                  <span className="text-[#c9a84c] text-xs">
                    {combatant[`${stat}Mod`] || "—"}
                  </span>
                  <span className="text-[#8a8a9a] text-xs">
                    Save: {combatant[`${stat}Save`] || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Defenses */}
        {combatant.resistances && (
          <div>
            <p className="text-xs text-[#8a8a9a] uppercase tracking-widest mb-1">
              Resistances
            </p>
            <p className="text-white text-sm">{combatant.resistances}</p>
          </div>
        )}
        {combatant.immunities && (
          <div>
            <p className="text-xs text-[#8a8a9a] uppercase tracking-widest mb-1">
              Damage Immunities
            </p>
            <p className="text-white text-sm">{combatant.immunities}</p>
          </div>
        )}
        {combatant.conditionImmunities && (
          <div>
            <p className="text-xs text-[#8a8a9a] uppercase tracking-widest mb-1">
              Condition Immunities
            </p>
            <p className="text-white text-sm">
              {combatant.conditionImmunities}
            </p>
          </div>
        )}

        {/* Legendary */}
        {(combatant.legendaryResistances || combatant.legendaryActions) && (
          <div className="flex gap-6">
            {combatant.legendaryResistances && (
              <div>
                <p className="text-xs text-[#8a8a9a] uppercase tracking-widest mb-1">
                  Legendary Resistances
                </p>
                <p className="text-white font-bold text-lg">
                  {combatant.legendaryResistances}
                </p>
              </div>
            )}
            {combatant.legendaryActions && (
              <div>
                <p className="text-xs text-[#8a8a9a] uppercase tracking-widest mb-1">
                  Legendary Actions
                </p>
                <p className="text-white font-bold text-lg">
                  {combatant.legendaryActions}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Traits */}
        {combatant.traits?.length > 0 && (
          <div>
            <p className="text-xs text-[#8a8a9a] uppercase tracking-widest mb-3">
              Traits
            </p>
            <div className="flex flex-col gap-3">
              {combatant.traits.map((trait) => (
                <div key={trait.id}>
                  <span className="text-white text-sm font-bold italic">
                    {trait.name}.{" "}
                  </span>
                  <span className="text-white text-sm">
                    {trait.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saving Throws */}
        {(combatant.strSave || combatant.strMod) && (
          <div>
            <p className="text-xs text-[#8a8a9a] uppercase tracking-widest mb-3">
              Saving Throws
            </p>
            <SavingThrowRoller combatant={combatant} />
          </div>
        )}

        {/* Actions */}
        {combatant.actions?.length > 0 && (
          <div>
            <p className="text-xs text-[#8a8a9a] uppercase tracking-widest mb-3">
              Actions
            </p>
            <div className="flex flex-col gap-3">
              {combatant.actions.map((action) => (
                <ActionCard key={action.id} action={action} />
              ))}
            </div>
          </div>
        )}

        {/* Special reminders */}
        {combatant.specialReminders && (
          <div className="bg-red-500/10 border border-red-500/30 px-4 py-3">
            <p className="text-xs text-red-400 uppercase tracking-widest mb-1">
              ⚠ Special Reminders
            </p>
            <p className="text-white text-sm leading-relaxed">
              {combatant.specialReminders}
            </p>
          </div>
        )}

        {/* Notes */}
        {combatant.notes && (
          <div>
            <p className="text-xs text-[#8a8a9a] uppercase tracking-widest mb-2">
              Notes
            </p>
            <p className="text-white text-sm leading-relaxed">
              {combatant.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
