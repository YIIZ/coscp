'use strict'

const os = require('os')
const cosmiconfig = require('cosmiconfig')

function generateMissingFieldsMessage(fields) {
  const message = ['check config, ensure following fields is provided:']
  fields.forEach((field) => {
    message.push(`* ${field}`)
  })

  return message.join('\n')
}

function checkConfigFields(config) {
  const fields = ['appId', 'secretId', 'secretKey', 'bucket', 'region']
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

async function getConfigFromFile(name) {
  try {
    const explorer = cosmiconfig('coscp')

    const { config } = await explorer.search(os.homedir())
    if (!config.hasOwnProperty(name)) return
    const { app_id, secret_id, secret_key, region, bucket } = config[name]

    return filterEmpty({
      bucket,
      appId: app_id,
      secretId: secret_id,
      secretKey: secret_key,
      region,
    })
  } catch (e) {
    console.warn('Failed to read configuration file.')
  }
}

function getConfigFromENV() {
  return filterEmpty({
    appId: process.env.QCLOUD_APP_ID,
    secretId: process.env.QCLOUD_SECRET_ID,
    secretKey: process.env.QCLOUD_SECRET_KEY,
    region: process.env.QCLOUD_REGION,
  })
}

module.exports = {
  getConfigFromFile,
  getConfigFromENV,
  checkConfigFields,
  filterEmpty,
}
