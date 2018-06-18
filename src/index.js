'use strict';

const path = require('path');
const fg = require('fast-glob');
const draft = require('./draft-log');
const report = require('./report');
const initUpload = require('./upload');
const { auth, location } = require('./config');

const upload = initUpload(auth, location);

function isEmpty(tasks) {
  return tasks.length === 0;
}

function generateWorkers(amount) {
  let workers = [];
  for (let i = 0; i < amount; i++) {
    workers.push({ idle: true, complete: false, log: draft('[IDLE]') });
  }
  return workers;
}

function dispatchTasks(workers, tasks, state) {
  for (const worker of workers) {
    if (worker.idle === true && !isEmpty(tasks)) {
      worker.idle = false;
      const { key, filePath } = tasks.pop();

      // async uploader
      upload(key, filePath, 3, {
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
      });
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
        process.exit(0); // eslint-disable-line
      }
    }
  }
}

async function qcup(prefix, dir, concurrency = 5) {
  // prepare
  const trailingSlashRE = /\/$/;
  dir = dir.replace(trailingSlashRE, '');

  const files = await fg.async([`${dir}/**/*`]);

  const tasks = files.map(file => {
    const replaceRE = new RegExp(`^${dir}/`, 'gu');
    const key = path.join(prefix, file.replace(replaceRE, ''));
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
}

module.exports = qcup;
