<template>
	<view>
		<!-- <u-navbar autoBack placeholder></u-navbar> -->
		<view class="title">{{$t('通知')}}</view>

		<!-- <u-tabs :current="current" :inactiveStyle="{
			color:'#8A8B9B'
		}" :activeStyle="{
			color:'#23282E'
		}" lineColor="#FEFA05" :list="tabs" @click="onTabsChange"></u-tabs>
 -->
		<block v-if="list == ''">
			<u-gap height="300rpx"></u-gap>
			<u-empty :show="list == '' && !loading" mode="news" :text="$t('暂无数据')"></u-empty>
			<u-loading-icon mode="circle" v-if="loading"></u-loading-icon>
		</block>
		<view class="list">
			<view class="item" v-for="(item,index) in list" :key="item.id" @click="modalData = item,show = true">
				<view class="left">
					<u-image v-if="current === 1" :src="theme == 'light' ? require('@/static/icon13.png') : require('@/static/icon43.png')" width="60rpx" height="60rpx"></u-image>
					<u-image v-if="current === 0" :src="theme == 'light' ? require('@/static/icon13.png') : require('@/static/icon43.png')" width="60rpx" height="60rpx"></u-image>
				</view>
				<view class="right">
					<view class="tip">{{item.title}}</view>
					<view class="desc u-line-2">{{item.content}}</view>
					<view class="time">{{item.createTime}}</view>
				</view>
			</view>
		</view>
		<u-modal @confirm="show = false" confirmColor="#FEFA05" :confirmText="$t('确认')" :show="show"
			:title="modalData.title" :content='modalData.content'></u-modal>
	</view>
</template>

<script>
	import {
		announcements
	} from "@/config/api"
	export default {
		data() {
			return {
				current: 0,
				show: false,
				loading: true,
				modalData: {
					title: "",
					content: ""
				},
				list: [],
				tabs: [{
						name: this.$t('系统通知')
					},
					{
						name: this.$t('公告')
					}
				]
			};
		},
		onLoad(options) {
			if (options.type) this.current = Number(options.type)
			this.page = 1
			this.getList()
		},
		methods: {
			onTabsChange({
				index
			}) {
				this.current = index
				this.page = 1
				this.list = []
				this.getList()
			},
			async getList() {
				let res;
				// if (this.current === 1) res = await announcements({
				// 	pageNum: this.page,
				// 	pageSize: 10,
				// 	type: 0
				// })
				// else res = []
				try {
					res = await announcements({
						pageNum: this.page,
						pageSize: 10,
						type: 0
					})
					this.loading = false
					this.list = this.list.concat(res)
				} catch (err) {
					this.loading = false
				}
			}
		},
	}
</script>

<style lang="scss">
	.list {
		.item {
			display: flex;
			padding: 0 20rpx;
			margin-top: 70rpx;

			.left {
				margin-right: 20rpx;
			}

			.right {
				.tip {
					font-weight: 500;
					color: #1F272A;
					font-size: 32rpx;
				}

				.desc {
					font-weight: 500;
					font-size: 24rpx;
					margin: 20rpx 0;
					line-height: 40rpx;
					color: #8F8F91;
				}

				.time {
					color: #B9B8BE;
					font-size: 22rpx;
				}
			}
		}
	}

	.title {
		font-weight: bold;
		color: #23282E;
		font-size: 56rpx;
		padding: 40rpx 30rpx;
		padding-bottom: 0;
	}

	::v-deep {
		.u-tabs__wrapper__nav__item__text {
			font-size: 32rpx;
		}
	}
	
	@media (prefers-color-scheme: dark) {
		.list{
			.tip{
				color: #FFFFFF !important;
			}
		}
		.title{
			color: #fff;
		}
	}
</style>
