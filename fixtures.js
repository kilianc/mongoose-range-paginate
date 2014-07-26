/**
 * fixtures.js
 * Created by Kilian Ciuffolo on July 26, 2014
 * (c) 2014 Kilian Ciuffolo, me@nailik.org. All Rights Reserved.
 */

var ObjectId = require('mongoose').Types.ObjectId
var docs = module.exports = []

for (var a = 0; a < 10; a ++) {
  for (var b = 0; b < 10; b ++) {
    docs.push({
      _id: new ObjectId(),
      foo: a,
      bar: 9 -a
    })
  }
}