# qcup

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Efficient file uploader for QCloud.

## Features

- Concurrency Support
- Report Sheet
- Enable / Disable / Customize HTTP Cache

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
| :---------------- | :----------------------------------------------------- | :------------ |
| `sourceDirectory` | `String`                                               | NA            |
| `targetDirectory` | `String`                                               | NA            |
| `concurrency`     | `Number`                                               | `5`           |
| `config`          | `Object{ AppId, SecretId, SecretKey, Bucket, Region }` | NA            |
| `interactive`     | `Boolean`                                              | `true`        |
| `cacheTime`       | `Number`                                               | NA            |

## Cache Policy

Default cache policy without `--cache` option:

| File Type / File Name |     Expire |
| :-------------------- | ---------: |
| Type - HTML           | 60 seconds |
| Type - Others         |     1 year |
| Name - `/\.stale\./`  | 60 seconds |

Customize cache policy with `--cache` option, such as:

- `--cache 0`: disable cache.
- `--cache 3600`: set cache time to 1 hour.

## LICENSE

MIT
