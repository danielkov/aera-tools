module.exports = (...functions) => (request, response) => {
  let index = -1
  let ret
  dispatch(0)
  function dispatch (n) {
    if (n <= index) ret = new Error('next() called multiple times.')
    index = n
    let fn = functions[n]
    if (!fn) return
    let possibleReturn = fn(request, response, () => dispatch(n + 1))
    ret = !!possibleReturn ? possibleReturn : ret
  }
  return ret
}
