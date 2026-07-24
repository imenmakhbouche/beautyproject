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
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { patientId, patientName, date, time, service, status, notes } = req.body;

    // Validate that the patient exists
    const patientExists = await prisma.patient.findUnique({
      where: { id: patientId }
    });

    if (!patientExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid patient ID: Patient not found'
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        patientName,
        date,
        time,
        service,
        status: status || 'pending',
        notes,
        createdBy: req.userId
      }
    });

    // ✅ Create notification for patient
    await notificationService.createAppointmentRequested(
      patientId,
      date,
      time,
      service
    );

    realtimeService.broadcast('appointment_created', appointment);

    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateAppointment = async (req, res) => {
  try {
    // Exclude relations / metadata fields if they are sent in body
    const { id, createdAt, updatedAt, creator, createdBy, ...updateData } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: updateData
    });

    realtimeService.broadcast('appointment_updated', appointment);

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status }
    });

    // ✅ Create notification based on status
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

    realtimeService.broadcast('appointment_updated', appointment);

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    await prisma.appointment.delete({
      where: { id: req.params.id }
    });

    realtimeService.broadcast('appointment_deleted', { id: req.params.id });

    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
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