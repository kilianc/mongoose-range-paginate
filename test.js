/**
 * test.js
 * Created by Kilian Ciuffolo on July 26, 2014
 * (c) 2014 Kilian Ciuffolo, me@nailik.org. All Rights Reserved.
 */

var assert = require('chai').assert
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , fixtures = require('./fixtures')
  , paginate = require('./index')

mongoose.connect('mongodb://127.0.0.1:27017/mp_test')
var Model = mongoose.model('Model', Schema({
  foo: Number,
  bar: Number,
  date: Date
}))

describe('mongoose-paginate', function () {

  before(function (done) {
    Model.remove(function () {
      Model.create(fixtures, done)
    })
  })

  after(function (done) {
    mongoose.disconnect(done)
  })

  it('should sort by _id by default', function (done) {
    paginate(Model.find()).exec(function (err, docs) {
      if (err) return done(err)
      assert.equal(docs[0]._id.toString(), fixtures[99]._id.toString())
      done()
    })
  })

  it('should support sorting / -foo', function (done) {
    paginate(Model.find(), { sort: '-foo' }).exec(function (err, docs) {
      if (err) return done(err)
      assert.equal(docs[0].foo, 9)
      assert.equal(docs[0].bar, 0)
      done()
    })
  })

  it('should support sorting / foo', function (done) {
    paginate(Model.find(), { sort: 'foo' }).exec(function (err, docs) {
      if (err) return done(err)
      assert.equal(docs[0].foo, 0)
      assert.equal(docs[0].bar, 9)
      done()
    })
  })

  it('should support sorting / -bar', function (done) {
    paginate(Model.find(), { sort: '-bar' }).exec(function (err, docs) {
      if (err) return done(err)
      assert.equal(docs[0].foo, 0)
      assert.equal(docs[0].bar, 9)
      done()
    })
  })

  it('should support sorting / bar', function (done) {
    paginate(Model.find(), { sort: 'bar' }).exec(function (err, docs) {
      if (err) return done(err)
      assert.equal(docs[0].foo, 9)
      assert.equal(docs[0].bar, 0)
      done()
    })
  })

  it('should support limit', function (done) {
    paginate(Model.find(), { limit: 20 }).exec(function (err, docs) {
      if (err) return done(err)
      assert.lengthOf(docs, 20)
      done()
    })
  })

  it('limit should default to 10', function (done) {
    paginate(Model.find()).exec(function (err, docs) {
      if (err) return done(err)
      assert.lengthOf(docs, 10)
      done()
    })
  })

  it('limit should be disabled if we pass "false"', function (done) {
    paginate(Model.find(), { limit: 'false' }).exec(function (err, docs) {
      if (err) return done(err)
      assert.lengthOf(docs, 100)
      done()
    })
  })

  it('should support pagination / same sort key', function (done) {
    var opts = {
      sort: '-foo',
      startId: fixtures[1]._id,
      startKey: fixtures[1].foo
    }

    paginate(Model.find(), opts).exec(function (err, docs) {
      if (err) return done(err)
      assert.equal(docs[0]._id.toString(), fixtures[0]._id.toString())
      assert.equal(docs[0].foo, fixtures[1].foo)
      assert.lengthOf(docs, 1)
      done()
    })
  })

  it('should support pagination / no sort key', function (done) {
    var opts = {
      startId: fixtures[50]._id,
      startKey: fixtures[50]._id
    }

    paginate(Model.find(), opts).exec(function (err, docs) {
      if (err) return done(err)
      assert.equal(docs[0]._id.toString(), fixtures[49]._id.toString())
      done()
    })
  })

  it('should support pagination / no sort key / no startKey', function (done) {
    var opts = {
      startId: fixtures[50]._id
    }

    paginate(Model.find(), opts).exec(function (err, docs) {
      if (err) return done(err)
      assert.equal(docs[0]._id.toString(), fixtures[49]._id.toString())
      done()
    })
  })

  it('should support pagination / different sort key', function (done) {
    var opts = {
      sort: '-foo',
      startId: fixtures[10]._id,
      startKey: fixtures[10].foo
    }

    paginate(Model.find(), opts).exec(function (err, docs) {
      if (err) return done(err)
      assert.equal(docs[0]._id.toString(), fixtures[9]._id.toString())
      assert.notEqual(docs[0].foo, fixtures[10].foo)
      assert.lengthOf(docs, 10)
      done()
    })
  })

  it('should skip pagination / empty string', function (done) {
    var opts = {
      startId: '',
      startKey: ''
    }

    paginate(Model.find(), opts).exec(function (err, docs) {
      if (err) return done(err)
      assert.equal(docs[0]._id.toString(), fixtures[99]._id.toString())
      assert.lengthOf(docs, 10)
      done()
    })
  })

  it('should skip pagination / null', function (done) {
    var opts = {
      startId: null,
      startKey: null
    }

    paginate(Model.find(), opts).exec(function (err, docs) {
      if (err) return done(err)
      assert.equal(docs[0]._id.toString(), fixtures[99]._id.toString())
      assert.lengthOf(docs, 10)
      done()
    })
  })

  it('should sort by dates', function (done) {
    var opts = {
      startId: fixtures[1]._id,
      startKey: fixtures[1].date,
      sort: 'date'
    }

    paginate(Model.find(), opts).exec(function (err, docs) {
      if (err) return done(err)
      assert.lengthOf(docs, 1)
      assert.equal(docs[0]._id.toString(), fixtures[0]._id.toString())
      done()
    })
  })

  it('should sort by dates', function (done) {
    var opts = {
      startId: fixtures[5]._id.toString(),
      startKey: fixtures[5].date,
      sort: '-date'
    }

    paginate(Model.find(), opts).exec(function (err, docs) {
      if (err) return done(err)
      assert.lengthOf(docs, 10)

      assert.equal(docs[0]._id.toString(), fixtures[6]._id.toString())
      assert.equal(docs[9]._id.toString(), fixtures[15]._id.toString())
      done()
    })
  })

  it('should sort by dates', function (done) {
    var opts = {
      startId: fixtures[5]._id.toString(),
      startKey: new Date(fixtures[5].date),
      sort: '-date'
    }

    paginate(Model.find(), opts).exec(function (err, docs) {
      if (err) return done(err)
      assert.lengthOf(docs, 10)

      assert.equal(docs[0]._id.toString(), fixtures[6]._id.toString())
      assert.equal(docs[9]._id.toString(), fixtures[15]._id.toString())
      done()
    })
  })
})