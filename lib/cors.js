module.exports = (request, response, options) => {
  let o = options || {}
  let opts = {
    origin: (o.origin !== undefined) ? o.origin : true,
    expose: o.expose || '',
    maxAge: o.maxAge || false,
    credentials: o.credentials || false,
    methods: o.methods || '*',
    headers: o.headers || request.headers['access-control-request-headers'] || '*'
  }

  if (Array.isArray(opts.expose)) {
    opts.expose = opts.expose.join(',');
  }

  // Set maxAge
  if (typeof opts.maxAge === 'number') {
    opts.maxAge = opts.maxAge.toString();
  } else {
    opts.maxAge = null;
  }

  // Set methods
  if (Array.isArray(opts.methods)) {
    opts.methods = opts.methods.join(',');
  }

  // Set headers
  if (Array.isArray(opts.headers)) {
    opts.headers = opts.headers.join(',');
  }

  let origin

  switch (true) {
    case (typeof opts.origin === 'string'):
      origin = opts.origin;
      break;
    case (opts.origin === true):
      origin = opts.headers['origin'] || '*';
      break;
    case (opts.origin === false):
      origin = opts.origin;
      break;
    case (typeof opts.origin === 'function'):
      origin = opts.origin(request);
      break;
  }


    response.setHeader('Access-Control-Allow-Origin', origin);

    /**
     * Access Control Expose Headers
     */
    if (opts.expose) {
      response.setHeader('Access-Control-Expose-Headers', opts.expose);
    }

    /**
     * Access Control Max Age
     */
    if (opts.maxAge) {
      response.setHeader('Access-Control-Max-Age', opts.maxAge);
    }

    /**
     * Access Control Allow Credentials
     */
    if (opts.credentials === true) {
      response.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    /**
     * Access Control Allow Methods
     */
    response.setHeader('Access-Control-Allow-Methods', opts.methods);

    /**
     * Access Control Allow Headers
     */

    response.setHeader('Access-Control-Allow-Headers', opts.headers);


    if (request.method === 'OPTIONS') {
      response.statusCode = 204
    }

}
