// Realtime Service using Server-Sent Events (SSE)
class RealtimeService {
  constructor() {
    this.clients = new Set();
  }

  // Register a client connection
  register(req, res) {
    // Set headers for SSE
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // For Nginx support
    });

    const client = {
      userId: req.userId,
      role: req.user.role,
      res
    };

    this.clients.add(client);
    console.log(`📡 Client connected to SSE: User ID = ${client.userId}, Role = ${client.role}. Total connected = ${this.clients.size}`);

    // Send initial ping/connection event
    res.write(`event: connected\ndata: ${JSON.stringify({ success: true, message: 'Realtime connection established.' })}\n\n`);

    // Setup ping interval to keep connection alive
    const keepAliveInterval = setInterval(() => {
      if (!res.writableEnded) {
        res.write(': ping\n\n');
      }
    }, 20000);

    // Handle connection closure
    req.on('close', () => {
      clearInterval(keepAliveInterval);
      this.clients.delete(client);
      console.log(`🔌 Client disconnected from SSE: User ID = ${client.userId}. Total connected = ${this.clients.size}`);
    });
  }

  // Broadcast an event to connected clients
  broadcast(event, data, filter = {}) {
    const payload = JSON.stringify(data);
    const { targetUserId, targetRole, excludeUserId } = filter;

    console.log(`📢 Broadcasting event: "${event}" to clients matching filter:`, filter);

    this.clients.forEach(client => {
      // Check filters
      if (targetUserId && client.userId !== targetUserId) return;
      if (targetRole && client.role !== targetRole) return;
      if (excludeUserId && client.userId === excludeUserId) return;

      try {
        if (!client.res.writableEnded) {
          client.res.write(`event: ${event}\ndata: ${payload}\n\n`);
        }
      } catch (err) {
        console.error(`❌ Failed to send SSE message to user ${client.userId}:`, err);
      }
    });
  }
}

module.exports = new RealtimeService();
