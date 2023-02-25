<template>
	<view>
		<view class="title">
			{{$t('语言')}}
		</view>

		<view class="nav">
			<view class="item" @click="setLang('zh')">
				<view class="left">中文简体</view>
				<view class="right" v-if="lang == 'zh'">
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
				lang: uni.getLocale() == 'en' ? 'en' : 'zh'
			};
		},
		onLoad() {
			
		},
		methods: {
			setLang(lang) {
				if (this.lang == lang) return
				uni.showModal({
					title: this.$t('提示'),
					content: this.$t('应用此设置将重启App'),
					success: (res) => {
						if (res.confirm) {
							this.$i18n.locale = lang;
							this.lang = lang
							// #ifdef APP-PLUS
							if (uni.getSystemInfoSync().platform.toLowerCase() === 'android') {
								uni.setLocale(lang);
							} else {
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
	}
</style>
