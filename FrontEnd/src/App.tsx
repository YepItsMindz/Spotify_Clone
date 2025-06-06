import { Route } from "react-router-dom";
import { Routes } from "react-router";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import ChatPage from "./pages/chat/ChatPage";
import MainLayout from "./layout/MainLayout";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import PlaylistPage from "./pages/playlist/PlaylistPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Routes>
        <Route 
          path="/sso-callback" 
          element={<AuthenticateWithRedirectCallback 
          signUpForceRedirectUrl={"/auth-callback"}
        />} />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />

        <Route path="/admin" element={<AdminPage />} />

        <Route element={<MainLayout/>}>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/albums/:albumId" element={<AlbumPage/>} />
            <Route path="/playlists/:playlistId" element={<PlaylistPage />} />
        </Route>
            
      </Routes>
      <Toaster/>
    </>
  )
}

export default App
