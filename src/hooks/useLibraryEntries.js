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

// Entry types supported by the Creatures & Items library.
export const ENTRY_TYPES = ["creature", "npc", "item"];

function generateEntryId(name) {
  const slug = (name || "untitled")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 30);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${slug}-${suffix}`;
}

// Lives at users/{userId}/library/{entryId}. Every doc has a `type` field
// ("creature" | "npc" | "item") so Creatures, NPCs, and Items can share one
// collection and one live listener, and be filtered client-side by type.
export function useLibraryEntries(userId) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const ref = collection(db, "users", userId, "library");
    const unsubscribe = onSnapshot(ref, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => a.name?.localeCompare(b.name));
      setEntries(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [userId]);

  const saveEntry = async (entryData, existingId = null) => {
    if (!ENTRY_TYPES.includes(entryData.type)) {
      throw new Error(`saveEntry: unknown type "${entryData.type}"`);
    }
    const id = existingId ?? generateEntryId(entryData.name);
    const ref = doc(db, "users", userId, "library", id);
    await setDoc(ref, {
      ...entryData,
      updatedAt: serverTimestamp(),
      createdAt: entryData.createdAt ?? serverTimestamp(),
    });
    return id;
  };

  const deleteEntry = async (entryId) => {
    const ref = doc(db, "users", userId, "library", entryId);
    return deleteDoc(ref);
  };

  return { entries, loading, saveEntry, deleteEntry };
}
