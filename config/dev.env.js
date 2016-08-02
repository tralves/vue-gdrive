var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
var dotEnv = require('./.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"'
},
dotEnv.dev)
