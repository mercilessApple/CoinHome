<template>
	<view>
		<u-status-bar></u-status-bar>
		<u-gap height="160rpx"></u-gap>
		<view class="tip-title">
			{{$t('重置密码')}}
		</view>
		<view class="form">
			<u--form ref="uForm">
				<u-form-item :label="$t('请输入您的邮箱/手机号码')" prop="phoneOrEmail">
					<view class="input-box">
						<u--input v-model="phoneOrEmail" border="none"></u--input>
					</view>
				</u-form-item>
			</u--form>
		</view>

		<view class="next" @click="next">
			{{$t('下一步')}}
		</view>

		<view @click="$u.route('/pages/register/register')" class="tip">{{$t('创建一个CoinHome账户')}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phoneOrEmail: ""
			};
		},
		methods: {
			next() {
				if (this.phoneOrEmail === "") {
					uni.showToast({
						title: this.$t("请输入您的邮箱/手机号码"),
						icon: 'none'
					})
					return
				}
				uni.$u.route({
					url: '/pages/accountVerification/accountVerification',
					params: {
						phoneOrEmail: this.phoneOrEmail
					}
				})
			}
		},
	}
</script>

<style lang="scss">
	page {
		padding: 0 50rpx;

		::v-deep {

			.u-form-item__body__left {
				width: auto !important;
			}

			.u-form-item__body__left__content__label {
				color: #8B8F92 !important;
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
		margin-bottom: 50rpx;

		.input-box {
			height: 90rpx;
			background: #F6F6F6;
			border-radius: 8rpx;
			margin-top: 16rpx;
			display: flex;
			align-items: center;
			width: 100%;
			padding: 0 20rpx;
		}
	}

	.tip {
		font-weight: 500;
		color: #FE9205;
		font-size: 28rpx;
		margin-top: 50rpx;
	}

	.next {
		font-weight: 500;
		color: #2D270D;
		font-size: 32rpx;
		line-height: 90rpx;
		border-radius: 8rpx;
		background-color: #FEFA05;
		text-align: center;
	}

	.tip-title {
		font-weight: bold;
		color: #2B323C;
		font-size: 52rpx;
	}

	@media (prefers-color-scheme: dark) {
		.tip-title {
			color: #FFFFFF;
		}

		.input-box {

			background: #29313C !important;
			::v-deep{
				input{
					color: #fff !important;
				}
			}
		}
	}
</style>
