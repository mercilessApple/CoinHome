<template>
	<view>
		<u-navbar @rightClick="share('text')" :titleStyle="{
			'color':inverseParams('#1E1F29','#fff')
		}" :bgColor="inverseParams('#fff','#1E2930')" right-icon="share" :leftIconColor="inverseParams('#303133','#fff')"
			:title="$t('邀请好友')" autoBack placeholder>
		</u-navbar>

		<u-image src="@/static/icon59.png" width="750rpx" height="584rpx"></u-image>

		<view class="step-box">
			<view>
				<view class="icon">
					<u-image src="@/static/icon61.png" width="48rpx" height="48rpx"></u-image>
				</view>
				<text class="title">{{$t('发送链接邀请')}}</text>
			</view>
			<view class="line">
				<u-image width="80rpx" height="30rpx" mode="aspectFit" src="@/static/icon64.png"></u-image>
			</view>
			<view style="margin: 0 15rpx;">
				<view class="icon">
					<u-image src="@/static/icon62.png" width="48rpx" height="48rpx"></u-image>
				</view>
				<text class="title" >{{$t('注册并交易')}}</text>
			</view>
			<view class="line">
				<u-image width="80rpx" height="30rpx" mode="aspectFit" src="@/static/icon64.png"></u-image>
			</view>
			<view>
				<view class="icon">
					<u-image src="@/static/icon63.png" width="48rpx" height="48rpx"></u-image>
				</view>
				<text class="title">{{$t('共享大礼包')}}</text>
			</view>
		</view>

		<view class="content">
			<view class="item">
				<view class="lab">{{$t('我的邀请链接')}}</view>
				<view class="val">
					<text>{{link}}</text>
					<u-image @click="copy(link)" width="36rpx" height="36rpx"
						:src="inverseParams(require('@/static/icon65.png'),require('@/static/icon68.png'))"></u-image>
				</view>
			</view>
			<view class="item">
				<view class="lab">{{$t('我的邀请码')}}</view>
				<view class="val">
					<text>{{code}}</text>
					<u-image @click="copy(code)" width="36rpx" height="36rpx"
						:src="inverseParams(require('@/static/icon65.png'),require('@/static/icon68.png'))"></u-image>
				</view>
			</view>
		</view>

		<view class="btn">
			<view @click="showQRcode = true">{{$t('面对面邀请')}}</view>
			<view @click="showPoster = true">{{$t('海报分享')}}</view>
		</view>

		<u-popup @close="showQRcode = false" :safe-area-inset-bottom="false" :show="showQRcode">
			<view class="qr-box">
				<u-image src="@/static/icon66.png" width="750rpx" height="750rpx"></u-image>
				<view class="context">
					<view class="title">{{$t('面对面二维码邀请')}}</view>
					<view class="qr-code">
						<uqrcode :value="code" :size="upx" canvas-id="qrcode">
							<template v-slot:loading>
								<u-loading-icon mode="circle"></u-loading-icon>
							</template>
						</uqrcode>
					</view>
					<view class="id">
						{{$t('邀请码')}}ID:286593
					</view>
				</view>
			</view>
		</u-popup>

		<u-popup @open="onPosterOpen" width="750rpx" bgColor="transparent" mode="center" :show="showPoster"
			@close="showPoster = false" :safe-area-inset-bottom="false">
			<view class="poster">
				<view class="poster-image">
					<!-- <u-image src="@/static/icon67.png" width="640rpx" height="960rpx"></u-image> -->
					<canvas style="width: 640rpx;height: 960rpx;" canvas-id="poster"></canvas>
				</view>
				<view class="poster-btn">
					<view @click="share('poster')">{{$t('立即分享')}}</view>
					<view @click="savePoster">{{$t('保存相册')}}</view>
				</view>
			</view>
		</u-popup>

		<view class="uqrcode-box">
			<uqrcode @complete="complete" :value="code" :size="upx" ref="uqrcode" canvas-id="qrcode">
			</uqrcode>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				link: 'https://coinhome.pro/',
				upx: uni.upx2px(370),
				showPoster: false,
				code: 'test',
				showQRcode: false,
				qrCodeUrl: ''
			};
		},
		onLoad() {

		},
		methods: {
			copy(text){
				uni.setClipboardData({
					data:text
				})
			},
			share(scene) {
				// #ifdef H5
				uni.showToast({
					title: this.$t('H5端不支持分享'),
					icon: 'error'
				})
				return
				// #endif
				if (scene == 'poster') {
					uni.canvasToTempFilePath({
						canvasId: 'poster',
						success: ({
							tempFilePath
						}) => {
							uni.shareWithSystem({
								type: 'image',
								imageUrl: tempFilePath
							})
						},
						fail: err => {
							uni.showToast({
								title: JSON.stringify(err),
								icon: 'error'
							})
						}
					}, );
				} else {
					const shareString = this.link + this.code
					uni.shareWithSystem({
						type: 'text',
						summary: shareString,
						href: shareString
					})
				}
			},
			savePoster() {
				// 通过uni.createCanvasContext方式创建绘制上下文的，对应导出API为uni.canvasToTempFilePath
				// 调用完ctx.draw()方法后不能第一时间导出，否则会异常，需要有一定的延时
				uni.showLoading({
					title: this.$t('加载中...')
				})
				uni.canvasToTempFilePath({
						canvasId: 'poster',
						success: ({
							tempFilePath
						}) => {
							uni.saveImageToPhotosAlbum({
								filePath: tempFilePath,
								success: res => {
									uni.showToast({
										title: this.$t('操作成功！')
									})
								},
								fail: err => {
									uni.showToast({
										title: JSON.stringify(err),
										icon: 'error'
									})
								}
							});
						},
						fail: err => {
							uni.showToast({
								title: JSON.stringify(err),
								icon: 'error'
							})
						}
					},
					// this // 组件内使用必传当前实例
				);
			},
			complete(e) {
				uni.canvasToTempFilePath({
					canvasId: 'qrcode',
					success: ({
						tempFilePath
					}) => this.qrCodeImage = tempFilePath
				})
			},
			onPosterOpen() {
				const ctx = uni.createCanvasContext('poster', this)
				const posterUrl = require('@/static/icon67.png')

				ctx.drawImage(posterUrl, 0, 0, uni.upx2px(640), uni.upx2px(960))
				ctx.drawImage(this.qrCodeImage, uni.upx2px(520), uni.upx2px(835), uni.upx2px(90), uni.upx2px(90))
				ctx.draw()
			}
		},
	}
</script>

<style lang="scss">
	.uqrcode-box {
		position: absolute;
		opacity: 0;
		z-index: -1;
	}

	page {
		background: #F6F6F6;
	}

	.poster {
		width: 750rpx;

		.poster-image {
			width: 640rpx;
			margin: 0 auto;
			margin-bottom: 80rpx;
		}

		.poster-btn {
			display: flex;
			justify-content: space-between;
			padding: 0 30rpx;

			view {
				padding: 0 84rpx;
				line-height: 64rpx;
				border-radius: 16rpx;
				border: 2rpx solid #FFF803;
				font-weight: 500;
				color: #FFF803;
				font-size: 32rpx;
				background: #000000;
			}
		}
	}

	.qr-box {
		position: relative;

		.context {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			z-index: 1;
			text-align: center;
			padding-top: 64rpx;

			.qr-code {
				width: 400rpx;
				height: 400rpx;
				margin: 48rpx auto;
				background: #ccc;
				padding: 30rpx;
				background-color: #fff;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.title,
			.id {
				font-weight: 500;
				color: #000000;
				font-size: 32rpx;
			}
		}
	}

	.btn {
		display: flex;
		justify-content: space-between;
		padding: 0 30rpx;

		view {
			flex: 1;
			text-align: center;
			background: linear-gradient(90deg, #FEFA06 0%, #FEAA06 100%);
			border-radius: 16rpx;
			line-height: 96rpx;
			font-weight: 500;
			color: #333A45;
			font-size: 32rpx;

			&:first-child {
				margin-right: 22rpx;
			}

			&:last-child {
				margin-left: 22rpx;
			}
		}
	}

	.content {
		padding: 0 30rpx;
		transform: translateY(-37rpx);

		.item {
			margin-bottom: 32rpx;
			&:last-child{
				margin-bottom: 25rpx;
			}
			.val {
				height: 80rpx;
				padding: 0 30rpx;
				background: #FFFFFF;
				border-radius: 8rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;

				text {
					font-weight: 500;
					color: #2D270D;
					font-size: 30rpx;
				}
			}

			.lab {
				color: #1E1F29;
				margin-bottom: 16rpx;
				font-size: 24rpx;
			}
		}
	}

	.step-box {
		display: flex;
		align-items: center;
		padding: 0 30rpx;
		justify-content: space-between;
		height: 176rpx;
		border-radius: 24rpx;
		transform: translateY(-85rpx);
		margin: 0 30rpx;
		background-color: #fff;

		.line {
			// margin: 0 40rpx;
		}

		.icon {
			margin: 0 auto;
			width: 48rpx;
			height: 48rpx;
			margin-bottom: 16rpx;
		}

		.title {
			text-align: center;
			display: inline-block;

		font-size: 24rpx;
	}
	}

	@media (prefers-color-scheme: dark) {
		::v-deep {
			.u-navbar__content .u-icon__icon {
				color: #fff !important;
			}
		}

		page {
			background: #1E2930;
		}

		.step-box .title,
		.content .item .lab {
			color: #FFFFFF;
		}

		.content .item .val {
			background: #333A45;
		}

		.content .item .val text {
			color: #FEFA06;
		}

		.step-box {
			background-color: #333A45;
		}
	}
</style>
