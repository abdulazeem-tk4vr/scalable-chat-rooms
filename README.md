# Redis-Scaled Socket.io Chat Application

A scalable real-time chat application built with Socket.io, Redis, and TypeScript. This application allows multiple clients to join chat rooms and communicate in real-time across multiple server instances using Redis as a message broker.

## Features

- Real-time communication across chat rooms
- Multiple client support
- Redis adapter for scaling across multiple servers
- Turn-based chat mechanism (prevents message flooding)
- Docker-ready Redis setup
- TypeScript implementation

## Architecture

The application consists of:

- **Socket.io Server**: Handles WebSocket connections and room management
- **Redis**: Acts as a message broker for scaling across server instances
- **Client**: Command-line interface for users to join chat rooms
- **Redis Emitter**: Optional broadcaster for server-wide events

## Prerequisites

- Node.js (v14+)
- Docker and Docker Compose
- Redis (via Docker)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/abdulazeem-tk4vr/scalable-chat-rooms.git
cd scalable-chat-rooms
```

2. Install dependencies:

```bash
npm install
```

3. Install required packages (if not in package.json):

```bash
npm install socket.io socket.io-client @socket.io/redis-adapter @socket.io/redis-emitter ioredis readline
```

## Redis Setup

### Start Redis with Docker

To start a Redis container:

```bash
docker run -d --name redis-chat \
  -p 6379:6379 \
  redis:latest
```

Or using Docker Compose (create a `docker-compose.yml`):

```yaml
version: "3.8"
services:
  redis:
    image: redis:latest
    container_name: redis-chat
    ports:
      - "6379:6379"
    restart: unless-stopped
```

Start with:

```bash
docker-compose up -d
```

### Stop Redis

To stop Redis container:

```bash
# If using docker run
docker stop redis-chat
docker rm redis-chat

# If using docker-compose
docker-compose down
```

### Check Redis Status

```bash
# Check if Redis is running
docker ps | grep redis-chat

# View Redis logs
docker logs redis-chat

# Connect to Redis CLI
docker exec -it redis-chat redis-cli
```

## Running the Application

### Start the Server

Start one or more server instances on different ports:

```bash
# Terminal 1 - Server Instance 1
npm run build
node dist/server.js 3000

# Terminal 2 - Server Instance 2
node dist/server.js 3001
```

### Start the Clients

Start multiple clients to join the chat:

```bash
# Terminal 3 - Client 1
node dist/client.js 3000 room1

# Terminal 4 - Client 2
node dist/client.js 3001 room1

# Terminal 5 - Client 3
node dist/client.js 3000 room1
```

### Start the Redis Emitter (Optional)

The Redis emitter broadcasts periodic time updates to all connected clients:

```bash
# Terminal 6
node dist/redisEmitter.js
```

## Application Flow Example

### Step-by-Step Flow

1. **Start Redis**:

   ```bash
   docker run -d --name redis-chat -p 6379:6379 redis:latest
   ```

2. **Start Two Server Instances**:

   ```bash
   # Terminal 1
   node dist/server.js 3000

   # Terminal 2
   node dist/server.js 3001
   ```

3. **Connect Client 1 to Server 1**:

   ```bash
   # Terminal 3
   node dist/client.js 3000 room1
   ```

   Output:

   ```
   The connection socket to A has connected <socket-id>

   💬 Enter message:
   ```

4. **Connect Client 2 to Server 2**:

   ```bash
   # Terminal 4
   node dist/client.js 3001 room1
   ```

   Both clients now see:

   ```
   Room has a message: <new-socket-id> connected to room1
   ```

5. **Chat Communication**:

   **Client 1 types and sends**: "Hello from Client 1"

   ```
   💬 Enter message: Hello from Client 1
   ```

   **Client 2 receives**:

   ```
   Room has a message: <client1-id> says Hello from Client 1

   💬 Enter message:
   ```

   **Client 2 types and sends**: "Hi back from Client 2"

   ```
   💬 Enter message: Hi back from Client 2
   ```

   **Client 1 receives**:

   ```
   Room has a message: <client2-id> says Hi back from Client 2

   💬 Enter message:
   ```

6. **Leave the Room**:

   Client 1 types: "leave"

   ```
   💬 Enter message: leave
   ```

   Client 2 sees:

   ```
   Room has a message: <client1-id> has disconnected
   ```

   Client 1 disconnects automatically.

7. **Exit Application**:

   Type "exit" to quit:

   ```
   💬 Enter message: exit
   👋 Exiting
   ```

## How It Works

### Turn-based Chat Mechanism

The application implements a turn-based chat system:

- Clients can only send messages when it's their turn (`timeToTalk = true`)
- After sending a message, a client must wait for the server to respond
- This prevents message flooding and ensures orderly conversation

### Redis Scaling

The application uses Redis as an adapter to scale Socket.io across multiple server instances:

- Messages are published to Redis when emitted to rooms
- All server instances subscribe to Redis channels
- Clients connected to different servers can communicate seamlessly

## Project Structure

```
src/
├── client.ts          # Client application for connecting to chat rooms
├── server.ts          # Socket.io server with Redis adapter
├── redisEmitter.ts    # Standalone Redis broadcaster
└── index.ts           # Basic entry point
```

## API Reference

### Client Events

- `connect`: Connection established with server
- `disconnect`: Disconnected from server
- `hello`: Receive messages from other clients
- `new`: Notification of new client joining room

### Server Events

- `join`: Join a specific chat room
- `message`: Send message to a room
- `disconnecting`: Handle client disconnection

## Development

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run watch
```

## Troubleshooting

### Redis Connection Issues

If you see Redis connection errors:

```
Redis pubClient error: Error: connect ECONNREFUSED 127.0.0.1:6379
```

1. Ensure Redis is running:

   ```bash
   docker ps | grep redis-chat
   ```

2. Check Redis connectivity:
   ```bash
   docker exec -it redis-chat redis-cli ping
   ```

### Port Already in Use

If you get EADDRINUSE errors, check for processes using the port:

```bash
lsof -i :3000
kill -9 <PID>
```

## Contributing

Feel free to submit issues and pull requests to the [repository](https://github.com/abdulazeem-tk4vr/scalable-chat-rooms).

## License

MIT License

## Acknowledgments

- Socket.io team for the real-time framework
- Redis team for the reliable message broker
- Community contributors

## Contact

For questions or support, please open an issue on the [GitHub repository](https://github.com/abdulazeem-tk4vr/scalable-chat-rooms/issues).
