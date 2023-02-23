<template>
	<div>
		login/index.vue
	</div>
</template>
<script>
import {defineComponent, reactive} from "vue";

export default defineComponent({
	setup() {
		const compData = reactive({
			handleTest: () => {
				console.log(1)
			}
		})
		return {
			compData,
		};
	}
})
</script>
<style lang="less" scoped>
.login {
	font-size: 100px;
}
</style>
