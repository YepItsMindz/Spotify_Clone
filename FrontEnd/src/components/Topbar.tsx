import { LayoutDashboardIcon } from "lucide-react"
import { Link } from "react-router-dom"
import SignInOAuthButtons from "./SignInOAuthButtons"
import { SignedOut, UserButton} from "@clerk/clerk-react"
import { useAuthStore } from "@/stores/useAuthStore"
import { cn } from "@/lib/utils"
import { buttonVariants } from "./ui/button"
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";

const Topbar = () => {
  const {isAdmin} = useAuthStore()
  const [search, setSearch] = useState("");
  const { songs, albums, fetchSongs, fetchAlbums } = useMusicStore();

  useEffect(() => {
    fetchSongs();
    fetchAlbums();
  }, [fetchSongs, fetchAlbums]);

  const filteredSongs = songs.filter(song => song.title.toLowerCase().includes(search.toLowerCase()) || song.artist.toLowerCase().includes(search.toLowerCase()));
  const filteredAlbums = albums.filter(album => album.title.toLowerCase().includes(search.toLowerCase()) || album.artist.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className= "flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 backdrop-blur-md z-10">
      <div className = "flex gap-2 items-center">
        <img src = "/spotify.png" alt = "Spotify logo" className = "w-8 h-8"/>
        Spotify
      </div>
      <div className="flex items-center gap-2 w-full max-w-md relative">
        <Input
          type="text"
          placeholder="Search songs or albums..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-zinc-800 border-zinc-700 text-white"
          autoComplete="off"
        />
        {search && (filteredSongs.length > 0 || filteredAlbums.length > 0) && (
          <div className="absolute top-12 left-0 w-full bg-zinc-900 border border-zinc-700 rounded shadow-lg z-50 max-h-72 overflow-y-auto">
            {filteredSongs.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs text-zinc-400">Songs</div>
                {filteredSongs.map(song => (
                  <div key={song._id} className="px-4 py-2 hover:bg-zinc-800 cursor-pointer flex flex-col">
                    <span className="font-medium text-white">{song.title}</span>
                    <span className="text-xs text-zinc-400">{song.artist}</span>
                  </div>
                ))}
              </div>
            )}
            {filteredAlbums.length > 0 && (
              <div>
                <div className="px-4 py-2 text-xs text-zinc-400">Albums</div>
                {filteredAlbums.map(album => (
                  <div key={album._id} className="px-4 py-2 hover:bg-zinc-800 cursor-pointer flex flex-col">
                    <span className="font-medium text-white">{album.title}</span>
                    <span className="text-xs text-zinc-400">{album.artist}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className = "flex items-center gap-4">
        {isAdmin && (
          <Link to = {"/admin"}
          className={cn(
            buttonVariants({variant: "outline"}),
          )}
          >
            <LayoutDashboardIcon className = "size-4 mr-2"/>
            Admin Dashboard
          </Link>
        )}
        
        <SignedOut>
          <SignInOAuthButtons/>
        </SignedOut>

        <UserButton/>
      </div>    
    </div>
    
  )
}

export default Topbar

// Filtered results logic (to be used in the sidebar or main content):
// const filteredSongs = songs.filter(song => song.title.toLowerCase().includes(search.toLowerCase()) || song.artist.toLowerCase().includes(search.toLowerCase()));
// const filteredAlbums = albums.filter(album => album.title.toLowerCase().includes(search.toLowerCase()) || album.artist.toLowerCase().includes(search.toLowerCase()));