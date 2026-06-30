export default function EntryTabs({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
}) {
  return (
    <>
      {tabs.map((tab) => {
        const isActive = tab.tabId === activeTabId;
        return (
          <div
            key={tab.tabId}
            onClick={() => onSelectTab(tab.tabId)}
            className={`group flex items-center gap-2 px-3.5 py-2 border cursor-pointer text-xs uppercase tracking-wide transition-colors duration-150 ${
              isActive
                ? "border-secondary text-primary"
                : "border-dark-border text-secondary hover:text-primary"
            }`}
          >
            <span>{tab.label}</span>
            {tab.dirty && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"
                title="Unsaved changes"
              />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(tab.tabId);
              }}
              className="text-secondary hover:text-red-400 transition-colors duration-150 ml-1 leading-none"
              title="Close"
            >
              &times;
            </button>
          </div>
        );
      })}
    </>
  );
}
