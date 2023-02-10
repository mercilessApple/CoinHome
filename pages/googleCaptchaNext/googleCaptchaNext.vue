<template>
	<view>
		<view class="tip">
			{{$t(`*输入谷歌验证器中6位验证码，如验证码丢失，请联系
客服。`)}}
		</view>

		<view class="box">
			<u-code-input focus space="2rpx" @finish="finish" fontSize="70rpx" size="100rpx" borderColor="transparent"
				v-model="code" mode="box" dot>
			</u-code-input>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				code: ''
			};
		},
		methods: {
			finish(e) {

			}
		}
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
		margin-top: 60rpx
	}

	.tip {
		padding: 40rpx 30rpx;
		background-color: #F6F6F6;
		color: #FE9205;
		font-size: 22rpx;
		line-height: 35rpx;
	}
</style>
