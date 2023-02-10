<template>
	<view>
		<view class="content">
			<view class="upper">
				<view class="info">
					<view class="left">
						<view class="assets">
							<text>{{$t('总资产')}}(USDT)</text>
							<u-image @click="showVal = !showVal"
								:src="require(showVal ? '@/static/icon1.png' : '@/static/icon2.png')" width="36rpx"
								height="36rpx">
							</u-image>
						</view>
						<view class="val">
							{{showVal ? (assetsInfo.convertUsdtSumAccount || 0) : '***'}}
						</view>
						<view class="unit">
							≈ ¥{{showVal ? assetsInfo.convertCnySumAccount : '***'}}
						</view>
					</view>
					<view class="right" @click="$u.route({
						url:'/pages/financialRecords/financialRecords',
						params:{
							coin:'USDT', coinId:curCoin[0].coinId }})">
						<u-image width="48rpx" height="48rpx" src="@/static/icon25.png"></u-image>
					</view>
				</view>
				<view class="btn">
					<view @click="toNext('/pages/recharge/recharge')">{{$t('充值')}}</view>
					<view @click="toNext('/pages/rechargeDetail/rechargeDetail?coin=USDT&scene=withdraw')">{{$t('提现')}}
					</view>
				</view>
			</view>
		</view>
		<u-gap height="10rpx"></u-gap>
		<view class="list">
			<view class="title">
				{{$t('资产列表')}}
			</view>
			<view class="info">
				<view class="left">
					<u-checkbox-group v-model="checkboxGroup">
						<u-checkbox labelColor="#929BA2" labelSize="24rpx" activeColor="#FEFA05" shape="circle" key="0"
							:label="$t('hideAssets',{
								val:0
							})"></u-checkbox>
					</u-checkbox-group>
				</view>
				<view class="right">
					<u-search :placeholder="$t('搜索')" :showAction="false"></u-search>
				</view>
			</view>

			<view class="item" :key="index" v-for="(item,index) in list">
				<view class="lab">
					<u-image :src="item.coinUrl" width="40rpx" height="40rpx"></u-image>
					<text>{{item.coinName}}</text>
				</view>
				<view class="box">
					<view>
						<view>{{$t('可用余额')}}</view>
						<view>{{item.amount}}</view>
					</view>
					<view>
						<view>{{$t('冻结余额')}}</view>
						<view>{{item.frozenAmount}}</view>
					</view>
					<view>
						<view>{{$t('折合(USDT)')}}</view>
						<view>{{item.convertUsdtAmount}}</view>
					</view>
				</view>
			</view>

			<block v-if="list == ''">
				<u-gap height="300rpx"></u-gap>
				<u-empty :text="$t('暂无数据')"></u-empty>
				<u-gap height="300rpx"></u-gap>
			</block>
		</view>
	</view>
</template>

<script>
	import {
		queryAccountSum,
		queryAccountInfo,
		getOptionalMarket,
		queryDepositPayCoin
	} from "@/config/api"
	export default {
		data() {
			return {
				showVal: true,
				checkboxGroup: [],
				assetsInfo: {
					convertCnySumAccount: "0",
					convertUsdtSumAccount: 0
				},
				list: [],
				curCoin: []
			};
		},
		onLoad() {
			getOptionalMarket().then(e => {
				let coinIds = e.map(item => item.type)
				coinIds.forEach(item => {
					queryAccountInfo({
						type: item
					}).then(e => {
						this.list.push(e.coinAccountList)
					})
				})
			})
			queryAccountSum().then(e => this.assetsInfo = e)

			queryDepositPayCoin().then(e => {
				this.curCoin = e.filter(item => item.coinName == 'USDT')
			})
		},
		methods: {
			toNext(url) {
				let route
				if (uni.getStorageSync('token')) route = url
				else route = '/pages/login/login';

				uni.navigateTo({
					url: route
				})
			}
		},
	}
</script>

<style lang="scss">
	.list {
		background-color: #fff;
		padding: 30rpx;

		.item {
			margin-top: 30rpx;

			.lab {
				display: flex;
				align-items: center;

				text {
					margin-left: 20rpx;
					font-weight: 500;
					color: #252525;
					font-size: 32rpx;
				}
			}

			.box {
				padding-top: 30rpx;
				display: flex;
				justify-content: space-between;
				padding-left: 70rpx;

				>view {
					>view {
						&:first-child {

							color: #929BA2;
							font-size: 24rpx;
						}

						&:last-child {
							font-weight: 500;
							font-size: 28rpx;
							color: #252525;
						}
					}
				}
			}
		}

		.info {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 10rpx;

			.right {
				width: 200rpx;
			}
		}

		.title {
			font-weight: 500;
			font-size: 36rpx;
			color: #1F232C;
			margin-bottom: 20rpx;
		}
	}

	page {
		background: #F6F6F6;
	}

	.content {
		.upper {
			padding: 0 30rpx;
			padding-top: 40rpx;

			.btn {
				display: flex;
				justify-content: space-between;
				margin-top: 40rpx;

				view {
					font-weight: 500;
					font-size: 32rpx;
					color: #2D270D;
					width: 330rpx;
					line-height: 64rpx;
					text-align: center;
					border-radius: 8rpx;

					&:first-child {
						background-color: #FEFA05;
					}

					&:last-child {
						background-color: #EBECF0;
					}
				}
			}

			.info {
				display: flex;
				justify-content: space-between;

				.left {
					.unit {

						font-size: 24rpx;
						color: #929BA2;
					}

					.val {
						font-weight: bold;
						margin: 10rpx 0;
						color: #20242D;
						font-size: 52rpx;
					}

					.assets {
						display: flex;

						text {
							margin-right: 12rpx;
							font-weight: 500;
							font-size: 24rpx;
							color: #929BA2;
						}
					}
				}
			}
		}

		background-color: #fff;
		border-radius: 50rpx 50rpx 0px 0px;
		padding-bottom: 34rpx;
	}
</style>
