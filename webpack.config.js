var path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var webpackConfig = {
    mode: 'production',
    entry: {
        hello_world: './src/shot_chart_container.js',
    },
    output: {
        filename: './bundle.js',
        path: path.join(__dirname, 'dist'),
        // library: '[name]',
        // libraryTarget: 'umd',
    },
    // optimization: {
    //   splitChunks: {
    //     chunks: 'all',
    //   },
    // },
    resolve: {
        extensions: ['.jsx', '.js'],
        modules: [path.join(__dirname, '../src'), 'node_modules'],
    },
    devServer: {
        hot: true,
        https: true,
        static: {
          directory: path.join(__dirname, 'dist'),
        },
    },
    module: {
        rules: [
            { test: /\.(js|jsx)$/, use: 'babel-loader' },
            { test: /\.ts(x?)$/, loader: 'ts-loader' },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                  {
                    loader: 'file-loader',
                  },
                ],
              },
            // { test: /\.css$/, loader: ['to-string-loader', 'css-loader'] },
        ],
    },
};

module.exports = webpackConfig;
