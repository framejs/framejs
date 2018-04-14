const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, args) => ({
    entry: './src/app.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    resolve: {
        extensions: [ '.ts', '.tsx', ".js", ".json"]
    },
    module: {
        rules: [
            {  test: /\.tsx?$/, loader: 'ts-loader' },
            {
                test:/\.(s*)css$/,
                use: [
                  {
                    loader: 'css-loader',
                    options: { sourceMap: args.mode !== 'production' }
                  }, {
                    loader: "sass-loader",
                    options: {
                        includePaths: ["src"],
                        sourceMap: args.mode !== 'production'
                    }
                  }
                ]
              }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'framejs',
            template: './index.html'
        })
    ]
});
