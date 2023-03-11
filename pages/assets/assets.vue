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
					<view class="right"
						@click="toNext('/pages/financialRecords/financialRecords?coinId='+assetsInfo.coinId)">
						<u-image width="48rpx" height="48rpx" src="@/static/icon25.png"></u-image>
					</view>
				</view>
				<view class="btn">
					<view @click="toNext('/pages/rechargeDetail/rechargeDetail')">{{$t('充值')}}</view>
					<view @click="toWithdraw('/pages/rechargeDetail/rechargeDetail?coin=USDT&scene=withdraw')">
						{{$t('提现')}}
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
					<u-checkbox-group v-model="checkboxGroup" @change="onCheckChange">
						<u-checkbox iconColor="#000" labelColor="#929BA2" labelSize="24rpx" activeColor="#FEFA05"
							shape="circle" key="0" :label="$t('hideAssets',{
								val:0
							})"></u-checkbox>
					</u-checkbox-group>
				</view>
				<view class="right" :style="{
					'width':open ? '70%':'200rpx'
				}">
					<u-search v-model="key" :color="theme == 'light' ? '' :'#fff'" @change="onSearchChange"
						:bgColor="theme == 'light' ? '#f2f2f2' : '#343A46'" :placeholder="$t('搜索')" :showAction="false">
					</u-search>
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
						<view>{{utils.decimal(item.amount,5)}}</view>
					</view>
					<view>
						<view>{{$t('冻结余额')}}</view>
						<view>{{utils.decimal(item.frozenAmount,5)}}</view>
					</view>
					<view>
						<view>{{$t('折合(USDT)')}}</view>
						<view>{{utils.decimal(item.convertUsdtAmount || 0,5)}}</view>
					</view>
				</view>
			</view>

			<u-loading-icon style="margin-top: 200rpx;" :show="loading" mode="circle"></u-loading-icon>

			<block v-if="list == '' && !loading">
				<u-gap height="300rpx"></u-gap>
				<u-empty :text="$t(isLogin ?'暂无数据' : '请先登录')"></u-empty>
				<u-gap height="500rpx"></u-gap>
			</block>
		</view>



		<u-popup :bgColor="inverseParams('#fff','#1F282F')" :show="visible" round="20rpx" mode="center">
			<view class="popup">
				<view class="popup-title">
					{{ $t('温馨提示') }}
				</view>
				<view class="popup-content">
					{{
		       $t(`您当前还未设置资金密码，请设置完成后再来进行提现。`)
		      }}
				</view>

				<view class="btn confirm" @click="toSet">{{ $t('去设置') }}</view>
				<view class="btn cancel" @click="visible = false">{{ $t('取消') }}</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		// queryAccountSum,
		queryAccountInfo,
		getOptionalMarket,
		// queryDepositPayCoin
	} from "@/config/api"
	export default {
		data() {
			return {
				visible: false,
				loading: true,
				open: false,
				showVal: true,
				key: '',
				checkboxGroup: [],
				assetsInfo: {
					convertCnySumAccount: "0",
					convertUsdtSumAccount: 0,
					coinId: ''
				},
				list: [],
				curCoin: [],
				isLogin: uni.getStorageSync('token')
			};
		},
		onShow() {
			if (!uni.getStorageSync('token')) {
				this.isLogin = false
				this.list = []
				this.curCoin = []
				this.loading = false
				return
			}
			this.isLogin = true
			this.loading = true
			queryAccountInfo({
				type: 1
			}).then(e => {
				if (e.coinAccountList == null) return
				this.assetsInfo = {
					convertCnySumAccount: e.sumAmount || 0,
					convertUsdtSumAccount: e.sumUsdtAmount || 0,
					coinId: e.coinId
				}
				this.oriList = e.coinAccountList
				this.list = this.checkboxGroup.indexOf('') == -1 ? e.coinAccountList : e.coinAccountList.filter(
					item => Number(item.amount) != 0)
				this.loading = false
			}).catch(() => {
				this.loading = false
			})
		},
		onLoad() {
			// queryAccountSum().then(e => this.assetsInfo = e)

			// queryDepositPayCoin().then(e => {
			// 	this.curCoin = e.filter(item => item.coinName == 'USDT')
			// })
		},
		methods: {
			toSet() {
				uni.$u.route('/pages/fundPassword/fundPassword')
				this.visible = false
			},
			toWithdraw(url) {
				if (uni.getStorageSync('token')) {
					const {
						fundsPasswordStatus
					} = uni.getStorageSync('userInfo')
					if (fundsPasswordStatus == 0) {
						this.visible = true
					} else {
						uni.navigateTo({
							url
						})
					}
				} else {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}
			},
			onCheckChange(e) {
				if (!uni.getStorageSync('token')) return
				if (e.indexOf('') == -1) {
					this.list = this.oriList
				} else {
					this.list = this.list.filter(item => Number(item.amount) != 0)
				}
			},

			onSearchChange(e) {
				if (e == '') this.open = false
				else this.open = true
				if (!uni.getStorageSync('token')) return
				if (e == '') {
					this.list = this.oriList || []
					this.checkboxGroup = []
				}
				this.list = this.utils.fuzzyQuery(this.oriList, e, 'coinName')
			},
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
	.popup {
		padding: 0 40rpx;
		width: 520rpx;

		.popup-title {
			font-weight: 500;
			color: #23212C;
			padding-top: 40rpx;
			font-size: 32rpx;
			text-align: center;
		}

		.popup-content {
			font-weight: 400;
			margin-top: 46rpx;
			color: #23212C;
			font-size: 26rpx;
			margin-bottom: 40rpx;
		}

		.btn {
			font-weight: 500;
			font-size: 32rpx;
			text-align: center;
			color: #FE9205;

			&.confirm {
				color: #2D270D;
				background: #FEFA05;
				line-height: 80rpx;

				border-radius: 8rpx;
			}

			&.cancel {
				padding-top: 24rpx;
				padding-bottom: 34rpx;
			}
		}
	}

	.list {
		background-color: #fff;
		padding: 30rpx;
		padding-bottom: 0;
		min-height: 1200rpx;

		.item {
			margin-top: 30rpx;
			border-bottom: 2rpx solid #EFEFEF;
			padding-bottom: 30rpx;

			&:last-child {
				border-bottom: none;
			}

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
				padding-left: 60rpx;

				>view {
					>view {
						&:first-child {

							color: #929BA2;
							font-size: 24rpx;
						}

						&:last-child {
							font-weight: 500;
							font-size: 28rpx;
							margin-top: 10rpx;
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
				transition: width .3s;
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
					line-height: 80rpx;
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

	@media (prefers-color-scheme: dark) {
		page {
			background: #171E28;
		}

		.content .upper .info .left .val,
		.list .title,
		.list .item .lab text,
		.list .item .box>view>view:last-child,
		.content .upper .btn view:last-child {

			color: #FFFFFF;
		}

		.content .upper .btn view:last-child {
			background-color: #343A46;
		}

		.list .item {
			border-bottom-color: #343B45
		}

		.content,
		.list {
			background-color: #1F282F;
		}

		.popup .popup-title,
		.popup .popup-content {
			color: #fff;
		}
	}
</style>
