<template>
	<view>
		<view class="tip">
			*{{$t('密码至少8位且必有数字+特殊字符+字母')}}
		</view>
		<view class="item">
			<view class="lab">{{$t('新密码')}}</view>
			<view class="input">
				<u-input :color="theme == 'light' ? '#303133' : '#ffffff'" password v-model="password" clearable
					border="none">
				</u-input>
			</view>
		</view>
		<view class="item" style="margin-top: 40rpx;">
			<view class="lab">{{$t('确认密码')}}</view>
			<view class="input">
				<u-input :color="theme == 'light' ? '#303133' : '#ffffff'" password v-model="againPassword" clearable
					border="none">
				</u-input>
			</view>
		</view>


		<view class="btn" @click="submit" :class="{
			active:password != '' && againPassword != ''
		}">{{$t('确认')}}</view>
	</view>
</template>

<script>
	import {
		editUserPassword
	} from "@/config/api"

	import {
		hex_md5
	} from "@/utils/md5.js"
	export default {
		data() {
			return {
				againPassword: '',
				password: ''
			};
		},
		onLoad(options) {
			this.code = options.code
		},
		methods: {
			submit() {
				if (!this.utils.pwdREG.test(this.password)) {
					uni.showToast({
						title: this.$t("密码至少8位且必有数字+特殊字符+字母"),
						icon: "none"
					})
					return
				}

				if (this.againPassword != this.password) {
					uni.showToast({
						title: this.$t('输入的密码不一致，请重新输入'),
						icon: 'none'
					})
					return
				}

				const md5Pwd = hex_md5(this.password).toUpperCase(),
					md5AgainPwd = hex_md5(this.againPassword).toUpperCase()
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				editUserPassword({
					newPassword: md5Pwd,
					newPasswordAgain: md5AgainPwd,
					code: this.code,
					phoneOrEmail: 2
				}).then(e => {
					uni.showToast({
						title: this.$t('操作成功！')
					})

					setTimeout(() => {
						uni.navigateBack({
							delta: 2
						})
					}, 1500)
				})
			},
		},
	}
</script>

<style lang="scss">
	.tip {
		background: #F6F6F6;
		padding: 40rpx 30rpx;
		color: #F5475E;
		margin-bottom: 80rpx;
		font-size: 28rpx;
	}

	.btn {
		line-height: 90rpx;
		margin: 0 30rpx;
		border-radius: 8rpx;
		font-weight: 500;
		font-size: 32rpx;
		text-align: center;
		margin-top: 140rpx;
		background: #EEF0F2;
		color: #787884;

		&.active {
			background: #FEFA05;

			color: #000000;
		}
	}

	.item {
		padding: 0 30rpx;

		.input {
			padding: 0 20rpx;
			height: 90rpx;
			background: #F6F6F6;
			display: flex;
			align-items: center;
			border-radius: 8rpx;
		}

		.lab {
			margin-bottom: 18rpx;
			color: #8B8F92;
			font-size: 26rpx;
		}
	}

	@media (prefers-color-scheme: dark) {
		.tip {
			background: #171E28;
		}

		.item .input {

			background: #29313C;
		}

		.btn {

			background: #374048;

			color: #929BA2;
		}
	}
</style>
