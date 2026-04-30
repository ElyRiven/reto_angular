const { writeFileSync, mkdirSync } = require('fs');

require('dotenv').config();

const targetPath = './src/environments/environment.ts';
const targetPathProd = './src/environments/environment.prod.ts';

const apiUrl = process.env['API_URL'];

if (!apiUrl) {
  throw new Error('API_URL is not set');
}

const devEnvContent = `export const environment = {
  apiUrl: "${apiUrl}"
};
`;

const prodEnvContent = `export const environment = {
  apiUrl: "${apiUrl}"
};
`;

mkdirSync('./src/environments', { recursive: true });

writeFileSync(targetPath, devEnvContent);
writeFileSync(targetPathProd, prodEnvContent);
