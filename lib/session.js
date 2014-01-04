'use strict';
var mongoose = require('mongoose')
exports.name = 'mongoose'
exports.description = 'Mongoose initializer'
exports.mongoose = mongoose
exports.start = function(apx,fn){
  if(!apx.config.exists('mongoose.name'))
    throw new Error('mongoose.name must be set to connect')
  var host = apx.config.exists('mongoose.host') ? apx.config.get('mongoose.host') : '127.0.0.1'
    , user = apx.config.exists('mongoose.user') ? apx.config.get('mongoose.user') : ''
    , pass = apx.config.exists('mongoose.password') ? apx.config.get('mongoose.password') : ''
    , dsn = 'mongodb://' + host + '/' + apx.config.get('mongoose.name')
    , finish = function(){
        //connect to mongoose
        mongoose.connect(
          dsn,
          {
            db: {native_parser: true}, //jshint ignore:line
            user: user,
            pass: pass,
            keepAlive: 1
          },
          fn
        )
      }
  //bootstrap models
  apx.models = {}
  if(apx.config.exists('models')){
    apx.loadItems(
      apx.config.get('models'),
      function(model,next){
        apx.models[model.name] = model.module
        next()
      },
      finish
    )
  } else {
    finish()
  }

}
exports.stop = function(apx,fn){
  exports.mongoose.disconnect(fn)
}