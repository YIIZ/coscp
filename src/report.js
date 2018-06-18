'use strict'

const Table = require('cli-table')
const draft = require('./lib/draft-log')

const drafts = []

function report({ total, handled, succeed, skip, failed }) {
  const formatLength = total.toString().length
  const progress = `${handled.toString().padStart(formatLength)} / ${total}`

  const table = new Table({
    colAligns: ['left', 'right'],
  })
  table.push({ progress }, { succeed }, { skip }, { failed })
  const lines = table
    .toString()
    .split('\n')
    .map(line => ` ${line}`)

  if (drafts.length === 0) {
    lines.forEach((_, i) => {
      drafts[i] = draft()
    })
  }

  for (const [i, line] of lines.entries()) {
    drafts[i](line)
  }
}

module.exports = report
