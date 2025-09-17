// components/RecentActivity.tsx
"use client"
import { Activity, Clock, AlertTriangle, CheckCircle } from 'lucide-react'

const RecentActivity = () => {
  const activities = [
    { 
      time: "2 min ago", 
      action: "Liquidity adjustment", 
      system: "Trading", 
      status: "completed",
      icon: CheckCircle,
      color: "text-green-500"
    },
    { 
      time: "5 min ago", 
      action: "NAV calculation", 
      system: "Reporting", 
      status: "completed",
      icon: CheckCircle,
      color: "text-green-500"
    },
    { 
      time: "10 min ago", 
      action: "Security audit", 
      system: "Security", 
      status: "in progress",
      icon: Activity,
      color: "text-blue-500"
    },
    { 
      time: "15 min ago", 
      action: "Backup initiated", 
      system: "Backup", 
      status: "completed",
      icon: CheckCircle,
      color: "text-green-500"
    },
    { 
      time: "30 min ago", 
      action: "System check", 
      system: "All", 
      status: "completed",
      icon: CheckCircle,
      color: "text-green-500"
    }
  ]
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </h2>
        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View all</button>
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const IconComponent = activity.icon;
          return (
            <div key={index} className="flex items-start">
              <div className={`h-2 w-2 rounded-full mt-2 mr-3 ${activity.color}`}></div>
              <IconComponent className={`h-4 w-4 mt-2 mr-3 ${activity.color}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{activity.system} • {activity.status}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecentActivity