"use client"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { FileText, CheckCircle2, Clock, AlertCircle, PauseCircle, Plus } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import toast from "react-hot-toast"

interface AuditLog {
  _id: string
  type: string
  title: string
  description: string
  timestamp: string
  completed: boolean
}

const AuditLogCard = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showForm, setShowForm] = useState(false)
  const [editingLog, setEditingLog] = useState<AuditLog | null>(null)
  const [formData, setFormData] = useState({ title: "", description: "", type: "normal" })
  const formRef = useRef<HTMLDivElement>(null) // ref for click outside

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Close form when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowForm(false)
        setEditingLog(null)
      }
    }
    if (showForm) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showForm])

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/audit")
      const data = await res.json()
      setAuditLogs(data)
    } catch {
      toast.error("Failed to fetch audit logs")
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

  const getLogIcon = (type: string, completed: boolean) => {
    if (completed) return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
    switch(type) {
      case "lender-pull": return <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      case "freeze": return <PauseCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      default: return <CheckCircle2 className="h-4 w-4 text-gray-400 dark:text-gray-500" />
    }
  }

  const getStatusText = (completed: boolean) => completed ? "Completed" : "Pending"

  const handleSubmit = async () => {
    try {
      let res
      if (editingLog) {
        res = await fetch(`/api/audit/${editingLog._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        })
      } else {
        res = await fetch("/api/audit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        })
      }
      if (!res.ok) throw new Error("Save failed")
      await res.json()
      fetchLogs()
      toast.success(editingLog ? "Audit event updated" : "Audit event added")
      setEditingLog(null)
      setFormData({ title: "", description: "", type: "normal" })
      setShowForm(false)
    } catch {
      toast.error("Failed to save audit event")
    }
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

          {/* Add Button */}
          <Button size="sm" onClick={() => { setEditingLog(null); setFormData({ title: "", description: "", type: "normal" }); setShowForm(true) }}>
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">Complete system event history</p>
      </CardHeader>

      <CardContent className="pt-5">
        {/* Add / Update Form */}
        {showForm && (
          <div ref={formRef} className="mb-4 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900/30">
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
            <Button onClick={handleSubmit} className="w-full">
              {editingLog ? "Update Audit Event" : "Add Audit Event"}
            </Button>
          </div>
        )}

        {/* Audit Logs */}
        <div className="space-y-4">
          {auditLogs.map((log) => (
            <div 
              key={log._id} 
              className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/70 transition-colors cursor-pointer"
              onClick={() => { setEditingLog(log); setFormData({ title: log.title, description: log.description, type: log.type }); setShowForm(true) }}
            >
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

              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last updated</span>
            <span>{formatDate(currentTime)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AuditLogCard
