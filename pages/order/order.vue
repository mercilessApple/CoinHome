<template>
	<view>
		<view class="tab u-border-bottom">
			<u-tabs lineHeight="8rpx" lineWidth="60rpx" lineColor="#FEFA05" :list="tabs" @click="click"></u-tabs>
		</view>
		<view class="list">
			<view class="item u-border-bottom" @click="$u.route({
				url:'/pages/orderDetail/orderDetail'
			})">
				<view class="left">
					<view>
						<view class="business">
							<text>{{$t('买入')}}</text> BTC
						</view>
						<view>
							<view>{{$t('价格')}}[USDT]</view>
							<view>35700.88</view>
						</view>
					</view>
					<view>
						<view class="date">04:07 01/29</view>
						<view class="info">
							<view>{{$t('数量')}}[BTC]</view>
							<view>0.14</view>
						</view>
					</view>
				</view>
				<view class="right">
					<view class="right-status btn">{{$t('撤销')}}</view>
					<view>
						<view>{{$t('实际成交')}}[BTC]</view>
						<view>0</view>
					</view>
				</view>
			</view>
			<view class="item u-border-bottom">
				<view class="left">
					<view>
						<view class="business">
							<text class="err">{{$t('卖出')}}</text> BTC
						</view>
						<view>
							<view>{{$t('价格')}}[USDT]</view>
							<view>35700.88</view>
						</view>
					</view>
					<view>
						<view class="date">04:07 01/29</view>
						<view class="info">
							<view>{{$t('数量')}}[BTC]</view>
							<view>0.14</view>
						</view>
					</view>
				</view>
				<view class="right">
					<view class="right-status text">
						<text>{{$t('成交')}}</text>
						<u-icon size="20rpx" name="arrow-right"></u-icon>
					</view>
					<view>
						<view>{{$t('实际成交')}}[BTC]</view>
						<view>0</view>
					</view>
				</view>
			</view>
			<view class="item u-border-bottom">
				<view class="left">
					<view>
						<view class="business">
							<text class="err">{{$t('卖出')}}</text> BTC
						</view>
						<view>
							<view>{{$t('价格')}}[USDT]</view>
							<view>35700.88</view>
						</view>
					</view>
					<view>
						<view class="date">04:07 01/29</view>
						<view class="info">
							<view>{{$t('数量')}}[BTC]</view>
							<view>0.14</view>
						</view>
					</view>
				</view>
				<view class="right">
					<view class="right-status text">
						<text>{{$t('已撤销')}}</text>
						<u-icon size="20rpx" name="arrow-right"></u-icon>
					</view>
					<view>
						<view>{{$t('实际成交')}}[BTC]</view>
						<view>0</view>
					</view>
				</view>
			</view>
		</view>
		<u-gap height="30rpx"></u-gap>
		<u-safe-bottom></u-safe-bottom>
	</view>
</template>

<script>
	export default {
		data() {
			return {
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

		methods: {
			click(e) {

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
					&:last-child {
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
			bottom: 0;
		}
	}
</style>
