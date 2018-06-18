'use strict';

const COS = require('cos-nodejs-sdk-v5');

module.exports = function promisedCOS(auth, location) {
  const cos = new COS(auth);

  const handler = {
    get: function(obj, prop) {
      return function(params) {
        return new Promise((resolve, reject) => {
          obj[prop](Object.assign(location, params), (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          });
        });
      };
    },
  };

  return new Proxy(cos, handler);
};
