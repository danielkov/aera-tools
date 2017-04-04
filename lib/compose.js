module.exports = (...functions) => (request, response) => {
  let ret
  functions.forEach((f, i) => {
    let possibleReturn = f(request, response)
    ret = !!possibleReturn ? possibleReturn : ret
  })
  return ret
}
