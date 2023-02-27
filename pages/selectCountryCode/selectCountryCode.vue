<template>
	<view>
		<u-loading-icon mode="circle" style="margin-top: 200rpx;" :show="list == ''"></u-loading-icon>
		<view @click="choose(item)" class="item" v-for="(item,index) in list" :key="index">
			<u-image width="48rpx" height="48rpx" src="@/static/icon3.png"></u-image>
			<view class="lab">{{item.nationalityName}}</view>
			<view class="lab">{{item.phoneAreaCode}}</view>
		</view>
		<u-gap height="30rpx"></u-gap>
		<u-safe-bottom></u-safe-bottom>
	</view>
</template>

<script>
	import {
		queryCountryCode
	} from "@/config/api"
	export default {
		data() {
			return {
				list: []
			};
		},
		onLoad() {
			const pages = getCurrentPages(); //当前页
			const beforePage = pages[pages.length - 2]; //上个页面
			this.beforePage = beforePage
			if (uni.getStorageSync('countryCodeList')) {
				this.list = uni.getStorageSync('countryCodeList')
				return
			}
			queryCountryCode().then(e => {
				e.unshift({
					nationality: "CHN",
					nationalityName: this.$t('中国'),
					phoneAreaCode: "+86"
				})
				this.list = e
				uni.setStorageSync('countryCodeList', e)
			})
		},
		methods: {
			choose(item) {
				if (item.nationality == 'CHN') item.key = 0
				else item.key = 1
				
				item.name = item.nationalityName
				// #ifdef APP-PLUS
				this.beforePage.$vm.areaItem = item
				// #endif
				// #ifdef H5
				this.beforePage.areaItem = item
				// #endif
				uni.navigateBack()
			}
		},
	}
</script>

<style lang="scss">
	.item {
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		height: 80rpx;

		.lab {
			margin-left: 20rpx;
		}
	}
</style>
