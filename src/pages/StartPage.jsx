import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { useCampaigns } from "../hooks/useCampaigns";
import Sidebar from "../components/Sidebar";
import CampaignPanel from "../components/CampaignPanel";
import NewCampaignOverlay from "../components/NewCampaignOverlay";
import Border from "../components/Border";
import TopBar from "../components/TopBar";

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
    <>
      <Border />
      <TopBar user={user} />
      <div className="min-h-screen bg-dark-bg flex">
        {/* Left sidebar */}
        <Sidebar active={activeMenu} onChange={setActiveMenu} />

        {/* Main area */}
        <div className="flex-1 flex flex-col">
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
    </>
  );
}
