<template>
	<view class="container">
		<u-gap height="60rpx"></u-gap>
		<view class="item">
			<!-- <view class="lab">{{$t('将发送验证码到您的130****2217')}}</view> -->
			<view class="lab">{{$t('sendCodeText',{
				codeText:phoneText
			})}}</view>
			<view class="input">
				<u-input v-model="phoneCode" clearable border="none">
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

		<view class="item" style="margin-top: 60rpx;">
			<!-- <view class="lab">{{$t('将发送验证码到您的7568****@qq.com')}}</view> -->
			<view class="lab">{{$t('sendCodeText',{
				codeText:emailText
			})}}</view>
			<view class="input">
				<u-input v-model="emailCode" clearable border="none">
					<template slot="suffix">
						<text @click="getVerificationCode('email')" v-if="time1 === 60"
							class="verificationCode">{{$t("获取验证码")}}</text>
						<text v-else class="verificationCode">{{$t("countDown",{
							time:time1
						})}}</text>
					</template>
				</u-input>
			</view>
		</view>
		<view class="btn" @click="submit" :class="{
			active:emailCode != '' && phoneCode != ''
		}">{{$t('确认')}}</view>
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
				emailCode: '',
				phoneCode: '',
				time: 60,
				time1: 60,
				emailText: '',
				phoneText: ''
			};
		},
		onLoad(options) {
			this.timer = null
			this.timer1 = null
			this.emailText = this.regEmail(uni.getStorageSync('userInfo').email)
			this.phoneText = this.geTel(options.phone)
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
				if(scene == 'phone'){
					if (self.time < 60) return
					
				}else{
					if (self.time1 < 60) return
				}
				
			},
			submit() {

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
</style>
