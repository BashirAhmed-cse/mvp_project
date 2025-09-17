// components/ChartsSection.tsx
"use client"
import { BarChart3, PieChart, Download } from 'lucide-react'

const ChartsSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            NAV Performance
          </h2>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
        <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <BarChart3 className="h-12 w-12 mx-auto mb-2" />
            <p>Performance chart will be shown here</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Liquidity Distribution
          </h2>
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
        <div className="h-64 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <PieChart className="h-12 w-12 mx-auto mb-2" />
            <p>Distribution chart will be shown here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChartsSection