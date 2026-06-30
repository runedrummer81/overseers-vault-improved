import { useNavigate } from "react-router-dom";
import SidebarButton from "../components/SidebarButton";

const menuItems = [
  { id: "campaigns", label: "My Campaigns", path: "/campaigns" },
  {
    id: "creatures-items",
    label: "Creatures & Items",
    path: "/creatures-items",
  },
  {
    id: "maps-markers",
    label: "Maps & Markers",
    path: "/maps-markers",
    disabled: true,
  },
  { id: "settings", label: "Settings", path: "/settings" },
];

export default function Sidebar({ active, onChange }) {
  const navigate = useNavigate();

  const handleEnter = (item) => {
    if (item.disabled) return;
    if (onChange) onChange(item.id);
  };

  const handleLeave = () => {
    if (onChange) onChange(null);
  };

  const handleClick = (item) => {
    if (item.disabled) return;
    navigate(item.path);
  };

  return (
    <div className="w-96 min-h-screen flex flex-col justify-center pl-20 gap-12">
      {menuItems.map((item) => (
        <div
          key={item.id}
          onMouseEnter={() => handleEnter(item)}
          onMouseLeave={handleLeave}
        >
          <SidebarButton
            label={item.label}
            active={active === item.id}
            onClick={() => handleClick(item)}
            className={`text-3xl px-8 py-4 ${item.disabled ? "opacity-40 cursor-not-allowed" : ""}`}
          />
        </div>
      ))}
    </div>
  );
}
