import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

export function useNotes(userId, campaignId, sessionId) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !campaignId || !sessionId) return;
    const ref = collection(
      db,
      "users",
      userId,
      "campaigns",
      campaignId,
      "sessions",
      sessionId,
      "notes",
    );
    const unsubscribe = onSnapshot(ref, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      data.sort(
        (a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0),
      );
      setNotes(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [userId, campaignId, sessionId]);

  const addNote = (text, category) => {
    const ref = collection(
      db,
      "users",
      userId,
      "campaigns",
      campaignId,
      "sessions",
      sessionId,
      "notes",
    );
    return addDoc(ref, {
      text,
      category,
      createdAt: serverTimestamp(),
    });
  };

  const deleteNote = (noteId) => {
    const ref = doc(
      db,
      "users",
      userId,
      "campaigns",
      campaignId,
      "sessions",
      sessionId,
      "notes",
      noteId,
    );
    return deleteDoc(ref);
  };

  return { notes, loading, addNote, deleteNote };
}
