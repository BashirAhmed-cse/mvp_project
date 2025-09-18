'use client';
import { useState, useEffect } from "react";
import { 
  Home, BarChart3, TrendingUp, Users, Shield, FileText, Settings, 
  LogOut, X, ChevronDown, Activity, Database, Server, Building2 
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [systemsExpanded, setSystemsExpanded] = useState(true);
  const [user, setUser] = useState({ name: 'Admin User', email: 'admin@fundguard.com' });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try { setUser(JSON.parse(userData)); } 
      catch (e) { console.error('Error parsing user data:', e); }
    }
  }, []);

  function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  const getUserInitials = (name: string) =>
    name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);

  const navigationItems = [
    { icon: Home, label: "Dashboard", active: true, href: "/dashboard" },
    { icon: BarChart3, label: "Analytics", active: false, href: "/analytics" },
    { icon: TrendingUp, label: "Performance", active: false, href: "/performance" },
    { icon: Users, label: "Clients", active: false, href: "/clients" },
    { icon: Shield, label: "Security", active: false, href: "/security" },
    { icon: FileText, label: "Reports", active: false, href: "/reports" },
    { icon: Settings, label: "Settings", active: false, href: "/settings" }
  ];

  const systemStatus = [
    { name: "Trading", status: "online", icon: Activity },
    { name: "Settlement", status: "online", icon: Database },
    { name: "Reporting", status: "offline", icon: FileText },
    { name: "Backup", status: "online", icon: Server }
  ];

  const adminActions = [
    { icon: Settings, label: "Update Password", href: "/update-password" },
    { icon: Users, label: "Add New User", href: "/add-user" }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-background to-background/95 border-r border-border/50 shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                ResilienceOS+
              </h1>
              <p className="text-xs text-muted-foreground">Sovereign Dashboard — Demo</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-md hover:bg-accent transition-colors md:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {navigationItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${item.active ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 shadow-sm" : "text-foreground-muted hover:bg-accent hover:text-foreground"}`}
              >
                <item.icon className="h-4 w-4 mr-3" />
                <span className="flex-1">{item.label}</span>
              </a>
            ))}
          </nav>

          {/* Systems Status */}
          <div className="mt-8">
            <button onClick={() => setSystemsExpanded(!systemsExpanded)} className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors">
              <span>Systems Status</span>
              <ChevronDown className={`h-3 w-3 transition-transform ${systemsExpanded ? 'rotate-0' : '-rotate-90'}`} />
            </button>
            {systemsExpanded && (
              <div className="mt-2 space-y-2">
                {systemStatus.map((system, index) => (
                  <div key={index} className="flex items-center px-3 py-2.5 rounded-lg text-sm bg-gradient-to-r from-background to-background/50 hover:from-accent/50 hover:to-accent/30 transition-all duration-200 group">
                    <div className="flex items-center gap-2 flex-1">
                      <system.icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                      <span className="text-foreground">{system.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`h-2 w-2 rounded-full ${system.status === "online" ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                      <span className={`text-xs font-medium ${system.status === "online" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                        {system.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Admin Actions */}
        <div className="p-4 border-t border-border/50 space-y-1">
          {adminActions.map((item, index) => (
            <a key={index} href={item.href} className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-foreground-muted hover:bg-accent hover:text-foreground transition-all duration-200">
              <item.icon className="h-4 w-4 mr-3" /> {item.label}
            </a>
          ))}
          <button onClick={handleLogout} className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200">
            <LogOut className="h-4 w-4 mr-3" /> Logout
          </button>

          {/* User Profile */}
          <div className="mt-4 pt-4 border-t border-border/30 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <span className="text-xs font-medium text-white">{getUserInitials(user.name)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
