<template>
	<view class="container">
		<u-gap height="30rpx"></u-gap>
		<view class="item" v-if="scene == 'phone'">
			<!-- <view class="lab">{{$t('将发送验证码到您的130****2217')}}</view> -->
			<view class="lab">{{$t('sendCodeText',{
				codeText:phoneText
			})}}</view>
			<view class="input">
				<u-input :color="theme == 'light' ? '#303133' : '#ffffff'" v-model="phoneCode" clearable border="none">
					<template slot="suffix">
						<text @click="getVerificationCode('phone')" v-if="time === 60"
							class="verificationCode">{{$t("获取验证码")}}</text>
						<text v-else class="verificationCode">{{$t("countDown",{
							time:time
						})}}</text>
					</template>
				</u-input>
			</view>
		</view>

		<view class="item" v-if="scene == 'email'" style="margin-bottom: 30rpx;">
			<!-- <view class="lab">{{$t('将发送验证码到您的7568****@qq.com')}}</view> -->
			<view class="lab">{{$t('个人电子邮箱')}}</view>
			<view class="input">
				<u-input :color="theme == 'light' ? '#303133' : '#ffffff'" v-model="email" clearable border="none">

				</u-input>
			</view>
		</view>
		
		<view class="item" v-if="scene == 'email'">
			<!-- <view class="lab">{{$t('将发送验证码到您的7568****@qq.com')}}</view> -->
			<view class="lab">{{$t('将发送验证码到您的个人电子邮箱')}}</view>
			<view class="input">
				<u-input :color="theme == 'light' ? '#303133' : '#ffffff'" v-model="emailCode" clearable border="none">
					<template slot="suffix">
						<text @click="getVerificationCode('email')" v-if="time === 60"
							class="verificationCode">{{$t("获取验证码")}}</text>
						<text v-else class="verificationCode">{{$t("countDown",{
							time:time
						})}}</text>
					</template>
				</u-input>
			</view>
		</view>
		<view class="btn" @click="submit" :class="{
			active:emailCode != '' || phoneCode != ''
		}">{{$t('确认')}}</view>
	</view>
</template>

<script>
	import {
		phoneOrEmailCode,
		updatePhone
	} from "@/config/api"
	export default {
		data() {
			return {
				emailCode: '',
				phoneCode: '',
				time: 60,
				phoneText: '',
				scene: '',
				email: ''
			};
		},
		onLoad(options) {
			this.timer = null
			if (options.phone) {
				this.phone = options.phone
				this.phoneText = this.geTel(options.phone)
				this.scene = 'phone'
			} else {
				this.scene = 'email'
			}
			if (options.phoneAreaCode) this.phoneAreaCode = decodeURIComponent(options.phoneAreaCode)
		},
		methods: {
			// geTel(tel) {
			// 	return tel.substring(0, 3) + "****" + tel.substr(tel.length - 4);
			// },
			// regEmail(email) {
			// 	if (String(email).indexOf('@') > 0) {
			// 		let str = email.split('@'),
			// 			_s = ''
			// 		if (str[0].length > 3) {
			// 			for (let i = 0; i < str[0].length - 6; i++) {
			// 				_s += '*'
			// 			}
			// 		}
			// 		var new_email = str[0].substr(0, 3) + _s + '@' + str[1]
			// 	}
			// 	return new_email
			// },
			counDown() {
				const self = this
				self.time--
				if (self.time <= 0) {
					clearInterval(this.timer)
					self.time = 60
				}
			},
			getVerificationCode(scene) {
				const self = this
				if (self.time < 60) return
				uni.showLoading({
					mask: true
				})
				phoneOrEmailCode({
					phoneOrEmail: this.scene == 'phone' ? this.phone : this.email,
					phoneAreaCode: this.scene == 'phone' ? this.phoneAreaCode : null,
					smsType: 4,
					type: this.scene == 'phone' ? 2 : 1
				}).then(e => {
					uni.showToast({
						title: this.$t('发送成功')
					})
					this.counDown()
					this.timer = setInterval(this.counDown, 1000)
				})
			},
			submit() {
				uni.showLoading({
					mask: true
				})
				updatePhone({
					"phoneOrEmail": this.scene == 'phone' ? 1 : 2,
					"phoneAreaCode": this.scene == 'phone' ? this.phoneAreaCode : null,
					"code": this.scene == 'phone' ? this.phoneCode : this.emailCode,
					"phone": this.scene == 'phone' ? this.phone : null,
					"email": this.scene == 'phone' ? null : this.email
				}).then(() => {
					uni.showToast({
						icon: 'success'
					})
					setTimeout(() => {
						uni.navigateBack({
							delta: this.scene == 'phone' ? 2 : 1
						})
					}, 1500)

				})

			}
		},
	}
</script>

<style lang="scss">
	.verificationCode {
		color: #FE9205;
		font-size: 26rpx;
		margin-left: 15rpx;
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
			}

			.lab {
				margin-bottom: 18rpx;
				color: #8B8F92;
				font-size: 26rpx;
			}
		}
	}

	@media (prefers-color-scheme: dark) {
		.container .btn {
			background: #374048;
			color: #929BA2;
		}

		.input {
			background: #29313C !important;
		}
	}
</style>
