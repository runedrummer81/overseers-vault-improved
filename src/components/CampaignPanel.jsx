import { useState } from "react";

function timeAgo(timestamp) {
  if (!timestamp) return "Never opened";
  const seconds = Math.floor((Date.now() - timestamp.seconds * 1000) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function CampaignPanel({
  campaigns,
  loading,
  onNew,
  onDelete,
  onOpen,
}) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="w-80 min-h-screen flex flex-col pt-24">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6">
        <h2 className="text-lg font-bold text-primary uppercase tracking-widest">
          Campaigns
        </h2>
        <button
          onClick={onNew}
          className="text-secondary hover:text-primary transition-colors text-2xl leading-none"
          title="New Campaign"
        >
          +
        </button>
      </div>

      {/* Campaign list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p className="text-secondary text-sm px-6 py-8">Loading...</p>
        ) : campaigns.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-secondary text-sm">No campaigns yet.</p>
            <p className="text-secondary text-xs mt-2">
              Click + to create your first one.
            </p>
          </div>
        ) : (
          campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="relative group  px-6 py-4 cursor-pointer hover:bg-dark-muted transition-all duration-200"
              onMouseEnter={() => setHoveredId(campaign.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onOpen(campaign)}
            >
              {/* Left border on hover */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-0.5 bg-secondary transition-opacity duration-200 ${hoveredId === campaign.id ? "opacity-100" : "opacity-0"}`}
              />

              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-primary text-sm font-semibold">
                    {campaign.name}
                  </span>
                  <span className="text-secondary text-xs">
                    {campaign.playerCount}{" "}
                    {campaign.playerCount === 1 ? "player" : "players"}
                  </span>
                  <span className="text-secondary text-xs">
                    {timeAgo(campaign.lastOpened)}
                  </span>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(campaign.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-secondary hover:text-red-400 transition-all duration-200 text-xs uppercase tracking-widest"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
