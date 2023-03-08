<template>
  <view>
    <view class="title">
      {{ $t('googleCaptcha') }}
    </view>
    <u-gap height="40rpx"></u-gap>
    <view class="nav">
      <view class="item" @click="unbind">
        <view class="left">{{ $t('解绑') }}</view>
        <view class="right" v-show="googleCaptchaState != 0">
          <u-icon name="arrow-right" size="24rpx" :color="inverseParams('','#fff')"></u-icon>
        </view>
      </view>

      <view class="item" @click="googleCaptchaState != 2 ? showPopup(0): false">
        <view class="left">{{ $t('关闭') }}</view>
        <view class="right" v-show="googleCaptchaState != 2">
          <u-icon name="arrow-right" size="24rpx" :color="inverseParams('','#fff')"></u-icon>
        </view>
      </view>

      <view class="item" @click="googleCaptchaState != 1 ? open() : false">
        <view class="left">{{ $t('开启') }}</view>
        <view class="right" v-show="googleCaptchaState != 1">
          <u-icon name="arrow-right" size="24rpx" :color="inverseParams('','#fff')"></u-icon>
        </view>
      </view>

    </view>

    <u-popup :bgColor="inverseParams('#fff','#1F282F')" :show="visible" round="20rpx" mode="center">
      <view class="popup">
        <view class="popup-title">
          {{ current === 0 ? $t('关闭谷歌验证码') : $t('解除绑定') }}
        </view>
        <view class="popup-content">
          {{
            current === 0 ? $t(`关闭后将不可使用，若想重新使用需要重新开启。`) : $t(`解除绑定以后将不可使用，若想再次使用当前功能需重新绑定。`)
          }}
        </view>

        <view class="btn confirm" @click="confirm">{{ $t('确定') }}</view>
        <view class="btn cancel" @click="visible = false">{{ $t('取消') }}</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      current: null,
      scene: "",
      googleCaptchaState: uni.getStorageSync('userInfo').googleVerifyStatus
    };
  },
  onLoad(){

  },
  methods: {
    unbind(){
      if(this.googleCaptchaState != 0){
        this.visible = true
        this.current = null
      }

    },
    confirm() {
      this.next(this.current == 0 ? 'GOOGLE_CLOSE' : 'GOOGLE_NO_BINDING')
      this.visible = false
    },
    showPopup(index) {
      this.current = index
      this.visible = true
    },
    open() {
      uni.$u.route({
        url: '/pages/googleCaptchaNext/googleCaptchaNext',
        params: {
          type: "GOOGLE_OPEN"
        }
      })
    },
    next(type) {
      uni.$u.route({
        url: '/pages/googleCaptchaNext/googleCaptchaNext',
        params: {
          type
        }
      })
    }
  },
}
</script>

<style lang="scss">
.popup {
  padding: 0 40rpx;
  width: 520rpx;

  .popup-title {
    font-weight: 500;
    color: #23212C;
    padding-top: 40rpx;
    font-size: 32rpx;
    text-align: center;
  }

  .popup-content {
    font-weight: 400;
    margin-top: 46rpx;
    color: #23212C;
    font-size: 26rpx;
    margin-bottom: 40rpx;
  }

  .btn {
    font-weight: 500;
    font-size: 32rpx;
    text-align: center;
    color: #FE9205;

    &.confirm {
      color: #2D270D;
      background: #FEFA05;
      line-height: 80rpx;

      border-radius: 8rpx;
    }

    &.cancel {
      padding-top: 24rpx;
      padding-bottom: 34rpx;
    }
  }
}

.nav {
  .item {
    height: 96rpx;
    padding: 0 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20rpx;

    .right {
      display: flex;
      align-items: center;

    }

    .left {
      font-weight: 500;
      color: #23212C;
    }
  }
}

.title {
  padding-left: 30rpx;
  line-height: 136rpx;
  font-weight: bold;
  color: #23282E;
  font-size: 48rpx;
  background: #F6F6F6;
}

@media (prefers-color-scheme: dark) {
  .title {

    background: #171E28;
  }

  .nav .item .left, .popup .popup-title, .popup .popup-content, .title {
    color: #fff;
  }

}
</style>
