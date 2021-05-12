const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

/* eslint-disable-next-line */
const development = process.env.NODE_ENV === 'development'
/* eslint-disable-next-line */
const production = process.env.NODE_ENV === 'production'

const CesiumSource = path.join('node_modules', 'cesium', 'Build', 'Cesium')

const config = {
  publicPath: './',
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([{ from: path.join(CesiumSource, 'Workers'), to: 'Workers' }]),
      new CopyWebpackPlugin([{ from: path.join(CesiumSource, 'ThirdParty'), to: 'ThirdParty' }]),
      new CopyWebpackPlugin([{ from: path.join(CesiumSource, 'Assets'), to: 'Assets' }]),
      new CopyWebpackPlugin([{ from: path.join(CesiumSource, 'Widgets'), to: 'Widgets' }]),
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify('./')
      })
    ],
    module: {
      unknownContextCritical: false,
      rules: [
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192
              }
            }
          ]
        },
        {
          test: /\.glsl$/,
          use: [
            {
              loader: 'webpack-glsl'
            }
          ]
        }
      ]
    }
  }
}

module.exports = config
