# apx-session [![Build Status](https://travis-ci.org/snailjs/apx-session.png?branch=master)](https://travis-ci.org/snailjs/apx-session)

Session manager initializer for APX API server

## Usage

Simply add the initializer to the Apx config.

```
$ npm install apx apx-session
```

```js
var apx = require('apx')
apx.start({
  initializers: ['apx-session']
})
```

## Security

This session manager does not provide any hijack protection. To use secured sessions the connection should be made
via TLS/SSL which is the only true way to secure the connection.

## Configuration

### Key
* Parameter `session.key`
* Required **no**
* Default `$sessionId`

The key that denotes the session id.

### Max Age
* Parameter `session.maxAge`
* Required **no**
* Default `0`

The max age in seconds of the session after which the session will expire.

### Storage
* Parameter `session.storage`
* Required **no**
* Default `null`

The storage parameter is passed to [object-manage](https://github.com/snailjs/object-manage) see the storage section
there for more options.

## Changelog

### 0.2.2
* Removed the $sessionId from the request after initial middleware
* Added test to confirm that blank sessionIds fail gracefully
* Added testing against bogus session ids

### 0.2.1
* Upgraded to APX 0.7.1

### 0.2.0
* Session ID added to response is now `$sessionId`
* Upgraded for APX 0.6

### 0.1.0
* Initial release
