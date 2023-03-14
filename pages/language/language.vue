<template>
	<view>
		<u-navbar :leftIconColor="inverseParams('#303133','#fff')" title="" :autoBack="true" placeholder="">
		</u-navbar>

		<view class="title">
			{{$t('语言')}}
		</view>

		<view class="nav">
			<view class="item" @click="setLang('zh-Hans')">
				<view class="left">中文简体</view>
				<view class="right" v-if="lang == 'zh-Hans'">
					<u-icon color="#FE9205" name="checkmark"></u-icon>
				</view>
			</view>
			<view class="item" @click="setLang('en')">
				<view class="left">English</view>
				<view class="right" v-if="lang == 'en'">
					<u-icon color="#FE9205" name="checkmark"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lang: uni.getLocale() == 'en' ? 'en' : 'zh-Hans'
			};
		},
		onLoad() {
			this.isAndroid = uni.getSystemInfoSync().platform.toLowerCase() === 'android'
		},
		methods: {
			setLang(lang) {
				if (this.lang == lang) return
				
				uni.showModal({
					title: this.$t('提示'),
					content: this.$t('应用此设置将重启App'),
					success: (res) => {
						if (res.confirm) {
							// #ifdef APP-PLUS
							if(this.isAndroid){
								uni.setLocale(lang);
							}else{
								uni.setLocale(lang);
								plus.runtime.restart()
							}
							// #endif
							
							// #ifdef H5
							uni.setLocale(lang);
							location.reload()
							// #endif
						
						}
					}
				})
				
				// if (uni.getSystemInfoSync().platform.toLowerCase() === 'android') {
				// 	uni.showModal({
				// 		title: this.$t('提示'),
				// 		content: this.$t('应用此设置将重启App'),
				// 		success: (res) => {
				// 			if (res.confirm) {
				// 				uni.setLocale(lang);
				// 			}
				// 		}
				// 	})
				// } else {
				// 	this.lang = lang
				// 	uni.setLocale(lang);
				// 	this.$i18n.locale = lang;
				// }
			}
		},
	}
</script>

<style lang="scss">
	.nav {
		.item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 96rpx;
			margin-top: 20rpx;
			padding: 0 30rpx;

			.left {
				color: #23212C;
				font-size: 28rpx;
			}
		}
	}

	.title {
		font-weight: bold;
		color: #23282E;
		font-size: 48rpx;
		padding: 44rpx 30rpx;
	}

	@media (prefers-color-scheme: dark) {

		.title,
		.nav .item .left {
			color: #fff;
		}

		::v-deep {

			.u-navbar__content,
			.u-status-bar {
				background-color: #1F282F !important;
			}
		}
	}
</style>
