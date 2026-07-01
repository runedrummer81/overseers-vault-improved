import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EMPTY_CREATURE } from "./creatureConstants";
import CreatureStatBlockPreview from "./CreatureStatBlockPreview";

const FADE_MS = 140;

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function extractAC(armor_class) {
  if (!armor_class) return "";
  if (Array.isArray(armor_class))
    return armor_class[0]?.value ?? armor_class[0] ?? "";
  return armor_class;
}

function mapOpen5eToCreature(m) {
  const ac = extractAC(m.armor_class);
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
    if (m[apiKey] !== null && m[apiKey] !== undefined)
      abilityFields[ourKey] = fmtMod(m[apiKey]);
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
    secondaryDamageDice: "",
    secondaryDamageModifier: "",
    secondaryDamageType: "",
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

function RowArrow({ color = "var(--color-secondary)" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 35.9 67.5"
      className="h-full w-auto"
    >
      <polyline
        points="1.4 66.8 34.5 33.8 1.4 .7"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      <polyline
        points="17.9 17.2 1.4 33.8 17.9 50.3"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      <polyline
        points="1.4 .7 1.4 17.2 17.9 33.8 1.4 50.3 1.4 66.8"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
      />
    </svg>
  );
}

const ARROW_W = 26;

// selected & onSelectCreature are lifted to CreatureBuilder so the Import button
// can live in the breadcrumb header row there.
export default function Open5eSearch({ active, selected, onSelectCreature }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [focused, setFocused] = useState(false);
  const searchRef = useRef(null);
  const debouncedQuery = useDebounce(query, 280);

  useEffect(() => {
    if (active) searchRef.current?.focus();
  }, [active]);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(
      `https://api.open5e.com/v1/monsters/?search=${encodeURIComponent(debouncedQuery)}&limit=10`,
    )
      .then((r) => r.json())
      .then((data) => {
        setResults(data.results || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not reach Open5e. Check your connection.");
        setLoading(false);
      });
  }, [debouncedQuery]);

  const handleSelect = (monster) =>
    onSelectCreature(mapOpen5eToCreature(monster));

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
    if (selected) onSelectCreature(null);
  };

  const borderColor = focused ? "border-primary" : "border-dark-border";
  const arrowColor = focused
    ? "var(--color-primary)"
    : "var(--color-secondary)";
  const showDropdown = !selected && !!debouncedQuery.trim() && !loading;
  const showStatBlock = !!selected;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Search bar */}
      <div className="shrink-0">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-150 ${focused ? "text-primary" : "text-secondary"}`}
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
            ref={searchRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => {
              setFocused(true);
              if (selected) onSelectCreature(null);
            }}
            onBlur={() => setFocused(false)}
            placeholder="Search monsters... e.g. Beholder, Dragon, Goblin"
            className={`w-full bg-transparent border-2 ${borderColor} text-primary placeholder-secondary pl-10 pr-10 py-3 focus:outline-none transition-colors duration-150 text-sm`}
          />
          {loading && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-secondary border-t-primary rounded-full animate-spin" />
          )}
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={`border-l-2 border-r-2 border-b-2 ${borderColor} bg-dark-muted overflow-hidden transition-colors duration-150`}
            >
              <div style={{ overflowY: "auto", maxHeight: "380px" }}>
                {error && (
                  <p className="text-red-400 text-xs uppercase tracking-wide px-4 py-3">
                    {error}
                  </p>
                )}
                {!error && results.length === 0 && (
                  <div className="px-6 py-10 flex flex-col gap-3">
                    <p className="text-primary text-base font-bold uppercase tracking-wide">
                      No results for "{debouncedQuery}"
                    </p>
                    <p className="text-primary text-base leading-relaxed">
                      Many official creatures aren't available here due to
                      licensing. If you can't find what you're looking for, try
                      building it manually instead.
                    </p>
                  </div>
                )}
                {!error &&
                  results.map((monster) => {
                    const ac = extractAC(monster.armor_class);
                    const typeLabel = [monster.size, monster.type]
                      .filter(Boolean)
                      .join(" ");
                    return (
                      <motion.button
                        key={monster.slug}
                        onClick={() => handleSelect(monster)}
                        whileHover="hover"
                        initial="rest"
                        animate="rest"
                        className="relative w-full text-left border-b border-dark-border last:border-b-0 hover:bg-dark-bg transition-colors duration-150 flex items-stretch cursor-pointer group overflow-hidden"
                      >
                        <motion.div
                          className="absolute left-0 top-0 bottom-0 flex items-center pointer-events-none"
                          style={{ width: ARROW_W }}
                          variants={{ rest: { x: -ARROW_W }, hover: { x: 0 } }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          <RowArrow color={arrowColor} />
                        </motion.div>
                        <motion.div
                          className="flex items-center gap-4 w-full py-3 pr-4"
                          variants={{
                            rest: { paddingLeft: 16 },
                            hover: { paddingLeft: 16 + ARROW_W },
                          }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                            <span className="text-sm font-bold uppercase tracking-wide text-secondary group-hover:text-primary transition-colors duration-150 truncate">
                              {monster.name}
                            </span>
                            {typeLabel && (
                              <span
                                className="text-sm text-secondary group-hover:text-primary italic transition-colors duration-150 truncate"
                                style={{ fontFamily: "EB Garamond, serif" }}
                              >
                                {typeLabel}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-0.5 shrink-0">
                            <span className="text-sm font-bold uppercase tracking-wide text-secondary group-hover:text-primary transition-colors duration-150">
                              CR {monster.challenge_rating}
                            </span>
                            <span className="text-sm text-secondary group-hover:text-primary uppercase tracking-wide transition-colors duration-150">
                              {[
                                monster.hit_points
                                  ? `HP ${monster.hit_points}`
                                  : null,
                                ac ? `AC ${ac}` : null,
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          </div>
                        </motion.div>
                      </motion.button>
                    );
                  })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stat block — spawns directly under the search bar */}
      <div className="flex flex-col flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {showStatBlock && (
            <motion.div
              key={selected?.name}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex-1 min-h-0 overflow-y-auto border border-dark-border mt-4"
              style={{ padding: "20px" }}
            >
              <CreatureStatBlockPreview creature={selected} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
