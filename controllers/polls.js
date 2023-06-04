const express = require('express');
const router = express.Router();

// use Poll model for poll questions, answers, and counts
const Poll = require('../models/poll');

// global auth check to make methods authorized only
const global = require('../controllers/globalFunctions');


/* GET /create - display form to add an employer */
// Injecting auth check function as middlware for security
router.get('/create', global.isAuthenticated, (req, res) => {
            res.render('polls/create', {
                title: 'Create a poll',
                user: req.user
            });
       }
);    

  /* POST - Create */
router.post('/create', global.isAuthenticated, async (req, res) => {  
    try {
      const newPoll = await Poll.create(req.body);
      console.log(newPoll);
      res.redirect(`/polls/${newPoll._id}`); // Redirect to the new poll page
    } catch (err) {
      res.status(500).json({ error: err.message });
    }   
  });

/* GET - Delete */
router.get('/delete/:id',  global.isAuthenticated,  async (req, res) => {
    try {
      const deletedPoll = await Poll.findByIdAndDelete(req.params.id);
      res.redirect('/');
    } catch (err) {
      res.status(900).json({ error: err.message });
    }
});

// INDIVIDUAL
/* GET - Read individual Poll by ID */
router.get('/:id', global.hasVoted, async function(req, res) {
  const pollId = req.params.id;
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    try {
      const poll = await Poll.findById(pollId);
      if (!poll) {
        res.status(404).send('Poll not found');
      } else {
        res.render('polls/index', { 
          title: 'Poll',
          poll: poll,
          user: req.user,
          hasVoted: req.hasVoted,
          messages: req.messages,
          pollUrl: fullUrl
        });
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  

// make public
module.exports = router;