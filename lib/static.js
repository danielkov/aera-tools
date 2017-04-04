const { createReadStream } = require('fs')
const formatPath = (path) => ('/' + path.replace(/\/$/, '')).replace('//', '/')
module.exports = (path, dir) => [`${formatPath(path)}/:file+`, ({ params }) => createReadStream(`${dir}/${params.file}`)]
