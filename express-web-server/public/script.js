document.addEventListener('DOMContentLoaded', function() {
    const messagesContainer = document.getElementById('messages-container');

    // Function to fetch messages and display them
    function fetchMessages() {
        fetch('/messages')
            .then(response => response.json())
            .then(data => {
                messagesContainer.innerHTML = ''; // Clear existing messages
                data.forEach(msg => {
                    const messageDiv = document.createElement('div');
                    messageDiv.classList.add('message');
                    const formattedMessage = msg.replace(/\n/g, '<br>');
                    messageDiv.innerHTML = formattedMessage; // Using innerHTML to parse '<br>'
                    messagesContainer.appendChild(messageDiv);
                });
            })
            .catch(error => console.error('Error fetching messages:', error));
    }

    // Fetch messages every 1 seconds
    setInterval(fetchMessages, 1000);
});
