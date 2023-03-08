<template>
  <view>
    <view class="tip">
      {{ $t('standard') }}
    </view>
    <view class="content">
      <view class="country">
        <view class="title" style="padding-top: 40rpx;">{{ $t('证件签发国家/地区') }}</view>
        <view class="picker-box" @click="choose">
          <view class="left">
            <u-image width="48rpx" height="48rpx"
                     :src="areaItem.key == 0 ? require('@/static/icon48.png') : require('@/static/icon3.png')">
            </u-image>
            <text>{{ areaItem.name == $t('外国') ? $t('请选择') : areaItem.name }}</text>
          </view>
          <view>
            <u-icon color="#8B8F92" size="20rpx" name="arrow-down-fill"></u-icon>
          </view>
        </view>
      </view>

      <!-- <view class="id" v-if="areaItem.key == 1">
        <view class="title">{{$t('证件类型')}}</view>

        <view @click="idType = 0" class="item" :class="{
          active:idType == 0
        }">
          <view class="left">
            <u-image src="/static/icon28.png" width="48rpx" height="48rpx"></u-image>
            <text>{{$t('身份证')}}</text>
          </view>
          <view class="right">
            <u-icon :color="idType == 0 ? '#FEFA05' : '#B9B9BB'"
              :name="idType == 0 ? 'checkmark-circle-fill' : 'checkmark-circle'"></u-icon>
          </view>
        </view>
        <view @click="idType = 1" class="item" style="margin-top: 20rpx;" :class="{
          active:idType == 1
        }">
          <view class="left">
            <u-image src="/static/icon3.png" width="48rpx" height="48rpx"></u-image>
            <text>{{$t('证件')}}</text>
          </view>
          <view class="right">
            <u-icon :color="idType == 1 ? '#FEFA05' : '#B9B9BB'"
              :name="idType == 1 ? 'checkmark-circle-fill' : 'checkmark-circle'"></u-icon>
          </view>
        </view>
      </view> -->

      <view class="info">
        <view class="title">{{ $t('填写信息') }}</view>
        <block v-if="areaItem.key == 0">
          <view class="item">
            <view class="lab">{{ $t('证件号') }}</view>
            <view class="input">
              <u-input v-model="val" :color="theme == 'light' ? '#303133' : '#ffffff'" fontSize="26rpx"
                       border="none" type="idcard" :placeholder="$t('请输入您的证件号')"></u-input>
            </view>
          </view>
          <view class="item">
            <view class="lab">{{ $t('中文姓') }}</view>
            <view class="input">
              <u-input v-model="en_firstName" :color="theme == 'light' ? '#303133' : '#ffffff'"
                       fontSize="26rpx" border="none" :placeholder="$t('请输入您的姓')"></u-input>
            </view>
          </view>
          <view class="item">
            <view class="lab">{{ $t('中文名') }}</view>
            <view class="input">
              <u-input v-model="en_lastName" :color="theme == 'light' ? '#303133' : '#ffffff'"
                       fontSize="26rpx" border="none" :placeholder="$t('请输入您的名字')"></u-input>
            </view>
          </view>
          <view class="item">
            <view class="lab">{{ $t('生日') }}</view>
            <view class="input" @click="showBirthday = true">
              <!--                <picker @change="bindDateChange" mode="date" :value="birthday">-->
              <!--                  <u-input readonly v-model="birthday"-->
              <!--                           :color="theme == 'light' ? '#303133' : '#ffffff'" fontSize="26rpx" border="none"-->
              <!--                           :placeholder="$t('请输入您的生日')"></u-input>-->
              <!--                </picker>-->
              <u-input readonly v-model="birthday"
                       :color="theme == 'light' ? '#303133' : '#ffffff'" fontSize="26rpx" border="none"
                       :placeholder="$t('请输入您的生日')"></u-input>
            </view>
          </view>
        </block>

        <block v-if="areaItem.key == 1">
          <view class="item">
            <view class="lab">{{ $t('英文姓') }}</view>
            <view class="input">
              <u-input v-model="en_firstName" :color="theme == 'light' ? '#303133' : '#ffffff'"
                       fontSize="26rpx" border="none" :placeholder="$t('请输入您的姓')"></u-input>
            </view>
          </view>
          <view class="item">
            <view class="lab">{{ $t('英文名') }}</view>
            <view class="input">
              <u-input v-model="en_lastName" :color="theme == 'light' ? '#303133' : '#ffffff'"
                       fontSize="26rpx" border="none" :placeholder="$t('请输入您的名字')"></u-input>
            </view>
          </view>
          <view class="item">
            <view class="lab">{{ $t('生日') }}</view>
            <view class="input" @click="showBirthday = true">
              <u-input readonly v-model="birthday"
                       :color="theme == 'light' ? '#303133' : '#ffffff'" fontSize="26rpx" border="none"
                       :placeholder="$t('请输入您的生日')"></u-input>
            </view>
          </view>
        </block>
      </view>
    </view>

    <!-- <u-picker confirmColor="#FEFA05" @cancel="show = false" :show="show" :columns="columns"></u-picker> -->

    <u-datetime-picker
        @confirm="bindDateChange"
        :show="showBirthday"
        v-model="date"
        mode="date"
        @cancel="showBirthday = false"
        :title="$t('生日')"
        :maxDate="maxDate"
		:minDate="minDate"
        :confirmColor="inverseParams('#000' , '#FEFA05')"
    ></u-datetime-picker>

    <u-action-sheet class="u-action-sheet" @select="select" @close="show = false" :cancelText="$t('取消')"
                    safeAreaInsetBottom round="40rpx" :title="$t('证件签发国家/地区')" :actions="columns"
                    :show="show"></u-action-sheet>
    <view class="btn" @click="submit">
      {{ $t('提交') }}
    </view>
    <u-gap height="88rpx"></u-gap>
  </view>
</template>

<script>
import {
  userPrimaryVerified
} from "@/config/api"

export default {
  data() {
    return {
      date: Number(new Date()),
      maxDate: (new Date()).valueOf(),
	  minDate:(new Date("1970/01/01")).valueOf(),
      showBirthday: false,
      birthday: '',
      en_firstName: '',
      en_lastName: '',
      columns: [{
        name: this.$t('中国'),
        key: 0
      },
        {
          name: this.$t('外国'),
          key: 1
        }

      ],
      idType: 0,
      show: false,
      name: '',
      val: '',
      areaItem: {
        nationality: "CHN",
        nationalityName: this.$t('中国'),
        key: 0,
        name: this.$t('中国')
      }
    };
  },
  onLoad() {
	
  },
  methods: {
    choose() {
      if (this.areaItem.key == 0) {
        this.show = true
      } else {
        uni.$u.route('/pages/selectCountryCode/selectCountryCode')
      }
    },
    bindDateChange: function (e) {
      this.birthday = this.$moment(e.value).format('YYYY-MM-DD')
      this.showBirthday = false
    },
    select(e) {
      this.areaItem = e
    },
    submit() {
      if (this.areaItem.name == this.$t('外国')) {
        uni.showToast({
          title: this.$t('请选择') + this.$t('证件签发国家/地区'),
          icon: 'none'
        })
        return
      }

      if (this.en_firstName == '') {
        uni.showToast({
          title: this.$t('请输入您的姓'),
          icon: 'none'
        })
        return
      }
      if (this.en_lastName == '') {
        uni.showToast({
          title: this.$t('请输入您的名字'),
          icon: 'none'
        })
        return
      }

      if (this.birthday == '') {
        uni.showToast({
          title: this.$t('请输入您的生日'),
          icon: 'none'
        })
        return
      }


      if (this.val == '' && this.areaItem.key == 0) {
        uni.showToast({
          title: this.$t('请输入您的证件号'),
          icon: 'none'
        })
        return
      }
      uni.showLoading({
        title: this.$t('加载中...'),
        mask: true
      })

      userPrimaryVerified({
        nationality: this.areaItem.nationality,
        realName: '',

        // certificateType: this.areaItem.key == 0 ? 1 : this.idType == 0 ? 1 : 2,
        // certificateName: this.areaItem.key == 0 ? '身份证' : this.idType == 0 ? '身份证' : '证件',
        nationalityName: this.areaItem.nationalityName,

        cardNo: this.areaItem.key == 0 ? this.val : uni.$u.guid(20),
        birthday: this.birthday,
        lastName: this.en_lastName,
        firstName: this.en_firstName
      }).then(e => {
        uni.showToast({
          title: this.$t('操作成功！')
        })
        setTimeout(() => {
          uni.navigateBack()
        }, 1500)
      })
    }
  },
}
</script>

<style lang="scss">
.btn {
  line-height: 90rpx;
  background: #FEFA05;
  font-weight: 500;
  color: #2D270D;
  margin: 0 30rpx;
  margin-top: 190rpx;
  text-align: center;
  border-radius: 8rpx;
  font-size: 32rpx;
}

.info {
  .item {
    margin-top: 20rpx;

    .lab {

      color: #8B8F92;
      margin-bottom: 20rpx;
      font-size: 26rpx;
    }

    .input {
      height: 90rpx;
      display: flex;
      padding: 0 30rpx;
      align-items: center;
      background: #F6F6F6;
    }
  }
}

.id {
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20rpx;
    height: 100rpx;
    border: 2rpx solid #EBEBEB;
    border-radius: 8rpx;

    &.active {
      border-color: #FEFA05;
    }

    .left {
      display: flex;
      align-items: center;

      text {
        margin-left: 20rpx;
        font-weight: 500;
        color: #1C1C1C;
        font-size: 28rpx;
      }
    }
  }
}

.content {
  padding: 0 30rpx;
}

.picker-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20rpx;

  .left {
    display: flex;
    align-items: center;

    text {

      color: #1C1C1C;
      font-size: 28rpx;
      margin-left: 20rpx;
    }
  }

  border: 2rpx solid #EAEAEA;
  height: 90rpx;
  border-radius: 8rpx;
}

.country,
.info,
.id {
  .title {
    font-weight: 500;
    padding-top: 60rpx;
    margin-bottom: 20rpx;
    color: #1C1C1C;
    font-size: 28rpx;
  }
}

.tip {
  padding: 56rpx 30rpx;
  background: #F6F6F6;
  font-weight: bold;
  color: #23282E;
  font-size: 48rpx;
}

@media (prefers-color-scheme: dark) {
  page {
    background: #1A1B1F;
  }

  .u-action-sheet {
    ::v-deep {
      .u-gap {
        background-color: #29313C !important;
      }
    }
  }

  ::v-deep {
    .u-popup__content {
      background-color: #1F282F !important;
    }

    .u-action-sheet__item-wrap__item__name, .u-picker__view__column__item, .u-toolbar__title {
      color: #fff !important;
    }

    .u-line {
      border-bottom-color: #343B45 !important;
    }

    .u-action-sheet__header__title {
      color: #8B8F92 !important;
    }

    .u-action-sheet--hover {
      background-color: transparent !important;
    }

    //.u-picker{
    //  background-color: #1A1B1F !important;
    //}
  }

  .picker-box,
  .id .item {
    border-color: #454E57;
  }

  .info {
    .input {
      border-radius: 8rpx;

      border: 2rpx solid #484D53;
      background: #1A1B1F !important;
    }
  }

  .picker-box {

    background: #454E57;

    .left {
      text {
        color: #FFFFFF !important;
      }
    }
  }

  .id .item {

    background: #454E57;

    .left {
      text {
        color: #FFFFFF !important;
      }
    }
  }

  .country,
  .info,
  .id {
    .title {
      color: #fff;
    }
  }

  .tip {

    background: #0A0E11;

    color: #FFFFFF;
  }
}
</style>
