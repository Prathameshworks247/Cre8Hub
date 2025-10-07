
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import React from "react";
import { BackendAuthProvider } from "@/hooks/useBackendAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import ProfileSetup from "./pages/ProfileSetup";
import Cre8Echo from "./pages/Cre8Echo";
import Dashboard from "./pages/Dashboard";
import YouTubeCallback from "./pages/YouTubeCallback";
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
        <TooltipProvider>
          <BackendAuthProvider>
            <div className="min-h-screen">
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/signin" element={
                    <ProtectedRoute requireAuth={false}>
                      <SignIn />
                    </ProtectedRoute>
                  } />
                  <Route path="/signup" element={
                    <ProtectedRoute requireAuth={false}>
                      <SignUp />
                    </ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute requireAuth={true}>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile-setup" element={
                    <ProtectedRoute requireAuth={true}>
                      <ProfileSetup />
                    </ProtectedRoute>
                  } />
                  <Route path="/cre8echo" element={
                    <ProtectedRoute requireAuth={true}>
                      <Cre8Echo />
                    </ProtectedRoute>
                  } />
                  <Route path="/auth/youtube/callback" element={<YouTubeCallback />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
                <Sonner />
              </BrowserRouter>
            </div>
          </BackendAuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
