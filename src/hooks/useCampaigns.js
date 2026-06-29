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

function generateCampaignId(name) {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 30);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${slug}-${suffix}`;
}

export function useCampaigns(userId) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const ref = collection(db, "users", userId, "campaigns");
    const unsubscribe = onSnapshot(ref, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Sort by lastOpened, most recent first
      data.sort((a, b) => {
        const aTime = a.lastOpened?.seconds ?? a.createdAt?.seconds ?? 0;
        const bTime = b.lastOpened?.seconds ?? b.createdAt?.seconds ?? 0;
        return bTime - aTime;
      });
      setCampaigns(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [userId]);

  const createCampaign = async (name, playerCount) => {
    const campaignId = generateCampaignId(name);
    const ref = doc(db, "users", userId, "campaigns", campaignId);
    const { setDoc } = await import("firebase/firestore");
    await setDoc(ref, {
      name,
      playerCount: Number(playerCount),
      createdAt: serverTimestamp(),
      lastOpened: serverTimestamp(),
    });
    return campaignId;
  };

  const deleteCampaign = async (campaignId) => {
    // First delete all sessions inside the campaign
    const sessionsRef = collection(
      db,
      "users",
      userId,
      "campaigns",
      campaignId,
      "sessions",
    );
    const sessionsSnap = await getDocs(sessionsRef);
    const deletePromises = sessionsSnap.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);
    // Then delete the campaign itself
    await deleteDoc(doc(db, "users", userId, "campaigns", campaignId));
  };

  const updateLastOpened = (campaignId) => {
    const ref = doc(db, "users", userId, "campaigns", campaignId);
    return updateDoc(ref, { lastOpened: serverTimestamp() });
  };

  return {
    campaigns,
    loading,
    createCampaign,
    deleteCampaign,
    updateLastOpened,
  };
}
