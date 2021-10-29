# @kakang/secure-url

[![Continuous Integration](https://github.com/climba03003/secure-url/actions/workflows/ci.yml/badge.svg)](https://github.com/climba03003/secure-url/actions/workflows/ci.yml)
[![Package Manager CI](https://github.com/climba03003/secure-url/actions/workflows/package-manager-ci.yml/badge.svg)](https://github.com/climba03003/secure-url/actions/workflows/package-manager-ci.yml)
[![NPM version](https://img.shields.io/npm/v/secure-url.svg?style=flat)](https://www.npmjs.com/package/secure-url)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/climba03003/secure-url)](https://github.com/climba03003/secure-url)
[![Coverage Status](https://coveralls.io/repos/github/climba03003/secure-url/badge.svg?branch=main)](https://coveralls.io/github/climba03003/secure-url?branch=master)
[![GitHub](https://img.shields.io/github/license/climba03003/secure-url)](https://github.com/climba03003/secure-url)

## Install

```
npm install secure-url --save

yarn add secure-url
```

### Usage

By default, the SecureURL do not allow any relative URL like `//foo/bar`, and it will not allowed
to change the host if given.

The first two argument is same as `URL` and the return is same as `URL`.
Note that one different is, if you update the property of return. It will not update the other
property like `URL` do.

```js
const SecureURL = require("secure-url");

const url = new SecureURL("//foo/bar");
url.href; // https://localhost.local/foo/bar

const url = new SecureURL("https//malicious.com/foo/bar", "https://foo.bar/");
url.href; // https://foo.bar/foo/bar
```

### Option

`mode` and `keepPort` is the option that can modify the secure behavior.

#### Mode (`path`)

`path` mode is used to sanitize the given path and keep the base when given.

```js
const SecureURL = require("secure-url");

const url = new SecureURL("//foo/bar", { mode: "path" });
url.href; // https://localhost.local/foo/bar

const url = new SecureURL("https//malicious.com/foo/bar", "https://foo.bar/", {
  mode: "path",
});
url.href; // https://foo.bar/foo/bar
```

#### Mode (`relax`)

`relax` mode is used to sanitize the given path and allowed to update the base.

```js
const SecureURL = require("secure-url");

const url = new SecureURL("//foo/bar", { mode: "relax" });
url.href; // https://localhost.local/foo/bar

const url = new SecureURL("https//malicious.com/foo/bar", "https://foo.bar/", {
  mode: "relax",
});
url.href; // https//malicious.com/foo/bar
```

#### Mode (`insecure`)

`insecure` mode disable the sanitize for path and allowed to update the base.

```js
const SecureURL = require("secure-url");

const url = new SecureURL("//foo/bar", "https://foo.bar/", {
  mode: "insecure",
});
url.href; // https://foo/bar

const url = new SecureURL("//malicious.com/foo/bar", "https://foo.bar/", {
  mode: "insecure",
});
url.href; // https://malicious.com/foo/bar
```

#### keepPort

keepPort is used when you what to keep the `port` when specify in URL. We have this behavior
because by design `URL` will stripe the default `port` matching the `protocol`.
By default: `false`

```js
const SecureURL = require("secure-url");

const url = new SecureURL("/foo/bar", "https://localhost.local:443/", {
  keepPort: false,
});
url.href; // https://localhost.local/foo/bar

const url = new SecureURL("/foo/bar", "https://localhost.local:443/", {
  keepPort: true,
});
url.href; // https://localhost.local:443/foo/bar
```
