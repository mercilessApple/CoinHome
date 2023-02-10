<template>
	<view>
		<view class="tip-title">
			{{$t('新设置密码')}}
		</view>

		<view class="form">
			<u--form ref="uForm">
				<u-form-item :label="labelString">
					<view class="input-box">
						<u-input v-model="verificationCode" border="none">
							<template slot="suffix">
								<text @click="getVerificationCode" v-if="time === 60"
									class="verificationCode">{{$t("获取验证码")}}</text>
								<text v-else class="verificationCode">{{$t("countDown",{
									time:time
								})}}</text>
							</template>
						</u-input>
					</view>
				</u-form-item>
				<view class="tip">
					{{
						$t('verificationText',{
							accountType:accountType === -1 ? $t('手机号码') :$t('邮箱'),
							account:encryptionAccount
						})
					}}
				</view>
				<u-form-item :label="$t('密码')">
					<view class="input-box pwd">
						<input class="input" :type="isShowPwd ? 'text':'password'" v-model="newPassword" />
						<u-image @click="isShowPwd = !isShowPwd" :src="require(`@/static/icon${isShowPwd ? 1 : 2}.png`)"
							width="48rpx" height="48rpx"></u-image>
					</view>
				</u-form-item>
				<view class="tip">
					{{$t("密码仅支持6-20个字母、数字、下划线")}}
				</view>
				<u-form-item :label="$t('确认密码')">
					<view class="input-box pwd">
						<input class="input" :type="isShowPwd1 ? 'text':'password'" v-model="newPasswordAgain" />
						<u-image @click="isShowPwd1 = !isShowPwd1"
							:src="require(`@/static/icon${isShowPwd ? 1 : 2}.png`)" width="48rpx" height="48rpx">
						</u-image>
					</view>
				</u-form-item>
				<view class="tip">
					{{$t("密码仅支持6-20个字母、数字、下划线")}}
				</view>
			</u--form>
		</view>


		<view class="next" @click="next">
			{{$t('下一步')}}
		</view>
	</view>
</template>

<script lang="ts">
	import {
		findPwdVerificationCode,
		updateLoginPassword
	} from "@/config/api"
	import {
		MD5
	} from '@/utils/md5';
	let self: any, timer: any = null
	export default {
		data(): any {
			return {
				verificationCode: "",
				account: "",
				accountType: null,
				time: 60,
				isShowPwd1: false,
				isShowPwd: false,
				encryptionAccount: "",
				newPassword: "",
				newPasswordAgain: ""
			};
		},
		onUnload() {
			self.time = 60;
			clearInterval(timer);
		},
		computed: {
			labelString() {
				if ((this as any).accountType === -1) return `${(this as any).$t("手机号码")}${(this as any).$t('验证码')}`
				else return `${(this as any).$t("邮箱")}${(this as any).$t('验证码')}`
			}
		},
		onLoad(options: any) {
			self = this;
			(this as any).account = options.phoneOrEmail;
			(this as any).accountType = options.phoneOrEmail.indexOf('@');
			if (self.accountType === -1) self.encryptionAccount = self.geTel(options.phoneOrEmail)
			else self.encryptionAccount = self.regEmail(options.phoneOrEmail)
		},
		methods: {
			next() {
				if (self.verificationCode === '') {
					(uni as any).showToast({
						title: self.$t('verificationText', {
							accountType: self.accountType === -1 ? self.$t('手机号码') : self.$t('邮箱'),
							account: self.encryptionAccount
						}),
						icon: 'none'
					})
					return
				}

				if (!/^(\w){6,20}$/.test(self.newPassword)) {
					(uni as any).showToast({
						title: self.$t('密码仅支持6-20个字母、数字、下划线'),
						icon: "none"
					});
					return
				}
				if (self.newPasswordAgain !== self.newPassword) {
					(uni as any).showToast({
						title: self.$t('输入的密码不一致，请重新输入'),
						icon: "none"
					});
					return
				}
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				updateLoginPassword({
					newMd5LoginPassword: MD5.instance.hex_md5(self.newPassword).toUpperCase(),
					confirmMd5LoginPassword: MD5.instance.hex_md5(self.newPasswordAgain).toUpperCase(),
					type: 2,
					phoneOrEmailStr: self.account
				}).then((e: any) => {
					console.log(e)
					uni.showToast({
						title: self.$t("操作成功！"),
						icon: "success"
					})
					setTimeout(() => {
						(uni as any).navigateBack({
							delta: 2
						})
					}, 1500)
				})
			},
			geTel(tel: string) {
				return tel.substring(0, 3) + "****" + tel.substr(tel.length - 4);
			},
			regEmail(email: string) {
				if (String(email).indexOf('@') > 0) {
					let str = email.split('@'),
						_s = ''
					if (str[0].length > 3) {
						for (let i = 0; i < str[0].length - 3; i++) {
							_s += '*'
						}
					}
					var new_email = str[0].substr(0, 3) + _s + '@' + str[1]
				}
				return new_email
			},
			counDown() {
				self.time--
				if (self.time <= 0) {
					clearInterval(timer)
					self.time = 60
				}
			},
			getVerificationCode() {
				if (self.time < 60) return

				(uni as any).showLoading({
					title: this.$t("正在发送..."),
					mask: true
				});
				findPwdVerificationCode({
					smsType: 2,
					phoneOrEmailStr: self.account,

				}).then((e) => {
					(uni as any).showToast({
						title: self.$t("发送成功"),
						icon: "success"
					});
					self.counDown()
					timer = setInterval(self.counDown, 1000)
				})
			},
		},
	}
</script>

<style lang="scss">
	.next {
		font-weight: 500;
		color: #2D270D;
		font-size: 32rpx;
		margin-top: 80rpx;
		line-height: 90rpx;
		border-radius: 8rpx;
		background-color: #FEFA05;
		text-align: center;
	}

	page {
		padding: 0 50rpx;
		padding-top: 80rpx;

		::v-deep {

			.u-form-item__body__left {
				width: auto !important;
			}

			.u-form-item__body__left__content__label {
				color: #8B8F92;
				font-size: 26rpx;
			}

			.u-form-item__body {
				padding-top: 0;
				padding-bottom: 0;
				margin-top: 50rpx;
				flex-direction: column !important
			}
		}
	}

	.form {
		padding-top: 10rpx;

		.input-box {
			margin-top: 16rpx;
			height: 90rpx;
			background: #F6F6F6;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			width: 100%;
			padding: 0 20rpx;

			&.pwd {
				display: flex;

				.input {
					outline: none;
					flex: 1;
					font-size: 15px;
					background-color: transparent;
					border: none;
				}
			}

			.verificationCode {
				color: #FE9205;
				font-size: 26rpx;
			}
		}
	}

	.tip-title {
		font-weight: bold;
		color: #2B323C;
		font-size: 52rpx;
	}

	.tip {

		color: #8B8F92;
		font-size: 28rpx;
		margin-top: 10rpx;
	}
</style>
