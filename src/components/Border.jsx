import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const CornerSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 115.38 115.38"
    className="w-full h-full object-contain"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon
      points="1.5 40.98 1.5 1.5 40.98 1.5 40.98 40.98 1.5 40.98"
      className="stroke-secondary"
      strokeWidth="3"
    />
    <polyline
      points="1.5 115.38 1.5 80.46 21.24 60.72 21.24 21.24 60.72 21.24 80.46 1.5 115.38 1.5"
      className="stroke-secondary"
      strokeWidth="3"
    />
    <polyline
      points="12.69 115.38 12.69 12.69 115.38 12.69"
      className="stroke-primary"
      strokeWidth="3"
    />
  </svg>
);

export default function Border() {
  const basePath = import.meta.env.DEV ? "" : "/overseers-vault-improved";

  return (
    <motion.div
      className="fixed inset-0 z-[9999] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="fixed inset-5 md:inset-6 lg:inset-8 pointer-events-none z-50">
        {/* Top Left Corner */}
        <div className="absolute top-0 left-0 w-20 h-20 overflow-hidden">
          <CornerSVG />
        </div>

        {/* Top Right Corner */}
        <div className="absolute top-0 right-0 w-20 h-20 rotate-90 overflow-hidden">
          <CornerSVG />
        </div>

        {/* Bottom Left Corner */}
        <div className="absolute bottom-0 left-0 w-20 h-20 -rotate-90 overflow-hidden">
          <CornerSVG />
        </div>

        {/* Bottom Right Corner */}
        <div className="absolute bottom-0 right-0 w-20 h-20 rotate-180 overflow-hidden">
          <CornerSVG />
        </div>

        {/* Top Edge */}
        <div className="absolute top-0 left-20 right-20 h-[2px] bg-secondary" />
        {/* Top Edge 2 */}
        <div className="absolute top-2 left-20 right-20 h-[2px] bg-primary" />

        {/* Bottom Edge */}
        <div className="absolute bottom-0 left-20 right-20 h-[2px] bg-secondary" />
        {/* Bottom Edge 2 */}
        <div className="absolute bottom-2 left-20 right-20 h-[2px] bg-primary" />

        {/* Left Edge */}
        <div className="absolute left-0 top-20 bottom-20 w-[2px] bg-secondary" />
        {/* Left Edge 2 */}
        <div className="absolute left-2 top-20 bottom-20 w-[2px] bg-primary" />

        {/* Right Edge */}
        <div className="absolute right-0 top-20 bottom-20 w-[2px] bg-secondary" />
        {/* Right Edge 2 */}
        <div className="absolute right-2 top-20 bottom-20 w-[2px] bg-primary" />

        {/* Logo centered on top edge */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-72 z-[10000] pointer-events-auto">
          <Link to="/">
            <img
              src={`${basePath}/images/logo.svg`}
              alt="The Overseer's Vault"
              className="object-contain transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
