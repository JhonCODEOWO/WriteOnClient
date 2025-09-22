const {writeFileSync, mkdirSync, write} = require('fs');
const { join } = require('path');
require('dotenv').config();

const urlDev = join(__dirname,'../src/environments/environment.development.ts');
const urlProd = join(__dirname, '../src/environments/environment.ts');

//Throw errors in each case necessary
if(!process.env.API_URL || !process.env.API_URL.includes('/api')){
    throw new Error('Be sure to include key API_URL with prefix /api');
}

//Create content to write in each file environment in Angular.
const envContent = `
export const environment = {
    API_URL: '${process.env.API_URL}'
};
`

//Decide in witch file write the content
writeFileSync(urlDev, envContent);
writeFileSync(urlProd, envContent);