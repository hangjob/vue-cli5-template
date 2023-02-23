<template>
	<a-date-picker v-model:value="value1"/>
</template>
<script>
import {defineComponent, ref} from 'vue';

export default defineComponent({
	setup() {
		return {
			value1: '',
		};
	},
});
</script>
