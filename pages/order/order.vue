<template>
	<view>
		<view class="tab u-border-bottom">
			<u-tabs :activeStyle="{
						'color':theme == 'light' ? '#303133' : '#fff'
					}" lineHeight="8rpx" lineWidth="60rpx" lineColor="#FEFA05" :list="tabs" @click="click"></u-tabs>
		</view>
		<view class="list">
			<view :class="{
				'u-border-bottom':index < (index < (list.length - 1).length - 1)
			}" class="item" v-for="(item,index) in list" :key="index" @click="toNext(item)">
				<view class="left">
					<view>
						<view class="business">
							<text :class="{
								err:item.type == 2
							}">{{item.type == 2 ? $t('卖出'): $t('买入')}}</text> {{item.coinMarket[0]}}
						</view>

						<block v-if="tabIndex == 0">
							<view>
								<view>{{$t('价格')}}[{{item.coinMarket[1]}}]</view>
								<view>{{item.price}}</view>
							</view>
						</block>

						<block v-if="tabIndex == 1">
							<view class="left-item-box">
								<view>{{$t('时间')}}</view>
								<view>{{$moment(item.updateTime * 1000).format('HH:mm MM/DD')}}</view>
							</view>

							<view class="left-item-box">
								<view>{{$t('成交总额')}}[{{item.coinMarket[1]}}]</view>
								<view>{{item.totalTurnover}}</view>
							</view>
						</block>
					</view>
					<view>
						<view class="date">
							{{tabIndex == 0 ? $moment(item.createTime * 1000).format('HH:mm MM/DD') : ''}}
							<text style="opacity: 0;">占位</text>
						</view>
						<block v-if="tabIndex == 0">
							<view class="info">
								<view>{{$t('数量')}}[{{item.coinMarket[1]}}]</view>
								<view>{{utils.decimal(item.remainingNumber,5)}}</view>
							</view>
						</block>

						<block v-if="tabIndex == 1">
							<view class="info">
								<view>{{$t('委托价')}}[{{item.coinMarket[1]}}]</view>
								<view>{{item.price}}</view>
							</view>
							<u-gap height="30rpx"></u-gap>
							<view class="info">
								<view>{{$t('成交均价')}}[{{item.coinMarket[1]}}]</view>
								<view>{{item.averagePrice}}</view>
							</view>
						</block>
					</view>
				</view>
				<view class="right">
					<!-- <view class="right-status btn">{{$t('撤销')}}</view> -->
					<view @click="revoke(item)" class="right-status btn"
						v-if="tabIndex == 0 && (item.orderStatus == 0 || item.orderStatus == 2)">
						{{$t('撤销')}}
					</view>

					<block v-else>
						<view class="right-status text">
							<text v-if="(item.orderStatus || item.status) == 1">{{$t('完全成交')}}</text>
							<text v-if="(item.orderStatus || item.status) == 2">{{$t('部分成交')}}</text>
							<text v-if="(item.orderStatus || item.status) == 3">{{$t('撤销中')}}</text>
							<text v-if="(item.orderStatus || item.status) == 4">{{$t('撤销成功')}}</text>
							<u-icon
								v-if="(item.orderStatus || item.status) == 1 || (item.orderStatus || item.status) == 2"
								size="20rpx" name="arrow-right"></u-icon>
						</view>
					</block>

					<block v-if="tabIndex == 0">
						<view class="right-box-item">
							<view>{{$t('实际成交')}}[{{item.coinMarket[1]}}]</view>
							<view>{{utils.decimal(item.dealAmount,5)}}</view>
						</view>
					</block>
					<block v-if="tabIndex == 1">
						<view class="right-box-item">
							<view>{{$t('委托数量')}}[{{item.coinMarket[0]}}]</view>
							<view>{{item.turnover}}</view>
						</view>
						<u-gap height="30rpx"></u-gap>
						<view class="right-box-item">
							<view>{{$t('实际成交')}}[{{item.coinMarket[0]}}]</view>
							<view>{{item.volume}}</view>
						</view>
					</block>
				</view>
			</view>
		</view>
		<u-gap height="30rpx"></u-gap>
		<u-loadmore :status="status" :nomoreText="$t('nomoreText')" :loadingText="$t('loadingText')"
			:loadmoreText="$t('loadmoreText')" />
		<u-gap height="30rpx"></u-gap>
		<u-safe-bottom></u-safe-bottom>
	</view>
</template>

<script>
	import {
		getUserEntrustList,
		getEntrustHistory,
		cancelEntrustOrder
	} from "@/config/api"
	export default {
		data() {
			return {
				status: 'loading',
				tabIndex: 0,
				list: [],
				tabs: [{
						name: this.$t('currentDelegation', {
							number: 0
						})
					},
					{
						name: this.$t('历史记录')
					}
				]
			};
		},
		onLoad() {
			this.pageNum = 1
			this.pageSize = 10
			this.getList()
		},
		onReachBottom() {
			if (this.tabIndex == 0 || this.status == 'nomore') return
			this.pageNum++
			this.getList('onReachBottom')
		},
		methods: {
			revoke(item) {
				uni.showLoading({
					mask: true
				})
				cancelEntrustOrder({
					cancelEntrustList: [{
						entrustNo: item.entrustNo
					}]
				}).then(e => {
					uni.hideLoading()
					this.pageNum = 1
					this.getList()
				})
			},
			toNext(item) {
				if ((item.orderStatus || item.status) == 1 || (item.orderStatus || item.status) == 2) {
					uni.setStorageSync('orderDetailItem', item)
					uni.$u.route({
						url: '/pages/orderDetail/orderDetail',
						params: {
							entrustNo: item.entrustNo
						}
					})
				}
			},
			getList(scene) {
				this.status = 'loading'
				if (this.tabIndex == 0) {
					getUserEntrustList().then(e => {
						this.tabs[0].name = this.$t('currentDelegation', {
							number: e.length
						})
						e.forEach(item => {
							if (item.coinMarket) {
								item.coinMarket = item.coinMarket.split('/')
							}
						})
						this.status = 'nomore'
						this.list = e
					}).catch(() => this.status = 'nomore')
				} else {
					getEntrustHistory({
						pageNum: this.pageNum,
						pageSize: this.pageSize
					}).then(e => {
						if (e.records == '') {
							this.status = 'nomore'
							return
						}
						e.records.forEach(item => {
							if (item.coinMarket) {
								item.coinMarket = item.coinMarket.split('/')
							}
						})

						if (e.records.length < 10) {
							this.status = 'nomore'
						} else {
							this.status = 'loadmore'
						}

						this.list = scene == 'onReachBottom' ? this.list.concat(e.records) : e.records
					}).catch(() => this.status = 'nomore')
				}
			},
			click({
				index
			}) {
				this.tabIndex = index
				this.list = []
				this.pageNum = 1
				this.getList()
			}
		},
	}
</script>

<style lang="scss">
	.list {
		.item {
			display: flex;
			padding: 24rpx 30rpx;
			margin-top: 22rpx;

			.right {
				text-align: right;

				>view {
					&.right-box-item {
						view {
							&:first-child {
								color: #929BA2;
								margin-bottom: 16rpx;
								font-size: 24rpx;
							}

							&:last-child {
								font-weight: 500;
								font-size: 32rpx;
							}
						}
					}
				}

				.right-status {
					margin-bottom: 44rpx;
					line-height: 40rpx;

					&.text {
						display: flex;
						justify-content: flex-end;
						align-items: center;

						text {
							font-weight: 500;
							color: #2D270D;
							margin-right: 10rpx;
							font-size: 24rpx;
						}
					}

					&.btn {
						display: inline-block;
						padding: 0 24rpx;
						border-radius: 8rpx;
						background-color: #FEFA05;
						font-weight: 500;
						color: #2D270D;
						font-size: 24rpx;
					}
				}
			}

			.left {
				flex: 1;
				display: flex;

				>view {
					width: 50%;

					&:last-child {
						.date {
							margin-bottom: 44rpx;
							color: #929BA2;
							line-height: 40rpx;
							font-size: 24rpx;
						}

						.info {
							view {
								&:first-child {
									color: #929BA2;
									margin-bottom: 16rpx;
									font-size: 24rpx;
								}

								&:last-child {
									font-weight: 500;
									font-size: 32rpx;
								}
							}
						}
					}

					&:first-child {
						margin-right: 20rpx;

						>view {
							&:last-child {
								view {
									&:first-child {
										color: #929BA2;
										margin-bottom: 16rpx;
										font-size: 24rpx;
									}

									&:last-child {
										font-weight: 500;
										word-break: break-all;
										font-size: 32rpx;
									}
								}
							}
						}

						.left-item-box {
							&:last-child {
								margin-top: 30rpx;
							}

							view {
								&:first-child {
									color: #929BA2;
									margin-bottom: 16rpx;
									font-size: 24rpx;
								}

								&:last-child {
									font-weight: 500;
									word-break: break-all;
									font-size: 32rpx;
								}
							}
						}

						.business {
							font-weight: 500;
							color: #333333;
							margin-bottom: 44rpx;
							line-height: 40rpx;

							text {
								font-size: 32rpx;
								color: #2DBE87;

								&.err {
									color: #F5475E;
								}
							}
						}
					}
				}
			}
		}
	}

	::v-deep {
		.u-tabs__wrapper__nav__line {
			bottom: 0 !important;
		}
	}


	@media (prefers-color-scheme: dark) {

		.list .item,
		.tab {
			&.u-border-bottom {
				border-color: #343B45 !important;
			}
		}

		.list .item .left>view:first-child .business,
		.list .item .right .right-status.text text {
			color: #fff;
		}
	}
</style>
