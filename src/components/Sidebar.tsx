import { useNavigate } from 'react-router-dom';
import { Car, MessageSquare, Settings, LogOut, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const pathname = window.location.pathname;

  const navigation = [
    {
      name: 'Cars',
      href: '/admin-dashboard',
      icon: Car,
      current: pathname === '/admin-dashboard',
    },
    {
      name: 'Sell Car Enquiry',
      href: '/admin-dashboard/sell-enquiry',
      icon: FileSpreadsheet,
      current: pathname === '/admin-dashboard/sell-enquiry',
    },
    {
      name: 'Car Enquiry',
      href: '/admin-dashboard/car-enquiry',
      icon: MessageSquare,
      current: pathname === '/admin-dashboard/car-enquiry',
    },
    {
      name: 'Settings',
      href: '/admin-dashboard/settings', // Updated path
      icon: Settings,
      current: pathname === '/admin-dashboard/settings',
    },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin-auth');
  };

  return (
    <div className={` rounded-xl bg-white dark:bg-gray-900 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} border-r`}>
      <div className="flex flex-col h-full">
        <div className="flex-1 flex flex-col gap-y-7 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-2 ">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center gap-x-3 px-3 py-2 text-sm rounded-md transition-colors
                  ${item.current 
                    ? 'bg-gray-100 dark:bg-gray-800 text-primary' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span>{item.name}</span>}
              </a>
            ))}
          </nav>

          <div className="px-2 space-y-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="flex items-center gap-x-3 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <>
                  <ChevronLeft className="h-5 w-5" />
                  <span>Collapse Menu</span>
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-x-3 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
            >
              <LogOut className="h-5 w-5" />
              {!collapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
