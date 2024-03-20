import express from 'express';
import fs from 'fs';
import dotenv from 'dotenv';

import backRouter from './backend/backendRouter.js';
import commiteeRouter from './backend/commiteeRouter.js';

dotenv.config();


const port = process.env.PORT || 3000;

const app = express();

// Serve static files from the 'public' folder
app.use(express.static('public'));
app.use(express.json());


const dataFolderPath = "data/";
export const pathToCommiteeFile = dataFolderPath + "commitee.json";
export const pathToPatetosImages = dataFolderPath + "public/img/profileImages";
export const pathToPostsFile = dataFolderPath + "posts.json";
export const pathToPatetosFile = dataFolderPath + "patetos.json";
export const pathToCredentialsFile = dataFolderPath + "credentials.json";
const pathToAdminkeysFile = dataFolderPath + "adminKeys.json";


const dataFiles = [pathToPostsFile, pathToPatetosFile, pathToCredentialsFile, pathToAdminkeysFile];

const adminKeysLifeTime = 10 * 24 * 60 * 60 * 1000; // 10 days in milliseconds

// UPLOAD NEW POST
app.use('/api', backRouter)
app.use('/api/commitee', commiteeRouter)



function createStartupFiles() {
  if (!fs.existsSync(pathToCommiteeFile)) throw new Error('Commitee file not found');
  
  if (!fs.existsSync(dataFolderPath)) fs.mkdirSync(dataFolderPath);

  dataFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, '[]');
    }
  });
}  

createStartupFiles();



// LOGIN SYSTEM
app.post('/login', (req, res) => {
  removeUnvalidAdminKeys();
  
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

function getCredentials() {
  let credentials = fs.readFileSync(pathToCredentialsFile);
  return JSON.parse(credentials);
}

function getAdminKeys() {
  if (fs.existsSync(pathToAdminkeysFile)) {
    const adminKeys = fs.readFileSync(pathToAdminkeysFile, 'utf8');
    return JSON.parse(adminKeys);
  }
  else {
    throw new Error('Adminkeys file not found');
  }
}

function credentialsIsValid(username, pass) {
  const userCredentials = getCredentials();
  for (const user of userCredentials) {
    if (user.name === username && user.password === pass) {
      console.log('User:', user.name, "pass:", user.password);
      return true;
    }
  }
  return false;
}

export function getUsernameFromAdminKey(adminKey) {
  let adminKeys = getAdminKeys();
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
  let adminKeys = getAdminKeys();

  // Add the new admin key data to the array
  adminKeys.push(adminKeyData);

  // Write the updated admin keys array back to the file
  fs.writeFileSync(pathToAdminkeysFile, JSON.stringify(adminKeys, null, 2));
}

export function isAdminKeyValid(adminKey) {
  const currentDate = new Date();
  const tenDaysAgo = new Date(currentDate.getTime() - (adminKeysLifeTime));
  const adminKeys = getAdminKeys();

  // Find the admin key in the adminKeys array
  const adminKeyData = adminKeys.find(keyData => keyData.key === adminKey);
  if (!adminKeyData) {
      return false; // Admin key not found
  }

  // Parse the saved date and compare it with ten days ago
  const savedDate = new Date(adminKeyData.date);
  return savedDate >= tenDaysAgo;
}


function removeUnvalidAdminKeys() {
  const currentDate = new Date();
  const tenDaysAgo = new Date(currentDate.getTime() - (adminKeysLifeTime));
  let adminKeys = getAdminKeys();

  adminKeys = adminKeys.filter(keyData => {
    const savedDate = new Date(keyData.date);
    return savedDate >= tenDaysAgo;
  });

  fs.writeFileSync(pathToAdminkeysFile, JSON.stringify(adminKeys, null, 2));
}

backRouter.post('/updateUserCredentials', (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");

	const newUsername = req.body.username;
	const newPassword = req.body.password;

	let adminKeys = fs.readFileSync(pathToAdminkeysFile);
  adminKeys = JSON.parse(adminKeys);
  adminKeys.filter(keyData => keyData.key !== req.body.adminKey);
  fs.writeFileSync(pathToAdminkeysFile, JSON.stringify(adminKeys, null, 2));
  
  let credentials = fs.readFileSync(pathToCredentialsFile);
	credentials = JSON.parse(credentials);

  try {
    credentials.find(user => user.name === getUsernameFromAdminKey()).password = newPassword;
    credentials.find(user => user.name === getUsernameFromAdminKey).username = newUsername;
  } catch (error) {
    return res.status(404).send("User not found");
  }


	fs.writeFileSync(pathToCredentialsFile, JSON.stringify(credentials, null, 2));
	res.send(200).send("Credentials updated successfully!");
});



// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});