import { io } from 'socket.io-client';
const API_URL = process.env.REACT_APP_BACKEND_URL;
const socket = io(API_URL, {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
