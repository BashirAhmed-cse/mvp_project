"use client"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ScrollText, Clock, AlertTriangle, CheckCircle2, PauseCircle, Plus } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import toast from "react-hot-toast"

const GovernanceLogsCard = () => {
  const [logs, setLogs] = useState<any[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showForm, setShowForm] = useState(false)
  const [editingLog, setEditingLog] = useState<any>(null)
  const [formData, setFormData] = useState({ title: "", description: "", type: "normal", status: "active" })
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setShowForm(false)
        setEditingLog(null)
      }
    }
    if (showForm) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showForm])

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/governance")
      const data = await res.json()
      setLogs(data)
    } catch {
      toast.error("Failed to fetch logs")
    }
  }

  const formatDate = (dateStr: string | Date) => {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr
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

  const getLogIcon = (type: string) => {
    switch(type) {
      case "lender-pull": return <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      case "freeze": return <PauseCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      default: return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
    }
  }

  const getLogColor = (type: string) => {
    switch(type) {
      case "lender-pull": return "bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/30 text-amber-800 dark:text-amber-300"
      case "freeze": return "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30 text-blue-800 dark:text-blue-300"
      default: return "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800/30 text-green-800 dark:text-green-300"
    }
  }

  const handleSubmit = async () => {
    try {
      let res
      if (editingLog) {
        res = await fetch("/api/governance", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, id: editingLog._id })
        })
      } else {
        res = await fetch("/api/governance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        })
      }
      if (!res.ok) throw new Error("Save failed")
      await res.json()
      fetchLogs()
      toast.success(editingLog ? "Log updated" : "Log added")
      setShowForm(false)
      setEditingLog(null)
      setFormData({ title: "", description: "", type: "normal", status: "active" })
    } catch {
      toast.error("Failed to save log")
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
          <Button size="sm" onClick={() => { setEditingLog(null); setFormData({ title: "", description: "", type: "normal", status: "active" }); setShowForm(true) }}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Real-time audit trail of all system state changes</p>
      </CardHeader>

      <CardContent className="pt-5 p-0">
        {showForm && (
          <div ref={formRef} className="mb-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900/30 mx-5">
            <Input
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="mb-2"
            />
            <Input
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="mb-2"
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full mb-2 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700"
            >
              <option value="normal">Normal</option>
              <option value="lender-pull">Lender Pull</option>
              <option value="freeze">Freeze</option>
            </select>
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className="w-full mb-2 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            <Button onClick={handleSubmit} className="w-full">{editingLog ? "Update Log" : "Add Log"}</Button>
          </div>
        )}

        <div className="h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent px-5 pb-5 space-y-4">
          {logs.map((log, index) => (
            <div key={log._id} className="relative cursor-pointer" onClick={() => { setEditingLog(log); setFormData({ title: log.title, description: log.description, type: log.type, status: log.status }); setShowForm(true) }}>
              {index !== logs.length - 1 && <div className="absolute left-4 top-8 h-8 w-0.5 bg-gray-200 dark:bg-gray-700"></div>}
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
                  <div className="mt-2 flex justify-end">
                    <div className={`text-xs px-2 py-1 rounded-full ${log.status === "active" ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"}`}>
                      {log.status === "active" ? "Active" : "Completed"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last updated</span>
            <span>{formatDate(currentTime)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default GovernanceLogsCard
