const fs = require('fs');

const file = `export const environment = {
  production: true,
  apiUrlBase: '${process.env['API_URL']}',
  urlHub: '${process.env['URL_HUB']}'
};`;

fs.writeFileSync('./src/environments/environment.prod.ts', file);