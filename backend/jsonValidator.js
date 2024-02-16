import Ajv from 'ajv';
import fs from 'fs';

// Initialize Ajv
const ajv = new Ajv();


// Validate JSON data against a schema
function validateJSON(jsonData, schemaPath) {
    let schema = fs.readFileSync(schemaPath);
    schema = JSON.parse(schema);
    const validate = ajv.compile(schema);
    const valid = validate(jsonData);
    return valid
}


export async function validateJSONPatetYear(jsonData){
    return validateJSON(jsonData, 'backend/jsonSchemas/yearSchema.json');
}

export async function validateJSONPerson(jsonData){
    return validateJSON(jsonData, 'backend/jsonSchemas/personSchema.json');
}

export async function validateJSONPost(jsonData){
    return validateJSON(jsonData, 'backend/jsonSchemas/postSchema.json');
}