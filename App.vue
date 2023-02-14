<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			
			uni.$emit("setMescrollGlobalOption", {
				i18n: {
					type: uni.getLocale()
				}
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
	@import "@/uni_modules/mescroll-uni/components/mescroll-uni/components/mescroll-up.css";
	
	page {
		background-color: #fff;
		box-sizing: border-box;
		font-family:  -apple-system,Helvetica Neue,Helvetica,Arial,PingFang SC,Hiragino Sans GB,WenQuanYi Micro Hei,Microsoft Yahei,sans-serif;
	}

	@media (prefers-color-scheme: dark) {
		page {
			background-color: #1F282F;
		}
	}
</style>
