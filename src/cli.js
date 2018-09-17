#!/usr/bin/env node

'use strict'

const path = require('path')
const program = require('caporal')
const { version, description } = require('../package.json')
const coscp = require('.')
const {
  getConfigFromFile,
  getConfigFromENV,
  filterEmpty,
  checkConfigFields,
} = require('./config')
const generateConfigSample = require('./generate-config')

program
  // .command('upload')
  .version(version)
  .description(description)
  // Caporal's angled brackets required not working?
  // https://github.com/mattallty/Caporal.js#glossary
  // .option('--tail <lines>', 'yes', null, null, true)
  .argument('<source>', 'source dir to upload')
  .argument('<bucket:target>', 'bucket and dist dir')
  .option('-k, --concurrency <n>', 'concurrent tasks', program.INT, 5)
  .option('--no-interactive', 'disable interactive logs', program.BOOL, false)
  .option(
    '-c, --cache <n>',
    "specify cache time (unit: second). Moreover, if 'auto' is passed, switch to cache policy for production",
    program.INT,
    60
  )
  .option('--app-id <n>', 'overrides app id in config file')
  .option('--secret-id <n>', 'overrides secret id in config file')
  .option('--secret-key <n>', 'overrides secret key in config file')
  .option('--region <n>', 'overrides region in config file')
  .action(
    async (
      { source, bucketTarget },
      { concurrency, noInteractive, cache, appId, secretId, secretKey, region }
    ) => {
      const [bucket, target] = bucketTarget.split(':')
      const interactive = !noInteractive

      const sourceDirectory = path.isAbsolute(source)
        ? source
        : path.join(process.cwd(), source)
      const targetDirectory = target

      const config = Object.assign(
        { bucket },
        await getConfigFromFile(bucket),
        await getConfigFromENV(),
        filterEmpty({ appId, secretId, secretKey, region })
      )

      checkConfigFields(config)

      await coscp(
        sourceDirectory,
        targetDirectory,
        concurrency,
        config,
        interactive,
        cache
      )

      // TODO no manual exit
      // eslint-disable-next-line no-process-exit
      process.exit(0)
    }
  )

program
  .command('gen-config')
  .description('generate sample configuration')
  .action(() => {
    generateConfigSample()

    // eslint-disable-next-line no-process-exit
    process.exit(0)
  })

program.parse(process.argv)
