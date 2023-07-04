// SocketIO
const socket = io(); // create io object

// grab poll id and vote button
const pollVoteButton = document.getElementById("vote-btn");
const questionContainer = document.querySelector('#question-container');
let pollId;
questionContainer ? pollId = document.querySelector('#question-container').dataset.pollid : false;


// Code to setup interface depending if the user voted
// check if user has voted by checking if buttin is disabled
function hasVoted() {
    if (questionContainer) {
        let result = document.getElementById("question-container").dataset.hasvoted;
        return result;      
    } else {
        return false;
    };
}; 

// if user hasn't voted animate the question display
if (hasVoted() == 'false' && questionContainer){
    // grab question
    const question = questionContainer.textContent;
    // set paragraph height
    const paragraphHeight = questionContainer.offsetHeight;
    questionContainer.style.minHeight = `${paragraphHeight}px`;
    // set question text to initial blank state
    questionContainer.textContent = '';
    questionContainer.style.color = `#fff`;
    // animate each letter of the question
    for (let i = 0; i < question.length; i++) {
        let letter = question[i];
        setTimeout(function () {
        questionContainer.textContent += letter;
        }, 30 * i);
    };
} else {
    questionContainer ? questionContainer.style.color = `#fff` : false;
};

// SocketIO Start

// Join socketIO room with pollId
socket.emit('join', pollId);

// Listen for connection success message
socket.on('connected-to-poll', room => {
    console.log('LivePoll Connected');
});

// Handle update votes
socket.on('update-poll-results', (voteData) => {
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
    document.querySelector('#total-votes').textContent = totalVotes;
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
socket.on('vote-success', () => {
    document.querySelector('button').textContent = 'SUCCESS! VOTE COUNTED';
    document.querySelector('button').setAttribute('disabled', '');
    document.querySelector('button').style.opacity = '0.3';
    document.querySelector('button').classList.remove('blink-animation');
    document.querySelector('button').style.cursor = "default";
    const radioButtons = document.querySelectorAll('.poll-answers label')
    for (let i = 0; i < radioButtons.length; i++) {
        radioButtons[i].style.display = "none";
    }
    const pollOptionElements = document.querySelectorAll('.poll-option');
    for (var i=0; i < pollOptionElements.length; i++){
        pollOptionElements[i].removeEventListener('click', vote);
        pollOptionElements[i].style.cursor = "default";
    };
});

// SocketIO End


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
    document.querySelector('div#poll-url span').textContent = 'Poll link copied!';
}

// Event handler for vote button
pollVoteButton ? pollVoteButton.onclick = function(e) {
    if (hasVoted() == 'false'){
        console.log("test");
        e.preventDefault();
        const vote = document.querySelector('input[name="vote"]:checked').value;
        const pollVoteClientData = {
            pollId: pollId,
            vote: vote
        };
        socket.emit('pollVote', pollVoteClientData);
    };
} : false;


// Page UI Animations on page load

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


// Poll Options Bounce Animation
// grab all poll options
const pollOptionElements = document.querySelectorAll('.poll-option');

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
    if (hasVoted() == 'false'){
        for (var i=0; i < pollOptionElements.length; i++){
            pollOptionElements[i].addEventListener('click', vote);
        };
    } else {
        document.querySelector('button').style.cursor = 'default';
        for (var i=0; i < pollOptionElements.length; i++){
            pollOptionElements[i].style.cursor = 'default';
        };
    };

    
    // Iterate through all pollOptionElements
    for (var i=0; i < pollOptionElements.length; i++){
        // animate transform translate to create bounce effect of each poll option
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

        let vote = document.querySelector('#question-container').dataset.uservote;
        if (pollOption.classList.contains(vote)){
            pollOption.querySelector('span.answer-label').classList.toggle('answer-label-selected');
        };
    };
};


