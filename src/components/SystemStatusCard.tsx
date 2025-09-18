"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { CheckCircle2, Clock, FileText, Edit, Plus } from 'lucide-react'

interface SystemState {
  _id?: string
  title: string
  description: string
  status: "nominal" | "warning" | "critical"
  timestamp?: string
}

const SystemStatusCard = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [systemStates, setSystemStates] = useState<SystemState[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newFormVisible, setNewFormVisible] = useState(false)
  const formRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [formData, setFormData] = useState<SystemState>({ title: "", description: "", status: "nominal" })

  // Clock
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Fetch all system states
  useEffect(() => {
    fetchSystemStates()
  }, [])

  const fetchSystemStates = async () => {
    try {
      const res = await fetch("/api/system-state")
      if (!res.ok) throw new Error("Failed to fetch system states")
      const data = await res.json()
      setSystemStates(Array.isArray(data) ? data : [data])
    } catch (err) {
      console.error(err)
    }
  }

  // Close forms when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      for (const key in formRefs.current) {
        const ref = formRefs.current[key]
        if (ref && !ref.contains(e.target as Node)) {
          setEditingId(null)
          setNewFormVisible(false)
          setFormData({ title: "", description: "", status: "nominal" })
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Add or Update system state
  const handleSubmit = async (e: React.FormEvent, state?: SystemState) => {
    e.preventDefault()
    try {
      const isUpdate = !!state?._id
      const method = isUpdate ? "PUT" : "POST"
      const body = isUpdate ? JSON.stringify(state) : JSON.stringify(formData)

      const res = await fetch("/api/system-state", {
        method,
        headers: { "Content-Type": "application/json" },
        body
      })
      if (!res.ok) throw new Error("Failed to save")
      fetchSystemStates()
      setEditingId(null)
      setNewFormVisible(false)
      setFormData({ title: "", description: "", status: "nominal" })
    } catch (err) {
      console.error(err)
    }
  }

  const formatDate = (date?: string | Date) =>
    date ? new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    }).format(new Date(date)) : "-"

  const handleEditClick = (state: SystemState) => {
    setEditingId(state._id || null)
    setFormData({ title: state.title, description: state.description, status: state.status })
  }

  return (
    <div className="w-full mb-8 space-y-4">
      {/* Existing System States */}
      {systemStates.map((state) => (
        <Card key={state._id} className="rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="pb-3 border-b flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-gray-800 dark:text-gray-200">{state.title}</span>
            </CardTitle>
            <div className="flex gap-2">
              <button onClick={() => handleEditClick(state)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                <Edit className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            {editingId === state._id ? (
              <div ref={(el) => (formRefs.current[state._id!] = el)} className="mb-5 p-3 rounded-lg border bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700">
                <form onSubmit={(e) => handleSubmit(e, state)} className="space-y-3">
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                  <textarea
                    className="w-full px-3 py-2 border rounded"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                  <select
                    className="w-full px-3 py-2 border rounded"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as SystemState["status"] })}
                  >
                    <option value="nominal">Nominal</option>
                    <option value="warning">Warning</option>
                    <option value="critical">Critical</option>
                  </select>
                  <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Update</button>
                </form>
              </div>
            ) : (
              <div className="mb-5 p-3 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium text-green-800 dark:text-green-300">{state.description}</p>
                </div>
                <div className="flex items-center justify-end text-xs text-muted-foreground mt-2">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(state.timestamp)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Add New System State */}
      {newFormVisible ? (
        <Card ref={(el) => (formRefs.current["new"] = el)} className="rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardHeader className="pb-3 border-b flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition-colors">
                <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-gray-800 dark:text-gray-200">Add New System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <textarea
                className="w-full px-3 py-2 border rounded"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
              <select
                className="w-full px-3 py-2 border rounded"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as SystemState["status"] })}
              >
                <option value="nominal">Nominal</option>
                <option value="warning">Warning</option>
                <option value="critical">Critical</option>
              </select>
              <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <button
          onClick={() => setNewFormVisible(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
        >
          <Plus className="h-4 w-4" /> Add New System Status
        </button>
      )}
    </div>
  )
}

export default SystemStatusCard
