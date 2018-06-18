#!/usr/bin/env node

'use strict'

const path = require('path')
const yargs = require('yargs')

const argv = yargs
  .usage(
    [
      'Usage: $0',
      '-s [source directory]',
      '-t [target directory]',
      '-c [concurrency]',
    ].join(' ')
  )
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
  .option('g', {
    demandOption: false,
    describe: 'generate config sample',
    type: 'boolean',
  })
  .help('h').argv

if (argv.g) {
  const generateConfigSample = require('./generate-config')
  generateConfigSample()
} else {
  const qcup = require('.')
  const sourceDirectory = path.isAbsolute(argv.s)
    ? argv.s
    : path.join(process.cwd(), argv.s)
  const targetDirectory = argv.t
  const concurrency = argv.c

  qcup(targetDirectory, sourceDirectory, concurrency)
}
