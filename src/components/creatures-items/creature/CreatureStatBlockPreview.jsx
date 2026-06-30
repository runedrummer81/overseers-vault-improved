import { avgDice } from "./creatureConstants";

function Divider() {
  return <div className="border-t-2 border-secondary my-3" />;
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <p className="text-xs leading-relaxed text-[#c9c3b0]">
      <span className="font-bold text-secondary">{label} </span>
      {value}
    </p>
  );
}

function formatActionText(action) {
  const name = action.name || "Unnamed";
  const mod = parseInt(action.damageModifier) || 0;
  const primaryAvg = avgDice(action.damageDice) + mod;

  if (action.type === "Multiattack" || action.type === "Special") {
    return `${name}. ${action.description || ""}`;
  }

  if (action.type === "Attack") {
    if (!action.toHit && !action.damageDice)
      return `${name}. ${action.description || ""}`;
    const hitStr = action.toHit ? `+${action.toHit} to hit` : "";
    const reachStr = action.reach ? `reach ${action.reach}` : "";
    const hitParts = [hitStr, reachStr, "one target"]
      .filter(Boolean)
      .join(", ");
    let dmgStr = "";
    if (action.damageDice) {
      const modStr = mod !== 0 ? ` + ${mod}` : "";
      dmgStr = `${primaryAvg} (${action.damageDice}${modStr}) ${action.damageType} damage`;
    }
    let secStr = "";
    if (action.secondaryDamageDice) {
      const secMod = parseInt(action.secondaryDamageModifier) || 0;
      const secAvg = avgDice(action.secondaryDamageDice) + secMod;
      const secModStr = secMod !== 0 ? ` + ${secMod}` : "";
      secStr = ` plus ${secAvg} (${action.secondaryDamageDice}${secModStr}) ${action.secondaryDamageType || ""} damage`;
    }
    const attackType = action.attackType || "Melee Weapon";
    let text = `${name}. ${attackType} Attack: ${hitParts}. Hit: ${dmgStr}${secStr}.`;
    if (action.description) text += ` ${action.description}`;
    return text;
  }

  if (action.type === "Save" || action.type === "Recharge") {
    const rechargeStr =
      action.type === "Recharge" && action.recharge
        ? ` (Recharge ${action.recharge})`
        : "";
    let saveStr = "";
    if (action.saveDC) {
      const modStr = mod !== 0 ? ` + ${mod}` : "";
      const dmgStr = action.damageDice
        ? `${primaryAvg} (${action.damageDice}${modStr}) ${action.damageType} damage`
        : "";
      const halfStr = action.halfOnSave
        ? ", or half as much on a successful one"
        : "";
      saveStr = action.saveDC
        ? `DC ${action.saveDC} ${action.saveStat} saving throw, taking ${dmgStr} on a failed save${halfStr}.`
        : "";
    }
    let text = `${name}${rechargeStr}. ${action.description || ""}${saveStr ? " " + saveStr : ""}`;
    return text.trim();
  }

  return `${name}. ${action.description || ""}`;
}

export default function CreatureStatBlockPreview({ creature }) {
  const hasLegendary =
    creature.legendaryResistances ||
    creature.legendaryActionsPerRound ||
    creature.legendaryActions?.length > 0;

  const typeBlock = [creature.size, creature.type, creature.alignment]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="text-[#c9c3b0] text-xs leading-relaxed">
      {/* Header */}
      <div className="mb-3">
        <h2 className="text-primary text-xl font-bold uppercase tracking-wide leading-tight">
          {creature.name || "New creature"}
        </h2>
        {typeBlock && (
          <p className="text-secondary text-xs italic mt-0.5">{typeBlock}</p>
        )}
      </div>

      <Divider />

      {/* Combat basics */}
      <div className="flex flex-col gap-1">
        {creature.ac && (
          <Row
            label="Armor Class"
            value={`${creature.ac}${creature.acType ? ` (${creature.acType})` : ""}`}
          />
        )}
        {creature.hp && (
          <Row
            label="Hit Points"
            value={`${creature.hp}${creature.hpFormula ? ` (${creature.hpFormula})` : ""}`}
          />
        )}
        {creature.speed && <Row label="Speed" value={creature.speed} />}
      </div>

      <Divider />

      {/* Ability scores */}
      <div className="grid grid-cols-6 gap-1 text-center my-2">
        {["str", "dex", "con", "int", "wis", "cha"].map((stat) => (
          <div key={stat}>
            <p className="font-bold text-secondary text-[10px] uppercase">
              {stat}
            </p>
            <p className="text-[#c9c3b0] text-[10px]">
              {creature[stat] || "—"}
            </p>
            <p className="text-[#c9c3b0] text-[10px]">
              {creature[`${stat}Mod`] ? `(${creature[`${stat}Mod`]})` : ""}
            </p>
          </div>
        ))}
      </div>

      <Divider />

      {/* Saving throws — only those explicitly set */}
      {(() => {
        const saves = ["str", "dex", "con", "int", "wis", "cha"]
          .filter((s) => creature[`${s}Save`])
          .map((s) => `${s.toUpperCase()} ${creature[`${s}Save`]}`)
          .join(", ");
        return saves ? <Row label="Saving Throws" value={saves} /> : null;
      })()}

      {creature.resistances && (
        <Row label="Damage Resistances" value={creature.resistances} />
      )}
      {creature.immunities && (
        <Row label="Damage Immunities" value={creature.immunities} />
      )}
      {creature.vulnerabilities && (
        <Row label="Damage Vulnerabilities" value={creature.vulnerabilities} />
      )}
      {creature.conditionImmunities && (
        <Row
          label="Condition Immunities"
          value={creature.conditionImmunities}
        />
      )}
      {creature.senses && (
        <Row
          label="Senses"
          value={`${creature.senses}${creature.passivePerception ? `, passive Perception ${creature.passivePerception}` : ""}`}
        />
      )}
      {creature.languages && (
        <Row label="Languages" value={creature.languages} />
      )}
      {creature.cr && <Row label="Challenge" value={creature.cr} />}

      {/* Traits */}
      {creature.traits?.length > 0 && (
        <>
          <Divider />
          <div className="flex flex-col gap-2">
            {creature.traits.map((trait) => (
              <p
                key={trait.id}
                className="text-xs leading-relaxed text-[#c9c3b0]"
              >
                <span className="font-bold italic text-[#c9c3b0]">
                  {trait.name}.{" "}
                </span>
                {trait.description}
              </p>
            ))}
          </div>
        </>
      )}

      {/* Actions */}
      {creature.actions?.length > 0 && (
        <>
          <Divider />
          <p className="text-secondary text-xs uppercase tracking-widest font-bold mb-2">
            Actions
          </p>
          <div className="flex flex-col gap-2">
            {creature.actions.map((action) => (
              <p
                key={action.id}
                className="text-xs leading-relaxed text-[#c9c3b0]"
              >
                <span className="font-bold italic text-[#c9c3b0]">
                  {action.name}
                  {action.type === "Recharge" && action.recharge
                    ? ` (Recharge ${action.recharge})`
                    : ""}
                  .{" "}
                </span>
                {formatActionText(action).replace(/^[^.]+\.\s*/, "")}
              </p>
            ))}
          </div>
        </>
      )}

      {/* Reactions */}
      {creature.reactions?.length > 0 && (
        <>
          <Divider />
          <p className="text-secondary text-xs uppercase tracking-widest font-bold mb-2">
            Reactions
          </p>
          <div className="flex flex-col gap-2">
            {creature.reactions.map((r) => (
              <p key={r.id} className="text-xs leading-relaxed text-[#c9c3b0]">
                <span className="font-bold italic text-[#c9c3b0]">
                  {r.name}.{" "}
                </span>
                {r.description}
              </p>
            ))}
          </div>
        </>
      )}

      {/* Legendary */}
      {hasLegendary && (
        <>
          <Divider />
          <p className="text-secondary text-xs uppercase tracking-widest font-bold mb-2">
            Legendary actions
          </p>
          {creature.legendaryActionsPerRound && (
            <p className="text-xs text-[#c9c3b0] mb-2 italic">
              The creature can take {creature.legendaryActionsPerRound}{" "}
              legendary{" "}
              {creature.legendaryActionsPerRound === "1" ? "action" : "actions"}{" "}
              per round.
            </p>
          )}
          <div className="flex flex-col gap-2">
            {creature.legendaryActions?.map((la) => (
              <p key={la.id} className="text-xs leading-relaxed text-[#c9c3b0]">
                <span className="font-bold italic text-[#c9c3b0]">
                  {la.name}
                  {la.cost && la.cost !== "1"
                    ? ` (Costs ${la.cost} Actions)`
                    : ""}
                  .{" "}
                </span>
                {la.description}
              </p>
            ))}
          </div>
        </>
      )}

      {/* Special reminders — DM only, highlighted */}
      {creature.specialReminders && (
        <>
          <Divider />
          <div className="border border-secondary p-3">
            <p className="text-[10px] uppercase tracking-widest text-secondary mb-1">
              DM reminders
            </p>
            <p className="text-xs text-primary leading-relaxed">
              {creature.specialReminders}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
