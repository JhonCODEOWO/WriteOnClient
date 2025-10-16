const { writeFileSync, mkdirSync, write } = require('fs');
const { join } = require('path');
require('dotenv').config();

const urlDev = join(__dirname, '../src/environments/environment.development.ts');
const urlProd = join(__dirname, '../src/environments/environment.ts');

//Throw errors in each case necessary
if (!process.env.API_URL || !process.env.API_URL.includes('/api')) {
    throw new Error('Be sure to include key API_URL with prefix /api');
}

//Create content to write in each file environment in Angular.
const envContent = `
export const environment = {
    API_URL: '${process.env.API_URL}',
    REVERB_APP_KEY:'${process.env.REVERB_APP_KEY}',
    REVERB_HOST:'${process.env.REVERB_HOST}',
    REVERB_WS_PORT:${+process.env.REVERB_WS_PORT},
    REVERB_WSS_PORT:${+process.env.REVERB_WSS_PORT},
    REVERB_SCHEME:'${process.env.REVERB_SCHEME}'
};
`

//Decide in witch file write the content
writeFileSync(urlDev, envContent);
writeFileSync(urlProd, envContent);