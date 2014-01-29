'use strict';
var expect = require('chai').expect
  , apx = require('apx')

before(function(done){
  apx.once('ready',function(){
    done()
  })
  apx.start({
    sysLogLevel: 2,
    testing: true,
    cwd: __dirname + '/../lib'
  })
})
after(function(done){
  apx.once('dead',function(){
    done()
  })
  apx.stop()
})

describe('Session Management',function(){
  var sessionId
  before(function(){
    apx.instance.config.set('middleware','session.js')
  })
  after(function(){
    apx.instance.config.remove('middleware')
  })
  it('should return a session id',function(done){
    var action = {
      name: 'sessionTest',
      description: 'Mock action to test middleware',
      run: function(apx,req,res,next){
        next()
      }
    }
    apx.instance.runAction(action,{},function(err,res){
      if(err) throw err
      sessionId = res.get('$sessionId')
      expect(res.get('$sessionId')).to.not.equal(undefined)
      done()
    })
  })
  it('should allow setting of session data',function(done){
    var action = {
      name: 'sessionTest',
      description: 'Mock action to test middleware',
      run: function(apx,req,res,next){
        req.session.set('foo','yes')
        next()
      }
    }
    apx.instance.runAction(action,{$sessionId: sessionId},function(err,res){
      if(err) throw err
      expect(res.get('$sessionId')).to.equal(sessionId)
      done()
    })
  })
  it('should persist session data',function(done){
    var action = {
      name: 'sessionTest',
      description: 'Mock action to test middleware',
      run: function(apx,req,res,next){
        expect(req.session.get('foo')).to.equal('yes')
        next()
      }
    }
    apx.instance.runAction(action,{$sessionId: sessionId},function(err,res){
      if(err) throw err
      expect(res.get('$sessionId')).to.equal(sessionId)
      done()
    })
  })
  it('should fail gracefully when a blank session id is passed',function(done){
    var action = {
      name: 'sessionTest',
      description: 'Test to make sure an invalid sessionId is handled gracefully',
      run: function(apx,req,res,next){
        res.success()
        next()
      }
    }
    apx.instance.runAction(action,{$sessionId: null},function(err,res){
      expect(res.get('status')).to.equal('ok')
      done()
    })
  })
  it('should fail gracefully when a bogus session id is passed',function(done){
    var action = {
      name: 'sessionTest',
      description: 'Test to make sure an invalid sessionId is handled gracefully',
      run: function(apx,req,res,next){
        res.success()
        next()
      }
    }
    apx.instance.runAction(action,{$sessionId: 'foobar'},function(err,res){
      expect(res.get('status')).to.equal('ok')
      expect(res.get('$sessionId')).to.not.equal('foobar')
      done()
    })
  })
  it('should remove the session id from the request',function(done){
    var action = {
      name: 'sessionTest',
      description: 'Test to make sure sessionId is removed from the request',
      run: function(apx,req,res,next){
        expect(req.exists('$sessionId')).to.equal(false)
        res.success()
        next()
      }
    }
    apx.instance.runAction(action,{$sessionId: 'foo'},function(err,res){
      expect(res.get('status')).to.equal('ok')
      done()
    })
  })
  it('should allow removal of session data',function(done){
    var action = {
      name: 'sessionTest',
      description: 'Mock action to test middleware',
      run: function(apx,req,res,next){
        req.session.remove('foo')
        expect(req.session.get('foo')).to.equal(undefined)
        next()
      }
    }
    apx.instance.runAction(action,{$sessionId: sessionId},function(err,res){
      if(err) throw err
      expect(res.get('$sessionId')).to.equal(sessionId)
      done()
    })
  })
  it('should allow reset of session data',function(done){
    var action = {
      name: 'sessionTest',
      description: 'Mock action to test middleware',
      run: function(apx,req,res,next){
        req.session.set('foo','yes')
        req.session.reset()
        expect(req.session.get('foo')).to.equal(undefined)
        next()
      }
    }
    apx.instance.runAction(action,{sessionId: sessionId},function(err,res){
      if(err) throw err
      expect(res.get('$sessionId')).to.equal(undefined)
      done()
    })
  })
})