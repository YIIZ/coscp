# qcup

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Efficient file uploader for QCloud.

## Features

- Concurrency Support
- Report Sheet
- HTTP Cache Header

## Installation

```sh
$ npm install -g @teambun/qcup
```

## Config

```sh
$ qcup gen-config
```

After generating `~/.qcuprc.js`, read instructions in the file, set it properly.

## Usage

```sh
$ qcup --help

$ qcup load -c 8 -s /local/path/to/assets -t project-name
```

## Programmatic API

### `async function qcup(sourceDirectory, targetDirectory, concurrency, config, interactive, cache)`

| Argument          | Type                                                   | Default Value |
| ----------------- | ------------------------------------------------------ | ------------- |
| `sourceDirectory` | `String`                                               | NA            |
| `targetDirectory` | `String`                                               | NA            |
| `concurrency`     | `Number`                                               | `5`           |
| `config`          | `Object{ AppId, SecretId, SecretKey, Bucket, Region }` | NA            |
| `interactive`     | `Boolean`                                              | `true`        |
| `cache`           | `Boolean`                                              | `true`        |

## LICENSE

MIT
