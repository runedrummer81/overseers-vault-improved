import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";

export function usePlayers(userId, campaignId) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !campaignId) return;
    const ref = collection(
      db,
      "users",
      userId,
      "campaigns",
      campaignId,
      "players",
    );
    const unsubscribe = onSnapshot(ref, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      data.sort(
        (a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0),
      );
      setPlayers(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [userId, campaignId]);

  const addPlayer = (playerData) => {
    const ref = collection(
      db,
      "users",
      userId,
      "campaigns",
      campaignId,
      "players",
    );
    return addDoc(ref, {
      ...playerData,
      status: "active",
      createdAt: serverTimestamp(),
    });
  };

  const updatePlayer = (playerId, updates) => {
    const ref = doc(
      db,
      "users",
      userId,
      "campaigns",
      campaignId,
      "players",
      playerId,
    );
    return updateDoc(ref, updates);
  };

  const removePlayer = (playerId) => {
    const ref = doc(
      db,
      "users",
      userId,
      "campaigns",
      campaignId,
      "players",
      playerId,
    );
    return deleteDoc(ref);
  };

  const activePlayers = players.filter((p) => p.status === "active");
  const playerCount = activePlayers.length;

  return {
    players,
    activePlayers,
    playerCount,
    loading,
    addPlayer,
    updatePlayer,
    removePlayer,
  };
}
