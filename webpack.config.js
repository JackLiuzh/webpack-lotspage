const path = require('path');

//引进webpack
const webpack = require("webpack");

//打包html模板
const htmlWebpackPlugin = require("html-webpack-plugin");
//抽离css
const extractTextPlugin = require("extract-text-webpack-plugin");

//清除目录等
const cleanWebpackPlugin = require("clean-webpack-plugin");


//copy 静态文件
const copyWebpackPlugin = require("copy-webpack-plugin");


//消除冗余的css
//const purifyCssWebpack = require("purifycss-webpack");

var getHtmlConfig = function (name, chunks) {
	return {
		template: `./src/pages/${name}/index.html`,
		filename: `${name}.html`,
		inject: true,
		hash: true,
		chunks: chunks
	}
}

module.exports = {
	mode: 'development',//通过mode 声明开发环境
	entry: {
		//多入口文件
		index: './src/pages/index/index.js',
		login: './src/pages/login/index.js',
	},

	output: {
        path: path.resolve(__dirname, './dist'),
        filename: './js/[name].[hash].bundle.js',
        publicPath: './'
	},
	devServer: {
        contentBase: path.join(__dirname,"./src"),
        publicPath: '/',
        host: "127.0.0.1",
        port: "8089",
        overlay: true,
        hot : true
	},

	plugins: [
        new extractTextPlugin({
        	filename: 'css/[name].[hash:8].min.css',
        }),

        //全局暴露统一入口
        new webpack.ProvidePlugin({
               $: "jquery",
               jQuery: "jquery",
               "window.jQuery": "jquery",
        }),

         // 消除冗余的css代码
		// new purifyCssWebpack({
		// 	paths: glob.sync(path.join(__dirname, "./src/pages/*/*.html"))
		// }),
		new cleanWebpackPlugin(['dist'],{
			root: path.resolve(__dirname, "./"),
			verbose: true,
			dry: false,

		}),

		// 静态资源输出
		new copyWebpackPlugin([{
			from: path.resolve(__dirname, "./src/assets"),
			to:'./assets',
			ignore: ['.*']
		}]),

		new webpack.HotModuleReplacementPlugin(),
     
	],

	module: {
		rules: [
           {
               test: /\.(css|scss|sass)$/,
               use: extractTextPlugin.extract({
               	   fallback: "style-loader",
               	   use: ["css-loader"],
               })
           },
           {
                test: /\.(png|jpg|gif)$/,
                use: [{
                	loader: "url-loader",
                	options: {
                		limit: 1,
                		outputPath: "images"
                    }
                }]  
           },
           {
           	    test: /\.html$/,
           	    use: ["html-withimg-loader"]
           },
           {
           	     test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
		             loader: 'url-loader',
				         options: {
					       limit: 10000,
				         }
           },
           {
           	      test: /\.svg/,
           	      loader: 'svg-url-loader'
           },

           {
                   test: /\.js$/,
                   use: ["babel-loader"],
                   exclude: "/node_modules/"

           },
           {
                   test: /\.less$/,
                   use: extractTextPlugin.extract({
                      fallback: "style-loader",
                      use: ["css-loader", "less-loader"],
                     
                   })
           }

		]
	},

	
}

//配置html页面
const htmlArray = [
 {
 	_html: 'index',
 	title: '首页',
 	chunks: ['index']
 },
 {
 	_html: 'login',
 	title: '登录',
 	chunks: ['login']

 }
];

htmlArray.forEach((element) => {
	module.exports.plugins.push(new htmlWebpackPlugin(getHtmlConfig(element._html,element.chunks)));
})