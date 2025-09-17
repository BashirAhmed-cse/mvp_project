import MainGrid from "@/components/MainGrid";


import SystemStatusCard from "@/components/SystemStatusCard";
import GovernanceLogsCard from "@/components/GovernanceLogsCard";
import AuditLogCard from "@/components/AuditLogCard";
import CrisisManagementDashboard from "@/components/CrisisManagementDashboard";

export default function Dashboard() {
  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
        
        <MainGrid />
        <SystemStatusCard/>
        <GovernanceLogsCard/>
      <AuditLogCard/>
      <CrisisManagementDashboard/>
      </div>
    </div>
  );
}