# qcup

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Dependency Status](https://img.shields.io/david/m31271n/qcup.svg)](#)
[![DevDependency Status](https://img.shields.io/david/m31271n/qcup.svg)](#)
[![Travis Build Status](https://img.shields.io/travis/m31271n/qcup.svg)](#)
[![NPM Downloads](https://img.shields.io/npm/dm/qcup.svg)](#)


> Efficient file uploader for QCloud.

## Install

```
$ npm install qcup
```

## Usage

```js
const qcup = require('qcup');

qcup('unicorns');
//=> 'unicorns & rainbows'
```

## API

### qcup(input, [options])

#### input

Type: `string`

Lorem ipsum.

#### options

##### foo

Type: `boolean`<br>
Default: `false`

Lorem ipsum.

## CLI

```
$ npm install --global qcup
```

```
$ qcup --help

  Usage
    qcup [input]

  Options
    --foo  Lorem ipsum [Default: false]

  Examples
    $ qcup
    unicorns & rainbows
    $ qcup ponies
    ponies & rainbows
```
