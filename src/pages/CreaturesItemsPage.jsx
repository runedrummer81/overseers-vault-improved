import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Border from "../components/Border";
import TopBar from "../components/TopBar";
import { useLibraryEntries } from "../hooks/useLibraryEntries";
import LibraryPanel from "../components/creatures-items/LibraryPanel";
import NewEntryMenu from "../components/creatures-items/NewEntryMenu";
import EntryTabs from "../components/creatures-items/EntryTabs";
import EntryBuilderPlaceholder from "../components/creatures-items/EntryBuilderPlaceholder";
import CreatureBuilder from "../components/creatures-items/creature/CreatureBuilder";

function generateTabId() {
  return `tab-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export default function CreaturesItemsPage() {
  const { user } = useAuth();
  const { entries, loading, saveEntry } = useLibraryEntries(user?.uid);

  const [tabs, setTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [savingTabId, setSavingTabId] = useState(null);

  const activeTab = tabs.find((t) => t.tabId === activeTabId) ?? null;

  const updateTabLabel = (tabId, label) => {
    setTabs((prev) =>
      prev.map((t) =>
        t.tabId === tabId ? { ...t, label: label || "New creature" } : t,
      ),
    );
  };

  const handleSaveCreature = async (data, tabId) => {
    const tab = tabs.find((t) => t.tabId === tabId);
    setSavingTabId(tabId);
    try {
      const savedId = await saveEntry(
        { ...data, type: "creature" },
        tab?.entryId ?? null,
      );
      setTabs((prev) =>
        prev.map((t) =>
          t.tabId === tabId ? { ...t, entryId: savedId, dirty: false } : t,
        ),
      );
    } finally {
      setSavingTabId(null);
    }
  };

  const openNewTab = (type) => {
    const tabId = generateTabId();
    const label = `New ${type === "npc" ? "NPC" : type}`;
    setTabs((prev) => [
      ...prev,
      { tabId, type, entryId: null, label, dirty: false },
    ]);
    setActiveTabId(tabId);
  };

  const openEntryTab = (entry) => {
    const existing = tabs.find((t) => t.entryId === entry.id);
    if (existing) {
      setActiveTabId(existing.tabId);
      return;
    }
    const tabId = generateTabId();
    setTabs((prev) => [
      ...prev,
      {
        tabId,
        type: entry.type,
        entryId: entry.id,
        label: entry.name || "Untitled",
        dirty: false,
      },
    ]);
    setActiveTabId(tabId);
  };

  const closeTab = (tabId) => {
    setTabs((prev) => {
      const next = prev.filter((t) => t.tabId !== tabId);
      if (tabId === activeTabId) {
        setActiveTabId(next.length > 0 ? next[next.length - 1].tabId : null);
      }
      return next;
    });
  };

  return (
    <>
      <Border />
      <TopBar user={user} />
      <div className="h-screen overflow-hidden bg-dark-bg flex flex-col px-12 md:px-16 lg:px-24 pb-12">
        <div
          className="flex items-center justify-between border-b border-dark-border pb-6 shrink-0"
          style={{ paddingTop: "5rem" }}
        >
          <h1 className="text-primary text-2xl uppercase tracking-widest">
            Creatures &amp; Items
          </h1>
        </div>

        <div className="flex flex-1 min-h-0">
          <div className="flex-1 flex flex-col pr-10 py-6 min-w-0 min-h-0">
            <div
              className={`flex items-start gap-3 flex-wrap ${
                tabs.length > 0 ? "mb-2" : "mb-5"
              }`}
            >
              <NewEntryMenu onPickType={openNewTab} />
              <EntryTabs
                tabs={tabs}
                activeTabId={activeTabId}
                onSelectTab={setActiveTabId}
                onCloseTab={closeTab}
              />
            </div>

            {/* Render every tab's builder but only show the active one.
                This keeps component state alive across tab switches — no remounting. */}
            {tabs.map((tab) => (
              <div
                key={tab.tabId}
                className="flex flex-col flex-1 min-h-0"
                style={{ display: tab.tabId === activeTabId ? "flex" : "none" }}
              >
                {tab.type === "creature" ? (
                  <CreatureBuilder
                    onSave={(data) => handleSaveCreature(data, tab.tabId)}
                    isSaving={savingTabId === tab.tabId}
                    onLabelChange={(label) => updateTabLabel(tab.tabId, label)}
                  />
                ) : (
                  <EntryBuilderPlaceholder type={tab.type} />
                )}
              </div>
            ))}

            {/* Empty state — only shown when no tabs are open */}
            {tabs.length === 0 && (
              <div className="flex-1 min-h-0 border border-dashed border-dark-border flex items-center justify-center text-center p-10">
                <div>
                  <p className="text-[#c9c3b0] text-base mb-1.5">
                    Nothing open right now
                  </p>
                  <p className="text-secondary text-sm">
                    Select an entry from the library, or create something new.
                  </p>
                </div>
              </div>
            )}
          </div>

          <LibraryPanel
            entries={entries}
            loading={loading}
            activeEntryId={activeTab?.entryId ?? null}
            onSelectEntry={openEntryTab}
            collapsed={panelCollapsed}
            onToggleCollapsed={() => setPanelCollapsed((c) => !c)}
          />
        </div>
      </div>
    </>
  );
}
