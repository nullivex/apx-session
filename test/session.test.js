'use strict';
var expect = require('chai').expect
describe('InitializerMongoose',function(){
  var mongoose = require('../lib/mongoose').mongoose
    , apx = require('apx')
  beforeEach(function(done){
    apx.once('ready',function(){
      done()
    })
    apx.start({
      sysLogLevel: 2,
      testing: true,
      cwd: __dirname,
      models: 'models/*.js',
      mongoose: {
        name: 'apx-mongoose-init-test'
      }
    })
  })
  afterEach(function(done){
    apx.once('dead',function(){
      done()
    })
    apx.stop()
  })
  it('should connect to mongoose',function(done){
    var init = require('../lib/mongoose')
    init.start(apx.instance,function(){
      expect(mongoose.connection.readyState).to.equal(1)
      done()
    })
  })
  it('should load models',function(done){
    var init = require('../lib/mongoose')
    init.start(apx.instance,function(){
      expect(Object.keys(apx.instance.models).length).to.equal(1)
      expect(apx.instance.models.model).to.be.a('function')
      done()
    })
  })
})