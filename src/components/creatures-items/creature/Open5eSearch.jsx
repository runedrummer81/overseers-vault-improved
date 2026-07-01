import { useState, useEffect, useRef } from "react";
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

export default function Open5eSearch({ onImport, active }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null); // mapped creature shown in stat block
  const [panelFading, setPanelFading] = useState(false);
  const [importing, setImporting] = useState(false);
  const inputRef = useRef(null);
  const debouncedQuery = useDebounce(query, 280);

  // Focus the input only when the import view becomes active, not on initial mount
  useEffect(() => {
    if (active) inputRef.current?.focus();
  }, [active]);

  // Search the API whenever the debounced query changes
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

  // Fade the content panel, run a state update while invisible, fade back in
  const fadePanel = (onSwitch) => {
    setPanelFading(true);
    setTimeout(() => {
      onSwitch();
      setPanelFading(false);
    }, FADE_MS);
  };

  // Clicking a result: fade out results, show full stat block
  const handleSelect = (monster) => {
    const mapped = mapOpen5eToCreature(monster);
    fadePanel(() => setSelected(mapped));
  };

  // Typing while a stat block is shown: instantly clear selection, show results
  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (selected) setSelected(null); // instant — user already expressed intent to search
  };

  const handleImport = () => {
    if (!selected) return;
    setImporting(true);
    setTimeout(() => {
      onImport(selected);
      setImporting(false);
    }, 300);
  };

  const showStatBlock = !!selected;
  const showResults =
    !selected &&
    (loading || results.length > 0 || error || debouncedQuery.trim());

  return (
    <div className="flex flex-col flex-1 min-h-0 gap-4">
      {/* Search input — always visible */}
      <div className="relative shrink-0">
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
          onChange={handleQueryChange}
          onFocus={() => {
            if (selected) setSelected(null);
          }}
          placeholder="Search monsters... e.g. Beholder, Dragon, Goblin"
          className="w-full bg-transparent border-2 border-dark-border text-primary placeholder-secondary pl-10 pr-10 py-3 focus:outline-none focus:border-primary transition-colors duration-150 text-sm"
        />
        {loading && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-secondary border-t-primary rounded-full animate-spin" />
        )}
      </div>

      {/* Content panel — fades between results list and stat block */}
      <div
        className="flex flex-col flex-1 min-h-0"
        style={{
          opacity: panelFading ? 0 : 1,
          transition: `opacity ${FADE_MS}ms ease`,
          pointerEvents: panelFading ? "none" : "auto",
        }}
      >
        {/* ── Results list ── */}
        {showResults && !showStatBlock && (
          <div className="flex flex-col border border-dark-border overflow-y-auto flex-1">
            {error && (
              <p className="text-red-400 text-xs uppercase tracking-wide px-4 py-3">
                {error}
              </p>
            )}
            {!error &&
              results.map((monster) => {
                const ac = extractAC(monster.armor_class);
                return (
                  <button
                    key={monster.slug}
                    onClick={() => handleSelect(monster)}
                    className="text-left px-4 py-3 border-b border-dark-border last:border-b-0 hover:bg-dark-muted transition-colors duration-150 flex items-center justify-between gap-4 cursor-pointer group"
                  >
                    <span className="text-sm font-bold uppercase tracking-wide text-secondary group-hover:text-primary transition-colors duration-150">
                      {monster.name}
                    </span>
                    <span className="text-xs text-secondary shrink-0 uppercase tracking-wide">
                      CR {monster.challenge_rating}
                      {monster.hit_points ? ` · HP ${monster.hit_points}` : ""}
                      {ac ? ` · AC ${ac}` : ""}
                    </span>
                  </button>
                );
              })}
            {!error &&
              !loading &&
              debouncedQuery.trim() &&
              results.length === 0 && (
                <div className="px-4 py-10 text-center flex flex-col gap-2">
                  <p className="text-secondary text-sm">
                    No monsters found for "{debouncedQuery}".
                  </p>
                  <p className="text-secondary text-xs">
                    Open5e only covers SRD content. Try building manually for
                    homebrew or non-SRD creatures.
                  </p>
                </div>
              )}
          </div>
        )}

        {/* ── Full stat block preview ── */}
        {showStatBlock && (
          <div className="flex flex-col flex-1 min-h-0 gap-4">
            {/* Import button at top so it's always reachable */}
            <div className="flex items-center justify-between shrink-0">
              <p className="text-secondary text-xs uppercase tracking-widest">
                Click the search bar to find a different creature
              </p>
              <button
                onClick={handleImport}
                disabled={importing}
                className="flex items-center gap-2 bg-secondary text-dark-bg text-xs font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-primary transition-colors duration-150 shrink-0 cursor-pointer disabled:opacity-50"
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
            </div>
            {/* Stat block — scrollable */}
            <div className="overflow-y-auto flex-1 border border-dark-border p-5">
              <CreatureStatBlockPreview creature={selected} />
            </div>
          </div>
        )}

        {/* Empty state — nothing typed yet */}
        {!showResults && !showStatBlock && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-secondary text-sm">
              Start typing to search the SRD monster library.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
