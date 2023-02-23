import comps from "@/components";
import '@/style/index.less'
import utils from "@/utils";
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.variable.min.css';
import 'lib-flexible/flexible'
const setupCommon = (app) => {
    const resize = utils.resize()
    resize.register()
    app.use(comps)
    app.use(Antd)
}

export default setupCommon;
