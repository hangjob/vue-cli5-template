<template>
	<a-config-provider :locale="zhCN">
		<router-view></router-view>
	</a-config-provider>
</template>
<script setup>
import {ConfigProvider} from 'ant-design-vue';
import {reactive} from "vue";
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
const compData = reactive({
	width: document.body.clientWidth,
	height: document.body.clientHeight
})
ConfigProvider.config({
	theme: {
		primaryColor: '#25b864',
	},
});
</script>
<style>

</style>
