const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
  mode: 'development',
  entry: { app: './src/app.js' },
  resolve: {
    modules: [path.resolve(__dirname, 'src/'), 'node_modules'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      //      filename: devMode ? '[name].css' : '[name].[hash].css',
      //      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            // extract the CSS and dump to a file
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: devMode,
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[local]--[hash:base64:5]',
              },
            },
          },
          //          {
          //            // Then we apply postCSS fixes like autoprefixer and minifying
          //            loader: "postcss-loader"
          //          },
          {
            // First we transform SASS to standard CSS
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: ['src/components'],
              },
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        include: /components\/icons/,
        use: [
          {
            loader: 'svg-sprite-loader',
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [{ removeAttrs: { attrs: 'fill' } }],
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        exclude: /components\/icons/,
        use: [
          {
            loader: 'svg-sprite-loader',
          },
          {
            loader: 'svgo-loader',
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    historyApiFallback: true,
  },
  stats: !devMode
    ? 'errors-only'
    : {
        chunks: false,
        chunkModules: false,
        children: false,
        assets: false,
        moduleAssets: false,
        entrypoints: false,
      },
  devtool: devMode ? 'eval-source-map' : false,
}
