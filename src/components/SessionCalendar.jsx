import { useState } from "react";
import { motion } from "framer-motion";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function toDateId(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatTimeInput(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function isValidTime(value) {
  if (!value) return true;
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export default function SessionCalendar({
  sessionDates,
  onSetDate,
  onRemoveDate,
  onClose,
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDateId, setSelectedDateId] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const datesByDateId = Object.fromEntries(
    sessionDates.map((d) => [d.date, d]),
  );

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const todayId = today.toISOString().slice(0, 10);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const handleDayClick = (day) => {
    const dateId = toDateId(viewYear, viewMonth, day);
    if (dateId === selectedDateId) {
      setSelectedDateId(null);
      setStartTime("");
      setEndTime("");
      return;
    }
    setSelectedDateId(dateId);
    const entry = datesByDateId[dateId];
    setStartTime(entry?.startTime ?? "");
    setEndTime(entry?.endTime ?? "");
  };

  const selectedEntry = selectedDateId ? datesByDateId[selectedDateId] : null;

  const cells = [];
  for (let i = 0; i < firstDayOfMonth; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="absolute top-10 right-0 bg-dark-muted border border-dark-border p-4 z-50 w-80"
    >
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={handlePrevMonth}
          className="text-secondary hover:text-primary px-2"
        >
          ‹
        </button>
        <span className="text-primary text-sm uppercase tracking-widest font-semibold">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          onClick={handleNextMonth}
          className="text-secondary hover:text-primary px-2"
        >
          ›
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d, i) => (
          <span key={i} className="text-secondary text-xs text-center">
            {d}
          </span>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const dateId = toDateId(viewYear, viewMonth, day);
          const entry = datesByDateId[dateId];
          const isToday = dateId === todayId;
          const isSelected = dateId === selectedDateId;

          return (
            <button
              key={i}
              onClick={() => handleDayClick(day)}
              className={`relative text-xs py-2 rounded transition-colors duration-150 ${
                isSelected ? "bg-secondary/30" : "hover:bg-dark-border"
              } ${isToday ? "ring-1 ring-secondary" : ""}`}
            >
              <span
                className={
                  entry?.status === "confirmed"
                    ? "text-primary font-bold"
                    : entry?.status === "maybe"
                      ? "text-secondary"
                      : "text-secondary/70"
                }
              >
                {day}
              </span>
              {entry && (
                <span
                  className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                    entry.status === "confirmed" ? "bg-primary" : "bg-secondary"
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day actions */}
      {selectedDateId && (
        <div className="mt-4 pt-3 border-t border-dark-border flex flex-col gap-3">
          <p className="text-primary text-center text-sm">{selectedDateId}</p>

          {/* Time range */}
          <div className="flex items-center justify-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              placeholder="HH:MM"
              value={startTime}
              onChange={(e) => setStartTime(formatTimeInput(e.target.value))}
              maxLength={5}
              className={`w-16 bg-dark-bg border text-primary text-xs px-1 py-1.5 rounded focus:outline-none text-center tracking-wider ${
                isValidTime(startTime)
                  ? "border-dark-border focus:border-secondary"
                  : "border-red-400"
              }`}
            />
            <span className="text-secondary text-xs">to</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="HH:MM"
              value={endTime}
              onChange={(e) => setEndTime(formatTimeInput(e.target.value))}
              maxLength={5}
              className={`w-16 bg-dark-bg border text-primary text-xs px-1 py-1.5 rounded focus:outline-none text-center tracking-wider ${
                isValidTime(endTime)
                  ? "border-dark-border focus:border-secondary"
                  : "border-red-400"
              }`}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() =>
                onSetDate(
                  selectedDateId,
                  "maybe",
                  startTime || null,
                  endTime || null,
                )
              }
              className="flex-1 text-xs uppercase tracking-widest py-2 border border-dark-border text-secondary hover:border-secondary transition-colors"
            >
              Maybe
            </button>
            <button
              onClick={() =>
                onSetDate(
                  selectedDateId,
                  "confirmed",
                  startTime || null,
                  endTime || null,
                )
              }
              className="flex-1 text-xs uppercase tracking-widest py-2 border border-primary text-primary hover:bg-primary/10 transition-colors"
            >
              Confirm
            </button>
          </div>

          {selectedEntry && (
            <button
              onClick={() => {
                onRemoveDate(selectedDateId);
                setSelectedDateId(null);
              }}
              className="text-xs uppercase tracking-widest text-secondary hover:text-red-400 transition-colors"
            >
              Remove date
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
