

const os = require('os');

// Calculate average CPU time across all logical cores
const cpuAverage = () => {
  const cpus = os.cpus();

  let idle = 0;
  let total = 0;

  cpus.forEach((core) => {
    for (const mode in core.times) {
      total += core.times[mode];
    }

    idle += core.times.idle;
  });

  return {
    idle: idle / cpus.length,
    total: total / cpus.length,
  };
};

// Calculate current CPU usage over a 100ms interval
const getCpuLoad = () =>
  new Promise((resolve) => {
    const start = cpuAverage();

    setTimeout(() => {
      const end = cpuAverage();

      const idleDiff = end.idle - start.idle;
      const totalDiff = end.total - start.total;

      if (totalDiff === 0) {
        resolve(0);
        return;
      }

      const cpuLoad = 100 - Math.floor((100 * idleDiff) / totalDiff);

      resolve(cpuLoad);
    }, 100);
  });

// Collect system performance data
const performanceLoadData = async () => {
  const cpus = os.cpus();

  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  const memUseage = Math.floor((usedMem / totalMem) * 100) / 100;

  const osType = os.type() === 'Darwin' ? 'Mac' : os.type();
  const upTime = os.uptime();

  const cpuType = cpus[0].model;
  const numCores = cpus.length;
  const cpuSpeed = cpus[0].speed;

  const cpuLoad = await getCpuLoad();

  return {
    freeMem,
    totalMem,
    usedMem,
    memUseage,
    osType,
    upTime,
    cpuType,
    numCores,
    cpuSpeed,
    cpuLoad,
  };
};

// Run the client and display collected data
const run = async () => {
  try {
    const data = await performanceLoadData();

    console.log('System Performance Data:');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to collect system performance data:', error);
  }
};

run();
