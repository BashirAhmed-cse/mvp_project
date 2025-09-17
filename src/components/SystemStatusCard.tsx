"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { CheckCircle2, AlertCircle, Clock, FileText, Shield } from 'lucide-react'

const SystemStatusCard = () => {
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

  return (
    <div className="w-full  mb-8">
      {/* System Notes Card */}
      <Card className="rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-gray-800 dark:text-gray-200">System Notes</span>
            </CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="mb-5 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  All systems nominal; sleeves within 25–35%; Facility B on standby.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Last updated</span>
            </div>
            <span>{formatDate(currentTime)}</span>
          </div>
        </CardContent>
      </Card>

      
    </div>
  )
}

export default SystemStatusCard