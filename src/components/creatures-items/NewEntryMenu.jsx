import DropdownButton from "../ui/DropdownButton";

const TYPE_OPTIONS = [
  { id: "creature", label: "Create a creature" },
  { id: "npc", label: "Create an NPC" },
  { id: "item", label: "Create an item" },
];

export default function NewEntryMenu({ onPickType }) {
  const options = TYPE_OPTIONS.map((opt) => ({
    ...opt,
    onClick: () => onPickType(opt.id),
  }));

  return <DropdownButton label="New entry" options={options} />;
}
