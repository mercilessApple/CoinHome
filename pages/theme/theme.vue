<template>
	<view>
		<u-navbar :leftIconColor="theme == 'light' ? '#303133' : '#fff'" title="" :autoBack="true" placeholder="">
		</u-navbar>
		<view class="title">
			{{$t('主题模式')}}
		</view>
		<view class="nav">
			<view class="item" @click="changeTheme('auto',0)">
				<view class="left">{{$t('自动')}}</view>
				<view class="right">
					<u-icon v-if="themeIndex == 0" color="#FE9205" name="checkmark"></u-icon>
				</view>
			</view>

			<!-- #ifdef APP-PLUS -->
			<view class="item" @click="changeTheme('light',1)">
				<view class="left">{{$t('白天模式')}}</view>
				<view class="right">
					<u-icon v-if="themeIndex == 1" color="#FE9205" name="checkmark"></u-icon>
				</view>
			</view>
			<view class="item" @click="changeTheme('dark',2)">
				<view class="left">{{$t('黑夜模式')}}</view>
				<view class="right">
					<u-icon v-if="themeIndex == 2" color="#FE9205" name="checkmark"></u-icon>
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
				themeIndex: null
			};
		},
		onLoad() {
			const themeStoreage = uni.getStorageSync('theme')
			if (themeStoreage) {
				let index
				if (themeStoreage == 'auto') index = 0
				if (themeStoreage == 'light') index = 1
				if (themeStoreage == 'dark') index = 2
				this.themeIndex = index
			} else {
				// #ifdef APP-PLUS
				this.themeIndex = uni.getSystemInfoSync().theme == 'light' ? 1 : 2
				// #endif
				// #ifdef H5
				this.themeIndex = 0
				// #endif
			}
		},
		methods: {
			changeTheme(theme, index) {
				// #ifdef APP-PLUS
				plus.nativeUI.setUiStyle(theme);
				this.themeIndex = index
				uni.setStorageSync('theme', theme)
				// #endif
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
		::v-deep{
			.u-navbar__content,
			.u-status-bar {
				background-color: #1F282F !important;
			}
		}
	
	}
</style>
