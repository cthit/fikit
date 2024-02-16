// const fs = require('fs');
import fs from 'fs';

export const addImage = (imgData) => {
        let images = fs.readFileSync('public/posts.json', 'utf8');
        images = JSON.parse(images);
        images.push(imgData);
        
        console.log("WOHO! Image added!");
        fs.writeFileSync('public/posts.json', JSON.stringify(images, null, 2));
}

