<template>
  <view>
    <u-gap height="30rpx"></u-gap>
    <view class="item">
      <view class="lab">{{$t('验证码')}}</view>
      <view class="input">
        <u-input :color="theme == 'light' ? '#303133' : '#ffffff'" v-model="code" clearable border="none">
          <template slot="suffix">
            <text @click="getVerificationCode" v-if="time === 60"
                  class="verificationCode">{{$t("获取验证码")}}</text>
            <text v-else class="verificationCode">{{$t("countDown",{
              time:time
            })}}</text>
          </template>
        </u-input>
      </view>
    </view>
    <view class="email">{{$t('sendCodeText',{
      codeText:regEmail(userInfo.email)
    })}}</view>

    <view class="btn" @click="submit" :class="{
			active:code != ''
		}">{{$t('确认')}}</view>
  </view>
</template>

<script>
import {
  sendVerificationCode,
  checkVerificationCode, userInfo
} from "@/config/api"
export default {
  data() {
    return {
      code: '',
      time: 60,
      userInfo: uni.getStorageSync('userInfo')
    };
  },
  onLoad(options) {
    this.timer = null
    this.smsType = Number(options.smsType)
  },
  onUnload() {
    if (this.time < 60) clearInterval(this.timer)
  },
  methods: {
    submit() {
      if (!this.code) return
      uni.showLoading({
        mask: true
      })
      checkVerificationCode({
        phoneOrEmailStr: uni.getStorageSync('userInfo').email,
        code: this.code,
        smsType: this.smsType
      }).then(() => {
        userInfo().then(userInfo =>{
          let u = uni.getStorageSync('userInfo')
          u.googleVerifyStatus = userInfo.googleVerifyStatus
          uni.setStorageSync('userInfo',u)
          uni.showToast({
            icon:"success"
          })
          setTimeout(()=>{
            uni.navigateBack({
              delta:3
            })
          },1500)
        })
      })
    },
    counDown() {
      const self = this
      self.time--
      if (self.time <= 0) {
        clearInterval(this.timer)
        self.time = 60
      }
    },
    getVerificationCode() {
      const self = this
      if (self.time < 60) return
      uni.showLoading({
        title: this.$t('正在发送...'),
        mask: true
      })
      sendVerificationCode({
        phoneOrEmailStr: uni.getStorageSync('userInfo').email,
        smsType: this.smsType
      }).then(e => {
        uni.showToast({
          title: this.$t('发送成功')
        })
        this.counDown()
        this.timer = setInterval(this.counDown, 1000)
      })
    },
  },
}
</script>

<style lang="scss">
.verificationCode {
  color: #FE9205;
  font-size: 26rpx;
  margin-left: 15rpx;
}

.email {
  padding: 0 30rpx;
  margin-top: 20rpx;
  color: #070707;
  font-size: 24rpx;
}

.btn {
  line-height: 90rpx;
  margin: 0 30rpx;
  border-radius: 8rpx;
  font-weight: 500;
  font-size: 32rpx;
  text-align: center;
  margin-top: 400rpx;
  background: #EEF0F2;
  color: #787884;

  &.active {
    background: #FEFA05;

    color: #000000;
  }
}

.item {
  padding: 0 30rpx;

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

@media (prefers-color-scheme: dark) {

  .item .input {

    background: #29313C;
  }

  .email {
    color: #fff;
  }

  .btn {

    background: #374048;

    color: #929BA2;
  }
}
</style>
