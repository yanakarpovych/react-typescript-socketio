interface CPUProps {
  cpuLoad: number;
}

function CPU({ cpuLoad }: CPUProps) {
  const load = Math.min(100, Math.max(0, cpuLoad));

  return (
    <section className="monitor-card">
      <h3>CPU Usage</h3>

      <div className="monitor-value">{load}%</div>

      <div
        className="progress-track"
        role="progressbar"
        aria-label="CPU usage"
        aria-valuenow={load}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="progress-fill cpu-fill" style={{ width: `${load}%` }} />
      </div>
    </section>
  );
}

export default CPU;
