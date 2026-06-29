import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCreatures } from "../hooks/useCreatures";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import Sidebar from "../components/Sidebar";
import CreatureBuilder, { EMPTY_CREATURE } from "../components/CreatureBuilder";
import CreaturePanel from "../components/CreaturePanel";

export default function BestiaryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { creatures, loading, saveCreature, deleteCreature } = useCreatures(
    user?.uid,
  );
  const [activeMenu, setActiveMenu] = useState("bestiary");
  const [selectedCreature, setSelectedCreature] = useState(null);
  const [form, setForm] = useState(EMPTY_CREATURE);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const handleSelect = (creature) => {
    setSelectedCreature(creature);
    setForm({ ...EMPTY_CREATURE, ...creature });
  };

  const handleNew = () => {
    setSelectedCreature(null);
    setForm(EMPTY_CREATURE);
  };

  const handleSave = async () => {
    if (!form.name?.trim()) return;
    setIsSaving(true);
    await saveCreature(form, selectedCreature?.id ?? null);
    setIsSaving(false);
  };

  const handleDelete = async (creatureId) => {
    if (window.confirm("Delete this creature? This cannot be undone.")) {
      await deleteCreature(creatureId);
      if (selectedCreature?.id === creatureId) {
        setSelectedCreature(null);
        setForm(EMPTY_CREATURE);
      }
    }
  };

  const handleMenuChange = (id) => {
    if (id === "campaigns") navigate("/");
    else if (id === "bestiary") return;
    else navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex">
      {/* Left sidebar */}
      <Sidebar active={activeMenu} onChange={handleMenuChange} />

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="h-16 border-b border-[#1e1e3a] flex items-center justify-between px-8 relative shrink-0">
          <button
            onClick={() => navigate("/")}
            className="text-[#8a8a9a] hover:text-[#c9a84c] uppercase tracking-widest text-xs transition-colors flex items-center gap-2"
          >
            ← Back
          </button>

          <h1 className="text-white font-bold uppercase tracking-widest text-sm">
            Bestiary
          </h1>

          {/* Avatar */}
          <button
            onClick={() => setAvatarOpen(!avatarOpen)}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#c9a84c] hover:border-white transition-colors"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#c9a84c] flex items-center justify-center text-[#1a1a2e] font-bold text-sm">
                {user?.displayName?.[0] ?? "?"}
              </div>
            )}
          </button>

          {avatarOpen && (
            <div className="absolute top-14 right-8 bg-[#0f0f1f] border border-[#1e1e3a] p-4 flex flex-col gap-3 z-50 min-w-48">
              <p className="text-white text-sm font-semibold">
                {user?.displayName}
              </p>
              <p className="text-[#8a8a9a] text-xs">{user?.email}</p>
              <hr className="border-[#1e1e3a]" />
              <button
                onClick={() => signOut(auth)}
                className="text-left text-sm text-[#8a8a9a] hover:text-red-400 transition-colors uppercase tracking-widest"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Creature builder */}
        <CreatureBuilder
          creature={form}
          onChange={setForm}
          onSave={handleSave}
          onClear={handleNew}
          isSaving={isSaving}
        />
      </div>

      {/* Right creature panel */}
      <CreaturePanel
        creatures={creatures}
        loading={loading}
        onSelect={handleSelect}
        onDelete={handleDelete}
        onNew={handleNew}
        selectedId={selectedCreature?.id}
      />
    </div>
  );
}
