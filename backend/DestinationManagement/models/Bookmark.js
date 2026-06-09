const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true,
  }
}, {
  timestamps: true,
});

// Ensure a user can only bookmark a destination once
BookmarkSchema.index({ user: 1, destination: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema);
