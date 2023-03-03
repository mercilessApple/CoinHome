<template>
	<view>
		<u-sticky>
			<view class="sticky">
				<u-search @change="change" :color="theme == 'light' ? '' :'#fff'"
					:bgColor="theme == 'light' ? '#f2f2f2' :'#2C303C' " :show-action="false" height="80rpx"
					:input-style="{
					'font-size':'24rpx'
				}" placeholder-color="#BBBBBD" v-model="keyword" placeholder="Search"></u-search>
			</view>
		</u-sticky>
		<view class="list">
			<u-loading-icon mode="circle" style="margin-top: 200rpx;" :show="loading"></u-loading-icon>
			<view @click="choose(item)" class="item" v-for="(item,index) in list" :key="index">
				<u-image width="48rpx" height="48rpx" src="@/static/icon3.png"></u-image>
				<view class="lab">{{item.nationalityName}}</view>
				<view class="lab">{{item.phoneAreaCode}}</view>
			</view>
			<u-gap height="30rpx"></u-gap>
			<u-safe-bottom></u-safe-bottom>
		</view>
	</view>
</template>

<script>
	import {
		queryCountryCode
	} from "@/config/api"
	export default {
		data() {
			return {
				keyword: "",
				list: [],
				loading: true
			};
		},
		onLoad() {
			const pages = getCurrentPages(); //当前页
			const beforePage = pages[pages.length - 2]; //上个页面
			this.beforePage = beforePage
			if (uni.getStorageSync('countryCodeList')) {
				this.list = uni.getStorageSync('countryCodeList')
				this.oriList = this.list
				this.loading = false
				return
			}
			queryCountryCode().then(e => {
				e.unshift({
					nationality: "CHN",
					nationalityName: this.$t('中国'),
					phoneAreaCode: "+86"
				})
				this.list = e
				this.oriList = e
				this.loading = false
				uni.setStorageSync('countryCodeList', e)
			}).catch(() => this.loading = false)
		},
		methods: {
			change(e) {
				if (e == '') {
					this.list = this.oriList
					return
				}
				this.list = this.utils.fuzzyQuery(this.oriList, e, 'nationalityName')
			},
			choose(e) {
				// #ifdef APP-PLUS
				this.beforePage.$vm.phoneAreaCode = e.phoneAreaCode
				// #endif
				// #ifdef H5
				this.beforePage.phoneAreaCode = e.phoneAreaCode
				// #endif
				uni.navigateBack()
			}
		},
	}
</script>

<style lang="scss">
	.sticky {
		padding: 28rpx 30rpx;
		background-color: #fff;
	}

	.list {
		.item {
			padding: 0 30rpx;
			display: flex;
			align-items: center;
			height: 80rpx;

			.lab {
				margin-left: 20rpx;
			}
		}
	}

	@media (prefers-color-scheme: dark) {
		.sticky {
			background-color: #1F282F;
		}
	}
</style>
