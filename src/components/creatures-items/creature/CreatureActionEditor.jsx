import {
  ACTION_COSTS,
  ACTION_TYPES,
  ATTACK_TYPES,
  SAVE_STATS,
  DAMAGE_TYPES,
} from "./creatureConstants";

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
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
      className="bg-transparent border border-dark-border text-primary placeholder-secondary px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary transition-colors w-full"
    />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-dark-muted border border-dark-border text-primary px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary transition-colors w-full"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function Textarea({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="bg-transparent border border-dark-border text-primary placeholder-secondary px-2.5 py-1.5 text-xs focus:outline-none focus:border-primary transition-colors resize-none w-full"
    />
  );
}

function TypePill({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-[10px] px-3 py-1 border uppercase tracking-wide transition-colors duration-150 ${
        active
          ? "border-secondary text-primary bg-dark-muted"
          : "border-dark-border text-secondary hover:border-secondary hover:text-primary"
      }`}
    >
      {label}
    </button>
  );
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-secondary w-3.5 h-3.5"
      />
      <span className="text-xs text-secondary">{label}</span>
    </label>
  );
}

export default function CreatureActionEditor({
  action,
  onChange,
  onRemove,
  index,
}) {
  const upd = (field) => (val) => onChange({ ...action, [field]: val });

  return (
    <div className="border border-dark-border p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-secondary uppercase tracking-widest">
          Action {index + 1}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="text-[10px] text-secondary hover:text-red-400 uppercase tracking-widest transition-colors"
        >
          Remove
        </button>
      </div>

      {/* Name + action cost */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name *">
          <Input
            value={action.name}
            onChange={upd("name")}
            placeholder="e.g. Bite"
          />
        </Field>
        <Field label="Action cost">
          <Select
            value={action.actionCost}
            onChange={upd("actionCost")}
            options={ACTION_COSTS}
          />
        </Field>
      </div>

      {/* Type selector */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] uppercase tracking-widest text-secondary">
          Type
        </span>
        <div className="flex gap-1.5 flex-wrap">
          {ACTION_TYPES.map((t) => (
            <TypePill
              key={t}
              label={t}
              active={action.type === t}
              onClick={() => upd("type")(t)}
            />
          ))}
        </div>
      </div>

      {/* Attack fields */}
      {action.type === "Attack" && (
        <>
          <Field label="Attack type">
            <Select
              value={action.attackType}
              onChange={upd("attackType")}
              options={ATTACK_TYPES}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="To hit bonus">
              <Input
                value={action.toHit}
                onChange={upd("toHit")}
                placeholder="e.g. 11"
                type="number"
              />
            </Field>
            <Field label="Reach / Range">
              <Input
                value={action.reach}
                onChange={upd("reach")}
                placeholder="e.g. 5ft or 60/120ft"
              />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Damage dice">
              <Input
                value={action.damageDice}
                onChange={upd("damageDice")}
                placeholder="e.g. 2d10"
              />
            </Field>
            <Field label="Modifier">
              <Input
                value={action.damageModifier}
                onChange={upd("damageModifier")}
                placeholder="e.g. 7"
                type="number"
              />
            </Field>
            <Field label="Damage type">
              <Select
                value={action.damageType}
                onChange={upd("damageType")}
                options={DAMAGE_TYPES}
              />
            </Field>
          </div>
          {/* Secondary damage */}
          <div className="border-t border-dark-border pt-3 flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-widest text-secondary">
              Secondary damage (optional)
            </span>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Dice">
                <Input
                  value={action.secondaryDamageDice}
                  onChange={upd("secondaryDamageDice")}
                  placeholder="e.g. 4d6"
                />
              </Field>
              <Field label="Modifier">
                <Input
                  value={action.secondaryDamageModifier}
                  onChange={upd("secondaryDamageModifier")}
                  placeholder="e.g. 0"
                  type="number"
                />
              </Field>
              <Field label="Type">
                <Select
                  value={action.secondaryDamageType || "Fire"}
                  onChange={upd("secondaryDamageType")}
                  options={DAMAGE_TYPES}
                />
              </Field>
            </div>
          </div>
        </>
      )}

      {/* Save fields */}
      {(action.type === "Save" || action.type === "Recharge") && (
        <>
          {action.type === "Recharge" && (
            <Field label="Recharge (e.g. 5-6)">
              <Input
                value={action.recharge}
                onChange={upd("recharge")}
                placeholder="5-6"
              />
            </Field>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Save DC">
              <Input
                value={action.saveDC}
                onChange={upd("saveDC")}
                placeholder="e.g. 21"
                type="number"
              />
            </Field>
            <Field label="Save stat">
              <Select
                value={action.saveStat}
                onChange={upd("saveStat")}
                options={SAVE_STATS}
              />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Damage dice">
              <Input
                value={action.damageDice}
                onChange={upd("damageDice")}
                placeholder="e.g. 16d6"
              />
            </Field>
            <Field label="Modifier">
              <Input
                value={action.damageModifier}
                onChange={upd("damageModifier")}
                placeholder="e.g. 0"
                type="number"
              />
            </Field>
            <Field label="Damage type">
              <Select
                value={action.damageType}
                onChange={upd("damageType")}
                options={DAMAGE_TYPES}
              />
            </Field>
          </div>
          <Checkbox
            label="Half damage on successful save"
            checked={action.halfOnSave}
            onChange={upd("halfOnSave")}
          />
        </>
      )}

      {/* Description — always shown, mandatory for Special/Multiattack */}
      <Field
        label={
          action.type === "Special" || action.type === "Multiattack"
            ? "Description *"
            : "Extra notes (optional)"
        }
      >
        <Textarea
          value={action.description}
          onChange={upd("description")}
          placeholder={
            action.type === "Multiattack"
              ? "e.g. The dragon makes three attacks: one Bite and two Claws."
              : action.type === "Special"
                ? "Describe what this action does..."
                : "Any additional context for this action..."
          }
        />
      </Field>
    </div>
  );
}
