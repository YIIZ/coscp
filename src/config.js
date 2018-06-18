'use strict';

const path = require('path');
const os = require('os');

const configFile = path.join(os.homedir(), '.qcup.json');
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

const { AppId, SecretId, SecretKey, Bucket, Region } = config;

module.exports = {
  auth: {
    SecretId,
    SecretKey,
  },
  location: {
    Bucket: `${Bucket}-${AppId}`,
    Region,
  },
};

// basic concepts: https://cloud.tencent.com/document/product/436/6225
// availible regions: https://cloud.tencent.com/document/product/436/6224"
// {
//   "SecretId": "AKIDBGA3gcuwPglgS3pfKpTzLYaQ4b4P5YO2",
//   "SecretKey": "qdFg096tUyIUXO3Xqwsj2nS1SmwukOrC",
//   "Bucket": "qcup-test-1252291541",
//   "Region": "ap-guangzhou"
// }
