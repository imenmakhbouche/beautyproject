const prisma = require('../config/prisma');

const getPatients = async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getPatient = async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: req.params.id }
    });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }
    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createPatient = async (req, res) => {
  try {
    const { name, email, phone, birthDate, address, emergencyContact, emergencyPhone, allergies, antecedents, medications, bloodType } = req.body;
    
    // Check if patient already exists
    const existingPatient = await prisma.patient.findUnique({
      where: { email }
    });
    
    if (existingPatient) {
      return res.status(400).json({
        success: false,
        message: 'Patient with this email already exists'
      });
    }

    const patient = await prisma.patient.create({
      data: {
        name,
        email,
        phone,
        birthDate,
        address,
        emergencyContact,
        emergencyPhone,
        allergies,
        antecedents,
        medications,
        bloodType,
        createdBy: req.userId
      }
    });
    
    res.status(201).json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updatePatient = async (req, res) => {
  try {
    // Exclude relations / metadata fields if they are sent in body
    const { id, createdAt, updatedAt, creator, createdBy, ...updateData } = req.body;

    const patient = await prisma.patient.update({
      where: { id: req.params.id },
      data: updateData
    });
    
    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deletePatient = async (req, res) => {
  try {
    await prisma.patient.delete({
      where: { id: req.params.id }
    });
    
    res.json({
      success: true,
      message: 'Patient deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient
};