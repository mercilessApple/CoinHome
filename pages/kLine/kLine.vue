<template>
	<view>
		<u-navbar :leftIconColor="theme == 'light' ? '#303133' : '#fff'"
			:bgColor="theme == 'light' ? '#fff' : '#1F282F'" placeholder title="" @rightClick="rightClick"
			:autoBack="true">
			<view class="navCenterSolt" slot='center'>
				<u-image v-if="theme == 'light'" src="/static/icon32.png" width="48rpx" height="48rpx"></u-image>
				<u-image v-else src="/static/icon44.png" width="48rpx" height="48rpx"></u-image>
				<text>{{market.symbolKey}}</text>
			</view>
			<view slot="right">
				<u-image src="/static/icon36.png" width="48rpx" height="48rpx"></u-image>
			</view>
		</u-navbar>
		<view class="upper-box">
			<view class="left">
				<view class="amount">{{market.lastPrice}}</view>
				<view class="unit">
					≈ ¥{{market.lastPriceCny}} <text :class="{
						add:market.rangeAbility >= 0 ,
						err:market.rangeAbility < 0 ,
					}">{{market.rangeAbility >=0 ? '+':''}}{{(market.rangeAbility * 100).toFixed(2) + '%'}}</text>
				</view>
			</view>
			<view class="right">
				<view>
					<view class="lab">{{$t('24h最高价')}}</view>
					<view class="val">23,771.80</view>
				</view>
				<view>
					<view class="lab">{{$t('24h成交量')}}(BTC)</view>
					<view class="val">23,771.80</view>
				</view>
				<view>
					<view class="lab">{{$t('24h最低价')}}</view>
					<view class="val">23,771.80</view>
				</view>
				<view>
					<view class="lab">{{$t('24h成交额')}}(USDT)</view>
					<view class="val">23,771.80</view>
				</view>
			</view>
		</view>
		<view class="time-box">
			<view class="lab">{{$t('分时')}}</view>
			<view class="box">
				<view :class="{
					'active':index == timeIndex
				}" v-for="(item,index) in timeNav" :key="index" @click="ChangeKLinePeriod(item.id,index)">
					{{item.text}}
				</view>
			</view>
			<view @click="createDeep" class="deep" :class="{
				active:isShowDeep
			}">{{$t('深度图')}}</view>
		</view>

		<view>
			<canvas v-show="!isShowDeep" id="kline" canvas-id='kline' class='kline' :style="{
				'width': '750rpx', 'height': KLine.Height + 20 + 'px'
			}" @touchstart="KLineTouchStart" @touchmove='KLineTouchMove' @touchend='KLineTouchEnd'></canvas>

			<canvas v-show="isShowDeep" @touchstart="deepLineTouchStart" @touchmove='deepLineTouchMove'
				@touchend='deepLineTouchEnd' id="deep" canvas-id='deep' class='deep' :style="{
				'width': '750rpx', 'height': KLine.Height + 20 + 'px'
			}"></canvas>
		</view>

		<view class="other-box" v-show="!isShowDeep">
			<view :class="{
					'active':index == otherNavIndex
				}" v-for="(item,index) in otherNav" :key="index" @click="ChangeKLineIndex(item.key,item.text,index)">{{item.text}}
			</view>
		</view>
		<u-gap height="30rpx"></u-gap>
		<u-gap height="10rpx" :bgColor="theme == 'light' ? '#F6F6F6' : '#171E28'"></u-gap>
		<view class="tabs-box u-border-bottom">
			<u-tabs lineColor="#FEFA05" lineWidth="60rpx" lineHeight="8rpx" :activeStyle="{
						'color':theme == 'light' ? '#1E1F29' : '#fff'
					}" inactiveStyle="color:#898D99" :itemStyle="{
			'height':'80rpx',
			'font-size':'30rpx'
		}" :scrollable="false" :list="tabs" @click="tabClick"></u-tabs>
		</view>
		<u-gap height="20rpx"></u-gap>
		<view class="tab-content">

			<view class="tab-box" v-show="tabIndex == 0">
				<view class="tab-box-item" style="padding-right: 10rpx;">
					<view class="title">{{$t('买')}}</view>
					<view class="item" v-for="(item,index) in entrustList.bids" :key="index">
						<text>{{item.amount}}</text><text>{{item.price}}</text>
					</view>
				</view>
				<view class="tab-box-item sell" style="padding-left: 10rpx;">
					<view class="title">{{$t('卖')}}</view>
					<view class="item" v-for="(item,index) in entrustList.asks" :key="index">
						<text>{{item.price}}</text><text>{{item.amount}}</text>
					</view>
				</view>
			</view>
			<block v-if="tabIndex == 0 && entrustList.bids == ''">
				<u-gap height="300rpx"></u-gap>
				<u-empty :text="$t('暂无数据')"></u-empty>
				<u-gap height="300rpx"></u-gap>
			</block>

			<view class="tab-box deal" v-show="tabIndex == 1">
				<view class="tab-box-item">
					<view class="title">
						<text>{{$t('时间')}}</text>
						<text>{{$t('方向')}}</text>
					</view>
					<view class="item" v-for="(item,index) in market.bids" :key="'time'+index">
						<text>14:14:05</text><text>{{$t('买入')}}</text>
					</view>
					<view class="item" v-for="(item,index) in market.asks" :key="'type'+index">
						<text>14:14:05</text><text class="err">{{$t('卖出')}}</text>
					</view>
				</view>


				<view class="tab-box-item">
					<view class="title">
						<text>{{$t('价格')}}</text>
						<text>{{$t('数量')}}</text>
					</view>
					<view class="item" v-for="(item,index) in market.bids" :key="'price'+index"><text
							style="color: #2DBE87;">{{item.trustPrice}}</text><text>{{item.cumulativeCommissionQuantity}}</text>
					</view>
					<view class="item" v-for="(item,index) in market.asks" :key="'num'+index"><text
							class="err">{{item.trustPrice}}</text><text>{{item.cumulativeCommissionQuantity}}</text>
					</view>
				</view>
			</view>

			<view class="tab-box info" v-show="tabIndex == 2">
				<u-gap height="20rpx"></u-gap>
				<view class="logo">
					<u-image width="48rpx" height="48rpx"></u-image>
					<text>BTC</text>
				</view>
				<view class="lab-item">
					<view>{{$t('发行时间')}}</view>
					<view>2008-11-01</view>
				</view>
				<view class="lab-item">
					<view>{{$t('发行总量')}}</view>
					<view>21,000,000</view>
				</view>
				<view class="lab-item">
					<view>{{$t('流通总量')}}</view>
					<view>18,374,575</view>
				</view>
				<view class="lab-item">
					<view>{{$t('发行价格')}}</view>
					<view>0.0025</view>
				</view>
				<view class="lab-item">
					<view>{{$t('白皮书')}}</view>
					<view>https://bitcoin.org/bitcoin.pdf</view>
				</view>
				<view class="lab-item">
					<view>{{$t('官网')}}</view>
					<view><text selectable>https://bitcoin.org</text></view>
				</view>
				<view class="lab-item">
					<view>{{$t('介绍')}}</view>
					<view></view>
				</view>
				<view class="desc">
					比特币（BitCoin）概念最初由中本聪在2008年提出，根据中本聪的思路设计发布的开源软件以及建构其上的P2P网络。比特币是一种P2P形式的数字货币。点对点的传输意味着一个去中心化的支付系统。
					与大多数货币不同，比特币不依靠特定货币机构发行，它依据特定算法，通过大量的计算产生，比特币经济使用整个p2p网络中众多节点构成的分布式数据库来确认并记录所有的交易行为，并使用密码学的设计来确保货币流通各个环节安全性。
					p2p的去中心化特性与算法本身可以确保无法通过大量制造比特币来人为操控币值。基于密码学的设计可以使比特币只能被真实的拥有者转移或支付。这同样确保了货币所有权与流通交易的匿名性。比特币与其他虚拟货币最大的不同，是其总数量非常有限，具有极强的稀缺性。该货币系统曾在4年内只有不超过1050万个，之后的总数量将被永久限制在2100万个。
					比特，是一种计算机专业术语，是信息量单位，是由英文BIT音译而来。二进制数的一位所包含的信息就是一比特，如二进制数0100就是4比特。那么，比特这个概念和货币联系到一起，不难看出，比特币非现实货币，而是一种计算机电子虚拟货币，存储在你的电脑上。
					目前，这种崭新的虚拟货币不受任何政府、任何银行控制。因此，它还未被合法化。
				</view>
			</view>
		</view>
		<!-- 		<view class="button-sp-area">
			<button class="mini-btn" type="default" size="mini" @click="ChangeSymbol('000001.sz')">000001.sz</button>
			<button class="mini-btn" type="default" size="mini" @click="ChangeSymbol('600000.sh')">600000.sh</button>
		</view> -->

		<view class="fix-bar">
			<view class="box">
				<view @click="next(0)">{{$t('买入')}}</view>
				<view @click="next(1)">{{$t('卖出')}}</view>
			</view>
			<u-safe-bottom></u-safe-bottom>
		</view>
		<u-gap height="120rpx"></u-gap>
		<u-safe-bottom></u-safe-bottom>
	</view>

</template>

<script>
	import {
		JSCommon
	} from '@/uni_modules/jones-hqchart2/js_sdk/umychart.wechat.3.0.js'
	import {
		JSCommonHQStyle
	} from '@/uni_modules/jones-hqchart2/js_sdk/umychart.style.wechat.js'

	import {
		KLineOption,
		DeepOption,
	} from '@/utils/KLineOption.js'
	import {
		getMarketKline,
		getMarketDeeps,
		getUserEntrustList,
		getMarketDepth
	} from "@/config/api"


	//周期枚举
	var PERIOD_ID = {
		KLINE_DAY_ID: 0,
		KLINE_WEEK_ID: 1,
		KLINE_MONTH_ID: 2,
		KLINE_YEAR_ID: 3,

		KLINE_MINUTE_ID: 4,
		KLINE_5MINUTE_ID: 5,
		KLINE_15MINUTE_ID: 6,
		KLINE_30MINUTE_ID: 7,
		KLINE_60MINUTE_ID: 8
	}

	var g_KLine = {
		JSChart: null
	};

	var d_Line = {
		JSChart: null
	}

	export default {
		data() {
			let data = {
				tabs: [{
						name: this.$t('委托订单')
					},
					{
						name: this.$t('最新成交')
					},
					{
						name: this.$t('简介信息')
					}
				],
				tabIndex: 0,
				isShowDeep: false,
				Symbol: '600000.sh',
				timeIndex: null,
				otherNavIndex: null,
				otherNav: [{
						text: 'BOLL',
						key: 0
					},
					{
						text: 'RSI',
						key: 1
					},
					{
						text: 'WR',
						key: 2
					},
					{
						text: 'MA',
						key: 0
					},
					{
						text: 'VOL',
						key: 1
					},
					{
						text: 'MACD',
						key: 1
					},

				],
				timeNav: [{
						text: this.$t('minute', {
							num: 1
						}),
						id: PERIOD_ID.KLINE_MINUTE_ID,
						key: 'one_minute'
					},
					{
						text: this.$t('minute', {
							num: 5
						}),
						id: PERIOD_ID.KLINE_5MINUTE_ID,
						key: 'five_minute'
					},
					{
						text: this.$t('minute', {
							num: 15
						}),
						id: PERIOD_ID.KLINE_15MINUTE_ID,
						key: 'fifteen_minute'
					},
					{
						text: this.$t('minute', {
							num: 30
						}),
						id: PERIOD_ID.KLINE_30MINUTE_ID,
						key: 'thirty_minute'
					},
					{
						text: this.$t('minute', {
							num: 60
						}),
						id: PERIOD_ID.KLINE_60MINUTE_ID,
						key: 'one_hour'
					},
					{
						text: this.$t('日线'),
						id: PERIOD_ID.KLINE_DAY_ID,
						key: 'one_day'
					},
					{
						text: this.$t('周线'),
						id: PERIOD_ID.KLINE_WEEK_ID,
						key: 'one_week'
					},
					{
						text: this.$t('月线'),
						id: PERIOD_ID.KLINE_MONTH_ID,
						key: 'one_month'
					},
					{
						text: this.$t('年线'),
						id: PERIOD_ID.KLINE_YEAR_ID,
						key: 'one_year'
					}
				],
				KLine: {
					Option: KLineOption,
					IsShow: false,
					Display: 'none',
					Width: uni.upx2px(750),
					Height: uni.upx2px(1000),
				},
				deepKLine: {
					Option: DeepOption
				},
				market: {
					symbolKey: this.$t('加载中...'),
					lastPrice: 0,
					lastPriceCny: 0,
					rangeAbility: 0,
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
					],
				},
				// PERIOD_ID: PERIOD_ID,
				entrustList: {
					bids: [],
					asks: []
				}
			};
			return data;
		},

		onLoad(options) {
			this.coinMarket = options.coinMarket
			this.init()
			// this.timer = setInterval(this.init, 1000)
		},

		onShow() {
			clearInterval(this.timer)
			this.init()
			this.timer = setInterval(this.init, 1000)
			if (this.isShowDeep) {
				return
			}
			this.ChangeKLinePeriod(8, 5);
		},

		onReady() {

		},

		onHide() {
			if (g_KLine.JSChart) {
				g_KLine.JSChart.StopAutoUpdate();
				g_KLine.JSChart = null;
			}

			if (d_Line.JSChart) {
				d_Line.JSChart.StopAutoUpdate();
				d_Line.JSChart = null;
			}
			clearInterval(this.timer)
		},

		onUnload() {
			if (g_KLine.JSChart) {
				g_KLine.JSChart.StopAutoUpdate();
				g_KLine.JSChart = null;
			}

			if (d_Line.JSChart) {
				d_Line.JSChart.StopAutoUpdate();
				d_Line.JSChart = null;
			}
			clearInterval(this.timer)
		},
		methods: {
			next(type) {
				uni.setStorage({
					key:'barIndex',
					data:type
				})
				uni.switchTab({
					url: '/pages/transaction/transaction'
				})
			},
			init() {
				getMarketDeeps({
					coinMarket: this.coinMarket,
					type: 'detail'
				}).then(e => {
					if (!Boolean(e)) return
					let {
						asks,
						bids
					} = e
					let newAsks = asks.slice(0, 5),
						newBids = bids.slice(0, 5)
					e.asks = newAsks
					e.bids = newBids
					this.market = e
				})

				getUserEntrustList({
					coinMarket: this.coinMarket
				}).then(e => {
					this.entrustList = {
						asks: e.map(item => item.type == 2),
						bids: e.map(item => item.type == 1)
					}
				})
			},
			tabClick({
				index
			}) {
				this.tabIndex = index
			},
			createDeep() {
				this.isShowDeep = true
				setTimeout(() => {
					this.createDeepChart()
				}, 50)
				this.timeIndex = null
			},
			createDeepChart() {
				if (d_Line.JSChart) return;
				let element = new JSCommon.JSCanvasElement();
				// #ifdef APP-PLUS
				element.IsUniApp = true; //canvas需要指定下 是uniapp的app
				// #endif
				element.ID = 'deep';

				element.Height = this.KLine.Height; //高度宽度需要手动绑定!!
				element.Width = this.KLine.Width;

				const theme = uni.getSystemInfoSync().theme
				let style
				if (theme == "light") style = 'WHITE_ID'
				else style = 'BLACK_ID'
				const themeStyle = JSCommonHQStyle.GetStyleConfig(JSCommonHQStyle.STYLE_TYPE_ID[style])
				JSCommon.JSChart.SetStyle(themeStyle);

				d_Line.JSChart = JSCommon.JSChart.Init(element);
				this.deepKLine.Option.IsFullDraw = true; //每次手势移动全屏重绘
				this.deepKLine.Option.NetworkFilter = this.DeepNetworkFilter;

				d_Line.JSChart.SetOption(this.deepKLine.Option);
			},
			DeepNetworkFilter(data, callback) {
				console.log("[KLineChart::NetworkFilter", data);

				switch (data.Name) {
					case "DepthChartContainer::RequestDepthData":
						this.RequestDepthData(data, callback);
						break;
				}
			},
			RequestDepthData(data, callback) {
				getMarketDepth({
					coinMarket: this.coinMarket,
					type: 'paint'
				}).then(e => {
					var hqChartData = {
						code: 0,
						asks: e.asks.map(item => {
							return [
								item.trustPrice,
								item.lastNumber
							]
						}),
						bids: e.bids.map(item => {
							return [
								item.trustPrice,
								item.lastNumber
							]
						}), //买盘 
						datatype: "snapshot" //全量数据  
					};
					callback(hqChartData);
				})
			},
			rightClick() {

			},
			//
			CreateKLineChart: function() {
				if (this.KLine.JSChart) return;
				let element = new JSCommon.JSCanvasElement();
				// #ifdef APP-PLUS
				element.IsUniApp = true; //canvas需要指定下 是uniapp的app
				// #endif
				element.ID = 'kline';
				element.Height = this.KLine.Height; //高度宽度需要手动绑定!!
				element.Width = this.KLine.Width;

				const theme = uni.getSystemInfoSync().theme
				let style
				if (theme == "light") style = 'WHITE_ID'
				else style = 'BLACK_ID'
				const themeStyle = JSCommonHQStyle.GetStyleConfig(JSCommonHQStyle.STYLE_TYPE_ID[style])
				JSCommon.JSChart.SetStyle(themeStyle);

				g_KLine.JSChart = JSCommon.JSChart.Init(element);
				this.KLine.Option.NetworkFilter = this.NetworkFilter;
				let coin = this.coinMarket.split('/')
				this.KLine.Option.Symbol = coin[0] + coin[1] + '.BIT';
				this.KLine.Option.IsFullDraw = true; //每次手势移动全屏重绘

				g_KLine.JSChart.SetOption(this.KLine.Option);
			},

			//K线周期切换
			ChangeKLinePeriod(period, index) {
				this.timeIndex = index
				this.isShowDeep = false
				if (!g_KLine.JSChart) //不存在创建
				{
					this.KLine.Option.Period = period;
					this.CreateKLineChart();
				} else {
					g_KLine.JSChart.ChangePeriod(period);
				}
			},

			//切换指标 windowIndex=窗口索引 0开始, name=指标名字/ID
			ChangeKLineIndex: function(windowIndex, name, index) {
				if (!g_KLine.JSChart) return;

				g_KLine.JSChart.ChangeIndex(windowIndex, name);
				this.otherNavIndex = index
			},

			//切换股票
			ChangeSymbol: function(symbol) {
				if (!g_KLine.JSChart) return;

				g_KLine.JSChart.ChangeSymbol(symbol);
			},
			marketKline(dimension, fn) {
				getMarketKline({
					coinMarket: this.coinMarket,
					dimension
				}).then(res => {
					let formatData = res.map(item => {
						return [
							Number(this.$moment(item.time).format('YYYYMMDD')),
							null,
							Number(item.open),
							Number(item.high),
							Number(item.low),
							Number(item.close),
							Number(item.amount),
							Number(item.turnover)
						]
					})
					let coin = this.coinMarket.split('/')
					let data = {
						symbol: coin[0] + coin[1] + '.BIT',
						name: coin[0] + coin[1],
						data: formatData
					}
					fn(data)
				})
			},
			NetworkFilter: function(data, callback) {
				data.PreventDefault = true

				switch (data.Name) {
					case 'KLineChartContainer::ReqeustHistoryMinuteData':
						this.marketKline(this.timeNav[this.timeIndex].key, data => callback({
							data
						}))

						break;
					case 'KLineChartContainer::RequestHistoryData':
						this.marketKline(this.timeNav[this.timeIndex].key, data => callback({
							data
						}))
						break
				}
				console.log('[HQChart:NetworkFilter] data', data.Name);
			},

			//KLine事件
			deepLineTouchStart: function(event) {
				if (d_Line.JSChart) d_Line.JSChart.OnTouchStart(event);
			},

			deepLineTouchMove: function(event) {
				if (d_Line.JSChart) d_Line.JSChart.OnTouchMove(event);
			},

			deepLineTouchEnd: function(event) {
				if (d_Line.JSChart) d_Line.JSChart.OnTouchEnd(event);
			},

			//KLine事件
			KLineTouchStart: function(event) {
				if (g_KLine.JSChart) g_KLine.JSChart.OnTouchStart(event);
			},

			KLineTouchMove: function(event) {
				if (g_KLine.JSChart) g_KLine.JSChart.OnTouchMove(event);
			},

			KLineTouchEnd: function(event) {
				if (g_KLine.JSChart) g_KLine.JSChart.OnTouchEnd(event);
			},
		}
	}
</script>

<style lang="scss">
	.fix-bar {
		position: fixed;
		width: 100%;
		bottom: 0;
		z-index: 100;
		left: 0;
		background: #F6F6F6;

		.box {
			display: flex;
			justify-content: space-between;
			padding: 20rpx 30rpx;

			>view {
				width: 340rpx;
				line-height: 80rpx;
				text-align: center;
				border-radius: 8rpx;
				color: #fff;
				font-weight: 500;
				font-size: 30rpx;

				&:first-child {
					background-color: #2DBE87;
				}

				&:last-child {

					background: #F5475E;
				}
			}
		}
	}

	page {
		/* background-color: #000; */
	}

	.tab-content {
		padding: 0 30rpx;
		padding-bottom: 20rpx;

		.tab-box {
			display: flex;

			&.info {
				display: block;
				padding-bottom: 20rpx;

				.desc {
					color: #232531;
					font-size: 28rpx;
					margin-top: 40rpx;
					line-height: 45rpx;
				}

				.lab-item {
					display: flex;
					margin-top: 40rpx;
					justify-content: space-between;

					view {
						&:last-child {
							font-weight: 500;
							color: #232531;
							font-size: 30rpx;
						}

						&:first-child {
							color: #858C9C;

							font-size: 30rpx;
						}
					}
				}

				.logo {
					display: flex;
					align-items: center;

					text {
						font-weight: bold;
						color: #1F272A;
						font-size: 32rpx;
						margin-left: 10rpx;
					}
				}
			}

			&.deal {
				justify-content: space-between;

				.tab-box-item {
					width: 40%;

					&:last-child {
						.item {
							text {
								&:last-child {
									color: #1E1F29;
								}
							}
						}
					}

					text {
						&.err {
							color: #F5475E !important;
						}
					}

					.title {
						display: flex;
						justify-content: space-between;
					}
				}
			}

			.tab-box-item {
				width: 50%;

				&.sell {
					.item {
						text {
							&:first-child {
								color: #F5475E;
							}

							&:last-child {
								color: #1E1F29;
							}
						}
					}
				}

				.item {
					color: #1E1F29;
					font-size: 22rpx;
					display: flex;
					justify-content: space-between;
					line-height: 30rpx;

					text {
						&:last-child {
							color: #2DBE87;
						}
					}

					margin-top: 16rpx;
				}

				.title {
					padding-bottom: 16rpx;
					color: #80858B;
					font-size: 24rpx;
				}
			}
		}
	}

	.tabs-box {
		::v-deep {
			.u-tabs__wrapper__nav__line {
				bottom: 0 !important;
			}
		}
	}

	.other-box {
		white-space: nowrap;
		overflow: auto;
		padding-right: 30rpx;

		view {
			display: inline-block;
			margin-left: 30rpx;
			color: #838B93;
			font-size: 20rpx;

			&.active {
				color: #000000;
			}
		}
	}

	.time-box {
		color: #838B93;
		font-size: 20rpx;
		display: flex;
		padding: 0 30rpx;
		padding-bottom: 20rpx;
		align-items: center;

		.box {
			white-space: nowrap;
			overflow: auto;
			display: flex;
			align-items: center;
			flex: 1;

			view {
				// display: inline-block;
				margin-left: 30rpx;

				&:first-child {
					margin-left: 0;
				}

				&.active {
					color: #000000;
				}
			}
		}

		.deep {
			margin-left: 30rpx;

			&.active {
				color: #000000;
			}
		}

		.lab {
			margin-right: 30rpx;
		}

		.lab,
		.deep {
			white-space: nowrap;
		}
	}

	.upper-box {
		display: flex;
		justify-content: space-between;
		height: 156rpx;
		padding: 0 30rpx;
		align-items: center;
		margin-bottom: 30rpx;

		.right {
			display: flex;
			width: 51%;
			flex-wrap: wrap;

			>view {
				width: 50%;

				&:first-child,
				&:nth-child(2) {
					margin-bottom: 15rpx;
				}
			}

			.lab {
				color: #838B93;
				white-space: nowrap;
				font-size: 20rpx;
			}

			.val {
				margin-top: 8rpx;
				color: #000000;
				font-size: 20rpx;
			}
		}

		.left {
			.unit {
				font-weight: 500;
				color: #1E1F29;
				font-size: 24rpx;

				text {
					font-weight: 500;
					margin-left: 16rpx;
					font-size: 28rpx;

					&.add {
						color: #2DBE87;
					}

					&.err {
						color: #F5475E;
					}
				}
			}

			.amount {
				font-weight: bold;
				color: #2DBE87;
				font-size: 56rpx;
			}
		}
	}

	.navCenterSolt {
		display: flex;
		align-items: center;

		text {
			font-weight: bold;
			color: #1E1F29;
			margin-left: 20rpx;
			font-size: 36rpx;
		}
	}

	@media (prefers-color-scheme: dark) {

		.navCenterSolt text,
		.upper-box .left .unit,
		.upper-box .right .val,
		.time-box .box view.active,
		.time-box .deep.active,
		.tab-content .tab-box .tab-box-item .item,
		.tab-content .tab-box .tab-box-item.sell .item text:last-child,
		.tab-content .tab-box.deal .tab-box-item:last-child .item text:last-child,
		.tab-content .tab-box.info .lab-item view:last-child,
		.tab-content .tab-box.info .desc,
		.tab-content .tab-box.info .logo text {
			color: #fff;
		}

		.fix-bar {
			background: #29313C;
		}

		.tabs-box {
			&.u-border-bottom {
				border-color: #343B45 !important;
			}
		}
	}
</style>
