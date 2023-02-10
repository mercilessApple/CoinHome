<template>
	<view>
		<view class="err" v-if="info.tradeStatus === 2">
			<view class="tip">{{$t('失败原因')}}：</view>
			<view class="desc">{{info.reason}}</view>
		</view>
		<view class="title">{{info.amount}} {{info.coinName}}</view>
		<view class="card">
			<view class="item">
				<view class="lab">{{$t('交易类型')}}</view>
				<view class="val">{{info.type == 1 ? $t('充值') : $t('提币')}}</view>
			</view>
			<view class="item">
				<view class="lab">{{$t('交易订单号')}}</view>
				<view class="val">{{info.id}}</view>
			</view>
			<view class="item">
				<view class="lab">{{$t('交易状态')}}</view>
				<view class="val green" :class="{
					green:info.tradeStatus == 1,
					red:info.tradeStatus == 2
				}">{{tradeStatus}}</view>
			</view>
			<view class="item">
				<view class="lab">{{info.type == 1 ? $t('充值') : $t('提币')}}{{$t('时间')}}</view>
				<view class="val">{{info.createTime}}</view>
			</view>
			<view class="item">
				<view class="lab">{{info.type == 1 ? $t('充值') : $t('提币')}}{{$t('地址')}}</view>
				<view class="val"><text selectable>{{info.toAddr}}</text></view>
			</view>
			<view class="item" v-if="info.type == 2">
				<view class="lab">{{$t('提币')}}{{$t('手续费')}}</view>
				<view class="val">{{info.fee}}</view>
			</view>
			<view class="item" v-if="info.type == 1">
				<view class="lab">Txid</view>
				<view class="val">{{info.txId}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: uni.getStorageSync('financialDetail')
			};
		},
		computed: {
			tradeStatus() {
				let str
				if (this.info.tradeStatus == 0) str = this.$t('待审核')
				if (this.info.tradeStatus == 1) str = this.$t('成功')
				if (this.info.tradeStatus == 2) str = this.$t('失败')
				if (this.info.tradeStatus == 3) str = this.$t('初步审核成功')
				if (this.info.tradeStatus == 4) str = this.$t('审核失败')
				if (this.info.tradeStatus == 5) str = this.$t('划转待确认')
				if (this.info.tradeStatus == 6) str = this.$t('充币确认中')

				return str
			}
		},
		onUnload() {
			uni.removeStorageSync('financialDetail')
		}
	}
</script>

<style lang="scss">
	.err {
		background: #F6F6F6;
		padding: 30rpx;

		.desc {
			color: #F5475E;
			font-size: 28rpx;
			line-height: 45rpx;
		}

		.tip {
			font-weight: bold;
			margin-bottom: 20rpx;
			color: #F5475E;
			font-size: 48rpx;
		}
	}

	.title {
		font-weight: 500;
		color: #000000;
		text-align: center;
		padding-top: 50rpx;
		padding-bottom: 40rpx;
		font-size: 48rpx;
	}

	.card {

		background: #F6F6F6;
		border-radius: 12rpx;
		margin: 0 30rpx;
		padding: 30rpx;

		.item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx 0;

			.lab {
				color: #929BA2;
				font-size: 24rpx;
				width: 20%;
				padding-right: 15rpx;
			}

			.val {
				font-weight: 500;
				width: 80%;
				text-align: right;
				word-break: break-all;
				font-size: 32rpx;

				&.green {
					color: #2DBE87;
				}

				&.red {
					color: #F5475E
				}
			}
		}
	}
</style>
