import { Outlet } from 'react-router-dom'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
import LeftSidebar from './components/LeftSidebar';
import FriendsActivity from './components/FriendsActivity';
import AudioPlayer from './components/AudioPlayer';
import PlaybackControls from './components/PlaybackControls';
import { useEffect, useState} from 'react';
import HistoryPanel from "./components/HistoryPanel";

const MainLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex-1 flex h-full overflow-hidden p-2">
        <AudioPlayer/>
        
        <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}>
          <LeftSidebar/>
        </ResizablePanel>

        <ResizableHandle className='w-2 rounded-lg bg-black transition-colors'/>

        <ResizablePanel defaultSize={isMobile ? 80: 60}>
          <Outlet/>
        </ResizablePanel>

        <ResizableHandle className='w-2 rounded-lg bg-black transition-colors'/>
        
        {!isMobile && (
          <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={25} collapsedSize={0}>
            <div className="relative h-full">
              <div className="h-full">
                {showHistory ? <HistoryPanel title="Recently Played" /> : <FriendsActivity />}
              </div>
            </div>
          </ResizablePanel>
        )}
      </ResizablePanelGroup>

      <PlaybackControls onToggleHistory={() => setShowHistory((v) => !v)} />
    </div>
  )
}

export default MainLayout