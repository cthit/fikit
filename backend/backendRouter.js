import express, { Router } from 'express';
import { upload} from './multer.js';
import { addImage } from './imgHandler.js';
import fs from 'fs';
import { isAdminKeyValid, getUsernameFromAdminKey } from '../server.js'
import * as path from 'path';
import { validateJSONPost, validateJSONPatetYear, validateJSONPerson } from './jsonValidator.js';



const backRouter = Router();

backRouter.post('/uploadPost',upload.single('postImage'), (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");

	let newPost = {
		title : req.body.title,
		description : req.body.description,
		imageName : path.basename(req.file.filename),
		postId : Date.now() + '-' + Math.round(Math.random() * 1E9),
		creationDate : Date.now(),
		createdBy : getUsernameFromAdminKey(req.body.adminKey)
	}
	if (!validateJSONPost(newPost)) return res.status(400).send("Invalid post data format");

	addImage(newPost);

	res.status(200).send("Post uploaded successfully!");
});

backRouter.post('/removePost', (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");

	let postId = req.body.postId;

	let allPosts = fs.readFileSync('public/posts.json');
	allPosts = JSON.parse(allPosts);
	allPosts = allPosts.filter(post => post.postId !== postId);
	fs.writeFileSync('public/posts.json', JSON.stringify(allPosts, null, 2));
	
	res.status(200).send("Post removed successfully!");
});

backRouter.get('/getPosts', (req, res) => {
	let activePosts = fs.readFileSync('public/posts.json');
	activePosts = JSON.parse(activePosts);
	res.status(200).send(activePosts);
});

backRouter.get('/getAllPeople', (req, res) => {
	let allPatetos = fs.readFileSync('patetos.json');
	allPatetos = JSON.parse(allPatetos);
	res.status(200).send(allPatetos);
});

backRouter.get('/getAllPatetos', (req, res) => {
	let allPatetos = fs.readFileSync('patetos.json');
	allPatetos = JSON.parse(allPatetos);
	allPatetos = allPatetos.slice(1);
	res.status(200).send(allPatetos);
});

backRouter.get('/getSittande', (req, res) => {
	let allPatetos = fs.readFileSync('patetos.json');
	allPatetos = JSON.parse(allPatetos);
	if (allPatetos.length === 0) return res.status(404).send("No sittande found");
	let sittande = allPatetos[0];
	res.status(200).send(sittande);
});	

backRouter.post('/addPersonToPatetos', (req, res) => {
	let adminKey = req.body.adminKey;
	let newPerson = req.body.newPerson;
	let year = req.body.year;

	if (!isAdminKeyValid(adminKey)) return res.status(403).send("Adminkey not valid");
	if (!validateJSONPerson(newPerson)) return res.status(400).send("Invalid person data format");

	let allPatetos = fs.readFileSync('patetos.json');
	allPatetos = JSON.parse(allPatetos);

	let yearEntry = allPatetos.find(entry => entry.id === year.id);
	yearEntry.people.push(newPerson);

	console.log(yearEntry.people);

    fs.writeFileSync('patetos.json', JSON.stringify(allPatetos, null, 2));
	res.status(200).send("Person added to patetos");
});

backRouter.post('/removePersonFromPatetos', (req, res) => {
	let adminKey = req.body.adminKey;
	let person = req.body.person;
	let year = req.body.year;

	if (!isAdminKeyValid(adminKey)) return res.status(403).send("Adminkey not valid");
	if (!validateJSONPerson(person)) return res.status(400).send("Invalid person data format");
	if (!validateJSONPatetYear(year)) return res.status(400).send("Invalid year data format");
	
	let allPatetos = fs.readFileSync('patetos.json');
	allPatetos = JSON.parse(allPatetos);
	
	let yearEntry = allPatetos.find(entry => entry.id === year.id); // Corrected typo here
	yearEntry.people = yearEntry.people.filter(Nperson => (Nperson.id !== person.id));
	
	fs.writeFileSync('patetos.json', JSON.stringify(allPatetos, null, 2));
	res.status(200).send("Person removed from patetos");
});

backRouter.post('/updatePerson', (req, res) => {
	let newPerson = req.body.newPerson;
	let year = req.body.year;
	let adminKey = req.body.adminKey;

	if (!isAdminKeyValid(adminKey)) return res.status(403).send("Adminkey not valid");
	if (!validateJSONPerson(newPerson)) return res.status(400).send("Invalid mew person data format");


	let allPatetos = fs.readFileSync('patetos.json');
	allPatetos = JSON.parse(allPatetos);

	let yearEntry = allPatetos.find(entry => entry.id === year.id);
	let personIndex = yearEntry.people.findIndex(person => person.id === newPerson.id);
	yearEntry.people[personIndex] = newPerson;
	console.log(newPerson);

	fs.writeFileSync('patetos.json', JSON.stringify(allPatetos, null, 2));
	res.status(200).send("Person updated in patetos");
});



backRouter.post('/addNewYearOfPatetos', (req, res) => {
	let adminKey = req.body.adminKey;
	let newYear = req.body.newYear;
	if (!isAdminKeyValid(adminKey)) return res.status(403).send("Adminkey not valid");
	if (!validateJSONPatetYear(newYear)) return res.status(400).send("Invalid year data format");

	let allPatetos = fs.readFileSync('patetos.json');
	allPatetos = JSON.parse(allPatetos);

	if (allPatetos.find(entry => entry.id === newYear.id)) return res.status(409).send("Year already exists");

	allPatetos.push(newYear);
	allPatetos = sortYears(allPatetos);

	fs.writeFileSync('patetos.json', JSON.stringify(allPatetos, null, 2));
	res.status(200).send("Year added to patetos");
});

backRouter.post('/removeYearOfPatetos', (req, res) => {
	let adminKey = req.body.adminKey;
	let year = req.body.year;

	if (!isAdminKeyValid(adminKey)) return res.status(403).send("Adminkey not valid");
	if (!validateJSONPatetYear(year)) return res.status(400).send("Invalid year data format");

	let allPatetos = fs.readFileSync('patetos.json');
	allPatetos = JSON.parse(allPatetos);
	
	allPatetos = allPatetos.filter(entry => entry.id !== year.id);
	allPatetos = sortYears(allPatetos);

	fs.writeFileSync('patetos.json', JSON.stringify(allPatetos, null, 2));
	res.status(200).send("Year removed from patetos");
});

backRouter.post('/updateYearOfPatetos', (req, res) => {
	let newYear = req.body.newYear;
	let adminKey = req.body.adminKey;

	if (!isAdminKeyValid(adminKey)) return res.status(403).send("Adminkey not valid");
	if (!validateJSONPatetYear(newYear)) return res.status(400).send("Invalid year data format");
	if (newYear.year === undefined || newYear.nickname === undefined) return res.status(400).send("Data cannot be null");
	
	let allPatetos = fs.readFileSync('patetos.json');
	allPatetos = JSON.parse(allPatetos);
	
	let yearIndex = allPatetos.findIndex(entry => entry.id === newYear.id);
	allPatetos[yearIndex].year = newYear.year;
	allPatetos[yearIndex].nickname = newYear.nickname;

	allPatetos = sortYears(allPatetos);

	fs.writeFileSync('patetos.json', JSON.stringify(allPatetos, null, 2));
	res.status(200).send("Year updated in patetos");
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
			return yearA - yearB;
		}
	});


	return patetos;
}

export default backRouter;