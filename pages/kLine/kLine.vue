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
				<u-image @click="add"
					:src="require(tickerMarketInfo.collect == 1 ? '@/static/icon47.png' : '@/static/icon36.png')"
					width="48rpx" height="48rpx"></u-image>
			</view>
		</u-navbar>
		<view class="upper-box">
			<view class="left">
				<view class="amount">{{market.lastPrice}}</view>
				<view class="unit">
					≈ ¥{{market.lastPriceCny}} <text :class="{
						add:market.rangeAbility >= 0 ,
						err:market.rangeAbility < 0 ,
					}">{{market.rangeAbility >=0 ? '+':''}}{{utils.decimal(market.rangeAbility * 100,2) + '%'}}</text>
				</view>
			</view>
			<view class="right">
				<view>
					<view class="lab">{{$t('24h最高价')}}</view>
					<view class="val">{{tickerMarketInfo.highest}}</view>
				</view>
				<view>
					<view class="lab">{{$t('24h成交量')}}({{coinMarket.split('/')[0]}})</view>
					<view class="val">{{tickerMarketInfo.amount}}</view>
				</view>
				<view>
					<view class="lab">{{$t('24h最低价')}}</view>
					<view class="val">{{tickerMarketInfo.lowest}}</view>
				</view>
				<view>
					<view class="lab">{{$t('24h成交额')}}({{coinMarket.split('/')[1]}})</view>
					<view class="val">{{tickerMarketInfo.turnover}}</view>
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
					<text>{{coinIntroduction.coinName}}</text>
				</view>
				<view class="lab-item">
					<view>{{$t('发行时间')}}</view>
					<view>{{$moment(coinIntroduction.publishTime).format('YYYY-MM-DD')}}</view>
				</view>
				<view class="lab-item">
					<view>{{$t('发行总量')}}</view>
					<view>{{coinIntroduction.totalIssuance}}</view>
				</view>
				<view class="lab-item">
					<view>{{$t('流通总量')}}</view>
					<view>{{coinIntroduction.totalCirculation}}</view>
				</view>
				<view class="lab-item">
					<view>{{$t('发行价格')}}</view>
					<view>{{coinIntroduction.issuePrice}}</view>
				</view>
				<view class="lab-item">
					<view>{{$t('白皮书')}}</view>
					<view @click="$u.route({
						url:'/pages/webview/webview',
						params:{
							url:coinIntroduction.whitePaper
						}
					})">{{coinIntroduction.whitePaper}}</view>
				</view>
				<view class="lab-item">
					<view>{{$t('官网')}}</view>
					<view><text @click="$u.route({
						url:'/pages/webview/webview',
						params:{
							url:coinIntroduction.officialWebsite
						}
					})">{{coinIntroduction.officialWebsite}}</text></view>
				</view>
				<view class="lab-item">
					<view>{{$t('介绍')}}</view>
					<view></view>
				</view>
				<view class="desc">
					{{coinIntroduction.desc}}
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
		JSCommon,
		JSCHART_EVENT_ID
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
		getMarketDepth,
		queryCoinIntroduction,
		addOptionalMarket,
		getTickerMarket,
		deleteOptionalMarket
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
				coinMarket: '',
				tickerMarketInfo: {
					highest: 0,
					amount: 0,
					lowest: 0,
					turnover: 0
				},
				coinIntroduction: '',
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
				timeIndex: uni.getStorageSync('kLineIndex') || 5,
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
			if (uni.getStorageSync('kLineIndex')) {
				this.timeIndex = Number(uni.getStorageSync('kLineIndex'))
			} else {
				this.timeIndex = 5
			}
			this.coinMarket = options.coinMarket
			// this.init()
			let coin = this.coinMarket.split('/')
			queryCoinIntroduction({
				coinName: coin[0]
			}).then(e => {
				if (uni.getLocale() == 'zh') {
					e.desc = e.coinIntroduction
				} else {
					e.desc = e.coinIntroductionEnglish
				}
				this.coinIntroduction = e
			})
			this.tickerMarket()
		},

		onShow() {
			let topic = this.coinMarket.toLowerCase().replace('/', '-')
			uni.sendSocketMessage({
				data: '{"cmd":"sub","data":{},"id":"' + uni.$u.guid(20) +
					'","sendMsgSuccess":true,"topic":"alpha-market-depth-' + topic +
					'-trade"}'
			})

			this.$onSocketMessage((data) => {
				if (data.asks && data.symbolKey == this.coinMarket) {
					let {
						asks,
						bids
					} = data
					let newAsks = asks.slice(0, 5),
						newBids = bids.slice(0, 5)

					this.market.asks = newAsks
					this.market.bids = newBids
					this.market.lastPrice = data.lastPrice
					this.market.lastPriceCny = data.lastPriceCny
					this.market.rangeAbility = data.rangeAbility
				}

				if (data.coinMarket == this.coinMarket) {
					this.tickerMarketInfo.highest = data.highest
					this.tickerMarketInfo.amount = data.amount
					this.tickerMarketInfo.lowest = data.lowest
					this.tickerMarketInfo.turnover = data.turnover
				}
			})
			this.init()
			if (this.isShowDeep) {
				this.createDeepChart()
				return
			}
			this.ChangeKLinePeriod(this.timeNav[this.timeIndex].id, this.timeIndex);
		},
		watch: {
			theme(newValue, oldValue) {
				if (g_KLine.JSChart) {
					g_KLine.JSChart.StopAutoUpdate();
					g_KLine.JSChart = null;
				}

				if (d_Line.JSChart) {
					d_Line.JSChart.StopAutoUpdate();
					d_Line.JSChart = null;
				}

				if (this.isShowDeep) {
					this.createDeepChart()
					return
				}
				this.ChangeKLinePeriod(this.timeNav[this.timeIndex].id, this.timeIndex);
			}
		},
		onReady() {

		},

		onHide() {
			clearInterval(this.timer)
			if (g_KLine.JSChart) {
				g_KLine.JSChart.StopAutoUpdate();
				g_KLine.JSChart = null;
			}

			if (d_Line.JSChart) {
				d_Line.JSChart.StopAutoUpdate();
				d_Line.JSChart = null;
			}
			let topic = this.coinMarket.toLowerCase().replace('/', '-')
			uni.sendSocketMessage({
				data: '{"cmd":"unsub","data":{},"id":"' + uni.$u.guid(20) +
					'","sendMsgSuccess":true,"topic":"alpha-market-depth-' + topic +
					'-trade"}'
			})
		},

		onUnload() {
			clearInterval(this.timer)
			let topic = this.coinMarket.toLowerCase().replace('/', '-')
			uni.sendSocketMessage({
				data: '{"cmd":"unsub","data":{},"id":"' + uni.$u.guid(20) +
					'","sendMsgSuccess":true,"topic":"alpha-market-depth-' + topic +
					'-trade"}'
			})
			if (g_KLine.JSChart) {
				g_KLine.JSChart.StopAutoUpdate();
				g_KLine.JSChart = null;
			}

			if (d_Line.JSChart) {
				d_Line.JSChart.StopAutoUpdate();
				d_Line.JSChart = null;
			}


		},
		methods: {
			tickerMarket() {
				getTickerMarket({
					coinMarket: this.coinMarket
				}).then(e => {
					this.tickerMarketInfo = e
				})
			},
			add() {
				if (!uni.getStorageSync('token')) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return
				}
				if (this.tickerMarketInfo.collect == 1) {
					deleteOptionalMarket({
						coinMarket: this.coinMarket
					}).then(() => {
						this.tickerMarketInfo.collect = 0
						uni.showToast({
							title: this.$t('操作成功！')
						})
					})
				} else {
					addOptionalMarket({
						coinMarket: this.coinMarket
					}).then(() => {
						this.tickerMarketInfo.collect = 1
						uni.showToast({
							title: this.$t('操作成功！')
						})
					})
				}
			},
			next(type) {
				uni.setStorage({
					key: 'barIndex',
					data: {
						index: type,
						coin: this.coinMarket
					}
				})
				uni.switchTab({
					url: '/pages/transaction/transaction'
				})
			},
			init() {
				clearInterval(this.timer)
				this.tickerMarket()
				getMarketDeeps({
					coinMarket: this.coinMarket,
					type: 'detail'
				}).then(e => {
					if (!Boolean(e)) {
						this.market.symbolKey = this.coinMarket
						return
					}
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

				this.queryUserEntrustList()

				this.timer = setInterval(this.queryUserEntrustList, 3000)
			},
			queryUserEntrustList() {
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

				const theme = this.theme
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
						// datatype: "snapshot" ,//全量数据  
						datatype: "update" //全量数据
					};
					callback(hqChartData);
				})
			},
			rightClick() {

			},
			//
			CreateKLineChart: function() {
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

				// //注册监听事件         
				// g_KLine.JSChart.AddEventCallback({
				// 	event: JSCommon.JSCHART_EVENT_ID.RECV_START_AUTOUPDATE,
				// 	callback: this.startKlineAutoUpdate
				// });
				// g_KLine.JSChart.AddEventCallback({
				// 	event: JSCommon.JSCHART_EVENT_ID.RECV_STOP_AUTOUPDATE,
				// 	callback: this.stopKlineAutoUpdate
				// });
			},
			// startKlineAutoUpdate(data) {
			// 	console.log('[startAutoUpdate] data', data);
			// 	//根据data.Stock.Period周期，使用websocket下载对应的当天日线或当天分钟数据
			// 	//数据转换成hqchart接口，使用data.Callback(data) 更新到HQChart中

			// 	console.log(this.KLine.Option.KLine.Period);
			// },
			// stopKlineAutoUpdate(data){

			// },
			//K线周期切换
			ChangeKLinePeriod(period, index) {
				this.timeIndex = index
				uni.setStorageSync('kLineIndex', String(index))
				this.isShowDeep = false
				this.KLine.Option.KLine.Period = this.timeNav[this.timeIndex].id

				if (!g_KLine.JSChart) //不存在创建
				{
					this.CreateKLineChart();
				} else {
					g_KLine.JSChart.ChangePeriod(this.KLine.Option.KLine.Period);
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
			marketKline(type, dimension, fn) {
				getMarketKline({
					coinMarket: this.coinMarket,
					dimension
				}).then(res => {
					let coin = this.coinMarket.split('/')
					let formatData = res.map(item => {
						let klineArray
						if (type == 'ReqeustHistoryMinuteData') {
							klineArray = [
								Number(this.$moment(item.time * 1000).format('YYYYMMDD')), //日期
								null, //前收盘价
								Number(item.open), //开盘价
								Number(item.high), //最高
								Number(item.low), //最低
								Number(item.close), //收盘价
								Number(item.amount), //成交量
								Number(item.turnover), //成交金额
								Number(this.$moment(item.time * 1000).format('HHmm')), //日期格式
							]
						} else if (type == 'RequestHistoryData') {
							klineArray = [
								Number(this.$moment(item.time * 1000).format('YYYYMMDD')), //日期
								null, //前收盘价
								Number(item.open), //开盘价
								Number(item.high), //最高
								Number(item.low), //最低
								Number(item.close), //收盘价
								Number(item.amount), //成交量
								Number(item.turnover), //成交金额
							]
						}
						return klineArray
					})

					let data = {
						symbol: coin[0] + coin[1] + '.BIT',
						name: coin[0] + coin[1],
						code: 0,
						data: formatData
					}

					if (type == 'RequestRealtimeData') { //	日线最新
						const RequestRealtimeData = res[res.length - 1]
						data = {
							"code": 0,
							stock: [{
								"symbol": coin[0] + coin[1] + '.BIT',
								"name": RequestRealtimeData.coinMarket,
								"date": Number(this.$moment(RequestRealtimeData.time * 1000).format(
									'YYYYMMDD')),
								"yclose": null,
								"open": Number(RequestRealtimeData.open),
								"high": Number(RequestRealtimeData.high),
								"low": Number(RequestRealtimeData.low),
								"price": Number(RequestRealtimeData.rangeAbilityAmount),
								"vol": Number(RequestRealtimeData.amount),
								"amount": Number(RequestRealtimeData.turnover)
							}]
						}
					}

					if (type == 'RequestMinuteRealtimeData') { //	最新分钟线
						data = {
							"code": 0,
							data: []
						}

						for (let i = 0; i <= 2; i++) //更新最新的3条数据
						{
							data.data.push(res[i]);
						}
					}

					fn(data)
				})
			},
			NetworkFilter: function(data, callback) {
				data.PreventDefault = true
				switch (data.Name) {
					case 'KLineChartContainer::ReqeustHistoryMinuteData':
						this.marketKline('ReqeustHistoryMinuteData', this.timeNav[this.timeIndex].key, data =>
							callback({
								data
							}))
						break;
					case 'KLineChartContainer::RequestMinuteRealtimeData':
						this.marketKline('RequestMinuteRealtimeData', this.timeNav[this.timeIndex].key, data =>
							callback({
								data
							}))
						break
					case 'KLineChartContainer::RequestHistoryData':
						this.marketKline('RequestHistoryData', this.timeNav[this.timeIndex].key, data => callback({
							data
						}))
						break
					case 'KLineChartContainer::RequestRealtimeData':
						this.marketKline('RequestRealtimeData', this.timeNav[this.timeIndex].key, data => callback({
							data
						}))
				}
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
		.tab-content .tab-box.info .logo text,
		.other-box view.active {
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
