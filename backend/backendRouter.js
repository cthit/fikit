import express, { Router } from 'express';
import multer from 'multer';
import { uploadPost, uploadProfileImage } from './multer.js';
import fs from 'fs';
import * as path from 'path';

import { validateJSONPost, validateJSONPatetYear, validateJSONPerson } from './jsonValidator.js';
import { addImage } from './imgHandler.js';
import { isAdminKeyValid, getUsernameFromAdminKey, pathToCredentialsFile } from '../server.js'

import {pathToPatetosFile, pathToPostsFile, pathToPatetosImages} from '../server.js';



function createRandomSuffix() {
	return Date.now() + '-' + Math.round(Math.random() * 1E9)
}


const backRouter = Router();

backRouter.post('/uploadPost', uploadPost.single('postImage'), (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");

	let newPost = req.body.newPost;	
	newPost = JSON.parse(newPost);

	newPost.imageName = path.basename(req.file.filename),
	newPost.creationDate = Date.now();
	newPost.createdBy = getUsernameFromAdminKey(req.body.adminKey);

	if (!validateJSONPost(newPost)) return res.status(400).send("Invalid post data format");

	addImage(newPost, pathToPostsFile);

	res.status(200).send("Post uploaded successfully!");
});

backRouter.post('/removePost', (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");

	let postToRemove = req.body.post;

	let allPosts = fs.readFileSync(pathToPostsFile);
	allPosts = JSON.parse(allPosts);
	allPosts = allPosts.filter(post => post.id !== postToRemove.id);

	fs.writeFileSync(pathToPostsFile, JSON.stringify(allPosts, null, 2));

	// Remove the corresponding image file
	const imagePath = path.join('public', 'img', 'postImages', postToRemove.imageName);
	fs.unlinkSync(imagePath); // This will delete the image file
	
	res.status(200).send("Post removed successfully!");
});

backRouter.get('/getPosts', (req, res) => {
	let activePosts = fs.readFileSync(pathToPostsFile);
	activePosts = JSON.parse(activePosts);
	res.status(200).send(activePosts);
});


backRouter.get('/getAllPeople', (req, res) => {
	let allPatetos = fs.readFileSync(pathToPatetosFile);
	allPatetos = JSON.parse(allPatetos);
	res.status(200).send(allPatetos);
});

backRouter.get('/getAllPatetos', (req, res) => {
	let allPatetos = fs.readFileSync(pathToPatetosFile);
	allPatetos = JSON.parse(allPatetos);
	allPatetos = allPatetos.slice(1);
	res.status(200).send(allPatetos);
});

backRouter.get('/getSittande', (req, res) => {
	let allPatetos = fs.readFileSync(pathToPatetosFile);
	allPatetos = JSON.parse(allPatetos);
	if (allPatetos.length === 0) return res.status(404).send("No sittande found");
	let sittande = allPatetos[0];
	res.status(200).send(sittande);
});	



backRouter.post('/addPerson', (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");

	const newPerson = req.body.newPerson;
	const yearId = req.body.yearId;

	let allPatetos = fs.readFileSync(pathToPatetosFile);
	allPatetos = JSON.parse(allPatetos);
	
	let year = allPatetos.find(year => year.id === yearId);
	year.people.push(newPerson);

	fs.writeFileSync(pathToPatetosFile, JSON.stringify(allPatetos, null, 2));

	res.status(200).send("Person added successfully!");
});

backRouter.post('/deletePerson', (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");

	const personId = req.body.personId;
	const yearId = req.body.yearId;

	let allPatetos = fs.readFileSync(pathToPatetosFile);
	allPatetos = JSON.parse(allPatetos);
	
	let year = allPatetos.find(year => year.id === yearId);
	year.people = year.people.filter(person => person.id !== personId);

	fs.writeFileSync(pathToPatetosFile, JSON.stringify(allPatetos, null, 2));

	res.status(200).send("Person deleted successfully!");
});



backRouter.post('/updatePerson', (req, res) => {	
    uploadProfileImage(req, res, async function (err) {
		if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");

        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: err.message });
        } else if (err) {
            return res.status(500).json({ error: 'An unknown error occurred.' });
        }

        const updatedPerson = JSON.parse(req.body.updatedPerson);

        // Check if there's a file uploaded for the profile picture
        if (req.file) {
            // If a file is uploaded, remove the previous profile picture
            const previousProfilePicture = updatedPerson.imageFile;
            if (previousProfilePicture) {
                const previousImagePath = path.join('public', 'img', 'profileImages', previousProfilePicture);
                fs.unlinkSync(previousImagePath);
            }

            // Update the person's imageFile attribute with the new filename
            updatedPerson.imageFile = req.file.filename;
		}

		let allPatetos = fs.readFileSync(pathToPatetosFile);
		allPatetos = JSON.parse(allPatetos);
		
		let year = allPatetos.find(year => year.id === req.body.yearId);
		let person = year.people.find(person => person.id === updatedPerson.id);
		Object.assign(person, updatedPerson);

		fs.writeFileSync(pathToPatetosFile, JSON.stringify(allPatetos, null, 2));


        return res.status(200).json({ message: 'Person updated successfully.' });
    });
});


// Manage Years

backRouter.post('/addYear', (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");

	const newYear = req.body.newYear;

	let allPatetos = fs.readFileSync(pathToPatetosFile);
	allPatetos = JSON.parse(allPatetos);
	
	allPatetos.push(newYear);

	sortYears(allPatetos);

	fs.writeFileSync(pathToPatetosFile, JSON.stringify(allPatetos, null, 2));

	res.status(200).send("Year added successfully!");
});

backRouter.post('/deleteYear', (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");

	const yearId = req.body.yearId;

	let allPatetos = fs.readFileSync(pathToPatetosFile);
	allPatetos = JSON.parse(allPatetos);
	
	allPatetos = allPatetos.filter(year => year.id !== yearId);

	fs.writeFileSync(pathToPatetosFile, JSON.stringify(allPatetos, null, 2));

	res.status(200).send("Year deleted successfully!");
});

backRouter.post('/updateYear', (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");

	const updatedYear = req.body.updatedYear;

	let allPatetos = fs.readFileSync(pathToPatetosFile);
	allPatetos = JSON.parse(allPatetos);
	
	let year = allPatetos.find(year => year.id === updatedYear.id);
	if (!year) return res.status(404).send("Year not found");

	Object.assign(year, updatedYear);

	sortYears(allPatetos);

	fs.writeFileSync(pathToPatetosFile, JSON.stringify(allPatetos, null, 2));

	res.status(200).send("Year updated successfully!");
});




function sortYears(patetos) {
	patetos.sort((a, b) => {
		const yearA = parseInt(a.year);
		const yearB = parseInt(b.year);
	
		// Check if either year is NaN (not a number)
		if (isNaN(yearA) && isNaN(yearB)) {
			// If both are not numbers, compare them as strings
			return a.year.localeCompare(b.year);
		} else if (isNaN(yearA)) {
			// If yearA is not a number, it should come after yearB
			return 1;
		} else if (isNaN(yearB)) {
			// If yearB is not a number, it should come before yearA
			return -1;
		} else {
			// Both years are numbers, compare them as numbers
			return yearB - yearA;
		}
	});


	return patetos;
}








export default backRouter;