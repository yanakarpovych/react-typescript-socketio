const os = require("os");
const { performance } = require("perf_hooks");
const { io } = require("socket.io-client");

const SERVER_URL = process.env.SERVER_URL;
const NODE_CLIENT_TOKEN = process.env.NODE_CLIENT_TOKEN;

if (!SERVER_URL) {
  throw new Error("SERVER_URL environment variable is required");
}

if (!NODE_CLIENT_TOKEN) {
  throw new Error("NODE_CLIENT_TOKEN environment variable is required");
}

function getMacAddress() {
  const interfaces = os.networkInterfaces();

  for (const interfaceName of Object.keys(interfaces)) {
    const networkInterface = interfaces[interfaceName];

    for (const details of networkInterface || []) {
      if (!details.internal && details.mac !== "00:00:00:00:00:00") {
        return details.mac;
      }
    }
  }

  return "";
}

function getCpuUsage(previousCpus, currentCpus) {
  let totalIdle = 0;
  let totalTick = 0;

  for (let i = 0; i < currentCpus.length; i++) {
    const previousTimes = previousCpus[i].times;
    const currentTimes = currentCpus[i].times;

    const idle = currentTimes.idle - previousTimes.idle;

    const total =
      currentTimes.user -
      previousTimes.user +
      currentTimes.nice -
      previousTimes.nice +
      currentTimes.sys -
      previousTimes.sys +
      currentTimes.idle -
      previousTimes.idle +
      currentTimes.irq -
      previousTimes.irq;

    totalIdle += idle;
    totalTick += total;
  }

  return totalTick > 0 ? 1 - totalIdle / totalTick : 0;
}

async function performanceLoadData() {
  const previousCpus = os.cpus();

  await new Promise((resolve) => setTimeout(resolve, 100));

  const currentCpus = os.cpus();

  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  const cpuLoad = getCpuUsage(previousCpus, currentCpus);

  return {
    macA: getMacAddress(),
    freeMem,
    totalMem,
    usedMem,
    memUseage: usedMem / totalMem,
    osType: os.type(),
    upTime: os.uptime(),
    cpuType: currentCpus[0]?.model || "Unknown",
    numCores: currentCpus.length,
    cpuSpeed: currentCpus[0]?.speed || 0,
    cpuLoad,
  };
}

const socket = io(SERVER_URL, {
  auth: {
    token: NODE_CLIENT_TOKEN,
  },
  reconnection: true,
});

socket.on("connect", () => {
  console.log("Connected to Socket.IO server");
});

socket.on("welcome", (data) => {
  console.log(data.message);
});

socket.on("connect_error", (error) => {
  console.error("Connection error:", error.message);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected from server:", reason);
});

let isSending = false;

setInterval(async () => {
  if (!socket.connected || isSending) {
    return;
  }

  isSending = true;

  try {
    const data = await performanceLoadData();

    socket.emit("perfData", data);
  } catch (error) {
    console.error("Error collecting performance data:", error);
  } finally {
    isSending = false;
  }
}, 1000);
