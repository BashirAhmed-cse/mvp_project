"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Shield, TrendingUp, Building2, Droplets } from "lucide-react";
import { runMPCOperation } from "../lib/connectors/mpc";
import { verifyUserKYC } from "../lib/connectors/kyc";
import useSWR from "swr";

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const data = await response.json();
  if (!Array.isArray(data)) return [];
  return data.map((state: SystemState) => ({
    mode: state.mode || "normal",
    nav: typeof state.nav === "number" && !isNaN(state.nav) ? state.nav : 1000000,
    liquidity: typeof state.liquidity === "number" && !isNaN(state.liquidity) ? state.liquidity : 50,
    timestamp: state.timestamp || new Date().toISOString(),
  }));
};

interface SystemState {
  mode: string;
  nav: number;
  liquidity: number;
  timestamp: string;
}
interface AuditLogEntry {
  id: string;
  type: string;
  event: string;
  timestamp: string;
}
interface GovernanceLogEntry {
  id: string;
  event: string;
  timestamp: string;
}
interface Facility {
  id: string;
  name: string;
  status: string;
}

const MainGrid = () => {
  const { data: systemStates, mutate: mutateState } = useSWR<SystemState[]>("/api/system-state", fetcher, { refreshInterval: 1000 });
  const { data: auditLog = [], mutate: mutateAudit } = useSWR<AuditLogEntry[]>("/api/audit", fetcher);
  const { data: governanceLog = [], mutate: mutateGov } = useSWR<GovernanceLogEntry[]>("/api/governance", fetcher);

  const defaultState: SystemState = { mode: "normal", nav: 1000000, liquidity: 50, timestamp: new Date().toISOString() };
  const latestState: SystemState = systemStates && systemStates.length > 0 && systemStates[0].liquidity !== undefined
    ? systemStates[0]
    : defaultState;

  const [facilities] = useState<Facility[]>([
    { id: "1", name: "Facility A", status: "active" },
    { id: "2", name: "Facility B", status: "standby" },
  ]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(amount);

  const triggerCrisis = async (type: "cyber" | "freeze") => {
    const navMultiplier = type === "cyber" ? 0.8 : 0.9;
    const liquidityMultiplier = type === "cyber" ? 0.5 : 0.3;

    try {
      await fetch("/api/system-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: type,
          nav: latestState.nav * navMultiplier,
          liquidity: latestState.liquidity * liquidityMultiplier,
        }),
      });

      await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "crisis",
          event: type === "cyber" ? "Cyber Crisis" : "Liquidity Freeze",
        }),
      });

      const mpcResult = await runMPCOperation(`${type} NAV Adjustment`);
      const kycResult = type === "cyber" ? await verifyUserKYC("user-123") : null;

      await fetch("/api/governance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: `MPC: ${mpcResult.status}, KYC: ${kycResult?.verified || "N/A"}`,
        }),
      });

      mutateState();
      mutateAudit();
      mutateGov();
    } catch (error) {
      console.error("Error triggering crisis:", error);
    }
  };

  const resetSystem = async () => {
    try {
      await fetch("/api/system-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "normal", nav: 1000000, liquidity: 50 }),
      });
      await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "reset", event: "System reset" }),
      });
      await fetch("/api/governance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "Reset executed" }),
      });

      mutateState();
      mutateAudit();
      mutateGov();
    } catch (error) {
      console.error("Error resetting system:", error);
    }
  };

  const modeStyles = () => {
    switch (latestState.mode) {
      case "cyber":
        return { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-600 dark:text-red-400" };
      case "freeze":
        return { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-600 dark:text-blue-400" };
      case "liquidity":
        return { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-600 dark:text-amber-400" };
      default:
        return { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-600 dark:text-green-400" };
    }
  };

  const styles = modeStyles();

  const getLiquidityPercentage = () => {
    const liquidity = latestState.liquidity;
    return typeof liquidity === "number" && !isNaN(liquidity) ? liquidity.toFixed(1) : "0.0";
  };

  const getLiquidityColorClasses = () => {
    const liquidity = typeof latestState.liquidity === "number" && !isNaN(latestState.liquidity) ? latestState.liquidity : 0;
    if (liquidity > 30) {
      return {
        bg: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        text: "text-green-600 dark:text-green-400",
      };
    } else if (liquidity > 15) {
      return {
        bg: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
        text: "text-amber-600 dark:text-amber-400",
      };
    } else {
      return {
        bg: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        text: "text-red-600 dark:text-red-400",
      };
    }
  };

  const liquidityColors = getLiquidityColorClasses();

  const getLogKey = (log: any, index: number) => {
    return log.id || `${log.event}-${log.timestamp}-${index}`;
  };

  if (!systemStates) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="rounded-xl border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" /> Total NAV
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(latestState.nav)}</div>
          <p className="text-xs text-muted-foreground mt-1">Net Asset Value</p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Droplets className="h-4 w-4 text-green-600 dark:text-green-400" /> Liquidity Sleeve
          </CardTitle>
          <div className={`text-xs px-2 py-1 rounded-full ${liquidityColors.bg}`}>
            {getLiquidityPercentage()}%
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${liquidityColors.text}`}>
            {getLiquidityPercentage()}%
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Shield className={`h-4 w-4 ${styles.text}`} /> Governance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-2 flex-wrap">
            <button onClick={() => triggerCrisis("cyber")} className="px-3 py-1 bg-red-600 text-white rounded text-xs">
              Trigger Cyber
            </button>
            <button onClick={() => triggerCrisis("freeze")} className="px-3 py-1 bg-blue-600 text-white rounded text-xs">
              Liquidity Freeze
            </button>
            <button onClick={resetSystem} className="px-3 py-1 bg-green-600 text-white rounded text-xs">
              Reset
            </button>
          </div>
          <p className={`text-sm ${styles.text}`}>Mode: {latestState.mode}</p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" /> Facilities Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {facilities.map((f) => (
            <div key={f.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{f.name}</span>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  f.status === "active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                }`}
              >
                {f.status}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-xl border shadow-sm col-span-1 md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-base">Audit Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 max-h-40 overflow-y-auto">
          {auditLog && auditLog.length > 0 ? (
            auditLog.map((log, index) => (
              <div key={getLogKey(log, index)} className="flex justify-between text-xs border-b py-1">
                <span>{log.event}</span>
                <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))
          ) : (
            <div className="text-xs text-muted-foreground py-2 text-center">No audit logs available</div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl border shadow-sm col-span-1 md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-base">Governance Log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 max-h-40 overflow-y-auto">
          {governanceLog && governanceLog.length > 0 ? (
            governanceLog.map((log, index) => (
              <div key={getLogKey(log, index)} className="flex justify-between text-xs border-b py-1">
                <span>{log.event}</span>
                <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
              </div>
            ))
          ) : (
            <div className="text-xs text-muted-foreground py-2 text-center">No governance logs available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MainGrid;