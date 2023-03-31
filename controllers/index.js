const express = require('express');
const router = express.Router();

const Poll = require('../models/poll');

/* GET - FIND ALL */
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find();
    res.render('home', { 
      title: 'Home',
      polls: polls,
      user: req.user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})

module.exports = router;