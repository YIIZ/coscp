'use strict'

const fs = require('fs')
const { configFile } = require('./constants')

const sample = `// config sample for qcup
// basic concepts: https://cloud.tencent.com/document/product/436/6225
// availible regions: https://cloud.tencent.com/document/product/436/6224
module.exports = {
  AppId: '1000000000',
  SecretId: 'sample-secret-id',
  SecretKey: 'sample-secret-key',
  Bucket: 'sample-bucket',
  Region: 'sample-region',
}
`

function generateConfigSample() {
  const exist = fs.existsSync(configFile)
  if (exist) {
    // eslint-disable-next-line
    console.log(
      `${configFile} exists. Remove it first, then generate it again.`
    )
  } else {
    fs.writeFileSync(configFile, sample)
    // eslint-disable-next-line
    console.log(`place sample config file at ${configFile}`)
  }
}

module.exports = generateConfigSample
