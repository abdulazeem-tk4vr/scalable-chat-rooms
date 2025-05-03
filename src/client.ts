const readline = require("readline");
const { io: ioClient } = require("socket.io-client");

const args = process.argv.slice(2); // remove node + script path
const [port, room] = args;

const clientToA = ioClient(`http://localhost:${port}`);

let timeToTalk = true;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "\n💬 Enter message: ",
});

// Loop-like behavior via readline prompt

rl.on("line", (line) => {
  const message = line.trim();

  if (message === "exit") {
    rl.close();
    return;
  }

  if (!timeToTalk) {
    console.log("⛔ Wait! It's not your turn to send a message. \n");
    return;
  }
  timeToTalk = false;
  // Send message to server (or log it)
  clientToA.emit("message", message, room);
});

rl.on("close", () => {
  console.log("👋 Exiting");
  process.exit(0);
});

// event emitters : client-side
clientToA.on("connect", () => {
  console.log("The connection socket to A has connected", clientToA.id); // x8WIv7-mJelg7on_ALbx
  clientToA.emit("join", "room1");
  console.log("\n");
  rl.prompt();
});

clientToA.on("disconnect", () => {
  console.log("A socket has disconnected", clientToA.id); // undefined
});

clientToA.on("hello", (msg) => {
  readline.clearLine(process.stdout, 0); // Clear current line
  readline.cursorTo(process.stdout, 0); // Move cursor to beginning
  console.log("Room has a message :", msg);
  timeToTalk = true;
  console.log("\n");
  rl.prompt();
});

clientToA.on("new", (msg) => {
  readline.clearLine(process.stdout, 0); // Clear current line
  readline.cursorTo(process.stdout, 0); // Move cursor to beginning
  console.log("Server Says, we have a new socket ", msg);
  timeToTalk = true;
  console.log("\n");
  rl.prompt();
});
