import comps from "@/components";
import '@/style/index.less'
import utils from "@/utils";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.variable.min.css';
// import 'lib-flexible/flexible' // 移动端模式打开，设置根节点
import mitt from 'mitt'
const setupCommon = (app) => {
    const resize = utils.resize()
    resize.register()
    app.use(comps)
    app.use(Antd)
    app.provide('$mitt', mitt())
}

export default setupCommon;
