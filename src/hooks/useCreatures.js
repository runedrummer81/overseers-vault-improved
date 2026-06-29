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

function generateCreatureId(name) {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 30);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${slug}-${suffix}`;
}

export function useCreatures(userId) {
  const [creatures, setCreatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const ref = collection(db, "users", userId, "creatures");
    const unsubscribe = onSnapshot(ref, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => a.name?.localeCompare(b.name));
      setCreatures(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [userId]);

  const saveCreature = async (creatureData, existingId = null) => {
    const id = existingId ?? generateCreatureId(creatureData.name);
    const ref = doc(db, "users", userId, "creatures", id);
    await setDoc(ref, {
      ...creatureData,
      updatedAt: serverTimestamp(),
      createdAt: creatureData.createdAt ?? serverTimestamp(),
    });
    return id;
  };

  const deleteCreature = async (creatureId) => {
    const ref = doc(db, "users", userId, "creatures", creatureId);
    return deleteDoc(ref);
  };

  return { creatures, loading, saveCreature, deleteCreature };
}
