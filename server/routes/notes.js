const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const Note = require('../models/Note');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// List notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find()
      .populate('uploadedBy', 'name avatarInitials')
      .sort('-createdAt');
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search notes
router.get('/search', async (req, res) => {
  try {
    const q = req.query.q || '';
    const notes = await Note.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { subject: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
      ],
    }).populate('uploadedBy', 'name avatarInitials').sort('-createdAt');
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload note
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'File required' });
    const { title, subject, description } = req.body;

    const note = await Note.create({
      title: title || req.file.originalname,
      subject: subject || '',
      description: description || '',
      uploadedBy: req.user._id,
      fileUrl: '/uploads/' + req.file.filename,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
    });
    await note.populate('uploadedBy', 'name avatarInitials');
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get note
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('uploadedBy', 'name avatarInitials');
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Download note (increment counter)
router.get('/:id/download', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    note.downloads += 1;
    await note.save();
    res.download(path.join(__dirname, '..', note.fileUrl));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
