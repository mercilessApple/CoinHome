<template>
  <view>
    <view class="tip">
      {{ $t(`googleCaptchaTip`) }}
    </view>
    <view class="item">
      <view class="title">
        <text>1. {{ $t('下载谷歌验证器APP') }}</text>
        ({{ $t('注：下载可能需要用到翻墙') }})
      </view>
      <view class="val">
        {{ $t('iOS用户登录App Store搜索“Authenticator”下载。安卓用户登录应用商店或使用手机浏览器搜索“谷歌验证器”下载。') }}
      </view>
    </view>
    <view class="item">
      <view class="title">
        <text>2. {{ $t('在谷歌验证器中添加密钥并备份') }}</text>
      </view>
      <view class="val">{{ $t('打开谷歌验证器，扫描下方二维码或手动输入下述密钥添加验证令牌。') }}</view>
    </view>

    <view class="qr-box">
      <block v-if="googleAuthQRCodeData !== ''">
        <uqrcode :value="googleAuthQRCodeData" :size="upx" canvas-id="qrcode">
          <template v-slot:loading>
            <u-loading-icon mode="circle"></u-loading-icon>
          </template>
        </uqrcode>
      </block>
    </view>
    <view class="qr-text">
      <text selectable>{{secretKey}}</text>
    </view>

    <view class="btn">
      <view @click="$u.route({
      url:'/pages/googleCaptchaNext/googleCaptchaNext',
      params:{
        type:'GOOGLE_BINDING'
      }
      })">{{ $t('记住了，下一步') }}</view>
    </view>
    <u-safe-bottom></u-safe-bottom>
  </view>
</template>

<script>
import {getNewOne} from "@/config/api"

export default {
  data() {
    return {
      upx:uni.upx2px(280),
      googleAuthQRCodeData:"",
      secretKey:""
    };
  },
  onLoad() {
    getNewOne().then(res => {
      this.googleAuthQRCodeData = res.googleAuthQRCodeData
      this.secretKey = res.secretKey
    })
  }
}
</script>

<style lang="scss">
.btn {
  padding: 0 30rpx;
  padding-bottom: 30rpx;

  view {
    line-height: 90rpx;
    background: #FEFA05;
    border-radius: 8rpx;
    font-weight: 500;
    color: #2D270D;
    font-size: 32rpx;
    text-align: center;
  }
}

.qr-text {
  text-align: center;
  margin-top: 20rpx;
  margin-bottom: 200rpx;

  text {
    display: inline-block;
    padding: 18rpx 46rpx;
    background: #F6F6F6;
    border-radius: 8rpx;
  }
}

.qr-box {
  width: 280rpx;
  height: 280rpx;
  background: #F6F6F6;
  border-radius: 8rpx;
  margin: 0 auto;
  margin-top: 60rpx;
}

.item {
  margin-top: 60rpx;
  padding: 0 30rpx;

  .val {

    color: #9599A4;
    font-size: 24rpx;
    line-height: 35rpx;
    margin-top: 30rpx;
  }

  .title {

    color: #9599A4;
    font-size: 24rpx;

    text {
      margin-right: 20rpx;
      color: #000000;
      font-size: 30rpx;
    }
  }
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

  .item .title text {
    color: #fff;
  }
  .qr-text text {

    background: #374048;

    color: #9599A4;
  }
}
</style>
