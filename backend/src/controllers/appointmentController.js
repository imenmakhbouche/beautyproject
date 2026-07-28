const notificationService = require('../services/notificationService');
const prisma = require('../config/prisma');
const realtimeService = require('../services/realtimeService');

const getAppointments = async (req, res) => {
  try {
    const { date, patientId, status } = req.query;
    const filter = {};

    if (date) filter.date = date;
    if (patientId) filter.patientId = patientId;
    if (status) filter.status = status;

    const appointments = await prisma.appointment.findMany({
      where: filter,
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    });

    res.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('❌ Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAppointment = async (req, res) => {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id }
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('❌ Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ─── ✅ FIXED: CREATE APPOINTMENT ──────────────────────────────────────────
const createAppointment = async (req, res) => {
  try {
    const { patientId, patientName, date, time, service, status, notes } = req.body;

    console.log('📝 Creating appointment with data:', req.body);

    // Validate required fields
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required'
      });
    }

    if (!patientName) {
      return res.status(400).json({
        success: false,
        message: 'Patient name is required'
      });
    }

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    if (!time) {
      return res.status(400).json({
        success: false,
        message: 'Time is required'
      });
    }

    // ✅ FIXED: Check if patient exists, but don't fail if not found
    // Instead, create appointment even if patient doesn't exist in Patient table
    // (since patient might only exist in User table)
    let patientExists = false;
    try {
      const patient = await prisma.patient.findUnique({
        where: { id: patientId }
      });
      if (patient) {
        patientExists = true;
        console.log('✅ Patient found:', patient.name);
      } else {
        console.log('⚠️ Patient not found in Patient table, but continuing...');
      }
    } catch (patientError) {
      console.log('⚠️ Error checking patient, continuing...');
    }

    // Create the appointment even if patient doesn't exist
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patientId,
        patientName: patientName,
        date: date,
        time: time,
        service: service || 'Consultation',
        status: status || 'pending',
        notes: notes || '',
        createdBy: req.userId || null
      }
    });

    console.log('✅ Appointment created successfully:', appointment);

    // Try to create notification, but don't fail if it doesn't work
    try {
      if (patientExists) {
        await notificationService.createAppointmentRequested(
          patientId,
          date,
          time,
          service || 'Consultation'
        );
      }
    } catch (notifError) {
      console.warn('⚠️ Could not create notification:', notifError.message);
    }

    // Broadcast realtime update
    try {
      realtimeService.broadcast('appointment_created', appointment);
    } catch (realtimeError) {
      console.warn('⚠️ Could not broadcast realtime update:', realtimeError.message);
    }

    res.status(201).json({
      success: true,
      data: appointment
    });

  } catch (error) {
    console.error('❌ Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      details: error.stack
    });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const { id, createdAt, updatedAt, creator, createdBy, ...updateData } = req.body;

    console.log('📝 Updating appointment:', req.params.id, updateData);

    // Check if appointment exists
    const existing = await prisma.appointment.findUnique({
      where: { id: req.params.id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: updateData
    });

    try {
      realtimeService.broadcast('appointment_updated', appointment);
    } catch (realtimeError) {
      console.warn('⚠️ Could not broadcast realtime update:', realtimeError.message);
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('❌ Error updating appointment:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    console.log('📝 Updating appointment status:', req.params.id, status);

    // Check if appointment exists
    const existing = await prisma.appointment.findUnique({
      where: { id: req.params.id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status }
    });

    // Try to create notification based on status
    try {
      if (status === 'confirmed') {
        await notificationService.createAppointmentConfirmed(
          appointment.patientId,
          appointment.date,
          appointment.time,
          appointment.service
        );
      } else if (status === 'cancelled') {
        await notificationService.createAppointmentCancelled(
          appointment.patientId,
          appointment.date,
          appointment.time
        );
      }
    } catch (notifError) {
      console.warn('⚠️ Could not create notification:', notifError.message);
    }

    try {
      realtimeService.broadcast('appointment_updated', appointment);
    } catch (realtimeError) {
      console.warn('⚠️ Could not broadcast realtime update:', realtimeError.message);
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('❌ Error updating appointment status:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    console.log('🗑️ Deleting appointment:', req.params.id);

    // Check if appointment exists
    const existing = await prisma.appointment.findUnique({
      where: { id: req.params.id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    await prisma.appointment.delete({
      where: { id: req.params.id }
    });

    try {
      realtimeService.broadcast('appointment_deleted', { id: req.params.id });
    } catch (realtimeError) {
      console.warn('⚠️ Could not broadcast realtime update:', realtimeError.message);
    }

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting appointment:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment
};