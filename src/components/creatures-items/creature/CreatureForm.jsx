import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SIZES,
  DAMAGE_TYPES,
  ABILITY_STATS,
  calcMod,
  generateId,
  EMPTY_ACTION,
  EMPTY_TRAIT,
  EMPTY_LEGENDARY_ACTION,
} from "./creatureConstants";
import CreatureActionEditor from "./CreatureActionEditor";

function Field({ label, children, className = "" }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[10px] uppercase tracking-widest text-secondary">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-transparent border border-dark-border text-primary placeholder-secondary px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors w-full"
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-dark-muted border border-dark-border text-primary px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors w-full"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="bg-transparent border border-dark-border text-primary placeholder-secondary px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors resize-none w-full"
    />
  );
}

function Section({ title, children, defaultOpen = true, extra }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-dark-border last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest font-bold text-secondary group-hover:text-primary transition-colors duration-150">
            {title}
          </span>
          {extra}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`w-3.5 h-3.5 text-secondary transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 flex flex-col gap-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-dashed border-dark-border text-secondary hover:border-secondary hover:text-primary transition-colors duration-150 py-2.5 text-xs uppercase tracking-widest w-full"
    >
      + {label}
    </button>
  );
}

export default function CreatureForm({
  creature,
  onChange,
  autoCalc,
  onAutoCalcToggle,
}) {
  const upd = (field) => (val) => onChange({ ...creature, [field]: val });

  const handleScoreChange = (stat, val) => {
    const updates = { [stat]: val };
    if (autoCalc) {
      updates[`${stat}Mod`] = calcMod(val);
    }
    onChange({ ...creature, ...updates });
  };

  // Traits
  const addTrait = () => {
    onChange({
      ...creature,
      traits: [...creature.traits, { ...EMPTY_TRAIT, id: generateId("trait") }],
    });
  };
  const updateTrait = (i, updated) => {
    const traits = [...creature.traits];
    traits[i] = updated;
    onChange({ ...creature, traits });
  };
  const removeTrait = (i) => {
    onChange({
      ...creature,
      traits: creature.traits.filter((_, idx) => idx !== i),
    });
  };

  // Actions
  const addAction = () => {
    onChange({
      ...creature,
      actions: [
        ...creature.actions,
        { ...EMPTY_ACTION, id: generateId("action") },
      ],
    });
  };
  const updateAction = (i, updated) => {
    const actions = [...creature.actions];
    actions[i] = updated;
    onChange({ ...creature, actions });
  };
  const removeAction = (i) => {
    onChange({
      ...creature,
      actions: creature.actions.filter((_, idx) => idx !== i),
    });
  };

  // Reactions
  const addReaction = () => {
    onChange({
      ...creature,
      reactions: [
        ...creature.reactions,
        { ...EMPTY_TRAIT, id: generateId("reaction") },
      ],
    });
  };
  const updateReaction = (i, updated) => {
    const reactions = [...creature.reactions];
    reactions[i] = updated;
    onChange({ ...creature, reactions });
  };
  const removeReaction = (i) => {
    onChange({
      ...creature,
      reactions: creature.reactions.filter((_, idx) => idx !== i),
    });
  };

  // Legendary actions
  const addLegendaryAction = () => {
    onChange({
      ...creature,
      legendaryActions: [
        ...creature.legendaryActions,
        { ...EMPTY_LEGENDARY_ACTION, id: generateId("leg") },
      ],
    });
  };
  const updateLegendaryAction = (i, updated) => {
    const legendaryActions = [...creature.legendaryActions];
    legendaryActions[i] = updated;
    onChange({ ...creature, legendaryActions });
  };
  const removeLegendaryAction = (i) => {
    onChange({
      ...creature,
      legendaryActions: creature.legendaryActions.filter((_, idx) => idx !== i),
    });
  };

  return (
    <div className="flex flex-col">
      {/* Basic Info */}
      <Section title="Basic info" defaultOpen>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name *" className="col-span-2">
            <Input
              value={creature.name}
              onChange={upd("name")}
              placeholder="e.g. Ancient Red Dragon"
            />
          </Field>
          <Field label="Size">
            <Select
              value={creature.size}
              onChange={upd("size")}
              options={SIZES}
            />
          </Field>
          <Field label="Type">
            <Input
              value={creature.type}
              onChange={upd("type")}
              placeholder="e.g. dragon, undead, beast"
            />
          </Field>
          <Field label="Alignment">
            <Input
              value={creature.alignment}
              onChange={upd("alignment")}
              placeholder="e.g. chaotic evil"
            />
          </Field>
          <Field label="Challenge rating">
            <Input
              value={creature.cr}
              onChange={upd("cr")}
              placeholder="e.g. 24 or 1/2"
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="HP *">
            <Input
              value={creature.hp}
              onChange={upd("hp")}
              placeholder="e.g. 546"
              type="number"
            />
          </Field>
          <Field label="HP formula">
            <Input
              value={creature.hpFormula}
              onChange={upd("hpFormula")}
              placeholder="e.g. 28d20+252"
            />
          </Field>
          <Field label="AC *">
            <Input
              value={creature.ac}
              onChange={upd("ac")}
              placeholder="e.g. 22"
              type="number"
            />
          </Field>
          <Field label="AC type">
            <Input
              value={creature.acType}
              onChange={upd("acType")}
              placeholder="e.g. natural armor"
            />
          </Field>
          <Field label="Initiative modifier">
            <Input
              value={creature.initiativeModifier}
              onChange={upd("initiativeModifier")}
              placeholder="e.g. +2"
            />
          </Field>
          <Field label="Speed">
            <Input
              value={creature.speed}
              onChange={upd("speed")}
              placeholder="e.g. 40ft, Fly 80ft, Swim 40ft"
            />
          </Field>
        </div>
      </Section>

      {/* Ability Scores */}
      <Section
        title="Ability scores"
        defaultOpen
        extra={
          <button
            type="button"
            onClick={onAutoCalcToggle}
            className={`text-[9px] uppercase tracking-widest border px-2 py-0.5 transition-colors duration-150 ${
              autoCalc
                ? "border-secondary text-primary"
                : "border-dark-border text-secondary hover:border-secondary"
            }`}
          >
            Auto-calc {autoCalc ? "on" : "off"}
          </button>
        }
      >
        <div className="grid grid-cols-6 gap-2">
          {ABILITY_STATS.map(({ key, label }) => (
            <div
              key={key}
              className="flex flex-col items-center gap-1.5 border border-dark-border p-2"
            >
              <span className="text-[10px] uppercase tracking-widest text-secondary">
                {label}
              </span>
              <input
                type="number"
                value={creature[key] ?? ""}
                onChange={(e) => handleScoreChange(key, e.target.value)}
                placeholder="—"
                className="bg-transparent border border-dark-border text-primary text-xs text-center px-1 py-1 focus:outline-none focus:border-primary transition-colors w-full"
              />
              <input
                type="text"
                value={creature[`${key}Mod`] ?? ""}
                onChange={(e) =>
                  onChange({ ...creature, [`${key}Mod`]: e.target.value })
                }
                placeholder="—"
                readOnly={autoCalc}
                className={`border text-xs text-center px-1 py-1 focus:outline-none transition-colors w-full ${
                  autoCalc
                    ? "bg-dark-muted border-dark-border text-secondary cursor-default"
                    : "bg-transparent border-dark-border text-primary focus:border-primary"
                }`}
              />
              <div className="flex flex-col w-full gap-1">
                <span className="text-[8px] uppercase text-secondary text-center">
                  Save
                </span>
                <input
                  type="text"
                  value={creature[`${key}Save`] ?? ""}
                  onChange={(e) =>
                    onChange({ ...creature, [`${key}Save`]: e.target.value })
                  }
                  placeholder="—"
                  className="bg-transparent border border-dark-border text-primary text-[10px] text-center px-1 py-1 focus:outline-none focus:border-primary transition-colors w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Defenses */}
      <Section title="Defenses" defaultOpen={false}>
        <Field label="Damage resistances">
          <Input
            value={creature.resistances}
            onChange={upd("resistances")}
            placeholder="e.g. Bludgeoning, Piercing, Slashing from nonmagical attacks"
          />
        </Field>
        <Field label="Damage immunities">
          <Input
            value={creature.immunities}
            onChange={upd("immunities")}
            placeholder="e.g. Fire, Poison"
          />
        </Field>
        <Field label="Damage vulnerabilities">
          <Input
            value={creature.vulnerabilities}
            onChange={upd("vulnerabilities")}
            placeholder="e.g. Cold"
          />
        </Field>
        <Field label="Condition immunities">
          <Input
            value={creature.conditionImmunities}
            onChange={upd("conditionImmunities")}
            placeholder="e.g. Charmed, Frightened, Poisoned"
          />
        </Field>
      </Section>

      {/* Senses & Languages */}
      <Section title="Senses & languages" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Passive perception">
            <Input
              value={creature.passivePerception}
              onChange={upd("passivePerception")}
              placeholder="e.g. 26"
              type="number"
            />
          </Field>
          <Field label="Senses">
            <Input
              value={creature.senses}
              onChange={upd("senses")}
              placeholder="e.g. Blindsight 60ft, Darkvision 120ft"
            />
          </Field>
          <Field label="Languages" className="col-span-2">
            <Input
              value={creature.languages}
              onChange={upd("languages")}
              placeholder="e.g. Common, Draconic"
            />
          </Field>
        </div>
      </Section>

      {/* Traits */}
      <Section title="Traits" defaultOpen={false}>
        {(creature.traits ?? []).map((trait, i) => (
          <div
            key={trait.id}
            className="border border-dark-border p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-secondary uppercase tracking-widest">
                Trait {i + 1}
              </span>
              <button
                type="button"
                onClick={() => removeTrait(i)}
                className="text-[10px] text-secondary hover:text-red-400 uppercase tracking-widest transition-colors"
              >
                Remove
              </button>
            </div>
            <Field label="Name *">
              <Input
                value={trait.name}
                onChange={(v) => updateTrait(i, { ...trait, name: v })}
                placeholder="e.g. Legendary Resistance"
              />
            </Field>
            <Field label="Description *">
              <Textarea
                value={trait.description}
                onChange={(v) => updateTrait(i, { ...trait, description: v })}
                placeholder="e.g. If the dragon fails a saving throw, it can choose to succeed instead."
              />
            </Field>
          </div>
        ))}
        <AddButton label="Add trait" onClick={addTrait} />
      </Section>

      {/* Actions */}
      <Section title="Actions" defaultOpen>
        {(creature.actions ?? []).map((action, i) => (
          <CreatureActionEditor
            key={action.id}
            action={action}
            index={i}
            onChange={(updated) => updateAction(i, updated)}
            onRemove={() => removeAction(i)}
          />
        ))}
        <AddButton label="Add action" onClick={addAction} />
      </Section>

      {/* Reactions */}
      <Section title="Reactions" defaultOpen={false}>
        {(creature.reactions ?? []).map((reaction, i) => (
          <div
            key={reaction.id}
            className="border border-dark-border p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-secondary uppercase tracking-widest">
                Reaction {i + 1}
              </span>
              <button
                type="button"
                onClick={() => removeReaction(i)}
                className="text-[10px] text-secondary hover:text-red-400 uppercase tracking-widest transition-colors"
              >
                Remove
              </button>
            </div>
            <Field label="Name *">
              <Input
                value={reaction.name}
                onChange={(v) => updateReaction(i, { ...reaction, name: v })}
                placeholder="e.g. Parry"
              />
            </Field>
            <Field label="Description *">
              <Textarea
                value={reaction.description}
                onChange={(v) =>
                  updateReaction(i, { ...reaction, description: v })
                }
                placeholder="e.g. The knight adds 3 to its AC against one melee attack that would hit it."
              />
            </Field>
          </div>
        ))}
        <AddButton label="Add reaction" onClick={addReaction} />
      </Section>

      {/* Legendary */}
      <Section title="Legendary" defaultOpen={false}>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Legendary resistances / day">
            <Input
              value={creature.legendaryResistances}
              onChange={upd("legendaryResistances")}
              placeholder="e.g. 3"
              type="number"
            />
          </Field>
          <Field label="Legendary actions / round">
            <Input
              value={creature.legendaryActionsPerRound}
              onChange={upd("legendaryActionsPerRound")}
              placeholder="e.g. 3"
              type="number"
            />
          </Field>
        </div>
        {(creature.legendaryActions ?? []).map((la, i) => (
          <div
            key={la.id}
            className="border border-dark-border p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-secondary uppercase tracking-widest">
                Legendary action {i + 1}
              </span>
              <button
                type="button"
                onClick={() => removeLegendaryAction(i)}
                className="text-[10px] text-secondary hover:text-red-400 uppercase tracking-widest transition-colors"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <Field label="Name *" className="col-span-3">
                <Input
                  value={la.name}
                  onChange={(v) => updateLegendaryAction(i, { ...la, name: v })}
                  placeholder="e.g. Wing Attack"
                />
              </Field>
              <Field label="Cost">
                <Input
                  value={la.cost}
                  onChange={(v) => updateLegendaryAction(i, { ...la, cost: v })}
                  placeholder="1"
                  type="number"
                />
              </Field>
            </div>
            <Field label="Description *">
              <Textarea
                value={la.description}
                onChange={(v) =>
                  updateLegendaryAction(i, { ...la, description: v })
                }
                placeholder="Describe this legendary action..."
              />
            </Field>
          </div>
        ))}
        <AddButton label="Add legendary action" onClick={addLegendaryAction} />
      </Section>

      {/* DM Notes */}
      <Section title="DM notes" defaultOpen={false}>
        <Field label="Special reminders">
          <Textarea
            value={creature.specialReminders}
            onChange={upd("specialReminders")}
            placeholder="e.g. Flees if below 100 HP! Targets the weakest player first."
            rows={3}
          />
        </Field>
        <Field label="Additional notes">
          <Textarea
            value={creature.notes}
            onChange={upd("notes")}
            placeholder="Anything else you need to remember about this creature..."
            rows={4}
          />
        </Field>
      </Section>
    </div>
  );
}
