import { axiosInstance } from "@/lib/axios";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useRef, useEffect } from "react";
import { getMongoUserId } from "@/lib/getMongoUserId";
import { useHistoryStore } from "@/stores/useHistoryStore";

export const saveSongToHistory = async (songId: string, userId?: string, token?: string) => {
  if (!userId || !token) return;
  try {
    await axiosInstance.post(
      `/users/history/${userId}`,
      { songId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (e) {
    // Optionally handle error
  }
};

// React hook for convenience
export const useSaveSongToHistory = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const mongoUserIdRef = useRef<string | undefined>(undefined);
  const addToHistory = useHistoryStore((s) => s.addToHistory);

  useEffect(() => {
    if (user?.id) {
      getMongoUserId(user.id).then((mongoId) => {
        mongoUserIdRef.current = mongoId;
      });
    }
  }, [user?.id]);

  return async (song: any) => {
    const token = await getToken();
    if (mongoUserIdRef.current && token) {
      await saveSongToHistory(song._id, mongoUserIdRef.current, token);
      addToHistory(song); // update global history instantly
    }
  };
};
