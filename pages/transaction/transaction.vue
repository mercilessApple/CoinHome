<template>
	<view>
		<u-navbar placeholder @rightClick="rightClick" bgColor="transparent">
			<view class="u-nav-slot" slot="left">
				<view class="nav-coin" @click="show = true">
					<u-image v-if="theme == 'light'" src="/static/icon32.png" width="48rpx" height="48rpx"></u-image>
					<u-image v-else src="/static/icon44.png" width="48rpx" height="48rpx"></u-image>
					<text class="name" v-if="marketStatus == 'loading'">{{ marketItem.coinMarket[0] }}</text>
					<text class="name" v-else>{{ marketItem.coinMarket[0] }}/{{ marketItem.coinMarket[1] }}</text>
					<text class="proportion" :class="{
						add:marketItem.rangeAbility >= 0 && marketItem.onDealing === 1,
						err:marketItem.rangeAbility < 0 && marketItem.onDealing === 1,
					}">
						{{ marketItem.rangeAbility >= 0 ? '+' : '' }}{{ utils.decimal(marketItem.rangeAbility * 100, 2) + '%' }}
					</text>
				</view>
			</view>
			<view class="u-nav-slot" slot="right">
				<u-image width="48rpx" height="48rpx" src="/static/icon33.png"></u-image>
			</view>
		</u-navbar>
		<view class="content">
			<view class="upper">
				<view class="left">
					<view class="bar">
						<view @click="onBarIndexChange(0)" class="item" :class="{
							active:barIndex == 0
						}">{{ $t('买入') }}
							<view class="triangle" :style="{
								'border-left-color':barIndex == 1 ? '#F5475E' : '#2EBD87'
							}"></view>
						</view>
						<view @click="onBarIndexChange(1)" class="item" :class="{
							active:barIndex == 1
						}">{{ $t('卖出') }}
							<view class="triangle" :style="{
								'border-left-color':barIndex == 1 ? '#F5475E' : '#2EBD87'
							}"></view>
						</view>
					</view>
					<view class="select" @click="showMoreSelect = !showMoreSelect">
						{{ $t(orderType == 1 ? '限价委托' : '市价委托') }}
						<view class="icon">
							<u-icon color="#929BA2" size="20rpx" name="arrow-down-fill"></u-icon>
						</view>

						<view class="down-box" v-show="showMoreSelect">
							<view @click.stop="selectItem(1)">{{ $t('限价委托') }}</view>
							<view @click.stop="selectItem(2)">{{ $t('市价委托') }}</view>
						</view>
					</view>
					<u-gap height="16rpx"></u-gap>
					<view class="number-box">
						<!-- <block v-if="oriMarketList != ''"> -->
						<!-- <u-number-box :color="theme == 'light' ? '#323233' : '#fff'"
								:bgColor="theme == 'light' ? '#f6f6f6' : '#29313C'" inputWidth="286rpx"
								v-model="oriMarketList[marketItemIndex].price">
							</u-number-box> -->


						<view @click="onPriceChange('minus')" class="icon">
							<u-icon color="rgb(96, 98, 102)" bold name="minus"></u-icon>
						</view>
						<block v-if="oriMarketList != ''">
							<u-input :color="inverseParams('#000' , '#fff')"
								v-model="oriMarketList[marketItemIndex].price" inputAlign="center" border="none"
								type="digit">
							</u-input>
						</block>
						<block v-else>
							<view style="flex: 1;"></view>
						</block>
						<view @click="onPriceChange('plus')" class="icon">
							<u-icon bold name="plus"></u-icon>
						</view>
						<!-- </block> -->
					</view>
					<u-gap height="16rpx"></u-gap>
					<view class="count-box">
						<!-- <u-number-box inputType="digit" :color="inverseParams('#323233' ,'#fff')"
							:placeholder="`${$t('数量')}(${marketItem.coinMarket[0]})`"
							:bgColor="inverseParams('#f6f6f6','#29313C')" inputWidth="286rpx" v-model="count">
						</u-number-box> -->
						<view @click="onCountChange('minus')" class="icon">
							<u-icon color="rgb(96, 98, 102)" bold name="minus"></u-icon>
						</view>
						<u-input :color="inverseParams('#000' , '#fff')" @blur="onCountBlur" v-model="count"
							inputAlign="center" border="none" type="digit"
							:placeholder="`${$t('数量')}${marketStatus == 'loading' ? '' : marketItem.coinMarket[0]}`">
						</u-input>
						<view @click="onCountChange('plus')" class="icon">
							<u-icon bold name="plus"></u-icon>
						</view>
					</view>
					<u-gap height="16rpx"></u-gap>

					<view class="block">
						<view @click="chooseProportion(item,index)" :class="{
							'active':blockIndex == index
						}" v-for="(item,index) in block" :key="index">{{ item.name }}
						</view>
					</view>
					<u-gap height="16rpx"></u-gap>

					<view class="total-amount">
						<block v-if="oriMarketList != ''">
							<u-input readonly
								:value="utils.decimal(count * oriMarketList[marketItemIndex].price,oriMarketList[marketItemIndex].amountPrecision) == 0 ? '' : utils.decimal(count * oriMarketList[marketItemIndex].price,oriMarketList[marketItemIndex].amountPrecision)"
								:color="theme == 'light' ? '#303103' : '#fff'" type="number" inputAlign="center"
								border="none" :placeholder="`${$t('总额')}(${marketItem.coinMarket[1]})`">
							</u-input>
						</block>
					</view>
					<u-gap height="30rpx"></u-gap>

					<view class="usable">
						<view class="tip">
							<view>{{ $t('可用') }}</view>
							<view v-if="marketStatus == 'loading'">0</view>
							<view v-else>
								{{ utils.decimal(getAccount().amount,5) }}
								{{ marketItem.coinMarket[barIndex == 0 ? 1 : 0] }}
							</view>
						</view>
					</view>
					<view style="flex: 1;"></view>
					<view @click="submit" v-if="isLogin" class="btn" :style="{
						'background':barIndex == 1 ? '#F5475E' : '#2EBD87'
					}">
						{{ barIndex == 0 ? $t('买入') : $t('卖出') }}{{ marketStatus == 'loading' ? '' : marketItem.coinMarket[0] }}
					</view>
					<view @click="$u.route('/pages/login/login')" v-else class="btn" :style="{
						'background':barIndex == 1 ? '#F5475E' : '#2EBD87'
					}">{{ $t('登录') }}
					</view>
				</view>
				<view class="right">
					<view class="lab-box">
						<view class="lab">
							<view>{{ $t('价格') }}</view>
							<text v-if="!marketItem.loading">({{ marketItem.coinMarket[1] }})</text>
						</view>
						<view class="lab">
							<view>{{ $t('数量') }}</view>
							<text v-if="!marketItem.loading">({{ marketItem.coinMarket[0] }})</text>
						</view>
					</view>
					<view class="price-box">
						<view>
							<view @click="oriMarketList[marketItemIndex].price = item.trustPrice"
								v-for="(item,index) in marketDeeps.asks" :key="index" class="price">
								{{ utils.decimal(item.trustPrice, 4) }}
							</view>
						</view>
						<view>
							<view @click="oriMarketList[marketItemIndex].price = item.trustPrice"
								v-for="(item,index) in marketDeeps.asks" :key="index" class="price">
								{{ utils.decimal(item.cumulativeCommissionQuantity, 4) }}
							</view>
						</view>
					</view>
					<view class="area">
						<view>{{ utils.decimal(marketDeeps.lastPrice, 4) || 0 }}</view>
						<view>≈ ¥ {{ utils.decimal(marketDeeps.lastPriceCny, 4) || 0 }}</view>
					</view>
					<view class="price-box bottom">
						<view>
							<view @click="oriMarketList[marketItemIndex].price = item.trustPrice"
								v-for="(item,index) in marketDeeps.bids" :key="index" class="price">
								{{ utils.decimal(item.trustPrice, 4) }}
							</view>
						</view>
						<view>
							<view @click="oriMarketList[marketItemIndex].price = item.trustPrice"
								v-for="(item,index) in marketDeeps.bids" :key="index" class="price">
								{{ utils.decimal(item.cumulativeCommissionQuantity, 4) }}
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="lower">
				<view class="tab u-border-bottom">
					<u-tabs :activeStyle="{
						'color':theme == 'light' ? '#303133' : '#fff'
					}" lineHeight="8rpx" lineWidth="60rpx" lineColor="#FEFA05" :list="tabs">
					</u-tabs>
					<view class="icon" @click="$u.route(isLogin ? '/pages/order/order' : '/pages/login/login')">
						<u-image width="40rpx" height="40rpx" src="/static/icon35.png"></u-image>
					</view>
				</view>

				<view class="list">
					<view :class="{
						'u-border-bottom':index < (userEntrustList.length - 1)
					}" v-for="(item,index) in userEntrustList" :key="index" class="item" @click="toDetail(item)">
						<view class="left">
							<view>
								<view class="business">
									<text :class="{
										err:item.type == 2
									}">{{ item.type == 2 ? $t('卖出') : $t('买入') }}
									</text>
									{{ item.coinMarket[0] }}
								</view>
								<view>
									<view>{{ $t('价格') }}[{{ item.coinMarket[1] }}]</view>
									<view>{{ item.price }}</view>
								</view>
							</view>
							<view>
								<view class="date">{{ $moment(item.createTime * 1000).format('HH:mm MM/DD') }}</view>
								<view class="info">
									<view>{{ $t('数量') }}[{{ item.coinMarket[1] }}]</view>
									<view>{{ utils.decimal(item.remainingNumber, 5) }}</view>
								</view>
							</view>
						</view>
						<view class="right">
							<view class="right-status btn" @click.stop="revoke(item)"
								v-if="item.orderStatus == 0 || item.orderStatus == 2">{{ $t('撤销') }}
							</view>
							<block v-else>
								<view class="right-status text">
									<text v-if="item.orderStatus == 1">{{ $t('完全成交') }}</text>
									<!-- <text v-if="item.orderStatus == 2">{{$t('部分成交')}}</text> -->
									<text v-if="item.orderStatus == 3">{{ $t('撤销中') }}</text>
									<text v-if="item.orderStatus == 4">{{ $t('撤销成功') }}</text>
									<u-icon size="20rpx" name="arrow-right"></u-icon>
								</view>
							</block>

							<view>
								<view>{{ $t('实际成交') }}[{{ item.coinMarket[1] }}]</view>
								<view>{{ item.dealAmount }}</view>
							</view>
						</view>
					</view>

					<block v-if="userEntrustList == '' && status == 'nomore'">
						<u-empty icon="/static/icon34.png" :text="$t('无当前委托')"></u-empty>
					</block>
					<block v-if="status == 'loading'">
						<u-gap height="30rpx"></u-gap>
						<u-loadmore :status="status" :nomoreText="$t('nomoreText')" :loadingText="$t('loadingText')"
							:loadmoreText="$t('loadmoreText')" />
					</block>
				</view>
			</view>
		</view>
		<view class="mask" v-show="showMoreSelect" @click="showMoreSelect = false"></view>

		<!-- theme == 'light' ? '#fff' : '#1F282F' -->
		<u-popup safeAreaInsetTop @open="open" bgColor="transparent" @close="close" :show="show" mode="left"
			:customStyle="{
			'border-radius':'0 60rpx 60rpx 0',
			'width':'640rpx'
		}">
			<view class="popup">
				<view class="title">{{ $t('市场') }}</view>
				<view class="search">
					<u-search @change="search" v-model="searchKey" :color="theme == 'light' ? '' : '#fff'"
						height="64rpx" placeholder="" :showAction="false"
						:bgColor="theme == 'light' ? '#F6F6F6' : '#29313C'"></u-search>
				</view>
				<view class="popup-tab">
					<u-tabs :current="marketTabIndex" :activeStyle="{
						'color':theme == 'light' ? '#000000' : '#fff'
					}" inactiveStyle="color:#848B9B" lineHeight="8rpx" lineWidth="48rpx" lineColor="#FEFA05" :list="popupTabs"
						@click="chooseTabMarkets"></u-tabs>
				</view>
				<view class="list-tab">
					<view>{{ $t('名称') }}</view>
					<view>{{ $t('最新价格') }}/{{ $t('24h涨跌幅') }}</view>
				</view>
				<view class="list">
					<scroll-view :style="{
						'height':marketPopupSliderHeight + 'px'
					}" scroll-y>
						<view @click="selectMarket(item,index)" :class="{
							'active':oriMarketItemIndex == index
						}" class="item" v-for="(item,index) in marketList" :key="index">
							<view class="left">
								{{ item.coinMarket[0] }}
								<text>/{{ item.coinMarket[1] }}</text>
							</view>
							<view class="right">
								<view>{{ item.lastPrice }}</view>
								<view :class="{
									'err':item.rangeAbility < 0 && item.onDealing === 1
								}">{{ item.rangeAbility >= 0 ? '+' : '' }}{{ utils.decimal(item.rangeAbility * 100, 2) }}%
								</view>
							</view>
						</view>
						<u-loadmore :status="marketStatus" :nomoreText="$t('nomoreText')"
							:loadingText="$t('loadingText')" :loadmoreText="$t('loadmoreText')" />
						<u-gap height="30rpx"></u-gap>
					</scroll-view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		getUserEntrustList,
		getOptionalMarket,
		getTickerByPartitionMarket,
		queryAccountInfo,
		getMarketDeeps,
		addUserEntrustOrder,
		cancelEntrustOrder,
		queryMarketPartition
	} from "@/config/api"

	export default {
		data() {
			return {
				orderType: 1,
				oriMarketList: [],
				searchKey: '',
				isLogin: false,
				marketTabIndex: 1,
				marketStatus: 'loading',
				marketItemIndex: 0,
				oriMarketItemIndex: 0,
				// marketItemIndex: 2,
				marketList: [],
				status: 'loading',
				blockIndex: null,
				popupTabs: [{
						name: this.$t('自选')
					},
					// {
					// 	name: 'GODE'
					// },
					// {
					// 	name: 'USDT'
					// }
				],
				show: false,
				block: [{
						name: '25%',
						key: 0.25,
						active: false
					},
					{
						name: '50%',
						key: 0.5,
						active: false
					},
					{
						name: '75%',
						key: 0.75,
						active: false
					},
					{
						name: '100%',
						key: 1,
						active: false
					}
				],
				tabs: [{
					name: this.$t('currentDelegation', {
						number: 0
					})
				}],
				barIndex: 0,
				count: "",
				number: 1,
				showMoreSelect: false,
				userEntrustList: [],
				marketPopupSliderHeight: 0,
				marketItem: {
					coinMarket: [this.$t('加载中...'), ''],
					rangeAbility: null,
					onDealing: null,
					lastPrice: 0,
					loading: true,
				},
				coinAccountList: [],
				marketDeeps: {
					asks: [{
							trustPrice: 0,
							cumulativeCommissionQuantity: 0
						},
						{
							trustPrice: 0,
							cumulativeCommissionQuantity: 0
						},
						{
							trustPrice: 0,
							cumulativeCommissionQuantity: 0
						},
						{
							trustPrice: 0,
							cumulativeCommissionQuantity: 0
						},
						{
							trustPrice: 0,
							cumulativeCommissionQuantity: 0
						}
					],
					bids: [{
							trustPrice: 0,
							cumulativeCommissionQuantity: 0
						},
						{
							trustPrice: 0,
							cumulativeCommissionQuantity: 0
						},
						{
							trustPrice: 0,
							cumulativeCommissionQuantity: 0
						},
						{
							trustPrice: 0,
							cumulativeCommissionQuantity: 0
						},
						{
							trustPrice: 0,
							cumulativeCommissionQuantity: 0
						}
					]
				}
			};
		},
		onHide() {
			clearInterval(this.timer)
			if (this.oriMarketList == '') return
			let topic = this.oriMarketList[this.marketItemIndex].oriCoinMarketText.toLowerCase().replace(
				'/', '-')
			uni.sendSocketMessage({
				data: '{"cmd":"unsub","data":{},"id":"' + uni.$u.guid(20) +
					'","sendMsgSuccess":true,"topic":"alpha-market-depth-' + topic +
					'-trade"}'
			})
		},
		onUnload() {
			clearInterval(this.timer)
			uni.sendSocketMessage({
				data: '{"cmd":"unsub","data":{},"id":"' + uni.$u.guid(20) +
					'","sendMsgSuccess":true,"topic":"alpha-market-depth-' + topic +
					'-trade"}'
			})
		},
		onLoad() {
			this.marketItemIndex = 0
		},
		computed: {
			alphaMarketTicker() {
				return this.$store.state['alpha-market-ticker']
			},
			alphaMarketDepthTrade() {
				return this.$store.state['alpha-market-depth-trade']
			}
		},
		watch: {
			alphaMarketDepthTrade(data, oldValue) {
				let {
					asks,
					bids
				} = data
				let newAsks = asks.slice(0, 5),
					newBids = bids.slice(0, 5)
				this.marketDeeps = {
					lastPrice: data.lastPrice,
					lastPriceCny: data.lastPriceCny,
					asks: newAsks,
					bids: newBids
				}
			},
			alphaMarketTicker(data, oldValue) {
				this.updateMarketList(this.marketList, data)
				this.updateMarketList(this.oriMarketList, data)
			},
			marketItem(n, o) {
				let topic = n.oriCoinMarketText.toLowerCase().replace(
					'/', '-')
				uni.sendSocketMessage({
					data: '{"cmd":"sub","data":{},"id":"' + uni.$u.guid(20) +
						'","sendMsgSuccess":true,"topic":"alpha-market-depth-' + topic +
						'-trade"}'
				})
				if (o.oriCoinMarketText != n.oriCoinMarketText) {
					if (o.oriCoinMarketText) {
						let oldTopic = o.oriCoinMarketText.toLowerCase().replace(
							'/', '-')
						uni.sendSocketMessage({
							data: '{"cmd":"unsub","data":{},"id":"' + uni.$u.guid(20) +
								'","sendMsgSuccess":true,"topic":"alpha-market-depth-' + oldTopic +
								'-trade"}'
						})
					}
				}
			}
		},
		onShow() {
			this.isLogin = Boolean(uni.getStorageSync('token'))
			let self = this
			if (this.oriMarketList != '') {
				this.oriMarketList[this.marketItemIndex].price = this.oriMarketList[this.marketItemIndex].lastPrice
				this.marketItem = this.oriMarketList[this.marketItemIndex]
			}

			uni.getStorage({
				key: 'barIndex',
				success: function(res) {
					self.barIndex = res.data.index
					if (self.oriMarketList != '') {

						let index = self.oriMarketList.findIndex(item => item.oriCoinMarketText == res.data
							.coin)
						if (index !== -1) {
							// self.marketItemIndex = index
							self.marketItem = {
								coinMarket: [self.$t('加载中...'), ''],
								rangeAbility: null,
								onDealing: null,
								lastPrice: 0,
								loading: true,
							}
							self.marketStatus = 'loading'
							self.status = 'loading'
							self.userEntrustList = []
							self.marketDeeps = {
								asks: [{
										trustPrice: 0,
										cumulativeCommissionQuantity: 0
									},
									{
										trustPrice: 0,
										cumulativeCommissionQuantity: 0
									},
									{
										trustPrice: 0,
										cumulativeCommissionQuantity: 0
									},
									{
										trustPrice: 0,
										cumulativeCommissionQuantity: 0
									},
									{
										trustPrice: 0,
										cumulativeCommissionQuantity: 0
									}
								],
								bids: [{
										trustPrice: 0,
										cumulativeCommissionQuantity: 0
									},
									{
										trustPrice: 0,
										cumulativeCommissionQuantity: 0
									},
									{
										trustPrice: 0,
										cumulativeCommissionQuantity: 0
									},
									{
										trustPrice: 0,
										cumulativeCommissionQuantity: 0
									},
									{
										trustPrice: 0,
										cumulativeCommissionQuantity: 0
									}
								]
							}
							self.init(res.data.coin)
						}
					} else {
						self.init(res.data.coin)
					}
					uni.removeStorage({
						key: 'barIndex'
					})
				},
				fail: e => {
					this.init()
				}
			});
		},
		methods: {
			onBarIndexChange(index) {
				this.barIndex = index
				this.queryUserEntrustList()
				this.count = ""
				this.blockIndex = null
			},
			onPriceChange(scene) {
				this.onNumberChange('oriMarketList[marketItemIndex].price', scene, 'price')
			},
			onCountChange(scene) {
				this.onNumberChange('count', scene)
			},
			onCountBlur(e) {
				if (e.split(".")[1]) {
					let leng = e.split(".")[1].length
					if (leng > this.oriMarketList[this.marketItemIndex].amountPrecision) {
						this.count = this.utils.decimal(Number(e), this.oriMarketList[this.marketItemIndex]
							.amountPrecision)
					}
				}

			},
			onNumberChange(num, scene, type) {
				let count = type == 'price' ? String(this['oriMarketList'][this.marketItemIndex].price).split('.') :
					String(this[num]).split('.')

				if (scene == 'minus') {
					count[0] -= 1
					if (count[0] < 0) {
						if (type == 'price') this['oriMarketList'][this.marketItemIndex].price = 0
						else this[num] = ''
						return
					}
					if (count.length == 1 && count[0] == 0) {
						if (type == 'price') this['oriMarketList'][this.marketItemIndex].price = 0
						else this[num] = ''
						return
					}
				} else {
					count[0]++
				}
				count = count.join(count.length == 2 ? '.' : '')

				if (type == 'price') this['oriMarketList'][this.marketItemIndex].price = count
				else this[num] = count
			},
			updateMarketList(list, data) {
				if (list != '' && data.coinId != undefined) {
					const index = list.findIndex(item => item.coinId == data.coinId)
					if (index == -1) return
					list[index].lastPrice = data.lastPrice
					list[index].rangeAbility = data.rangeAbility
					list[index].lastPriceCny = data.lastPriceCny
				}
			},
			revoke(item) {
				cancelEntrustOrder({
					cancelEntrustList: [{
						entrustNo: item.entrustNo
					}]
				}).then(e => {
					item.orderStatus = 3
				})
			},
			toDetail(item) {
				if (item.orderStatus == 1 || item.orderStatus == 2) {
					uni.setStorageSync('orderDetailItem', item)
					uni.$u.route({
						url: '/pages/orderDetail/orderDetail',
						params: {
							entrustNo: item.entrustNo
						}
					})
				}
			},
			submit() {
				let total = this.utils.decimal(this.count * this.oriMarketList[this.marketItemIndex].price, this
					.oriMarketList[this.marketItemIndex].amountPrecision)
				if (this.count == '') {
					uni.showToast({
						title: this.$t('请输入数量'),
						icon: 'none'
					})
					return
				}
				if (this.oriMarketList[this.marketItemIndex].price == '') {
					uni.showToast({
						title: this.$t('请输入价格'),
						icon: 'none'
					})
					return
				}
				if (this.barIndex == 0) {
					if (this.getAccount().amount < total) {
						uni.showToast({
							title: this.$t('余额不足，请确认账户资产后重新下单'),
							icon: 'none'
						})
						return
					}
				} else {

				}

				uni.showLoading({
					mask: true
				})
				addUserEntrustOrder({
					type: this.barIndex == 0 ? 1 : 2,
					coinMarket: this.oriMarketList[this.marketItemIndex].oriCoinMarketText,
					amount: this.count,
					price: this.oriMarketList[this.marketItemIndex].price,
					orderType: this.orderType
				}).then(e => {
					uni.hideLoading()
					queryAccountInfo({
						type: 1
					}).then(e => this.coinAccountList = e.coinAccountList)
				})
			},
			chooseProportion(item, index) {
				if (!uni.getStorageSync('token')) {
					return
				}
				this.blockIndex = index == this.blockIndex ? null : index
				if (this.barIndex == 1) {
					// 卖出
					this.count = this.utils.decimal((this.getAccount().amount * item.key), this.oriMarketList[this
						.marketItemIndex].amountPrecision)
					return
				}
				if (this.blockIndex != null) {

					if (this.getAccount().amount == 0) {
						uni.showToast({
							title: this.$t('余额不足，请确认账户资产后重新下单'),
							icon: 'none'
						})
						return
					}
					let price = this.oriMarketList[this.marketItemIndex].price
					let va = this.utils.decimal((this.getAccount().amount * item.key) / price, this.oriMarketList[this
						.marketItemIndex].amountPrecision)
					if (price == '') {
						va = 0
					}
					this.count = va == 0 ? 1 : va
				} else {
					this.count = ""
				}
			},
			/**
			 * 获取盘口
			 */
			getHandicap() {
				let data = this.oriMarketList
				if (data == '') return

				getMarketDeeps({
					coinMarket: data[this.marketItemIndex].oriCoinMarketText,
					type: 'trade'
				}).then(marketDeeps => {
					if (!Boolean(marketDeeps) || (marketDeeps.asks == '' || marketDeeps.bids == '')) {
						this.marketDeeps = {
							asks: [{
									trustPrice: 0,
									cumulativeCommissionQuantity: 0
								},
								{
									trustPrice: 0,
									cumulativeCommissionQuantity: 0
								},
								{
									trustPrice: 0,
									cumulativeCommissionQuantity: 0
								},
								{
									trustPrice: 0,
									cumulativeCommissionQuantity: 0
								},
								{
									trustPrice: 0,
									cumulativeCommissionQuantity: 0
								}
							],
							bids: [{
									trustPrice: 0,
									cumulativeCommissionQuantity: 0
								},
								{
									trustPrice: 0,
									cumulativeCommissionQuantity: 0
								},
								{
									trustPrice: 0,
									cumulativeCommissionQuantity: 0
								},
								{
									trustPrice: 0,
									cumulativeCommissionQuantity: 0
								},
								{
									trustPrice: 0,
									cumulativeCommissionQuantity: 0
								}
							]
						}
						return
					}
					let {
						asks,
						bids
					} = marketDeeps
					let newAsks = asks.slice(0, 5),
						newBids = bids.slice(0, 5)
					marketDeeps.asks = newAsks
					marketDeeps.bids = newBids
					this.marketDeeps = marketDeeps
				})
			},
			init(coin = false) {
				clearInterval(this.timer)
				queryMarketPartition().then(market => {
					let popupTabs = market.map(item => {
						return {
							name: item
						}
					})
					popupTabs.unshift({
						name: this.$t('自选')
					})
					this.popupTabs = popupTabs
					this.queryMarkets((e) => {
						if (coin) {
							this.marketItemIndex = e.findIndex(item => item.oriCoinMarketText == coin)
						}
						this.oriMarketList = e
						this.marketItem = this.oriMarketList[this.marketItemIndex]
						this.getHandicap()
						this.queryUserEntrustList()

						let topic = this.oriMarketList[this.marketItemIndex].oriCoinMarketText
							.toLowerCase().replace(
								'/', '-')
						if (!coin) {
							// setTimeout(()=>{
							// 	uni.sendSocketMessage({
							// 		data: '{"cmd":"sub","data":{},"id":"' + uni.$u.guid(20) +
							// 			'","sendMsgSuccess":true,"topic":"alpha-market-depth-' +
							// 			topic +
							// 			'-trade"}'
							// 	})
							// },1000)

						}

					})
				})


				this.timer = setInterval(this.queryUserEntrustList, 3000)
				if (this.isLogin) {
					queryAccountInfo({
						type: 1
					}).then(e => this.coinAccountList = e.coinAccountList)
				}
			},
			getAccount(coin) {
				if (this.coinAccountList == '') {
					return {
						amount: 0
					}
				} else {
					let coin = this.marketItem.coinMarket[this.barIndex == 0 ? 1 : 0]
					let data = this.coinAccountList.filter(item => item.coinName == coin)
					if (data == '') {
						return {
							amount: 0
						}
					}
					return data[0]
				}
			},
			open() {
				if (this.marketPopupSliderHeight != 0) return
				const query = uni.createSelectorQuery().in(this);
				query.select('.popup .list').boundingClientRect(data => {
					this.marketPopupSliderHeight = data.height
				}).exec();
			},

			/**
			 * 选择币对
			 * @param {Object} item
			 * @param {Object} index
			 */
			selectMarket(item, index) {
				this.marketItemIndex = index
				this.oriMarketItemIndex = index
				this.marketItem = item
				this.show = false
				// this.oriMarketList = this.marketList
				this.getHandicap()
				// this.queryMarkets()
			},

			/**
			 * 获取币对
			 */
			async queryMarkets(fn = () => {}) {
				let data
				if (this.marketTabIndex == 0) data = await getOptionalMarket()
				else data = await getTickerByPartitionMarket({
					partition: this.popupTabs[this.marketTabIndex].name
				})

				this.marketStatus = 'nomore'

				if (data == '') {
					this.marketList = []
					return
				} else {
					data.forEach(item => {
						if (item.coinMarket) {
							item.oriCoinMarketText = item.coinMarket
							item.coinMarket = item.coinMarket.split('/')
						}
						item.price = item.lastPrice
					})

					if (this.searchKey == '') {
						this.marketList = data
					} else {
						// this.marketList = this.fuzzyQuery(data, this.searchKey)
						this.marketList = this.utils.fuzzyQuery(data, this.searchKey, 'oriCoinMarketText')
					}
				}

				fn(this.marketList)

				// if (data == '') {
				// 	this.isCreated = false
				// 	uni.closeSocket()
				// } else {
				// 	if (this.isCreated) return
				// 	uni.connectSocket({
				// 		url: this.utils.socketURL,
				// 		success: () => {
				// 			this.isCreated = true
				// 		}
				// 	});
				// }
			},
			/**
			 * 查询委托单
			 * @param {Object} coinMarket
			 * @param {Object} type
			 */
			queryUserEntrustList(coinMarket) {
				if (!this.isLogin) {
					this.status = 'nomore'
					return
				}
				getUserEntrustList({
					coinMarket: this.marketItem.oriCoinMarketText,
					type: this.barIndex == 0 ? 1 : 2
				}).then(res => {
					this.tabs[0].name = this.$t('currentDelegation', {
						number: res.length
					})
					res.forEach(item => {
						if (item.coinMarket) {
							item.coinMarket = item.coinMarket.split('/')
						}
					})
					this.status = 'nomore'
					this.userEntrustList = res
				}).catch(() => {
					this.status = 'nomore'
				})
			},
			/**
			 * 选择交易币种
			 */
			chooseTabMarkets({
				index
			}) {
				if (index == this.marketTabIndex) return
				this.marketStatus = 'loading'
				this.marketList = []
				this.marketTabIndex = index
				// this.marketItemIndex = index

				this.queryMarkets(() => {

					let i = this.marketList.findIndex(item => item.oriCoinMarketText == this.marketItem
						.oriCoinMarketText)
					if (i === -1) {
						this.oriMarketItemIndex = null
					} else {
						this.oriMarketItemIndex = i
					}
				})
			},
			close() {

				this.show = false

			},
			rightClick() {
				uni.$u.route({
					url: '/pages/kLine/kLine',
					params: {
						coinMarket: this.marketItem.oriCoinMarketText
					}
				})
			},

			selectItem(type) {
				this.orderType = type
				this.showMoreSelect = false
			},

			search(e) {
				this.queryMarkets()
			}
		},
	}
</script>

<style lang="scss">
	page {
		::v-deep {
			.u-tabs__wrapper__nav__line {
				bottom: 0 !important;
			}

			.u-navbar {

				.u-navbar__content,
				.u-status-bar {
					background-color: #f6f6f6 !important;
				}
			}
		}
	}


	.popup {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--status-bar-height));
		border-radius: 0 60rpx 60rpx 0;
		background-color: #fff;
		overflow: hidden;
		position: relative;
		z-index: 1;

		.list {
			flex: 1;

			.item {
				display: flex;
				justify-content: space-between;
				padding: 0 30rpx;
				height: 96rpx;
				align-items: center;

				&.active {
					background-color: #F6F6F6;
				}

				.right {
					view {
						&:first-child {
							font-weight: bold;
							color: #000000;
							font-size: 30rpx;
						}

						&:last-child {
							font-weight: bold;
							text-align: right;
							color: #2DBE87;
							font-size: 24rpx;

							&.err {
								color: #F5475E;
							}
						}
					}
				}

				.left {
					font-weight: bold;
					font-size: 30rpx;
					padding-top: 20rpx;
					align-self: flex-start;

					text {
						color: #848D96;
						font-size: 24rpx;
					}
				}
			}
		}

		.list-tab {
			padding: 0 30rpx;
			display: flex;
			justify-content: space-between;
			height: 92rpx;
			align-items: center;
			color: #BAB9BE;
			font-size: 24rpx;
		}

		.popup-tab {
			border-bottom: 2rpx solid #EFEFEF;
		}

		::v-deep {
			.u-tabs__wrapper__nav__line {
				// bottom: 0 !important;
			}
		}

		.search {
			margin-bottom: 15rpx;
			padding: 0 30rpx;
		}

		.title {
			padding: 0 30rpx;
			padding-top: 70rpx;
			font-weight: 500;
			margin-bottom: 30rpx;
			font-size: 48rpx;
		}
	}

	.mask {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: 999;
		background-color: transparent;
	}

	.content {
		background: #FFFFFF;
		border-radius: 40rpx 40rpx 0px 0px;
		padding: 0 30rpx;

		.lower {
			padding-top: 60rpx;

			.tab {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}

			.list {
				min-height: 700rpx;

				.item {
					display: flex;
					padding: 24rpx 30rpx;
					margin-top: 22rpx;

					.right {
						text-align: right;

						>view {
							&:last-child {
								view {
									&:first-child {
										color: #929BA2;
										margin-bottom: 16rpx;
										font-size: 24rpx;
									}

									&:last-child {
										font-weight: 500;
										font-size: 32rpx;
									}
								}
							}
						}

						.right-status {
							margin-bottom: 44rpx;
							line-height: 40rpx;

							&.text {
								display: flex;
								justify-content: flex-end;
								align-items: center;

								text {
									font-weight: 500;
									color: #2D270D;
									margin-right: 10rpx;
									font-size: 24rpx;
								}
							}

							&.btn {
								display: inline-block;
								padding: 0 24rpx;
								border-radius: 8rpx;
								background-color: #FEFA05;
								font-weight: 500;
								color: #2D270D;
								font-size: 24rpx;
							}
						}
					}

					.left {
						flex: 1;
						display: flex;

						>view {
							width: 50%;

							&:last-child {
								.date {
									margin-bottom: 44rpx;
									color: #929BA2;
									line-height: 40rpx;
									font-size: 24rpx;
								}

								.info {
									view {
										&:first-child {
											color: #929BA2;
											margin-bottom: 16rpx;
											font-size: 24rpx;
										}

										&:last-child {
											font-weight: 500;
											font-size: 32rpx;
										}
									}
								}
							}

							&:first-child {
								margin-right: 20rpx;

								>view {
									&:last-child {
										view {
											&:first-child {
												color: #929BA2;
												margin-bottom: 16rpx;
												font-size: 24rpx;
											}

											&:last-child {
												font-weight: 500;
												word-break: break-all;
												font-size: 32rpx;
											}
										}
									}
								}

								.business {
									font-weight: 500;
									color: #333333;
									margin-bottom: 44rpx;
									line-height: 40rpx;

									text {
										font-size: 32rpx;
										color: #2DBE87;

										&.err {
											color: #F5475E;
										}
									}
								}
							}
						}
					}
				}
			}


		}

		.upper {
			display: flex;
			padding-top: 30rpx;

			.right {
				flex: 1;
				padding-left: 30rpx;
				display: flex;
				flex-direction: column;

				.lab-box {
					display: flex;
					justify-content: space-between;
					text-align: left;
					margin-bottom: 24rpx;

					.lab {

						&:last-child {
							text-align: right;
						}

						view,
						text {
							color: #929BA2;
							font-size: 24rpx;
						}
					}
				}

				.area {
					padding: 36rpx 0;

					view {
						font-weight: 500;
						text-align: center;

						&:first-child {
							color: #2DBE87;
							font-size: 36rpx;
						}

						&:last-child {
							font-weight: 500;
							margin-top: 5rpx;
							color: #929BA2;
							font-size: 24rpx;
						}
					}
				}

				.price-box {
					display: flex;
					justify-content: space-between;
					flex: 1;

					&.bottom {
						>view {
							&:first-child {
								.price {
									color: #2DBE87;
								}
							}
						}

						.price {
							&:first-child {
								margin-top: 0;
							}
						}
					}

					>view {

						.price {
							font-weight: 500;
							padding: 10rpx 0;
							font-size: 22rpx;

							&:first-child {
								padding-top: 0;
							}

							&:last-child {
								padding-bottom: 0;
							}
						}

						&:last-child {
							text-align: right;

							.price {
								color: #000000;
							}
						}


						&:first-child {
							.price {
								color: #F5475E;
							}
						}
					}
				}
			}

			.left {
				width: 60%;
				display: flex;
				flex-direction: column;

				.btn {
					line-height: 80rpx;
					text-align: center;
					// background: #2DBE87;
					border-radius: 8rpx;
					font-weight: 500;
					font-size: 32rpx;
					color: #FFFFFF;
				}

				.usable {
					.tip {
						display: flex;
						justify-content: space-between;
						font-weight: 500;
						font-size: 24rpx;
						color: #191919;
					}
				}

				.total-amount {
					display: flex;
					align-items: center;
					height: 80rpx;
					background: #F6F6F6;
				}

				.block {
					display: flex;
					justify-content: space-between;

					view {
						background: #F6F6F6;
						border-radius: 8rpx;
						font-weight: 500;
						color: #929BA2;
						padding: 8rpx 20rpx;
						font-size: 24rpx;

						&.active {
							background: #FEFA05;
							color: #000
						}
					}
				}

				.number-box,
				.count-box {
					height: 80rpx;
					background: #F6F6F6;
					display: flex;
					overflow: hidden;
					align-items: center;

					.icon {
						padding: 0 20rpx;
						height: 80rpx;
						display: flex;
						align-items: center;
					}

					::v-deep {
						.u-input {}
					}

					// ::v-deep {

					// 	.u-number-box__plus--hover,
					// 	.u-number-box__minus--hover {
					// 		background-color: #f6f6f6 !important;
					// 	}
					// }
				}

				.select {
					height: 48rpx;
					position: relative;
					background: #F6F6F6;
					border-radius: 8rpx;
					align-items: center;
					display: flex;
					font-weight: 500;
					color: #1E1F29;
					font-size: 28rpx;

					.down-box {
						position: absolute;
						// display: none;
						left: 0;
						width: 100%;
						top: 50rpx;
						z-index: 1000;
						box-shadow: 1rpx 1rpx 10rpx 0 rgba(0, 0, 0, 0.1);
						padding: 10rpx 0;

						view {
							padding: 20rpx 30rpx;
							// line-height: 50rpx;
						}

						background-color: #fff;
					}

					.icon {
						position: absolute;
						right: 20rpx;
					}

					justify-content: center;
				}

				.bar {
					margin-bottom: 20rpx;
					display: flex;
					border-radius: 8rpx;
					overflow: hidden;

					.item {
						flex: 1;
						font-weight: 500;
						font-size: 30rpx;
						text-align: center;
						position: relative;
						overflow: hidden;
						line-height: 60rpx;
						background-color: #f6f6f6;
						color: #929BA2;

						&:last-child {
							&.active {
								background-color: #F5475E;
							}
						}

						&.active {
							background-color: #2EBD87;
							color: #FFFFFF;
						}

						.triangle {
							position: absolute;
							top: 0;
							border-style: solid;
							border-color: transparent;
							border-width: 31rpx 0 31rpx 31rpx;
							// border-left-color: #2EBD87;
						}

						&:first-child {
							.triangle {
								right: -1rpx;
								transform: rotate(180deg);
							}
						}

						&:last-child {
							.triangle {
								left: -1rpx;
							}
						}

					}
				}
			}
		}
	}

	page {
		background-color: #f6f6f6;
	}

	.nav-coin {
		display: flex;
		align-items: center;

		.proportion {
			font-weight: 500;
			font-size: 28rpx;

			&.add {
				color: #2EBD87;
			}

			&.err {
				color: #F5475E;
			}
		}

		.name {
			font-weight: bold;
			color: #1E1F29;
			font-size: 36rpx;
			margin: 0 20rpx;
		}
	}

	@media (prefers-color-scheme: dark) {
		.nav-coin .name {
			color: #fff;
		}

		.content .upper .left .usable .tip,
		.content .upper .right .price-box>view:last-child .price,
		.content .lower .list .item .left>view:first-child .business,
		.content .lower .list .item .right .right-status.text text,
		.popup .title,
		.popup .list .item .right view:first-child {
			color: #fff;
		}

		.content .lower .list .item,
		.content .lower .tab {
			&.u-border-bottom {
				border-color: #343B45 !important;
			}
		}

		.content .upper .left .bar .item,
		.content .upper .left .select,
		.content .upper .left .select .down-box,
		.content .upper .left .number-box,
		.content .upper .left .count-box {
			background-color: #29313C;
		}

		.content .upper .left .total-amount {
			background: #29313C;

		}

		.popup .popup-tab {
			border-bottom-color: #343B45;
		}

		.popup {
			background-color: #1F282F;
		}

		.content .upper .left .block view {

			background: #29313C;
		}

		.popup .list .item.active {
			background-color: #29313C;
		}

		.content .upper .left .number-box,
		.content .upper .left .count-box {
			::v-deep {

				.u-number-box__plus--hover,
				.u-number-box__minus--hover {
					background-color: #29313C !important;
				}

				.u-number-box__plus,
				.u-number-box__minus {
					background-color: #29313C !important;

					.u-icon__icon {
						color: #fff !important;
					}
				}
			}
		}

		.content .upper .left .select {
			color: #fff;
		}

		page {
			background-color: #171E28;

			::v-deep {
				.u-navbar {

					.u-navbar__content,
					.u-status-bar {
						background-color: #171E28 !important;
					}
				}

				.u-popup {
					.u-status-bar {
						opacity: 0 !important;
					}
				}
			}
		}



		.content {
			background: #1F282F;
		}


	}
</style>
