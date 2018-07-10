# qcup

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Efficient file uploader for QCloud.

## Features

- Concurrency Support
- Report Sheet
- HTTP Cache Header

## Installation

via Git URL:

```sh
# latest version
$ npm install -g https://bitbucket.org/teambun/qcup.git

# specific version, for example:
$ npm install -g https://bitbucket.org/teambun/qcup.git#1.2.0
```

via NPM (unavailable):

```sh
$ npm install -g qcup
```

## Config

```sh
$ qcup gen-config
```

After generating `~/.qcup.js`, read instructions in the file, set it properly.

## Usage

```sh
$ qcup --help

$ qcup load -c 8 -s /local/path/to/assets -t project-name
```

## Programmatic API

### `async function qcup(sourceDirectory, targetDirectory, concurrency, config)`

| Argument          | Type                                                   | Default Value |
| ----------------- | ------------------------------------------------------ | ------------- |
| `sourceDirectory` | `String`                                               | NA            |
| `targetDirectory` | `String`                                               | NA            |
| `concurrency`     | `Number`                                               | 5             |
| `config`          | `Object{ AppId, SecretId, SecretKey, Bucket, Region }` | NA            |

## LICENSE

Unlicensed
