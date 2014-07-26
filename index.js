/**
 * index.js
 * Created by Kilian Ciuffolo on July 26, 2014
 * (c) 2014 Kilian Ciuffolo, me@nailik.org. All Rights Reserved.
 */

/**
 * Configures a mongoose query object for pagination
 * @param  {Query}  query The mongoose query object
 * @param  {Object} opts  Pagination options
 * @return {Query}        The mongoose query object
 */

module.exports = function paginate(query, opts) {
  opts = opts || {}
  opts.sort = opts.sort || ''

  var sortKey = opts.sort.replace('-', '')
  var sortDirection = opts.sort.match(/-/) ? -1 : 1

  if ('false' !== opts.limit) {
    query.limit(parseInt(opts.limit) || 10)
  }

  if (undefined !== opts.startKey && undefined !== opts.startId) {
    var a = {}, b ={}

    // if there are more with the same sortKey, use _id
    a[sortKey] = opts.startKey
    a._id = { $lt: opts.startId }

    // or just start with the next sortKey following sortDirection
    if (-1 === sortDirection) {
      b[sortKey] = { $lt: opts.startKey }
    } else {
      b[sortKey] = { $gt: opts.startKey }
    }

    query.where({ $or: [a, b] })
  }

  query.sort(opts.sort + ' -_id')

  return query
}