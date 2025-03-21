import { useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { Car, FileText, MessageSquare, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import AdminCars from "@/components/admin/AdminCars";
import AdminSellEnquiry from "@/components/admin/AdminSellEnquiry";
import AdminCarEnquiry from "@/components/admin/AdminCarEnquiry";
import { cn } from "@/lib/utils";
import Sidebar from '@/components/Sidebar';
import Settings from '@/components/admin/Settings';
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("cars");
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  const NavButton = ({ value, icon: Icon, label, onClick }: { 
    value: string; 
    icon: any; 
    label: string;
    onClick?: () => void;
  }) => (
    <Button
      variant={activeTab === value ? "default" : "ghost"}
      className={cn(
        "w-full justify-start gap-2 px-3 py-2",
        activeTab === value && "bg-red-600 text-white hover:bg-red-700",
        isSidebarCollapsed && "justify-center px-2"
      )}
      onClick={onClick || (() => setActiveTab(value))}
    >
      <Icon className="h-4 w-4" />
      {!isSidebarCollapsed && <span>{label}</span>}
    </Button>
  );

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('adminAuthenticated');
      localStorage.removeItem('adminToken');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed top-0 left-0 h-screen bg-white transition-all duration-300 ease-in-out z-10",
          isSidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h1 className={cn(
              "text-xl font-bold text-gray-800 transition-opacity duration-200",
              isSidebarCollapsed && "opacity-0"
            )}>
              Dashboard
            </h1>
          </div>

          <nav className="flex-1 mt-6 space-y-2 p-3">
            <NavButton value="cars" icon={Car} label="Cars" />
            <NavButton value="sell-enquiry" icon={FileText} label="Sell Car Enquiry" />
            <NavButton value="car-enquiry" icon={MessageSquare} label="Car Enquiry" />
            
            {/* Collapse button as part of navigation */}
            <NavButton 
              value="collapse" 
              icon={isSidebarCollapsed ? ChevronRight : ChevronLeft} 
              label="Collapse Menu"
              onClick={toggleSidebar}
            />
          </nav>

          <div className="p-4 border-t bg-white mt-auto">
            <Button
              variant="destructive"
              className={cn(
                "w-full",
                isSidebarCollapsed && "px-2"
              )}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {!isSidebarCollapsed && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content - Adjusted margin and padding */}
      <div className={cn(
        "flex-1 transition-all duration-300",
        isSidebarCollapsed ? "ml-16" : "ml-64"
      )} >
        <div className="p-6">
          {activeTab === "cars" && <AdminCars />}
          {activeTab === "sell-enquiry" && <AdminSellEnquiry />}
          {activeTab === "car-enquiry" && <AdminCarEnquiry />}
        </div>
        <Routes>
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
