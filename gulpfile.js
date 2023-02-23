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
