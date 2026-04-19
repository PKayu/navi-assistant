export const CATEGORIES = [
  { id: "ones",          label: "Ones",            section: "upper", calculator: "upper", face: 1 },
  { id: "twos",          label: "Twos",            section: "upper", calculator: "upper", face: 2 },
  { id: "threes",        label: "Threes",          section: "upper", calculator: "upper", face: 3 },
  { id: "fours",         label: "Fours",           section: "upper", calculator: "upper", face: 4 },
  { id: "fives",         label: "Fives",           section: "upper", calculator: "upper", face: 5 },
  { id: "sixes",         label: "Sixes",           section: "upper", calculator: "upper", face: 6 },
  { id: "threeOfAKind",  label: "3 of a Kind",     section: "lower", calculator: "threeOfAKind" },
  { id: "fourOfAKind",   label: "4 of a Kind",     section: "lower", calculator: "fourOfAKind" },
  { id: "fullHouse",     label: "Full House",      section: "lower", calculator: "fullHouse" },
  { id: "smallStraight", label: "Sm. Straight",    section: "lower", calculator: "smallStraight" },
  { id: "largeStraight", label: "Lg. Straight",    section: "lower", calculator: "largeStraight" },
  { id: "yahtzee",       label: "Yahtzee!",        section: "lower", calculator: "yahtzee" },
  { id: "chance",        label: "Chance",          section: "lower", calculator: "chance" },
];

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id);
