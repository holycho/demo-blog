var path = require('path');

module.exports = {
  entry: {
    bundle: './src/app.jsx',
    vendors: [
        'babel-polyfill',
        'react',
        'react-dom',
        'react-redux',
        'react-router',
        'redux',
        'redux-thunk',
        'axios'
    ]
  },
  // target: 'node', // 加了之後 瀏覽器會報錯: Uncaught ReferenceError: require is not defined
  output: {
    publicPath: '/assets/',
    path: path.resolve(__dirname, 'public', 'assets'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader'
        },{
          loader: 'css-loader'
        },{
          loader: 'less-loader'
        }]
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|wpff2)$/,
        // 通用資源型別, 不需要安裝 loader
        type: 'asset',
        // 現在，webpack 將按照預設條件，自動地在 resource 和 inline 之間進行選擇
        // 小於 8kb 的檔案，將會視為 inline 模組型別，否則會被視為 resource 模組類
        // 自定義設定
        // 小於 8KB 轉 base64
        parser:{
            dataUrlCondition:{
              maxSize: 8*1024
            }
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  resolve: {
    extensions: [ ".js", ".jsx" ],
    alias: {
      Source: path.resolve(__dirname + '/src')
    }
  }
};