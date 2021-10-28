// we know that the behavior of URL will remove the default port for protocol
// https://url.spec.whatwg.org/#url-miscellaneous
const protocols = ['ftp', 21, 'http', 80, 'https', 443, 'ws', 80, 'wss', 443]
const slashProtocols = ['ftp:', 'http:', 'https:', 'ws:', 'wss:']

// check if we should keep port
function checkKeepPort (base) {
  if (typeof base !== 'string') return -1
  for (let i = 0; i < protocols.length; i += 2) {
    if (
      base.startsWith(protocols[i] + '://') &&
      base.includes(':' + protocols[i + 1])
    ) { return i }
  }
  return -1
}

function sanitizePath (pathname) {
  let i = 0
  // we detech how many slash before a valid path
  for (i; i < pathname.length; i++) {
    if (pathname[i] !== '/' && pathname[i] !== '\\') break
  }
  // turns all leading / or \ into a single /
  return i ? '/' + pathname.substr(i) : pathname
}

function isOption (base) {
  return (
    typeof base === 'object' &&
    base !== null &&
    !(base instanceof URL) &&
    !(base instanceof SecureURL)
  )
}

/**
 * SecureURL include security check for built-in URL
 * @param {string|URL} path
 * @param {string|URL} base
 * @param {object} option
 * @param {string} option.mode either `path`, `relax` or `insecure`
 * @param {boolean} option.keepPort should be keep the port for href
 * @returns {SecureURL}
 *
 * In "path" mode, we will sanitize the given path and
 * do not allow to change base
 *
 * In "relax" mode, we will sanitize the given path and
 * allow to change base
 *
 * In "insecure" mode, the return is exactly the same when
 * using `URL`
 */
function SecureURL (path, base, option = {}) {
  if (!(this instanceof SecureURL)) {
    return new SecureURL(path, base, option)
  }

  option = Object.assign(
    {
      mode: 'path',
      keepPort: true
    },
    arguments.length === 2 && isOption(base) ? base : option
  )
  const { mode, keepPort } = option

  if (
    typeof mode !== 'string' ||
    (mode !== 'path' && mode !== 'relax' && mode !== 'insecure')
  ) {
    throw new Error(
      `"mode" is expected to be "path", "relax" or "insecure", but recieved "${mode}"`
    )
  }

  if (typeof keepPort !== 'boolean') {
    throw new Error(
      `"keepPort" is expected to be boolean, but recieved "${keepPort}"`
    )
  }

  // allow base to be either SecureURL or URL
  if (base instanceof SecureURL || base instanceof URL) base = base.href
  // allow path to be either SecureURL or URL
  if (path instanceof SecureURL || path instanceof URL) path = path.href

  // in mode "path" or "relax", we do not allow "//" host to be exist
  if (mode === 'path' || mode === 'relax') {
    path = sanitizePath(path)
  }

  // we default a base
  const kBase = base || mode === 'path' ? 'https://localhost.local/' : path
  // use URL to filter out invalid base
  const kHost = new URL(kBase)
  // use URL to filter out invalid path
  let kURL = new URL(path, kHost)

  /**
   * In mode `insecure`, we should behave exactly the same as `URL`.
   */
  if (mode === 'insecure') {
    kURL = new URL(path, base)
  }

  const kBasePort = keepPort ? checkKeepPort(base) : -1
  const kPathPort = keepPort ? checkKeepPort(path) : -1

  // in mode "path", we do not allow to modify the host
  const kUseHost = mode === 'path' ? kHost : kURL
  const kUsePort = mode === 'path' ? kBasePort : kPathPort
  const isSlashProtocol = slashProtocols.includes(kUseHost.protocol)

  // internal store of
  const internal = {
    // computed value - calculate all the value again on set
    href: '',
    // computed value - no effect on set
    origin: '',
    host: '',
    protocol: kUseHost.protocol,
    username: kUseHost.username,
    password: kUseHost.password,
    hostname: kUseHost.hostname,
    port: keepPort && kUsePort > -1 ? protocols[kUsePort + 1] : kUsePort.port,
    pathname: kURL.pathname,
    hash: kURL.hash,
    search: kURL.search,
    searchParams: kURL.searchParams
  }

  let hasCredential = false

  if (internal.protocol) {
    internal.href += internal.protocol
    internal.origin += internal.protocol
  }
  if (isSlashProtocol) {
    internal.href += '//'
    internal.origin += '//'
  }
  if (internal.username) {
    internal.href += internal.username
    hasCredential = true
  }
  // password must come with username
  if (internal.username && internal.password) {
    internal.href += ':' + internal.password
    hasCredential = true
  }
  if (hasCredential) {
    internal.href += '@'
  }
  if (internal.hostname) {
    internal.href += internal.hostname
    internal.origin += internal.hostname
    internal.host += internal.hostname
  }
  if (internal.port) {
    internal.href += ':' + internal.port
    internal.origin += ':' + internal.port
    internal.host += ':' + internal.port
  }
  if (internal.pathname) {
    internal.href += internal.pathname
  }
  if (internal.search) {
    internal.href += internal.search
  }
  if (internal.hash) {
    internal.href += internal.hash
  }

  // non-slash protocol to not have origin
  if (!isSlashProtocol) {
    internal.origin = 'null'
  }

  return Object.assign({}, internal)
}

// allow const SecureURL = require('url-sanitizer')
module.exports = SecureURL
// allow import SecureURL from 'url-sanitizer'
module.exports.default = SecureURL
// allow import { SecureURL } from 'url-sanitizer'
module.exports.SecureURL = SecureURL
// allow import { URL } from 'url-sanitizer'
module.exports.URL = SecureURL
