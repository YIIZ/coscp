const promisedCOS = require('./lib/promised-cos')

async function checkUploadPermission(auth, location) {
  const cos = promisedCOS(auth, location)

  let statusCode
  try {
    const res = await cos.headBucket()
    statusCode = res.statusCode
  } catch (e) {
    statusCode = e.statusCode
  }

  let errorMsg = ''
  switch (statusCode) {
    case 200:
      break
    case 404:
      errorMsg = 'Invalid bucket.'
      break
    default:
      errorMsg = 'No permission for using this bucket.'
  }

  if (errorMsg) {
    // eslint-disable-next-line
    console.error(errorMsg)
    return false
    // eslint-disable-next-line
  } else {
    return true
  }
}

module.exports = checkUploadPermission
