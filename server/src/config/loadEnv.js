const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  if (content.charCodeAt(0) === 0xfeff) {
    content = content.slice(1);
  }

  const parsed = dotenv.parse(content);
  Object.assign(process.env, parsed);
}

const serverEnvPath = path.resolve(__dirname, '../../.env');
const clientEnvPath = path.resolve(__dirname, '../../../client/.env');

loadEnvFile(serverEnvPath);
loadEnvFile(clientEnvPath);

module.exports = {
  serverEnvPath,
  clientEnvPath,
};
