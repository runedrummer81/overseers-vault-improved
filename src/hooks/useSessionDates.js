import { useEffect, useState } from "react";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

export function useSessionDates(userId) {
  const [sessionDates, setSessionDates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const ref = collection(db, "users", userId, "sessionDates");
    const unsubscribe = onSnapshot(ref, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => a.date.localeCompare(b.date));
      setSessionDates(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [userId]);

  // dateId is the date itself in YYYY-MM-DD form, so each calendar day is unique
  const setSessionDate = async (
    dateId,
    status,
    startTime = null,
    endTime = null,
  ) => {
    const ref = doc(db, "users", userId, "sessionDates", dateId);
    await setDoc(
      ref,
      {
        date: dateId,
        status, // "maybe" | "confirmed"
        startTime, // "18:00" or null
        endTime, // "22:00" or null
        createdAt: serverTimestamp(),
      },
      { merge: true },
    );
  };

  const removeSessionDate = async (dateId) => {
    await deleteDoc(doc(db, "users", userId, "sessionDates", dateId));
  };

  const today = new Date().toISOString().slice(0, 10);
  const nextConfirmed =
    sessionDates
      .filter((d) => d.status === "confirmed" && d.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))[0] ?? null;

  const daysUntilNext = nextConfirmed
    ? Math.ceil(
        (new Date(nextConfirmed.date) - new Date(today)) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  return {
    sessionDates,
    loading,
    setSessionDate,
    removeSessionDate,
    nextConfirmed,
    daysUntilNext,
  };
}
