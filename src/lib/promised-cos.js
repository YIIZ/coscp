'use strict'

const COS = require('cos-nodejs-sdk-v5')

const COS_KEY = Symbol.for('COS')

module.exports = function promisedCOS(
  { secretId, secretKey },
  { bucket, region }
) {
  if (global[COS_KEY]) {
    return global[COS_KEY]
  }

  const auth = {
    SecretId: secretId,
    SecretKey: secretKey,
  }
  const location = {
    Bucket: bucket,
    Region: region,
  }

  const cos = new COS(auth)

  const handler = {
    get: function(obj, prop) {
      return function(params) {
        return new Promise((resolve, reject) => {
          obj[prop](Object.assign(location, params), (err, data) => {
            if (err) {
              reject(err)
            } else {
              resolve(data)
            }
          })
        })
      }
    },
  }

  const proxy = new Proxy(cos, handler)
  global[COS_KEY] = proxy

  return proxy
}
