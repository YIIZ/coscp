'use strict'

const runFn = require('run-function')
const md5File = require('md5-file/promise')
const promisedCOS = require('./lib/promised-cos')

const HASH_KEY = 'x-cos-meta-hash'

async function upload(
  key,
  filePath,
  { auth, location },
  {
    onStart,
    onProgress,
    onSucceed,
    onFailed,
    onSkip,
    cache = true,
    cacheTime,
    retryTime = 3,
  }
) {
  const cos = promisedCOS(auth, location)

  runFn(onStart)

  let remoteHash = ''
  let remoteCacheControl = ''
  try {
    const meta = await cos.headObject({ Key: key })
    remoteHash = meta.headers[HASH_KEY]
    remoteCacheControl = meta.headers['cache-control']
  } catch (e) {
    if (e.error !== 'Not Found') {
      throw e
    }
  }

  const localHash = await md5File(filePath)
  const headers = getCacheHeader(key, cache, cacheTime)
  const localCacheControl = headers['CacheControl']

  if (remoteHash === localHash && remoteCacheControl === localCacheControl) {
    runFn(onSkip, key)
    return succeed(key)
  }

  const params = Object.assign({}, headers, {
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

function cacheHeader(seconds) {
  const ms = seconds * 1000

  return {
    CacheControl: seconds ? `max-age=${seconds}` : 'no-cache',
    Expires: new Date(Date.now() + ms).toUTCString(),
  }
}

function getCacheHeader(key, cache, cacheTime) {
  let header = {}

  if (cache) {
    if (cacheTime) {
      header = cacheHeader(cacheTime)
    } else {
      header = isHTML(key) ? cacheHeader(60) : cacheHeader(3600 * 24 * 365)
    }
  } else {
    header = cacheHeader(0)
  }

  return header
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
