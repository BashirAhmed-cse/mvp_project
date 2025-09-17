"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { AlertTriangle, Download, Network, Lock, RefreshCw, Shield, X, FileText, Send, Clock } from 'lucide-react'

const CrisisManagementControls = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState("")

  const handleActionClick = (action: string) => {
    setSelectedAction(action)
    setIsLoading(action)
    
    // Simulate action processing
    setTimeout(() => {
      setIsLoading(null)
      if (action === "lender-pull" || action === "cyber-event" || action === "liquidity-freeze") {
        setModalOpen(true)
      }
    }, 2000)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedAction("")
  }

  const crisisActions = [
    { 
      id: "lender-pull", 
      title: "Trigger Lender Pull", 
      icon: <Download className="h-5 w-5" />,
      description: "Activate emergency withdrawal protocols",
      color: "bg-amber-500"
    },
    { 
      id: "cyber-event", 
      title: "Trigger Cyber Event", 
      icon: <Network className="h-5 w-5" />,
      description: "Initiate cyber attack response protocols",
      color: "bg-red-500"
    },
    { 
      id: "liquidity-freeze", 
      title: "Trigger Liquidity Freeze", 
      icon: <Lock className="h-5 w-5" />,
      description: "Freeze all liquidity movements",
      color: "bg-blue-500"
    },
  ]

  const resetAction = {
    id: "reset",
    title: "Reset to Normal Operations",
    icon: <RefreshCw className="h-5 w-5" />,
    description: "Restore all systems to normal operation",
    color: "bg-green-500"
  }

  const ProofPackModal = () => {
    if (!modalOpen) return null

    // Determine theme based on selected action
    let modalTheme = "blue" // Default for liquidity freeze
    if (selectedAction === "cyber-event") modalTheme = "red"
    if (selectedAction === "lender-pull") modalTheme = "amber"
    
    const themeColors = {
      red: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-800 dark:text-red-300",
        border: "border-red-200 dark:border-red-800/30",
        icon: "text-red-600 dark:text-red-400",
        button: "bg-red-600 hover:bg-red-700",
        title: "Cyber Event Snapshot"
      },
      amber: {
        bg: "bg-amber-100 dark:bg-amber-900/30",
        text: "text-amber-800 dark:text-amber-300",
        border: "border-amber-200 dark:border-amber-800/30",
        icon: "text-amber-600 dark:text-amber-400",
        button: "bg-amber-600 hover:bg-amber-700",
        title: "Lender Facility Pull Snapshot"
      },
      blue: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-800 dark:text-blue-300",
        border: "border-blue-200 dark:border-blue-800/30",
        icon: "text-blue-600 dark:text-blue-400",
        button: "bg-blue-600 hover:bg-blue-700",
        title: "Liquidity Freeze Snapshot"
      }
    }

    const colors = themeColors[modalTheme]

    // Sample data for liquidity freeze
    const liquidityFreezeData = {
      documentId: "ROS-36287451",
      timestamp: "2025-09-17T18:08:13.213Z",
      nav: "$973,000,000",
      liquidity: "28%",
      governanceAction: "All transfers frozen; redemption queue activated; emergency protocols engaged",
      systemNotes: "Complete liquidity preservation; covenant protections invoked; settlement paused",
      generated: "9/18/2025, 1:15:42 AM"
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className={`sticky top-0 bg-white dark:bg-gray-900 border-b ${colors.border} p-4 flex items-center justify-between`}>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Official Proof Pack</h2>
            <button 
              onClick={closeModal}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-6 text-center">
              <div className={`inline-flex items-center justify-center p-3 rounded-full ${colors.bg} mb-3`}>
                <FileText className={`h-8 w-8 ${colors.icon}`} />
              </div>
              <p className="text-sm text-muted-foreground">Regulatory Compliance Snapshot</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs text-muted-foreground mb-1">Document ID</p>
                <p className="font-mono text-sm font-medium">{liquidityFreezeData.documentId}</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs text-muted-foreground mb-1">SCENARIO TYPE</p>
                <p className="text-sm font-medium">{colors.title}</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 mb-4">
              <p className="text-xs text-muted-foreground mb-1">TIMESTAMP (UTC)</p>
              <p className="text-sm font-medium">{liquidityFreezeData.timestamp}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30">
                <p className="text-xs text-muted-foreground mb-1">NET ASSET VALUE</p>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{liquidityFreezeData.nav}</p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30">
                <p className="text-xs text-muted-foreground mb-1">LIQUIDITY SLEEVE</p>
                <p className="text-lg font-bold text-green-700 dark:text-green-300">{liquidityFreezeData.liquidity}</p>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border} mb-4`}>
              <p className="text-xs text-muted-foreground mb-1">GOVERNANCE ACTION</p>
              <p className={`text-sm font-medium ${colors.text}`}>
                {liquidityFreezeData.governanceAction}
              </p>
            </div>

            <div className={`p-4 rounded-lg ${colors.bg} border ${colors.border} mb-4`}>
              <p className="text-xs text-muted-foreground mb-1">SYSTEM NOTES</p>
              <p className={`text-sm font-medium ${colors.text}`}>
                {liquidityFreezeData.systemNotes}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 mb-6">
              <p className="text-xs text-muted-foreground mb-1">COMPLIANCE FRAMEWORK</p>
              <p className="text-sm font-medium">Basel III / NIST aligned</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 ${colors.button} text-white rounded-lg transition-colors`}>
                <Download className="h-4 w-4" />
                Download JSON/ZIP
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                <Send className="h-4 w-4" />
                Send to Regulator
              </button>
            </div>

            <div className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Generated: {liquidityFreezeData.generated}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Card className="rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-gray-800 dark:text-gray-200">Crisis Management Controls</span>
            </CardTitle>
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Trigger emergency protocols and stress test scenarios</p>
        </CardHeader>
        
        <CardContent className="pt-5">
          {/* Crisis Actions */}
          <div className="space-y-3 mb-4">
            {crisisActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleActionClick(action.id)}
                disabled={isLoading !== null}
                className="w-full p-4 rounded-xl border border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 group flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className={`p-3 rounded-full ${action.color} text-white group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-red-800 dark:text-red-300">{action.title}</h3>
                  <p className="text-xs text-red-600 dark:text-red-400/80">{action.description}</p>
                </div>
                {isLoading === action.id ? (
                  <div className="h-5 w-5 border-2 border-red-600 dark:border-red-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <div className="h-2 w-2 rounded-full bg-red-600 dark:bg-red-400"></div>
                )}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white dark:bg-gray-900 text-xs text-muted-foreground">Recovery</span>
            </div>
          </div>

          {/* Reset Action */}
          <button
            onClick={() => handleActionClick(resetAction.id)}
            disabled={isLoading !== null}
            className="w-full p-4 rounded-xl border border-green-200 dark:border-green-800/30 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200 group flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className={`p-3 rounded-full ${resetAction.color} text-white group-hover:scale-110 transition-transform`}>
              {resetAction.icon}
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-medium text-green-800 dark:text-green-300">{resetAction.title}</h3>
              <p className="text-xs text-green-600 dark:text-green-400/80">{resetAction.description}</p>
            </div>
            {isLoading === resetAction.id ? (
              <div className="h-5 w-5 border-2 border-green-600 dark:border-green-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-400"></div>
            )}
          </button>

          {/* Security Notice */}
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3" />
              <p>All actions require multi-signature confirmation</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProofPackModal />
    </>
  )
}

export default CrisisManagementControls