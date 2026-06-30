const TYPE_LABEL = {
  creature: "creature",
  npc: "NPC",
  item: "item",
};

export default function EntryBuilderPlaceholder({ type }) {
  return (
    <div className="flex-1 flex items-center justify-center text-center p-10">
      <div>
        <p className="text-[#c9c3b0] text-base mb-1.5">
          {TYPE_LABEL[type] ?? "entry"} builder coming next
        </p>
        <p className="text-secondary text-sm">
          The fields for this type haven&apos;t been designed yet &mdash; this
          is just the layout shell.
        </p>
      </div>
    </div>
  );
}
