import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewSessionOverlay({
  isOpen,
  onClose,
  onCreate,
  nextNumber,
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName("");
      setError("");
    }
  }, [isOpen]);

  const handleCreate = () => {
    if (!name.trim()) {
      setError("Please give this session a name.");
      return;
    }
    onCreate(name.trim());
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[#12122a] border border-[#c9a84c] p-8 flex flex-col gap-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div>
              <h2 className="text-2xl font-bold text-[#c9a84c] tracking-widest uppercase">
                New Session
              </h2>
              <p className="text-[#8a8a9a] text-xs mt-1 uppercase tracking-widest">
                Session #{nextNumber}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-[#8a8a9a] uppercase tracking-widest">
                Session Name
              </label>
              <input
                type="text"
                placeholder="e.g. The Dark Forest"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent border border-[#c9a84c] text-white placeholder-[#8a8a9a] px-4 py-3 focus:outline-none focus:border-white transition-colors"
                autoFocus
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex gap-4">
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
