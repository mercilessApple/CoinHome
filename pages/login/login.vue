<template>
	<view>
		<u-status-bar></u-status-bar>
		<u-gap height="160rpx"></u-gap>
		<view class="content">
			<view class="title">
				CoinHome {{$t('登录')}}
			</view>
			<view class="form">
				<u--form :model="uFormModel" ref="uForm">
					<u-form-item :label="$t('请输入您的邮箱/手机号码')" prop="phoneOrEmail">
						<view class="input-box">
							<u--input @confirm="next" v-model="uFormModel.phoneOrEmail" border="none">
							</u--input>
						</view>
					</u-form-item>
				</u--form>
			</view>
			<view class="next" @click="next">
				{{$t('下一步')}}
			</view>

			<view @click="$u.route('/pages/register/register')" class="tip">{{$t('创建一个CoinHome账户')}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scene: '',
				uFormModel: {
					phoneOrEmail: ""
				}
			};
		},
		onLoad(options) {
			this.scene = options.scene || ''
		},
		methods: {
			next() {
				if (this.uFormModel.phoneOrEmail) {
					uni.$u.route({
						url: '/pages/login1/login1',
						params: {
							phoneOrEmail: this.uFormModel.phoneOrEmail,
							scene: this.scene
						}
					})
				} else {
					uni.$u.toast(this.$t('请输入您的邮箱/手机号码'))
				}
			}
		},
	}
</script>

<style lang="scss">
	page {
		padding-top: 44px;

		::v-deep {

			.u-form-item__body__left {
				width: auto !important;
			}

			.u-form-item__body__left__content__label {
				color: #8B8F92 !important;
				font-size: 26rpx !important;
			}

			.u-form-item__body {
				padding-top: 0 !important;
				padding-bottom: 0 !important;
				margin-top: 50rpx !important;
				flex-direction: column !important
			}
		}
	}

	.content {
		padding: 0 50rpx;

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

		.title {
			font-weight: bold;
			color: #2B323C;
			font-size: 52rpx;
		}
	}

	@media (prefers-color-scheme: dark) {
		page {
			::v-deep {
				.u-input__content__field-wrapper__field {
					color: #fff !important;
				}
			}
		}

		.content {
			.form {
				.input-box {
					background: #29313C;
				}
			}

			.title {
				color: #FFFFFF;
			}
		}
	}
</style>
