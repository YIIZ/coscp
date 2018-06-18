const path = require('path');
const os = require('os');

const configFile = path.join(os.homedir(), '.qcup.js');

module.exports = {
  cacheTime: 365,
  configFile,
};
