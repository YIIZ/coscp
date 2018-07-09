'use strict'

const fg = require('fast-glob')
const pMap = require('p-map')
const draft = require('./lib/draft-log')
const report = require('./report')
const upload = require('./upload')
const checkUploadPermission = require('./check-upload-permission')

async function scanFiles(dir) {
  const trailingSlashRE = /\/$/
  dir = dir.replace(trailingSlashRE, '')

  const files = await fg.async([`${dir}/**/*`])
  return files
}

function replaceFilePath(filePath, source, target) {
  const re = new RegExp(`^${source}`, 'gu')
  return filePath.replace(re, target)
}

function generateLogger(amount) {
  const logger = []
  while (amount > 0) {
    logger.push({ idle: true, log: draft(' [IDLE]') })
    amount--
  }
  return logger
}

// convert task object to Promise object.
function convertTask(task, logger, state, qcloud) {
  logger.idle = false
  const { key, filePath } = task

  const onStart = () => {
    state.handling++
    logger.log(` [HASH] ${key}`)
  }
  const onProgress = progress => {
    logger.log(` [${progress.toString().padStart(3)}%] ${key} `)
  }
  const onSucceed = () => {
    logger.idle = true
    state.succeed++
    state.handled++
    report(state)
  }
  const onSkip = () => {
    logger.idle = true
    state.skip++
    state.handled++
    report(state)
  }
  const onFailed = () => {
    logger.idle = true
    state.failed++
    state.handled++
    report(state)
  }

  const retryTime = 3
  const callbacks = {
    onStart,
    onProgress,
    onSucceed,
    onSkip,
    onFailed,
  }

  return upload(key, filePath, retryTime, qcloud, callbacks).then(() => {
    if (state.handling === state.total) {
      logger.log(' [COMPLETE]')
    }
  })
}

function cleanupWorkerLog(count) {
  while (count > 0) {
    process.stdout.write('\u001b[1A') // move cursor up
    process.stdout.write('\u001b[2K') // clear entire line
    count--
  }
}

function cheers() {
  const peopleInOurTeam = 4
  const smilingFace = String.fromCodePoint(128526)
  process.stdout.write(` ${smilingFace.repeat(peopleInOurTeam)} Cheers!\n`)
}

async function qcup(prefix, dir, concurrency = 5, config) {
  const { AppId, SecretId, SecretKey, Bucket, Region } = config
  const auth = {
    SecretId,
    SecretKey,
  }
  const location = {
    Bucket: `${Bucket}-${AppId}`,
    Region,
  }
  const qcloud = {
    auth,
    location,
  }

  const permission = await checkUploadPermission(auth, location)
  if (!permission.pass) {
    throw new Error(permission.message)
  }

  try {
    const files = await scanFiles(dir)

    const tasks = files.map(file => {
      const key = replaceFilePath(file, dir, prefix)
      const filePath = file
      return { key, filePath }
    })

    const state = {
      total: tasks.length,
      handling: 0,
      handled: 0,
      succeed: 0,
      skip: 0,
      failed: 0,
    }

    report(state)

    const loggers = generateLogger(concurrency)
    await pMap(
      tasks,
      task => {
        const logger = loggers.find(i => i.idle)
        return convertTask(task, logger, state, qcloud)
      },
      { concurrency }
    )

    cleanupWorkerLog(concurrency)
    cheers()
  } catch (e) {
    // eslint-disable-next-line
    console.log('Congratulations! You have found a uncatched error.')
    // eslint-disable-next-line
    console.log('Please report it to the developer.')
    // eslint-disable-next-line
    console.error(e)
  }
}

module.exports = qcup
