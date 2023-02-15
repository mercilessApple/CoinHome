<template>
	<view>
		<u-navbar leftIcon="" placeholder :bgColor="theme == 'light'?' #ffffff':'#1F282F'">
			<view class="u-nav-slot" slot="center">
				<view class="search">
					<u-search @custom="search" @search="search" :actionStyle="{
						'width':'auto',
						'color':theme == 'light' ? '' : '#FEFA05'
					}" :actionText="$t('搜索')" v-model="key" height="64rpx" :bgColor="theme == 'light'? '#F6F6F6' : '#29313C'"
						placeholder="">
					</u-search>
				</view>
			</view>
		</u-navbar>
		<view class="lab" v-if="historyList != ''">
			<view class="tit">{{$t('历史记录')}}</view>
			<view class="item" v-for="(item,index) in historyList" :key="index" @click="$u.route({
				url:'/pages/rechargeDetail/rechargeDetail',
				params:{
					coin:item
				}
			})">{{item}}</view>
		</view>
		<view class="lab">
			<view class="tit">{{$t('热门')}}</view>
			<view class="item" @click="select(item)" v-for="(item,index) in hotCoins" :key="index">{{item}}</view>
		</view>
		<u-gap height="10rpx"></u-gap>
		<view class="lab">
			<view class="tit">{{$t('币种列表')}}</view>

			<view class="lab-list">
				<view class="column" v-for="(item,index) in coinList" :key="index" @click="select(item.coinName)">
					<u-image width="40rpx" height="40rpx" :src="item.iconUrl"></u-image>
					<view class="info">
						<view>{{item.coinName}}</view>
						<view>{{item.list != '' ? item.list[0].chainName : item.coinName}}</view>
					</view>
				</view>
			</view>

			<block v-if="coinList == ''">
				<u-gap height="300rpx"></u-gap>
				<u-empty :text="$t('暂无数据')"></u-empty>
				<u-gap height="300rpx"></u-gap>
			</block>
		</view>
	</view>
</template>

<script>
	import {
		queryHotCoins,
		queryDepositPayCoin
	} from "@/config/api"
	export default {
		data() {
			return {
				hotCoins: [],
				key: "",
				coinList: [],
				historyList: []
			};
		},
		onLoad() {
			queryHotCoins().then(e => this.hotCoins = e)

			queryDepositPayCoin().then(e => {
				console.log(e);
				this.coinList = e
				this.oriList = e
			})

			if (uni.getStorageSync('historyList')) this.historyList = uni.getStorageSync('historyList')
		},
		methods: {
			search(key) {
				if (key == '') {
					this.coinList = this.oriList
					return
				}
				let searchList = this.coinList.filter(item => item.coinName == key)
				this.coinList = searchList
			},
			noRepeat11(arr) {
				var newArr = [];
				var myset = new Set(arr); //利用了Set结构不能接收重复数据的特点
				for (var val of myset) {
					newArr.push(val)
				}
				return newArr;
			},
			select(coin) {
				let list = this.historyList
				list.push(coin)
				list = this.noRepeat11(list)
				uni.setStorageSync('historyList', list)
				this.historyList = list
				uni.navigateTo({
					url: '/pages/rechargeDetail/rechargeDetail?coin=' + coin
				})
			}
		},
	}
</script>

<style lang="scss">
	.lab {
		margin-top: 40rpx;
		padding-left: 30rpx;

		.tit {
			font-size: 30rpx;
			font-weight: 500;
			color: #242329;
			// padding-left: 30rpx;
		}

		.lab-list {
			.column {
				display: flex;
				padding: 20rpx 0;
				margin-top: 20rpx;

				.info {
					margin-left: 20rpx;

					view {
						&:first-child {
							font-weight: 500;
							color: #252525;
							font-size: 32rpx;
						}

						&:last-child {

							font-size: 24rpx;
							color: #8E8E90;
						}
					}
				}
			}
		}

		.item {
			display: inline-block;
			background: #FAFAFA;
			margin-right: 30rpx;
			margin-top: 40rpx;
			font-size: 28rpx;
			border-radius: 8rpx;
			padding: 18rpx;
			font-weight: 500;
			color: #8A8F95;
		}
	}

	::v-deep {
		.u-nav-slot {
			padding: 0 30rpx;
			width: 100%;
		}
	}

	@media (prefers-color-scheme: dark) {
		.lab .item {
			background: #29313C
		}

		.lab .tit,
		.lab .lab-list .column .info view:first-child{
			color: #fff;
		}
	}
</style>
