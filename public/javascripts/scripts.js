document.addEventListener("DOMContentLoaded", function() {
    const socket = io();

    // grab poll id and vote button
    const pollIdButton = document.getElementById("vote-btn");
    const pollId = document.getElementById("question-container").dataset.pollid;
    console.log(pollId);

    // Join socketIO room with pollId
    socket.emit('join', pollId);

    // Listen for connection success message
    socket.on('connected-to-poll', room => {
       console.log('Live Poll Updates Started');
    });

    // Handle update votes
    socket.on('update-poll-results', (vote, voteCount, totalVotes) => {
        const percentage = (voteCount / totalVotes) * 100;
        const percentageBar = document.querySelector(`.percentage-bar.${vote}`);
        document.getElementById(vote).textContent = voteCount;
        percentageBar.style.width = `${percentage}%`;
        const pollOptions = document.getElementsByClassName('poll-option');
        document.querySelector('#total-votes').textContent = totalVotes;
        for (var i=0; i < pollOptions.length; i++){
            var pollOption = pollOptions[i];
            var pollOptionValue = pollOption.querySelector('.vote-count').textContent;
            var pollOptionPercentageBar = pollOption.querySelector('.percentage-bar');
            var newPercentageValue = (pollOptionValue / totalVotes) * 100;
            pollOptionPercentageBar.style.width = `${newPercentageValue}%`;
        }
    });


    // Handle vote success
    socket.on('vote-success', () => {
        document.querySelector('button').textContent = 'SUCCESS! VOTE COUNTED';
        document.querySelector('button').setAttribute('disabled', '');
        document.querySelector('button').style.opacity = '0.3';
        document.querySelector('button').classList.remove('blink-animation');
        const radioButtons = document.querySelectorAll('.poll-answers label')
        for (let i = 0 ; i < radioButtons.length; i++) {
            radioButtons[i].style.display = "none";
        }
    });

    pollIdButton ? pollIdButton.onclick = function(e) {
        e.preventDefault();
        const vote = document.querySelector('input[name="vote"]:checked').value;
        socket.emit('pollVote', pollId, vote);
    } : false;

});


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

// Page UI Animations

// Main

var element = document.getElementById('main-inner');
element.style.transform = 'translateY(-25px)';

var animation = element.animate([
{ transform: 'translateY(-10px)' },
{ transform: 'translateY(0)' }
], { 
duration: 1000,
fill: "forwards",
easing: 'cubic-bezier(0.68, 0.8, 0.27, 1.55)'
});

animation.onfinish = function() {
element.style.transform = 'translateY(0)';
};


// Poll Options

const pollOptionElements = document.querySelectorAll('.poll-animate');

for (var i=0; i < pollOptionElements.length; i++){
    pollOptionElements[i].addEventListener('click', function() {
        this.querySelector('input').checked = true;
    })
}

for (var i=0; i < pollOptionElements.length; i++){
    var pollOption = pollOptionElements[i];
    var animation = pollOption.animate([
        { transform: 'translateY(-10px)' },
        { transform: 'translateY(0)' }
        ], { 
        duration: 500 * (i + 1),
        easing: 'cubic-bezier(0.68, 0.8, 0.27, 1.55)'
    });

    var pollOptionPercentageBar = pollOption.querySelector('.percentage-bar');
    pollOptionPercentageBar ? percentageBarValue = pollOptionPercentageBar.style.width : false;
    pollOptionPercentageBar ? animationBars = pollOptionPercentageBar.animate([
        { width: '0%', },
        { width: `${percentageBarValue}`}
        ], { 
        duration: 1000 * (i + 1),
        easing: 'cubic-bezier(0.68, 0.8, 0.27, 1.55)'
    }) : false;
};

