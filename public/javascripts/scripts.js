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
        console.log(percentage);
        document.getElementById(vote).textContent = voteCount;
        percentageBar.style.width = `${percentage}%`;
        console.log(percentageBar.style.width);
    });

    // Handle vote success
    socket.on('vote-success', () => {
        document.querySelector('button').style.display = 'none';
        const radioButtons = document.querySelectorAll('label')
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
function copyLink() {
    const urlContainer = document.getElementById('poll-url');
    let url = urlContainer.textContent
    navigator.clipboard.writeText(url);
}