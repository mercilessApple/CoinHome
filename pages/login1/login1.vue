<template>
	<view>
		<u-status-bar></u-status-bar>
		<u-gap height="160rpx"></u-gap>
		<view class="tip-title">
			{{$t('欢迎回来')}}
		</view>
		<view class="account">
			{{account}}
		</view>

		<view class="form">
			<u--form :model="uFormModel" ref="uForm">
				<u-form-item :label="$t('密码')" prop="loginPassword">
					<view class="input-box pwd">
						<input class="input" :type="isShowPwd ? 'text':'password'" v-model="uFormModel.loginPassword" />
						<u-image @click="isShowPwd = !isShowPwd" :src="require(`@/static/icon${isShowPwd ? 1 : 2}.png`)"
							width="48rpx" height="48rpx"></u-image>
					</view>
				</u-form-item>
			</u--form>
		</view>

    <u-popup :bgColor="inverseParams('#fff','#1F282F')" @close="show = false" closeable :show="show" round="20rpx" mode="center">
      <view class="popup">
        <view class="popup-title">{{$t('googleCaptcha')}}</view>
        <view class="item">
          <view class="lab">{{$t('请填写谷歌验证码')}}</view>
          <view class="input-box">
          <u-input border="none" fontSize="32rpx" v-model="googleCode" clearable :placeholder="$t('请输入6位验证码')"></u-input>
          </view>

        </view>

        <view class="btn" @click="next">{{$t('确认')}}</view>
      </view>
    </u-popup>

		<view class="next" @click="next">
			{{$t('下一步')}}
		</view>

		<view @click="$u.route('/pages/resetAccount/resetAccount')" class="tip">{{$t('忘记密码？')}}</view>
	</view>
</template>

<script lang="ts">
	import {
		MD5
	} from '@/utils/md5';
	import {
		userLogin,
		userInfo,
		getNickName
	} from '@/config/api'
	export default {
		data(): any {
			return {
        googleCode:"",
        show:false,
				account: '',
				isShowPwd: false,
				email: "",
				uFormModel: {
					loginPassword: ""
				}
			};
		},
		onLoad(options: any) {
			const self: any = this
			this.uFormModel.phoneOrEmail = options.phoneOrEmail
			self.scene = options.scene
			if (options.phoneOrEmail.indexOf('@') === -1) self.account = self.geTel(options.phoneOrEmail)
			else self.account = self.regEmail(options.phoneOrEmail)
		},
		methods: {
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
			next() {
				const self: any = this
				if (this.uFormModel.loginPassword === '') {
					(uni as any).$u.toast(this.$t('请输入密码'))
					return
				}
				let data = JSON.parse(JSON.stringify(self.uFormModel))
				data.loginPassword = MD5.instance.hex_md5(self.uFormModel.loginPassword).toUpperCase()
        if(self.show){
          data.googleCode = self.googleCode
        }
				uni.showLoading({
					title: self.$t('正在登录...'),
					mask: true
				})
				userLogin({
					...data
				}).then((e: any) => {
					(uni as any).setStorageSync('token', e.token);
					(uni as any).showToast({
						title: self.$t('登录成功！'),
						icon: 'success'
					});
					
					userInfo({}).then((e:any) => {
						if (e.nickName == '') {
							getNickName({}).then((res :any) => {
								e.nickName = res
								uni.setStorageSync('userInfo', e)
							})
						} else {
							uni.setStorageSync('userInfo', e)
						}
					})
					
					setTimeout(() => {
						if(self.scene == 'register'){
							uni.switchTab({
								url:'/pages/index/index'
							})
						}else{
							uni.navigateBack({
								delta: 2
							})
						}
					}, 1500)
				}).catch((err:any)=>{
          if(err.code === 15047){
            //  需要传谷歌验证码
            self.show = true
          }
        })
			}
		},
	}
</script>

<style lang="scss">
.popup{
  padding: 0 30rpx;
  width: 630rpx;
  padding-bottom: 48rpx;
  .btn{
    line-height: 80rpx;
    background: #FEFA05;
    border-radius: 8rpx;
    margin-top: 80rpx;
    font-weight: 500;
    text-align: center;
    color: #2D270D;font-size: 32rpx;
  }
  .item{
    .input-box{
      height: 90rpx;
      background: #F6F6F6;
      padding:0 30rpx;
      border-radius: 8rpx;
      display: flex;
      align-items: center;
    }
    .lab{
      font-weight: 400;
      color: #8B8F92;
      font-size: 26rpx;
      margin-bottom: 16rpx;
    }
    ::v-deep{

    }
  }
  .popup-title{
    text-align: center;
    margin-bottom: 84rpx;
    padding-top: 36rpx;
    font-weight: 500;
    color: #23212C;
    font-size: 40rpx;
  }
}
	page {
		padding: 0 50rpx;

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
		}
	}

	.tip {
		font-weight: 500;
		color: #FE9205;
		font-size: 28rpx;
		margin-top: 50rpx;
	}

	.account {
		font-weight: 500;
		margin-top: 50rpx;
		color: #2B323C;
		font-size: 40rpx;
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
		::v-deep {
			.u-input__content__field-wrapper__field {
				color: #fff !important;
			}
		}

		.form {
			.input-box {
				background: #29313C;

				.input {
					color: #fff !important;
				}
			}
		}
    .popup .item .input-box{

      background: #29313C;
    }
		.tip-title,
		.account,.popup .popup-title{
			color: #fff;
		}
	}
</style>
