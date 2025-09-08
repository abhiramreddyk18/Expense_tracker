import { io } from 'socket.io-client';
const API_URL = import.meta.env.VITE_BACKEND_URL;
const socket = io(API_URL, {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
