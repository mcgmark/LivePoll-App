const express = require('express'); // Require express
const router = express.Router(); // create Router object
const Poll = require('../models/poll'); // require poll model

/* GET - Grab and display list of polls */
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find(); //GRab all polls from Poll model
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