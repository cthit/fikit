import express, { Router } from 'express';
import { upload} from './multer.js';
import { addImage } from './imgHandler.js';
import fs from 'fs';
import { isAdminKeyValid, getUsernameFromAdminKey } from '../server.js'
import * as path from 'path';

const backRouter = Router();

backRouter.post('/uploadPost',upload.single('postImage'), (req, res) => {
	console.log(req.body);
	if (!isAdminKeyValid(req.body.adminKey)) return res.status(403).send("Adminkey not valid");
	// if (!req.file) return res.status(400).send('Missing image file');

	let newPost = {
		title : req.body.title,
		description : req.body.description,
		// imagePath : req.file.path,
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

export default backRouter;