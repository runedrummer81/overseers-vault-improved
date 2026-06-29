import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewCampaignOverlay({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [playerCount, setPlayerCount] = useState("");
  const [error, setError] = useState("");

  // Reset fields when overlay opens
  useEffect(() => {
    if (isOpen) {
      setName("");
      setPlayerCount("");
      setError("");
    }
  }, [isOpen]);

  const handleCreate = () => {
    if (!name.trim()) {
      setError("Please give your campaign a name.");
      return;
    }
    if (!playerCount || playerCount < 1 || playerCount > 20) {
      setError("Please enter a valid player count (1-20).");
      return;
    }
    onCreate(name.trim(), playerCount);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Overlay box */}
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[#12122a] border border-[#c9a84c] p-8 flex flex-col gap-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-[#c9a84c] tracking-widest uppercase">
              New Campaign
            </h2>

            {/* Campaign name */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
                Campaign Name
              </label>
              <input
                type="text"
                placeholder="e.g. Curse of Strahd"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent border border-[#c9a84c] text-white placeholder-[#8a8a9a] px-4 py-3 focus:outline-none focus:border-white transition-colors"
                autoFocus
              />
            </div>

            {/* Player count */}
            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
                Number of Players
              </label>
              <input
                type="number"
                placeholder="e.g. 4"
                value={playerCount}
                min={1}
                max={20}
                onChange={(e) => setPlayerCount(e.target.value)}
                className="bg-transparent border border-[#c9a84c] text-white placeholder-[#8a8a9a] px-4 py-3 focus:outline-none focus:border-white transition-colors"
              />
            </div>

            {/* Error */}
            {error && <p className="text-red-400 text-sm">{error}</p>}

            {/* Buttons */}
            <div className="flex gap-4 mt-2">
              <button
                onClick={onClose}
                className="flex-1 border border-[#3a3a5a] text-[#8a8a9a] py-3 uppercase tracking-widest text-sm hover:border-white hover:text-white transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 bg-[#c9a84c] text-[#12122a] py-3 uppercase tracking-widest text-sm font-bold hover:bg-white transition-all duration-300"
              >
                Create
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
