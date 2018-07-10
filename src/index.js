'use strict'

const fg = require('fast-glob')
const pMap = require('p-map')
const log = require('./log')
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

function generateLogFns(amount) {
  const logFns = []
  while (amount > 0) {
    const logFn = log()
    logFn.idle = true

    logFns.push(logFn)
    amount--
  }
  return logFns
}

// convert task object to Promise object.
function convertTask(task, state, qcloud, reportFn, logFn) {
  logFn && (logFn.idle = false)
  const { key, filePath } = task

  const onStart = () => {
    state.handling++
    logFn && logFn(` [HASH] ${key}`)
  }
  const onProgress = progress => {
    logFn && logFn(` [${progress.toString().padStart(3)}%] ${key} `)
  }
  const onSucceed = () => {
    logFn && (logFn.idle = true)
    state.succeed++
    state.handled++
    reportFn && reportFn(state)
  }
  const onSkip = () => {
    logFn && (logFn.idle = true)
    state.skip++
    state.handled++
    reportFn && reportFn(state)
  }
  const onFailed = () => {
    logFn && (logFn.idle = true)
    state.failed++
    state.handled++
    reportFn && reportFn(state)
  }

  const retryTime = 3
  const callbacks = {
    onStart,
    onProgress,
    onSucceed,
    onSkip,
    onFailed,
  }

  return upload(key, filePath, retryTime, qcloud, callbacks).then(result => {
    if (state.handling === state.total) {
      logFn && logFn(' [COMPLETE]')
    }
    return result
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
  const peopleInOurTeam = 5
  const smilingFace = String.fromCodePoint(128526)
  process.stdout.write(` ${smilingFace.repeat(peopleInOurTeam)} Cheers!\n`)
}

async function noninteractiveUpload(
  sourceDirectory,
  targetDirectory,
  concurrency,
  qcloud
) {
  const files = await scanFiles(sourceDirectory)

  const tasks = files.map(file => {
    const key = replaceFilePath(file, sourceDirectory, targetDirectory)
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

  const failedToUpload = []
  const mapper = task =>
    convertTask(task, state, qcloud).then(({ success, key }) => {
      if (!success) {
        failedToUpload.push(key)
      }
    })

  await pMap(tasks, mapper, {
    concurrency,
  }).then(() => failedToUpload)
}

async function interactiveUpload(
  sourceDirectory,
  targetDirectory,
  concurrency,
  qcloud
) {
  const reportFn = report
  const files = await scanFiles(sourceDirectory)

  const tasks = files.map(file => {
    const key = replaceFilePath(file, sourceDirectory, targetDirectory)
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

  reportFn(state)

  const logFns = generateLogFns(concurrency)
  await pMap(
    tasks,
    task => {
      const logFn = logFns.find(i => i.idle)
      return convertTask(task, state, qcloud, reportFn, logFn)
    },
    { concurrency }
  )

  cleanupWorkerLog(concurrency)
  cheers()
}

async function qcup(
  sourceDirectory,
  targetDirectory,
  concurrency = 5,
  config,
  interactive = true
) {
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
    const error = new Error(permission.message)
    error.known = true
    throw error
  }

  if (interactive) {
    await interactiveUpload(
      sourceDirectory,
      targetDirectory,
      concurrency,
      qcloud
    )
  } else {
    await noninteractiveUpload(
      sourceDirectory,
      targetDirectory,
      concurrency,
      qcloud
    )
  }
}

module.exports = qcup
