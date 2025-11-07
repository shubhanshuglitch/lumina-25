const express = require('express');
const router = express.Router(); // 👈 THIS IS THE MISSING PIECE

// --- ALL OTHER IMPORTS ---
const admin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const pdf = require('pdf-parse');
const OpenAI = require('openai');

// --- MIDDLEWARE IMPORTS ---
const authMiddleware = require('../middleware/authMiddleware');
const getMongoUser = require('../middleware/getMongoUser');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// --- MODEL IMPORT ---
const Resource = require('../models/Resource');

// --- INITIALIZE OPENAI ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// === DEFINE YOUR ROUTES ===

/**
 * @route   GET /api/resources
 * @desc    Get all resources
 * @access  Private
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate('uploader', 'name')
      .sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resources' });
  }
});

/**
 * @route   POST /api/resources/upload
 * @desc    Upload a new resource
 * @access  Private (Faculty/Senior)
 */
router.post(
  '/upload',
  authMiddleware,
  getMongoUser,
  roleMiddleware(['faculty', 'senior']),
  upload.single('file'), // 'file' must match the FormData key
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
      }

      const { title, type } = req.body;
      if (!title || !type) {
        return res.status(400).json({ message: 'Title and type are required.' });
      }

      const bucket = admin.storage().bucket();
      const fileName = `${uuidv4()}-${req.file.originalname}`;
      const file = bucket.file(`resources/${fileName}`);

      const stream = file.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      stream.on('error', (err) => {
        console.error('File upload error:', err);
        res.status(500).json({ message: 'Error uploading file.' });
      });

      stream.on('finish', async () => {
        await file.makePublic();
        const publicUrl = file.publicUrl();

        const newResource = new Resource({
          title,
          type,
          fileUrl: publicUrl,
          fileName: fileName,
          uploader: req.mongoUser._id,
        });
        await newResource.save();

        res.status(201).json(newResource);
      });

      stream.end(req.file.buffer);

    } catch (error) {
      console.error('Upload endpoint error:', error);
      res.status(500).json({ message: 'Server error during upload' });
    }
  }
);

/**
 * @route   POST /api/resources/:id/summarize
 * @desc    Generates and saves a summary for a resource
 * @access  Private
 */
router.post('/:id/summarize', authMiddleware, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.summary) {
      return res.json({
        summary: resource.summary,
        keyPoints: resource.keyPoints,
        quiz: resource.quiz,
      });
    }

    let textContent = '';
    if (resource.fileUrl.endsWith('.pdf')) {
      const response = await axios.get(resource.fileUrl, {
        responseType: 'arraybuffer',
      });
      const data = await pdf(response.data);
      textContent = data.text;
    } else {
      textContent = `This file type (${resource.type}) is not supported for summarization. The file title is ${resource.title}.`;
    }

    const aiPrompt = `
      You are an academic assistant. Analyze the following text from a college document.
      Please provide a response in JSON format with three keys:
      1. "summary": A concise, one-paragraph summary.
      2. "keyPoints": An array of the 3-5 most important bullet points or takeaways.
      3. "quiz": An array of 2 multiple-choice questions based on the text, each with a "question", an "options" array, and the correct "answer".

      Here is the text:
      ---
      ${textContent.substring(0, 15000)}
      ---
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      response_format: { type: "json_object" },
      messages: [{ role: 'system', content: aiPrompt }],
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content);

    resource.summary = aiResponse.summary;
    resource.keyPoints = aiResponse.keyPoints;
    resource.quiz = aiResponse.quiz;
    await resource.save();

    res.json(aiResponse);

  } catch (error) {
    console.error('Summarization Error:', error);
    if (error.response && error.response.data) {
        console.error('OpenAI Error Details:', error.response.data);
    }
    res.status(500).json({ message: 'Error generating summary', details: error.message });
  }
});


// === EXPORT THE ROUTER ===
// This must be at the very bottom
module.exports = router;