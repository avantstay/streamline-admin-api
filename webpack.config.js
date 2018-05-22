const path               = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const nodeExternals      = require('webpack-node-externals')

const isProductionEnv = process.env.NODE_ENV === 'production'

module.exports = {
  entry    : './src/index.ts',
  output   : {
    path    : path.resolve(__dirname, 'build'),
    filename: 'index.js'
  },
  target   : 'node',
  externals: [nodeExternals()],
  resolve  : {
    alias     : {},
    extensions: ['.ts', '.ts', '.js', '.json']
  },
  mode     : isProductionEnv ? 'production' : 'development',
  module   : {
    rules: [
      {
        test   : /\.(tsx?)$/,
        include: path.resolve(__dirname, 'src'),
        use    : 'ts-loader'
      }
    ]
  },
  plugins  : [
    new CleanWebpackPlugin([path.resolve(__dirname, 'build')], {
      verbose: true
    })
  ]
}