const express = require('express');
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.static('public')); // Serve static files from 'public' directory

let messages = []; // Array to store messages

// Define a route to receive messages
app.post('/', (req, res) => {
    console.log('Message received:', req.body);
    messages.push(req.body.msg); // Store message in the array
    res.status(200).json({ message: 'Message received' });
});

// Route to send all messages to the client
app.get('/messages', (req, res) => {
    res.status(200).json(messages);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
