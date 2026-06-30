import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Border from "../components/Border";
import TopBar from "../components/TopBar";

const taglines = {
  campaigns: "Return to the worlds you've built",
  "creatures-items": "Forge the creatures and treasures of your realm",
  "maps-markers": "Coming soon — bring your locations to life",
  settings: "Shape the vault to your liking",
};

function Flourish({ flip = false }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 257.6 130.8"
      className={`fill-secondary w-7 h-auto shrink-0 ${flip ? "-scale-x-100" : ""}`}
    >
      <path d="M171.5,114.9c-.4-13.6,18-14.3,12.2-15.2-2.6-.4-5-1-7-.5-14.6-10.9-35.6-6.8-52.3-2.6-23.9,6-45.9,17.6-69.5,24.2C23.5,129.5.3,126.4.3,126.4c19.8-1.3,39.1-5.8,55.9-13.1C100.3,94.2,123.8,37.5,88.8,0c14.5,3.5,24.5,23.4,24,37.4-.2,4,5.2,4.2,6.6,1.2,8.1-2.3,12.6,6.3,11.8,14.3-1.7,16.4-19.7,29.1-33.7,33.4-2.9,1.9-.7,6.6,2.6,5.5,41.7-13.4,84.6-51.4,130.7-27.5-5.2-.2-26.1,3.6-27.2,14,.1,2.2,4.1,2.6,5.7,2.6,18.8.4,29.3,18.8,48.3,20.4-5.4,3.2-10.7,6.5-16.7,8.8-16.5,5.8-25.2,0-38-9.7-1.2-.9-4.3-1.6-3.4,1.4,2.3,7.3,4,15.4-.6,22-8.3,13.1-28.3,6.3-27.4-8.9h0Z" />
      <path d="M17.1,72.5h0c10.8-9.3,32.3-14.9,40.8.5l.3.8c5.8-5.4,5.8-17.5-3.1-19.3,12.1-6.8,16.8-17.2,12.9-30.7-2-7-6.2-12.6-11.7-16.7,4.4,16.4-6.9,32-19.4,41.3-9.5,7-18.9,12.4-26,22.3-5.4,7.6-8.5,15.5-10.9,23.9,4.2-8.5,10.4-16.2,17.1-22h0Z" />
    </svg>
  );
}

export default function StartPage() {
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <>
      <Border />
      <TopBar user={user} />
      <div className="min-h-screen bg-dark-bg flex">
        {/* Left sidebar */}
        <Sidebar active={activeMenu} onChange={setActiveMenu} />

        {/* Right section — tagline at the bottom */}
        <div className="flex-1 flex flex-col justify-end items-center pb-20">
          <AnimatePresence mode="wait">
            {activeMenu && (
              <motion.div
                key={activeMenu}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-4"
              >
                <Flourish flip />
                <p className="text-primary text-xl uppercase tracking-widest whitespace-nowrap">
                  {taglines[activeMenu]}
                </p>
                <Flourish />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
