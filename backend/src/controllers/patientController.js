const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ─── GET ALL PATIENTS ─────────────────────────────────────────────────────
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
    console.error('Error fetching patients:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ─── GET SINGLE PATIENT ──────────────────────────────────────────────────
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
    console.error('Error fetching patient:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ─── CREATE PATIENT ──────────────────────────────────────────────────────
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
    console.error('Error creating patient:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ─── UPDATE PATIENT ──────────────────────────────────────────────────────
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
    console.error('Error updating patient:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ─── DELETE PATIENT ──────────────────────────────────────────────────────
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
    console.error('Error deleting patient:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ─── GET PATIENT PROFILE ──────────────────────────────────────────────────
const getPatientProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const patient = await prisma.patient.findUnique({
      where: { email: user.email }
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Error getting patient profile:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ─── UPDATE PATIENT PROFILE ──────────────────────────────────────────────
const updatePatientProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      birthDate, address, emergencyContact, emergencyPhone,
      allergies, antecedents, medications, bloodType
    } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update patient
    const patient = await prisma.patient.update({
      where: { email: user.email },
      data: {
        birthDate: birthDate || null,
        address: address || null,
        emergencyContact: emergencyContact || null,
        emergencyPhone: emergencyPhone || null,
        allergies: allergies || null,
        antecedents: antecedents || null,
        medications: medications || null,
        bloodType: bloodType || null
      }
    });

    res.status(200).json({
      success: true,
      message: 'Patient profile updated successfully!',
      data: patient
    });
  } catch (error) {
    console.error('Error updating patient profile:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ─── EXPORT ALL FUNCTIONS ──────────────────────────────────────────────────
module.exports = {
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
  getPatientProfile,
  updatePatientProfile
};