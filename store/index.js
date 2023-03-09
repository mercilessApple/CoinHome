// 页面路径：store/index.js 
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex); //vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
	state: { //存放状态
		"alpha-market-ticker": "",
		"alpha-market-depth-trade": ""
	},
	mutations: {
		onAlphaMarketTickerRender(state, payload) {
			state['alpha-market-ticker'] = payload
		},
		onAlphaMarketDepthTradeRender(state, payload) {
			state['alpha-market-depth-trade'] = payload
		}
	},
	actions: {
		onAlphaMarketTickerChange(context, payload) {
			context.commit('onAlphaMarketTickerRender', payload)
		},
		onAlphaMarketDepthTradeChange(context, payload) {
			context.commit('onAlphaMarketDepthTradeRender', payload)
		}
	}
})
export default store
