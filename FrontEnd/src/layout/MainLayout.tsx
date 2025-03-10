import { Outlet } from 'react-router-dom'
import { ResizablePanelGroup, ResizablePanel } from '@/components/ui/resizable'

const MainLayout = () => {
  const isMobile = false;
  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <ResizablePanelGroup direction="horizontal" className="flex-1 flex h-full overflow-hidden p-2">
        <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}>
          left sidebar
        </ResizablePanel>

        <ResizablePanel defaultSize={isMobile ? 80: 60}>
          <Outlet/>
        </ResizablePanel>

        <ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={25} collapsedSize={0}>
          right sidebar
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default MainLayout