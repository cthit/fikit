const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

console.log("test")

app.post('/getSittande', (req, res) => {
  const year = req.body.year; // Extract year from request body
  console.log(year);
  const filePath = 'patetos/' + year + '.json'; // Construct file path
  console.log(filePath);
  try {
    let people = fs.readFileSync(filePath, 'utf8'); // Read file synchronously
    people = JSON.parse(people); // Parse JSON data
    
    res.status(200).json({ people }); // Send the content back to the client
  } catch (err) {
    console.error('Error reading file:', err);
    res.status(500).json({ error: 'Failed to retrieve sittande' });
  }
});





// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});