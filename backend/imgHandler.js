import fs from 'fs';

export const addImage = (imgData, pathToJsonFile) => {
        let images = fs.readFileSync(pathToJsonFile, 'utf8');
        images = JSON.parse(images);
        images.push(imgData);
        
        console.log("WOHO! Image added!");
        fs.writeFileSync('public/posts.json', JSON.stringify(images, null, 2));
}

