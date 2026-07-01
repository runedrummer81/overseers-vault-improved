import { avgDice } from "./creatureConstants";

// Glowing gradient divider — same technique as the breadcrumb underline
function Divider() {
  return (
    <div className="relative h-px my-4">
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, transparent, var(--color-secondary) 25%, var(--color-secondary) 75%, transparent)",
          filter: "blur(2px)",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, transparent, var(--color-secondary) 25%, var(--color-secondary) 75%, transparent)",
        }}
      />
    </div>
  );
}

function Row({ label, value }) {
  if (!value) return null;
  return (
    <p className="text-sm leading-relaxed text-[#e2ddd0]">
      <span className="font-bold text-secondary">{label} </span>
      {value}
    </p>
  );
}

// Section heading — left accent bar + bold uppercase label
function SectionHeader({ children }) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <div className="w-0.5 h-4 bg-secondary shrink-0" />
      <p className="text-secondary text-sm uppercase tracking-widest font-bold">
        {children}
      </p>
    </div>
  );
}

function formatActionText(action) {
  const name = action.name || "Unnamed";
  const mod = parseInt(action.damageModifier) || 0;
  const primaryAvg = avgDice(action.damageDice) + mod;

  if (action.type === "Multiattack" || action.type === "Special")
    return `${name}. ${action.description || ""}`;

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
      saveStr = `DC ${action.saveDC} ${action.saveStat} saving throw, taking ${dmgStr} on a failed save${halfStr}.`;
    }
    return `${name}${rechargeStr}. ${action.description || ""}${saveStr ? " " + saveStr : ""}`.trim();
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
    <div className="text-[#e2ddd0] leading-relaxed">
      {/* Header — name large and authoritative, type in elegant italic */}
      <div className="mb-2">
        <h2
          className="text-primary font-bold uppercase tracking-wide leading-tight"
          style={{ fontSize: "1.6rem" }}
        >
          {creature.name || "New creature"}
        </h2>
        {typeBlock && (
          <p
            className="text-secondary text-base mt-1"
            style={{ fontFamily: "EB Garamond, serif" }}
          >
            {typeBlock}
          </p>
        )}
      </div>

      <Divider />

      {/* Combat basics */}
      <div className="flex flex-col gap-1.5">
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
      <div className="grid grid-cols-6 gap-1 text-center my-3">
        {["str", "dex", "con", "int", "wis", "cha"].map((stat) => (
          <div key={stat} className="flex flex-col gap-0.5">
            <p className="font-bold text-secondary text-sm uppercase">{stat}</p>
            <p className="text-[#e2ddd0] text-base">{creature[stat] || "—"}</p>
            <p className="text-[#e2ddd0] text-sm">
              {creature[`${stat}Mod`] ? `(${creature[`${stat}Mod`]})` : ""}
            </p>
          </div>
        ))}
      </div>

      <Divider />

      {/* Properties */}
      <div className="flex flex-col gap-1.5">
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
          <Row
            label="Damage Vulnerabilities"
            value={creature.vulnerabilities}
          />
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
      </div>

      {/* Traits */}
      {creature.traits?.length > 0 && (
        <>
          <Divider />
          <div className="flex flex-col gap-3">
            {creature.traits.map((trait) => (
              <p
                key={trait.id}
                className="text-sm leading-relaxed text-[#e2ddd0]"
              >
                <span className="font-bold text-secondary">{trait.name}. </span>
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
          <SectionHeader>Actions</SectionHeader>
          <div className="flex flex-col gap-3">
            {creature.actions.map((action) => (
              <p
                key={action.id}
                className="text-sm leading-relaxed text-[#e2ddd0]"
              >
                <span className="font-bold text-secondary">
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
          <SectionHeader>Reactions</SectionHeader>
          <div className="flex flex-col gap-3">
            {creature.reactions.map((r) => (
              <p key={r.id} className="text-sm leading-relaxed text-[#e2ddd0]">
                <span className="font-bold text-secondary">{r.name}. </span>
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
          <SectionHeader>Legendary actions</SectionHeader>
          {creature.legendaryActionsPerRound && (
            <p className="text-sm text-secondary mb-3">
              The creature can take {creature.legendaryActionsPerRound}{" "}
              legendary{" "}
              {creature.legendaryActionsPerRound === "1" ? "action" : "actions"}{" "}
              per round.
            </p>
          )}
          <div className="flex flex-col gap-3">
            {creature.legendaryActions?.map((la) => (
              <p key={la.id} className="text-sm leading-relaxed text-[#e2ddd0]">
                <span className="font-bold text-secondary">
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

      {/* DM reminders */}
      {creature.specialReminders && (
        <>
          <Divider />
          <div className="border border-secondary p-4">
            <p className="text-xs uppercase tracking-widest text-secondary mb-2">
              DM reminders
            </p>
            <p className="text-sm text-primary leading-relaxed">
              {creature.specialReminders}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
