<script>
	import Vue from 'vue'
	import {
		apiURL,
		wsURL
	} from '@/config'
	import {
		title
	} from 'process'
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
		methods: {
			toNext(data) {
				let pages = getCurrentPages();
				if (pages[pages.length - 1].$page.fullPath ==
					'/pages/noticeDetail/noticeDetail') {
					return
				}
				uni.setStorageSync('noticeDetail', data.maintenance[0])
				uni.reLaunch({
					url: '/pages/noticeDetail/noticeDetail'
				})
				// uni.showModal({
				// 	title: data.maintenance[0].title,
				// 	content: data.maintenance[0].content.replace(/<[^<>]+>/g, '').replace(/&nbsp;/ig, ''),
				// 	showCancel: false,
				// 	confirmText: this.$t('维护中'),
				// 	confirmColor: '#ccc',
				// 	success: (res) => {
				// 		if (res.confirm) {
				// 			this.isConfirm = false
				// 			this.Modal(data)
				// 		}
				// 	}
				// })
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
									let pages = getCurrentPages();
									if (pages[pages.length - 1].$page.fullPath ==
										'/pages/noticeDetail/noticeDetail') {
										uni.switchTab({
											url: '/pages/index/index'
										})
									}
									return
								}
								// uni.setStorageSync('currentDayFlag', data.maintenance[0].currentDayFlag)
								this.toNext(data)
							}
						}
					}
				})
			},
			test() {
				console.log(1);
			}
		},
		onShow: function() {
			console.log('App Show')

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
		},
		onUnload() {
			clearInterval(this.timer)
			uni.onSocketOpen(function() {
				uni.closeSocket();
			});
		},
		onHide: function() {
			clearInterval(this.timer)
			uni.onSocketOpen(function() {
				uni.closeSocket();
			});
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

	@media (prefers-color-scheme: dark) {
		page {
			background-color: #1F282F;
		}
	}
</style>
