import App from './App'
import messages from './locale/index'
import uView from './uni_modules/uview-ui'
import Mixin from './mixin/mixin.js'
import moment from "moment";

const i18nConfig = {
	locale: uni.getLocale(),
	messages
}

// #ifndef VUE3
import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(uView)

Vue.use(VueI18n)
Vue.mixin(Mixin)
const i18n = new VueI18n(i18nConfig)
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
	i18n,
	...App
})

Vue.prototype.$moment = moment

app.$mount()
// 引入请求封装，将app参数传递到配置中
require('./config/request.js')(app)
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
import {
	createI18n
} from 'vue-i18n'
const i18n = createI18n(i18nConfig)
export function createApp() {
	const app = createSSRApp(App)
	app.use(i18n)
	return {
		app
	}
}
// #endif
