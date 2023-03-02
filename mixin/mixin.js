export default {
	data() {
		return {
			theme: uni.getSystemInfoSync().theme
		}
	},
	created() {
		uni.onThemeChange(({
			theme
		}) => {
			this.theme = theme
		})
	},
	onShow() {

	},
	methods: {
		/**
		 * 设置明暗对应参数
		 */
		inverseParams(lightText = '', darkText = '') {
			if (this.theme == 'light') return lightText
			else return darkText
		},
		geTel(tel) {
			return tel.substring(0, 3) + "****" + tel.substr(tel.length - 4);
		},
		regEmail(email) {
			if (String(email).indexOf('@') > 0) {
				let str = email.split('@'),
					_s = ''
				if (str[0].length > 3) {
					for (let i = 0; i < str[0].length - 6; i++) {
						_s += '*'
					}
				}
				var new_email = str[0].substr(0, 3) + _s + '@' + str[1]
			}
			return new_email
		},
	}
}
