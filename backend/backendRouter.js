import express, { Router } from 'express';
import { upload} from './multer.js';
import { addImage } from './imgHandler.js';
import fs from 'fs';
import { isAdminKeyValid, getUsernameFromAdminKey } from '../server.js'
import * as path from 'path';

const backRouter = Router();

backRouter.post('/uploadPost',upload.single('postImage'), (req, res) => {
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");
	// if (!req.file) return res.status(400).send('Missing image file');

	let newPost = {
		title : req.body.title,
		description : req.body.description,
		imageName : path.basename(req.file.filename),
		postId : Date.now() + '-' + Math.round(Math.random() * 1E9),
		creationDate : Date.now(),
		createdBy : getUsernameFromAdminKey(req.body.adminKey)
	}

	addImage(newPost);

	res.status(200).send("Post uploaded successfully!");

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
	let sittande = allPatetos[0];
	res.status(200).send(sittande);
});

backRouter.post('/addPersonToPatetos', (req, res) => {
	let newPerson = req.body.person;
	let year = req.body.year;

	let allPatetos = fs.readFileSync('patetos.json');
	allPatetos = JSON.parse(allPatetos);

	let yearEntry = allPatetos.find(entry => entry.year === year);
	yearEntry.people.push(newPerson);

    fs.writeFileSync('patetos.json', JSON.stringify(allPatetos, null, 2));
	res.status(200).send("Person added to patetos");
});

backRouter.post('/removePersonFromPatetos', (req, res) => {
	let person = req.body.person;
	let year = req.body.year;
	
	let allPatetos = fs.readFileSync('patetos.json');
	allPatetos = JSON.parse(allPatetos);
	
	let yearEntry = allPatetos.find(entry => entry.year === year); // Corrected typo here
	yearEntry.people = yearEntry.people.filter(Nperson => (Nperson.nick !== person.nick) && (Nperson.name !== person.name));
	
	fs.writeFileSync('patetos.json', JSON.stringify(allPatetos, null, 2));
	res.status(200).send("Person removed from patetos");
});

backRouter.post('/updatePerson', (req, res) => {
	let oldPerson = req.body.oldPerson;
	let newPerson = req.body.newPerson;
	let year = req.body.year;

	let allPatetos = fs.readFileSync('patetos.json');
	allPatetos = JSON.parse(allPatetos);

	let yearEntry = allPatetos.find(entry => entry.year === year);
	let personIndex = yearEntry.people.findIndex(person => person.nick === oldPerson.nick);
	yearEntry.people[personIndex] = newPerson;

	fs.writeFileSync('patetos.json', JSON.stringify(allPatetos, null, 2));
	res.status(200).send("Person updated in patetos");
});



backRouter.post('/addNewYearOfPatetos', (req, res) => {
	let newYear = req.body.year;
	
	let allPatetos = fs.readFileSync('patetos.json');
	allPatetos = JSON.parse(allPatetos);

	if (allPatetos.find(entry => entry.year === newYear)) return res.status(400).send("Year already exists");


	allPatetos.push(newYear);
	fs.writeFileSync('patetos.json', JSON.stringify(allPatetos, null, 2));
	res.status(200).send("Year added to patetos");
});

backRouter.post('/removeYearOfPatetos', (req, res) => {
	let year = req.body.year;
	
	let allPatetos = fs.readFileSync('patetos.json');
	allPatetos = JSON.parse(allPatetos);
	
	allPatetos = allPatetos.filter(entry => entry.year !== year);
	fs.writeFileSync('patetos.json', JSON.stringify(allPatetos, null, 2));
	res.status(200).send("Year removed from patetos");
});

export default backRouter;