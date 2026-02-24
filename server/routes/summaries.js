const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Summary = require('../models/Summary');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, 'summary-' + Date.now() + '-' + file.originalname),
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// Simple text summarizer (mock AI)
function generateSummary(text) {
  const sentences = text.replace(/\n+/g, ' ').split(/[.!?]+/).filter(s => s.trim().length > 20);
  const keyPoints = sentences.slice(0, Math.min(5, sentences.length)).map(s => s.trim() + '.');
  
  const summaryText = keyPoints.length > 0
    ? keyPoints.join(' ')
    : 'This document contains information that has been processed for quick review.';

  const flashcards = keyPoints.slice(0, 3).map((point, i) => ({
    question: `What is the key concept #${i + 1} from this document?`,
    answer: point,
  }));

  return { summaryText, keyPoints, flashcards };
}

// Upload & summarize
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'File required' });

    let extractedText = '';
    
    // Try to extract text from PDF
    if (req.file.mimetype === 'application/pdf') {
      try {
        const pdfParse = require('pdf-parse');
        const dataBuffer = fs.readFileSync(req.file.path);
        const pdfData = await pdfParse(dataBuffer);
        extractedText = pdfData.text;
      } catch (e) {
        extractedText = 'PDF content could not be extracted. This is a summary placeholder.';
      }
    } else {
      // For non-PDF files, read as text
      try {
        extractedText = fs.readFileSync(req.file.path, 'utf8');
      } catch (e) {
        extractedText = 'File content processed for summarization.';
      }
    }

    const { summaryText, keyPoints, flashcards } = generateSummary(extractedText);

    const summary = await Summary.create({
      title: req.body.title || req.file.originalname,
      originalFileUrl: '/uploads/' + req.file.filename,
      originalFileName: req.file.originalname,
      summaryText,
      keyPoints,
      flashcards,
      createdBy: req.user._id,
    });
    await summary.populate('createdBy', 'name avatarInitials');
    res.status(201).json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List summaries
router.get('/', async (req, res) => {
  try {
    const summaries = await Summary.find()
      .populate('createdBy', 'name avatarInitials')
      .sort('-createdAt');
    res.json(summaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get summary
router.get('/:id', async (req, res) => {
  try {
    const summary = await Summary.findById(req.params.id)
      .populate('createdBy', 'name avatarInitials');
    if (!summary) return res.status(404).json({ error: 'Summary not found' });
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
