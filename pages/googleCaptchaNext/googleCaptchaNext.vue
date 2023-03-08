<template>
	<view>
		<view class="tip">
			{{
        $t(`*输入谷歌验证器中6位验证码，如验证码丢失，请联系
客服。`)
      }}
		</view>

		<view class="box">
			<u-code-input focus space="2rpx" @finish="finish" fontSize="70rpx" size="100rpx" borderColor="transparent"
				v-model="code" mode="box" dot>
			</u-code-input>
		</view>
	</view>
</template>

<script>
	import {
		googleUpdate
	} from "@/config/api"

	export default {
		data() {
			return {
				code: ''
			};
		},
		onLoad(options) {
			this.type = options.type

      let smsType
      if(this.type == 'GOOGLE_NO_BINDING')smsType = 6
      if(this.type == 'GOOGLE_BINDING')smsType = 7
      if(this.type == 'GOOGLE_CLOSE')smsType = 8
      if(this.type == 'GOOGLE_OPEN')smsType = 7
      this.smsType = smsType
		},
		methods: {
			// GOOGLE_NO_BINDING 解绑     GOOGLE_BINDING 绑定     GOOGLE_CLOSE 关闭验证     GOOGLE_OPEN 开启验证
			finish(value) {
				uni.showLoading({
					mask: true
				})
				googleUpdate({
					type: this.type,
					googleCode: value
				}).then((res) => {
          uni.$u.route({
            url:'/pages/googleCaptchaVerify/googleCaptchaVerify',
            params:{
              smsType:this.smsType
            }
          })
				})
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
