const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const realtimeService = require('../services/realtimeService');
const prisma = new PrismaClient();

// Get all notifications for a patient
router.get('/patient/:patientId', auth, async (req, res) => {
    try {
        const { patientId } = req.params;

        const notifications = await prisma.notification.findMany({
            where: { patientId },
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Mark notification as read
router.patch('/:id/read', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await prisma.notification.update({
            where: { id },
            data: { read: true }
        });

        realtimeService.broadcast('notification_updated', notification, { targetUserId: notification.patientId });

        res.json({
            success: true,
            data: notification
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Mark all notifications as read
router.patch('/patient/:patientId/read-all', auth, async (req, res) => {
    try {
        const { patientId } = req.params;

        await prisma.notification.updateMany({
            where: {
                patientId,
                read: false
            },
            data: { read: true }
        });

        realtimeService.broadcast('notifications_read_all', { patientId }, { targetUserId: patientId });

        res.json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Delete notification
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await prisma.notification.findUnique({ where: { id } });
        if (notification) {
            await prisma.notification.delete({
                where: { id }
            });
            realtimeService.broadcast('notification_deleted', { id, patientId: notification.patientId }, { targetUserId: notification.patientId });
        }

        res.json({
            success: true,
            message: 'Notification deleted'
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;