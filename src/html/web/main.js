import {createApp} from 'vue'
import App from '../App.vue'
import setupCommon from "@/common";
import setupRouter from "@/router";

const app = createApp(App);

app.use(setupRouter).use(setupCommon).mount('#app')
