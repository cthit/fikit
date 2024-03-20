import fs from 'fs';

export const addImage = (imgData, pathToJsonFile) => {
        let images = fs.readFileSync(pathToJsonFile, 'utf8');
        images = JSON.parse(images);
        images.push(imgData);
        
        fs.writeFileSync(pathToJsonFile, JSON.stringify(images, null, 2));
        console.log("WOHO! Image added!");
}

