"use client"

import { useState, useEffect, useCallback } from "react"
import type { SystemState, LogEntry } from "@/lib/types"
import { AuditLogger } from "@/lib/audit-logger"

export function useSystemData() {
  const [systemState, setSystemState] = useState<SystemState>({
    mode: "normal",
    nav: 1001325059,
    liquidity: 32,
    timestamp: new Date().toISOString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  const [auditLog, setAuditLog] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch system state
  const fetchSystemState = useCallback(async () => {
    try {
      const response = await fetch("/api/system")
      if (!response.ok) throw new Error("Failed to fetch system state")
      const data = await response.json()
      setSystemState(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }, [])

  // Fetch audit logs
  const fetchAuditLog = useCallback(async () => {
    try {
      const response = await fetch("/api/logs")
      if (!response.ok) throw new Error("Failed to fetch logs")
      const data = await response.json()
      setAuditLog(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }, [])

  // Enhanced crisis event handlers with audit logging
  const triggerCyberEvent = useCallback(async () => {
    try {
      const beforeState = { ...systemState }

      const response = await fetch("/api/crisis/cyber", { method: "POST" })
      if (!response.ok) throw new Error("Failed to trigger cyber event")
      const data = await response.json()

      setSystemState(data.systemState)
      setAuditLog((prev) => [data.logEntry, ...prev])

      // Log the system change
      await AuditLogger.logSystemChange(
        "system-state",
        "Crisis Event Triggered - Cyber",
        beforeState,
        data.systemState,
        "admin",
      )

      // Log governance action
      await AuditLogger.logGovernanceAction(
        "override",
        "Emergency Cyber Protocol Activation",
        "System Administrator",
        "Cyber security event detected - emergency protocols activated",
        ["admin", "security-team"],
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }, [systemState])

  const triggerLiquidityFreeze = useCallback(async () => {
    try {
      const beforeState = { ...systemState }

      const response = await fetch("/api/crisis/liquidity", { method: "POST" })
      if (!response.ok) throw new Error("Failed to trigger liquidity freeze")
      const data = await response.json()

      setSystemState(data.systemState)
      setAuditLog((prev) => [data.logEntry, ...prev])

      // Log the system change
      await AuditLogger.logSystemChange(
        "system-state",
        "Crisis Event Triggered - Liquidity",
        beforeState,
        data.systemState,
        "admin",
      )

      // Log governance action
      await AuditLogger.logGovernanceAction(
        "override",
        "Emergency Liquidity Protocol Activation",
        "Risk Management",
        "Liquidity constraints detected - emergency protocols activated",
        ["admin", "risk-team"],
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }, [systemState])

  const resetToNormal = useCallback(async () => {
    try {
      const beforeState = { ...systemState }

      const response = await fetch("/api/crisis/reset", { method: "POST" })
      if (!response.ok) throw new Error("Failed to reset to normal")
      const data = await response.json()

      setSystemState(data.systemState)
      setAuditLog((prev) => [data.logEntry, ...prev])

      // Log the system change
      await AuditLogger.logSystemChange(
        "system-state",
        "System Reset to Normal Operations",
        beforeState,
        data.systemState,
        "admin",
      )

      // Log governance action
      await AuditLogger.logGovernanceAction(
        "approval",
        "Return to Normal Operations",
        "System Administrator",
        "Crisis resolved - returning to normal operational parameters",
        ["admin", "compliance-officer"],
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }, [systemState])

  // Initial data load
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      await Promise.all([fetchSystemState(), fetchAuditLog()])
      setLoading(false)
    }

    loadInitialData()
  }, [fetchSystemState, fetchAuditLog])

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(async () => {
      // Run simulation for normal mode
      if (systemState.mode === "normal") {
        try {
          await fetch("/api/simulation")
        } catch (err) {
          console.warn("Simulation update failed:", err)
        }
      }

      // Fetch latest state
      await fetchSystemState()
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [systemState.mode, fetchSystemState])

  return {
    systemState,
    auditLog,
    loading,
    error,
    actions: {
      triggerCyberEvent,
      triggerLiquidityFreeze,
      resetToNormal,
      refresh: () => Promise.all([fetchSystemState(), fetchAuditLog()]),
    },
  }
}
