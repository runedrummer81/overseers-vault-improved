import { motion } from "framer-motion";

export default function ChoiceCard({
  icon,
  title,
  description,
  onClick,
  disabled = false,
  comingSoon = false,
}) {
  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      whileHover={disabled ? {} : { y: -4 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={`relative flex flex-col items-center justify-center gap-6 border-2 p-12 text-center transition-colors duration-200 w-full ${
        disabled
          ? "border-dark-border cursor-not-allowed opacity-50"
          : "border-secondary hover:border-primary cursor-pointer group"
      }`}
    >
      {/* Corner accents — always rendered, fade in on hover, echo Border component */}
      {!disabled && (
        <>
          <span className="pointer-events-none absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <span className="pointer-events-none absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <span className="pointer-events-none absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <span className="pointer-events-none absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </>
      )}

      {/* Icon */}
      <div
        className={`transition-colors duration-200 ${
          disabled
            ? "text-secondary"
            : "text-secondary group-hover:text-primary"
        }`}
      >
        {icon}
      </div>

      {/* Title + coming soon badge */}
      <div className="flex flex-col items-center gap-1.5">
        <p
          className={`text-base uppercase tracking-widest font-bold transition-colors duration-200 ${
            disabled
              ? "text-secondary"
              : "text-secondary group-hover:text-primary"
          }`}
        >
          {title}
        </p>
        {comingSoon && (
          <span className="text-[10px] uppercase tracking-widest text-dark-border border border-dark-border px-2 py-0.5">
            Coming soon
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-secondary text-sm leading-relaxed max-w-[220px]">
        {description}
      </p>
    </motion.button>
  );
}
