<template>
	<view>
		<u-navbar placeholder @rightClick="rightClick" bgColor="#f6f6f6">
			<view class="u-nav-slot" slot="left">
				<view class="nav-coin" @click="show = true">
					<u-image src="/static/icon32.png" width="48rpx" height="48rpx"></u-image>
					<text class="name">BTC/USDT</text>
					<text class="proportion add">+0.25%</text>
				</view>
			</view>
			<view class="u-nav-slot" slot="right">
				<u-image width="48rpx" height="48rpx" src="/static/icon33.png"></u-image>
			</view>
		</u-navbar>

		<view class="content">
			<view class="upper">
				<view class="left">
					<view class="bar">
						<view @click="barIndex = 0" class="item" :class="{
							active:barIndex == 0
						}">{{$t('买入')}}
							<view class="triangle"></view>
						</view>
						<view @click="barIndex = 1" class="item" :class="{
							active:barIndex == 1
						}">{{$t('卖出')}}
							<view class="triangle"></view>
						</view>
					</view>
					<view class="select" @click="showMoreSelect = !showMoreSelect">
						{{$t('限价委托')}}
						<view class="icon">
							<u-icon color="#929BA2" size="20rpx" name="arrow-down-fill"></u-icon>
						</view>

						<view class="down-box" v-show="showMoreSelect">
							<view @click.stop="selectItem">{{$t('限价委托')}}</view>
						</view>
					</view>
					<u-gap height="16rpx"></u-gap>
					<view class="number-box">
						<u-number-box bgColor="#f6f6f6" inputWidth="286rpx" v-model="number"></u-number-box>
					</view>
					<u-gap height="16rpx"></u-gap>
					<view class="count-box">
						<u-number-box :placeholder="`${$t('数量')}(BTC)`" bgColor="#f6f6f6" inputWidth="286rpx"
							v-model="count"></u-number-box>
					</view>
					<u-gap height="16rpx"></u-gap>

					<view class="block">
						<view v-for="(item,index) in block" :key="index">{{item}}</view>
					</view>
					<u-gap height="16rpx"></u-gap>

					<view class="total-amount">
						<u-input type="number" inputAlign="center" border="none" :placeholder="`${$t('总额')}(USDT)`">
						</u-input>
					</view>
					<u-gap height="30rpx"></u-gap>

					<view class="usable">
						<view class="tip">
							<view>{{$t('可用')}}</view>
							<view>10000.0154 USDT</view>
						</view>
					</view>
					<u-gap height="30rpx"></u-gap>
					<view class="btn">{{$t('买入')}}BTC</view>
				</view>
				<view class="right">
					<view class="lab-box">
						<view class="lab">
							<view>{{$t('价格')}}</view>
							<text>(USDT)</text>
						</view>
						<view class="lab">
							<view>{{$t('数量')}}</view>
							<text>(BTC)</text>
						</view>
					</view>
					<view class="price-box">
						<view>

							<view class="price">35700.88</view>
							<view class="price">35700.88</view>
							<view class="price">35700.88</view>
							<view class="price">35700.88</view>
							<view class="price">35700.88</view>
						</view>
						<view>

							<view class="price">0.1452</view>
							<view class="price">0.1452</view>
							<view class="price">0.1452</view>
							<view class="price">0.1452</view>
							<view class="price">0.1452</view>
						</view>
					</view>
					<view class="area">
						<view>35700.88</view>
						<view>≈ ¥ 35606.32</view>
					</view>
					<view class="price-box bottom">
						<view>
							<view class="price">35700.88</view>
							<view class="price">35700.88</view>
							<view class="price">35700.88</view>
							<view class="price">35700.88</view>
							<view class="price">35700.88</view>
						</view>
						<view>
							<view class="price">0.1452</view>
							<view class="price">0.1452</view>
							<view class="price">0.1452</view>
							<view class="price">0.1452</view>
							<view class="price">0.1452</view>
						</view>
					</view>
				</view>
			</view>

			<view class="lower">
				<view class="tab u-border-bottom">
					<u-tabs lineHeight="8rpx" lineWidth="60rpx" lineColor="#FEFA05" :list="tabs" @click="click">
					</u-tabs>
					<view class="icon" @click="$u.route('/pages/order/order')">
						<u-image width="40rpx" height="40rpx" src="/static/icon35.png"></u-image>
					</view>
				</view>
				<block v-if="false">
					<u-empty icon="/static/icon34.png" :text="$t('无当前委托')"></u-empty>
					<u-gap height="300rpx"></u-gap>
				</block>
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
					<view class="item">
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
			</view>
			<!-- <u-gap height="60rpx"></u-gap> -->
		</view>
		<view class="mask" v-show="showMoreSelect" @click="showMoreSelect = false"></view>

		<u-popup @close="show = false" :show="show" mode="left" :customStyle="{
			'border-radius':'0 60rpx 60rpx 0',
			'width':'640rpx'
		}">
			<view class="popup">
				<u-status-bar></u-status-bar>
				<view class="title">{{$t('市场')}}</view>
				<view class="search">
					<u-search height="64rpx" placeholder="" :showAction="false" bgColor="#F6F6F6"></u-search>
				</view>
				<view class="popup-tab">
					<u-tabs activeStyle="color:#000000" inactiveStyle="color:#848B9B" lineHeight="8rpx"
						lineWidth="48rpx" lineColor="#FEFA05" :list="popupTabs" @click="click"></u-tabs>
				</view>
				<view class="list-tab">
					<view>{{$t('名称')}}</view>
					<view>{{$t('最新价格')}}/{{$t('24h涨跌幅')}}</view>
				</view>
				<view class="list">
					<view class="item active">
						<view class="left">
							GODE<text>/USDT</text>
						</view>
						<view class="right">
							<view>0.0217</view>
							<view>+6.12%</view>
						</view>
					</view>
					<view class="item">
						<view class="left">
							GODE<text>/USDT</text>
						</view>
						<view class="right">
							<view>0.0217</view>
							<view class="err">-6.12%</view>
						</view>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				popupTabs: [{
						name: this.$t('自选')
					},
					{
						name: 'USDT'
					}
				],
				show: false,
				block: ['25%', '50%', '75%', '100%'],
				tabs: [{
					name: this.$t('currentDelegation', {
						number: 0
					})
				}],
				barIndex: 0,
				count: 1,
				number: 35606.32,
				showMoreSelect: false
			};
		},
		methods: {
			click(e) {

			},
			rightClick() {

			},
			selectItem() {

			}
		},
	}
</script>

<style lang="scss">
	page {
		::v-deep {
			.u-tabs__wrapper__nav__line {
				bottom: 0 !important;
			}
		}
	}


	.popup {
		.list {

			.item {
				display: flex;
				justify-content: space-between;
				padding: 0 30rpx;
				height: 96rpx;
				align-items: center;
				&.active{
					background-color: #F6F6F6;
				}
				.right {
					view {
						&:first-child {
							font-weight: bold;
							color: #000000;
							font-size: 30rpx;
						}

						&:last-child {
							font-weight: bold;
							color: #2DBE87;
							font-size: 24rpx;
							&.err{
								color: #F5475E;
							}
						}
					}
				}

				.left {
					font-weight: bold;
					font-size: 30rpx;
					padding-top: 20rpx;
					align-self: flex-start;
					text {
						color: #848D96;
						font-size: 24rpx;
					}
				}
			}
		}

		.list-tab {
			padding: 0 30rpx;
			display: flex;
			justify-content: space-between;
			height: 92rpx;
			align-items: center;
			color: #BAB9BE;
			font-size: 24rpx;
		}

		.popup-tab {
			border-bottom: 2rpx solid #EFEFEF;
		}

		::v-deep {
			.u-tabs__wrapper__nav__line {
				// bottom: 0 !important;
			}
		}

		.search {
			margin-bottom: 15rpx;
			padding: 0 30rpx;
		}

		.title {
			padding: 0 30rpx;
			padding-top: 70rpx;
			font-weight: 500;
			margin-bottom: 30rpx;
			font-size: 48rpx;
		}
	}

	.mask {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 999;
		background-color: transparent;
	}

	.content {
		background: #FFFFFF;
		border-radius: 40rpx 40rpx 0px 0px;
		padding: 0 30rpx;

		.lower {
			padding-top: 60rpx;

			.tab {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

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


		}

		.upper {
			display: flex;
			padding-top: 30rpx;

			.right {
				flex: 1;
				padding-left: 30rpx;
				display: flex;
				flex-direction: column;

				.lab-box {
					display: flex;
					justify-content: space-between;
					text-align: left;
					margin-bottom: 24rpx;

					.lab {

						&:last-child {
							text-align: right;
						}

						view,
						text {
							color: #929BA2;
							font-size: 24rpx;
						}
					}
				}

				.area {
					padding: 36rpx 0;

					view {
						font-weight: 500;
						text-align: center;

						&:first-child {
							color: #2DBE87;
							font-size: 36rpx;
						}

						&:last-child {
							font-weight: 500;
							margin-top: 5rpx;
							color: #929BA2;
							font-size: 24rpx;
						}
					}
				}

				.price-box {
					display: flex;
					justify-content: space-between;
					flex: 1;

					&.bottom {
						>view {
							&:first-child {
								.price {
									color: #F5475E;
								}
							}
						}

						.price {
							&:first-child {
								margin-top: 0;
							}
						}
					}

					>view {

						.price {
							font-weight: 500;
							padding: 10rpx 0;
							font-size: 22rpx;

							&:first-child {
								padding-top: 0;
							}

							&:last-child {
								padding-bottom: 0;
							}
						}

						&:last-child {
							text-align: right;

							.price {
								color: #000000;
							}
						}



						&:first-child {
							.price {
								color: #2DBE87;
							}
						}
					}
				}
			}

			.left {
				width: 60%;

				.btn {
					line-height: 80rpx;
					text-align: center;
					background: #2DBE87;
					border-radius: 8rpx;
					font-weight: 500;
					font-size: 32rpx;
					color: #FFFFFF;
				}

				.usable {
					.tip {
						display: flex;
						justify-content: space-between;
						font-weight: 500;
						font-size: 24rpx;
						color: #191919;
					}
				}

				.total-amount {
					display: flex;
					align-items: center;
					height: 80rpx;
					background: #F6F6F6;
				}

				.block {
					display: flex;
					justify-content: space-between;

					view {
						background: #F6F6F6;
						border-radius: 8rpx;
						font-weight: 500;
						color: #929BA2;
						padding: 8rpx 20rpx;
						font-size: 24rpx;
					}
				}

				.number-box,
				.count-box {
					height: 80rpx;
					background: #F6F6F6;
					display: flex;
					overflow: hidden;
					align-items: center;

					::v-deep {

						.u-number-box__plus--hover,
						.u-number-box__minus--hover {
							background-color: #f6f6f6 !important;
						}
					}
				}

				.select {
					height: 48rpx;
					position: relative;
					background: #F6F6F6;
					border-radius: 8rpx;
					align-items: center;
					display: flex;
					font-weight: 500;
					color: #1E1F29;
					font-size: 28rpx;

					.down-box {
						position: absolute;
						// display: none;
						left: 0;
						width: 100%;
						top: 50rpx;
						z-index: 1000;
						box-shadow: 1rpx 1rpx 10rpx 0 rgba(0, 0, 0, 0.1);
						padding: 10rpx 0;

						view {
							padding: 20rpx 30rpx;
							// line-height: 50rpx;
						}

						background-color: #fff;
					}

					.icon {
						position: absolute;
						right: 20rpx;
					}

					justify-content: center;
				}

				.bar {
					margin-bottom: 20rpx;
					display: flex;
					border-radius: 8rpx;
					overflow: hidden;

					.item {
						flex: 1;
						font-weight: 500;
						font-size: 30rpx;
						text-align: center;
						position: relative;
						overflow: hidden;
						line-height: 60rpx;
						background-color: #f6f6f6;
						color: #929BA2;

						&.active {
							background-color: #2EBD87;
							color: #FFFFFF;
						}

						.triangle {
							position: absolute;
							top: 0;
							border-style: solid;
							border-color: transparent;
							border-width: 31rpx 0 31rpx 31rpx;
							border-left-color: #2EBD87;
						}

						&:first-child {
							.triangle {
								right: -1rpx;
								transform: rotate(180deg);
							}
						}

						&:last-child {
							.triangle {
								left: -1rpx;
							}
						}

					}
				}
			}
		}
	}

	page {
		background-color: #f6f6f6;
	}

	.nav-coin {
		display: flex;
		align-items: center;

		.proportion {
			font-weight: 500;
			font-size: 28rpx;

			&.add {
				color: #2EBD87;
			}
		}

		.name {
			font-weight: bold;
			color: #1E1F29;
			font-size: 36rpx;
			margin: 0 20rpx;
		}
	}
</style>
