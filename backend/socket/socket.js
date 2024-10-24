import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config()
const front_url=process.env.FRONT_END_URL
const socket_port=process.env.SOCKET_PORT
const io = new Server(socket_port, {
  cors: {
    origin: front_url,
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // Add new user
socket.on("new-user-add", (newUserId) => {
  // Add the user if not already in activeUsers
  if (!activeUsers.some((user) => user.userId === newUserId)) {
    activeUsers.push({ userId: newUserId, socketId: socket.id });
    console.log("New User Connected", activeUsers);
  }
  io.emit("get-users", activeUsers); // Notify all users of active users
});

  // Handle user disconnect
socket.on("disconnect", () => {
  activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
  console.log("User Disconnected", activeUsers);
  io.emit("get-users", activeUsers);
});


socket.on("send-message", (data) => {
  const { receiverId } = data;
  console.log("Active Users: ", activeUsers);
  const user = activeUsers.find((user) => user.userId === receiverId);
  console.log("Sending from socket to:", receiverId);
  console.log("Data:", data);
  if (user) {
    io.to(user.socketId).emit("receive-message", data);
    console.log(`Message sent to socket ${user.socketId}`);
  } else {
    console.log('Receiver not connected.');
  }
});


});
