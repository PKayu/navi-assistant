function freqMap(dice) {
  const map = {};
  for (const v of dice) map[v] = (map[v] || 0) + 1;
  return map;
}

export function upperSection(dice, face) {
  return dice.filter((v) => v === face).reduce((s, v) => s + v, 0);
}

export function threeOfAKind(dice) {
  const freq = freqMap(dice);
  return Object.values(freq).some((c) => c >= 3) ? dice.reduce((s, v) => s + v, 0) : 0;
}

export function fourOfAKind(dice) {
  const freq = freqMap(dice);
  return Object.values(freq).some((c) => c >= 4) ? dice.reduce((s, v) => s + v, 0) : 0;
}

export function fullHouse(dice) {
  const freq = freqMap(dice);
  const counts = Object.values(freq).sort();
  return counts.length === 2 && counts[0] === 2 && counts[1] === 3 ? 25 : 0;
}

function hasRun(dice, length) {
  const unique = [...new Set(dice)].sort((a, b) => a - b);
  let run = 1;
  for (let i = 1; i < unique.length; i++) {
    run = unique[i] === unique[i - 1] + 1 ? run + 1 : 1;
    if (run >= length) return true;
  }
  return false;
}

export function smallStraight(dice) {
  return hasRun(dice, 4) ? 30 : 0;
}

export function largeStraight(dice) {
  return hasRun(dice, 5) ? 40 : 0;
}

export function yahtzee(dice) {
  return new Set(dice).size === 1 ? 50 : 0;
}

export function chance(dice) {
  return dice.reduce((s, v) => s + v, 0);
}

export function calculateScore(categoryId, dice, face) {
  switch (categoryId) {
    case "ones":   return upperSection(dice, 1);
    case "twos":   return upperSection(dice, 2);
    case "threes": return upperSection(dice, 3);
    case "fours":  return upperSection(dice, 4);
    case "fives":  return upperSection(dice, 5);
    case "sixes":  return upperSection(dice, 6);
    case "threeOfAKind":  return threeOfAKind(dice);
    case "fourOfAKind":   return fourOfAKind(dice);
    case "fullHouse":     return fullHouse(dice);
    case "smallStraight": return smallStraight(dice);
    case "largeStraight": return largeStraight(dice);
    case "yahtzee":       return yahtzee(dice);
    case "chance":        return chance(dice);
    default: return 0;
  }
}

export function upperBonus(scores) {
  const upperIds = ["ones", "twos", "threes", "fours", "fives", "sixes"];
  const sum = upperIds.reduce((s, id) => s + (scores[id] ?? 0), 0);
  return sum >= 63 ? 35 : 0;
}

export function playerTotal(scores) {
  const categorySum = Object.entries(scores)
    .filter(([k]) => k !== "yahtzeeBonus")
    .reduce((s, [, v]) => s + (v ?? 0), 0);
  return categorySum + upperBonus(scores) + (scores.yahtzeeBonus ?? 0);
}
