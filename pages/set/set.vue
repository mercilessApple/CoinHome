<template>
	<view>
		<u-navbar :leftIconColor="theme == 'light' ? '#303133' : '#fff'"
			:bgColor="theme == 'light' ? '#fff' : '#1F282F'" title="" :autoBack="true" placeholder="">
		</u-navbar>
		<view class="title">
			{{ $t('设置') }}
		</view>
		<u-gap height="40rpx"></u-gap>
		<view class="nav">
			<view class="item" v-if="item.state" v-for="(item,index) in nav" :key="index" @click="next(item)">
				<view class="left">{{ item.name }}</view>
				<view class="right">
					<text>{{ item.val }}</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
			<!-- #ifdef APP-PLUS -->
			<view class="item">
				<view class="left">{{ $t('检查更新') }}</view>
				<view class="right">
					<text>{{ version }}</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showThemeBtn: false,
				version: '',
				nav: [{
						name: this.$t('语言'),
						val: uni.getLocale() == 'en' ? 'English' : '中文简体',
						url: '/pages/language/language',
						state: true
					},
					{
						name: this.$t('主题'),
						// #ifdef APP-PLUS
						val: this.$t(uni.getSystemInfoSync().theme == 'light' ? '白天模式' : '黑夜模式'),
						// #endif
						// #ifdef H5
						val: this.$t('自动'),
						// #endif
						url: '/pages/theme/theme',
						state: false
					},
					{
						name: this.$t('清空缓存'),
						val: '0kb',
						state: true
					},
					{
						name: this.$t('服务协议'),
						val: '',
						state: true
					},
					{
						name: this.$t('隐私声明'),
						val: '',
						state: true
					},
					{
						name: this.$t('关于我们'),
						val: '',
						url: '/pages/webview/webview',
						params: this.utils.aboutUsURL,
						state: true
					}
				]
			};
		},
		onShow() {
			// #ifdef APP-PLUS
			let themeItem = this.nav[1]
			if (uni.getStorageSync('theme')) {
				let themeVal = uni.getStorageSync('theme')
				if (themeVal == 'light') themeItem.val = this.$t('白天模式')
				if (themeVal == 'dark') themeItem.val = this.$t('黑夜模式')
				if (themeVal == 'auto') themeItem.val = this.$t('自动')
			}
			// #endif
		},
		onLoad() {
			const sysInfo = uni.getSystemInfoSync()
			if (sysInfo.platform == 'android') {
				if (parseInt(sysInfo.osVersion) >= 10) {
					this.nav[1].state = true
				}
			} else {
				if (parseInt(sysInfo.osVersion) >= 13) {
					this.nav[1].state = true
				}
			}
			let self = this
			// #ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
				self.version = widgetInfo.version
			})
			// #endif
		},
		methods: {
			next(item) {
				if (item.update) {
					this.utils.checkUpdate(this, true)
				}
				if (item.url) {
					if (item.params) {
						uni.$u.route({
							url: item.url,
							params: {
								url: item.params
							}
						})
						return
					}
					uni.$u.route(item.url)
				}
			}
		},
	}
</script>

<style lang="scss">
	.nav {
		.item {
			height: 96rpx;
			padding: 0 30rpx;
			display: flex;
			/* #ifdef APP-PLUS */
			padding-right: 0;
			/* #endif */
			justify-content: space-between;
			align-items: center;
			margin-top: 20rpx;

			.right {
				display: flex;
				align-items: center;

				text {
					margin-right: 20rpx;
					color: #9599A4;
					font-size: 28rpx;
				}
			}

			.left {
				font-weight: 500;
				color: #23212C;
			}
		}
	}

	.title {
		padding-left: 30rpx;
		line-height: 136rpx;
		font-weight: bold;
		color: #23282E;
		font-size: 48rpx;
		background: #F6F6F6;
	}

	@media (prefers-color-scheme: dark) {
		.title {

			background: #171E28;
			color: #fff;
		}

		.nav .item .left {
			color: #fff;
		}
	}
</style>
