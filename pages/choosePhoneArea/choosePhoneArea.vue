<template>
	<view>
		<u-sticky>
			<view class="sticky">
				<u-search :show-action="false" height="80rpx" :input-style="{
					'font-size':'24rpx'
				}" placeholder-color="#BBBBBD" v-model="keyword" placeholder="Search"></u-search>
			</view>
		</u-sticky>
		<view class="list">
			<block>
				<u-gap height="300rpx"></u-gap>
				<u-empty :text="$t('暂无数据')"></u-empty>
			</block>
			<!-- 		<view class="item" v-for="(item,index) in 100" @click="choose(item)">
				<view class="left">
					<u-image width="48rpx" height="48rpx"></u-image>
					<text>巴勒斯坦</text>
				</view>
				<view class="right">
					+ 970
				</view>
			</view> -->
		</view>
		<u-safe-bottom></u-safe-bottom>
	</view>
</template>

<script>
	import {
		querytheCountryCode
	} from "@/config/api"
	export default {
		data() {
			return {
				keyword: ""
			};
		},
		onLoad() {
			querytheCountryCode().then(res => {
				console.log(res)
			})
			const pages = getCurrentPages(); //当前页
			const beforePage = pages[pages.length - 2]; //上个页面
			this.beforePage = beforePage
		},
		methods: {
			choose(e) {
				// #ifdef APP-PLUS
				this.beforePage.$vm.phoneAreaCode = ""
				// #endif
				// #ifdef H5
				this.beforePage.phoneAreaCode = ""
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
			display: flex;
			height: 96rpx;

			&:first-child {
				margin-top: 0;
			}

			margin-top: 20rpx;
			padding: 0 30rpx;
			align-items: center;
			justify-content: space-between;

			.right {
				font-weight: 500;
				color: #9599A4;
				font-size: 28rpx;
			}

			.left {
				display: flex;
				align-items: center;

				text {
					font-weight: 500;
					margin-left: 10rpx;
					color: #23212C;
					font-size: 28rpx;
				}
			}
		}
	}
</style>
