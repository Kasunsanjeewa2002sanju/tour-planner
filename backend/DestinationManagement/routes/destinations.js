const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const Destination = require('../models/Destination');
const Bookmark = require('../models/Bookmark');
const { authMiddleware, requireRole } = require('../../UserManagement/middleware/auth');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = 'uploads/destinations';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|webp|avif|jfif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    
    if (extname || mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images (JPEG, PNG, WebP, AVIF) are allowed!'));
  },
});

// @route   GET /api/destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ createdAt: -1 });
    
    // Check bookmarks if user is authenticated
    let userBookmarks = [];
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userBookmarks = await Bookmark.find({ user: decoded.id }).select('destination');
      } catch (e) {
        // Token invalid, ignore
      }
    }

    const bookmarkedIds = userBookmarks.map(b => b.destination.toString());
    const results = destinations.map(dest => ({
      ...dest.toObject(),
      isBookmarked: bookmarkedIds.includes(dest._id.toString()) ? 1 : 0
    }));

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/destinations/saved
router.get('/saved', authMiddleware, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id }).populate('destination');
    const results = bookmarks
      .filter(b => b.destination) // Filter out if destination was deleted
      .map(b => ({
        ...b.destination.toObject(),
        isBookmarked: 1
      }));
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/destinations/:id/bookmark
router.post('/:id/bookmark', authMiddleware, async (req, res) => {
  try {
    const existingBookmark = await Bookmark.findOne({ 
      user: req.user.id, 
      destination: req.params.id 
    });

    if (existingBookmark) {
      await Bookmark.findByIdAndDelete(existingBookmark._id);
      return res.json({ isBookmarked: 0, message: 'Bookmark removed' });
    } else {
      const newBookmark = new Bookmark({
        user: req.user.id,
        destination: req.params.id
      });
      await newBookmark.save();
      return res.json({ isBookmarked: 1, message: 'Bookmark added' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   POST /api/destinations
router.post('/', authMiddleware, requireRole('admin', 'super_admin', 'tour_guide'), (req, res, next) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { name, description, location, category, lat, lng, existingImages } = req.body;
    
    let imageUrls = [];
    if (existingImages) {
      imageUrls = Array.isArray(existingImages) ? existingImages : [existingImages];
    }

    if (req.files) {
      const newImages = req.files.map(file => `/uploads/destinations/${file.filename}`);
      imageUrls = [...imageUrls, ...newImages];
    }

    const newDestination = new Destination({
      name,
      description,
      location,
      category,
      coordinates: { lat: lat || 0, lng: lng || 0 },
      images: imageUrls,
      created_by: req.user.id,
    });

    const savedDestination = await newDestination.save();
    res.status(201).json(savedDestination);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   PUT /api/destinations/:id
router.put('/:id', authMiddleware, requireRole('admin', 'super_admin', 'tour_guide'), (req, res, next) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    const { name, description, location, category, lat, lng, existingImages } = req.body;
    
    let imageUrls = [];
    if (existingImages) {
        imageUrls = Array.isArray(existingImages) ? existingImages : [existingImages];
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/destinations/${file.filename}`);
      imageUrls = [...imageUrls, ...newImages];
    }

    const updatedDestination = await Destination.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        location,
        category,
        coordinates: { lat: lat || 0, lng: lng || 0 },
        images: imageUrls,
      },
      { new: true }
    );

    if (!updatedDestination) return res.status(404).json({ message: 'Destination not found' });
    res.json(updatedDestination);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/destinations/:id
router.delete('/:id', authMiddleware, requireRole('admin', 'super_admin', 'tour_guide'), async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ message: 'Destination not found' });

    destination.images.forEach(imagePath => {
      const fullPath = path.join(__dirname, '../../..', imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    await Destination.findByIdAndDelete(req.params.id);
    res.json({ message: 'Destination deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
