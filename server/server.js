const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;

const CLIENT_TOKENS = {
  nodeClient: process.env.NODE_CLIENT_TOKEN || "239rfaiskdfvq243EGa4q3wefsdad",
  reactClient: process.env.REACT_CLIENT_TOKEN || "23jrtiheriufyqwidsf",
};

const REACT_CLIENT_URL =
  process.env.REACT_CLIENT_URL || "http://localhost:5173";

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "Server is running" }));
    return;
  }

  res.writeHead(404);
  res.end();
});

const io = new Server(server, {
  cors: {
    origin: REACT_CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  const clientType = Object.keys(CLIENT_TOKENS).find(
    (type) => CLIENT_TOKENS[type] === token,
  );

  if (!clientType) {
    return next(new Error("Authentication error"));
  }

  socket.data.clientType = clientType;
  next();
});

io.on("connection", (socket) => {
  const clientType = socket.data.clientType;

  socket.join(clientType);

  console.log(`${clientType} connected`);

  socket.emit("welcome", {
    message: `Welcome, ${clientType}`,
  });

  if (clientType === "nodeClient") {
    let machineMacA = null;

    socket.on("perfData", (data) => {
      if (!data || !data.macA) {
        return;
      }

      machineMacA = data.macA;

      io.to("reactClient").emit("connectedOrNot", {
        machineMacA,
        isAlive: true,
      });

      io.to("reactClient").emit("perfData", data);
    });

    socket.on("disconnect", () => {
      console.log("nodeClient disconnected");

      if (machineMacA) {
        io.to("reactClient").emit("connectedOrNot", {
          machineMacA,
          isAlive: false,
        });
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
