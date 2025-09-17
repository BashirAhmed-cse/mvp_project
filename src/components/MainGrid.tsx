"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Building2, Droplets, Shield, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useSystemData } from "@/hooks/use-system-data"
import { useTheme } from "next-themes"

// Move interfaces outside the component
interface SystemState {
  mode: "normal" | "cyber" | "freeze" | "liquidity"
  nav: number
  liquidity: number
  timestamp: string
}

interface LogEntry {
  id: string
  type: "crisis" | "reset" | "governance"
  event: string
  timestamp: string
  details?: string
}

const MainGrid = () => {
  const { systemState, loading, error, actions } = useSystemData()
  const { theme } = useTheme()
  const [currentTime, setCurrentTime] = useState(new Date())

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Get mode-specific styling
  const getModeStyles = () => {
    switch(systemState.mode) {
      case "cyber":
        return { 
          bg: "bg-red-100 dark:bg-red-900/30", 
          icon: "text-red-600 dark:text-red-400",
          text: "text-red-600 dark:text-red-400"
        }
      case "freeze":
        return { 
          bg: "bg-blue-100 dark:bg-blue-900/30", 
          icon: "text-blue-600 dark:text-blue-400",
          text: "text-blue-600 dark:text-blue-400"
        }
      case "liquidity":
        return { 
          bg: "bg-amber-100 dark:bg-amber-900/30", 
          icon: "text-amber-600 dark:text-amber-400",
          text: "text-amber-600 dark:text-amber-400"
        }
      default: // normal
        return { 
          bg: "bg-green-100 dark:bg-green-900/30", 
          icon: "text-green-600 dark:text-green-400",
          text: "text-green-600 dark:text-green-400"
        }
    }
  }

  const modeStyles = getModeStyles()

  if (loading) {
    return (
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="rounded-xl border shadow-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // if (error) {
  //   return (
  //     <div className="w-full p-6 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 mb-8">
  //       <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
  //         <AlertCircle className="h-5 w-5" />
  //         <span>Error loading system data: {error.message}</span>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total NAV */}
      <Card className="rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-gray-700 dark:text-gray-300">Total NAV</span>
            </CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{formatCurrency(systemState.nav)}</div>
          <p className="text-xs text-muted-foreground mt-2">Net Asset Value</p>
          <div className="h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full mt-3">
            <div 
              className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500" 
              style={{ width: '100%' }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Liquidity Sleeve */}
      <Card className="rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-800/40 transition-colors">
                <Droplets className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-gray-700 dark:text-gray-300">Liquidity Sleeve</span>
            </CardTitle>
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              systemState.liquidity > 30 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
              systemState.liquidity > 15 ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" :
              "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}>
              {systemState.liquidity.toFixed(1)}%
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold mt-2 ${
            systemState.liquidity > 30 ? "text-green-600 dark:text-green-400" :
            systemState.liquidity > 15 ? "text-amber-600 dark:text-amber-400" :
            "text-red-600 dark:text-red-400"
          }`}>
            {systemState.liquidity.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground mt-2">Available Liquidity</p>
          <div className="h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full mt-3">
            <div 
              className={`h-1 rounded-full transition-all duration-500 ${
                systemState.liquidity > 30 ? "bg-gradient-to-r from-green-500 to-green-600" :
                systemState.liquidity > 15 ? "bg-gradient-to-r from-amber-500 to-amber-600" :
                "bg-gradient-to-r from-red-500 to-red-600"
              }`} 
              style={{ width: `${systemState.liquidity}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>0%</span>
            <span>100%</span>
          </div>
        </CardContent>
      </Card>

      {/* Governance Status */}
      <Card className="rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className={`p-2 rounded-lg ${modeStyles.bg} group-hover:opacity-80 transition-colors`}>
                <Shield className={`h-4 w-4 ${modeStyles.icon}`} />
              </div>
              <span className="text-gray-700 dark:text-gray-300">Governance Status</span>
            </CardTitle>
            <div className="flex items-center gap-1">
              <CheckCircle2 className={`h-4 w-4 ${modeStyles.icon}`} />
              <div className={`h-2 w-2 rounded-full ${modeStyles.icon}`}></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className={`text-lg font-semibold ${modeStyles.text}`}>
              {systemState.mode === "normal" ? "Normal" : 
               systemState.mode === "cyber" ? "Cyber Crisis" :
               systemState.mode === "freeze" ? "Freeze Active" : "Liquidity Crisis"}
            </div>
            <div className={`h-2 w-2 rounded-full ${modeStyles.icon} animate-pulse`}></div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">3-of-5 signatures armed</p>
          <div className="flex mt-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex-1 flex flex-col items-center">
                <div className={`h-2 w-2 rounded-full ${item <= 3 ? modeStyles.icon : 'bg-gray-300 dark:bg-gray-600'} mb-1 transition-colors`}></div>
                <span className="text-xs text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className={`h-2 w-2 rounded-full ${modeStyles.icon}`}></div>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
              <span>Inactive</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Facilities Status */}
      <Card className="rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40 transition-colors">
                <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-gray-700 dark:text-gray-300">Facilities Status</span>
            </CardTitle>
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-2 space-y-3">
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Facility A</span>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Facility B</span>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                Standby
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <AlertCircle className="h-3 w-3" />
            <p>Credit facilities and backup systems</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MainGrid