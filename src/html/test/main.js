import {createApp} from 'vue'
import App from './App.vue'
import setupCommon from "@/common";
import setupRouter from "@/router";

const app = createApp(App);
setupRouter(app, {base: '/test'}) // 注意这里在createWebHistory模式下的，多级目录，及多页面下的前缀
app.use(setupCommon).mount('#app')
