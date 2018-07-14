'use strict'

const runFn = require('run-function')
const md5File = require('md5-file/promise')
const promisedCOS = require('./lib/promised-cos')
const cacheTime = require('./constants')

const HASH_KEY = 'x-cos-meta-hash'

const cacheHeader = getCacheHeader(cacheTime)

async function upload(
  key,
  filePath,
  retryTime = 3,
  { auth, location },
  { onStart, onProgress, onSucceed, onFailed, onSkip, cache = true }
) {
  const cos = promisedCOS(auth, location)

  runFn(onStart)

  let remoteHash = ''
  try {
    const meta = await cos.headObject({ Key: key })
    remoteHash = meta.headers[HASH_KEY]
  } catch (e) {
    if (e.error !== 'Not Found') {
      throw e
    }
  }

  const localHash = await md5File(filePath)

  if (remoteHash === localHash) {
    runFn(onSkip, key)
    return succeed(key)
  }

  const header = cache && !isHTML(key) ? cacheHeader : {}
  const params = Object.assign({}, header, {
    Key: key,
    FilePath: filePath,
    onProgress: function(progressData) {
      const progress = Math.round(progressData.percent * 100)
      runFn(onProgress, progress)
    },
  })
  params[HASH_KEY] = localHash

  for (let time = 0; time < retryTime; time++) {
    try {
      runFn(onProgress, 0)
      await cos.sliceUploadFile(params)
      runFn(onSucceed, key)
      return succeed(key)
    } catch (e) {
      if (time >= retryTime) {
        runFn(onFailed, key)
        return failed(key)
      }
    }
  }
}

function getCacheHeader(day) {
  const s = 3600 * 24 * day
  const ms = s * 1000

  return {
    CacheControl: s,
    Expires: new Date(Date.now() + ms).toUTCString(),
  }
}

function isHTML(key) {
  return /html?$/.test(key)
}

function succeed(key) {
  return { success: true, key }
}

function failed(key) {
  return { success: false, key }
}

module.exports = upload
