'use strict';

const { configFile } = require('./constants');
const config = require(configFile);

function checkFieldsExistence(config) {
  const fields = ['AppId', 'SecretId', 'SecretKey', 'Bucket', 'Region'];
  const missingFields = [];

  for (const field of fields) {
    if (!config[field]) {
      missingFields.push(field);
    }
  }

  if (missingFields.length !== 0) {
    printMissingFields(missingFields);
    // eslint-disable-next-line
    process.exit(1);
  }

  function printMissingFields(fields) {
    const feedback = [
      `check ${configFile}, ensure following fields is provided:`,
    ];

    fields.forEach(field => {
      feedback.push(`* ${field}`);
    });

    // eslint-disable-next-line
    console.error(feedback.join('\n'));
  }
}

checkFieldsExistence(config);

module.exports = config;
