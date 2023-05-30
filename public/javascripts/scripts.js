document.addEventListener("DOMContentLoaded", function() {
    const socket = io(); 

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

    // grab poll id
    const pollId = document.getElementById("vote-btn").dataset.pollid;
    console.log(pollId);

    // Join socketIO room with pollId
    socket.emit('join', pollId);

    // Listen for connection success message
    socket.on('connected-to-poll', room => {
       console.log('Live Poll Updates Started');
    });

    // Handle update votes
    socket.on('update-poll-results', (answer, answerCount) => {
        // Update the corresponding <span> element with the new vote count
        document.getElementById(answer).textContent = answerCount;
    });

    document.getElementById("vote-btn").onclick = function(e) {
        e.preventDefault();
        const vote = document.querySelector('input[name="vote"]:checked').value;
        console.log(pollId + ' ' + vote);
        socket.emit('pollVote', pollId, vote);
    };

});