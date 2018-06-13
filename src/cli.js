#!/usr/bin/env node

'use strict';

const yargs = require('yargs');
const qcup = require('.');

const argv = yargs.usage('Usage: qcup -w [word]').help('h').argv;
process.stdout.write(`${qcup(argv.w || 'unicorns')}\n`);
