# Performance Monitor

A real-time system performance monitoring application that collects hardware and system metrics from a local machine and displays them in a web dashboard using Socket.IO.

## Demo

[Live Demo](https://react-typescript-socketio-1.onrender.com)

## Features

- Monitor CPU usage in real time
- Track RAM usage and memory statistics
- Display system information, including OS type and uptime
- Monitor CPU model, speed, and number of cores
- Connect multiple machines to the monitoring dashboard
- Track machine connection status
- Real-time data transmission using Socket.IO
- Client authentication using tokens

## Technologies

- Node.js
- Express-free Node.js HTTP Server
- Socket.IO
- React
- TypeScript
- Vite
- JavaScript
- HTML
- CSS
- Render

## Project Structure

- `nodeClient/` – collects system performance metrics and sends them to the server
- `server/` – handles Socket.IO connections, client authentication, and data transmission
- `react-client/` – displays real-time system metrics in the monitoring dashboard

## Getting Started

Clone the repository:

```bash
git clone https://github.com/yanakarpovych/react-typescript-socketio.git
```

Navigate to the project directory:

```bash
cd react-typescript-socketio
```

### 1. Backend

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and configure the environment variables:

```env
PORT=3000
NODE_CLIENT_TOKEN=your_node_client_token
REACT_CLIENT_TOKEN=your_react_client_token
REACT_CLIENT_URL=http://localhost:5173
```

Start the server:

```bash
npm start
```

### 2. Node Client

Open a separate terminal and navigate to the Node Client directory:

```bash
cd nodeClient
```

Install dependencies:

```bash
npm install
```

Configure the environment variables:

```env
SERVER_URL=http://localhost:3000
NODE_CLIENT_TOKEN=your_node_client_token
```

Start the Node Client:

```bash
npm start
```

### 3. React Client

Open another terminal and navigate to the React Client directory:

```bash
cd react-client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and configure the server URL:

```env
VITE_SERVER_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

## Deployment

- **Frontend:** Render (Static Site)
- **Backend:** Render (Web Service)
- **Node Client:** Runs locally and sends system performance data to the deployed backend
