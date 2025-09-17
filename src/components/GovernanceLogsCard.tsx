"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ScrollText, Clock, AlertTriangle, CheckCircle2, PauseCircle } from 'lucide-react'

const GovernanceLogsCard = () => {
  const [currentTime] = useState(new Date())

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    }).format(date)
  }

  // Sample log data - in a real app this would come from props or API
  const governanceLogs = [
    {
      id: 1,
      type: "lender-pull",
      title: "Lender Pull Event Active",
      description: "Facility A withdrawn, Facility B activated; tender gates on; queue capped at 19.9%.",
      timestamp: new Date(2025, 8, 18, 0, 32, 58),
      status: "active"
    },
    {
      id: 2,
      type: "normal",
      title: "Normal Operations",
      description: "System nominal; Facility B on standby.",
      timestamp: new Date(2025, 8, 18, 0, 32, 54),
      status: "completed"
    },
    {
      id: 3,
      type: "freeze",
      title: "Global Freeze Active",
      description: "Sleeve drawn to 26%; covenant holidays toggled; settlement delayed T+I.",
      timestamp: new Date(2025, 8, 18, 0, 32, 48),
      status: "active"
    }
  ]

  const getLogIcon = (type: string) => {
    switch(type) {
      case "lender-pull":
        return <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      case "freeze":
        return <PauseCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      default:
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
    }
  }

  const getLogColor = (type: string) => {
    switch(type) {
      case "lender-pull":
        return "bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30 text-amber-800 dark:text-amber-300"
      case "freeze":
        return "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30 text-blue-800 dark:text-blue-300"
      default:
        return "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800/30 text-green-800 dark:text-green-300"
    }
  }

  return (
    <Card className="mb-8 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/40 transition-colors">
              <ScrollText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-gray-800 dark:text-gray-200">Governance Logs</span>
          </CardTitle>
          <div className="flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>Live</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Real-time audit trail of all system state changes</p>
      </CardHeader>
      <CardContent className="pt-5 p-0">
        <div className="h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent px-5 pb-5">
          <div className="space-y-4">
            {governanceLogs.map((log, index) => (
              <div key={log.id} className="relative">
                {/* Timeline connector */}
                {index !== governanceLogs.length - 1 && (
                  <div className="absolute left-4 top-8 h-8 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                )}
                
                <div className="flex gap-3">
                  <div className="flex flex-col items-center mt-1">
                    <div className="p-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm z-10">
                      {getLogIcon(log.type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`p-3 rounded-lg border ${getLogColor(log.type)}`}>
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-sm mb-1">{log.title}</h3>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(log.timestamp)}</span>
                        </div>
                      </div>
                      <p className="text-xs mt-2 opacity-90">{log.description}</p>
                    </div>
                    
                    {/* Status badge */}
                    <div className="mt-2 flex justify-end">
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        log.status === "active" 
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" 
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}>
                        {log.status === "active" ? "Active" : "Completed"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>Last updated</span>
            </div>
            <span>{formatDate(currentTime)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default GovernanceLogsCard