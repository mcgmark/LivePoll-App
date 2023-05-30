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

document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("vote-btn").onclick = function(e) {
        e.preventDefault();
        const vote = document.querySelector('input[name="vote"]:checked').value;
        const pollId = this.dataset.pollid;
        console.log(pollId + ' ' + vote);
        socket.emit('pollVote', pollId, vote);
    };

});