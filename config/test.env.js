var merge = require('webpack-merge')
var devEnv = require('./dev.env')
var dotEnv = require('./.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"'
},
dotEnv.test)
