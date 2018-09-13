#!/usr/bin/env node

'use strict'

const path = require('path')
const yargs = require('yargs')
const qcup = require('.')
const {
  getConfigFromFile,
  getConfigFromENV,
  getConfigFromCLI,
  checkConfigFields,
} = require('./config')
const generateConfigSample = require('./generate-config')

const argv = yargs
  .usage(['Usage: $0', '<command>'].join(' '))
  .command('load', 'upload files', function(yargs) {
    return yargs
      .usage(
        ['Usage: $0', 'load', '[options]', '<source>', '<target>'].join(' ')
      )
      .demandCommand(
        2,
        'Please provide <source> and <target> before uploading.'
      )
      .option('c', {
        alias: 'concurrency',
        default: 5,
        describe: 'concurrent tasks',
        type: 'number',
      })
      .option('n', {
        alias: 'no-interactive',
        default: false,
        describe: 'disable interactive logs',
        type: 'boolean',
      })
      .option('cache', {
        describe:
          "specify cache time (unit: second). Moreover, if 'auto' is passed, switch to cache policy for production",
        type: 'number',
      })
      .option('app-id', {
        describe: 'overrides app id in config file ',
        type: 'string',
      })
      .option('secret-id', {
        describe: 'overrides secret id in config file ',
        type: 'string',
      })
      .option('secret-key', {
        describe: 'overrides secret key in config file ',
        type: 'string',
      })
      .option('region', {
        describe: 'overrides region in config file',
        type: 'string',
      })
      .option('bucket', {
        describe: 'overrides bucket in config file',
        type: 'string',
      })
      .example('$0 load -c 8 --cache 60 local/path/to/assets project-name')
  })
  .command('gen-config', 'generate sample configuration')
  .help('h').argv

async function main() {
  const command = argv._[0]

  try {
    switch (command) {
      // eslint-disable-next-line
      case 'load':
        const source = argv._[1]
        const target = argv._[2]
        const sourceDirectory = path.isAbsolute(source)
          ? source
          : path.join(process.cwd(), source)
        const targetDirectory = target
        const concurrency = argv.c
        const interactive = !argv.n
        const cache = argv.cache

        const config = Object.assign(
          {},
          await getConfigFromFile(),
          await getConfigFromENV(),
          await getConfigFromCLI(argv)
        )

        checkConfigFields(config)

        await qcup(
          sourceDirectory,
          targetDirectory,
          concurrency,
          config,
          interactive,
          cache
        )
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
