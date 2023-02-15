<template>
	<view class="container">
		<view class="status">
			<view class="left">
				<text class="err">{{$t('卖出')}}</text> BTC
			</view>
			<view class="right">{{$t('成交')}}</view>
		</view>
		<view class="card">
			<view class="item">
				<view>{{$t('时间')}}</view>
				<view>12:39 01/30</view>
			</view>
			<view class="item">
				<view>{{$t('委托价')}}[USDT]</view>
				<view>35700.88</view>
			</view>
			<view class="item">
				<view>{{$t('成交均价')}}[USDT]</view>
				<view>35700.88</view>
			</view>
			<view class="item">
				<view>{{$t('委托数量')}}[BTC]</view>
				<view>0.14</view>
			</view>
			<view class="item">
				<view>{{$t('实际成交')}}[BTC]</view>
				<view>0.14</view>
			</view>
			<view class="item">
				<view>{{$t('成交总额')}}[USDT]</view>
				<view>700.88</view>
			</view>
			<view class="item">
				<view>{{$t('手续费')}}[USDT]</view>
				<view>0.88</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">
	.card {
		background-color: #F6F6F6;
		border-radius: 12rpx;
		padding: 33rpx 30rpx;

		.item {
			display: flex;
			padding: 33rpx 0;
			justify-content: space-between;

			view {
				&:last-child {

					font-weight: 500;
					font-size: 32rpx;
				}

				&:first-child {

					color: #929BA2;
					font-size: 24rpx;
				}
			}
		}
	}

	.container {
		.status {
			padding-top: 58rpx;
			display: flex;
			justify-content: space-between;
			padding-bottom: 50rpx;

			text {
				color: #2DBE87;

				&.err {
					color: #F5475E;
				}
			}

			view {
				font-weight: 500;
				color: #090909;
				font-size: 32rpx;
			}
		}

		padding: 0 30rpx;
	}
	
	@media (prefers-color-scheme: dark) {
		.card{
			background-color: #1F282F;
		}
		.container .status view{
			color: #fff;
		}
		page{
			background-color: #171E28;
		}
	}
</style>
