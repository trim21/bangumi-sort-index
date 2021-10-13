const path = require('path');

const webpackConfig = {
  resolve: {
    extensions: ['.js', '.ts', '.css'],
  },
  optimization: {
    minimize: false,
    moduleIds: 'named',
  },
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, '../dist'),
  },
  externals: {
    jquery: '$',
    diff2html: 'Diff2Html',
    diff: 'Diff',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: 'raw-loader',
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
};

module.exports = webpackConfig;
