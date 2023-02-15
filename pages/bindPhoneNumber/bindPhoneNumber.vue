<template>
	<view class="container">
		<u-gap height="60rpx"></u-gap>
		<view class="item">
			<view class="lab">{{$t('个人电话号码')}}</view>
			<view class="input">
				<view class="icon" @click="$u.route('/pages/choosePhoneArea/choosePhoneArea')">
					<u-image src="@/static/icon3.png" width="48rpx" height="48rpx"></u-image>
					<text>{{phoneAreaCode}}</text>
					<u-icon color="#8B8F92" size="20rpx" name="arrow-down-fill"></u-icon>
				</view>
				<u-input :color="theme == 'light' ? '#303133' : '#ffffff'" @input="input" type="number" clearable
					border="none">
					<!-- <template slot="suffix">
						<text @click="getVerificationCode" v-if="time === 60"
							class="verificationCode">{{$t("获取验证码")}}</text>
						<text v-else class="verificationCode">{{$t("countDown",{
							time:time
						})}}</text>
					</template> -->
				</u-input>
			</view>
		</view>

		<!-- <view class="item" style="margin-top: 30rpx;">
			<view class="lab">{{$t('验证码')}}</view>
			<view class="input">
				<u-input v-model="code" clearable border="none">
				</u-input>
			</view>
		</view> -->
		<view class="btn" @click="submit" :class="{
			active:succ
		}">{{$t('提交')}}</view>
	</view>
</template>

<script>
	import {
		updatePhone,
		verificationCode
	} from "@/config/api"
	export default {
		data() {
			return {
				time: 60,
				code: '',
				phone: '',
				phoneAreaCode: '+86',
				succ: false
			};
		},
		onLoad() {
			this.timer = null
		},
		methods: {
			counDown() {
				const self = this
				self.time--
				if (self.time <= 0) {
					clearInterval(this.timer)
					self.time = 60
				}
			},
			getVerificationCode() {
				const self = this
				if (self.time < 60) return
				if (!this.$u.test.mobile(this.phone)) {
					uni.showToast({
						title: this.$t("个人电话号码不正确"),
						icon: "none"
					})
					return
				}
				uni.showLoading({
					title: this.$t("正在发送..."),
					mask: true
				});
				verificationCode({
					phone: self.phone,
					phoneOrEmail: 1,
					smsType: 4,
					phoneAreaCode: self.phoneAreaCode
				}).then(() => {
					uni.showToast({
						title: this.$t("发送成功"),
						icon: "success"
					});
					self.counDown()
					this.timer = setInterval(self.counDown, 1000)
				})
			},
			submit() {
				if (!this.succ) return
				uni.$u.route({
					url: '/pages/safeAuthentication/safeAuthentication',
					params: {
						phone: this.phone
					}
				})
				return
				uni.showLoading({
					title: this.$t("加载中..."),
					mask: true
				});
				updatePhone({
					phone: this.phone,
					phoneAreaCode: this.phoneAreaCode,
					phoneOrEmail: 1,
					code: ''
				})
			},
			input(e) {
				this.phone = e
				this.succ = this.$u.test.mobile(e)
			}
		},
	}
</script>

<style lang="scss">
	.verificationCode {
		color: #FE9205;
		font-size: 26rpx;
	}

	.container {
		padding: 0 30rpx;

		.btn {
			line-height: 90rpx;
			border-radius: 8rpx;
			font-weight: 500;
			font-size: 32rpx;
			text-align: center;
			margin-top: 100rpx;
			background: #EEF0F2;
			color: #787884;

			&.active {
				background: #FEFA05;

				color: #000000;
			}
		}

		.item {
			.input {
				padding: 0 20rpx;
				height: 90rpx;
				background: #F6F6F6;
				display: flex;
				align-items: center;
				border-radius: 8rpx;

				.icon {
					display: flex;
					align-items: center;
					padding-right: 20rpx;

					>text {
						font-weight: 500;
						margin: 0 10rpx;
						color: #060606;
						font-size: 28rpx;
					}
				}
			}

			.lab {
				margin-bottom: 18rpx;
				color: #8B8F92;
				font-size: 26rpx;
			}
		}
	}

	@media (prefers-color-scheme: dark) {
		.container .btn{
			background: #374048;
			color: #929BA2;
		}

		.input {
			background: #29313C !important;
		}

		.container .item .input .icon text {
			color: #fff
		}
	}
</style>
