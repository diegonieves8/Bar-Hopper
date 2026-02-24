export const bars = [
  {
    id: 1,
    name: "The Mark",
    address: "1108 Garden St",
    crowd: "High",
    vibe: "Packed & Loud",
    cover: 5,
    line: "Long",
    lastUpdated: "4 min ago",
    friends: ["Josh", "Maya", "Ty"],
    submissions: 14,
    worthScore: 82,
    forecast: {
      15:  { crowd: "High",   vibe: "Packed & Loud", line: "Long",  worth: 78 },
      30:  { crowd: "High",   vibe: "Packed & Loud", line: "Long",  worth: 75 },
      45:  { crowd: "Medium", vibe: "Social",        line: "Short", worth: 85 },
      60:  { crowd: "Medium", vibe: "Social",        line: "Short", worth: 88 },
      90:  { crowd: "Low",    vibe: "Chill",         line: "None",  worth: 70 },
    },
  },
  {
    id: 2,
    name: "Frog & Peach",
    address: "728 Higuera St",
    crowd: "Medium",
    vibe: "Social",
    cover: 0,
    line: "Short",
    lastUpdated: "11 min ago",
    friends: ["Ava"],
    submissions: 9,
    worthScore: 91,
    forecast: {
      15:  { crowd: "Medium", vibe: "Social",        line: "Short", worth: 90 },
      30:  { crowd: "High",   vibe: "Packed & Loud", line: "Long",  worth: 72 },
      45:  { crowd: "High",   vibe: "Packed & Loud", line: "Long",  worth: 68 },
      60:  { crowd: "Medium", vibe: "Social",        line: "Short", worth: 82 },
      90:  { crowd: "Low",    vibe: "Chill",         line: "None",  worth: 65 },
    },
  },
  {
    id: 3,
    name: "SLO Brew Rock",
    address: "855 Aerovista Pl",
    crowd: "Low",
    vibe: "Chill",
    cover: 10,
    line: "None",
    lastUpdated: "22 min ago",
    friends: [],
    submissions: 5,
    worthScore: 67,
    forecast: {
      15:  { crowd: "Low",    vibe: "Chill",         line: "None",  worth: 70 },
      30:  { crowd: "Medium", vibe: "Social",        line: "None",  worth: 78 },
      45:  { crowd: "Medium", vibe: "Social",        line: "Short", worth: 75 },
      60:  { crowd: "High",   vibe: "Packed & Loud", line: "Long",  worth: 60 },
      90:  { crowd: "High",   vibe: "Packed & Loud", line: "Long",  worth: 55 },
    },
  },
  {
    id: 4,
    name: "Creekside Brewing",
    address: "1040 Broad St",
    crowd: "Medium",
    vibe: "Social",
    cover: 0,
    line: "Short",
    lastUpdated: "7 min ago",
    friends: ["Sam", "Leo"],
    submissions: 11,
    worthScore: 88,
    forecast: {
      15:  { crowd: "Medium", vibe: "Social",        line: "Short", worth: 87 },
      30:  { crowd: "Medium", vibe: "Social",        line: "Short", worth: 85 },
      45:  { crowd: "High",   vibe: "Packed & Loud", line: "Long",  worth: 70 },
      60:  { crowd: "High",   vibe: "Packed & Loud", line: "Long",  worth: 65 },
      90:  { crowd: "Medium", vibe: "Social",        line: "Short", worth: 80 },
    },
  },
  {
    id: 5,
    name: "Bello Mundo Bar",
    address: "1127 Broad St",
    crowd: "High",
    vibe: "Packed & Loud",
    cover: 10,
    line: "Long",
    lastUpdated: "2 min ago",
    friends: ["Zoe"],
    submissions: 18,
    worthScore: 55,
    forecast: {
      15:  { crowd: "High",   vibe: "Packed & Loud", line: "Long",  worth: 52 },
      30:  { crowd: "High",   vibe: "Packed & Loud", line: "Long",  worth: 50 },
      45:  { crowd: "Medium", vibe: "Social",        line: "Short", worth: 72 },
      60:  { crowd: "Medium", vibe: "Social",        line: "None",  worth: 80 },
      90:  { crowd: "Low",    vibe: "Chill",         line: "None",  worth: 68 },
    },
  },
  {
    id: 6,
    name: "The Libertine",
    address: "1234 Monterey St",
    crowd: "Low",
    vibe: "Dead",
    cover: 0,
    line: "None",
    lastUpdated: "38 min ago",
    friends: [],
    submissions: 3,
    worthScore: 40,
    forecast: {
      15:  { crowd: "Low",    vibe: "Dead",          line: "None",  worth: 42 },
      30:  { crowd: "Low",    vibe: "Chill",         line: "None",  worth: 55 },
      45:  { crowd: "Medium", vibe: "Social",        line: "None",  worth: 70 },
      60:  { crowd: "Medium", vibe: "Social",        line: "Short", worth: 75 },
      90:  { crowd: "High",   vibe: "Packed & Loud", line: "Long",  worth: 60 },
    },
  },
];

export const crowdColors = {
  Low: "#4ade80",
  Medium: "#facc15",
  High: "#f87171",
};

export const crowdEmoji = {
  Low: "🟢",
  Medium: "🟡",
  High: "🔴",
};

export const vibeEmoji = {
  "Packed & Loud": "🔥",
  Social: "🎉",
  Chill: "😌",
  Dead: "💀",
};

export const lineEmoji = {
  None: "✅",
  Short: "⏱️",
  Long: "😤",
};

export const lineColors = {
  None: "#4ade80",
  Short: "#facc15",
  Long: "#f87171",
};

export const worthColor = (score) => {
  if (score >= 80) return "#4ade80";
  if (score >= 60) return "#facc15";
  return "#f87171";
};

export const worthLabel = (score) => {
  if (score >= 85) return "GO NOW 🚀";
  if (score >= 70) return "Worth It ✓";
  if (score >= 55) return "Maybe 🤷";
  return "Skip It ✗";
};