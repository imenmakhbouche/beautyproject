const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Register function - Updated to handle ALL patient fields
const register = async (req, res) => {
  try {
    console.log('📝 Registration request received:', req.body);

    const {
      name,
      email,
      password,
      phone,
      role,
      // Patient fields
      birthDate,
      address,
      bloodType,
      allergies,
      antecedents,
      medications,
      emergencyContact,
      emergencyPhone
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 1. CREATE USER with ALL fields
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || 'patient',
        phone: phone || '',
        birthDate: birthDate || null,
        address: address || null,
        bloodType: bloodType || null,
        allergies: allergies || null,
        antecedents: antecedents || null,
        medications: medications || null,
        emergencyContact: emergencyContact || null,
        emergencyPhone: emergencyPhone || null,
      }
    });

    console.log('✅ User created:', user.email);
    console.log('📊 User data:', user);

    // 2. CREATE PATIENT with ALL fields linked to user
    let patient = null;
    if (user.role === 'patient') {
      try {
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
            createdBy: user.id
          }
        });
        console.log('✅ Patient record created and linked to user:', user.email);
        console.log('📊 Patient data:', patient);
      } catch (patientError) {
        console.error('❌ Error creating patient:', patientError);
        // Rollback user creation if patient creation fails
        await prisma.user.delete({ where: { id: user.id } });
        return res.status(500).json({
          success: false,
          message: 'Failed to create patient profile: ' + patientError.message
        });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Return success response with ALL data
    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        birthDate: user.birthDate,
        address: user.address,
        bloodType: user.bloodType,
        allergies: user.allergies,
        antecedents: user.antecedents,
        medications: user.medications,
        emergencyContact: user.emergencyContact,
        emergencyPhone: user.emergencyPhone,
        patientId: patient ? patient.id : null
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration: ' + error.message
    });
  }
};

// Login function - Returns complete patient data
const login = async (req, res) => {
  try {
    console.log('🔐 Login request received:', req.body.email);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        patientsCreated: {
          where: { email: email }
        }
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    let patient = null;
    let patientId = null;

    if (user.role === 'patient') {
      if (user.patientsCreated && user.patientsCreated.length > 0) {
        patient = user.patientsCreated[0];
        patientId = patient.id;
        console.log('✅ Patient found:', patient);
      } else {
        // Create patient if it doesn't exist (fallback)
        try {
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
              createdBy: user.id
            }
          });
          patientId = patient.id;
          console.log(`✅ Patient record auto-created on login for: ${user.email}`);
        } catch (error) {
          console.error('❌ Failed to create patient on login:', error);
        }
      }
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Return user with ALL fields
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        birthDate: user.birthDate,
        address: user.address,
        bloodType: user.bloodType,
        allergies: user.allergies,
        antecedents: user.antecedents,
        medications: user.medications,
        emergencyContact: user.emergencyContact,
        emergencyPhone: user.emergencyPhone,
        patientId: patientId,
        patient: patient ? {
          id: patient.id,
          name: patient.name,
          email: patient.email,
          phone: patient.phone,
          birthDate: patient.birthDate,
          address: patient.address,
          bloodType: patient.bloodType,
          allergies: patient.allergies,
          antecedents: patient.antecedents,
          medications: patient.medications,
          emergencyContact: patient.emergencyContact,
          emergencyPhone: patient.emergencyPhone
        } : null
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Get current user with ALL patient data
const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        patientsCreated: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let patientData = null;
    if (user.role === 'patient' && user.patientsCreated.length > 0) {
      patientData = user.patientsCreated[0];
    }

    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      user: {
        ...userWithoutPassword,
        patient: patientData
      }
    });

  } catch (error) {
    console.error('❌ Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

// Complete patient registration (for updating after step 2)
const completePatientRegistration = async (req, res) => {
  try {
    console.log('📝 Complete registration request:', req.body);

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

    // Update USER with new data
    await prisma.user.update({
      where: { id: user.id },
      data: {
        birthDate: birthDate || user.birthDate,
        address: address || user.address,
        bloodType: bloodType || user.bloodType,
        allergies: allergies || user.allergies,
        antecedents: antecedents || user.antecedents,
        medications: medications || user.medications,
        emergencyContact: emergencyContact || user.emergencyContact,
        emergencyPhone: emergencyPhone || user.emergencyPhone
      }
    });

    // Update PATIENT with new data
    const patient = await prisma.patient.upsert({
      where: { email: user.email },
      update: {
        birthDate: birthDate || null,
        address: address || null,
        bloodType: bloodType || null,
        allergies: allergies || null,
        antecedents: antecedents || null,
        medications: medications || null,
        emergencyContact: emergencyContact || null,
        emergencyPhone: emergencyPhone || null
      },
      create: {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        birthDate: birthDate || null,
        address: address || null,
        bloodType: bloodType || null,
        allergies: allergies || null,
        antecedents: antecedents || null,
        medications: medications || null,
        emergencyContact: emergencyContact || null,
        emergencyPhone: emergencyPhone || null,
        createdBy: user.id
      }
    });

    console.log('✅ Patient record updated for:', user.email);

    res.status(200).json({
      success: true,
      message: 'Patient registration completed successfully!',
      data: patient
    });

  } catch (error) {
    console.error('❌ Complete registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  completePatientRegistration
};