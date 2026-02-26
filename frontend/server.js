const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

// Serve static React build files
app.use(express.static(path.join(__dirname, 'build')));

// Health check endpoint for Railway
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// For any other route, send back the React index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// The PORT env variable is provided by Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Frontend Express Server is running on http://0.0.0.0:${PORT}`);
});
