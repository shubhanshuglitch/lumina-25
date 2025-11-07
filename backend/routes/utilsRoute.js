const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const authMiddleware = require('../middleware/authmiddleware');

// Initialize OpenAI Client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * @route   POST /api/utils/summarize-text
 * @desc    Summarizes a block of text
 * @access  Private
 */
router.post('/summarize-text', authMiddleware, async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'No text provided' });
  }

  try {
    const aiPrompt = `
      You are an academic assistant. Summarize the following announcement or newsletter 
      into one or two concise sentences. Focus on the main action or key information.

      Text:
      ---
      ${text}
      ---
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: aiPrompt }],
    });

    const summary = completion.choices[0].message.content;
    res.json({ summary: summary });

  } catch (error) {
    console.error('Text summarization error:', error);
    res.status(500).json({ message: 'Error generating summary' });
  }
});

module.exports = router;