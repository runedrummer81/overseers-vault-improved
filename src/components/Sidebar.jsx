import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { id: "campaigns", label: "My Campaigns", path: "/" },
  { id: "bestiary", label: "Bestiary", path: "/bestiary" },
  { id: "information", label: "Information", path: "/" },
];

export default function Sidebar({ active, onChange }) {
  const navigate = useNavigate();

  const handleClick = (item) => {
    if (onChange) onChange(item.id);
    navigate(item.path);
  };

  return (
    <div className="w-56 min-h-screen bg-[#0f0f1f] border-r border-[#1e1e3a] flex flex-col justify-between py-8 px-6">
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            className={`text-left py-3 px-4 text-sm uppercase tracking-widest transition-all duration-200 ${
              active === item.id
                ? "text-[#c9a84c] border-l-2 border-[#c9a84c] pl-3"
                : "text-[#8a8a9a] hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button
        onClick={() => {
          if (onChange) onChange("settings");
        }}
        className={`text-left py-3 px-4 text-sm uppercase tracking-widest transition-all duration-200 ${
          active === "settings"
            ? "text-[#c9a84c] border-l-2 border-[#c9a84c] pl-3"
            : "text-[#8a8a9a] hover:text-white"
        }`}
      >
        Settings
      </button>
    </div>
  );
}
