'use strict'

const draft = require('./lib/draft-log')

function log() {
  return draft(' [IDLE]')
}

module.exports = log
