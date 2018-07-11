'use strict'

const cosmiconfig = require('cosmiconfig')
const { configFile } = require('./constants')

function generateMissingFieldsMessage(fields) {
  const message = ['check config, ensure following fields is provided:']
  fields.forEach(field => {
    message.push(`* ${field}`)
  })

  return message.join('\n')
}

function checkConfigFields(config) {
  const fields = ['AppId', 'SecretId', 'SecretKey', 'Bucket', 'Region']
  const missingFields = []

  for (const field of fields) {
    if (!config[field]) {
      missingFields.push(field)
    }
  }

  if (missingFields.length !== 0) {
    const message = generateMissingFieldsMessage(missingFields)
    const error = new Error(message)
    error.known = true
    throw error
  }
}

function filterEmpty(object) {
  Object.entries(object).forEach(([k, v]) => {
    if (!v) {
      delete object[k]
    }
  })

  return object
}

async function getConfigFromFile() {
  try {
    const explorer = cosmiconfig('qcup')
    const result = (await explorer.load(configFile)) || {}
    const { config = {} } = result
    return filterEmpty(config)
  } catch (e) {
    throw e
  }
}

function getConfigFromENV() {
  return filterEmpty({
    AppId: process.env.QCLOUD_APP_ID,
    SecretId: process.env.QCLOUD_SECRET_ID,
    SecretKey: process.env.QCLOUD_SECRET_KEY,
    Region: process.env.QCLOUD_REGION,
    Bucket: process.env.QCLOUD_BUCKET,
  })
}

function getConfigFromCLI(argv) {
  return filterEmpty({
    AppId: argv['app-id'],
    SecretId: argv['secret-id'],
    SecretKey: argv['secret-key'],
    Region: argv.region,
    Bucket: argv.bucket,
  })
}

module.exports = {
  getConfigFromFile,
  getConfigFromENV,
  getConfigFromCLI,
  checkConfigFields,
}
