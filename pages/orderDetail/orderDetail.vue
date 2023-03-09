<template>
	<view class="container">
		<view class="status">
			<view class="left">
				<text :class="{
					err:listItem.type == 2
				}">{{listItem.type == 2 ? $t('卖出'): $t('买入')}}</text> {{listItem.coinMarket[0]}}
			</view>
			<view class="right">
				<text v-if="(listItem.orderStatus || listItem.status) == 1">{{$t('完全成交')}}</text>
				<text v-if="(listItem.orderStatus || listItem.status) == 2">{{$t('部分成交')}}</text>
				<text v-if="(listItem.orderStatus || listItem.status) == 3">{{$t('撤销中')}}</text>
				<text v-if="(listItem.orderStatus || listItem.status) == 4">{{$t('撤销成功')}}</text>
			</view>
		</view>
		<view class="card" v-for="(item,index) in list" :key="index">
			<view class="item">
				<view>{{$t('时间')}}</view>
				<view>{{$moment(item.createTime * 1000).format('HH:mm MM/DD')}}</view>
			</view>
			<view class="item">
				<view>{{$t('委托价')}}[{{listItem.coinMarket[1]}}]</view>
				<view>{{listItem.price}}</view>
			</view>
			<view class="item">
				<view>{{$t('成交均价')}}[{{listItem.coinMarket[1]}}]</view>
				<view>{{listItem.averagePrice}}</view>
			</view>
			<view class="item">
				<view>{{$t('委托数量')}}[{{listItem.coinMarket[0]}}]</view>
				<view>{{listItem.turnover}}</view>
			</view>
			<view class="item">
				<view>{{$t('实际成交')}}[{{listItem.coinMarket[0]}}]</view>
				<view>{{item.amount}}</view>
			</view>
			<view class="item">
				<view>{{$t('成交总额')}}[{{listItem.coinMarket[1]}}]</view>
				<view>{{item.amount * listItem.averagePrice}}</view>
			</view>
			<view class="item">
				<view>{{$t('手续费')}}[{{listItem.coinMarket[1]}}]</view>
				<view>{{item.fee}}</view>
			</view>
		</view>
		<u-gap height="30rpx"></u-gap>
	</view>
</template>

<script>
	import {
		getOrderEntrustDetail
	} from "@/config/api"
	export default {
		data() {
			return {
				list: [],
				listItem: uni.getStorageSync('orderDetailItem')
			};
		},
		onLoad(options) {
			const listItem = uni.getStorageSync('orderDetailItem')
			this.entrustNo = options.entrustNo
			this.pageNum = 1
			uni.showLoading({
				mask: true
			})
			this.getList()
		},
		onReachBottom() {
			if (this.loaded) return
			uni.showLoading({
				mask: true
			})
			this.pageNum++
			this.getList()
		},
		onUnload() {
			uni.removeStorageSync('orderDetailItem')
		},
		methods: {
			getList() {
				// if (this.type == 'entrust') {
				getOrderEntrustDetail({
					entrustNo: this.entrustNo,
					pageNum: this.pageNum,
					pageSize: 10
				}).then(e => {
					uni.hideLoading()
					if (e.records == '') {
						this.loaded = true
						return
					}
					this.list = this.list.concat(e.records)
				})
				// }
			}
		},
	}
</script>

<style lang="scss">
	.card {
		background-color: #F6F6F6;
		border-radius: 12rpx;
		padding: 33rpx 30rpx;
		margin-top: 33rpx;

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
			// padding-bottom: 50rpx;
			padding-bottom: 20rpx;

			.left {
				text {
					color: #2DBE87;

					&.err {
						color: #F5475E;
					}
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
		.card {
			background-color: #1F282F;
		}

		.container .status view {
			color: #fff;
		}

		page {
			background-color: #171E28;
		}
	}
</style>
