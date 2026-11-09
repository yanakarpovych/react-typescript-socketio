const http = require("http");
const { Server } = require("socket.io");

const PORT = 3000;

const CLIENT_TOKENS = {
  nodeClient: "239rfaiskdfvq243EGa4q3wefsdad",
  reactClient: "23jrtiheriufyqwidsf",
};

const httpServer = http.createServer((req, res) => {
  if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        status: "Server is running",
      }),
    );

    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  const clientType = Object.keys(CLIENT_TOKENS).find(
    (type) => CLIENT_TOKENS[type] === token,
  );

  if (!clientType) {
    return next(new Error("Unauthorized connection"));
  }

  socket.data.clientType = clientType;
  next();
});

io.on("connection", (socket) => {
  const clientType = socket.data.clientType;

  let machineMacA;

  socket.join(clientType);

  console.log(`${clientType} connected: ${socket.id}`);

  socket.emit("welcome", "Welcome to the performance monitoring server!");

  socket.on("perfData", (data) => {
    if (clientType !== "nodeClient") {
      return;
    }

    if (!data || typeof data !== "object" || !data.macA) {
      console.error("Invalid performance data received");
      return;
    }

    machineMacA = data.macA;

    console.log("Received performance data:", machineMacA);

    io.to("reactClient").emit("connectedOrNot", {
      machineMacA,
      isAlive: true,
    });

    io.to("reactClient").emit("perfData", data);
  });

  socket.on("disconnect", () => {
    console.log(`${clientType} disconnected: ${socket.id}`);

    if (clientType === "nodeClient" && machineMacA) {
      io.to("reactClient").emit("connectedOrNot", {
        machineMacA,
        isAlive: false,
      });
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
