<template>
	<view>
		<u-navbar :leftIconColor="theme == 'light' ? '#303133' : '#fff'"
			:bgColor="theme == 'light' ? '#fff' : '#1F282F'" title="" :autoBack="true" placeholder="">
		</u-navbar>
		<view class="title">
			{{$t('设置')}}
		</view>
		<u-gap height="40rpx"></u-gap>
		<view class="nav">
			<view class="item" v-for="(item,index) in nav" :key="index" @click="next(item)">
				<view class="left">{{item.name}}</view>
				<view class="right">
					<text>{{item.val}}</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nav: [{
						name: this.$t('语言'),
						val: uni.getLocale() == 'en' ? 'English' : '中文简体',
						url: '/pages/language/language'
					},
					{
						name: this.$t('主题'),
						// #ifdef APP-PLUS
						val: this.$t(uni.getSystemInfoSync().theme == 'light' ? '白天模式' : '黑夜模式'),
						// #endif
						// #ifdef H5
						val: this.$t('自动'),
						// #endif
						url: '/pages/theme/theme'
					},
					{
						name: this.$t('清空缓存'),
						val: '0kb'
					},
					{
						name: this.$t('服务协议'),
						val: ''
					},
					{
						name: this.$t('隐私声明'),
						val: ''
					},
					{
						name: this.$t('关于我们'),
						val: ''
					},
					// #ifdef APP-PLUS
					{
						name: this.$t('检查更新'),
						update: true,
						val: 'v' + plus.runtime.version,
					},
					// #endif
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
			
		},
		methods: {
			next(item) {
				if (item.update) {
					this.utils.checkUpdate(this, true)
				}
				if (item.url) {
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
