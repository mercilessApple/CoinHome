<template>
	<view>
		<u-navbar placeholder title="" @rightClick="rightClick" :autoBack="true">
			<view class="navCenterSolt" slot='center'>
				<u-image src="/static/icon32.png" width="48rpx" height="48rpx"></u-image>
				<text>BTC/USDT</text>
			</view>
			<view slot="right">
				<u-image src="/static/icon36.png" width="48rpx" height="48rpx"></u-image>
			</view>
		</u-navbar>
		<view class="upper-box">
			<view class="left">
				<view class="amount">22,875.81</view>
				<view class="unit">
					≈ ¥154,411.72 <text>-3.18%</text>
				</view>
			</view>
			<view class="right">
				<view>
					<view class="lab">24h最高价</view>
					<view class="val">23,771.80</view>
				</view>
				<view>
					<view class="lab">24h成交量(BTC)</view>
					<view class="val">23,771.80</view>
				</view>
				<view>
					<view class="lab">24h最低价</view>
					<view class="val">23,771.80</view>
				</view>
				<view>
					<view class="lab">24h成交额(USDT)</view>
					<view class="val">23,771.80</view>
				</view>
			</view>
		</view>
		<view class="time-box">
			<view class="lab">分时</view>
			<view class="box">
				<view :class="{
					'active':index == timeIndex
				}" v-for="(item,index) in timeNav" :key="index" @click="ChangeKLinePeriod(item.id,index)">
					{{item.text}}
				</view>
			</view>
			<view @click="createDeep" class="deep" :class="{
				active:isShowDeep
			}">深度图</view>
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

		<!-- 		<view class="button-sp-area">
			<button class="mini-btn" type="default" size="mini" @click="ChangeSymbol('000001.sz')">000001.sz</button>
			<button class="mini-btn" type="default" size="mini" @click="ChangeSymbol('600000.sh')">600000.sh</button>
		</view> -->
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
		DEPTH_TEST,
		DEPTH_TEST2
	} from "./deepTestData.js"

	import {
		KLineOption,
		DeepOption
	} from '@/utils/KLineOption.js'

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
						text: '1分钟',
						id: PERIOD_ID.KLINE_MINUTE_ID
					},
					{
						text: '5分钟',
						id: PERIOD_ID.KLINE_5MINUTE_ID
					},
					{
						text: '15分钟',
						id: PERIOD_ID.KLINE_15MINUTE_ID
					},
					{
						text: '30分钟',
						id: PERIOD_ID.KLINE_30MINUTE_ID
					},
					{
						text: '60分钟',
						id: PERIOD_ID.KLINE_60MINUTE_ID
					},
					{
						text: '日线',
						id: PERIOD_ID.KLINE_DAY_ID
					},
					{
						text: '周线',
						id: PERIOD_ID.KLINE_WEEK_ID
					},
					{
						text: '月线',
						id: PERIOD_ID.KLINE_MONTH_ID
					},
					{
						text: '年线',
						id: PERIOD_ID.KLINE_YEAR_ID
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
				PERIOD_ID: PERIOD_ID,
			};
			return data;
		},

		onLoad() {
			uni.onThemeChange(({
				theme
			}) => {
				let themeId, themeStyle
				if (theme == 'dark') themeStyle = JSCommonHQStyle.GetStyleConfig(JSCommonHQStyle.STYLE_TYPE_ID
					.BLACK_ID)
				else themeStyle = JSCommonHQStyle.GetStyleConfig(JSCommonHQStyle.STYLE_TYPE_ID.WHITE_ID)
				JSCommon.JSChart.SetStyle(themeStyle);
			})

		},

		onReady() {
			this.ChangeKLinePeriod(PERIOD_ID.KLINE_DAY_ID, 5);
		},

		methods: {
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
				this.TestID = 0;
				var symbol = data.Request.Data.symbol.toUpperCase();

				this.TestID++;
				if (this.TestID % 2 == 0) var recvData = DEPTH_TEST;
				else var recvData = DEPTH_TEST2;

				var hqChartData = {
					code: 0,
					asks: recvData.asks, //卖盘
					bids: recvData.bids, //买盘 
					datatype: "snapshot" //全量数据  
				};
				callback(hqChartData);
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

				g_KLine.JSChart = JSCommon.JSChart.Init(element);
				this.KLine.Option.NetworkFilter = this.NetworkFilter;
				this.KLine.Option.Symbol = this.Symbol;
				this.KLine.Option.IsFullDraw = true; //每次手势移动全屏重绘
				g_KLine.JSChart.SetOption(this.KLine.Option);
			},

			//K线周期切换
			ChangeKLinePeriod(period, index) {
				if (!g_KLine.JSChart) //不存在创建
				{
					this.KLine.Option.Period = period;
					this.CreateKLineChart();
				} else {
					g_KLine.JSChart.ChangePeriod(period);
				}
				this.timeIndex = index
				this.isShowDeep = false
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

			NetworkFilter: function(data, callback) {
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
	page {
		/* background-color: #000; */
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
					margin-bottom: 5rpx;
				}
			}

			.lab {
				color: #838B93;

				font-size: 20rpx;
			}

			.val {
				margin-top: 6rpx;
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
					color: #F5475E;
					font-size: 28rpx;
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

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50upx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
