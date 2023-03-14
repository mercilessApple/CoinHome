<template>
	<view class="container">
		<view class="upper">
			<u-navbar bgColor="transparent" leftIcon="" placeholder :bgColor="theme == 'light' ? '#F6F6F6' : '#171E28'">
				<view class="u-nav-slot" slot="center">
					<view class="search">
						<u-search v-model="key" :color="theme == 'light' ? '' :'#fff'" @change="onSearchChange"
							height="64rpx" :bgColor="theme == 'light' ? '#EBECF0' : '#343A46'" placeholder=""
							:showAction="false">
						</u-search>
					</view>
				</view>
			</u-navbar>
			<view class="tabs-box">
				<u-tabs :current="curNow" lineWidth="64rpx" itemStyle="height:80rpx" lineColor="#FEFA05" :activeStyle="{
			 color:theme == 'light' ? '#22222C' : '#fff'
		 }" :inactiveStyle="{
			 color:'#838B93'
		 }" :list="uTabs" lineHeight="8rpx" @change="onTabsChange"></u-tabs>
			</view>
		</view>
		<view class="context">
			<!-- <mescroll-body ref="mescrollRef" @init="mescrollInit" top="0" bottom="0" :down="downOption"
				@down="downCallback" @up="upCallback"> -->
			<view class="list-tab" v-if="curNow === 1">
				<view class="item" :class="{
						active:index === listTabIndex
					}" v-for="(item,index) in listTab" @click="onListTabChange(index)" :key="index">{{ item }}
				</view>
			</view>
			<view class="list" :style="{
					'margin-top':curNow === 1 ? '20rpx':'40rpx'
				}">
				<view>

					<view class="float-box" v-if="list == '' || loading">
						<u-loading-icon mode="circle" :show="loading"></u-loading-icon>
						<u-empty :show="list == '' && !loading" :text="$t('暂无数据')"></u-empty>
					</view>

					<view class="name">{{ $t('名称/成交量') }}</view>
					<view class="column">
						<view class="val" @click="$u.route({
								url:'/pages/kLine/kLine',
								params:{
									coinMarket:item.coinMarketText
								}
							})" v-for="(item,index) in list" :key="index">
							<view class="val-box">
								<view class="unit">{{ item.coinMarket[0] }}
									<text>/{{ item.coinMarket[1] }}</text>
								</view>
								<view class="volume">
									{{ $t('成交额') }} {{ item.turnover }}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view>
					<view class="name">{{ $t('最新价格') }}</view>
					<view class="column">
						<view class="val" @click="$u.route({
								url:'/pages/kLine/kLine',
								params:{
									coinMarket:item.coinMarketText
								}
							})" v-for="(item,index) in list" :key="index">
							<view class="box">
								<view :class="{
									green:item.rangeAbility >= 0 && item.onDealing === 1,
									red:item.rangeAbility < 0 && item.onDealing === 1,
									gray:item.onDealing !== 1
								}">{{ item.lastPrice }}
								</view>
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
									coinMarket:item.coinMarketText
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
			<!-- </mescroll-body> -->
		</view>
	</view>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import {
		getOptionalMarket,
		getTickerByPartitionMarket,
		queryMarketPartition
	} from "@/config/api"

	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				listTabIndex: 0,
				listTab: [],
				uTabs: [{
						name: this.$t("自选"),
					},
					{
						name: this.$t("现货"),
					}
				],
				downOption: {
					auto: false, //是否在初始化完毕之后自动执行下拉回调callback; 默认true
				},
				list: [],
				curNow: 1,
				key: '',
				loading: true
			};
		},
		onLoad() {

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
					this.list[index].turnover = Number(data.turnover)
				}
			}
		},
		onShow() {
			queryMarketPartition().then(e => {
				this.listTab = e
				this.getList(res => {
					this.list = res
				}, 'onshow')
			})
		},
		methods: {
			onSearchChange(e) {
				if (e == '') {
					this.list = this.oriList
					return
				}
				let list = JSON.parse(JSON.stringify(this.oriList))
				this.list = this.utils.fuzzyQuery(list, e, 'coinMarketText')
			},

			onListTabChange(index) {
				this.listTabIndex = index
				this.list = []
			},
			onTabsChange({
				index
			}) {
				if (this.curNow === index) {
					return
				}
				this.curNow = index
				this.list = []
				this.getList(res => {
					this.list = res
				})
			},
			async getList(fn = () => {}, scene = "") {
				if (scene == '') this.loading = true
				let res;
				if (this.curNow === 0) res = await getOptionalMarket()
				else if (this.curNow === 1) res =
					await getTickerByPartitionMarket({
						partition: this.listTab[this.listTabIndex]
					})

				res.forEach(item => {
					if (item.coinMarket) {
						item.coinMarketText = item.coinMarket
						item.coinMarket = item.coinMarket.split('/')
					}
				})
				this.oriList = res || []
				this.loading = false
				fn(res)
			},
		},
	}
</script>

<style lang="scss">
	page {
		background-color: #F6F6F6;
	}

	.list-tab {
		display: flex;
		margin-top: 20rpx;
		height: 80rpx;
		align-items: center;

		>view {
			margin-left: 40rpx;
			font-weight: 500;
			color: #838B93;
			font-size: 28rpx;
			padding: 0 14rpx;
			border-radius: 4rpx;
			line-height: 44rpx;
			height: 44rpx;

			&.active {
				background: #EAEBEF;
				color: #22222C;
			}
		}
	}

	::v-deep {
		.mescroll-bottombar {
			height: 0 !important;
		}

		.u-tabs__wrapper__nav__item__text {
			font-size: 32rpx;
			font-weight: 500
		}

		.u-tabs__wrapper__nav__line {
			bottom: 0 !important;
		}

		.u-tabs__wrapper__nav__item {
			padding: 0 10rpx;
			/* #ifdef H5 */

			/* #endif */
		}

		.u-nav-slot {
			width: 100%;
		}
	}

	.tabs-box {
		padding: 0 30rpx;
	}

	.container {
		height: 100vh;
		/* #ifdef H5 */
		height: 100vh;
		height: calc(100vh - 50px);
		/* #endif */
		display: flex;
		flex-direction: column
	}

	.context {
		flex: 1;
		background-color: #fff;
		overflow: hidden;
		border-radius: 60rpx 60rpx 0 0;
		display: flex;
		flex-direction: column;
	}

	.list {
		padding: 0 30rpx;
		display: flex;
		// margin-top: 40rpx;
		// height: calc(100vh - (195px + var(--status-bar-height)));
		flex: 1;
		overflow: auto;
		position: relative;

		.float-box {
			position: absolute;
			top: 200rpx;
			left: 50%;
			transform: translateX(-50%);
		}

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
					display: flex;
					align-items: center;
					height: 108rpx;

					.unit {
						color: #1F252B;
						font-size: 32rpx;

						text {
							color: #888B9A;
							font-size: 24rpx;
						}
					}

					.volume {

						color: #8C8A97;
						font-size: 24rpx;
					}
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

							&.gray {
								color: #929BA2;
							}

							&.green {
								color: #2DBE87;
							}

							&.red {
								color: #F5475E;
							}
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

	.search {
		margin: 0 30rpx;
	}

	@media (prefers-color-scheme: dark) {
		page {
			background-color: #171E28;
		}

		.list>view:first-child .val .unit {
			color: #fff;
		}

		.list-tab>view.active {

			background: #434A5A;
			color: #fff;
		}

		.context {
			background-color: #1F282F;
		}
	}
</style>
