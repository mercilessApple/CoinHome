<template>
	<view class="container">
		<view class="coin-box">
			<view class="left">
				<u-image width="48rpx" height="48rpx" :src="curCoin == '' ? '' :curCoin[0].iconUrl"></u-image>
				<text>{{curCoin == '' ? '' :curCoin[0].coinName}}</text>
			</view>
			<view class="right" @click="show = true">
				<u-image src="@/static/icon26.png" width="48rpx" height="48rpx"></u-image>
			</view>
		</view>
		<view class="card">
			<view class="upper">
				<view>
					<view class="lab">{{$t('总额')}}({{coinInfo.coinName}})</view>
					<view class="val" style="margin-top: 20rpx;">{{coinInfo.sumAmount}}</view>
					<view class="unit">
						≈ ¥{{coinInfo.sumCnhtAmount}}
					</view>
				</view>
				<view>
					<view class="lab">{{$t('可用')}}({{coinInfo.coinName}})</view>
					<view class="val">{{coinInfo.amount}}</view>
				</view>
				<view>
					<view class="lab">{{$t('冻结')}}({{coinInfo.coinName}})</view>
					<view class="val">{{coinInfo.frozenAmount}}</view>
				</view>
			</view>
			<view class="btn-box">
				<view @click="$u.route('/pages/recharge/recharge')">{{$t('充值')}}</view>
				<view @click="$u.route({
					url:'/pages/rechargeDetail/rechargeDetail',
					params:{
						coin:coinInfo.coinName,
						scene:'withdraw'
					}
				})">{{$t('提币')}}</view>
				<view>{{$t('交易')}}</view>
			</view>
		</view>
		<view class="content">
			<view class="list">
				<view class="title">{{$t('财务记录')}}</view>
				<view class="item" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
					<view class="left">
						<view>{{item.type == 1 ? $t('充值') : $t('提币')}}</view>
						<view>{{item.createTime}}</view>
					</view>
					<view class="right">
						{{item.amount}}
					</view>
				</view>
				<block v-if="list == ''">
					<u-gap height="300rpx"></u-gap>
					<u-empty :text="$t('暂无数据')"></u-empty>
				</block>
			</view>
			<u-popup @close="show = false" :show="show" round="20rpx" closeable
				:bgColor="theme == 'light' ? '#fff' : '#1F282F'">
				<view class="coin-popup">
					<view class="title">{{$t('选择币种')}}</view>
					<view class="search">
						<u-search :color="theme == 'light' ? '' :'#fff'" @search="search" :showAction="false"
							:placeholder="$t('请输入您要搜索的币种名称')" height="72rpx"
							:bgColor="theme == 'light' ? '#EBECF0' :'#2C303C' ">
						</u-search>
					</view>
					<view class="box">
						<view class="list">
							<view class="item" v-for="(item,index) in coinList" :key="index" @click="select(item)">
								<view class="left">
									<u-image width="48rpx" height="48rpx" :src="item.iconUrl"></u-image>
									<text>{{item.coinName}}</text>
								</view>
								<view class="right">
									<view>{{$t('可用余额')}}</view>
									<view>{{item.amount}}</view>
								</view>
							</view>
							<block v-if="coinList == ''">
								<u-gap height="100rpx"></u-gap>
								<u-empty :text="$t('暂无数据')"></u-empty>
							</block>
						</view>
					</view>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	import {
		queryDepositPayCoin,
		queryAccountTransfer
	} from "@/config/api"
	export default {
		data() {
			return {
				show: false,
				curCoin: [],
				coinList: [],
				list: [],
				coinInfo: {
					sumCnhtAmount: 0,
					sumAmount: 0,
					frozenAmount: 0,
					coinName: '',
					amount: 0
				}
			};
		},
		onLoad(options) {
			queryDepositPayCoin().then(e => {
				this.coinList = e
				this.oriList = e
				this.curCoin = e.filter(item => item.coinName == options.coin)
				this.chainList = this.curCoin[0].list
			})
			this.pageNum = 1
			this.coinId = Number(options.coinId)
			this.getList(e => {
				this.coinInfo = {
					sumCnhtAmount: e.sumCnhtAmount,
					sumAmount: e.sumAmount,
					amount: e.amount,
					frozenAmount: e.frozenAmount,
					coinName: e.coinName
				}
				this.list = e.pageList.records
			})
		},
		onReachBottom() {
			if (this.loaded) return
			this.pageNum++
			uni.showLoading({
				title: this.$t('加载中...'),
				mask: true
			})
			this.getList(e => {
				uni.hideLoading()
				if (e.pageList.records == '') {
					this.loaded = true
					return
				}
				this.list = this.list.concat(e.pageList.records)
			})
		},
		methods: {
			getList(fn) {
				queryAccountTransfer({
					coinId: this.coinId,
					pageSize: 10,
					pageNum: this.pageNum,
					accountType: 1
				}).then(e => {
					fn(e)
				})
			},
			search(key) {
				if (key == '') {
					this.coinList = this.oriList
					return
				}
				this.coinList = this.coinList.filter(item => item.coinName == key)
			},
			toDetail(item) {
				uni.setStorageSync('financialDetail', item)
				uni.$u.route('/pages/dealDetail/dealDetail')
			},
			select(item) {
				this.curCoin = [item]
				this.chainList = item.list
				this.show = false
				this.pageNum = 1
				this.loaded = false
				this.coinId = item.coinId
				this.getList(e => {
					this.list = e.pageList.records
				})
			}
		},
	}
</script>

<style lang="scss">
	page {
		background-color: #F6F6F6;
	}

	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		/* #ifdef H5 */
		height: calc(100vh - 44px);
		/* #endif */
	}

	.card {
		border-radius: 40rpx 40rpx 0px 0px;
		background: #FFFFFF;
		padding: 0 30rpx;
		margin-bottom: 10rpx;
		padding-top: 40rpx;

		.btn-box {
			display: flex;
			justify-content: space-between;
			padding-bottom: 34rpx;

			view {
				width: 200rpx;
				text-align: center;
				border-radius: 8rpx;
				line-height: 64rpx;
				font-weight: 500;
				font-size: 32rpx;
				color: #2D270D;

				&:first-child {
					background-color: #FEFA05;
				}

				&:nth-child(2) {
					background-color: #D4D6DF;
				}

				&:last-child {
					background-color: #EBECF0;
				}
			}
		}

		.upper {
			display: flex;
			justify-content: space-between;
			padding-bottom: 40rpx;

			.unit {

				color: #929BA2;
				font-size: 24rpx;
				margin-top: 20rpx;
			}

			.val {
				font-weight: bold;
				margin-top: 10rpx;
				color: #20242D;
				font-size: 36rpx;
			}

			.lab {
				font-weight: 500;
				color: #929BA2;
				font-size: 24rpx;
			}
		}
	}

	.content {
		flex: 1;

		.list {
			.title {
				font-weight: 500;
				color: #1F232C;
				font-size: 32rpx;
				padding: 40rpx 30rpx;
				border-bottom: 2rpx solid #EFEFEF;
			}

			.item {
				padding: 30rpx;
				display: flex;
				justify-content: space-between;

				.right {
					font-weight: 500;
					color: #1F232C;
					font-size: 32rpx;
				}

				.left {
					view {
						&:first-child {
							font-weight: 500;
							color: #1F232C;
							font-size: 28rpx;
						}

						&:last-child {
							margin-top: 20rpx;
							color: #929BA2;
							font-size: 28rpx;
						}
					}
				}
			}
		}

		background: #FFFFFF;
	}

	.coin-popup {
		.warning {
			padding: 0 30rpx;
		}

		.box {
			height: 700rpx;
			overflow: auto;
		}

		.list {
			padding: 0 30rpx;

			.item {
				padding: 0 30rpx;
				margin-top: 20rpx;
				height: 136rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.right {
					view {
						&:last-child {
							font-weight: 500;
							color: #1F1E23;
							font-size: 32rpx;
							margin-top: 20rpx;
							text-align: right;
						}

						&:first-child {
							font-weight: 500;
							color: #929BA2;

							font-size: 24rpx;
						}
					}
				}

				.left {
					display: flex;
					align-items: center;

					text {
						font-size: 32rpx;
						margin-left: 20rpx;
						font-weight: 500;
						color: #1F1E23;
					}
				}
			}
		}

		.search {
			padding: 0 30rpx;
			padding-bottom: 20rpx;
		}

		.title {
			font-weight: 500;
			color: #1F1E23;
			font-size: 30rpx;
			text-align: center;
			line-height: 114rpx;

		}
	}

	.coin-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		margin: 0 30rpx;

		height: 96rpx;

		.left {
			display: flex;
			align-items: center;

			text {
				margin-left: 20rpx;
				font-weight: 500;
				color: #23282E;
				font-size: 40rpx;
			}
		}
	}


	@media (prefers-color-scheme: dark) {
		page {
			background-color: #171E28;
		}

		.content .list .title {
			color: #fff;
			border-bottom-color: #343B45;
		}

		.card .btn-box view:nth-child(2),
		.card .btn-box view:last-child {

			color: #FFFFFF;
			background-color: #343A46
		}

		.card,
		.content {

			background: #1F282F;
		}

		.coin-box .left text,
		.coin-popup .title,
		.coin-popup .list .item .left text,
		.coin-popup .list .item .right view:last-child,
		.content .list .item .left view:first-child,
		.content .list .item .right,.card .upper .val{
			color: #fff;
		}

		.coin-popup .list .item {

			background: #343A46;
			border-radius: 8rpx;
		}
	}
</style>
