import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: '23jrtiheriufyqwidsf',
  },
});

export default socket;