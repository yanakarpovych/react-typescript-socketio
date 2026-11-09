
interface RAMProps {
  usedMem: number;
  totalMem: number;
  memUseage: number;
}

function RAM({ usedMem, totalMem, memUseage }: RAMProps) {
  const usage = Math.min(
    100,
    Math.max(0, Math.round(memUseage * 100))
  );

  const usedGB = (usedMem / 1024 ** 3).toFixed(2);
  const totalGB = (totalMem / 1024 ** 3).toFixed(2);

  return (
    <section className="monitor-card">
      <h3>RAM Usage</h3>

      <div className="monitor-value">
        {usage}%
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-label="RAM usage"
        aria-valuenow={usage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="progress-fill ram-fill"
          style={{ width: `${usage}%` }}
        />
      </div>

      <p className="memory-details">
        {usedGB} GB / {totalGB} GB
      </p>
    </section>
  );
}

export default RAM;
