import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUser } from "@clerk/clerk-react";
import { Music } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { useSaveSongToHistory } from "@/lib/saveSongToHistory";
import { getMongoUserId } from "@/lib/getMongoUserId";
import { useHistoryStore } from "@/stores/useHistoryStore";
import { usePlayerStore } from "@/stores/usePlayerStore";

const HistoryPanel = ({ title = "Recently Played" }: { title?: string }) => {
  const { user } = useUser();
  const history = useHistoryStore((s) => s.history);
  const setHistory = useHistoryStore((s) => s.setHistory);
  const { setCurrentSong } = usePlayerStore();
  const [loading, setLoading] = useState(false);
  const [mongoUserId, setMongoUserId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const saveSongToHistory = useSaveSongToHistory();

  useEffect(() => {
    if (!user) return;
    setError(null);
    setMongoUserId(undefined);
    getMongoUserId(user.id)
      .then((mongoId) => {
        if (!mongoId) {
          setError("User not found in database. Please try logging out and in again.");
        }
        setMongoUserId(mongoId);
      })
      .catch(() => setError("Failed to fetch user info."));
  }, [user]);

  useEffect(() => {
    if (!mongoUserId) return;
    setLoading(true);
    axiosInstance
      .get(`/users/history/${mongoUserId}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setHistory(res.data);
        } else {
          setHistory([]);
        }
      })
      .catch(() => setError("Failed to fetch history."))
      .finally(() => setLoading(false));
  }, [mongoUserId, setHistory]);

  if (!user) {
    return (
      <div className="h-full bg-zinc-900 rounded-lg flex flex-col items-center justify-center text-center space-y-4">
        <div className="relative">
          <div
            className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full blur-lg opacity-75 animate-pulse"
            aria-hidden="true"
          />
          <div className="relative bg-zinc-900 rounded-full p-4">
            <Music className="size-8 text-emerald-400" />
          </div>
        </div>
        <div className="space-y-2 max-w-[250px]">
          <h3 className="text-lg font-semibold text-white">See Your Recently Played Songs</h3>
          <p className="text-sm text-zinc-400">Login to view your listening history and discover your music journey.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-zinc-900 rounded-lg flex flex-col items-center justify-center text-center space-y-4">
        <div className="text-red-400 font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-zinc-900 rounded-lg flex flex-col">
      <div className="p-4 flex items-center gap-2 border-b border-zinc-800">
        <Music className="size-5 shrink-0 text-emerald-400" />
        <h2 className="font-semibold">{title}</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {loading ? (
            <div>Loading...</div>
          ) : history.length === 0 ? (
            <div className="text-zinc-400">No recently played songs.</div>
          ) : (
            history.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 p-3 rounded-md hover:bg-zinc-800/50 transition-colors cursor-pointer"
                onClick={() => {
                  if (!user) return;
                  // Ensure all required fields for Song type
                  const song = {
                    _id: item.songId._id,
                    title: item.songId.title,
                    artist: item.songId.artist,
                    albumId: (item.songId as any).albumId || "",
                    imageUrl: item.songId.imageUrl || "",
                    audioUrl: (item.songId as any).audioUrl || "",
                    duration: (item.songId as any).duration || 0,
                    createdAt: (item.songId as any).createdAt || new Date().toISOString(),
                    updatedAt: (item.songId as any).updatedAt || new Date().toISOString(),
                  };
                  setCurrentSong(song);
                  saveSongToHistory(song);
                }}
              >
                {item.songId.imageUrl && (
                  <img
                    src={item.songId.imageUrl}
                    alt={item.songId.title}
                    className="w-12 h-12 rounded object-cover border border-zinc-800"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate">{item.songId.title}</div>
                  <div className="text-xs text-zinc-400 truncate">{item.songId.artist}</div>
                  <div className="text-xs text-zinc-500">
                    {new Date(item.listenedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HistoryPanel;
