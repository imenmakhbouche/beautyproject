const prisma = require('../config/prisma');

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
    
    res.status(201).json({
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

const updateAppointment = async (req, res) => {
  try {
    // Exclude relations / metadata fields if they are sent in body
    const { id, createdAt, updatedAt, creator, createdBy, ...updateData } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: updateData
    });
    
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

const deleteAppointment = async (req, res) => {
  try {
    await prisma.appointment.delete({
      where: { id: req.params.id }
    });
    
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