<template>
	<view>
		<u-navbar :class="{
			set
		}" :themeColor="inverseParams('#fff','#1F282F')" :leftIconColor="theme == 'light' ? '#303133' : '#fff'" title=""
			:autoBack="true" placeholder>
			<view class="u-nav-slot" slot="right">
				<view @click="changeTheme" v-if="showThemeBtn">
					<u-image v-if="theme == 'dark'" src="@/static/icon15.png" width="48rpx" height="48rpx"></u-image>
					<u-image v-else src="@/static/icon45.png" width="48rpx" height="48rpx"></u-image>
				</view>

				<view style="margin-left: 30rpx;" @click="toServer">
					<u-image src="@/static/icon5.png" width="48rpx" height="48rpx"></u-image>
				</view>
			</view>
		</u-navbar>
		<view class="user-box">
			<view class="left" @click="$u.route(isLogin ? '/pages/userInfo/userInfo' : '/pages/login/login')">
				<u-avatar size="96rpx" :default-url="require('@/static/icon46.png')" :iconUrl="userInfo.iconUrl">
				</u-avatar>
				<view class="info">
					<view class="name">
						{{userInfo.nickName}}
						<view>
							<u-icon color="#9699A0" name="arrow-right"></u-icon>
						</view>
					</view>
					<view class="uid" @click.stop="copy"><text>UID：{{userInfo.uid}}</text>
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

				<view @click="$u.route('/pages/authentication/authentication')" class="yellow"
					v-if="userInfo.verifiedAudit === 3">
					<u-image src="@/static/icon17.png" width="36rpx" height="24rpx"></u-image>
					<text>{{$t('未认证')}}</text>
				</view>
			</view>
		</view>
		<view class="tip" v-if="userInfo.verifiedAudit === 3">
			<u-alert @click="$u.route('/pages/authentication/authentication')" showIcon type="warning"
				:description="$t('您需要完成身份验证后，方能使用CoinHome服务。')"></u-alert>
		</view>
		<view class="tip" v-if="userInfo.verifiedAudit === 1 || userInfo.verifiedAudit === 4">
			<view class="box">
				<u-image src="@/static/icon23.png" width="48rpx" height="48rpx"></u-image>
				<text v-if="userInfo.userType === 1">{{$t('普通用户')}}</text>
				<text v-if="userInfo.userType === 41">{{$t('分析师')}}</text>
			</view>
		</view>
		<view class="nav">
			<view class="item" v-for="(item,index) in navList" :key="index" @click="toNext(item,index)">

				<view class="left">
					<u-image width="48rpx" height="48rpx" :src="item.icon"></u-image>
					<text>{{item.name}}</text>
				</view>

				<view class="right">
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
		</view>

		<view class="btn" @click="exit" v-if="isLogin && userInfo.uid != 0">
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
	import {
		helpCenterURL
	} from "@/utils";
	export default {
		data() {
			return {
				set: false,
				showThemeBtn: false,
				isLogin: uni.getStorageSync('token'),
				userInfo: {
					uid: 0,
					nickName: this.$t('加载中...')
				},
				navList: [{
						name: this.$t('订单管理'),
						icon: require("@/static/icon19.png"),
						url: '/pages/order/order',
						hasLogin: true
					},
					{
						name: this.$t('安全'),
						icon: require("@/static/icon22.png"),
						url: '/pages/safety/safety',
						hasLogin: true
					},
					{
						name: this.$t('任务中心'),
						url: '/pages/taskCenter/taskCenter',
						icon: require("@/static/icon58.png")
					},
					{
						name: this.$t('帮助中心'),
						icon: require("@/static/icon20.png"),
						params: this.utils.helpCenterURL,
						url: '/pages/webview/webview'
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
			this.isLogin = !!uni.getStorageSync('token')
			if (this.isLogin) {
				if (uni.getStorageSync('userInfo')) {
					this.userInfo = uni.getStorageSync('userInfo')
					return
				}
				this.userInfo.nickName = this.$t('加载中...')
				userInfo().then(e => {
					if (e.nickName == '') {
						getNickName().then(res => {
							e.nickName = res
							this.userInfo = e
							uni.setStorageSync('randomNickName', res)
							uni.setStorageSync('userInfo', this.userInfo)
						})
					} else {
						this.userInfo = e
						uni.setStorageSync('userInfo', this.userInfo)
					}
				})
			} else {
				this.userInfo.nickName = this.$t('请先登录')
			}
		},
		onLoad() {
			// if (uni.getStorageSync('userInfo')) {
			// 	this.userInfo = uni.getStorageSync('userInfo')
			// 	return
			// }
			// userInfo().then(e => {
			// 	if (e.nickName == '') {
			// 		getNickName().then(res => {
			// 			e.nickName = res
			// 			this.userInfo = e
			// 			this.randomNickName = res
			// 			uni.setStorageSync('randomNickName', res)
			// 			uni.setStorageSync('userInfo', this.userInfo)
			// 		})
			// 	} else {
			// 		this.userInfo = e
			// 		uni.setStorageSync('userInfo', this.userInfo)
			// 	}
			// })

			let sysInfo = uni.getSystemInfoSync()
			if (sysInfo.platform == 'android') {
				if (parseInt(sysInfo.osVersion) >= 10) {
					this.showThemeBtn = true
				}
			} else {
				if (parseInt(sysInfo.osVersion) >= 13) {
					this.showThemeBtn = true
				}
			}

			setTimeout(() => {
				this.set = true
			}, 1000)
		},
		methods: {
			toServer() {
				if (!uni.getStorageSync('token')) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
				uni.$u.route({
					url: '/pages/webview/webview',
					params: {
						url: this.utils.serviceURL
					}
				})
			},
			toNext(item, index) {
				if (item.hasLogin) {
					if (this.isLogin) uni.$u.route(item.url)
					else uni.$u.route('/pages/login/login')
				} else {
					if (item.params) {
						uni.$u.route({
							url: item.url,
							params: {
								url: item.params
							}
						})
					} else uni.$u.route(item.url)
				}


				// return
				// if (index == 0 || index == 1) {
				// 	uni.$u.route({
				// 		url: this.isLogin ? item.url : '/pages/login/login'
				// 	})
				// } else {
				// 	if (index == 2) {
				// 		uni.$u.route({
				// 			url: '/pages/webview/webview',
				// 			params: {
				// 				url: this.utils.helpCenterURL
				// 			}
				// 		})
				// 		return
				// 	}
				// 	uni.$u.route(item.url)
				// }
			},
			changeTheme() {
				// #ifdef APP-PLUS
				plus.nativeUI.setUiStyle(uni.getSystemInfoSync().theme == 'light' ? 'dark' : 'light');
				uni.setStorageSync('theme', uni.getSystemInfoSync().theme)
				this.$store.commit('onThemeChange', uni.getSystemInfoSync().theme)
				// #endif
			},
			exit() {
				uni.showLoading({
					mask: true
				})
				signOut().then(() => {
					uni.removeStorageSync('token')
					uni.removeStorageSync('userInfo')
					uni.showToast({
						icon: 'success'
					})
					this.userInfo = {
						uid: 0,
						nickName: this.$t('请先登录')
					}
					this.isLogin = false
					// uni.navigateBack()
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
				if (!this.isLogin) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
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
		margin-top: 300rpx;
		line-height: 90rpx;
		background: #EEF0F2;
		text-align: center;
		border-radius: 8rpx;
		/* #ifdef H5 */
		position: fixed;
		bottom: 60rpx;
		width: 690rpx;
		/* #endif */
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
					padding-bottom: 10rpx;
					display: flex;
					align-items: center;

					>view {
						margin-left: 12rpx;
					}
				}
			}
		}
	}

	@media (prefers-color-scheme: light) {
		.u-navbar {
			&.set {
				::v-deep {
					.u-navbar__content,
					.u-status-bar {
						background-color: #fff !important;
					}
				}
			}
		}
	}

	@media (prefers-color-scheme: dark) {

		::v-deep {
			.u-alert__content__desc {
				color: #FE9205;
			}

			.u-alert--warning--light {
				background-color: #29313C !important;
			}

			.u-navbar__content,
			.u-status-bar {
				background-color: #1F282F !important;
			}
		}

		.nav {
			.left {
				text {
					color: #FFFFFF !important;
				}
			}
		}

		.user-box {
			.info {
				.name {
					color: #fff !important;
				}
			}
		}

		.tip .box {
			background: #29313C;
		}

		.btn {
			background: #4A525D;
		}
	}
</style>
