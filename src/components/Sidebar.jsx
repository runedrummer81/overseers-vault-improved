import { useNavigate } from "react-router-dom";
import SidebarButton from "../components/SidebarButton";

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
    <div className="w-96 min-h-screen flex flex-col justify-center pl-20 gap-12">
      {menuItems.map((item) => (
        <SidebarButton
          key={item.id}
          label={item.label}
          active={active === item.id}
          onClick={() => handleClick(item)}
          className="text-3xl px-8 py-4"
        />
      ))}
    </div>
  );
}
