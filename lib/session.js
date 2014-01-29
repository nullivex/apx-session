'use strict';
var ObjectManage = require('object-manage')
  , uuid = require('uuid')
  , session

var setupSession = function(storage){
  session = new ObjectManage()
  if(null !== storage) session.storage(storage)
}

var createSession = function(sessionKey){
  var clientSession = new ObjectManage()
  clientSession.set(sessionKey,uuid.v1())
  clientSession.set('$created',new Date().getTime())
  return clientSession
}

exports.name = 'session'
exports.description = 'Session manager middleware'
exports.pre = function(apx,req,res,next){
  //the client session holder that gets passed to req.session
  var clientSession
    , storage = apx.config.exists('session.storage') ? apx.config.get('session.storage') : null
    , maxAge = apx.config.exists('session.maxAge') ? parseInt(apx.config.get('session.maxAge'),10) : 0
    , sessionKey = apx.config.exists('session.key') ? apx.config.get('session.key') : '$sessionId'
  //setup the session manager object if not already
  if(!session) setupSession(storage)
  //check if the client already has a session
  if(req.exists(sessionKey) && req.get(sessionKey) && session.exists(req.get(sessionKey))){
    clientSession = new ObjectManage(session.get(req.get(sessionKey)))
    //check if the session has expired
    if(0 !== maxAge && clientSession.get('$created') < new Date().getTime() - maxAge){
      clientSession = createSession(sessionKey)
    }
  } else {
    //if the client doesnt have a session id then we should start one
    clientSession = createSession(sessionKey)
  }
  //populate the req.session variable
  req.session = clientSession
  //remove the sessionKey from the request object
  req.remove(sessionKey)
  next()
}
exports.post = function(apx,req,res,next){
  var sessionKey = apx.config.exists('session.key') ? apx.config.get('session.key') : '$sessionId'
  //save session
  if(req.session && req.session.exists(sessionKey)){
    session.set(req.session.get(sessionKey),req.session.get())
    session.save(function(err){
      if(err) console.warn('Unable to save session',err)
      //set the session id in the response
      res.set(sessionKey,req.session.get(sessionKey))
      next()
    })
  } else {
    next()
  }

}