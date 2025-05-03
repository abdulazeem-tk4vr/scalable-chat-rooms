import { Redis } from "ioredis";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

const pubClient = new Redis();
const subClient = pubClient.duplicate();

// Add error handlers to avoid missing 'error' handler warnings
pubClient.on("error", (err) => {
  console.error("Redis pubClient error:", err);
});

subClient.on("error", (err) => {
  console.error("Redis subClient error:", err);
});

const io = new Server({
  adapter: createAdapter(pubClient, subClient),
});

const args = process.argv.slice(2); // remove node + script path
const [port] = args;

io.listen(Number(port));

io.on("connection", (socket) => {
  socket.on("join", (room) => {
    console.log("The incoming connection is from socket", socket.id, room);
    socket.join(room);
    socket.to(room).emit("hello", `${socket.id} connected to ${room}`); // every socket except the sender in the room will get the event
    io.to(room).emit("new", socket.id);
  });

  socket.on("message", (msg, room?) => {
    console.log("The incoming message is from socket", socket.id, msg);

    socket.to(room).emit("hello", `${socket.id} says ${msg}`); // every socket except the sender in the room will get the event

    if (msg == "leave" && room) {
      console.log("This is the id of the socket leaving", socket.id);
      socket.leave(room);
      socket.disconnect();
    }
  });

  socket.on("disconnecting", () => {
    console.log("Socket is disconnecting from", socket.rooms); // the Set contains at least the socket ID
    for (const room of socket.rooms) {
      if (socket.id == room) continue;
      console.log("The room is", room);
      socket.to(room).emit("hello", `${socket.id} has disconnected`);
    }
    console.log("user disconnected from all rooms");
  });
});

// This it will reach the correct client → no matter which server they are connected to.
// io.to(socket.id).emit("server-message", "You got kicked / notified");
