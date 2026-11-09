import { useEffect, useState } from "react";
import socket from "./socket";
import type { MachineData, PerformanceData, ConnectionStatus } from "./types";
import Widget from "./components/Widget";
import "./App.css";

function App() {
  const [machines, setMachines] = useState<Record<string, MachineData>>({});

  const [serverConnected, setServerConnected] = useState(false);

  useEffect(() => {
    const handleConnect = () => {
      setServerConnected(true);
    };

    const handleDisconnect = () => {
      setServerConnected(false);
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
      <header className="dashboard-header">
        <div>
          <h1>Performance Monitor</h1>
          <p>Real-time system monitoring</p>
        </div>

        <div className="server-status">
          <span
            className={`status-indicator ${
              serverConnected ? "online" : "offline"
            }`}
          />
          Server: {serverConnected ? "Connected" : "Disconnected"}
        </div>
      </header>

      <section className="dashboard">
        <div className="dashboard-title">
          <h2>Machines</h2>
          <span>{machineList.length} connected machines</span>
        </div>

        {machineList.length === 0 ? (
          <p className="empty-state">Waiting for performance data...</p>
        ) : (
          <div className="widgets-grid">
            {machineList.map((machine) => (
              <Widget key={machine.macA} machine={machine} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;
