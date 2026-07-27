const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Load environment variables FIRST
dotenv.config();

// Import Prisma client
const prisma = require('./src/config/prisma');

// Import routes
const authRoutes = require('./src/routes/auth');
const patientRoutes = require('./src/routes/patients');
const appointmentRoutes = require('./src/routes/appointments');
const documentRoutes = require('./src/routes/documents');
const prescriptionRoutes = require('./src/routes/prescriptions');
const messageRoutes = require('./src/routes/messages');
const scheduleRoutes = require('./src/routes/schedule');
const notificationRoutes = require('./src/routes/notifications');
const { auth } = require('./src/middleware/auth');
const realtimeService = require('./src/services/realtimeService');

const app = express();
const server = http.createServer(app);

// ─── SOCKET.IO CONFIGURATION ──────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store connected users
const connectedUsers = new Map(); // userId -> socketId

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── ROUTES ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/notifications', notificationRoutes);

// SSE Realtime Endpoint
app.get('/api/realtime', auth, (req, res) => {
  realtimeService.register(req, res);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ─── SOCKET.IO EVENTS ──────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('🟢 Client connected:', socket.id);

  // ─── REGISTER USER ──────────────────────────────────────────────────────
  socket.on('register', (userId) => {
    if (userId) {
      connectedUsers.set(userId, socket.id);
      console.log(`📝 User ${userId} registered with socket ${socket.id}`);
      console.log(`👥 Connected users: ${connectedUsers.size}`);
    }
  });

  // ─── SEND MESSAGE ──────────────────────────────────────────────────────
  socket.on('send_message', async (data) => {
    const { patientId, sender, text, timestamp } = data;

    console.log(`📤 New message from ${sender} to patient ${patientId}:`, text);

    try {
      // Save message to database
      const message = await prisma.message.create({
        data: {
          patientId: patientId,
          sender: sender,
          text: text,
          timestamp: timestamp ? new Date(timestamp) : new Date(),
          read: false
        }
      });

      console.log('✅ Message saved to database:', message.id);

      // Get patient name for notification
      let patientName = 'Patient';
      try {
        const patient = await prisma.patient.findUnique({
          where: { id: patientId }
        });
        if (patient) patientName = patient.name;
      } catch (e) {
        console.warn('Could not fetch patient name:', e.message);
      }

      // ─── EMIT TO PATIENT (if online) ──────────────────────────────────
      const patientSocketId = connectedUsers.get(patientId);
      if (patientSocketId) {
        io.to(patientSocketId).emit('new_message', {
          ...message,
          isOwn: false,
          senderName: sender === 'patient' ? 'Vous' : 'Dr. BOUSIF SAMEH'
        });
        console.log(`📨 Message sent to patient ${patientId}`);
      } else {
        console.log(`📨 Patient ${patientId} is offline, message saved for later`);
      }

      // ─── EMIT TO DOCTORS/SECRETARIES ──────────────────────────────────
      // Broadcast to all other connected clients (doctors, secretaries)
      socket.broadcast.emit('new_message', {
        ...message,
        isOwn: false,
        senderName: sender === 'patient' ? patientName : 'Dr. BOUSIF SAMEH',
        patientName: patientName
      });

      // ─── CONFIRM TO SENDER ────────────────────────────────────────────
      socket.emit('message_sent', {
        ...message,
        isOwn: true
      });

      // ─── CREATE NOTIFICATION FOR DOCTOR ──────────────────────────────
      if (sender === 'patient') {
        try {
          await prisma.notification.create({
            data: {
              patientId: patientId,
              type: 'info',
              title: 'Nouveau message patient',
              message: `${patientName} vous a envoyé un message: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`,
              read: false,
              link: `/dashboard?tab=messages&patient=${patientId}`,
              createdAt: new Date()
            }
          });
          console.log('✅ Notification created for doctor');
        } catch (notifError) {
          console.warn('Could not create notification:', notifError.message);
        }
      }

    } catch (error) {
      console.error('❌ Error processing message:', error);
      socket.emit('message_error', {
        error: error.message,
        data: data
      });
    }
  });

  // ─── TYPING INDICATOR ──────────────────────────────────────────────────
  socket.on('typing', (data) => {
    const { patientId, sender, isTyping } = data;

    const patientSocketId = connectedUsers.get(patientId);
    if (patientSocketId) {
      io.to(patientSocketId).emit('user_typing', {
        sender,
        isTyping,
        senderName: sender === 'patient' ? 'Patient' : 'Dr. BOUSIF SAMEH'
      });
    }
  });

  // ─── MARK MESSAGE AS READ ─────────────────────────────────────────────
  socket.on('mark_read', async (data) => {
    const { messageId, patientId } = data;

    try {
      await prisma.message.update({
        where: { id: messageId },
        data: { read: true }
      });

      // Notify all connected clients
      io.emit('message_read', { messageId, patientId });

      console.log(`✅ Message ${messageId} marked as read`);
    } catch (error) {
      console.error('❌ Error marking message as read:', error);
    }
  });

  // ─── MARK ALL AS READ ──────────────────────────────────────────────────
  socket.on('mark_all_read', async (data) => {
    const { patientId } = data;

    try {
      await prisma.message.updateMany({
        where: {
          patientId: patientId,
          read: false,
          sender: 'doctor'
        },
        data: { read: true }
      });

      io.emit('all_read', { patientId });
      console.log(`✅ All messages marked as read for patient ${patientId}`);
    } catch (error) {
      console.error('❌ Error marking all messages as read:', error);
    }
  });

  // ─── DISCONNECT ────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);

    // Remove user from connected users
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`👋 User ${userId} disconnected`);
        console.log(`👥 Connected users: ${connectedUsers.size}`);
        break;
      }
    }
  });
});

// ─── START SERVER ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to Neon PostgreSQL database');

    server.listen(PORT, () => {
      console.log(`🚀 HTTP Server running on http://localhost:${PORT}`);
      console.log(`🔌 Socket.IO server running on ws://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

startServer();

// ─── GRACEFUL SHUTDOWN ─────────────────────────────────────────────────────
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = { app, server, io };