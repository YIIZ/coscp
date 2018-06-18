# qcup

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> Efficient file uploader for QCloud.

## 功能

- 将文件上传至腾讯云对象存储

## 安装

通过 Git URL:

```sh
# latest version
$ npm install -g https://bitbucket.org/teambun/qcup.git

# specific version, for example:
$ npm install -g https://bitbucket.org/teambun/qcup.git#0.1.0
```

通过 NPM (暂未提供):

```sh
$ npm install -g qcup
```

## 配置

```sh
$ qcup -g
```

生成 `~/.qcup.js` 后，阅读其中的参考链接，设置相关字段。

## 使用说明

```sh
$ qcup --help
```

## 举例

```sh
$ qcup -c 8 -s /local/path/to/assets -t project-name
```
