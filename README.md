## MongoDb / Mongoose pagination done right

[![Travis CI](https://img.shields.io/travis/kilianc/mongoose-range-paginate.svg?style=flat-square)](https://travis-ci.org/kilianc/mongoose-range-paginate)
[![Coveralls](https://img.shields.io/coveralls/kilianc/mongoose-range-paginate.svg?style=flat-square)](https://coveralls.io/r/kilianc/mongoose-range-paginate)
[![NPM version](https://img.shields.io/npm/v/mongoose-range-paginate.svg?style=flat-square)](https://www.npmjs.com/package/mongoose-range-paginate)
[![NPM downloads](https://img.shields.io/npm/dm/mongoose-range-paginate.svg?style=flat-square)](https://www.npmjs.com/package/mongoose-range-paginate)
[![License](https://img.shields.io/npm/l/mongoose-range-paginate.svg?style=flat-square)](https://www.npmjs.com/package/mongoose-range-paginate)
[![Gitter](https://img.shields.io/badge/≡_gitter-join_chat_➝-04cd7e.svg?style=flat-square)](https://gitter.im/kilianc/mongoose-range-paginate?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

An utility function to work with ranged pagination, way faster than using `skip()`.

## Install

    $ npm install mongoose-range-paginate

## Example

```js
var paginate = require('mongoose-range-paginate')

...

// use any field name in your model, in this case we sort by 'timestamp'
var sortKey = 'timestamp'

// DESC because starts with a minus '-timestamp'
var sort = '-' + sortKey

function getQuery() {
  return Posts.find()
    .where({ tags: { $in ['foo', 'bar'] } })
}

paginate(getQuery(), { sort: sort, limit: 50 }).exec(function (err, docs) {
  // first 50 docs ready

  paginate(getQuery(), {
    sort: sort,
    startId: docs[49]._id,
    startKey: docs[49][sortKey],
    limit: 10
  }).exec(function (err, docs) {
    // next 10 docs ready
  })
})
```

## KoaJS Example

```js

var paginate = require('mongoose-range-paginate')

...

router.get('/list', function *() {
  var query = Posts.find()
    .where({ tags: { $in ['koajs', 'yield'] } })
    .where({ published: true })
    .where({ author: 'Kilian' })

  // force sorting, newest first
  this.query.sort = '-timestamp'

  // pass limit, startId and startKey on query string
  paginate(query, this.query)

  this.type = 'json'
  this.body = query.lean().stream().pipe(stringify())
})
```

## Signature

```js
paginate(query, opts)
```

### opts

* **sort** (`String`) mongoose sort criteria, supports ASC and DESC with the `"-"` prefix.
* **limit** (`Number`: defaults to 10) limits the number of documents.
* **startId** (`String`) id of the last document of your last result set, next result set will start with the document next to this.
* **startKey** (`String`) the value of the `sort` field of the last document of your result set, next result set will start with the document next to this.

## Test suite

Be sure you have MongoDb up and running locally, then run

    $ npm test

## License

_This software is released under the MIT license cited below_.

    Copyright (c) 2014 Kilian Ciuffolo, me@nailik.org. All Rights Reserved.

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the 'Software'), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.