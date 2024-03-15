import express from 'express';
import fs from 'fs';

import backRouter from './backend/backendRouter.js';


const app = express();
const port = 3000;

// Serve static files from the 'public' folder
app.use(express.static('public'));
app.use(express.json());



let userCredentials = fs.readFileSync('loginCredentials.json', 'utf8');
userCredentials = JSON.parse(userCredentials); // Parse the JSON string into an object

// console.log(userCredentials);
let allowedDevices = [];




// UPLOAD NEW POST
app.use('/api', backRouter)



// LOGIN SYSTEM
app.post('/login', (req, res) => {
  const username = req.body.username; // Extract username from request body
  const password = req.body.password; // Extract password from request body
  console.log('Username:', username);
  console.log('Password:', password);

  if (credentialsIsValid(username, password)) {
    let adminKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    saveAdminKey(adminKey, username);
    console.log('Admin key:', adminKey);
    res.status(200).json({ adminKey }); // Send the content back to the client
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/testAdminKey', (req, res) => {
  const adminKey = req.body.adminKey; // Extract admin key from request body
  if (isAdminKeyValid(adminKey)) {
    res.status(200).json("Adminkey is valid");
  } else {
    res.status(401).json("Adminkey is not valid");
  }
});

function credentialsIsValid(username, pass) {
  for (const user of userCredentials) {
    if (user.name === username && user.password === pass) {
      console.log('User:', user.name, "pass:", user.password);
      return true;
    }
  }
  return false;
}

export function getUsernameFromAdminKey(adminKey) {
  let adminKeys = fs.readFileSync('adminKeys.json')
  adminKeys.forEach(key => {
    if (key.key === adminKey){
      return key.username
    }
  });
}

function saveAdminKey(adminKey, username) {
  const currentDate = new Date().toISOString();
  const adminKeyData = { key: adminKey, username: username, date: currentDate };

  // Read existing admin keys from file, or create an empty array if the file doesn't exist
  let adminKeys = [];
  if (fs.existsSync('adminKeys.json')) {
      adminKeys = JSON.parse(fs.readFileSync('adminKeys.json', 'utf8'));
  }

  // Add the new admin key data to the array
  adminKeys.push(adminKeyData);

  // Write the updated admin keys array back to the file
  fs.writeFileSync('adminKeys.json', JSON.stringify(adminKeys, null, 2));
}

export function isAdminKeyValid(adminKey) {
  const currentDate = new Date();
  const tenDaysAgo = new Date(currentDate.getTime() - (10 * 24 * 60 * 60 * 1000)); // 10 days ago
  const adminKeys = JSON.parse(fs.readFileSync('adminKeys.json', 'utf8'));

  // Find the admin key in the adminKeys array
  const adminKeyData = adminKeys.find(keyData => keyData.key === adminKey);
  if (!adminKeyData) {
      return false; // Admin key not found
  }

  // Parse the saved date and compare it with ten days ago
  const savedDate = new Date(adminKeyData.date);
  return savedDate >= tenDaysAgo;
}




// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});