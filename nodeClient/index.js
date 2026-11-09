const os = require("os");
const { io } = require("socket.io-client");

const SERVER_URL = "http://localhost:3000";
const CLIENT_TOKEN = "239rfaiskdfvq243EGa4q3wefsdad";
const UPDATE_INTERVAL = 1000;

const getMacAddress = () => {
  const interfaces = os.networkInterfaces();

  for (const networkInterface of Object.values(interfaces)) {
    const activeInterface = networkInterface?.find(
      (item) => !item.internal && item.mac && item.mac !== "00:00:00:00:00:00",
    );

    if (activeInterface) {
      return activeInterface.mac;
    }
  }

  throw new Error("Unable to find a valid MAC address");
};

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

const performanceLoadData = async () => {
  const cpus = os.cpus();

  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  const memUseage = Math.floor((usedMem / totalMem) * 100) / 100;

  const osType = os.type() === "Darwin" ? "Mac" : os.type();
  const upTime = os.uptime();

  const cpuType = cpus[0].model;
  const numCores = cpus.length;
  const cpuSpeed = cpus[0].speed;

  const cpuLoad = await getCpuLoad();

  return {
    macA: getMacAddress(),
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

const socket = io(SERVER_URL, {
  auth: {
    token: CLIENT_TOKEN,
  },
  reconnection: true,
});

let updateInterval;
let isSending = false;

const sendPerformanceData = async () => {
  if (isSending || !socket.connected) {
    return;
  }

  isSending = true;

  try {
    const data = await performanceLoadData();

    socket.emit("perfData", data);

    console.log(
      `Performance data sent. CPU: ${data.cpuLoad}% | RAM: ${Math.round(data.memUseage * 100)}%`,
    );
  } catch (error) {
    console.error("Failed to collect performance data:", error);
  } finally {
    isSending = false;
  }
};

socket.on("connect", () => {
  console.log(`Connected to server: ${socket.id}`);

  sendPerformanceData();

  updateInterval = setInterval(sendPerformanceData, UPDATE_INTERVAL);
});

socket.on("welcome", (message) => {
  console.log(message);
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log(`Disconnected from server: ${reason}`);

  clearInterval(updateInterval);
});
