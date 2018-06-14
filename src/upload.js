const debug = require('debug')('qcup');
const md5File = require('md5-file/promise');
const COS = require('./promised-cos');
const { authInfo, location } = require('./config');

const CACHE_TIME = 365;
const RETRY_TIME = 3;
const HASH_KEY = 'x-cos-meta-hash';

const cos = new COS(authInfo, location);
const cacheHeader = getCacheHeader(CACHE_TIME);

async function upload(key, filePath, retryTime = RETRY_TIME) {
  let remoteHash = '';
  try {
    const meta = await cos.headObject({ Key: key });
    remoteHash = meta.headers[HASH_KEY];
  } catch (e) {
    if (e.error !== 'Not Found') {
      throw e;
    }
  }

  const localHash = await md5File(filePath);

  if (remoteHash !== localHash) {
    const params = {
      Key: key,
      Body: filePath,
      ...cacheHeader,
    };
    params[HASH_KEY] = localHash;

    for (let time = 0; time < retryTime; time++) {
      try {
        await cos.putObject(params);
        debug(`[SUCCESS] ${key}`);
        return succeed(key);
      } catch (e) {
        if (time >= retryTime) {
          debug(`[FAILURE] ${key}`);
          return failed(key);
        }
      }
    }
  } else {
    debug(`[SKIP]    ${key}`);
    return succeed(key);
  }
}

function getCacheHeader(day) {
  const s = 3600 * 24 * day;
  const ms = s * 1000;

  return {
    CacheControl: s,
    Expires: new Date(Date.now() + ms).toUTCString(),
  };
}

function succeed(key) {
  return { success: true, key };
}

function failed(key) {
  return { success: false, key };
}

module.exports = upload;
