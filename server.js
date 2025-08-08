const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store active channels and their participants
const channels = new Map();
const userSockets = new Map();

// Available channels
const availableChannels = [
  { id: 'channel-1', name: 'Channel 1' },
  { id: 'channel-2', name: 'Channel 2' },
  { id: 'channel-3', name: 'Channel 3' },
  { id: 'channel-4', name: 'Channel 4' },
  { id: 'channel-5', name: 'Channel 5' }
];

// Initialize channels
availableChannels.forEach(channel => {
  channels.set(channel.id, {
    id: channel.id,
    name: channel.name,
    participants: new Map(),
    broadcaster: null
  });
});

// Web page route
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  console.log(`Serving index.html from: ${indexPath}`);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error(`Error serving index.html: ${err.message}`);
      res.status(500).send('Error loading page');
    }
  });
});

// REST endpoints
app.get('/api/channels', (req, res) => {
  const channelList = availableChannels.map(channel => ({
    ...channel,
    participantCount: channels.get(channel.id).participants.size,
    hasBroadcaster: channels.get(channel.id).broadcaster !== null
  }));
  res.json(channelList);
});

app.get('/api/channels/:channelId', (req, res) => {
  const channelId = req.params.channelId;
  const channel = channels.get(channelId);
  
  if (!channel) {
    return res.status(404).json({ error: 'Channel not found' });
  }
  
  res.json({
    id: channel.id,
    name: channel.name,
    participantCount: channel.participants.size,
    hasBroadcaster: channel.broadcaster !== null
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Store socket reference
  userSockets.set(socket.id, {
    socket: socket,
    channelId: null,
    isBroadcaster: false
  });

  // Join a channel
  socket.on('join-channel', (data) => {
    const { channelId, userId } = data;
    const channel = channels.get(channelId);
    
    if (!channel) {
      socket.emit('error', { message: 'Channel not found' });
      return;
    }

    // Leave previous channel if any
    const userSocket = userSockets.get(socket.id);
    if (userSocket && userSocket.channelId) {
      const prevChannel = channels.get(userSocket.channelId);
      if (prevChannel) {
        prevChannel.participants.delete(socket.id);
        socket.leave(userSocket.channelId);
      }
    }

    // Join new channel
    socket.join(channelId);
    channel.participants.set(socket.id, {
      userId: userId,
      socketId: socket.id
    });

    userSocket.channelId = channelId;
    userSocket.isBroadcaster = false;

    console.log(`User ${userId} joined channel ${channelId}`);
    
    // Notify others in the channel
    socket.to(channelId).emit('user-joined', {
      userId: userId,
      socketId: socket.id
    });

    // Send current channel state to the joining user
    socket.emit('channel-joined', {
      channelId: channelId,
      channelName: channel.name,
      participants: Array.from(channel.participants.values()),
      broadcaster: channel.broadcaster
    });
  });

  // Become broadcaster (PTT)
  socket.on('become-broadcaster', (data) => {
    const { channelId } = data;
    const channel = channels.get(channelId);
    const userSocket = userSockets.get(socket.id);

    console.log(`🎤 Become broadcaster request from ${socket.id} for channel ${channelId}`);

    if (!channel || !userSocket || userSocket.channelId !== channelId) {
      console.log(`❌ Invalid become-broadcaster request from ${socket.id}`);
      socket.emit('error', { message: 'Not in channel or channel not found' });
      return;
    }

    // Set as broadcaster
    channel.broadcaster = socket.id;
    userSocket.isBroadcaster = true;

    console.log(`✅ User ${socket.id} became broadcaster in channel ${channelId}`);
    console.log(`📻 Channel ${channelId} broadcaster set to: ${channel.broadcaster}`);
    
    // Notify all participants in the channel
    io.to(channelId).emit('broadcaster-changed', {
      broadcasterId: socket.id,
      broadcasterUserId: channel.participants.get(socket.id)?.userId
    });
    
    console.log(`📢 Broadcaster change notification sent to channel ${channelId}`);
  });

  // Stop broadcasting
  socket.on('stop-broadcasting', (data) => {
    const { channelId } = data;
    const channel = channels.get(channelId);
    const userSocket = userSockets.get(socket.id);

    if (!channel || !userSocket || userSocket.channelId !== channelId) {
      return;
    }

    // Only the current broadcaster can stop broadcasting
    if (channel.broadcaster === socket.id) {
      channel.broadcaster = null;
      userSocket.isBroadcaster = false;

      console.log(`Broadcasting stopped in channel ${channelId}`);
      
      // Notify all participants
      io.to(channelId).emit('broadcaster-changed', {
        broadcasterId: null,
        broadcasterUserId: null
      });
    }
  });

  // WebRTC signaling
  socket.on('webrtc-offer', (data) => {
    const { channelId, offer, targetId } = data;
    const channel = channels.get(channelId);
    
    console.log(`📤 WebRTC offer received from ${socket.id} for channel ${channelId}`);
    console.log(`Channel broadcaster: ${channel?.broadcaster}`);
    console.log(`Is sender broadcaster: ${channel?.broadcaster === socket.id}`);
    
    if (!channel) {
      console.log(`❌ Channel ${channelId} not found`);
      return;
    }
    
    if (channel.broadcaster !== socket.id) {
      console.log(`❌ ${socket.id} is not the broadcaster (${channel.broadcaster} is)`);
      return; // Only broadcaster can send offers
    }

    console.log(`✅ Broadcasting WebRTC offer to channel ${channelId}`);
    
    // Relay offer to specific target or all listeners
    if (targetId) {
      socket.to(targetId).emit('webrtc-offer', {
        offer: offer,
        fromId: socket.id
      });
      console.log(`📤 WebRTC offer sent to specific target: ${targetId}`);
    } else {
      socket.to(channelId).emit('webrtc-offer', {
        offer: offer,
        fromId: socket.id
      });
      console.log(`📤 WebRTC offer broadcasted to channel: ${channelId}`);
    }
  });

  socket.on('webrtc-answer', (data) => {
    const { channelId, answer, targetId } = data;
    const channel = channels.get(channelId);
    
    if (!channel) return;

    // Relay answer to the broadcaster
    socket.to(targetId).emit('webrtc-answer', {
      answer: answer,
      fromId: socket.id
    });
  });

  socket.on('ice-candidate', (data) => {
    const { channelId, candidate, targetId } = data;
    const channel = channels.get(channelId);
    
    if (!channel) return;

    // Relay ICE candidate
    if (targetId) {
      socket.to(targetId).emit('ice-candidate', {
        candidate: candidate,
        fromId: socket.id
      });
    } else {
      socket.to(channelId).emit('ice-candidate', {
        candidate: candidate,
        fromId: socket.id
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    const userSocket = userSockets.get(socket.id);
    if (userSocket && userSocket.channelId) {
      const channel = channels.get(userSocket.channelId);
      if (channel) {
        // Remove from participants
        channel.participants.delete(socket.id);
        
        // If broadcaster disconnected, clear broadcaster
        if (channel.broadcaster === socket.id) {
          channel.broadcaster = null;
          io.to(userSocket.channelId).emit('broadcaster-changed', {
            broadcasterId: null,
            broadcasterUserId: null
          });
        }
        
        // Notify others
        socket.to(userSocket.channelId).emit('user-left', {
          socketId: socket.id,
          userId: channel.participants.get(socket.id)?.userId
        });
      }
    }
    
    userSockets.delete(socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Walkie-Talkie server running on port ${PORT}`);
  console.log(`Available channels: ${availableChannels.map(c => c.name).join(', ')}`);
}); 