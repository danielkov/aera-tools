const parse = require('co-body')

module.exports = (request, opts) => {
  const options = opts || { limit: '50kb' }

  const isIn = (value, array) => (array.includes(value))

  const getContentType = (request) => request.getHeader('content-type')

  const jsonTypes = [
    'application/json',
    'application/json-patch+json',
    'application/vnd.api+json',
    'application/csp-report',
  ]

  const formTypes = [
    'application/x-www-form-urlencoded',
  ]

  const textTypes = [
    'text/plain',
  ]

  function parseBody (request) {
    if (isIn(getContentType(request), jsonTypes)) {
      return parse.json(request, options)
    }
    if (isIn(getContentType(request), formTypes)) {
      return parse.form(request, options)
    }
    if (isIn(getContentType(request), textTypes)) {
      return parse.text(request, options)
    }
    return Promise.resolve({})
  }

  return parseBody(request)
}
