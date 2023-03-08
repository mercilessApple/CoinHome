<template>
	<view>
		<view class="tip">
			{{$t('passwordTitle',{
				type:$t('loginPassword')
			})}}
		</view>
		<view class="item">
			<view class="lab">{{$t('验证码')}}</view>
			<view class="input">
				<u-input :color="theme == 'light' ? '#303133' : '#ffffff'" v-model="code" clearable border="none">
					<template slot="suffix">
						<text @click="getVerificationCode" v-if="time === 60"
							class="verificationCode">{{$t("获取验证码")}}</text>
						<text v-else class="verificationCode">{{$t("countDown",{
							time:time
						})}}</text>
					</template>
				</u-input>
			</view>
		</view>
		<view class="email">{{$t('sendCodeText',{
			codeText:userInfo.email ? regEmail(userInfo.email) : geTel(userInfo.phone)
		})}}</view>

		<view class="btn" @click="submit" :class="{
			active:code != ''
		}">{{$t('确认')}}</view>
	</view>
</template>

<script>
	import {
		sendVerificationCode,
		checkVerificationCode
	} from "@/config/api"
	import {
		setInterval
	} from "timers";
	export default {
		data() {
			return {
				code: '',
				time: 60,
				userInfo: uni.getStorageSync('userInfo')
			};
		},
		onLoad() {
			this.timer = null
		},
		onHide() {
			// if (this.time < 60) clearInterval(this.timer)
		},
		onUnload() {
			if (this.time < 60) clearInterval(this.timer)
		},
		methods: {
			submit() {
				if (!this.code) return
				uni.showLoading({
					title: this.$t('加载中...'),
					mask: true
				})
				checkVerificationCode({
					phoneOrEmailStr:this.userInfo.email ? this.userInfo.email : this.userInfo.phone,
					code: this.code,
					smsType: 2
				}).then(() => {
					uni.$u.route({
						url: '/pages/modifyPassword/modifyPassword',
						params: {
							code: this.code
						}
					})
				})
			},
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
				uni.showLoading({
					title: this.$t('正在发送...'),
					mask: true
				})
				sendVerificationCode({
					phoneOrEmailStr:this.userInfo.email ? this.userInfo.email : this.userInfo.phone,
					smsType: 2
				}).then(e => {
					uni.showToast({
						title: this.$t('发送成功')
					})
					this.counDown()
					this.timer = setInterval(this.counDown, 1000)
				})
			},
		},
	}
</script>

<style lang="scss">
	.verificationCode {
		color: #FE9205;
		font-size: 26rpx;
		margin-left: 15rpx;
	}

	.email {
		padding: 0 30rpx;
		margin-top: 20rpx;
		color: #070707;
		font-size: 24rpx;
	}

	.tip {
		background: #F6F6F6;
		padding: 40rpx 30rpx;
		color: #F5475E;
		margin-bottom: 60rpx;
		font-size: 28rpx;
	}

	.btn {
		line-height: 90rpx;
		margin: 0 30rpx;
		border-radius: 8rpx;
		font-weight: 500;
		font-size: 32rpx;
		text-align: center;
		margin-top: 400rpx;
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

		.email {
			color: #fff;
		}

		.btn {

			background: #374048;

			color: #929BA2;
		}

		.item .input {

			background: #29313C;
		}
	}
</style>
