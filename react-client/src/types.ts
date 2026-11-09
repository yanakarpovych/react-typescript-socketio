export interface PerformanceData {
  macA: string;
  freeMem: number;
  totalMem: number;
  usedMem: number;
  memUseage: number;
  osType: string;
  upTime: number;
  cpuType: string;
  numCores: number;
  cpuSpeed: number;
  cpuLoad: number;
}

export interface MachineData extends PerformanceData {
  isAlive: boolean;
}

export interface ConnectionStatus {
  machineMacA: string;
  isAlive: boolean;
}
