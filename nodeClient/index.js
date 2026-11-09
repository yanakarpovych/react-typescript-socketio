const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";

const socket = io(SERVER_URL, {
  auth: {
    token: process.env.NODE_CLIENT_TOKEN || "239rfaiskdfvq243EGa4q3wefsdad",
  },
});
