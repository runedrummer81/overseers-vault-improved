import { motion } from "framer-motion";

function Arrow({ color }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 35.9 67.5"
      className="h-full w-auto"
    >
      <polyline
        points="1.4 66.8 34.5 33.8 1.4 .7"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      <polyline
        points="17.9 17.2 1.4 33.8 17.9 50.3"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      <polyline
        points="1.4 .7 1.4 17.2 17.9 33.8 1.4 50.3 1.4 66.8"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
      />
    </svg>
  );
}

export default function SidebarButton({
  label,
  active,
  onClick,
  className = "text-2xl px-6 py-3",
}) {
  const activeColor = "var(--color-primary)";
  const inactiveColor = "var(--color-secondary)";
  const color = active ? activeColor : inactiveColor;

  return (
    <motion.button
      onClick={onClick}
      className="cursor-pointer flex items-stretch relative"
      whileHover="hover"
      initial="rest"
      animate="rest"
      style={{
        filter: active ? "drop-shadow(0 0 8px rgba(191,136,60,0.6))" : "none",
        transition: "filter 0.3s ease",
      }}
    >
      {/* Text — always visible, defines button size */}
      <div className={`flex items-center whitespace-nowrap ${className}`}>
        <motion.span
          className="uppercase tracking-widest"
          animate={{ color }}
          transition={{ duration: 0.3 }}
        >
          {label}
        </motion.span>
      </div>

      {/* Invisible arrow to reserve space so button width stays stable */}
      <div className="flex items-stretch -ml-px opacity-0 pointer-events-none">
        <Arrow color={color} />
      </div>

      {/* Border + Arrow together — ONE opacity on ONE parent */}
      <motion.div
        className="absolute inset-0 flex items-stretch pointer-events-none"
        variants={{
          rest: { opacity: active ? 1 : 0 },
          hover: { opacity: 1 },
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <div
          className={`flex-1 ${className} pr-70`}
          style={{
            borderTop: `2px solid ${color}`,
            borderLeft: `2px solid ${color}`,
            borderBottom: `2px solid ${color}`,
            borderRight: "none",
          }}
        />
        <div className="flex items-stretch -ml-px shrink-0">
          <Arrow color={color} />
        </div>
      </motion.div>
    </motion.button>
  );
}
