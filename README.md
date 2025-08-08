# Walkie-Talkie Backend

A Node.js backend server for the Walkie-Talkie POC using Express, Socket.IO, and WebRTC signaling.

## Features

- Channel-based communication (5 predefined channels)
- WebRTC signaling server
- Push-to-Talk (PTT) functionality
- Real-time audio streaming support
- REST API for channel management

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on port 3000 by default.

## API Endpoints

### GET /api/channels
Returns a list of all available channels with participant count and broadcaster status.

### GET /api/channels/:channelId
Returns information about a specific channel.

## Socket.IO Events

### Client to Server
- `join-channel`: Join a specific channel
- `become-broadcaster`: Become the broadcaster (PTT)
- `stop-broadcasting`: Stop broadcasting
- `webrtc-offer`: Send WebRTC offer
- `webrtc-answer`: Send WebRTC answer
- `ice-candidate`: Send ICE candidate

### Server to Client
- `channel-joined`: Confirmation of channel join
- `user-joined`: New user joined the channel
- `user-left`: User left the channel
- `broadcaster-changed`: Broadcaster status changed
- `webrtc-offer`: Receive WebRTC offer
- `webrtc-answer`: Receive WebRTC answer
- `ice-candidate`: Receive ICE candidate
- `error`: Error message

## Available Channels

- Channel 1
- Channel 2
- Channel 3
- Channel 4
- Channel 5

## Environment Variables

- `PORT`: Server port (default: 3000) 