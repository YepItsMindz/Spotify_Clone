import { usePlayerStore } from "@/stores/usePlayerStore"
import { Song } from "@/types"
import { Button } from "@/components/ui/button"
import { Play, Pause } from "lucide-react"
import { useSaveSongToHistory } from "@/lib/saveSongToHistory";

const PlayButton = ({song} : {song:Song}) => {
  const {currentSong, isPlaying, setCurrentSong, togglePlay} = usePlayerStore()
  const isCurrentSong = currentSong?._id === song._id
  const saveSongToHistory = useSaveSongToHistory();

  const handlePlay = () => {
    if (isCurrentSong) { togglePlay() }
    else { setCurrentSong(song) }
    saveSongToHistory(song);
  };

  return (
    <Button 
      size={'icon'}
      onClick={handlePlay}
      className={`absolute bottom-3 right-2 bg-green-500 hover:bg-emerald-400 hover:scale-105 transition-all opacity-0 translate-y-2 group-hover:translate-y-0 
        ${isCurrentSong ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
    >
      {isCurrentSong && isPlaying ? (
        <Pause className="size-5 text-white"/>
      ) : (
        <Play className="size-5 text-white"/>
      )}
    </Button>    
  )
}

export default PlayButton;