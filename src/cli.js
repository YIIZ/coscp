#!/usr/bin/env node

'use strict'

const path = require('path')
const yargs = require('yargs')
const qcup = require('.')
const getConfig = require('./config')
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

async function main() {
  const command = argv._[0]

  try {
    switch (command) {
      // eslint-disable-next-line
      case 'load':
        const sourceDirectory = path.isAbsolute(argv.s)
          ? argv.s
          : path.join(process.cwd(), argv.s)
        const targetDirectory = argv.t
        const concurrency = argv.c

        const config = await getConfig()
        await qcup(sourceDirectory, targetDirectory, concurrency, config)
        break
      case 'gen-config':
        generateConfigSample()
        break
      default:
        yargs.showHelp()
    }

    // eslint-disable-next-line
    process.exit(0)
  } catch (e) {
    if (!e.known) {
      // eslint-disable-next-line
      console.log('Oops! You have found a uncatched error.')
      // eslint-disable-next-line
      console.log('Please report it to the developer.')
      // eslint-disable-next-line
      console.error(e)
    } else {
      // eslint-disable-next-line
      console.error(e.message)
    }

    // eslint-disable-next-line
    process.exit(1)
  }
}

main()
