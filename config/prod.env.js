var merge = require('webpack-merge')
var dotEnv = require('./.env')

module.exports = merge({
  NODE_ENV: '"production"'
},
dotEnv.prod)
