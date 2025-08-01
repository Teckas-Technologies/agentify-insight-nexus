
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Playground from "./pages/Playground";
import AgentsPage from "./pages/Agents";
import NotFound from "./pages/NotFound";
import ActivityPage from "./pages/Activity";
import CommandsPage from "./pages/Commands";
import TransactionsPage from "./pages/Transactions";
import AdminDashboard from "./pages/AdminDashboard";
import DApp from "./pages/DApp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/activity" element={<ActivityPage />} />
          <Route path="/commands" element={<CommandsPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dapp" element={<DApp />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
