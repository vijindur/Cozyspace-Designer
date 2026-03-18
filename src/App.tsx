/**
 * App root — wraps with ThemeProvider for dark/light mode support.
 * 
 * HCI Rationale: Theme persistence respects user preferences (WCAG,
 * Nielsen H7: Flexibility). Central providers ensure consistent state.
 * Route structure: Landing (/) → Dashboard (/dashboard) → Editor (/editor)
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { DesignProvider } from "@/contexts/DesignContext";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" storageKey="roomforge-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DesignProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DesignProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
