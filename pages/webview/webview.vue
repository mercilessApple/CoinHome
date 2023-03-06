<template>
	<view>
		<web-view :src="src" :webview-styles="{
			progress:{
				color:'#FEFA05'
			}
		}"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src: ''
			};
		},
		onLoad({
			url
		}) {
			this.src = url
		},
	}
</script>

<style lang="scss">

</style>
