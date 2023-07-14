const express = require('express'); // require express
const router = express.Router(); // create Router object

// use Poll model for poll questions, answers, and counts
const Poll = require('../models/poll');

// global auth check to make methods authorized only
const global = require('../controllers/globalFunctions');


/* GET /create - display form to create poll */
// Auth check function as middlware 
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
      const newPoll = await Poll.create(req.body); // create new poll in database using form data 
      res.redirect(`/polls/${newPoll._id}`); // Redirect user to the new poll
    } catch (err) {
      res.status(500).json({ error: err.message });
    }   
  });

/* GET - Delete poll route */
router.get('/delete/:id',  global.isAuthenticated,  async (req, res) => {
    try {
      const deletedPoll = await Poll.findByIdAndDelete(req.params.id); // find poll by id and delete from database
      res.redirect('/'); // send user to poll list route
    } catch (err) {
      res.status(900).json({ error: err.message });
    }
});

/* GET - Load individual Poll by ID */
router.get('/:id', global.hasVoted, global.pollOpen, async function(req, res) {
  const pollId = req.params.id;
  const fullUrl = `${req.get('host')}${req.originalUrl}`;
    try {
      const poll = await Poll.findById(pollId);
      if (!poll) {
        res.render('home', { 
          polls: polls,
          user: req.user,
          username: username,
          messages: "Poll Does not Exist"
        });
      } else {
        res.render('polls/index', { 
          title: 'Poll',
          poll: poll,
          user: req.user,
          hasVoted: req.hasVoted,
          active: req.active,
          hours: req.hours,
          minutes: req.minutes,
          messages: req.messages,
          userVote: req.vote,
          pollUrl: fullUrl
        });
      }
    } catch (err) {
      res.render('home', { 
        messages: "Poll Does not Exist"
      });
    }
  });



// make public
module.exports = router;