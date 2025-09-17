// components/Header.tsx (updated)
"use client"
import { useState, useEffect } from "react"
import { 
  Building2,
  Sun,
  Moon,
  User,
  Wifi,
  Server,
  Cpu,
  Database,
  Signal,
  SignalHigh,
  SignalLow,
  SignalZero,
  Menu
} from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Add props interface
interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

// Mock hook for system data
const useSystemData = () => {
  const [systemState, setSystemState] = useState({
    mode: "freeze",
    nav: 960000000,
    liquidity: 26,
    timestamp: new Date("2025-09-17T17:00:00Z").toISOString()
  })
  
  return {
    systemState,
    auditLog: [],
    loading: false,
    error: null,
    actions: {}
  }
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date("2025-09-17T17:00:00Z"))
  const [isOnline, setIsOnline] = useState(true)
  const [connectionPulse, setConnectionPulse] = useState(true)
  const [connectionStrength, setConnectionStrength] = useState(3)
  
  const themeConfig = {
    light: {
      accent: "text-green-600",
      badge: "bg-green-100 text-green-800 border-green-200",
      background: "bg-white",
      border: "border-gray-200",
      liveIndicator: "bg-green-500/20 border-green-500/30 text-green-700",
      cardBg: "bg-white"
    },
    dark: {
      accent: "text-green-400",
      badge: "bg-green-900 text-green-200 border-green-700",
      background: "bg-gray-900",
      border: "border-gray-700",
      liveIndicator: "bg-green-500/20 border-green-500/30 text-green-300",
      cardBg: "bg-gray-800"
    }
  }
  
  const currentTheme = themeConfig[theme as keyof typeof themeConfig] || themeConfig.light

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      setCurrentTime(new Date(currentTime.getTime() + 1000))
    }, 1000)
    
    const pulseTimer = setInterval(() => {
      setConnectionPulse(prev => !prev)
    }, 1500)
    
    const connectionTimer = setInterval(() => {
      const shouldDisconnect = Math.random() > 0.95;
      setIsOnline(prev => shouldDisconnect ? !prev : prev);
      setConnectionStrength(Math.floor(Math.random() * 4));
    }, 10000)
    
    return () => {
      clearInterval(timer)
      clearInterval(pulseTimer)
      clearInterval(connectionTimer)
    }
  }, [currentTime])

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      timeZone: "UTC",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const { systemState } = useSystemData()

  const renderConnectionStrength = () => {
    switch(connectionStrength) {
      case 0: return <SignalZero className="h-3 w-3 text-red-500" />;
      case 1: return <SignalLow className="h-3 w-3 text-amber-500" />;
      case 2: return <Signal className="h-3 w-3 text-amber-500" />;
      case 3: return <SignalHigh className="h-3 w-3 text-green-500" />;
      default: return <SignalHigh className="h-3 w-3 text-green-500" />;
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <header className={`border-b ${currentTheme.background} ${currentTheme.border} shadow-sm sticky top-0 z-40`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-md hover:bg-accent md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            {/* <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
                  ResilienceOS+
                </h1>
                <p className="text-xs text-muted-foreground">Sovereign Dashboard — Demo</p>
              </div>
            </div> */}
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-6">
              <div className="flex flex-col">
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  NAV
                </div>
                <div className="font-mono text-sm font-semibold">{formatCurrency(systemState.nav)}</div>
              </div>
              
              <div className="h-6 w-px bg-border hidden sm:block"></div>
              
              <div className="flex flex-col">
                <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Cpu className="h-3 w-3" />
                  Liquidity
                </div>
                <div className={`font-mono text-sm font-semibold ${currentTheme.accent}`}>{systemState.liquidity}.9%</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${currentTheme.liveIndicator} shadow-sm relative group`}>
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full ${connectionPulse ? 'animate-ping' : ''} ${isOnline ? 'bg-green-400' : 'bg-red-400'} opacity-75`}></div>
                  <div className={`relative h-3 w-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
                <span className="text-sm font-medium hidden sm:block">{isOnline ? "LIVE" : "OFFLINE"}</span>
                <Server className="h-3.5 w-3.5 ml-1" />
                
                <div className="ml-1 flex items-center">
                  {renderConnectionStrength()}
                </div>
              </div>
              
              <div className="hidden sm:block">
                <Badge 
                  variant="outline" 
                  className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 ${
                    systemState.mode === "freeze" 
                      ? "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-700" 
                      : systemState.mode === "cyber"
                      ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700"
                      : "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700"
                  }`}
                >
                  <Wifi className="h-3.5 w-3.5" />
                  {systemState.mode === "normal"
                    ? "Normal Operations"
                    : systemState.mode === "cyber"
                      ? "Cyber Crisis"
                      : systemState.mode === "freeze"
                        ? "Global Freeze Active"
                        : "Liquidity Crisis"}
                </Badge>
              </div>
            </div>

            <div className="hidden md:flex flex-col text-right">
              <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                <span>System Time</span>
              </div>
              <div className="font-mono text-sm font-medium flex items-center gap-1.5">
                <span>{formatTime(currentTime)}</span>
                <span className="text-xs font-normal text-muted-foreground">UTC</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="rounded-full h-9 w-9"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              
             
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex justify-center md:hidden">
          <div className={`w-full justify-center py-1.5 rounded-md flex items-center gap-1.5 ${
            systemState.mode === "freeze" 
              ? "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:border-amber-700" 
              : systemState.mode === "cyber"
              ? "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700"
              : "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700"
          }`}>
            <Wifi className="h-3.5 w-3.5" />
            {systemState.mode === "normal"
              ? "Normal Operations"
              : systemState.mode === "cyber"
                ? "Cyber Crisis"
                : systemState.mode === "freeze"
                  ? "Global Freeze Active"
                  : "Liquidity Crisis"}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header