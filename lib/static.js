const { createReadStream } = require('fs')
module.exports = (path, dir) => [`${path}:file+`, ({ params }) => createReadStream(`${dir}/${params.file}`)]
