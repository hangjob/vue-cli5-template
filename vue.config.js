const {defineConfig} = require('@vue/cli-service')

const path = require('path');//引入path模块
const TerserPlugin = require('terser-webpack-plugin');
const WebpackBundleanAlyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 分析build的工具
const webpack = require('webpack');
const dayjs = require('dayjs');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackBar = require('webpackbar');

const HtmlWebpackPlugin = require("html-webpack-plugin"); // 处理html传递数据

function resolve(dir) {
    return path.join(__dirname, dir) //path.join(__dirname)设置绝对路径
}

const isBuild = process.env.NODE_ENV === 'production'

/**
 * 配置多页面 详细用法参考官方文档
 * @type {{test: string, web: string}}
 */
const pages = {
    index: 'src/html/web/main.js',
    test: 'src/html/test/main.js',
}

/**
 * 添加扩展添加
 * @type {*[]}
 */
const plugins = []
if (isBuild) {
    // plugins.push(new WebpackBundleanAlyzer({analyzerPort:9601}))
    plugins.push(new CopyWebpackPlugin({
        options: {concurrency: 100}, // 并发数
        patterns: [{from: resolve('./README.md'), to: resolve('./dist')}] // 移动拷贝文件
    }))
    plugins.push(new WebpackBar({name: 'PC', color: '#07c160'}))
}

plugins.push(
    // 定义全局变量 可直接在应用中使用
    new webpack.DefinePlugin({
        __APP__: JSON.stringify({
            lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
        })
    })
)


/**
 * cdn
 */
const cdn = {
    build: {js: ['https://unpkg.com/vue@2.6.10/dist/vue.min.js'], css: []},
    dev: {js: [], css: []}
}

module.exports = defineConfig({
    pages,
    parallel: true, // 该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建
    transpileDependencies: true,
    lintOnSave: false,
    productionSourceMap: true, //生产环境的SourceMap
    publicPath: '/',
    outputDir: 'dist',
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('./src'))
            .set('__ROOT__', resolve(''))

        // 压缩
        config.plugin('CompressionPlugin')
            .use('compression-webpack-plugin', [{
                filename: '[path][base].gz',
                algorithm: 'gzip',
                test: /\.js$|\.css$|\.html$/,
                threshold: 10240, // 只处理比这个值大的资源。按字节计算
                minRatio: 0.8 // 只有压缩率比这个值小的资源才会被处理
            }])

        // cdn
        Object.keys(pages).forEach(key => {
            // 如果使用多页面打包，使用vue inspect --plugins查看html是否在结果数组中
            config.plugin(`html-${key}`).tap(args => {
                // html中添加cdn
                args[0].cdn = isBuild ? cdn.build : cdn.dev;
                return args;
            });
        })
        // 合并文件
        config.optimization.splitChunks({
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.(s?css|less|sass)$/,
                    chunks: 'all',
                    priority: 10
                },
                common: {
                    name: 'chunk-common',
                    chunks: 'all',
                    minChunks: 2, // 拆分前必须共享模块的最小 chunks 数。
                    maxInitialRequests: 5, // 打包后的入口文件加载时，还能同时加载js文件的数量（包括入口文件）
                    minSize: 0, // 生成 chunk 的最小体积
                    priority: 1, // 优化将优先考虑具有更高 priority（优先级）的缓存组
                    reuseExistingChunk: true // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
                },
                vendors: {
                    name: 'chunk-vendors',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                    priority: 2,
                    reuseExistingChunk: true
                },
            }
        })
    },
    configureWebpack: (config) => {
        config.experiments = {
            topLevelAwait: true, // 开启顶级await
        };
        if (isBuild) {
            config.externals = {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: "axios"
            }
        }
        config.plugins.push(...plugins);
        if (isBuild) {
            const TerserPluginIndex = config.optimization.minimizer.findIndex(
                (n) => n.__pluginName === 'terser',
            );
            config.optimization.minimizer[TerserPluginIndex] = new TerserPlugin({
                terserOptions: {
                    warnings: false,
                    format: {
                        comments: false,
                    },
                    compress: {
                        drop_debugger: true, // 注释console
                        drop_console: true,
                        pure_funcs: ['console.log'], // 移除console
                    },
                },
                extractComments: false, // 是否将注释提取到一个单独的文件中
                parallel: true, // 是否并⾏打包
            });
        }
    },
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    javascriptEnabled: true,
                    modifyVars: {},
                },
                additionalData: ` @import "~@/assets/css/variables.less";`,
            },
        }
    },
    devServer: {
        open: false, // 自动启动浏览器
        host: "0.0.0.0",
        port: 9007, // 端口号
        proxy: {
            "/api": {
                target: "https://www.api.com", // 目标代理接口地址
                pathRewrite: {
                    "^/api": "/"
                }
            }
        },
        hot: true,// 热更新
        compress: true, // 是否启动压缩 gzip
        historyApiFallback: {
            rewrites: [
                {from: /^\/web\/.*$/, to: "/web.html"},
                {from: /^\/test\/.*$/, to: "/test.html"},
            ],
        },
        headers: {
            'Access-Control-Allow-Origin': '*', // 微前端应用调试
        },
    }
})
