#!/usr/bin/env node

'use strict'

const path = require('path')
const yargs = require('yargs')
const qcup = require('.')
const generateConfigSample = require('./generate-config')

const argv = yargs
  .usage(
    [
      'Usage: $0',
      '<command>',
      '-s [source directory]',
      '-t [target directory]',
      '-c [concurrency]',
    ].join(' ')
  )
  .command('load', 'upload files', function(yargs) {
    return yargs
      .option('s', {
        describe: 'source directoy contains files waiting for uploading',
        type: 'string',
      })
      .option('t', {
        describe: 'target directory',
        type: 'string',
      })
      .option('c', {
        default: 5,
        describe: 'concurrent tasks',
        type: 'number',
      })
      .demandOption(
        ['s', 't'],
        'Please provide both source and target to work with this tool.'
      )
      .example('$0 load -c 8 -s /local/path/to/assets -t project-name')
  })
  .command('gen-config', 'generate sample configuration')
  .help('h').argv

const command = argv._[0]
switch (command) {
  // eslint-disable-next-line
  case 'load':
    const sourceDirectory = path.isAbsolute(argv.s)
      ? argv.s
      : path.join(process.cwd(), argv.s)
    const targetDirectory = argv.t
    const concurrency = argv.c

    qcup(targetDirectory, sourceDirectory, concurrency)
    break
  case 'gen-config':
    generateConfigSample()
    break
  default:
    yargs.showHelp()
}
