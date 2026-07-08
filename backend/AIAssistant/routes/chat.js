const express = require('express');
const router = express.Router();
const { getChatResponse } = require('../chatService');

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const response = await getChatResponse(messages);
    res.json({ content: response });
  } catch (error) {
    console.error('Chat Route Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
