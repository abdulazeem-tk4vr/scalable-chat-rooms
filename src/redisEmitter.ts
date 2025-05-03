import { Emitter } from "@socket.io/redis-emitter";
import { Redis } from "ioredis";

// Create an ioredis publisher
const publishToServers = new Redis(); // defaults to localhost:6379

const emitter = new Emitter(publishToServers);

setInterval(() => {
  emitter.emit("time", new Date());
}, 5000);
