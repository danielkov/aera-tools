const Aera = require('aera')
const request = require('supertest')
const assert = require('assert')

const {
  compose,
  cors,
  HttpError,
  middleware,
  parseBody,
  static,
} = require('../lib/index')

describe('Testing testing...', () => {
  it('Should run a test successfully.', () => {
    assert(true)
  })
})

describe('Testing compose...', () => {
  it('Should return a function, that iterates over the functions it takes as arguments.', () => {
    let test = compose(() => {}, () => {})
    assert(typeof test === 'function')
  })
  it('Should pass down two arguments to each of its functions.', () => {
    let test = compose(
      (first, second) => {
        assert(typeof first === 'object')
        assert(typeof second === 'object')
        second.test = 'test'
      },
      (first, second) => {
        assert(typeof first === 'object')
        assert(typeof second === 'object')
        assert(second.test === 'test')
      }
    )
    let first = {}
    let second = {}
    test(first, second)
  })
  it('Should return the value of the last return value of its functions.', () => {
    let test = compose(
      () => 'Hello',
      () => {}
    )
    assert(test() === 'Hello')
  })
})

describe('Testing HttpError...', () => {
  it('Should be of type Error', () => {
    let test = new HttpError()
    assert(test instanceof Error)
  })
  it('Should should have a working toJson() method.', () => {
    let test = new HttpError('Test', 500)
    let json = test.toJson()
    assert.deepEqual(json, {
      message: 'Test',
      status: 500
    })
  })
  it('Should have a working toString() method.', () => {
    let test = new HttpError('Test', 500)
    let string = test.toString()
    assert(string === '500: Test')
  })
  it('Should return the stringified object if that is the error message in toString()', () => {
    let test = new HttpError({ test: 'test' }, 500)
    let string = test.toString()
    assert(string === '500: {"test":"test"}')
  })
})

describe('Testing middleware...', () => {
  it('Should return a function.', () => {
    let test = middleware()
    assert(typeof test === 'function')
  })
  it('Should pass in 3 arguments to the functions passed into it.', () => {
    let test = middleware(
      (one, two, three) => {
        assert.equal(one, 'test1')
        assert.equal(two, 'test2')
        assert(typeof three === 'function')
        three()
      },
      (one, two, three) => {
        assert.equal(one, 'test1')
        assert.equal(two, 'test2')
      }
    )
    test('test1', 'test2')
  })
  it('Should just return if no other functions are left in stack.', () => {
    let test = middleware(
      (one, two, next) => {
        next()
      },
      (one, two, next) => {
        next()
      }
    )
    test('test1', 'test2')
  })
  it('Should return the value of the last return value of its functions.', () => {
    let test = middleware(
      (one, two, next) => 'Test',
      (one, two, next) => {

      }
    )
    assert.equal(test('test1', 'test2'), 'Test')
  })
  it('Should throw an error if next() had been called multiple times.', () => {
    let test = middleware(
      (o, t, next) => {
        next()
        next()
        next()
      }
    )
    assert(test() instanceof Error)
  })
})

describe('Testing parseBody...', () => {
  const app = new Aera(3000)
  app.post('/test', req => parseBody(req))

  let req = request('http://localhost:3000')
  it('Should return a promise', () => {
    let fakeRequest = {
      headers: []
    }
    let test = parseBody(fakeRequest)
    assert(typeof test.then === 'function')
  })
  it('Should parse requests of JSON type.', (done) => {
    req.post('/test')
      .set('Content-Type', 'application/json')
      .send({ test: 'test' })
      .expect('Content-Type', 'application/json')
      .expect({ test: 'test' })
      .expect(200, done)
  })
  it('Should parse requests of urlencoded forms.', (done) => {
    req.post('/test')
      .type('form')
      .send({ test: 'test' })
      .expect('Content-Type', 'application/json')
      .expect({ test: 'test' })
      .expect(200, done)
  })
  it('Should parse requests of text/plain type.', (done) => {
    req.post('/test')
      .type('form')
      .set('Content-Type', 'text/plain')
      .send('test')
      .expect('Content-Type', 'text/html')
      .expect('test')
      .expect(200, done)
  })
})

describe('Testing static...', () => {
  const app = new Aera(2999)
  app.get(static('/test', './test'))

  let req = request('http://localhost:2999')

  it('Should return an array.', () => {
    let test = static('/', './')
    assert(Array.isArray(test))
  })

  it('Should serve static files of the folder at specified endpoint.', (done) => {
    req.get('/test/index.html')
      .expect('Test\r\n')
      .expect(200, done)
  })
})

describe('Testing cors...', () => {
  const app = new Aera(2998)
  app.get('/cors', (req, res) => {
    cors(req, res)
    return 'Test'
  })

  app.get('/options', (req, res) => {
    cors(req, res, {
      expose: ['Content-Length', 'Content-Type'],
      maxAge: 12000,
      methods: ['GET', 'POST'],
      headers: ['Content-Type', 'Content-Length', 'Authorization'],
      credentials: true,
      origin: 'http://localhost:3000'
    })
    return 'Test'
  })

  app.options('/options', (req, res) => {
    cors(req, res, {
      expose: ['Content-Length', 'Content-Type'],
      maxAge: 12000,
      methods: ['GET', 'POST'],
      headers: ['Content-Type', 'Content-Length', 'Authorization'],
      credentials: true,
      origin: false
    })
    return 'Test'
  })

  app.get('/fn', (req, res) => {
    cors(req, res, {
      origin: (request) => 'http://test.com'
    })
    return 'Test'
  })

  let req = request('http://localhost:2998')
  it('Add Cross Origin Resource Sharing headers.', (done) => {
    req.get('/cors')
      .set('Access-Control-Request-Headers', 'X-Test')
      .expect('Access-Control-Allow-Headers', 'X-Test')
      .expect(200, done)
  })
  it('Should have a working options parameter.', (done) => {
    req.get('/options')
      .expect('Access-Control-Expose-Headers', 'Content-Length,Content-Type')
      .expect('Access-Control-Allow-Methods', 'GET,POST')
      .expect('Access-Control-Max-Age', '12000')
      .expect('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization')
      .expect('Access-Control-Allow-Credentials', 'true')
      .expect('Access-Control-Allow-Origin', 'http://localhost:3000')
      .expect(200, done)
  })
  it('Should return with status code 204 if request method is OPTIONS', (done) => {
    req.options('/options')
      .expect('Access-Control-Allow-Origin', 'false')
      .expect(204, done)
  })
  it('Should also accept a function as origin.', (done) => {
    req.get('/fn')
      .expect('Access-Control-Allow-Origin', 'http://test.com')
      .expect(200, done)
  })
})
