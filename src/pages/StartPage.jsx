import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { useCampaigns } from "../hooks/useCampaigns";
import Sidebar from "../components/Sidebar";
import CampaignPanel from "../components/CampaignPanel";
import NewCampaignOverlay from "../components/NewCampaignOverlay";

export default function StartPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    campaigns,
    loading,
    createCampaign,
    deleteCampaign,
    updateLastOpened,
  } = useCampaigns(user?.uid);
  const [activeMenu, setActiveMenu] = useState("campaigns");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  const handleOpen = async (campaign) => {
    await updateLastOpened(campaign.id);
    navigate(`/campaign/${campaign.id}`);
  };

  const handleDelete = async (campaignId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this campaign? This cannot be undone.",
      )
    ) {
      await deleteCampaign(campaignId);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex">
      {/* Left sidebar */}
      <Sidebar active={activeMenu} onChange={setActiveMenu} />

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="h-16 border-b border-[#1e1e3a] flex items-center justify-end px-8 relative">
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
                {user?.displayName?.[0] ?? user?.email?.[0] ?? "?"}
              </div>
            )}
          </button>

          {/* Avatar dropdown */}
          {avatarOpen && (
            <div className="absolute top-14 right-8 bg-[#0f0f1f] border border-[#1e1e3a] p-4 flex flex-col gap-3 z-50 min-w-48">
              <p className="text-white text-sm font-semibold">
                {user?.displayName ?? "Adventurer"}
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

        {/* Empty center */}
        <div className="flex-1" />
      </div>

      {/* Right campaign panel */}
      <CampaignPanel
        campaigns={campaigns}
        loading={loading}
        onNew={() => setOverlayOpen(true)}
        onDelete={handleDelete}
        onOpen={handleOpen}
      />

      {/* New campaign overlay */}
      <NewCampaignOverlay
        isOpen={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        onCreate={createCampaign}
      />
    </div>
  );
}
