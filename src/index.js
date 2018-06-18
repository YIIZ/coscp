'use strict';

const fg = require('fast-glob');
const draft = require('./lib/draft-log');
const report = require('./report');
const upload = require('./upload');
const checkUploadPermission = require('./check-upload-permission');
const config = require('./config');

const { AppId, SecretId, SecretKey, Bucket, Region } = config;

const auth = {
  SecretId,
  SecretKey,
};
const location = {
  Bucket: `${Bucket}-${AppId}`,
  Region,
};

function isEmpty(tasks) {
  return tasks.length === 0;
}

function generateWorkers(amount) {
  let workers = [];
  for (let i = 0; i < amount; i++) {
    workers.push({ idle: true, complete: false, log: draft(' [IDLE]') });
  }
  return workers;
}

function dispatchTasks(workers, tasks, state) {
  for (const worker of workers) {
    if (worker.idle === true && !isEmpty(tasks)) {
      worker.idle = false;
      const { key, filePath } = tasks.pop();

      // async uploader
      upload(
        key,
        filePath,
        3,
        {
          auth,
          location,
        },
        {
          onStart: () => {
            worker.log(` [HASH] ${key}`);
          },
          onProgress: progress => {
            worker.log(` [${progress.toString().padStart(3)}%] ${key} `);
          },
          onSucceed: () => {
            worker.idle = true;
            state.succeed++;
            state.handled++;
            report(state);
          },
          onSkip: () => {
            worker.idle = true;
            state.skip++;
            state.handled++;
            report(state);
          },
          onFailed: () => {
            worker.idle = true;
            state.failed++;
            state.handled++;
            report(state);
          },
        }
      );
    } else if (
      worker.idle === true &&
      isEmpty(tasks) &&
      worker.complete === false
    ) {
      worker.complete = true;
      worker.log(' [COMPLETE]');
    }

    if (state.handled === state.total) {
      const end = workers.every(worker => worker.idle === true);
      if (end) {
        workers.forEach(() => {
          process.stdout.write('\u001b[1A'); // move cursor up
          process.stdout.write('\u001b[2K'); // clear entire line
        });

        const peopleInOurTeam = 4;
        const smilingFace = String.fromCodePoint(128526);
        process.stdout.write(
          ` ${smilingFace.repeat(peopleInOurTeam)} Cheers!\n`
        );
        process.exit(0); // eslint-disable-line
      }
    }
  }
}

async function scanFiles(dir) {
  const trailingSlashRE = /\/$/;
  dir = dir.replace(trailingSlashRE, '');

  const files = await fg.async([`${dir}/**/*`]);
  return files;
}

function replaceFilePath(filePath, source, target) {
  const re = new RegExp(`^${source}`, 'gu');
  return filePath.replace(re, target);
}

async function qcup(prefix, dir, concurrency = 5) {
  try {
    if (!(await checkUploadPermission(auth, location))) {
      // eslint-disable-next-line
      process.exit(1);
    }

    const files = await scanFiles(dir);

    const tasks = files.map(file => {
      const key = replaceFilePath(file, dir, prefix);
      const filePath = file;
      return { key, filePath };
    });

    // upload
    const state = {
      total: tasks.length,
      handled: 0,
      succeed: 0,
      skip: 0,
      failed: 0,
    };

    report(state);

    const workers = generateWorkers(concurrency);

    const loop = () => {
      dispatchTasks(workers, tasks, state);
      setImmediate(loop);
    };

    loop();
  } catch (e) {
    // eslint-disable-next-line
    console.log('Congratulations! You have found a uncatched error.');
    // eslint-disable-next-line
    console.log('Please report it to the developer.');
    // eslint-disable-next-line
    console.error(e);
  }
}

module.exports = qcup;
