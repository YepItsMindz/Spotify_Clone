import { Route } from "react-router-dom";
import { Routes } from "react-router";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/sso-callback" 
          element={<AuthenticateWithRedirectCallback 
          signUpForceRedirectUrl={"/auth-callback"}
        />} />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
      </Routes>

      <Route element={<MainLayout/>}>
            <Route path="/" element={<HomePage />} />
      </Route>
    </>
  )
}

export default App
