'use strict'

const cosmiconfig = require('cosmiconfig')

function generateMissingFieldsMessage(fields) {
  const message = ['check config file, ensure following fields is provided:']
  fields.forEach(field => {
    message.push(`* ${field}`)
  })

  return message.join('\n')
}

function checkFields(config) {
  const fields = ['AppId', 'SecretId', 'SecretKey', 'Bucket', 'Region']
  const missingFields = []

  for (const field of fields) {
    if (!config[field]) {
      missingFields.push(field)
    }
  }

  if (missingFields.length !== 0) {
    const message = generateMissingFieldsMessage(missingFields)
    throw new Error(message)
  }
}

async function getConfig() {
  try {
    const explorer = cosmiconfig('qcup')
    const result = await explorer.search()
    if (result === null) {
      throw new Error('config file is missing.')
    }

    const { config } = result
    checkFields(config)

    return config
  } catch (e) {
    throw e
  }
}

module.exports = getConfig
