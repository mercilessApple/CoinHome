<template>
	<view>
		<u-gap height="80rpx"></u-gap>
		<view class="pic">
			<u-avatar :default-url="require('@/static/icon46.png')" size="140rpx"></u-avatar>
		</view>
		<view class="name">
			<text>{{userInfo.nickName}}</text>
			<u-image @click="show = true" width="40rpx" src="@/static/icon24.png" height="40rpx"></u-image>
		</view>
		<view class="nav">
			<view class="item" style="padding-right: 30rpx;">
				<view class="left">UID</view>
				<view class="right" @click="copy">
					<text>{{userInfo.uid}}</text>
					<u-image src="@/static/icon16.png" width="28rpx" height="28rpx">
					</u-image>
				</view>
			</view>
			<view class="item">
				<view class="left">{{$t('手机号码')}}</view>
				<view class="right" @click="$u.route('/pages/bindPhoneNumber/bindPhoneNumber')">
					<text>{{userInfo.phone || $t('未绑定')}}</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
			<view class="item">
				<view class="left">{{$t('邮箱')}}</view>
				<view class="right">
					<text>{{userInfo.email}}</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
		</view>
		<u-popup :safeAreaInsetBottom="false" round="20rpx" mode="center" :show="show"
			:bgColor="theme == 'light' ? '#fff' : '#1F282F'">
			<view class="popup">
				<view class="title">{{$t('编辑昵称')}}</view>
				<view class="tip">{{$t('为您的个人资料设置自定义昵称。')}}</view>
				<view class="lab">{{$t('昵称')}}</view>
				<view class="input">
					<u-input :color="theme == 'light' ? '#303133' : '#ffffff'" v-model="nickName" fontSize="32rpx"
						border="none"></u-input>
				</view>
				<view class="btn">
					<view @click="show = false">{{$t('取消')}}</view>
					<view @click="save">{{$t('保存')}}</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		updateNickName,
		userInfo
	} from "@/config/api"
	export default {
		data() {
			return {
				show: false,
				nickName: "",
				userInfo: ""
			};
		},
		onShow() {
			this.userInfo = uni.getStorageSync('userInfo')
			console.log(this.userInfo);
			this.nickName = this.userInfo.nickName
		},
		methods: {
			save() {
				uni.showLoading({
					title: this.$t('加载中...'),
					mask: true
				})
				updateNickName({
					nickName: this.nickName
				}).then(() => {
					uni.showToast({
						title: this.$t('操作成功！')
					})
					this.show = false
					userInfo().then(e => {
						this.userInfo = e
						uni.setStorageSync('userInfo', e)
					})
				})
			},
			copy() {
				uni.setClipboardData({
					data: String(this.userInfo.uid)
				})
			}
		},
	}
</script>

<style lang="scss">
	.popup {
		padding: 0 30rpx;
		width: 630rpx;
		padding-bottom: 60rpx;

		.btn {
			margin-top: 100rpx;
			display: flex;
			justify-content: space-between;

			view {
				width: 260rpx;
				text-align: center;
				line-height: 64rpx;
				font-weight: 500;
				color: #2D270D;
				font-size: 32rpx;
				border-radius: 8rpx;

				&:first-child {

					background: #EBECF0;
				}

				&:last-child {}

				background: #FEFA05;
			}
		}

		.lab {
			margin-bottom: 16rpx;
			margin-top: 60rpx;
			color: #8B8F92;
			font-size: 26rpx;
		}

		.input {
			height: 90rpx;
			border-radius: 8rpx;
			padding: 0 30rpx;
			background: #F6F6F6;
			display: flex;
			align-items: center;
		}

		.tip {
			text-align: center;
			padding: 0 30rpx;
			font-weight: 500;
			color: #9599A4;
			font-size: 28rpx;
		}

		.title {
			font-weight: 500;
			padding: 40rpx;
			text-align: center;
			color: #23212C;
			font-size: 40rpx;
		}
	}

	.nav {
		margin-top: 80rpx;

		.item {
			height: 96rpx;
			padding: 0 30rpx;
			/* #ifdef APP-PLUS */
			padding-right: 0;
			/* #endif */
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-top: 20rpx;

			.right {
				display: flex;
				align-items: center;

				text {
					margin-right: 20rpx;
					color: #9599A4;
					font-size: 28rpx;
				}
			}

			.left {
				font-weight: 500;
				color: #23212C;
			}
		}
	}

	.name {
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 500;
		color: #23282E;
		font-size: 38rpx;
		margin-top: 30rpx;

		text {
			margin-right: 10rpx;
		}
	}

	.pic {
		display: flex;
		justify-content: center;
	}

	@media (prefers-color-scheme: dark) {

		.nav .item .left,
		.popup .title,
		.name {
			color: #fff;
		}

		.popup .input {
			background: #29313C;
		}

		.popup .btn view:first-child {
			background: #4A525D;
			
color: #FFFFFF;
		}
	}
</style>
