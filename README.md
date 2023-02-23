## Vue-cli5

Vue CLI 是一个基于 Vue.js 进行快速开发的完整系统，提供：

- 通过 @vue/cli 实现的交互式的项目脚手架。
- 通过 @vue/cli + @vue/cli-service-global 实现的零配置原型开发。
- 一套完全图形化的创建和管理 Vue.js 项目的用户界面

### UI组件

[Ant-Design-Vue](https://antdv.com/components/overview-cn)

### 修改css变量

```javascript
document.documentElement.style.setProperty('--primary-color', 'red');
```

### 安装依赖

```shell
npm install 
```

如果本地网络卡顿，使用临时镜像，当命令行窗口关闭即失效

```shell
npm --registry http://mirrors.cloud.tencent.com/npm/ install express
```

### 开发模式

```shell
npm run dev 
or
npm run serve
```

### 打包模式

```shell
npm run build
```

### 自动上传

需要在`gulpfile.js`配置服务器信息

```shell
npm run upload
```

### 项目配置功能

- ✅开启文件Gzip压缩
- ✅编译去掉注释
- ✅开发服务配置
- ✅编辑器别名设置
- ✅配置环境变量
- ✅多页面应用配置
- ✅请求路由动态添加
- ✅网络请求封装
- ✅网络异常重连
- ✅配置全局less
- ✅开启分析打包日志
- ✅打包进度
- ✅注入全局变量
- ✅打包CDN替换NPM包
- ✅拷贝文件
- ✅添加可选链运算符
- ✅抽离重复文件合并
- ✅配置px转换rem
- ✅自动上传服务器
- ✅Nginx配置

### 开启文件Gzip压缩

```javascript
config.plugin('CompressionPlugin')
    .use('compression-webpack-plugin', [{
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240, // 只处理比这个值大的资源。按字节计算
        minRatio: 0.8 // 只有压缩率比这个值小的资源才会被处理
    }])
```

### 编译去掉注释

```javascript
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
```

### 开发服务配置

```javascript
module.exports = {
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
        headers: {
            'Access-Control-Allow-Origin': '*', // 微前端应用调试
        },
    }
}
```

### 编辑器别名设置

放置在根目录下，文件名为`jsconfig.json`

```json
{
    "compilerOptions": {
        "target": "es5",
        "module": "esnext",
        "baseUrl": "./",
        "moduleResolution": "node",
        "paths": {
            "@/*": [
                "src/*"
            ],
            "__ROOT__/*": [
                "*"
            ]
        },
        "lib": [
            "esnext",
            "dom",
            "dom.iterable",
            "scripthost"
        ]
    }
}
```

### 配置环境变量

放置在根目录下，`.env.development`、`.env.production`、`.env.test`，等等模式文件

#### 命令切换

```shell
vue-cli-service build --mode development
vue-cli-service build --mode production
vue-cli-service build --mode test
```

#### 配置环境文件

```shell
.env                # 在所有的环境中被载入
.env.local          # 在所有的环境中被载入，但会被 git 忽略
.env.[mode]         # 只在指定的模式中被载入
.env.[mode].local   # 只在指定的模式中被载入，但会被 git 忽略
```

### 多页面应用配置

```javascript
module.exports = {
    pages: {
        index: {
            // page 的入口
            entry: 'src/index/main.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'index.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'Index Page',
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        // 当使用只有入口的字符串格式时，
        // 模板会被推导为 `public/subpage.html`
        // 并且如果找不到的话，就回退到 `public/index.html`。
        // 输出文件名会被推导为 `subpage.html`。
        subpage: 'src/subpage/main.js'
    }
}
```

### 网络请求封装

> 文件放置`http/request.js`

- 基于axios封装
- 网络请求拦击
- 网络响应拦截
- 封装常用post、get、upload、download、并发请求

```javascript
const http = axios.create({
    timeout: 1000 * 60,
    withCredentials: true, // 表示跨域请求时是否需要  使用凭证
    headers: {
        "Content-Type": "application/json",
    }
});
```

### 网络异常重连

> 基于axios发生异常重连

```javascript
config.reconnectCount = config.reconnectCount || 1;
if (config.reconnectCount >= 3) { // 检查重试次数是否达到最大值
    return Promise.reject(error)
}
const backoff = new Promise(function (resolve) {  // 创建新的Promise来处理
    setTimeout(function () {
        resolve()
    }, 2000)
})
config.reconnectCount += 1  // 增加重试次数
return backoff.then(function () {  // 返回promise，其中调用axios来重试请求
    return http(config)
})
```

### 配置全局less

```javascript
module.exports = {
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    javascriptEnabled: true,
                    modifyVars: {}, // 这里也阔以声明less变量
                },
                additionalData: ` @import "~@/assets/css/variables.less";`,
            },
        }
    },
}
```

### 开启分析打包日志

```shell
npm i webpack-bundle-analyzer -D
```

```javascript
const WebpackBundleanAlyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
plugins.push(new WebpackBundleanAlyzer({analyzerPort: 9601}))
```

### 打包进度

```shell
npm i webpackbar -D
```

````javascript
const WebpackBar = require('webpackbar');
plugins.push(new WebpackBar({name: 'PC', color: '#07c160'}))
````

### 注入全局变量

```javascript
new webpack.DefinePlugin({
    __APP__: JSON.stringify({
        lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
    })
})
// 在Vue单页面中
console.log(lastBuildTime) // 2023-02-23 20:22:48
```

### 打包CDN替换NPM包

> 使用vue inspect --plugins查看html是否在结果数组中

```javascript
// 见多页面应用
Object.keys(pages).forEach(key => {
    config.plugin(`html-${key}`).tap(args => {
        args[0].cdn = isBuild ? cdn.build : cdn.dev;
        return args;
    });
})
// 单页面应用
config.plugin(`html`).tap(args => {
    args[0].cdn = isBuild ? cdn.build : cdn.dev;
    return args;
});
```

```html
<!DOCTYPE html>
<html lang="">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>vue-cli5模板</title>
    <% for (var i in htmlWebpackPlugin.options.cdn && htmlWebpackPlugin.options.cdn.css) { %>
    <link rel="stylesheet" href="<%= htmlWebpackPlugin.options.cdn.css[i] %>"/>
    <% } %>
</head>
<body>
<noscript>
    <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled.
        Please enable it to continue.</strong>
</noscript>
<div id="app"></div>
<% for (var i in htmlWebpackPlugin.options.cdn && htmlWebpackPlugin.options.cdn.js) { %>
<script type="text/javascript" src="<%= htmlWebpackPlugin.options.cdn.js[i] %>"></script>
<% } %>
</body>
</html>
```

### 拷贝文件

```shell
npm i copy-webpack-plugin -D
```

```javascript
const CopyWebpackPlugin = require('copy-webpack-plugin')
plugins.push(new CopyWebpackPlugin({
    patterns: [
        {from: resolve('./README.md'), to: resolve('./dist')}
    ],
    options: {concurrency: 100}, // 并发数
}))
```

### 添加可选链运算符

```shell
npm i @babel/plugin-proposal-optional-chaining -D
```

```javascript
module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset'
    ],
    plugins: [
        "@babel/plugin-proposal-optional-chaining" // 添加该插件
    ]
}
```

### 抽离重复文件合并

```javascript
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
```

### 配置px转换rem

```shell
npm i postcss-pxtorem -D
npm i lib-flexible -S
```

> 在入口文件引入

```javascript
import 'lib-flexible/flexible'
```

> 在根目录新建`.postcssrc.js`文件

```javascript
module.exports = {
    plugins: {
        'postcss-pxtorem': {
            rootValue: 37.5, //换算基数，
            unitPrecision: 3, //允许REM单位增长到的十进制数字,小数点后保留的位数。
            propList: ['*'],
            exclude: /(node_module)/,  //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)/ 。如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
            selectorBlackList: ['.van'], //要忽略并保留为px的选择器，本项目我是用的vant ui框架，所以忽略他
            mediaQuery: false,  //（布尔值）允许在媒体查询中转换px。
            minPixelValue: 1 //设置要替换的最小像素值
        }
    }
}
```

### 自动上传服务器

> 执行命令

```shell
npm run upload
```

> 配置自己的服务器账号和密码

```js
const gulp = require("gulp")
const ftp = require("gulp-ftp");

//服务器配置信息
const serverSeting = {
    host: "服务器域名",
    port: 21, //虚拟主机默认21，服务器默认22
    user: "用户名",
    pass: "密码",
    remotePath: "/dist/"
};

//把打包好的文件上传到服务器
gulp.task("server", () => {
    // 远程目录
    return gulp.src("/home/usr/www/**/*").pipe(ftp(serverSeting));
});

gulp.task('upload', gulp.series('server'))
```

### Nginx配置

> nginx常用的操作命令

```shell
#修改配置reload后看服务启动是否正常
nginx -t;
#重载nginx
nginx reload
#启动 nginx
start nginx      
#重启 nginx 
nginx -s reload   
#快速停止 nginx
nginx -s stop     
#完整有序地停止 nginx
nginx -s quit      
```

> 这里列举一份比较常用的nginx配置，具体的实际，需要看具体

```nginx configuration
server {
    listen       9999; # 监听端口
    server_name  localhost; # 域名可以有多个，用空格隔开
    
    location / {
      root   C:\工作\project\client_admin_system\dist;     #站点根目录，即网页文件存放的根目录, 默认主页目录在nginx安装目录的html子目录。
      index  index.html index.htm;    #目录内的默认打开文件,如果没有匹配到index.html,则搜索index.htm,依次类推
    }
    
    # 反向代理
    location /api {
        rewrite  ^.+api/?(.*)$ /$1 break;
        proxy_pass  http://192.168.1.100:7001;    #node api server 即需要代理的IP地址
        proxy_redirect off;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    #error_page  404              /404.html;    #对错误页面404.html 做了定向配置
    
    # redirect server error pages to the static page /50x.html
    #将服务器错误页面重定向到静态页面/50x.html
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
      root   html;
    }
}
```

> 如果使用Vue-cli3搭建的项目请看
[一份完整的Vue-cli3项目基础配置项](https://github.com/hangjob/vue-admin)

> 如果使用Vite搭建的项目请看
[一份完整的Vite3项目基础配置项](https://github.com/hangjob/vue-bag-admin)

