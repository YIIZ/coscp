const COS = require('cos-nodejs-sdk-v5');

module.exports = class PromisedCOS {
  constructor(authInfo, location) {
    this.cos = new COS(authInfo);
    this.location = location;
  }

  headObject(params) {
    return new Promise((resolve, reject) => {
      this.cos.headObject(Object.assign(this.location, params), (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  putObject(params) {
    return new Promise((resolve, reject) => {
      this.cos.putObject(Object.assign(this.location, params), (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
};
