const webpack = require('webpack');
const path = require('path');
const moment = require('moment');
const HtmlWebpackPlugin = require('html-webpack-plugin');//模板
const CleanWebpackPlugin = require('clean-webpack-plugin');//清理
const CopyWebpackPlugin = require('copy-webpack-plugin');//拷贝
const MiniCssExtractPlugin = require("mini-css-extract-plugin");//提取css
const tsImportPluginFactory = require('ts-import-plugin');//按需导入
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const rootDir = path.dirname(__dirname);
const ReactLoadablePlugin = require('react-loadable/webpack');

module.exports = (__dirname, port = 8000, proxy = {}) => {
    const outputPaht = path.resolve(rootDir, "build");
    // 打包时间戳
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    // 分离css
    const styleCss = new MiniCssExtractPlugin({
        filename: `css/style.css`,
        // chunkFilename: "css/[id].css"
    });
    // 插件
    let plugins = [
        // new ReactLoadablePlugin({
        //     filename: path.join(outputPaht, "react-loadable.json"),
        // }),
        new CopyWebpackPlugin([{
            from: 'src/assets',
            to: 'assets'
        }]),
        styleCss
    ];
    return (evn = {}) => {
        evn.Generative = evn.Generative == "true"
        console.log(`-------------------------------------- ${evn.Generative ? 'deploy' : 'devServer'} ${time}  --------------------------------------`);
        plugins = [
            // 把生成的文件插入到 启动页中
            new HtmlWebpackPlugin({
                template: './src/index.html',
                hash: true,
                minify: true,
                vconsole: `
        <!--              Q&A @冷颖鑫 (lengyingxin8966@gmail.com)          -->   
        <!--              Build Time： ${time}   ( *¯ ꒳¯*)!!              -->
                `
            }),
            ...plugins
        ]
        // 生产环境 添加需要的插件
        if (evn.Generative) {
            plugins = [
                // new webpack.DefinePlugin({
                //     "process.env": {
                //         NODE_ENV: JSON.stringify("production")
                //     }
                // }),
                // gzip压缩：
                new CompressionPlugin({
                    // deleteOriginalAssets: true
                }),
                // 清理目录
                new CleanWebpackPlugin([outputPaht], { root: rootDir }),
                ...plugins
            ]
        }
        const Config = {
            entry: {
                'app': './src/index.tsx' //应用程序
            },
            output: {
                path: outputPaht,
                publicPath: evn.Generative ? './' : '/',
                filename: `js/[name].js`,
                chunkFilename: `js/[name].js`
            },
            devServer: {
                inline: true, //热更新
                port: port,
                // compress: true,//为服务的所有内容启用gzip压缩：
                // lazy: true,//懒惰模式
                overlay: true,//显示错误
                host: '0.0.0.0',
                proxy: {
                    ...proxy
                },
                //404 页面返回 index.html 
                historyApiFallback: true,
            },
            resolve: {
                extensions: [".ts", ".tsx", ".js", ".json"],
                // 模块别名
                alias: {
                    "app": path.resolve(rootDir, 'src', 'app'),
                    "assets": path.resolve(rootDir, 'src', 'assets'),
                    "components": path.resolve(rootDir, 'src', 'components'),
                    "containers": path.resolve(rootDir, 'src', 'containers'),
                    "core": path.resolve(rootDir, 'src', 'core'),
                    "store": path.resolve(rootDir, 'src', 'store'),
                    "utils": path.resolve(rootDir, 'src', 'utils'),
                    "wtmfront.json": path.resolve(rootDir, "wtmfront.json")
                }
            },
            module: {
                rules: [
                    {
                        test: /\.(tsx|ts|js|jsx)$/,
                        loader: 'awesome-typescript-loader',
                        options: {
                            // 按需加载 ts 文件
                            getCustomTransformers: () => ({
                                before: [tsImportPluginFactory([
                                    {
                                        libraryDirectory: '../_esm2015/operators',
                                        libraryName: 'rxjs/operators',
                                        style: false,
                                        camel2DashComponentName: false,
                                        transformToDefaultImport: false
                                    },
                                    { libraryName: 'antd', style: false },
                                    {
                                        libraryName: 'ant-design-pro',
                                        libraryDirectory: 'lib',
                                        style: true,
                                        camel2DashComponentName: false,
                                    }
                                ])]
                            }),
                        },
                        exclude: /node_modules/
                    },
                    {
                        test: /\.(less|css)$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            `css-loader?sourceMap=true&minimize=${evn.Generative}`,
                            {
                                loader: 'postcss-loader', options: {
                                    ident: 'postcss',
                                    sourceMap: true,
                                    plugins: (loader) => [
                                        require('autoprefixer')({
                                            browsers: [
                                                // 加这个后可以出现额外的兼容性前缀
                                                "> 0.01%"
                                            ]
                                        }),
                                    ]
                                }
                            },
                            `less-loader?sourceMap=true&javascriptEnabled=true`
                        ]
                    },
                    {
                        test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                        loader: 'url-loader?limit=50000&name=[path][name].[ext]'
                    },

                ]
            },

        };
        return [{
            ...Config,

            // 打包模式 development。启用NamedModulesPlugin。 production。启用UglifyJsPlugin，ModuleConcatenationPlugin和NoEmitOnErrorsPlugin。
            mode: evn.Generative ? 'production' : 'development',
            // mode: 'development',
            // 开发环境 生成 map 文件  
            devtool: evn.Generative ? false : 'source-map',
            // webpack 4删除了CommonsChunkPlugin，以支持两个新选项（optimization.splitChunks和optimization.runtimeChunk）
            // https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
            optimization: {
                minimizer: [
                    new UglifyJsPlugin({
                        parallel: true,
                        uglifyOptions: {
                            compress: {
                                drop_console: evn.Dev == 'build'
                            }
                        }
                    })
                ]
                ,
                splitChunks: {
                    cacheGroups: {
                        commons: {
                            test: /[\\/]node_modules[\\/]/,
                            name: "vendors",
                            chunks: "all"
                        },
                    },
                }
            },
            plugins,
        }
        ]
    }
}