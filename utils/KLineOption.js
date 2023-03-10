export const KLineOption = {
	Type: '历史K线图',
	Language: uni.getLocale().toUpperCase(),
	IsCorssOnlyDrawKLine: true,
	IsClickShowCorssCursor: true, //手势点击出现十字光标
	EnableScrollUpDown: true, //允许手势上下操作滚动页面
	Windows: //窗口指标
		[{
				Index: "MA",
				Modify: false,
				Change: false
			},
			{
				Index: "VOL",
				Modify: false,
				Change: false
			},
			{
				Index: "MACD",
				Modify: false,
				Change: false
			},
		],
	IsApiPeriod: true,
	IsAutoUpdate: true, //是自动更新数据
	AutoUpdateFrequency: 1000,
	CorssCursorTouchEnd: true,

	IsShowRightMenu: true, //右键菜单
	IsShowCorssCursorInfo: true, //是否显示十字光标的刻度信息
	CorssCursorInfo: {
		Left: 2,
		Right: 2
	},
	Border: //边框
	{
		Left: 1,
		// Right: 50, //右边间距
		Top: 25,
		Bottom: 25,
		AutoRight:{ Blank:10, MinWidth:30 },
	},
	KLineTitle: //标题设置
	{
		IsShowName: true, 
		IsShowSettingInfo: true 
	},

	KLine: {
		DragMode: 1,
		Right: 0, //复权 0 不复权 1 前复权 2 后复权
		Period: 0, //周期: 0 日线 1 周线 2 月线 3 年线 
		PageSize: 30,
		IsShowTooltip: true
	},

	Frame: //子框架设置 (Height 窗口高度比例值)
		[
			// {
			// 	SplitCount: 3,
			// 	//Height:4,
			// 	IsShowLeftText: true,
			// 	IsShowRightText: false
			// },
			// {
			// 	SplitCount: 2,
			// 	//Height:2,
			// 	IsShowLeftText: true,
			// 	IsShowRightText: false
			// },
			// {
			// 	SplitCount: 2,
			// 	//Height:2,
			// 	IsShowLeftText: true,
			// 	IsShowRightText: false
			// },
			{
				SplitCount: 3,
				StringFormat: 0,
				IsShowLeftText: false
			},
			{
				SplitCount: 2,
				StringFormat: 0,
				IsShowLeftText: false
			},
			{
				SplitCount: 2,
				StringFormat: 0,
				IsShowLeftText: false
			}

		],

	ExtendChart: [{
		Name: 'KLineTooltip'
	}]
}

export const DeepOption = {
	Language: uni.getLocale().toUpperCase(),
	Type: '深度图', //创建图形类型
	EnableZoomUpDown: {
		//Wheel:false,
		//Keyboard:false,
		//Touch:false,
	},
	Symbol: 'BTCBUSD.bit',
	IsAutoUpdate: true, //是自动更新数据
	AutoUpdateFrequency: 1000,
	//CorssCursorTouchEnd:true,
	EnableScrollUpDown: true,
	MaxVolRate: 1.2,
	CorssCursorInfo: {
		HPenType: 0,
		VPenType: 1,
		IsShowTooltip: true
	},
	Listener: {
		//KeyDown:false,
		//Wheel:false
	},
	Border: //边框
	{
		Left: 0, //左边间距
		Right: 40, //右边间距
		Bottom: 25, //底部间距
		Top: 0 //顶部间距
	},
	//框架设置
	Frame: {
		SplitCount: 6,
		IsShowLeftText: false,
		XLineType: 3
	}
}
