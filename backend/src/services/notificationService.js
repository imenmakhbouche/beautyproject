const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const realtimeService = require('./realtimeService');

class NotificationService {
    // Create a notification for a patient
    async createNotification(patientId, type, title, message, link = null) {
        try {
            const notification = await prisma.notification.create({
                data: {
                    patientId,
                    type,
                    title,
                    message,
                    link,
                    read: false
                }
            });

            console.log(`📨 Notification created for patient ${patientId}: ${title}`);
            
            // Broadcast to the target patient
            realtimeService.broadcast('notification_created', notification, { targetUserId: patientId });

            return notification;
        } catch (error) {
            console.error('Error creating notification:', error);
            return null;
        }
    }

    // Get unread count for a patient
    async getUnreadCount(patientId) {
        try {
            const count = await prisma.notification.count({
                where: {
                    patientId,
                    read: false
                }
            });
            return count;
        } catch (error) {
            console.error('Error getting unread count:', error);
            return 0;
        }
    }

    // Get all notifications for a patient
    async getNotifications(patientId) {
        try {
            const notifications = await prisma.notification.findMany({
                where: { patientId },
                orderBy: { createdAt: 'desc' }
            });
            return notifications;
        } catch (error) {
            console.error('Error getting notifications:', error);
            return [];
        }
    }

    // Mark notification as read
    async markAsRead(notificationId) {
        try {
            const notification = await prisma.notification.update({
                where: { id: notificationId },
                data: { read: true }
            });
            return notification;
        } catch (error) {
            console.error('Error marking notification as read:', error);
            return null;
        }
    }

    // Create appointment reminder
    async createAppointmentReminder(patientId, appointmentDate, appointmentTime) {
        return await this.createNotification(
            patientId,
            'warning',
            'Rappel de rendez-vous',
            `Vous avez un rendez-vous le ${appointmentDate} à ${appointmentTime}. Pensez à confirmer votre présence.`,
            '/patient/appointments'
        );
    }

    // Create appointment confirmed notification
    async createAppointmentConfirmed(patientId, appointmentDate, appointmentTime, service) {
        return await this.createNotification(
            patientId,
            'success',
            'Rendez-vous confirmé',
            `Votre rendez-vous pour "${service}" du ${appointmentDate} à ${appointmentTime} a été confirmé.`,
            '/patient/appointments'
        );
    }

    // Create appointment requested notification
    async createAppointmentRequested(patientId, appointmentDate, appointmentTime, service) {
        return await this.createNotification(
            patientId,
            'info',
            'Demande de rendez-vous',
            `Votre demande de rendez-vous pour "${service}" le ${appointmentDate} à ${appointmentTime} a été envoyée. En attente de confirmation.`,
            '/patient/appointments'
        );
    }

    // Create appointment cancelled notification
    async createAppointmentCancelled(patientId, appointmentDate, appointmentTime) {
        return await this.createNotification(
            patientId,
            'warning',
            'Rendez-vous annulé',
            `Votre rendez-vous du ${appointmentDate} à ${appointmentTime} a été annulé.`,
            '/patient/appointments'
        );
    }

    // Create new document notification
    async createDocumentNotification(patientId, documentName) {
        return await this.createNotification(
            patientId,
            'info',
            'Nouveau document disponible',
            `Le document "${documentName}" a été ajouté à votre dossier médical.`,
            '/patient/documents'
        );
    }

    // Create urgent notification
    async createUrgentNotification(patientId, message) {
        return await this.createNotification(
            patientId,
            'urgent',
            '⚠️ Information importante',
            message,
            '/patient/dashboard'
        );
    }

    // Create new message notification
    async createMessageNotification(patientId, senderName) {
        return await this.createNotification(
            patientId,
            'info',
            'Nouveau message',
            `Vous avez reçu un nouveau message de ${senderName}.`,
            '/patient/messages'
        );
    }
}

module.exports = new NotificationService();