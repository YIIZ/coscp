const path = require('path')
const os = require('os')

const configFile = path.join(os.homedir(), '.qcuprc.js')

module.exports = {
  configFile,
}
