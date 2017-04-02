module.exports = (...functions) => (request, response) => {
  let ret
  functions.forEach((f, i) => {
    ret = f(request, response)
  })
  return ret
}
