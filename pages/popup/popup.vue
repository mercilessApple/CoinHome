<template>
	<view class="mask">
		<view @click.stop="onClick" class="content">
			<view class="title">
				<view class="icon">
					<u-image mode="aspectFit" width="164rpx" height="12rpx" src="@/static/icon69.png"></u-image>
				</view>
				<text class="text">{{$t('公告')}}</text>
				<view class="icon" style="transform: rotate(180deg);">
					<u-image mode="aspectFit" width="164rpx" height="12rpx" src="@/static/icon69.png"></u-image>
				</view>
			</view>
			<view class="tip">{{popupInfo.title}}</view>
			<view class="context">
				<rich-text :nodes="popupInfo.content"></rich-text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		popupNotice
	} from '@/config/api'
	export default {
		data() {
			return {
				popupInfo: ''
			}
		},
		onLoad(options) {
			// 单页禁止测滑返回
			// #ifdef APP-PLUS
			let currentWebview = this.$mp.page.$getAppWebview() //获取当前页面的webview对象
			currentWebview.setStyle({
				popGesture: 'none'
			})
			// #endif
		},
		onShow() {
			popupNotice().then(e => {
				if (e.maintenance == '') {
					setTimeout(() => {
						uni.navigateBack()
					}, 1000)
				} else {
					this.popupInfo = e[0]
				}
			})
		},
		onBackPress(options) {
			if (options.from === "backbutton") {
				return true
			} else {
				return false
			}
		},
		methods: {
			onClick(e) {
				// #ifdef APP-NVUE
				e.stopPropagation()
				// #endif
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: transparent;
	}

	.mask {
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.4);
	}

	.content {
		width: 630rpx;
		border-radius: 20rpx;
		background: #FFFFFF;
		padding: 0 30rpx;
		padding-bottom: 40rpx;

		.context {
			height: 385rpx;
			overflow: auto;
			font-weight: 400;
			color: #969AA6;
			font-size: 24rpx;
		}

		.title {
			font-weight: 500;
			color: #23212C;
			text-align: center;
			padding: 35rpx 0;
			font-size: 40rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.text {
				margin: 0 30rpx;
			}
		}

		.tip {
			font-weight: 500;
			margin-bottom: 35rpx;
			text-align: center;
			color: #0E0E0E;
			font-size: 28rpx;
		}
	}
	
	
	@media (prefers-color-scheme: dark) {
		.content{
			background: #1F282F;
			.title,.tip{
				color: #fff;
			}
			.context{
				color: #969AA6;
			}
		}
	}
</style>
