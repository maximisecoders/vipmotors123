import { Toast } from "@/components/ui/toaster";
import { ToastProvider } from "@radix-ui/react-toast";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import Compare from "./pages/Compare";
import CarDetails from "./pages/CarDetails";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Settings from '@/components/admin/Settings';
import ManagerAuth from './pages/ManagerAuth';
import Login from './pages/Login';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ToastProvider>
        <Toast />
        <Sonner />
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/:id" element={<CarDetails />} />
            <Route path="/compare" element={<Compare />} />
            <Route 
              path="/admin-dashboard/*" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
