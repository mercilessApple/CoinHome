<template>
	<view>
		<u-navbar placeholder @rightClick="rightClick" bgColor="#f6f6f6">
			<view class="u-nav-slot" slot="left">
				<view class="nav-coin">
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
							<view @click.stop="selectItem">限价委托</view>
							<view @click.stop="selectItem">限价委托</view>
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
						<u-input type="number" inputAlign="center" border="none" :placeholder="`${$t('总额')}(USDT)`"></u-input>
					</view>
					<u-gap height="30rpx"></u-gap>

					<view class="usable">
						<view class="tip">
							<view>可用</view>
							<view>10000.0154 USDT</view>
						</view>
					</view>
					<u-gap height="30rpx"></u-gap>
					<view class="btn">{{$t('买入')}}BTC</view>
				</view>
			</view>
			<u-gap height="60rpx"></u-gap>
		</view>
		<view class="mask" v-show="showMoreSelect" @click="showMoreSelect = false"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				block: ['25%', '50%', '75%', '100%'],
				barIndex: 0,
				count: 1,
				number: 35606.32,
				showMoreSelect: false
			};
		},
		methods: {
			rightClick() {

			},
			selectItem() {

			}
		},
	}
</script>

<style lang="scss">
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

		.upper {
			display: flex;

			.left {
				width: 60%;
				padding-top: 30rpx;

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
