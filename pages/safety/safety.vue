<template>
  <view>
    <view class="title">
      <view class="big-tip">{{ $t('安全信息') }}</view>
      <view class="tip">{{ $t('为了保护您的账户安全，请谨慎修改修改信息。') }}</view>
    </view>

    <view class="nav">
      <view class="item" @click="$u.route('/pages/loginPassword/loginPassword')">
        <view class="left">{{ $t('loginPassword') }}</view>
        <view class="right">
          <text>{{ $t('修改') }}</text>
          <u-icon name="arrow-right"></u-icon>
        </view>
      </view>
      <view class="item" @click="$u.route('/pages/fundPassword/fundPassword')">
        <view class="left">{{ $t('fundPassword') }}</view>
        <view class="right">
          <text>{{ $t('修改') }}</text>
          <u-icon name="arrow-right"></u-icon>
        </view>
      </view>
      <view class="item" @click="toGoogleCaptcha">
        <view class="left">{{ $t('googleCaptcha') }}</view>
        <view class="right">
          <text>{{ $t(googleCaptchaState === 0 ? '去设置' : googleCaptchaState === 1 ? '开启' : '关闭') }}</text>
          <u-icon name="arrow-right"></u-icon>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
	import { userInfo} from "@/config/api"
export default {
  data() {
    return {
      googleCaptchaState: uni.getStorageSync('userInfo').googleVerifyStatus    //谷歌验证状态，0为解绑/未绑定，1为绑定并开启，2为绑定但暂停验证
    };
  },
  onShow() {
    this.googleCaptchaState = uni.getStorageSync('userInfo').googleVerifyStatus
  },
  methods: {
    toGoogleCaptcha() {
      if (this.googleCaptchaState === 0) uni.$u.route("/pages/googleCaptcha/googleCaptcha")
      else uni.$u.route("/pages/googleCaptchaState/googleCaptchaState")
    }
  },
}
</script>

<style lang="scss">
.nav {
  margin-top: 40rpx;

  .item {
    height: 96rpx;
    padding: 0 30rpx;
    /* #ifdef APP-PLUS */
    padding-right: 0;
    /* #endif */
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20rpx;

    .right {
      display: flex;
      align-items: center;

      text {
        margin-right: 20rpx;
        color: #9599A4;
        font-size: 28rpx;
      }
    }

    .left {
      font-weight: 500;
      color: #23212C;
    }
  }
}

.title {
  padding: 30rpx;
  background: #F6F6F6;

  .big-tip {
    font-weight: bold;
    color: #23282E;
    font-size: 48rpx;
  }

  .tip {
    margin-top: 30rpx;
    color: #BBBEC5;
    font-size: 28rpx;
  }
}

@media (prefers-color-scheme: dark) {
  .title {
    background: #171E28;
  }

  .title .big-tip {
    color: #FFFFFF;
  }

  .nav .item .left {
    color: #FFFFFF;
  }
}
</style>
