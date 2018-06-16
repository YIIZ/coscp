'use strict';

const path = require('path');
const os = require('os');

const configFile = path.join(os.homedir(), '.qcup.json');

module.exports = require(configFile);

// {
//   "authInfo": {
//     "comment":
//       "basic concepts: https://cloud.tencent.com/document/product/436/6225",
//     "SecretId": "xxx",
//     "SecretKey": "xxx"
//   },
//   "location": {
//     "comment":
//       "availible regions: https://cloud.tencent.com/document/product/436/6224",
//     "Bucket": "xxx",

//     "Region": "xxx"
//   }
// }
