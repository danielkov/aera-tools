const qs = require('querystring')
const url = require('url')
module.exports = (request) => qs.parse(url.parse(request.url, true).query)
