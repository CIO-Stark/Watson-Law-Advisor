const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: 'style.css',
  disable: process.env.NODE_ENV === 'production'
});

let config = {
  entry: './src/js/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  devtool: 'cheap-module-source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: 'public'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      }, {
        test: /\.(css|scss)$/,
        use: extractSass.extract({ use: ['css-loader', 'sass-loader'], fallback: 'style-loader' })
        // exclude: /node_modules/,
        // loaders: ['style-loader', 'css-loader', 'sass-loader']
      }, {
        test: /\.(jpe?g|gif|png|svg|woff|woff2|ttf|eot)$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    extractSass, 
    new HtmlWebpackPlugin({template: './src/index.html', inject: 'body'}),
    new CopyWebpackPlugin([
      // {
      //   from: './src/images/network',
      //   to: './img/network'
      // }, {
      //   from: './src/css/vis-network.min.css',
      //   to: './'
      // }
    ])
  ]
};

// preparation for prod
if (process.env.NODE_ENV === 'production') {
  // sourcemap
  config.devtool = undefined;
  // plugins
  config
    .plugins
    .push(new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }));
  config
    .plugins
    .push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = config;