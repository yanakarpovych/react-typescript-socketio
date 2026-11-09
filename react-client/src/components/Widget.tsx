import type { MachineData } from "../types";
import CPU from "./CPU";
import RAM from "./RAM";
import Info from "./Info";

interface WidgetProps {
  machine: MachineData;
}

function Widget({ machine }: WidgetProps) {
  return (
    <article className="widget">
      <header className="widget-header">
        <div>
          <h2>{machine.cpuType}</h2>
          <span>{machine.macA}</span>
        </div>

        <span className={`status ${machine.isAlive ? "online" : "offline"}`}>
          {machine.isAlive ? "Online" : "Offline"}
        </span>
      </header>

      <div className="widget-monitoring">
        <CPU cpuLoad={machine.cpuLoad} />

        <RAM
          usedMem={machine.usedMem}
          totalMem={machine.totalMem}
          memUseage={machine.memUseage}
        />
      </div>

      <Info machine={machine} />
    </article>
  );
}

export default Widget;
