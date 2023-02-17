<template>
	<view>
		<view class="tip">
			{{$t(!showAgain ? '*资金密码是保障您的资产安全重要凭证，请妥善保管。' : '再次确认您的密码')}}
		</view>

		<view class="box" v-show="!showAgain">
			<u-code-input focus space="2rpx" @finish="pwdFinish" fontSize="70rpx" size="100rpx"
				borderColor="transparent" v-model="password" mode="box" dot>
			</u-code-input>

		</view>
		<view class="box" v-show="showAgain">

			<u-code-input space="2rpx" @finish="againFinish" fontSize="70rpx" size="100rpx" borderColor="transparent"
				v-model="againPassword" mode="box" dot>
			</u-code-input>
		</view>
	</view>
</template>

<script>
	import {
		updateFundsPassword
	} from "@/config/api"
	import {
		hex_md5
	} from "@/utils/md5.js"
	export default {
		data() {
			return {
				password: '',
				againPassword: '',
				showAgain: false
			};
		},
		onLoad() {

		},
		methods: {
			pwdFinish(e) {
				this.showAgain = true
				uni.hideKeyboard()
			},
			againFinish(e) {
				if (this.password != this.againPassword) {
					uni.showToast({
						title: this.$t('输入的密码不一致，请重新输入'),
						icon: 'none'
					})
					return
				}
				const newMd5FundsPassword = hex_md5(this.password).toUpperCase(),
					confirmMd5FundsPassword = hex_md5(this.againPassword).toUpperCase()
				uni.showLoading({
					title: '加载中...',
					mask: true
				})
				updateFundsPassword({
					newMd5FundsPassword,
					confirmMd5FundsPassword,
					type: 1
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
			}
		},
	}
</script>

<style lang="scss">
	::v-deep {
		.u-code-input__item {
			background: #F6F6F6;
		}
	}

	.box {
		display: flex;
		justify-content: center;
	}

	.tip {
		background: #F6F6F6;
		padding: 40rpx 30rpx;
		color: #F5475E;
		margin-bottom: 60rpx;
		font-size: 28rpx;
	}

	@media (prefers-color-scheme: dark) {
		.tip {
			background: #171E28;
		}

		::v-deep {
			.u-code-input__item {
				background: #29313C;
			}

			.u-code-input__item__dot {
				background-color: #fff !important
			}
		}

	}
</style>
