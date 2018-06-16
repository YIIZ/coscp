#!/usr/bin/env node

'use strict';

const path = require('path');
const yargs = require('yargs');
const qcup = require('.');

const argv = yargs
  .usage('Usage: $0 -s [source directory] -t [target directory]')
  .option('s', {
    demandOption: true,
    describe: 'source directoy contains files waiting for uploading',
    type: 'string',
  })
  .option('t', {
    demandOption: true,
    describe: 'target directory',
    type: 'string',
  })
  .option('c', {
    demandOption: false,
    default: 5,
    describe: 'concurrent tasks',
    type: 'number',
  })
  .help('h').argv;

const sourceDirectory = path.isAbsolute(argv.s)
  ? argv.s
  : path.join(process.cwd(), argv.s);
const targetDirectory = argv.t;
const concurrency = argv.c;

qcup(targetDirectory, sourceDirectory, concurrency);
