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
      console.log(req.body);
      res.redirect('/');
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
router.get('/:id', async function(req, res) {
    try {
      const poll = await Poll.findById(req.params.id);
      if (!poll) {
        res.status(404).send('Poll not found');
      } else {
        res.render('polls/index', { 
        title: 'Poll',
         poll: poll,
         user: req.user
        });
      }
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  /* GET - Edit form view */
router.get('/edit/:id', global.isAuthenticated, async function(req, res) { 
    try {
      const poll = await Poll.findById(req.params.id).exec();
      if (!poll) {
        console.log("Poll not found");
        return res.status(404).json({ error: 'Poll not found' });
      }
      res.render('polls/edit', { 
        poll: poll,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
    
    /* POST - Edit */
    router.post('/edit/:id', global.isAuthenticated, async (req, res) => {
      try {
        const updatedPoll = await Poll.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.redirect('/');
      } catch (err) {
        res.status(900).json({ error: err.message });
      }
    });

    /* POST - VOTE */ 
    router.post('/vote/:id', async (req, res) => {
        const pollId = req.params.id;
        const voteCountField = req.body.vote;
        try {
          const updatedPoll = await Poll.updateOne(
            { _id: pollId },
            { $inc: { [voteCountField]: 1 } }
          );
          res.redirect('/polls/' + pollId);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      });

// make public
module.exports = router;