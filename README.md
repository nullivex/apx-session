apx-session [![Build Status](https://travis-ci.org/snailjs/apx-session.png?branch=0.3.0)](https://travis-ci.org/snailjs/apx-session)
============

Mongoose initializer for APX API server

## Usage

Simply add the initializer to the Apx config.

```
$ npm install apx apx-session
```

```js
var apx = require('apx')
apx.start({
  initializers: [require('apx-session')],
  session: {key: 'foo', prefix: 'foo'}
})
```

## Configuration

### Key
* Variable `session.key`
* Required **yes**
* Default `null`

Secret key used to sign sessions

### Prefix
* Variable `session.prefix`
* Required **no**
* Default `apx`

Prefix to use on sessions for multiple servers on the same domain.

## Changelog

### 0.1.0
* Initial release
