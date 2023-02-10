<template>
	<view>
		<u-navbar title="" :autoBack="true" placeholder>
			<view class="u-nav-slot" slot="right">
				<view>
					<u-image src="@/static/icon15.png" width="48rpx" height="48rpx"></u-image>
				</view>
				<view style="margin-left: 30rpx;">
					<u-image src="@/static/icon5.png" width="48rpx" height="48rpx"></u-image>
				</view>
			</view>
		</u-navbar>
		<view class="user-box">
			<view class="left">
				<u-avatar size="96rpx" :iconUrl="userInfo.iconUrl"></u-avatar>
				<view class="info">
					<view class="name" @click="$u.route('/pages/userInfo/userInfo')">
						{{userInfo.nickName}}
						<view>
							<u-icon color="#9699A0" name="arrow-right"></u-icon>
						</view>
					</view>
					<view class="uid" @click="copy"><text>UID：{{userInfo.uid}}</text>
						<u-image src="@/static/icon16.png" width="28rpx" height="28rpx">
						</u-image>
					</view>
				</view>
			</view>
			<view class="right">
				<view class="green" v-if="userInfo.verifiedAudit === 1 || userInfo.verifiedAudit === 4">
					<u-image src="@/static/icon18.png" width="34rpx" height="32rpx"></u-image>
					<text>{{$t('已认证')}}</text>
				</view>

				<view class="yellow" v-if="userInfo.verifiedAudit === 3">
					<u-image src="@/static/icon17.png" width="36rpx" height="24rpx"></u-image>
					<text>{{$t('未认证')}}</text>
				</view>
			</view>
		</view>
		<view class="tip" v-if="userInfo.verifiedAudit === 3">
			<u-alert showIcon type="warning" :description="$t('您需要完成身份验证后，方能使用CoinHome服务。')"></u-alert>
		</view>
		<view class="tip" v-if="userInfo.verifiedAudit === 1 || userInfo.verifiedAudit === 4">
			<view class="box">
				<u-image src="@/static/icon23.png" width="48rpx" height="48rpx"></u-image>
				<text v-if="userInfo.userType === 1">{{$t('普通用户')}}</text>
				<text v-if="userInfo.userType === 41">{{$t('分析师')}}</text>
			</view>
		</view>
		<view class="nav">
			<view class="item" v-for="(item,index) in navList" :key="index" @click="$u.route({
				url:item.url
			})">

				<view class="left">
					<u-image width="48rpx" height="48rpx" :src="item.icon"></u-image>
					<text>{{item.name}}</text>
				</view>

				<view class="right">
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
		</view>

		<view class="btn" @click="exit">
			{{$t('退出')}}
		</view>
		<u-gap height="30rpx"></u-gap>
		<u-safe-bottom></u-safe-bottom>
	</view>
</template>

<script>
	import {
		userInfo,
		signOut,
		getNickName
	} from "@/config/api"
	export default {
		data() {
			return {
				userInfo: {
					uid: 0,
					nickName: this.$t('加载中...')
				},
				navList: [{
						name: this.$t('订单管理'),
						icon: require("@/static/icon19.png"),
						url: '/pages/order/order'
					},
					{
						name: this.$t('安全'),
						icon: require("@/static/icon22.png"),
						url: '/pages/safety/safety'
					},
					{
						name: this.$t('帮助中心'),
						icon: require("@/static/icon20.png")
					},
					{
						name: this.$t('设置'),
						icon: require("@/static/icon21.png"),
						url: '/pages/set/set'
					}
				]
			};
		},
		onShow() {
			userInfo().then(e => {
				if (e.nickName == '') {
					e.nickName = uni.getStorageSync('randomNickName')
					uni.setStorageSync('userInfo', e)
				}
			})
		},
		onLoad() {
			if (uni.getStorageSync('userInfo')) {
				this.userInfo = uni.getStorageSync('userInfo')
				return
			}
			userInfo().then(e => {
				if (e.nickName == '') {
					getNickName().then(res => {
						e.nickName = res
						this.userInfo = e
						this.randomNickName = res
						uni.setStorageSync('randomNickName', res)
						uni.setStorageSync('userInfo', this.userInfo)
					})
				} else {
					this.userInfo = e
					uni.setStorageSync('userInfo', this.userInfo)
				}
			})
		},
		methods: {
			exit() {
				signOut().then(() => {
					uni.removeStorageSync('token')
					uni.removeStorageSync('userInfo')
					uni.showToast({
						title: '',
						icon: 'success'
					})
					uni.switchTab({
						url: '/pages/index/index'
					})
				})
			},
			// regEmail(email) {
			// 	if (String(email).indexOf('@') > 0) {
			// 		let str = email.split('@'),
			// 			_s = ''
			// 		if (str[0].length > 3) {
			// 			for (let i = 0; i < str[0].length - 6; i++) {
			// 				_s += '*'
			// 			}
			// 		}
			// 		var new_email = str[0].substr(0, 3) + _s + '@' + str[1]
			// 	}
			// 	return new_email
			// },
			copy() {
				uni.setClipboardData({
					data: String(this.userInfo.uid)
				})
			}
		},
	}
</script>

<style lang="scss">
	.btn {
		margin: 0 30rpx;
		margin-top: 470rpx;
		line-height: 90rpx;
		background: #EEF0F2;
		text-align: center;
		border-radius: 8rpx;
	}

	.nav {
		.item {
			display: flex;
			justify-content: space-between;
			padding: 0 30rpx;
			height: 120rpx;
			align-items: center;

			.left {
				display: flex;
				align-items: center;

				text {
					margin-left: 20rpx;

					color: #242329;
					font-size: 32rpx;
				}
			}
		}
	}

	::v-deep {
		.u-alert__content__desc {
			color: #23282E;
		}

		.u-alert--warning--light {
			background-color: #F3F4F6;
		}
	}

	.tip {
		margin-top: 20rpx;
		margin-bottom: 40rpx;
		padding: 0 30rpx;

		.box {
			height: 64rpx;
			display: flex;
			align-items: center;
			padding: 0 30rpx;
			background: #F3F4F6;
			border-radius: 4rpx;

			text {
				margin-left: 18rpx;
				color: #FE9205;
				font-size: 24rpx;
			}
		}
	}

	.u-nav-slot {
		display: flex;
		align-items: center;
	}

	.user-box {
		padding: 20rpx 0;
		padding-left: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.right {
			// width: 170rpx;
			height: 56rpx;

			.green,
			.yellow {
				padding: 0 30rpx;
				height: 100%;
				border-radius: 40rpx 0px 0px 40rpx;
				background-color: rgba(254, 250, 5, 0.16);
				display: flex;
				align-items: center;
				justify-content: center;

				text {
					font-weight: 500;
					color: #FE9205;
					margin-left: 10rpx;
					font-size: 22rpx;
				}
			}

			.green {
				background-color: rgba(45, 190, 135, 0.16);

				text {
					color: #2DBE87;
				}
			}

			.yellow {
				background-color: rgba(254, 250, 5, 0.16);

				text {
					color: #FE9205;
				}
			}
		}

		.left {
			display: flex;

			.info {
				margin-left: 30rpx;

				.uid {
					display: flex;
					margin-top: 10rpx;
					align-items: center;
					color: #9699A0;
					font-size: 22rpx;

					text {
						margin-right: 10rpx;
					}
				}

				.name {
					font-weight: 500;
					color: #23282E;
					font-size: 38rpx;
					display: flex;
					align-items: center;

					>view {
						margin-left: 12rpx;
					}
				}
			}
		}
	}
</style>
