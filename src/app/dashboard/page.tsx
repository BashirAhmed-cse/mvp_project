'use client';
import { useState, useEffect } from "react"

import { useRouter } from 'next/navigation';

import MainGrid from "@/components/MainGrid";
import SystemStatusCard from "@/components/SystemStatusCard";
import GovernanceLogsCard from "@/components/GovernanceLogsCard";
import AuditLogCard from "@/components/AuditLogCard";
import CrisisManagementDashboard from "@/components/CrisisManagementDashboard";


export default function Dashboard() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  
//   const router = useRouter();

// useEffect(() => {

//     const authStatus = localStorage.getItem('isAuthenticated');
//     if (!authStatus) {
//       router.push('/login');
//     } else {
//       setIsAuthenticated(true);
//       setIsLoading(false);
//     }
//   }, [router]);
  
  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }

  // if (!isAuthenticated) {
  //   return null;
  // }



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