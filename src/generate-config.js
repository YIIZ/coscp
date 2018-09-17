'use strict'

const fs = require('fs')
const CONFIG_FILE = '.qcuprc.yml'

const sample = `# config sample for qcup
# basic concepts: https://cloud.tencent.com/document/product/436/6225
# availible regions: https://cloud.tencent.com/document/product/436/6224
mybucket:
  app_id: '1000000000'
  secret_id: 'sample-secret-id'
  secret_key: 'sample-secret-key'
  region: 'sample-region'
`

function generateConfigSample() {
  const exist = fs.existsSync(CONFIG_FILE)
  if (exist) {
    // eslint-disable-next-line
    console.log(
      `${CONFIG_FILE} exists. Remove it first, then generate it again.`
    )
  } else {
    fs.writeFileSync(CONFIG_FILE, sample)
    // eslint-disable-next-line
    console.log(`place sample config file at ${CONFIG_FILE}`)
  }
}

module.exports = generateConfigSample
