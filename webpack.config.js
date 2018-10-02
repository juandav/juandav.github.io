module.exports = {
  mode: 'production',
  entry: './core/main.jsx',
  output: {
    path: __dirname + "/public/",
    filename: "build.js",
  },
  module: {
    rules: [
      {
        test:/\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader'
      }
    ]
  }
}
