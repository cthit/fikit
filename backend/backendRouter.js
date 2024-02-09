import express, { Router } from 'express';
import { upload} from './multer.js';
import { addImage } from './imgHandler.js';

const backRouter = Router();

backRouter.post('/uploadPost',upload.single('postImage'), (req, res) => {
	 if (!req.file) return res.status(400).send('Missing image file');
	// const validUntil = req.body.validUntil? req.body.validUntil +"T00:00:00.000Z" :new Date(Date.now() + 604800000).toISOString();
	const title = req.body.title;
	const description = req.body.description;

	addImage({title: title, description: description, url:req.file.path});

	res.status(200).send('Image uploaded successfully');

});
export default backRouter;