module.exports = (...functions) => (request, response) => {
  let index = -1
  let ret
  dispatch(0)
  function dispatch (n) {
    if (n <= index) return new Error('next() called multiple times.')
    index = n
    let fn = functions[n]
    if (!fn) return
    ret = fn(request, response, () => dispatch(n + 1))
  }
  return ret
}
