const prisma = require('../config/prisma');

const getPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.query;
    const filter = {};
    if (patientId) filter.patientId = patientId;

    const prescriptions = await prisma.prescription.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      count: prescriptions.length,
      data: prescriptions
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createPrescription = async (req, res) => {
  try {
    const { patientId, patientName, notes, date } = req.body;

    const prescription = await prisma.prescription.create({
      data: {
        patientId,
        patientName,
        notes,
        date: date || new Date().toISOString().split('T')[0],
        createdBy: req.userId
      }
    });

    res.status(201).json({ success: true, data: prescription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPrescriptions, createPrescription };