const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// ─── ALL ROUTES REQUIRE AUTHENTICATION ──────────────────────────────────────
router.use(auth);

// ─── GET ALL PATIENTS ──────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    console.log('📥 Fetching all patients...');
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' }
    });
    console.log(`✅ Found ${patients.length} patients`);
    res.json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    console.error('❌ Error fetching patients:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ─── GET PATIENT PROFILE ──────────────────────────────────────────────────
router.get('/profile', async (req, res) => {
  try {
    const userId = req.userId;

    console.log('🔍 Getting profile for user:', userId);

    // Get user with all fields
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.log('❌ User not found:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('👤 User found:', user.email);

    // Get patient by email
    let patient = await prisma.patient.findUnique({
      where: { email: user.email }
    });

    // If patient doesn't exist, create one from user data
    if (!patient) {
      console.log('📝 Creating patient from user data:', user.email);
      patient = await prisma.patient.create({
        data: {
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          birthDate: user.birthDate || null,
          address: user.address || null,
          bloodType: user.bloodType || null,
          allergies: user.allergies || null,
          antecedents: user.antecedents || null,
          medications: user.medications || null,
          emergencyContact: user.emergencyContact || null,
          emergencyPhone: user.emergencyPhone || null,
          createdBy: userId
        }
      });
      console.log('✅ Patient created:', patient.id);
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('❌ Get patient profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ─── UPDATE PATIENT PROFILE ────────────────────────────────────────────────
router.put('/profile', async (req, res) => {
  try {
    const userId = req.userId;
    const {
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
      bloodType
    } = req.body;

    console.log('📝 Updating patient profile for user:', userId);
    console.log('📊 Data received:', req.body);

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Le nom est requis'
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'L\'email est requis'
      });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.log('❌ User not found:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('👤 Current user email:', user.email);

    // ============================================================
    // STEP 1: Update the USER record (has ALL medical fields)
    // ============================================================
    console.log('🔄 Updating user:', userId);
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone || null,
        birthDate: birthDate || null,
        address: address || null,
        bloodType: bloodType || null,
        allergies: allergies || null,
        antecedents: antecedents || null,
        medications: medications || null,
        emergencyContact: emergencyContact || null,
        emergencyPhone: emergencyPhone || null,
        updatedAt: new Date()
      }
    });
    console.log('✅ User updated:', updatedUser.id);

    // ============================================================
    // STEP 2: Update the PATIENT record (has ALL medical fields)
    // ============================================================
    let patient = await prisma.patient.findUnique({
      where: { email: user.email }
    });

    if (patient) {
      // Update existing patient
      console.log('🔄 Updating existing patient:', patient.id);
      patient = await prisma.patient.update({
        where: { email: user.email },
        data: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone || null,
          birthDate: birthDate || null,
          address: address || null,
          bloodType: bloodType || null,
          allergies: allergies || null,
          antecedents: antecedents || null,
          medications: medications || null,
          emergencyContact: emergencyContact || null,
          emergencyPhone: emergencyPhone || null,
          updatedAt: new Date()
        }
      });
      console.log('✅ Patient updated:', patient.id);
    } else {
      // Create new patient
      console.log('📝 Creating new patient');
      patient = await prisma.patient.create({
        data: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone || null,
          birthDate: birthDate || null,
          address: address || null,
          bloodType: bloodType || null,
          allergies: allergies || null,
          antecedents: antecedents || null,
          medications: medications || null,
          emergencyContact: emergencyContact || null,
          emergencyPhone: emergencyPhone || null,
          createdBy: userId
        }
      });
      console.log('✅ Patient created:', patient.id);
    }

    // ============================================================
    // STEP 3: Fetch the updated patient to return
    // ============================================================
    const updatedPatient = await prisma.patient.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    console.log('✅ Profile update complete - BOTH User and Patient updated');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedPatient,
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ Update patient profile error:', error);

    // Handle Prisma unique constraint error
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Un patient avec cet email existe déjà'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ─── GET SINGLE PATIENT ──────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
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
    console.error('❌ Error fetching patient:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ─── CREATE PATIENT ──────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, birthDate, address } = req.body;

    console.log('📝 Creating patient with data:', req.body);

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Le nom du patient est requis'
      });
    }

    let patientEmail = email;
    if (!patientEmail || patientEmail.trim() === '') {
      const baseEmail = name.replace(/\s/g, '').toLowerCase();
      patientEmail = `${baseEmail}${Date.now()}@email.com`;
      console.log('📧 Generated email:', patientEmail);
    }

    // Check if patient already exists by email
    const existing = await prisma.patient.findUnique({
      where: { email: patientEmail }
    });

    if (existing) {
      console.log('⚠️ Patient already exists with email:', patientEmail);
      return res.status(409).json({
        success: false,
        message: 'Un patient avec cet email existe déjà',
        existingPatient: existing
      });
    }

    // Create patient
    const patient = await prisma.patient.create({
      data: {
        name: name.trim(),
        email: patientEmail,
        phone: phone || '',
        birthDate: birthDate || null,
        address: address || null,
        createdBy: req.userId
      }
    });

    console.log('✅ Patient created:', patient);
    res.status(201).json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('❌ Error creating patient:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Un patient avec cet email existe déjà'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ─── UPDATE PATIENT ──────────────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      birthDate,
      address,
      allergies,
      antecedents,
      medications,
      bloodType,
      emergencyContact,
      emergencyPhone
    } = req.body;

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        name: name?.trim(),
        email: email?.trim().toLowerCase(),
        phone: phone || null,
        birthDate: birthDate || null,
        address: address || null,
        allergies: allergies || null,
        antecedents: antecedents || null,
        medications: medications || null,
        bloodType: bloodType || null,
        emergencyContact: emergencyContact || null,
        emergencyPhone: emergencyPhone || null,
        updatedAt: new Date()
      }
    });

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('❌ Error updating patient:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ─── DELETE PATIENT ──────────────────────────────────────────────────────
router.delete('/:id', authorize('secretary', 'doctor'), async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.appointment.deleteMany({
      where: { patientId: id }
    });

    await prisma.patient.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Patient and related appointments deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting patient:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;