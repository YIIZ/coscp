const promisedCOS = require('./lib/promised-cos');
const { auth, location } = require('./config');

async function checkUploadable() {
  const cos = promisedCOS(auth, location);

  let statusCode;
  try {
    const res = await cos.headBucket();
    statusCode = res.statusCode;
  } catch (e) {
    statusCode = e.statusCode;
  }

  let errorMsg = '';
  switch (statusCode) {
    case 200:
      return;
    case 404:
      errorMsg = 'Bucket is invalid.';
      break;
    default:
      errorMsg = 'You have no permission of uploading to this bucket.';
  }

  if (errorMsg) {
    // eslint-disable-next-line
    console.error(errorMsg);
    // eslint-disable-next-line
    process.exit(1);
  }
}

module.exports = checkUploadable;
