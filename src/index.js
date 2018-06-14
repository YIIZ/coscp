'use strict';

const fg = require('fast-glob');
const upload = require('./upload');
const progressPromise = require('./progress-promise');

async function up(dir) {
  try {
    const trailingSlashRE = /\/$/;
    dir = dir.replace(trailingSlashRE, '');

    const files = await fg.async([`${dir}/**/*`]);

    const uploads = files.map(file => {
      const replaceRE = new RegExp(`^${dir}/`, 'gu');
      const key = file.replace(replaceRE, '');
      const filePath = file;

      return upload(key, filePath);
    });

    await progressPromise(uploads, (progress, total) => {
      console.log(progress, total);
    });
  } catch (e) {
    console.error(e);
  }
}

up('../test/files');
