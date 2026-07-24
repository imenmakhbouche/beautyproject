const prisma = require('../config/prisma');
const realtimeService = require('../services/realtimeService');

const getMessages = async (req, res) => {
  try {
    const { patientId } = req.params;
    const filter = {};
    if (patientId && patientId !== 'all') {
      filter.patientId = patientId;
    }

    const messages = await prisma.message.findMany({
      where: filter,
      orderBy: { timestamp: 'asc' }
    });

    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { patientId, sender, text } = req.body;

    const message = await prisma.message.create({
      data: { patientId, sender, text }
    });

    realtimeService.broadcast('message_sent', message);

    res.status(201).json({ success: true, data: message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const message = await prisma.message.update({
      where: { id: req.params.id },
      data: { read: true }
    });

    realtimeService.broadcast('message_updated', message);

    res.json({ success: true, data: message });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getMessages, sendMessage, markAsRead };