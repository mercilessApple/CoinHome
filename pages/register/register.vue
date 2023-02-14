<template>
	<view>
		<u-status-bar></u-status-bar>
		<u-gap height="44"></u-gap>
		<view class="logo-name">CoinHome</view>
		<view class="title">
			{{$t('创建个人账户')}}
		</view>
		<u-gap height="76rpx"></u-gap>

		<view class="tab">
			<view :class="{
				'active':index == current
			}" v-for="(item,index) in sbsection" :index="index" @click="onSbsectionChange(index)" :key="index">{{item}}
			</view>
		</view>

		<view class="form">
			<u--form labelPosition="left" :model="uFormModel" :rules="uFormRules" ref="uForm">

				<u-form-item v-if="current === 0" :label="$t('个人电子邮箱')" prop="email">
					<view class="input-box">
						<u--input type="" v-model="uFormModel.email" border="none"></u--input>
					</view>
				</u-form-item>

				<u-form-item v-if="current === 1" :label="$t('个人电话号码')" prop="phone">
					<view class="input-box">
						<u-input type="number" v-model="uFormModel.phone" border="none">
							<view class="phone-area" slot="prefix"
								@click="toRoute('/pages/choosePhoneArea/choosePhoneArea')">
								<u-image src="@/static/icon3.png" width="48rpx" height="48rpx"></u-image>
								<text>{{phoneAreaCode}}</text>
								<u-icon color="#8B8F92" size="20rpx" name="arrow-down-fill"></u-icon>
							</view>
						</u-input>
					</view>
				</u-form-item>

				<u-form-item :label="$t('验证码')" prop="verificationCode">
					<view class="input-box">
						<u-input v-model="uFormModel.verificationCode" border="none">
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

				<u-form-item :label="$t('密码')" prop="loginPassword">
					<view class="input-box pwd">
						<input @input="onPwdChange($event)" class="input" :type="isShowPwd ? 'password':'text'"
							v-model="uFormModel.loginPassword" />
						<u-image @click="isShowPwd = !isShowPwd" :src="require(`@/static/icon${isShowPwd ? 1 : 2}.png`)"
							width="48rpx" height="48rpx"></u-image>
					</view>

				</u-form-item>
				<view class="pwd-tip" v-if="showPwdTip">
					{{$t("密码仅支持6-20个字母、数字、下划线")}}
				</view>
			</u--form>

			<view class="clause">
				<u-checkbox-group v-model="checked">
					<u-checkbox iconColor="#000" name="check" size="24rpx" activeColor="#FEFA05" shape="circle"></u-checkbox>
				</u-checkbox-group>
				<view class="text">
					{{$t('我已阅读并同意CoinHome的')}}<text>{{$t('服务条款')}}</text>{{$t('和')}}<text>{{$t("隐私政策")}}</text>。
				</view>
			</view>

			<view class="btn">
				<u-button :customStyle="{
					height:'90rpx',
					'border-radius': '8rpx'
				}" color="#FEFA05" @click="register"><text class="btn-text">{{$t('创建个人账户')}}</text></u-button>
			</view>

			<view class="tip" @click="toLogin">
				{{$t('已有账号？')}}<text>{{$t('去登录')}}></text>
			</view>
		</view>
		<u-safe-bottom></u-safe-bottom>
	</view>
</template>

<script lang="ts">
	// import Vue from 'vue';
	import "@/typings/register"
	import {
		registered,
		verificationCode
	} from "@/config/api"
	import {
		MD5
	} from '@/utils/md5';

	let timer: any, self: any
	export default {
		data(): DATA {
			const that = (this as any)
			return {
				showPwdTip: false,
				time: 60,
				current: 0,
				sbsection: [that.$t("邮箱"), that.$t("手机号码")],
				isShowPwd: true,
				checked: [],
				loading: false,
				phoneAreaCode: "+86",
				uFormModel: {
					email: "",
					phone: "",
					loginPassword: "",
					verificationCode: ""
				},
				uFormRules: {
					verificationCode: {
						required: true,
						message: that.$t('请输入验证码'),
						trigger: ['blur', 'change']
					},
					email: {
						type: 'email',
						required: true,
						message: that.$t('请输入正确的邮箱格式'),
						trigger: ['blur', 'change']
					},
					// loginPassword: {
					// 	required: true,
					// 	message: false,
					// 	trigger: ['blur', 'change'],
					// 	validator: (rule: any, value: string) => {
					// 		return /^(\w){6,20}$/.test(value)
					// 	},
					// },
					phone: {
						required: true,
						validator: (rule: any, value: string) => {
							return (uni as any).$u.test.mobile(value);
						},
						message: that.$t('个人电话号码不正确'),
						trigger: ['change', 'blur']
					}
				}
			};
		},
		onLoad() {
			self = (this as any)
		},
		onUnload() {
			self.time = 60;
			clearInterval(timer);
		},
		methods: {
			toLogin() {
				( < any > uni).navigateTo({
					url: '/pages/login/login'
				})
			},
			toRoute(path: string) {
				(uni as any).navigateTo({
					url: path
				})
			},
			onPwdChange(e: any) {
				if (/^(\w){6,20}$/.test(e.target.value)) self.showPwdTip = false
				else self.showPwdTip = true
			},
			getVerificationCode() {
				if (self.time < 60) return
				if (self.current === 0 && self.uFormModel.email === "") {
					(uni as any).showToast({
						title: (this as any).$t("请输入正确的邮箱格式"),
						icon: "none"
					})
					return
				}

				if (self.current === 1 && self.uFormModel.phone === "") {
					(uni as any).showToast({
						title: (this as any).$t("个人电话号码不正确"),
						icon: "none"
					})
					return
				}
				(uni as any).showLoading({
					title: (this as any).$t("正在发送..."),
					mask: true
				});
				verificationCode({
					phone: self.uFormModel.phone,
					phoneOrEmail: self.current === 0 ? 2 : 1,
					email: self.uFormModel.email,
					smsType: 0,
					phoneAreaCode: self.phoneAreaCode
				}).then((e: any) => {
					(uni as any).showToast({
						title: (this as any).$t("发送成功"),
						icon: "success"
					});
					self.counDown()
					timer = setInterval(self.counDown, 1000)
				})
			},
			counDown() {
				self.time--
				if (self.time <= 0) {
					clearInterval(timer)
					self.time = 60
				}
			},
			onSbsectionChange(event: number) {
				self.current = event;
				self.time = 60;
				clearInterval(timer);
				(this as any).$refs.uForm.clearValidate()
			},
			register() {
				if (!self.checked.includes('check')) {
					(uni as any).showToast({
						title: (this as any).$t("请阅读并同意CoinHome的服务条款和隐私政策"),
						icon: "none"
					})
					return
				}
				if (!/^(\w){6,20}$/.test(self.uFormModel.loginPassword)) {
					self.showPwdTip = true
				}
				(this as any).$refs.uForm.validate().then((e: any) => {
					if (self.showPwdTip) return
					uni.showLoading({
						title: (this as any).$t("加载中..."),
						mask: true
					});
					let data = JSON.parse(JSON.stringify(self.uFormModel))
					data.loginPassword = MD5.instance.hex_md5(self.uFormModel.loginPassword).toUpperCase()
					if(data.phone == '')delete data.phone
					registered({
						registerWay: self.current === 0 ? 2 : 1,
						...data
					}).then(() => {
						(uni as any).showToast({
							title: (this as any).$t("注册成功！"),
							icon: "success"
						});
						setTimeout((uni as any).navigateBack, 1500)
					})
				}).catch(() => {
					(uni as any).$u.toast((this as any).$t('内容信息有误，请核对后再试'));
				})
			}
		},
	}
</script>

<style lang="scss">
	@import './register.scss';
</style>
