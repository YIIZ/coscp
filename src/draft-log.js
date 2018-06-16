'use strict';

const DraftLog = require('draftlog');

// inject console
DraftLog.into(console).addLineListener(process.stdin);
const draft = console.draft; // eslint-disable-line

module.exports = draft;
