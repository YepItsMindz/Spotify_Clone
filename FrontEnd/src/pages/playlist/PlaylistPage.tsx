import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePlaylistsStore } from "@/stores/usePlaylistsStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { Button } from "@/components/ui/button";
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, Music, Clock, Plus, Trash2 } from "lucide-react";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { formatDuration } from "@/pages/album/AlbumPage";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useSaveSongToHistory } from "@/lib/saveSongToHistory";

const PlaylistPage = () => {
  const { playlistId } = useParams();
  const { playlists, isLoading, fetchPlaylists, removeSongFromPlaylist, addSongToPlaylist } = usePlaylistsStore();
  const { songs, fetchSongs } = useMusicStore();
  const [playlist, setPlaylist] = useState<any>(null);
  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();
  const [addSongDialogOpen, setAddSongDialogOpen] = useState(false);
  const [deleteSongDialogOpen, setDeleteSongDialogOpen] = useState<string | null>(null);
  const [selectedSongId, setSelectedSongId] = useState<string>("");
  const navigate = useNavigate();
  const saveSongToHistory = useSaveSongToHistory();

  useEffect(() => {
    fetchPlaylists();
    fetchSongs();
  }, [fetchPlaylists, fetchSongs]);

  useEffect(() => {
    setPlaylist(playlists.find((p) => p._id === playlistId));
  }, [playlists, playlistId]);

  useEffect(() => {
    if (!isLoading && playlists.length > 0 && !playlists.find((p) => p._id === playlistId)) {
      navigate("/");
    }
  }, [isLoading, playlists, playlistId, navigate]);

  if (isLoading || !playlist) return <PlaylistSkeleton />;

  const playlistSongs = playlist.songs
    .map((songId: string) => songs.find((s) => s._id === songId))
    .filter(Boolean);

  const handlePlayPlaylist = () => {
    if (!playlistSongs.length) return;
    const isCurrentPlaylistPlaying = playlistSongs.some((song: any) => song?._id === currentSong?._id);
    if (isCurrentPlaylistPlaying) {
      togglePlay();
    } else {
      playAlbum(playlistSongs, 0);
    }
  };

  const handlePlaySong = (index: number) => {
    if (!playlistSongs.length) return;
    playAlbum(playlistSongs, index);
    if (playlistSongs[index]) saveSongToHistory(playlistSongs[index]);
  };

  return (
    <div className="h-full">
      <ScrollArea className="h-full rounded-md">
        <div className="min-h-full">
          {/* bg gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />
          <div className="relative z-10">
            <div className="flex p-6 gap-6 pb-8">
              <img
                src={playlist.imageUrl || "/playlist-default.png"}
                alt={playlist.title}
                className="w-[240px] h-[240px] shadow-xl rounded"
              />
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Playlist</p>
                <h1 className="text-7xl font-bold my-4">{playlist.title}</h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">{playlist.description}</span>
                  <span>• {playlistSongs.length} songs</span>
                </div>
              </div>
            </div>
            {/* play button and add song dialog in the same row, add justify-between to push add song to the end */}
            <div className="px-6 pb-4 flex items-center gap-6 justify-between">
              <Button
                onClick={handlePlayPlaylist}
                size="icon"
                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
              >
                {isPlaying && playlistSongs.some((song: any) => song?._id === currentSong?._id) ? (
                  <Pause className="h-7 w-7 text-white" />
                ) : (
                  <Play className="h-7 w-7 text-white" />
                )}
              </Button>
              <div className="flex-1" />
              {/* Add Song Dialog Trigger */}
              <Dialog open={addSongDialogOpen} onOpenChange={setAddSongDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setAddSongDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Song
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle>Add Song to Playlist</DialogTitle>
                    <DialogDescription>Select a song to add to this playlist.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <select
                      className="bg-zinc-800 border-zinc-700 w-full p-2 rounded"
                      value={selectedSongId}
                      onChange={e => setSelectedSongId(e.target.value)}
                    >
                      <option value="" disabled>Select a song</option>
                      {songs.map(song => (
                        <option key={song._id} value={song._id}>{song.title} - {song.artist}</option>
                      ))}
                    </select>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      onClick={async () => {
                        if (selectedSongId) {
                          await addSongToPlaylist(playlist._id, selectedSongId);
                          setAddSongDialogOpen(false);
                          setSelectedSongId("");
                          fetchPlaylists();
                          fetchSongs();
                        }
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      disabled={!selectedSongId}
                    >
                      Add Song
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {/* Table Section */}
            <div className="bg-black/20 backdrop-blur-sm">
              {/* table header */}
              <div
                className="grid grid-cols-[16px_4fr_2fr_1fr_80px] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5"
              >
                <div>#</div>
                <div>Title</div>
                <div>Artist</div>
                <div>
                  <Clock className="h-4 w-4" />
                </div>
                <div></div>
              </div>
              {/* songs list */}
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {playlistSongs.length === 0 ? (
                    <div className="text-zinc-400">No songs in this playlist.</div>
                  ) : (
                    playlistSongs.map((song: any, index: number) => {
                      if (!song) return null;
                      const isCurrentSong = currentSong?._id === song._id;
                      return (
                        <div
                          onClick={() => handlePlaySong(index)}
                          key={song._id}
                          className={`grid grid-cols-[16px_4fr_2fr_1fr_80px] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer`}
                        >
                          <div className="flex items-center justify-center">
                            {isCurrentSong && isPlaying ? (
                              <Music className="size-4 text-emerald-500" />
                            ) : (
                              <span className="group-hover:hidden">{index + 1}</span>
                            )}
                            {!isCurrentSong && (
                              <Play className="h-4 w-4 hidden group-hover:block" />
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <img src={song.imageUrl || "/music-note.svg"} alt={song.title} className="size-10" />
                            <div>
                              <div className="font-medium text-white">{song.title}</div>
                            </div>
                          </div>
                          <div className="flex items-center">{song.artist}</div>
                          <div className="flex items-center">{formatDuration(song.duration)}</div>
                          <div className="flex items-center">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={e => {
                                e.stopPropagation();
                                setDeleteSongDialogOpen(song._id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            {/* Delete Song Dialog */}
                            <Dialog open={deleteSongDialogOpen === song._id} onOpenChange={open => !open && setDeleteSongDialogOpen(null)}>
                              <DialogContent className="bg-zinc-900 border-zinc-700">
                                <DialogHeader>
                                  <DialogTitle>Remove Song</DialogTitle>
                                  <DialogDescription>Are you sure you want to remove this song from the playlist?</DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                  <Button
                                    variant="outline"
                                    onClick={() => setDeleteSongDialogOpen(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={async () => {
                                      await removeSongFromPlaylist(playlist._id, song._id);
                                      setDeleteSongDialogOpen(null);
                                      fetchPlaylists();
                                      fetchSongs();
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PlaylistPage;
