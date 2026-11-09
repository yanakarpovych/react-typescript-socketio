import type { MachineData } from "../types";

interface InfoProps {
  machine: MachineData;
}

const formatUptime = (seconds: number) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${days}d ${hours}h ${minutes}m`;
};

function Info({ machine }: InfoProps) {
  return (
    <section className="machine-info">
      <h3>System Information</h3>

      <dl>
        <div>
          <dt>Operating System</dt>
          <dd>{machine.osType}</dd>
        </div>

        <div>
          <dt>CPU Cores</dt>
          <dd>{machine.numCores}</dd>
        </div>

        <div>
          <dt>CPU Speed</dt>
          <dd>{machine.cpuSpeed} MHz</dd>
        </div>

        <div>
          <dt>System Uptime</dt>
          <dd>{formatUptime(machine.upTime)}</dd>
        </div>

        <div>
          <dt>Total Memory</dt>
          <dd>{(machine.totalMem / 1024 ** 3).toFixed(2)} GB</dd>
        </div>
      </dl>
    </section>
  );
}

export default Info;
