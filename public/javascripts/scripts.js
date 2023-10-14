// grab dom elements
const pollVoteButton = document.getElementById("vote-btn");
const questionContainer = document.querySelector('#question-container');
let pollId;
questionContainer ? pollId = document.querySelector('#question-container').dataset.pollid : false;

// grab all poll options
const pollOptionElements = document.querySelectorAll('.poll-option');



// function to check if user has voted using dataset
function hasVoted() {
    if (questionContainer) {
        let result = document.getElementById("question-container").dataset.hasvoted;
        let userVote = localStorage.getItem(pollId);
        if (result === 'true' || userVote !== null) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    };
}; 

// function to check if poll is active
function active() {
    if (questionContainer) {
        let result = document.getElementById("question-container").dataset.active;
        if (result == 'true') {
            return true;
        } else {
            return false;
        }     
    } else {
        return false;
    };
}; 

// function for the register page to compare if passwords match for confirmation
function comparePasswords() {
    let pw1 = document.getElementById('password').value;
    let pw2 = document.getElementById('confirm').value;
    let pwMessage = document.getElementById('pwMessage');

    if (pw1 != pw2) {
        pwMessage.innerText = "Passwords do not match";
        pwMessage.className = "text-danger";
        return false;
    } else {
        pwMessage.innerText = "";
        pwMessage.className = "";
        return true;
    }
}

// Function to copy poll link to clipboard
function copyLink(url) {
    navigator.clipboard.writeText(url);
    document.querySelector('#poll-url span').textContent = 'Poll link copied!';
}

// Event handler for vote button
pollVoteButton ? pollVoteButton.onclick = function(e) {
    if (!hasVoted() && active()){
        e.preventDefault();
        const vote = document.querySelector('input[name="vote"]:checked').value;
        const pollVoteClientData = {
            pollId: pollId,
            vote: vote
        };
        socket.emit('pollVote', pollVoteClientData);
    } else {
        e.preventDefault();
    };
} : false;

// If user has voted disable vote button
if (hasVoted() || !active()){
    if (document.getElementById('tab').classList.contains('poll-container')){
        document.querySelector('button').style.cursor = 'default';
        document.querySelector('button').disabled = true;
    }
};


//
//   Page UI Animations on page load
//
///////////////////////////////////////////

// Main page element bounce
var element = document.getElementById('main-inner');
element.style.transform = 'translateY(-25px)';
// new animation object
var animation = element.animate([
    { transform: 'translateY(-10px)' },
    { transform: 'translateY(0)' }
    ], { 
    duration: 1000,
    fill: "forwards",
    easing: 'cubic-bezier(0.68, 0.8, 0.27, 1.55)'
});

// if user hasn't voted, and the poll is active animate the question text 
if (!hasVoted() && active() && questionContainer){
    const question = questionContainer.textContent; // grab question text
    const paragraphHeight = questionContainer.offsetHeight;     // set paragraph height
    questionContainer.style.minHeight = `${paragraphHeight}px`; // paragraph minHeight
    questionContainer.textContent = ''; // after grabbing height set question text to initial blank state 
    questionContainer.style.color = `#fff`; // set font color
    // animate each letter of the question
    for (let i = 0; i < question.length; i++) {
        let letter = question[i];
        setTimeout(function () {
        questionContainer.textContent += letter;
        }, 30 * i);
    };
} else {
    questionContainer ? questionContainer.style.color = `#fff` : false; //Show without animating.
};

// function for event listener to change styles of clicked poll option
function vote() {
    for (let k=0; k<pollOptionElements.length; k++){
        pollOptionElements[k].querySelector('span.answer-label').classList.remove('answer-label-selected');
    }
    this.querySelector('input').checked = true;
    this.querySelector('span.answer-label').classList.add('answer-label-selected');
}

// Animate percentage bars and poll option bounce
if (pollOptionElements) {
    // Add event listener to poll option containers so that entire poll option can be clicked
    if (!hasVoted() && active()){
        for (var i=0; i < pollOptionElements.length; i++){
            pollOptionElements[i].addEventListener('click', vote);
        };
    } else {
        for (var i=0; i < pollOptionElements.length; i++){
            pollOptionElements[i].style.cursor = 'default';
        };
    };

    // Iterate through all pollOptionElements
    // animate to create bounce effect of each poll option
    for (var i=0; i < pollOptionElements.length; i++){
        var pollOption = pollOptionElements[i];
        var animation = pollOption.animate([
            { transform: 'translateY(-10px)' },
            { transform: 'translateY(0)' }
            ], { 
            duration: 500 * (i + 1),
            easing: 'cubic-bezier(0.68, 0.8, 0.27, 1.55)'
        });
    
        // animate the percentage bar width
        var pollOptionPercentageBar = pollOption.querySelector('.percentage-bar');
        percentageBarValue = pollOptionPercentageBar.style.width;
        animationBars = pollOptionPercentageBar.animate([
            { width: '0%', },
            { width: `${percentageBarValue}`}
            ], { 
            duration: 1000 * (i + 1),
            easing: 'cubic-bezier(0.68, 0.8, 0.27, 1.55)'
        });

        // Select the users existing vote
        let vote = document.querySelector('#question-container').dataset.uservote;
        if (pollOption.dataset.answer == vote){
            pollOption.querySelector('span.answer-label').classList.toggle('answer-label-selected');
        };
    };
};

// poll timer
window.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tab').classList.contains('poll-container')){
        const timerElement = document.getElementById('poll-timer');
        const initialHours = parseInt(timerElement.dataset.hours);
        const initialMinutes = parseInt(timerElement.dataset.minutes);

        let hours = initialHours;
        let minutes = initialMinutes;

        const updateTimer = () => {
        if (hours == 0 && minutes == 0) {
            clearInterval(intervalId);
            document.querySelector('.animate-blink').classList.remove('animate-blink');
            document.querySelector('button').innerText = 'POLL CLOSED!'
            document.querySelector('button').disabled = true;
            document.querySelector('button').style.opacity = '0.3';
            document.querySelector('button').classList.remove('blink-animation');
            document.querySelector('button').style.cursor = "default";
            timerElement.innerHTML = 'closed';
            const radioButtons = document.querySelectorAll('.poll-answers label')
            for (let i = 0; i < radioButtons.length; i++) {
                radioButtons[i].style.display = "none";
            }
            const pollOptionElements = document.querySelectorAll('.poll-option');
            for (var i=0; i < pollOptionElements.length; i++){
                pollOptionElements[i].removeEventListener('click', vote);
                pollOptionElements[i].style.cursor = "default";
            };
            return;
        }

        if (minutes == 0) {
            hours--;
            minutes = 59;
        } else {
            minutes--;
        }

        timerElement.innerHTML = `${hours.toString().padStart(2, '0')}h<span class="animate-blink">:</span>${minutes.toString().padStart(2, '0')}m`;
        };

        updateTimer();
        const intervalId = setInterval(updateTimer, 60000); // Update every minute
    };
});


document.addEventListener('DOMContentLoaded', function () {
    // Get the userId from localStorage
    const pollUserId = localStorage.getItem('pollUserId'); // check for existing userId

    if (pollUserId) {
      // Select the list of links
      const pollsList = document.getElementById('polls-list');

      // Get all the <a> elements inside the list
      let pollLinks;
      pollsList ? pollLinks = pollsList.getElementsByTagName('a') : null;

      // Loop through the <a> elements and modify their href attributes
      if (pollLinks) {
        for (const link of pollLinks) {
            // Get the current href value
            const currentHref = link.getAttribute('href');

            // Append the userId as a query parameter
            const updatedHref = `${currentHref}?userId=${pollUserId}`;

            // Update the href attribute with the new value
            link.setAttribute('href', updatedHref);
        };
       };
    };
  });

  
//
// SocketIO Start
///////////////////////////////////

const socket = io(); // create io object

const pollUserId = localStorage.getItem('pollUserId'); // check for existing userId

// Join socketIO room with pollId
socket.emit('join', ({ pollId, pollUserId }));

// Listen for connection success message
socket.on('connected-to-poll', pollUserId => {
    localStorage.setItem('pollUserId', pollUserId);
});

// Listen for connection success message
socket.on('already-voted', () => {
    console.log('LivePoll Connected');
});

// Handle update votes
socket.on('update-poll-results', (voteData) => {
    console.log("test");
    // set variables with data
    const vote = voteData.vote; 
    const voteCount = voteData.voteCount;
    const totalVotes = voteData.totalVotes;
    // calculate new percentage
    const percentage = (voteCount / totalVotes) * 100;
    // grab percentage bar element
    const percentageBar = document.querySelector(`.percentage-bar.${vote}`);
    // set the textContent for the value with the updated vote count.
    document.getElementById(vote).textContent = voteCount;
    // set percentage bar width with new width for vote
    percentageBar.style.width = `${percentage}%`;
    // grab all poll options
    const pollOptions = document.getElementsByClassName('poll-option');
    // set the total votes output to the updated todal votes
    document.getElementById('total-votes').textContent = totalVotes;
    // iterate through all of the poll options and update the percentage bars
    for (var i=0; i < pollOptions.length; i++){
        var pollOption = pollOptions[i]; // grab specific poll option
        var pollOptionValue = pollOption.querySelector('.vote-count').textContent; // grab the amount of votes
        const pollOptionPercentageBar = pollOption.querySelector('.percentage-bar');  // grab the percentage bar 
        var newPercentageValue = (pollOptionValue / totalVotes) * 100; // calculate new percentage using vote value and total votes
        pollOptionPercentageBar.style.width = `${newPercentageValue}%`; // update style value of poll option percentage bar element
    }
});

// Handle vote success
socket.on('vote-success', (voteData) => {
    document.querySelector('button').textContent = 'SUCCESS! VOTE COUNTED';
    document.querySelector('button').disabled = true;
    document.querySelector('button').style.opacity = '0.3';
    document.querySelector('button').classList.remove('blink-animation');
    document.querySelector('button').style.cursor = "default";
    const radioButtons = document.querySelectorAll('.poll-answers label')
    localStorage.setItem(voteData.pollId, voteData.vote);
    for (let i = 0; i < radioButtons.length; i++) {
        radioButtons[i].style.display = "none";
    }
    const pollOptionElements = document.querySelectorAll('.poll-option');
    for (var i=0; i < pollOptionElements.length; i++){
        pollOptionElements[i].removeEventListener('click', vote);
        pollOptionElements[i].style.cursor = "default";
    };
});

socket.on('already-voted', () => {
    console.log("Already Voted!");
})

// SocketIO End