"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { FileText, CheckCircle2, Clock, AlertCircle, PauseCircle } from 'lucide-react'

const AuditLogCard = () => {
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

  // Sample audit log data
  const auditLogs = [
    {
      id: 1,
      type: "lender-pull",
      title: "Lender Pull Event Active",
      description: "Facility A withdrawn, Facility B activated; tender gates on; queue capped at 19.9%.",
      timestamp: new Date(2025, 8, 18, 0, 32, 58),
      status: "pending",
      completed: false
    },
    {
      id: 2,
      type: "normal",
      title: "Normal Operations",
      description: "System nominal; Facility B on standby.",
      timestamp: new Date(2025, 8, 18, 0, 32, 54),
      status: "pending",
      completed: false
    },
    {
      id: 3,
      type: "freeze",
      title: "Global Freeze Active",
      description: "Sleeve drawn to 26%; covenant holidays toggled; settlement delayed T+I.",
      timestamp: new Date(2025, 8, 18, 0, 32, 48),
      status: "completed",
      completed: true
    }
  ]

  const getLogIcon = (type: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
    }
    
    switch(type) {
      case "lender-pull":
        return <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      case "freeze":
        return <PauseCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      default:
        return <CheckCircle2 className="h-4 w-4 text-gray-400 dark:text-gray-500" />
    }
  }

  const getStatusColor = (completed: boolean) => {
    return completed 
      ? "text-green-600 dark:text-green-400" 
      : "text-gray-400 dark:text-gray-500"
  }

  const getStatusText = (completed: boolean) => {
    return completed ? "Completed" : "Pending"
  }

  return (
    <Card className="mb-8 rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/40 transition-colors">
              <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="text-gray-800 dark:text-gray-200">Audit Log</span>
          </CardTitle>
          <div className="flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>1/3 Completed</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Complete system event history</p>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="space-y-4">
          {auditLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors">
              {/* Custom checkbox */}
              <div className="flex items-center justify-center mt-0.5">
                <div className={`relative h-5 w-5 rounded-full border-2 ${log.completed ? 'border-green-500 bg-green-500' : 'border-gray-300 dark:border-gray-600'} transition-colors`}>
                  {log.completed && (
                    <CheckCircle2 className="h-4 w-4 text-white absolute inset-0 m-auto" />
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getLogIcon(log.type, log.completed)}
                    <h3 className={`font-medium text-sm ${log.completed ? 'text-gray-700 dark:text-gray-300 line-through' : 'text-gray-800 dark:text-gray-200'}`}>
                      {log.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(log.timestamp)}</span>
                  </div>
                </div>
                
                <p className={`text-xs mt-2 ${log.completed ? 'text-gray-500 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>
                  {log.description}
                </p>
                
                {/* Status badge */}
                <div className="mt-2">
                  <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${
                    log.completed 
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" 
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                  }`}>
                    <div className={`h-2 w-2 rounded-full ${log.completed ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    {getStatusText(log.completed)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
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

export default AuditLogCard