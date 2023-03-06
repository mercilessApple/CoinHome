<script>
	import Vue from 'vue'
	import {
		apiURL,
		wsURL
	} from '@/config'

	export default {
		onLaunch: function() {
			console.log('App Launch')
			// #ifdef APP-PLUS
			if (uni.getStorageSync('theme')) {
				if (uni.getSystemInfoSync().theme == uni.getStorageSync('theme')) return
				plus.nativeUI.setUiStyle(uni.getStorageSync('theme'));
			}
			// #endif
		},
		onError: (e) => {
			console.log(e);
		},
		methods: {
			toNext(data) {
				//#ifdef APP-PLUS
				uni.navigateTo({
					url: '/pages/popup/popup'
				})
				//#endif

				//#ifdef H5
				let pages = getCurrentPages();
				if (pages[pages.length - 1].$page.fullPath ==
					'/pages/noticeDetail/noticeDetail') {
					return
				}
				uni.setStorageSync('noticeDetail', data.maintenance[0])
				uni.reLaunch({
					url: '/pages/noticeDetail/noticeDetail'
				})
				//#endif

			},
			checkNotice() {
				uni.request({
					url: apiURL + '/api/user/announcements/windows',
					method: "POST",
					data: {
						type: 1
					},
					success: (e) => {
						if (e.statusCode == 200) {
							if (e.data.code == 1) {
								const {
									data
								} = e.data
								if (data.maintenance == '') {
									//#ifdef H5
									let pages = getCurrentPages();
									if (pages[pages.length - 1].$page.fullPath ==
										'/pages/noticeDetail/noticeDetail') {
										uni.switchTab({
											url: '/pages/index/index'
										})
									}
									//#endif
									return
								}
								this.toNext(data)
							}
						}
					}
				})
			},
			createScoket() {
				uni.connectSocket({
					url: wsURL,
				});

				Vue.prototype.$onSocketMessage = (fn) => {
					uni.onSocketOpen(() => {
						uni.sendSocketMessage({
							data: '{"cmd":"sub","data":{},"id":"' + uni.$u.guid(20) +
								'","sendMsgSuccess":true,"topic":"alpha-market-ticker"}'
						})

						// uni.sendSocketMessage({
						// 	data: '{"cmd":"sub","data":{},"id":"' + uni.$u.guid(20) +
						// 		'","sendMsgSuccess":true,"topic":"alpha-user-center-announcement"}'
						// })

						clearInterval(this.timer)
						// 维持心跳活动
						this.timer = setInterval(() => {
							uni.sendSocketMessage({
								data: JSON.stringify({
									ping: new Date().valueOf()
								})
							})
						}, 50000)
					});
					uni.onSocketMessage((message) => {
						const response = JSON.parse(message.data)
						const {
							data
						} = response
						if (response.ping) {
							return
						}
						fn(data)
					});
				}

				// if (uni.getStorageSync('currentDayFlag')) {
				// 	this.checkNotice()
				// 	return
				// }

				this.checkNotice()
			}
		},
		onShow: function() {
			console.log('App Show')
			this.createScoket()
		},
		onUnload() {
			clearInterval(this.timer)
			uni.closeSocket();
		},
		onHide: function() {
			clearInterval(this.timer)
			uni.closeSocket();
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";
	@import "@/uni_modules/mescroll-uni/components/mescroll-uni/components/mescroll-up.css";

	page {
		background-color: #fff;
		box-sizing: border-box;
		font-family: -apple-system, Helvetica Neue, Helvetica, Arial, PingFang SC, Hiragino Sans GB, WenQuanYi Micro Hei, Microsoft Yahei, sans-serif;
	}

	::v-deep {
		.input {
			background-color: transparent;
		}
	}
input{
  caret-color: #FEFA05;
}
	@media (prefers-color-scheme: dark) {
		page {
			background-color: #1F282F;
		}

		::v-deep {
			.input {
				/* #ifdef H5 */
				color: #fff;
				/* #endif */
			}
		}
	}
</style>
