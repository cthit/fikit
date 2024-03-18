import { Router } from 'express';
import fs from 'fs';

import { pathToCommiteeFile } from '../server.js';

const commiteeRouter = Router();



commiteeRouter.get('/getCommitteeInfo', (req, res) => {
    let commiteeInfo = fs.readFileSync(pathToCommiteeFile);
    commiteeInfo = JSON.parse(commiteeInfo);
    res.status(200).send(commiteeInfo);
});



export default commiteeRouter;