import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

export function useSessions(userId, campaignId) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !campaignId) return;
    const ref = collection(
      db,
      "users",
      userId,
      "campaigns",
      campaignId,
      "sessions",
    );
    const unsubscribe = onSnapshot(ref, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => (a.number ?? 0) - (b.number ?? 0));
      setSessions(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [userId, campaignId]);

  const getNextSessionNumber = (existingSessions) => {
    if (existingSessions.length === 0) return 1;
    return Math.max(...existingSessions.map((s) => s.number ?? 0)) + 1;
  };

  const createSession = (name, type = "live", summary = "") => {
    const ref = collection(
      db,
      "users",
      userId,
      "campaigns",
      campaignId,
      "sessions",
    );
    const number = getNextSessionNumber(sessions);
    return addDoc(ref, {
      name,
      number,
      type,
      summary,
      createdAt: serverTimestamp(),
      lastOpened: serverTimestamp(),
      date: serverTimestamp(),
    });
  };

  const importSession = (number, name, summary, date) => {
    const ref = collection(
      db,
      "users",
      userId,
      "campaigns",
      campaignId,
      "sessions",
    );
    return addDoc(ref, {
      name,
      number,
      type: "imported",
      summary,
      createdAt: serverTimestamp(),
      date: date ? new Date(date) : serverTimestamp(),
    });
  };

  const deleteSession = async (sessionId) => {
    const ref = doc(
      db,
      "users",
      userId,
      "campaigns",
      campaignId,
      "sessions",
      sessionId,
    );
    return deleteDoc(ref);
  };

  const updateLastOpened = (sessionId) => {
    const ref = doc(
      db,
      "users",
      userId,
      "campaigns",
      campaignId,
      "sessions",
      sessionId,
    );
    return updateDoc(ref, { lastOpened: serverTimestamp() });
  };

  return {
    sessions,
    loading,
    createSession,
    importSession,
    deleteSession,
    updateLastOpened,
  };
}
