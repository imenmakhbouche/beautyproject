const prisma = require('../config/prisma');
const realtimeService = require('../services/realtimeService');

const getDocuments = async (req, res) => {
  try {
    const { patientId } = req.query;
    const filter = {};
    if (patientId) filter.patientId = patientId;

    const documents = await prisma.document.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createDocument = async (req, res) => {
  try {
    const { patientId, name, type, fileUrl, uploadedBy, date } = req.body;

    const document = await prisma.document.create({
      data: {
        patientId,
        name,
        type: type || 'upload',
        fileUrl,
        uploadedBy: uploadedBy || 'doctor',
        date: date || new Date().toISOString().split('T')[0]
      }
    });

    realtimeService.broadcast('document_created', document);

    res.status(201).json({ success: true, data: document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await prisma.document.findUnique({
      where: { id: req.params.id }
    });

    if (!document) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    await prisma.document.delete({ where: { id: req.params.id } });

    realtimeService.broadcast('document_deleted', { id: req.params.id, patientId: document.patientId });

    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDocuments, createDocument, deleteDocument };