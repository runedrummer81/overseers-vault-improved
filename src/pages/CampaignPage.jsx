import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePlayers } from "../hooks/usePlayers";
import { useSessions } from "../hooks/useSessions";
import Sidebar from "../components/Sidebar";
import PlayerRoster from "../components/PlayerRoster";
import SessionPanel from "../components/SessionPanel";
import NewSessionOverlay from "../components/NewSessionOverlay";

export default function CampaignPage() {
  const { campaignId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("campaigns");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const {
    players,
    playerCount,
    loading: playersLoading,
    addPlayer,
    updatePlayer,
    removePlayer,
  } = usePlayers(user?.uid, campaignId);
  const {
    sessions,
    loading: sessionsLoading,
    createSession,
    importSession,
    deleteSession,
    updateLastOpened,
  } = useSessions(user?.uid, campaignId);

  const nextNumber =
    sessions.length > 0
      ? Math.max(...sessions.map((s) => s.number ?? 0)) + 1
      : 1;

  const handleOpenSession = async (session) => {
    await updateLastOpened(session.id);
    navigate(`/campaign/${campaignId}/session/${session.id}`);
  };

  const handleDeleteSession = async (sessionId) => {
    if (window.confirm("Delete this session? This cannot be undone.")) {
      await deleteSession(sessionId);
    }
  };

  const handleRemovePlayer = async (playerId) => {
    if (window.confirm("Remove this player from the roster?")) {
      await removePlayer(playerId);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex">
      {/* Left sidebar */}
      <Sidebar active={activeMenu} onChange={setActiveMenu} />

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="h-16 border-b border-[#1e1e3a] flex items-center justify-between px-8 relative">
          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="text-[#8a8a9a] hover:text-[#c9a84c] uppercase tracking-widest text-xs transition-colors flex items-center gap-2"
          >
            ← Back
          </button>

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
                onClick={() => {
                  import("firebase/auth").then(({ signOut }) => {
                    import("../firebase/config").then(({ auth }) =>
                      signOut(auth),
                    );
                  });
                }}
                className="text-left text-sm text-[#8a8a9a] hover:text-red-400 transition-colors uppercase tracking-widest"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Player roster in main area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl">
            <PlayerRoster
              players={players}
              playerCount={playerCount}
              onAdd={addPlayer}
              onUpdate={updatePlayer}
              onRemove={handleRemovePlayer}
            />
          </div>
        </div>
      </div>

      {/* Right session panel */}
      <SessionPanel
        sessions={sessions}
        loading={sessionsLoading}
        onNew={() => setOverlayOpen(true)}
        onImport={importSession}
        onDelete={handleDeleteSession}
        onOpen={handleOpenSession}
      />

      {/* New session overlay */}
      <NewSessionOverlay
        isOpen={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        onCreate={createSession}
        nextNumber={nextNumber}
      />
    </div>
  );
}
