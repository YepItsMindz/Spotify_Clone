import { buttonVariants } from "@/components/ui/button"
import { HomeIcon, LibraryIcon, MessageCircleIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { SignedIn } from "@clerk/clerk-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton"
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlaylistsStore } from "@/stores/usePlaylistsStore";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Plus, Upload, Trash2 } from "lucide-react";


const LeftSidebar = () => {
  const { albums, fetchAlbums, isLoading } = useMusicStore();
  // Destructure only the needed functions and state from the store
  const { playlists, isLoading: playlistsLoading, fetchPlaylists, createPlaylist, deletePlaylist } = usePlaylistsStore();
  const [activeSection, setActiveSection] = useState<'playlists' | 'albums'>('albums');
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
  const [newPlaylistDesc, setNewPlaylistDesc] = useState("");
  const [newPlaylistImage, setNewPlaylistImage] = useState<File | null>(null);
  const [playlistDialogOpen, setPlaylistDialogOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Create playlist
  const handleCreatePlaylist = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newPlaylistTitle) return;
    try {
      await createPlaylist({
        title: newPlaylistTitle,
        description: newPlaylistDesc,
        imageFile: newPlaylistImage || undefined,
      });
      setNewPlaylistTitle("");
      setNewPlaylistDesc("");
      setNewPlaylistImage(null);
      setPlaylistDialogOpen(false);
      toast.success("Playlist created successfully");
    } catch (err: any) {
      toast.error("Failed to create playlist: " + (err?.response?.data?.message || err.message));
    }
  };

  // Delete playlist
  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      await deletePlaylist(playlistId);
    } catch {}
  };

  useEffect(() => {
    fetchAlbums();
    if (activeSection === 'playlists') fetchPlaylists();
  }, [fetchAlbums, activeSection, fetchPlaylists]);
  return (
    <div className="h-full flex flex-col gap-2">
      <div className="rounded-lg bg-zinc-900 p-4">
        <div className="space-y-2">
          <Link to={"/"} className={cn(buttonVariants({
            variant: "ghost",
            className: "w-full justify-start text-white hover:bg-zinc-800 ",
          }
          ))}>
            <HomeIcon className="mr-2 size-5"/>
            <span className="hidden md:inline">Home</span>
          </Link>

          <SignedIn>
            <Link to={"/chat"} className={cn(buttonVariants({
              variant: "ghost",
              className: "w-full justify-start text-white hover:bg-zinc-800 ",
            }
            ))}>
              <MessageCircleIcon className="mr-2 size-5"/>
              <span className="hidden md:inline">Message</span>
            </Link>
          </SignedIn>

          <SignedIn>
            <Link to="#" onClick={() => setActiveSection('playlists')} className={cn(buttonVariants({
              variant: 'ghost',
              className: "w-full justify-start text-white hover:bg-zinc-800 ",
            }))}>
              <LibraryIcon className="mr-2 size-5"/>
              <span className="hidden md:inline">Playlists</span>
            </Link>
          </SignedIn>
          <Link to="#" onClick={() => setActiveSection('albums')} className={cn(buttonVariants({
            variant:  'ghost',
            className: "w-full justify-start text-white hover:bg-zinc-800 ",
          }))}>
            <LibraryIcon className="mr-2 size-5"/>
            <span className="hidden md:inline">Albums</span>
          </Link>
        </div>
      </div>

      {/* Section switcher */}
      {activeSection === 'playlists' ? (
        <div className="flex-1 rounded-lg bg-zinc-900 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-white px-2">
              <LibraryIcon className="mr-2 size-5"/>
              <span className="hidden md:inline">Playlists</span>
            </div>
          </div>
          <Dialog open={playlistDialogOpen} onOpenChange={setPlaylistDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-black w-full mb-4">
                <Plus className="mr-2 h-4 w-4" />
                Create Playlist
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Create New Playlist</DialogTitle>
                <DialogDescription>Add a new playlist to your library</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <input
                  type="file"
                  ref={imageInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={e => setNewPlaylistImage(e.target.files ? e.target.files[0] : null)}
                />
                <div
                  className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <div className="text-center">
                    {newPlaylistImage ? (
                      <div className="space-y-2">
                        <div className="text-sm text-emerald-500">Image selected:</div>
                        <div className="text-xs text-zinc-400">{newPlaylistImage.name.slice(0, 20)}</div>
                      </div>
                    ) : (
                      <>
                        <div className="p-3 bg-zinc-800 rounded-full inline-block mb-2">
                          <Upload className="h-6 w-6 text-zinc-400" />
                        </div>
                        <div className="text-sm text-zinc-400 mb-2">Upload playlist artwork</div>
                        <Button variant="outline" size="sm" className="text-xs">
                          Choose File
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newPlaylistTitle}
                    onChange={e => setNewPlaylistTitle(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Input
                    value={newPlaylistDesc}
                    onChange={e => setNewPlaylistDesc(e.target.value)}
                    className="bg-zinc-800 border-zinc-700"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setPlaylistDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleCreatePlaylist}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <ScrollArea className="h-[calc(100vh-350px)]">
            <div className="space-y-2">
              {playlistsLoading ? (
                <PlaylistSkeleton/>
              ) : playlists.length === 0 ? (
                <div className="p-2 text-zinc-400">No playlists found.</div>
              ) : (
                playlists.map((playlist) => (
                  <Link
                    to={`/playlists/${playlist._id}`}
                    key={playlist._id}
                    className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                  >
                    <img src={playlist.imageUrl || '/playlist-default.png'} alt="Playlist img" className="size-12 object-cover rounded-md flex-shrink-0"/>
                    <div className="flex-1 min-w-0 hidden md:block">
                      <p className="font-medium truncate">{playlist.title}</p>
                      <p className="text-sm text-zinc-400 truncate">{playlist.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeletePlaylist(playlist._id);
                      }}
                      className="text-red-400 hover:text-red-300 hover:bg-red-400/10 ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </Link>
                )))
              }
            </div>
          </ScrollArea>
        </div>
      ) : (
        <div className="flex-1 rounded-lg bg-zinc-900 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-white px-2">
              <LibraryIcon className="mr-2 size-5"/>
              <span className="hidden md:inline">Album</span>
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="space-y-2">
              {isLoading ? (
                <PlaylistSkeleton/>
              ) : (
                albums.map((album) => (
                  <Link to={`/albums/${album._id}`} 
                  key={album._id} 
                  className="p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer"
                  >
                    <img src={album.imageUrl} alt="Playlist img"
                    className="size-12 object-cover rounded-md flex-shrink-0"/>
                  
                    <div className="flex-1 min-w-0 hidden md:block">
                      <p className="font-medium truncate">
                        {album.title}
                      </p>
                      <p className="text-sm text-zinc-400 truncate">
                        Album • {album.artist}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}

export default LeftSidebar