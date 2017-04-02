# Aera Tools
Handy HTTP tools to use with Aera HTTP library.
___

## List of Tools

  - [Http Error](#http-error) - create an Error object with HTTP specific proerties.
  - [Body Parser](#body-parser) - turn request bodies into promises, resolving into JavaScript Objects.
  - [Compose](#compose) - if you prefer middleware-based approach, it can be done with this module.
  - [Middleware](#middleware) - create real `express`-like middleware.
  - [Query String](#query-string) - parse request query strings more easily.
  - [Static](#static) - Serve static files even easier!

## Http Error

This constructor creates an easy-to-use Error object, that is an instance of JavaScript `Error`, but also has a status property. Throw this instead of regular errors and Aera will automatically give better error responses.

### Example usage

```js
const { HttpError } = require('aera-tools')

server.get('/auth', () => new HttpError('You are not logged in.', 401)) // Response will be `You are not logged in.` with status 401.
```

## Body Parser

Request bodies are generally kind of hard to parse, especially of no proper content type has been set on the request (which this module does not help with at the moment, by the way). This tool takes in the request object and returns a promise, that resolves into the parsed body object, or rejects into an empty object for your convenience.

### Example usage

```js
const { bodyParser } = require('aera-tools')

server.post('/', (req, res) => bodyParser(req)) // this will return the body parsed into an object
```

You can also do some stuff with the body, once it's been resolved.

```js
server.post('/', (req, res) => bodyParser(req).then(createResourceInDb))
```

## Compose

Aera does not encourage middleware-based approach to writing your HTTP applications, however if you do want to provide multiple functions in sequence that you want executed, you can use this tool.

### Example usage

```js
const { compose } = require('aera-tools')

server.get('/', compose(req, res, function1, function2))
```

Each of these functions will have full access to request and response. E.g.:

```js
server.get('/', compose(
  (req, res) => res.setHeader('X-Custom-Header', 'value'),
  (req, res) => console.log(res.getHeader('x-custom-header') === 'value'), // logs true
  (req, res) => 'Hello, my app!'
))
```

As you can see, there is no calling `next` in this tool. That will be the [middleware](#middleware) tool.

## Middleware

If you want to use real `express`-style middleware with Aera, you can do so, with this tool. Do note that this will somewhat decrease the performance of Aera, so if you've made your application logic truly decoupled from the feedback logic, this tool should not be needed.

### Example usage

```js
const { middleware } = require('aera-tools')

server.get('/', middleware(
  (req, res, next) => {
    let t1 = Date.now()
    next()
    console.log(`Request took: ${Date.now() - t1} milliseconds.`)
  }, (req, res, next) => {
    return 'Hello, World!'
  }
))
```

## Query String

This tool will make it even easier to turn query string arguments (those thingies after URLs, like ?something=value&another=value) into usable JavaScript Objects.

### Example usage

```js
const { queryString } = require('aera-tools')

server.get('/', (req, res) => queryString(req)) // the response will be the JSON representation of the query string
```

## Static

**Note:** this will only work, from version `1.1.0` of Aera, due to how arguments are handled in the newer version.

Serves all files from the directory specified.

### Example usage

```js
const { static } = require('aera-tools')

server.get(static('/public', '/my/file/folder'))
```

The above example will serve requests coming to `/public` with the contents of `/my/file/folder`
