export const SIZES = ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"];
export const ACTION_COSTS = [
  "Action",
  "Bonus Action",
  "Reaction",
  "Legendary Action",
  "Free Action",
];
export const ACTION_TYPES = [
  "Attack",
  "Save",
  "Recharge",
  "Special",
  "Multiattack",
];
export const ATTACK_TYPES = [
  "Melee Weapon",
  "Ranged Weapon",
  "Melee Spell",
  "Ranged Spell",
];
export const SAVE_STATS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
export const DAMAGE_TYPES = [
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
export const ABILITY_STATS = [
  { key: "str", label: "STR" },
  { key: "dex", label: "DEX" },
  { key: "con", label: "CON" },
  { key: "int", label: "INT" },
  { key: "wis", label: "WIS" },
  { key: "cha", label: "CHA" },
];

export function calcMod(score) {
  const n = parseInt(score);
  if (isNaN(n)) return "";
  const mod = Math.floor((n - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function avgDice(diceStr) {
  if (!diceStr) return 0;
  const match = diceStr.trim().match(/^(\d+)d(\d+)$/i);
  if (!match) return 0;
  return Math.floor((parseInt(match[1]) * (parseInt(match[2]) + 1)) / 2);
}

export function generateId(prefix = "item") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export const EMPTY_ACTION = {
  name: "",
  actionCost: "Action",
  type: "Attack",
  attackType: "Melee Weapon",
  toHit: "",
  reach: "5ft",
  damageDice: "",
  damageModifier: "",
  damageType: "Slashing",
  secondaryDamageDice: "",
  secondaryDamageModifier: "",
  secondaryDamageType: "",
  saveDC: "",
  saveStat: "DEX",
  halfOnSave: false,
  recharge: "",
  description: "",
};

export const EMPTY_TRAIT = { name: "", description: "" };
export const EMPTY_LEGENDARY_ACTION = { name: "", cost: "1", description: "" };

export const EMPTY_CREATURE = {
  name: "",
  size: "Large",
  type: "",
  alignment: "",
  cr: "",
  hp: "",
  hpFormula: "",
  ac: "",
  acType: "",
  initiativeModifier: "",
  speed: "",
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
  passivePerception: "",
  senses: "",
  languages: "",
  resistances: "",
  immunities: "",
  vulnerabilities: "",
  conditionImmunities: "",
  legendaryResistances: "",
  legendaryActionsPerRound: "",
  traits: [],
  actions: [],
  legendaryActions: [],
  reactions: [],
  specialReminders: "",
  notes: "",
};
