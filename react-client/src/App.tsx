import { useEffect, useState } from "react";
import socket from "./socket";
import type { MachineData, PerformanceData, ConnectionStatus } from "./types";
import "./App.css";

function App() {
  const [machines, setMachines] = useState<Record<string, MachineData>>({});

  const [serverConnected, setServerConnected] = useState(false);

  useEffect(() => {
    const handleConnect = () => {
      setServerConnected(true);
      console.log("Connected to Socket.IO server");
    };

    const handleDisconnect = () => {
      setServerConnected(false);
      console.log("Disconnected from Socket.IO server");
    };

    const handleConnectError = (error: Error) => {
      console.error("Connection error:", error.message);
    };

    const handlePerformanceData = (data: PerformanceData) => {
      setMachines((currentMachines) => ({
        ...currentMachines,
        [data.macA]: {
          ...data,
          isAlive: true,
        },
      }));
    };

    const handleConnectionStatus = ({
      machineMacA,
      isAlive,
    }: ConnectionStatus) => {
      setMachines((currentMachines) => {
        const machine = currentMachines[machineMacA];

        if (!machine) {
          return currentMachines;
        }

        return {
          ...currentMachines,
          [machineMacA]: {
            ...machine,
            isAlive,
          },
        };
      });
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("perfData", handlePerformanceData);
    socket.on("connectedOrNot", handleConnectionStatus);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("perfData", handlePerformanceData);
      socket.off("connectedOrNot", handleConnectionStatus);
    };
  }, []);

  const machineList = Object.values(machines);

  return (
    <main className="app">
      <h1>Performance Monitor</h1>

      <div className="server-status">
        Server status:{" "}
        <strong>{serverConnected ? "Connected" : "Disconnected"}</strong>
      </div>

      <h2>Connected machines: {machineList.length}</h2>

      {machineList.length === 0 ? (
        <p>Waiting for performance data...</p>
      ) : (
        <div className="machines">
          {machineList.map((machine) => (
            <section className="machine" key={machine.macA}>
              <h3>{machine.cpuType}</h3>

              <p>
                Status:{" "}
                <strong>{machine.isAlive ? "Online" : "Offline"}</strong>
              </p>

              <p>MAC address: {machine.macA}</p>
              <p>Operating system: {machine.osType}</p>
              <p>CPU cores: {machine.numCores}</p>
              <p>CPU speed: {machine.cpuSpeed} MHz</p>
              <p>CPU load: {machine.cpuLoad}%</p>
              <p>RAM usage: {Math.round(machine.memUseage * 100)}%</p>
              <p>Used RAM: {(machine.usedMem / 1024 ** 3).toFixed(2)} GB</p>
              <p>Total RAM: {(machine.totalMem / 1024 ** 3).toFixed(2)} GB</p>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

export default App;
