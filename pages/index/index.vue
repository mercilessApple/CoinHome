<template>
	<view class="content">
		<u-navbar :bgColor="inverseParams('#FFFFFF','#1F282F')" leftIcon="">
			<view slot="left">
				<u-image @click="toUserCenter"
					:src="require(theme == 'light' ? '@/static/icon4.png' : '@/static/icon37.png')" width="48rpx"
					height="48rpx"></u-image>
			</view>

			<view class="u-nav-slot" slot="right">
				<view class="search" :style="{
					'width':open ? '450rpx':'256rpx'
				}">
					<u-search v-model="key" :color="theme == 'light' ? '' :'#fff'" @change="onSearchChange"
						placeholder="" bgColor="#F4F5F7" :showAction="false"></u-search>
				</view>
				<view class="icon" @click="$u.route({
						url:'/pages/notice/notice'
					})">
					<u-image src="@/static/icon6.png" width="48rpx" height="48rpx"></u-image>
					<view class="badge">
						<u-badge :show="false" absolute :offset="[0,0]" color="#0D0D0D" bgColor="#FEFA05" shape="circle"
							:value="badgeNumber"></u-badge>
					</view>
				</view>
				<view class="icon" @click="toServer">
					<u-image src="@/static/icon5.png" width="48rpx" height="48rpx"></u-image>
				</view>
			</view>
		</u-navbar>

		<view class="context">
			<mescroll-body ref="mescrollRef" @init="mescrollInit" :top="refreshHeight" bottom="0" :down="downOption"
				@down="downCallback" @up="upCallback">
				<u-gap height="40rpx"></u-gap>
				<!-- <image style="width: 100rpx;height: 100rpx;" :src="theme == 'light' ? '/static/icon4.png' : '/static/icon37.png'"></image> -->

				<u-swiper :loading="banner == ''" keyName="imgUrl" bgColor="transparent" :list="banner" height="260rpx"
					circular></u-swiper>
				<view class="notice" v-if="notices != ''">
					<u-notice-bar @click="$u.route({
						url:'/pages/notice/notice',
						params:{
							type:1
						}
					})" color="#969AA6" icon="" bgColor="transparent" :text="notices[0].title">
					</u-notice-bar>
					<u-image :src="theme == 'light' ? require('@/static/icon7.png') : require('@/static/icon38.png')"
						width="60rpx" height="48rpx"></u-image>
				</view>
				<view class="tab-bar">
					<view v-for="(item,index) in tabBarList" :key="index" @click="toUrl(item,index)">
						<view class="icon">
							<u-image :src="theme == 'light' ? item.icon : item.darkIcon" width="88rpx" height="88rpx">
							</u-image>
						</view>
						<view class="tip">{{ item.name }}</view>
					</view>
				</view>
				<u-gap height="40rpx"></u-gap>
				<view class="task" @click="$u.route('/pages/taskCenter/taskCenter')">
					<u-image :src="theme == 'light' ? require('@/static/icon52.png') : require('@/static/icon53.png')"
						height="136rpx" width="100%"></u-image>
				</view>
				<view class="subsection">
					<view :class="{
					'active':curNow == index
				}" @click="onSubsectionChange(index)" v-for="(item,index) in subsection" :key="index">
						{{ item }}
					</view>
				</view>
				<view class="list">
					<view>
						<view class="name">{{ $t('名称') }}</view>
						<view class="column">
							<view class="val" @click="$u.route({
								url:'/pages/kLine/kLine',
								params:{
									coinMarket:item.coinMarket
								}
							})" v-for="(item,index) in list" :key="index">{{ item.coinMarket }}
							</view>
						</view>
					</view>
					<view>
						<view class="name">{{ $t('最新价格') }}</view>
						<view class="column">
							<view class="val" @click="$u.route({
								url:'/pages/kLine/kLine',
								params:{
									coinMarket:item.coinMarket
								}
							})" v-for="(item,index) in list" :key="index">
								<view class="box">
									<view>{{ item.lastPrice }}</view>
									<view>¥{{ item.lastPriceCny }}</view>
								</view>
							</view>
						</view>
					</view>
					<view>
						<view class="name">{{ $t('24h涨跌幅') }}</view>
						<view class="column">
							<view class="val" @click="$u.route({
								url:'/pages/kLine/kLine',
								params:{
									coinMarket:item.coinMarket
								}
							})" v-for="(item,index) in list" :key="index">
								<view class="btn" :class="{
									green:item.rangeAbility >= 0 && item.onDealing === 1,
									red:item.rangeAbility < 0 && item.onDealing === 1,
									gray:item.onDealing !== 1
								}">{{ item.rangeAbility >= 0 ? '+' : '' }}{{ utils.decimal(item.rangeAbility * 100, 2) }}%
								</view>
							</view>
						</view>
					</view>
				</view>
			</mescroll-body>
		</view>
	</view>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import {
		banners,
		announcements,
		getOptionalMarket,
		getTickerByPartitionMarket
	} from "@/config/api"
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				notices: [],
				curNow: 1,
				subsection: [
					this.$t("自选"),
					this.$t("热门"),
					this.$t("涨幅榜"),
					this.$t("跌幅榜")
				],
				banner: [],
				open: false,
				key: '',
				badgeNumber: 1,
				downOption: {
					auto: false, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
				},
				tabBarList: [{
						name: this.$t('充币'),
						icon: require("@/static/icon8.png"),
						darkIcon: require("@/static/icon39.png"),
						url: '/pages/rechargeDetail/rechargeDetail',
						needLog: true
					},
					{
						name: this.$t('交易'),
						icon: require("@/static/icon9.png"),
						darkIcon: require("@/static/icon40.png"),
						url: '/pages/transaction/transaction',
						isTabBar: true
					},
					// {
					// 	name: this.$t('转账'),
					// 	icon: require("@/static/icon10.png"),
					// 	darkIcon: require("@/static/icon41.png")
					// },
					{
						name: this.$t('任务中心'),
						icon: require("@/static/icon49.png"),
						darkIcon: require("@/static/icon51.png"),
						url: '/pages/taskCenter/taskCenter'
					},
					{
						name: this.$t('邀请'),
						icon: require("@/static/icon50.png"),
						darkIcon: require("@/static/icon54.png"),
						url: '/pages/invite/invite',
						needLog: true
					},
					{
						name: this.$t('CERT'),
						icon: require("@/static/icon11.png"),
						darkIcon: require("@/static/icon42.png"),
						url: '/pages/authentication/authentication',
						needLog: true
					}
				],
				refreshHeight: (uni.getSystemInfoSync().statusBarHeight + 44) + "px",
				list: [],
			}
		},
		onLoad() {
			this.init()
		},
		onHide() {

		},
		onUnload() {

		},
		computed: {
			alphaMarketTicker() {
				return this.$store.state['alpha-market-ticker']
			}
		},
		watch: {
			alphaMarketTicker(data, oldValue) {
				if (this.list != '') {
					const index = this.list.findIndex(item => item.coinId == data.coinId)
					if (index == -1) return
					this.list[index].lastPrice = Number(data.lastPrice)
					this.list[index].rangeAbility = Number(data.rangeAbility)
					this.list[index].lastPriceCny = Number(data.lastPriceCny)
				}
			}
		},
		onShow() {
			
		},
		methods: {
			onSearchChange(e) {
				if (e == '') {
					this.open = false
					this.list = this.oriList
				} else {
					this.open = true
					let list = JSON.parse(JSON.stringify(this.oriList))
					this.list = this.utils.fuzzyQuery(list, e, 'coinMarket')
				}
			},

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
			toUrl(item, index) {

				if (item.needLog) {
					const isToken = uni.getStorageSync('token')
					if (isToken) uni.$u.route(item.url)
					else uni.$u.route('/pages/login/login')
				} else {
					if (item.isTabBar) {
						uni.switchTab({
							url: item.url
						})
					} else uni.$u.route(item.url)
				}
				// return
				// if (index == 0 || index == 3) {
				// 	if (uni.getStorageSync('token')) {
				// 		let url
				// 		if (index == 0) url = '/pages/recharge/recharge'
				// 		else if (index == 3) url = '/pages/authentication/authentication'
				// 		uni.navigateTo({
				// 			url
				// 		})
				// 	} else {
				// 		uni.navigateTo({
				// 			url: '/pages/login/login'
				// 		})
				// 	}

				// }
				// if (index == 1) {
				// 	uni.switchTab({
				// 		url: '/pages/transaction/transaction'
				// 	})
				// }
				// if (index == 2) {
				// 	uni.switchTab({
				// 		url: '/pages/assets/assets'
				// 	})
				// }
			},
			toUserCenter() {
				uni.navigateTo({
					url: "/pages/userCenter/userCenter",
					"animationType": "slide-in-left"
				})
			},
			onSubsectionChange(index) {
				if (this.curNow === index) {
					return
				}
				this.curNow = index
				this.list = []
				this.mescroll.resetUpScroll() // 再刷新列表数据
			},
			async getList(fn = () => {}) {
				let res;
				if (this.curNow === 0) res = await getOptionalMarket()
				else if (this.curNow === 1 || this.curNow === 2 || this.curNow === 3) res =
					await getTickerByPartitionMarket({
						partition: "USDT"
					})
				if (this.curNow === 2) {
					let addList = []
					res.forEach(item => {
						if (item.rangeAbility >= 0 && item.onDealing === 1) {
							addList.unshift(item)
						}else{
							addList.push(item)
						}
					})
					addList.sort((a, b) => {
						return b.rangeAbility - a.rangeAbility
					})
					res = addList
				}

				if (this.curNow === 3) {
					let addList = []
					res.forEach(item => {
						if (item.rangeAbility < 0 && item.onDealing === 1) {
							addList.unshift(item)
						}else{
							addList.push(item)
						}
					})
					addList.sort((a, b) => {
						return a.rangeAbility - b.rangeAbility
					})
					res = addList
				}
				this.oriList = res || []
				fn(res)
			},
			init() {
				banners({
					bannerType: 2
				}).then(e => this.banner = e == '' ? [{
					"bannerName": "",
					"jumpUrl": "",
					"imgUrl": require("@/static/icon12.png")
				}] : e)

				announcements({
					pageNum: 1,
					pageSize: 1,
					type: 0
				}).then(e => this.notices = e)
			},
			/*下拉刷新的回调 */
			downCallback() {
				this.init()
				this.getList(res => {
					this.list = res
				})
				setTimeout(() => {
					this.mescroll.endSuccess()
				}, 1000)
			},
			// /*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				this.getList(res => {
					this.list = res
					this.mescroll.endSuccess(res.length, false)
				})
			}
		},
	}
</script>

<style lang="scss">
	.task {
		padding: 0 30rpx;
		margin-bottom: 36rpx;
	}

	.list {
		padding: 0 30rpx;
		display: flex;
		margin-top: 10rpx;

		>view {
			.val {
				margin-top: 12rpx;
			}

			.name {
				color: #BAB9BE;
				font-size: 24rpx;
				padding-bottom: 8rpx;
			}

			&:first-child {
				width: 50%;

				.val {
					font-weight: 500;
					color: #1F252B;
					line-height: 108rpx;
					font-size: 32rpx;
				}
			}

			&:nth-child(2) {
				width: 25%;
				text-align: right;
				padding-right: 50rpx;

				.val {
					display: flex;
					align-items: center;
					justify-content: flex-end;
					height: 108rpx;

					view {
						&:first-child {
							font-weight: 500;
							color: #1F252B;
							font-size: 32rpx;
						}

						&:last-child {

							color: #8C8A97;
							font-size: 24rpx;
						}
					}
				}
			}

			&:nth-child(3) {
				width: 25%;
				text-align: right;

				.val {
					display: flex;
					align-items: center;
					height: 108rpx;

					.btn {
						width: 156rpx;
						line-height: 68rpx;
						color: #FFFFFF;
						margin-left: auto;
						text-align: center;
						border-radius: 8rpx;
						font-size: 28rpx;

						&.gray {
							background-color: #929BA2;
						}

						&.green {
							background-color: #2DBE87;
						}

						&.red {
							background-color: #F5475E;
						}
					}
				}
			}
		}
	}

	.subsection {
		display: flex;

		>view {
			margin-left: 40rpx;
			font-weight: 500;
			color: #838B93;
			font-size: 28rpx;
			padding: 8rpx 14rpx;
			border-radius: 4rpx;

			&.active {
				background: #EAEBEF;
				color: #22222C;
			}
		}
	}

	.tab-bar {
		display: flex;
		justify-content: space-between;
		padding: 0 60rpx;
		padding-top: 30rpx;

		.icon {
			width: 88rpx;
			height: 88rpx;
			margin: 0 auto;
		}

		>view {
			text-align: center;
		}

		.tip {
			color: #242329;
			font-size: 24rpx;
			margin-top: 20rpx;
		}
	}

	.notice {
		padding: 0 30rpx;
		display: flex;
		margin-top: 10rpx;
		align-items: center;
	}

	::v-deep {
		.u-notice-bar {
			padding-left: 0 !important;
		}

		.u-swiper__wrapper__item {
			padding: 0 30rpx;
			box-sizing: border-box;
		}

		.u-badge {
			font-size: 16rpx !important;
		}

		.mescroll-bottombar {
			height: 0 !important;
		}
	}

	.u-nav-slot {
		display: flex;
		align-items: center;

		.icon {
			margin-left: 30rpx;
			position: relative;
		}
	}

	.search {
		width: 256rpx;
		transition: width .3s;
		padding-right: 30rpx;
	}

	@media (prefers-color-scheme: dark) {
		page {
			::v-deep {

				.u-search__content,
				.u-search__content__input {
					background-color: #2C303C !important;
				}
			}

		}

		.list {
			>view {
				&:first-child {
					.val {
						color: #fff;
					}
				}

				&:nth-child(2) {
					.box {
						view {
							&:first-child {
								color: #FFFFFF;
							}
						}
					}
				}
			}
		}

		.tab-bar {
			.tip {

				color: #FFFFFF;
			}
		}

		.subsection {
			.active {
				color: #FFFFFF !important;
				background: #434B58 !important;
			}
		}
	}
</style>
