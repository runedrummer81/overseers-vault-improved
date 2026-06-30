import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EMPTY_CREATURE } from "./creatureConstants";

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function mapOpen5eToCreature(m) {
  const ac = Array.isArray(m.armor_class)
    ? (m.armor_class[0]?.value ?? m.armor_class[0])
    : m.armor_class;

  const speed = Object.entries(m.speed || {})
    .map(([k, v]) => (k === "walk" ? `${v}ft` : `${k} ${v}ft`))
    .join(", ");

  function calcMod(score) {
    if (!score) return "";
    return Math.floor((score - 10) / 2);
  }

  function fmtMod(mod) {
    if (mod === "" || mod === undefined) return "";
    return mod >= 0 ? `+${mod}` : `${mod}`;
  }

  const stats = [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
  ];
  const short = ["str", "dex", "con", "int", "wis", "cha"];

  const abilityFields = {};
  stats.forEach((stat, i) => {
    const key = short[i];
    const score = m[stat] ?? "";
    const mod = score !== "" ? calcMod(score) : "";
    abilityFields[key] = score;
    abilityFields[`${key}Mod`] = fmtMod(mod);
    abilityFields[`${key}Save`] = "";
  });

  const saveMap = {
    strength_save: "strSave",
    dexterity_save: "dexSave",
    constitution_save: "conSave",
    intelligence_save: "intSave",
    wisdom_save: "wisSave",
    charisma_save: "chaSave",
  };
  Object.entries(saveMap).forEach(([apiKey, ourKey]) => {
    if (m[apiKey] !== null && m[apiKey] !== undefined) {
      abilityFields[ourKey] = fmtMod(m[apiKey]);
    }
  });

  const traits = (m.special_abilities || []).map((t, i) => ({
    id: `trait-${i}`,
    name: t.name || "",
    description: t.desc || "",
  }));

  const actions = (m.actions || []).map((a, i) => ({
    id: `action-${i}`,
    name: a.name || "",
    actionCost: "Action",
    type: "Special",
    description: a.desc || "",
    toHit: "",
    damageDice: "",
    damageModifier: "",
    damageType: "Slashing",
    saveDC: "",
    saveStat: "DEX",
    recharge: "",
  }));

  return {
    ...EMPTY_CREATURE,
    name: m.name || "",
    size: m.size || "Large",
    type: m.type || "",
    alignment: m.alignment || "",
    cr: m.challenge_rating !== undefined ? String(m.challenge_rating) : "",
    hp: m.hit_points ? String(m.hit_points) : "",
    hpFormula: m.hit_dice || "",
    ac: ac ? String(ac) : "",
    acType: Array.isArray(m.armor_class) ? m.armor_class[0]?.desc || "" : "",
    speed,
    senses: m.senses || "",
    languages: m.languages || "",
    resistances: m.damage_resistances || "",
    immunities: m.damage_immunities || "",
    conditionImmunities: m.condition_immunities || "",
    legendaryActionsPerRound: (m.legendary_actions || []).length ? "3" : "",
    traits,
    actions,
    reactions: (m.reactions || []).map((r, i) => ({
      id: `reaction-${i}`,
      name: r.name || "",
      description: r.desc || "",
    })),
    legendaryActions: (m.legendary_actions || []).map((la, i) => ({
      id: `leg-${i}`,
      name: la.name || "",
      cost: "1",
      description: la.desc || "",
    })),
    ...abilityFields,
  };
}

function BackButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-secondary hover:text-primary transition-colors duration-150 text-xs uppercase tracking-widest w-fit"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back
    </button>
  );
}

export default function Open5eSearch({ onImport, onBack }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [importing, setImporting] = useState(false);
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 350);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    setSelected(null);

    fetch(
      `https://api.open5e.com/v1/monsters/?search=${encodeURIComponent(debouncedQuery)}&limit=8`,
    )
      .then((r) => r.json())
      .then((data) => {
        setResults(data.results || []);
        setLoading(false);
      })
      .catch(() => {
        setError(
          "Could not reach the Open5e API. Check your connection and try again.",
        );
        setLoading(false);
      });
  }, [debouncedQuery]);

  const handleImport = () => {
    if (!selected) return;
    setImporting(true);
    const mapped = mapOpen5eToCreature(selected);
    setTimeout(() => {
      onImport(mapped);
      setImporting(false);
    }, 300);
  };

  const acDisplay = selected
    ? Array.isArray(selected.armor_class)
      ? (selected.armor_class[0]?.value ?? selected.armor_class[0])
      : selected.armor_class
    : null;

  const speedDisplay = selected
    ? Object.entries(selected.speed || {})
        .map(([k, v]) => (k === "walk" ? `${v}ft` : `${k} ${v}ft`))
        .join(", ")
    : null;

  return (
    <div className="flex flex-col gap-6 h-full">
      <BackButton onClick={onBack} />

      <div>
        <p className="text-primary text-xl uppercase tracking-widest mb-1.5">
          Import from Open5e
        </p>
        <p className="text-secondary text-sm leading-relaxed">
          Search the SRD monster library by name and import directly into your
          builder.
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Beholder, Ancient Dragon, Goblin..."
          className="w-full bg-transparent border-2 border-dark-border text-primary placeholder-secondary pl-10 pr-10 py-3 focus:outline-none focus:border-primary transition-colors duration-150 text-sm"
        />
        {loading && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-secondary border-t-primary rounded-full animate-spin" />
        )}
      </div>

      {error && (
        <p className="text-red-400 text-xs uppercase tracking-wide">{error}</p>
      )}

      {/* Results list */}
      <div
        className="flex flex-col border border-dark-border overflow-y-auto"
        style={{ maxHeight: "220px" }}
      >
        <AnimatePresence initial={false}>
          {results.map((monster) => {
            const isSelected = selected?.slug === monster.slug;
            return (
              <motion.button
                key={monster.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                onClick={() => setSelected(monster)}
                className={`text-left px-4 py-3 border-b border-dark-border last:border-b-0 transition-colors duration-150 flex items-center justify-between gap-4 ${
                  isSelected
                    ? "bg-dark-muted border-l-2 border-l-secondary"
                    : "hover:bg-dark-muted"
                }`}
              >
                <span
                  className={`text-sm font-bold uppercase tracking-wide transition-colors duration-150 ${
                    isSelected ? "text-primary" : "text-secondary"
                  }`}
                >
                  {monster.name}
                </span>
                <span className="text-xs text-secondary shrink-0 uppercase tracking-wide">
                  CR {monster.challenge_rating}
                </span>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {!loading && query && results.length === 0 && !error && (
          <div className="px-4 py-10 text-center">
            <p className="text-secondary text-sm">
              No monsters found for "{query}".
            </p>
            <p className="text-secondary text-xs mt-1.5">
              Try a different spelling, or build manually instead.
            </p>
          </div>
        )}

        {!query && (
          <div className="px-4 py-10 text-center">
            <p className="text-secondary text-sm">
              Start typing to search the SRD monster library.
            </p>
          </div>
        )}
      </div>

      {/* Selected preview bar + import button */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="border-2 border-secondary flex items-center justify-between gap-6 px-5 py-4"
          >
            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-primary font-bold uppercase tracking-wide text-sm truncate">
                {selected.name}
              </p>
              <p className="text-secondary text-xs uppercase tracking-wide">
                CR {selected.challenge_rating}
                {selected.hit_points ? ` · HP ${selected.hit_points}` : ""}
                {acDisplay ? ` · AC ${acDisplay}` : ""}
                {speedDisplay ? ` · ${speedDisplay}` : ""}
              </p>
            </div>
            <button
              onClick={handleImport}
              disabled={importing}
              className="flex items-center gap-2 bg-secondary text-dark-bg text-xs font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-primary transition-colors duration-150 shrink-0 disabled:opacity-50"
            >
              {importing ? "Importing..." : "Import"}
              {!importing && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
