import { useState } from "react";

const ACTION_COSTS = [
  "Action",
  "Bonus Action",
  "Reaction",
  "Legendary Action",
  "Free Action",
];
const ACTION_TYPES = ["Attack", "Save", "Recharge", "Special"];
const SAVE_STATS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
const DAMAGE_TYPES = [
  "Slashing",
  "Piercing",
  "Bludgeoning",
  "Fire",
  "Cold",
  "Lightning",
  "Thunder",
  "Acid",
  "Poison",
  "Necrotic",
  "Radiant",
  "Force",
  "Psychic",
];

const EMPTY_ACTION = {
  id: "",
  name: "",
  actionCost: "Action",
  type: "Attack",
  toHit: "",
  damageDice: "",
  damageModifier: "",
  damageType: "Slashing",
  saveDC: "",
  saveStat: "DEX",
  recharge: "",
  description: "",
};

const EMPTY_TRAIT = {
  id: "",
  name: "",
  description: "",
};

export const EMPTY_CREATURE = {
  name: "",
  cr: "",
  hp: "",
  ac: "",
  initiativeModifier: "",
  speed: "",
  resistances: "",
  immunities: "",
  conditionImmunities: "",
  str: "",
  strMod: "",
  strSave: "",
  dex: "",
  dexMod: "",
  dexSave: "",
  con: "",
  conMod: "",
  conSave: "",
  int: "",
  intMod: "",
  intSave: "",
  wis: "",
  wisMod: "",
  wisSave: "",
  cha: "",
  chaMod: "",
  chaSave: "",
  traits: [],
  legendaryResistances: "",
  legendaryActions: "",
  specialReminders: "",
  notes: "",
  actions: [],
};

function generateActionId() {
  return `action-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function generateTraitId() {
  return `trait-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function validateAction(action) {
  const errors = [];
  if (!action.name.trim()) errors.push("Name is required");
  if (action.type === "Attack") {
    if (action.toHit === "") errors.push("To Hit modifier is required");
    if (!action.damageDice.trim())
      errors.push("Damage dice is required (e.g. 2d6)");
    if (!action.damageType) errors.push("Damage type is required");
  }
  if (action.type === "Save") {
    if (!action.saveDC) errors.push("Save DC is required");
    if (!action.saveStat) errors.push("Save stat is required");
    if (!action.damageDice.trim()) errors.push("Damage dice is required");
    if (!action.damageType) errors.push("Damage type is required");
  }
  if (action.type === "Recharge") {
    if (!action.recharge.trim())
      errors.push("Recharge value is required (e.g. 5-6)");
    if (!action.saveDC) errors.push("Save DC is required");
    if (!action.saveStat) errors.push("Save stat is required");
    if (!action.damageDice.trim()) errors.push("Damage dice is required");
    if (!action.damageType) errors.push("Damage type is required");
  }
  if (action.type === "Special") {
    if (!action.description.trim()) errors.push("Description is required");
  }
  return errors;
}

function TraitEditor({ trait, onChange, onRemove, index }) {
  return (
    <div className="border border-[#1e1e3a] p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#c9a84c] uppercase tracking-widest font-bold">
          Trait {index + 1}
        </span>
        <button
          onClick={onRemove}
          className="text-xs text-[#8a8a9a] hover:text-red-400 uppercase tracking-widest transition-colors"
        >
          Remove
        </button>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
            Trait Name *
          </label>
          <input
            type="text"
            value={trait.name}
            onChange={(e) => onChange({ ...trait, name: e.target.value })}
            placeholder="e.g. Immutable Form"
            className="bg-transparent border border-[#1e1e3a] text-white text-sm placeholder-[#8a8a9a] px-3 py-2 focus:outline-none focus:border-[#c9a84c] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
            Description *
          </label>
          <textarea
            value={trait.description}
            onChange={(e) =>
              onChange({ ...trait, description: e.target.value })
            }
            placeholder="e.g. The dragon is immune to any spell or effect that would alter its form."
            className="bg-transparent border border-[#1e1e3a] text-white text-sm placeholder-[#8a8a9a] px-3 py-2 focus:outline-none focus:border-[#c9a84c] transition-colors resize-none h-20"
          />
        </div>
        {(!trait.name.trim() || !trait.description.trim()) && (
          <p className="text-red-400 text-xs">
            ⚠ Both name and description are required
          </p>
        )}
      </div>
    </div>
  );
}

function ActionEditor({ action, onChange, onRemove, index }) {
  const errors = validateAction(action);
  const hasErrors = errors.length > 0;

  return (
    <div
      className={`border p-4 flex flex-col gap-3 ${hasErrors ? "border-red-500/30" : "border-[#1e1e3a]"}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#c9a84c] uppercase tracking-widest font-bold">
          Action {index + 1}
        </span>
        <button
          onClick={onRemove}
          className="text-xs text-[#8a8a9a] hover:text-red-400 uppercase tracking-widest transition-colors"
        >
          Remove
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
            Name *
          </label>
          <input
            type="text"
            value={action.name}
            onChange={(e) => onChange({ ...action, name: e.target.value })}
            placeholder="e.g. Claw"
            className="bg-transparent border border-[#1e1e3a] text-white text-sm placeholder-[#8a8a9a] px-3 py-2 focus:outline-none focus:border-[#c9a84c] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
            Action Cost *
          </label>
          <select
            value={action.actionCost}
            onChange={(e) =>
              onChange({ ...action, actionCost: e.target.value })
            }
            className="bg-[#0f0f1f] border border-[#1e1e3a] text-white text-sm px-3 py-2 focus:outline-none focus:border-[#c9a84c] transition-colors"
          >
            {ACTION_COSTS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
          Type *
        </label>
        <div className="flex gap-2 flex-wrap">
          {ACTION_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => onChange({ ...action, type: t })}
              className={`text-xs px-3 py-1.5 uppercase tracking-widest border transition-all ${
                action.type === t
                  ? "border-[#c9a84c] text-[#c9a84c] bg-[#c9a84c]/10"
                  : "border-[#1e1e3a] text-[#8a8a9a] hover:border-[#c9a84c] hover:text-[#c9a84c]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {action.type === "Attack" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
              To Hit *
            </label>
            <input
              type="number"
              value={action.toHit}
              onChange={(e) => onChange({ ...action, toHit: e.target.value })}
              placeholder="e.g. 11"
              className="bg-transparent border border-[#1e1e3a] text-white text-sm placeholder-[#8a8a9a] px-3 py-2 focus:outline-none focus:border-[#c9a84c] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
              Damage Dice *
            </label>
            <input
              type="text"
              value={action.damageDice}
              onChange={(e) =>
                onChange({ ...action, damageDice: e.target.value })
              }
              placeholder="e.g. 2d6"
              className="bg-transparent border border-[#1e1e3a] text-white text-sm placeholder-[#8a8a9a] px-3 py-2 focus:outline-none focus:border-[#c9a84c] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
              Damage Modifier
            </label>
            <input
              type="number"
              value={action.damageModifier}
              onChange={(e) =>
                onChange({ ...action, damageModifier: e.target.value })
              }
              placeholder="e.g. 7"
              className="bg-transparent border border-[#1e1e3a] text-white text-sm placeholder-[#8a8a9a] px-3 py-2 focus:outline-none focus:border-[#c9a84c] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
              Damage Type *
            </label>
            <select
              value={action.damageType}
              onChange={(e) =>
                onChange({ ...action, damageType: e.target.value })
              }
              className="bg-[#0f0f1f] border border-[#1e1e3a] text-white text-sm px-3 py-2 focus:outline-none focus:border-[#c9a84c] transition-colors"
            >
              {DAMAGE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {(action.type === "Save" || action.type === "Recharge") && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
              Save DC *
            </label>
            <input
              type="number"
              value={action.saveDC}
              onChange={(e) => onChange({ ...action, saveDC: e.target.value })}
              placeholder="e.g. 16"
              className="bg-transparent border border-[#1e1e3a] text-white text-sm placeholder-[#8a8a9a] px-3 py-2 focus:outline-none focus:border-[#c9a84c] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
              Save Stat *
            </label>
            <select
              value={action.saveStat}
              onChange={(e) =>
                onChange({ ...action, saveStat: e.target.value })
              }
              className="bg-[#0f0f1f] border border-[#1e1e3a] text-white text-sm px-3 py-2 focus:outline-none focus:border-[#c9a84c] transition-colors"
            >
              {SAVE_STATS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
              Damage Dice *
            </label>
            <input
              type="text"
              value={action.damageDice}
              onChange={(e) =>
                onChange({ ...action, damageDice: e.target.value })
              }
              placeholder="e.g. 7d8"
              className="bg-transparent border border-[#1e1e3a] text-white text-sm placeholder-[#8a8a9a] px-3 py-2 focus:outline-none focus:border-[#c9a84c] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
              Damage Modifier
            </label>
            <input
              type="number"
              value={action.damageModifier}
              onChange={(e) =>
                onChange({ ...action, damageModifier: e.target.value })
              }
              placeholder="e.g. 0"
              className="bg-transparent border border-[#1e1e3a] text-white text-sm placeholder-[#8a8a9a] px-3 py-2 focus:outline-none focus:border-[#c9a84c] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
              Damage Type *
            </label>
            <select
              value={action.damageType}
              onChange={(e) =>
                onChange({ ...action, damageType: e.target.value })
              }
              className="bg-[#0f0f1f] border border-[#1e1e3a] text-white text-sm px-3 py-2 focus:outline-none focus:border-[#c9a84c] transition-colors"
            >
              {DAMAGE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          {action.type === "Recharge" && (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
                Recharge *
              </label>
              <input
                type="text"
                value={action.recharge}
                onChange={(e) =>
                  onChange({ ...action, recharge: e.target.value })
                }
                placeholder="e.g. 5-6"
                className="bg-transparent border border-[#1e1e3a] text-white text-sm placeholder-[#8a8a9a] px-3 py-2 focus:outline-none focus:border-[#c9a84c] transition-colors"
              />
            </div>
          )}
        </div>
      )}

      {action.type === "Special" && (
        <div className="flex flex-col gap-1">
          <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
            Description *
          </label>
          <textarea
            value={action.description}
            onChange={(e) =>
              onChange({ ...action, description: e.target.value })
            }
            placeholder="e.g. Use Malevolent Presence, then make three attacks with Claw, Tail and Wings."
            className="bg-transparent border border-[#1e1e3a] text-white text-sm placeholder-[#8a8a9a] px-3 py-2 focus:outline-none focus:border-[#c9a84c] transition-colors resize-none h-20"
          />
        </div>
      )}

      {hasErrors && (
        <div className="flex flex-col gap-1">
          {errors.map((err, i) => (
            <p key={i} className="text-red-400 text-xs">
              ⚠ {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  large = false,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
        {label}
      </label>
      {large ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent border border-[#1e1e3a] text-white text-sm placeholder-[#8a8a9a] px-3 py-2 focus:outline-none focus:border-[#c9a84c] transition-colors resize-none h-24"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent border border-[#1e1e3a] text-white text-sm placeholder-[#8a8a9a] px-3 py-2 focus:outline-none focus:border-[#c9a84c] transition-colors"
        />
      )}
    </div>
  );
}

export default function CreatureBuilder({
  creature,
  onChange,
  onSave,
  onClear,
  isSaving,
}) {
  const update = (field) => (value) =>
    onChange({ ...creature, [field]: value });

  const handleActionChange = (index, updated) => {
    const newActions = [...(creature.actions ?? [])];
    newActions[index] = updated;
    onChange({ ...creature, actions: newActions });
  };

  const handleAddAction = () => {
    const newAction = { ...EMPTY_ACTION, id: generateActionId() };
    onChange({
      ...creature,
      actions: [...(creature.actions ?? []), newAction],
    });
  };

  const handleRemoveAction = (index) => {
    const newActions = (creature.actions ?? []).filter((_, i) => i !== index);
    onChange({ ...creature, actions: newActions });
  };

  const handleAddTrait = () => {
    const newTrait = { ...EMPTY_TRAIT, id: generateTraitId() };
    onChange({ ...creature, traits: [...(creature.traits ?? []), newTrait] });
  };

  const handleTraitChange = (index, updated) => {
    const newTraits = [...(creature.traits ?? [])];
    newTraits[index] = updated;
    onChange({ ...creature, traits: newTraits });
  };

  const handleRemoveTrait = (index) => {
    const newTraits = (creature.traits ?? []).filter((_, i) => i !== index);
    onChange({ ...creature, traits: newTraits });
  };

  const actions = creature.actions ?? [];
  const traits = creature.traits ?? [];
  const hasNoActions = actions.length === 0;
  const hasInvalidActions = actions.some((a) => validateAction(a).length > 0);
  const hasInvalidTraits = traits.some(
    (t) => !t.name.trim() || !t.description.trim(),
  );
  const isValid =
    creature.name?.trim() &&
    creature.hp &&
    creature.ac &&
    !hasNoActions &&
    !hasInvalidActions &&
    !hasInvalidTraits;

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="bg-[#12122a] border border-[#1e1e3a] p-8 flex flex-col gap-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#c9a84c] uppercase tracking-widest">
            {creature.name?.trim() ? creature.name : "New Creature"}
          </h2>
          <div className="flex gap-4">
            <button
              onClick={onClear}
              className="text-xs text-[#8a8a9a] uppercase tracking-widest hover:text-white transition-colors"
            >
              Clear
            </button>
            <button
              onClick={onSave}
              disabled={!isValid || isSaving}
              className={`px-6 py-2 text-xs uppercase tracking-widest font-bold transition-all duration-300 ${
                isValid && !isSaving
                  ? "bg-[#c9a84c] text-[#12122a] hover:bg-white"
                  : "bg-[#1e1e3a] text-[#8a8a9a] cursor-not-allowed"
              }`}
            >
              {isSaving ? "Saving..." : "Save Creature"}
            </button>
          </div>
        </div>

        {/* Validation summary */}
        {!isValid && (
          <div className="flex flex-col gap-1">
            {!creature.name?.trim() && (
              <p className="text-red-400 text-xs">
                ⚠ Creature name is required
              </p>
            )}
            {!creature.hp && (
              <p className="text-red-400 text-xs">⚠ HP is required</p>
            )}
            {!creature.ac && (
              <p className="text-red-400 text-xs">⚠ AC is required</p>
            )}
            {hasNoActions && (
              <p className="text-red-400 text-xs">
                ⚠ At least one action is required
              </p>
            )}
          </div>
        )}

        {/* Basic info */}
        <div>
          <h3 className="text-xs text-[#c9a84c] uppercase tracking-widest mb-4 border-b border-[#1e1e3a] pb-2">
            Basic Info
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Name *"
              value={creature.name}
              onChange={update("name")}
              placeholder="e.g. Chardalyn Dragon"
            />
            <Field
              label="CR"
              value={creature.cr}
              onChange={update("cr")}
              placeholder="e.g. 11"
            />
            <Field
              label="HP *"
              value={creature.hp}
              onChange={update("hp")}
              placeholder="e.g. 147"
              type="number"
            />
            <Field
              label="AC *"
              value={creature.ac}
              onChange={update("ac")}
              placeholder="e.g. 17"
              type="number"
            />
            <Field
              label="Initiative Modifier"
              value={creature.initiativeModifier}
              onChange={update("initiativeModifier")}
              placeholder="e.g. 0"
              type="number"
            />
            <Field
              label="Speed"
              value={creature.speed}
              onChange={update("speed")}
              placeholder="e.g. 30ft, Fly 90ft"
            />
          </div>
        </div>

        {/* Ability scores */}
        <div>
          <h3 className="text-xs text-[#c9a84c] uppercase tracking-widest mb-4 border-b border-[#1e1e3a] pb-2">
            Ability Scores
          </h3>
          <div className="grid grid-cols-3 gap-4">
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
                className="flex flex-col gap-2 border border-[#1e1e3a] p-3"
              >
                <p className="text-xs text-[#c9a84c] uppercase tracking-widest font-bold text-center">
                  {label}
                </p>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
                    Score
                  </label>
                  <input
                    type="number"
                    value={creature[stat]}
                    onChange={(e) =>
                      onChange({ ...creature, [stat]: e.target.value })
                    }
                    placeholder="e.g. 24"
                    className="bg-transparent border border-[#1e1e3a] text-white text-sm text-center px-2 py-1 focus:outline-none focus:border-[#c9a84c] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
                    Modifier
                  </label>
                  <input
                    type="text"
                    value={creature[`${stat}Mod`]}
                    onChange={(e) =>
                      onChange({ ...creature, [`${stat}Mod`]: e.target.value })
                    }
                    placeholder="e.g. +7"
                    className="bg-transparent border border-[#1e1e3a] text-white text-sm text-center px-2 py-1 focus:outline-none focus:border-[#c9a84c] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
                    Save
                  </label>
                  <input
                    type="text"
                    value={creature[`${stat}Save`]}
                    onChange={(e) =>
                      onChange({ ...creature, [`${stat}Save`]: e.target.value })
                    }
                    placeholder="e.g. +11"
                    className="bg-transparent border border-[#1e1e3a] text-white text-sm text-center px-2 py-1 focus:outline-none focus:border-[#c9a84c] transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Defenses */}
        <div>
          <h3 className="text-xs text-[#c9a84c] uppercase tracking-widest mb-4 border-b border-[#1e1e3a] pb-2">
            Defenses
          </h3>
          <div className="flex flex-col gap-4">
            <Field
              label="Resistances"
              value={creature.resistances}
              onChange={update("resistances")}
              placeholder="e.g. Radiant; Bludgeoning, Piercing, Slashing from nonmagical attacks"
            />
            <Field
              label="Damage Immunities"
              value={creature.immunities}
              onChange={update("immunities")}
              placeholder="e.g. Cold, Poison"
            />
            <Field
              label="Condition Immunities"
              value={creature.conditionImmunities}
              onChange={update("conditionImmunities")}
              placeholder="e.g. Charmed, Exhaustion, Frightened"
            />
          </div>
        </div>

        {/* Legendary */}
        <div>
          <h3 className="text-xs text-[#c9a84c] uppercase tracking-widest mb-4 border-b border-[#1e1e3a] pb-2">
            Legendary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Legendary Resistances"
              value={creature.legendaryResistances}
              onChange={update("legendaryResistances")}
              placeholder="e.g. 3"
              type="number"
            />
            <Field
              label="Legendary Actions"
              value={creature.legendaryActions}
              onChange={update("legendaryActions")}
              placeholder="e.g. 3"
              type="number"
            />
          </div>
        </div>

        {/* Traits */}
        <div>
          <h3 className="text-xs text-[#c9a84c] uppercase tracking-widest mb-4 border-b border-[#1e1e3a] pb-2">
            Traits
          </h3>
          <div className="flex flex-col gap-4">
            {traits.map((trait, index) => (
              <TraitEditor
                key={trait.id}
                trait={trait}
                index={index}
                onChange={(updated) => handleTraitChange(index, updated)}
                onRemove={() => handleRemoveTrait(index)}
              />
            ))}
            <button
              onClick={handleAddTrait}
              className="border border-dashed border-[#3a3a5a] text-[#8a8a9a] py-3 text-xs uppercase tracking-widest hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all duration-200"
            >
              + Add Trait
            </button>
          </div>
        </div>

        {/* Actions */}
        <div>
          <h3 className="text-xs text-[#c9a84c] uppercase tracking-widest mb-4 border-b border-[#1e1e3a] pb-2">
            Actions
          </h3>
          <div className="flex flex-col gap-4">
            {actions.map((action, index) => (
              <ActionEditor
                key={action.id}
                action={action}
                index={index}
                onChange={(updated) => handleActionChange(index, updated)}
                onRemove={() => handleRemoveAction(index)}
              />
            ))}
            <button
              onClick={handleAddAction}
              className="border border-dashed border-[#3a3a5a] text-[#8a8a9a] py-3 text-xs uppercase tracking-widest hover:border-[#c9a84c] hover:text-[#c9a84c] transition-all duration-200"
            >
              + Add Action
            </button>
          </div>
        </div>

        {/* Special Reminders */}
        <div>
          <h3 className="text-xs text-[#c9a84c] uppercase tracking-widest mb-4 border-b border-[#1e1e3a] pb-2">
            Special Reminders
          </h3>
          <Field
            label="Reminders"
            value={creature.specialReminders}
            onChange={update("specialReminders")}
            placeholder="e.g. Flees if takes 30+ damage in one round!"
            large
          />
        </div>

        {/* Notes */}
        <div>
          <h3 className="text-xs text-[#c9a84c] uppercase tracking-widest mb-4 border-b border-[#1e1e3a] pb-2">
            Notes
          </h3>
          <Field
            label="Additional Notes"
            value={creature.notes}
            onChange={update("notes")}
            placeholder="Anything else you need to remember..."
            large
          />
        </div>
      </div>
    </div>
  );
}
