// Rolls a single die with given number of sides
function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

// Parses and rolls a dice string like "2d6", "1d8", "3d4"
export function rollDice(diceString) {
  const match = diceString
    .toLowerCase()
    .trim()
    .match(/^(\d+)d(\d+)$/);
  if (!match) return { rolls: [], total: 0 };
  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  const rolls = Array.from({ length: count }, () => rollDie(sides));
  return { rolls, total: rolls.reduce((a, b) => a + b, 0) };
}

// Rolls a d20 + modifier for attack or save
export function rollD20(modifier = 0) {
  const roll = rollDie(20);
  return { roll, modifier, total: roll + modifier };
}

// Rolls damage for an action
export function rollDamage(damageDice, damageModifier = 0) {
  const { rolls, total } = rollDice(damageDice);
  return {
    rolls,
    modifier: Number(damageModifier),
    total: total + Number(damageModifier),
  };
}

// Rolls recharge die (d6) and checks if it meets the recharge value
export function rollRecharge(rechargeString) {
  const roll = rollDie(6);
  // Parse "5-6" or "6"
  const parts = rechargeString.split("-").map(Number);
  const min = parts[0];
  const recharged = roll >= min;
  return { roll, recharged };
}
