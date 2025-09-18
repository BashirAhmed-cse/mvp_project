"use client"

import { useState, useEffect } from "react"
import { Sun, Moon, Wifi, Server, Signal, SignalHigh, SignalLow, SignalZero, Menu, Database, Cpu } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [connectionPulse, setConnectionPulse] = useState(true)
  const [connectionStrength, setConnectionStrength] = useState(3)

  const { data: systemStates } = useSWR("/api/system-state", fetcher, { refreshInterval: 1000 })
  const latestState = systemStates?.[0] || { mode: "normal", nav: 1000000, liquidity: 50, timestamp: new Date().toISOString() }

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    const pulseTimer = setInterval(() => setConnectionPulse(prev => !prev), 1500)
    const connectionTimer = setInterval(() => setConnectionStrength(Math.floor(Math.random() * 4)), 10000)
    return () => {
      clearInterval(timer)
      clearInterval(pulseTimer)
      clearInterval(connectionTimer)
    }
  }, [])

  if (!mounted) return null

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount)

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", { hour12: false, timeZone: "UTC", hour: "2-digit", minute: "2-digit", second: "2-digit" })

  const renderConnectionStrength = () => {
    switch (connectionStrength) {
      case 0: return <SignalZero className="h-3 w-3 text-red-500" />
      case 1: return <SignalLow className="h-3 w-3 text-amber-500" />
      case 2: return <Signal className="h-3 w-3 text-amber-500" />
      case 3: return <SignalHigh className="h-3 w-3 text-green-500" />
      default: return <SignalHigh className="h-3 w-3 text-green-500" />
    }
  }

  const modeColor = () => {
    switch (latestState.mode) {
      case "cyber": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "freeze": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "liquidity": return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
      default: return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    }
  }

  return (
    <header className="border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col text-center md:text-left">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Database className="h-3 w-3" /> NAV
            </div>
            <div className="font-mono font-semibold">{formatCurrency(latestState.nav)}</div>
          </div>

          <div className="flex flex-col text-center md:text-left">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Cpu className="h-3 w-3" /> Liquidity
            </div>
            <div className="font-mono font-semibold">{latestState.liquidity.toFixed(1)}%</div>
          </div>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${modeColor()}`}>
            <Wifi className="h-3 w-3" />
            {latestState.mode}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              <Sun className="h-4 w-4 dark:hidden" />
              <Moon className="h-4 w-4 hidden dark:block" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>

          <div className="flex flex-col text-right">
            <div className="text-xs text-muted-foreground">System Time</div>
            <div className="font-mono font-medium">{formatTime(currentTime)} UTC</div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
