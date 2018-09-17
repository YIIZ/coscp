# coscp

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Efficient file transfer for QCloud COS.

## Features

- Concurrency Support
- Report Sheet
- Enable / Disable / Customize HTTP Cache

## Installation

```sh
$ npm install -g @teambun/coscp
```

## Config

```sh
$ coscp gen-config
```

After generating `~/.coscprc.js`, read instructions in the file, set it properly.

## Usage

```sh
$ coscp source bucket:target
```

## Cache Policy

Default cache policy for development without `--cache` option:

| File Type / File Name |     Expire |
| :-------------------- | ---------: |
| All                   | 60 seconds |

Cache policy for production with `--cache auto` option:

| File Type / File Name |     Expire |
| :-------------------- | ---------: |
| \*.html, \*.stale.\*  | 60 seconds |
| Others                |     1 year |

Customize cache policy with `--cache` option, such as:

- `--cache 0`: disable cache.
- `--cache 3600`: set cache time to 1 hour.

## Programmatic API

### `async function coscp(sourceDirectory, targetDirectory, concurrency, config, interactive, cache)`

| Argument          | Type                                                   | Default Value |
| :---------------- | :----------------------------------------------------- | :------------ |
| `sourceDirectory` | `String`                                               | NA            |
| `targetDirectory` | `String`                                               | NA            |
| `concurrency`     | `Number`                                               | `5`           |
| `config`          | `Object{ AppId, SecretId, SecretKey, Bucket, Region }` | NA            |
| `interactive`     | `Boolean`                                              | `true`        |
| `cache`           | `Number`                                               | NA            |

## TODO

1.  multiple file transfer
    https://stackoverflow.com/a/21110306/1793548
2.  download `coscp bucket:files local`

## LICENSE

MIT
