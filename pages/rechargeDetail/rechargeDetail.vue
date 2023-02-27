<template>
	<view class="container">
		<u-navbar :leftIconColor="theme == 'light' ? '' : '#fff'" :bgColor="theme == 'light' ? '#F6F6F6':'#171E28' "
			placeholder title="" @rightClick="$u.route({
				url:'/pages/financialRecords/financialRecords',
				params:{
					coin,
					coinId:curCoin[0].coinId
				}
			})" :autoBack="true">
			<view class="u-nav-slot" slot="right">
				<u-image src="@/static/icon25.png" width="48rpx" height="48rpx"></u-image>
			</view>
		</u-navbar>

		<view class="coin-box">
			<view class="left">
				<u-image v-if="curCoin != '' && curCoin[0].iconUrl != ''" width="48rpx" height="48rpx" :src="curCoin[0].iconUrl"></u-image>
				<text>{{curCoin == '' ? '' :curCoin[0].coinName}}</text>
			</view>
			<view class="right" @click="show = true">
				<u-image src="@/static/icon26.png" width="48rpx" height="48rpx"></u-image>
			</view>
		</view>

		<view class="content">
			<view class="main-work">
				<view class="left">
					<view>{{$t('主网')}}</view>
					<view :style="{
						'color':curNet == '' ? '#888C95' : theme == 'light' ? '#000000' :'#fff'
					}">{{curNet == '' ? $t('请先选择主网'):curNet.chainName}}</view>
				</view>
				<view class="right" @click="showNet = true">
					<u-image src="@/static/icon26.png" width="48rpx" height="48rpx"></u-image>
				</view>
			</view>

			<block v-if="scene == 'withdraw'">
				<u-gap height="20rpx"></u-gap>
				<view class="withdraw address">
					<view class="tit">{{$t('提币地址')}}</view>
					<u-input :color="theme == 'light' ? '' : '#fff'" v-model="beneficiaryAddress" fontSize="26rpx"
						:placeholder="$t('请输入收款地址')" :customStyle="{
						background: theme == 'light' ? '#F6F6F6' : '#29313C',
						height:'90rpx',
						'padding':'0 30rpx'
					}" border="none">
						<template slot="suffix">
							<u-image @click="scan" src="@/static/icon27.png" width="48rpx" height="48rpx"></u-image>
						</template>
					</u-input>
					<view class="withdraw-tip">{{$t('*请在转账前务必确认地址及币种信息无误！一旦转出，不可撤回！')}}</view>
				</view>
				<view class="withdraw amount" v-if="curCoin != ''">
					<view class="tit">{{$t('提币数额')}}</view>
					<u-input :color="theme == 'light' ? '' : '#fff'" v-model="withdrawalAmount" type="number"
						fontSize="26rpx" :placeholder="$t('请输入提币数量')" :customStyle="{
						background: theme == 'light' ? '#F6F6F6' : '#29313C',
						height:'90rpx',
						'padding':'0 30rpx'
					}" border="none">
						<template slot="suffix">
							<view class="unit">
								<text>{{curCoin[0].coinName}}</text>
								<text @click="withdrawalAmount = curCoin[0].amount">{{$t('全部')}}</text>
							</view>
						</template>
					</u-input>
					<view class="withdraw-tip"><text>{{$t('余额')}}：{{curCoin[0].amount}}</text>
						{{curCoin[0].coinName}}
					</view>
				</view>
			</block>

			<block v-if="scene == ''">
				<view class="code">
					<uqrcode :hide="curNet == ''" :value="curNet == '' ? '': curNet.address" :size="upx" ref="uqrcode"
						canvas-id="qrcode">
					</uqrcode>
				</view>

				<view v-if="curNet == ''" class="tip">{{$t('选择主网后方能获取充值地址')}}</view>
				<view class="code-info" v-else>
					<view>
						<text>{{$t('充值地址')}}</text>
						<u-image @click="copy" width="28rpx" height="28rpx" src="@/static/icon16.png"></u-image>
					</view>
					<view>
						{{curNet.address}}
					</view>
				</view>
			</block>
			<u-popup :bgColor="theme == 'light' ? '#fff' : '#1F282F'" @close="show = false" :show="show" round="20rpx"
				closeable>
				<view class="coin-popup">
					<view class="title">{{$t('选择币种')}}</view>
					<view class="search">
						<u-search :color="theme == 'light' ? '' :'#fff'" @search="search" :showAction="false"
							:placeholder="$t('请输入您要搜索的币种名称')" height="72rpx"
							:bgColor="theme == 'light' ? '#EBECF0' :'#2C303C' ">
						</u-search>
					</view>
					<view class="box">
						<view class="list">
							<view class="item" v-for="(item,index) in coinList" :key="index" @click="select(item)">
								<view class="left">
									<u-image width="48rpx" height="48rpx" :src="item.iconUrl"></u-image>
									<text>{{item.coinName}}</text>
								</view>
								<view class="right">
									<view>{{$t('可用余额')}}</view>
									<view>{{item.amount}}</view>
								</view>
							</view>
							<block v-if="coinList == ''">
								<u-gap height="100rpx"></u-gap>
								<u-empty :text="$t('暂无数据')"></u-empty>
							</block>
						</view>
					</view>
				</view>
			</u-popup>

			<u-popup @close="showNet = false" :show="showNet" round="20rpx" closeable
				:bgColor="theme == 'light' ? '#fff' : '#1F282F'">
				<view class="coin-popup">
					<view class="title">{{$t('选择网络')}}</view>
					<view class="warning">
						<u-alert showIcon type="warning"
							:description="$t('当您充值该币种时，请仅限于通过下方CoinHome支持的网络充值，如您通过其他网络充值会造成资金丢失。')"></u-alert>
					</view>
					<view class="box">
						<view class="list">
							<view class="item" style="padding: 0;" v-for="(item,index) in chainList" :key="index"
								@click="selectNet(item)">
								<view class="left">
									<text style="margin-left: 0;">{{item.chainName}}</text>
								</view>
							</view>
							<block v-if="chainList == ''">
								<u-gap height="100rpx"></u-gap>
								<u-empty :text="$t('暂无数据')"></u-empty>
							</block>
						</view>
					</view>
				</view>
			</u-popup>
			<u-modal @cancel="showPwd = false" :showConfirmButton="false" @close="showPwd = false"
				:confirmColor="theme == 'light' ? '#2D270D' : '#fff'" showCancelButton :show="showPwd"
				:title="$t('资金密码')">
				<view>
					<u-code-input focus space="2rpx" @finish="finish" fontSize="70rpx" size="100rpx"
						borderColor="transparent" v-model="password" mode="box" dot>
					</u-code-input>
				</view>
			</u-modal>
		</view>
		<view class="btn-box" v-if=" curNet != '' && scene == ''">
			<view class="btn" @click="save">{{$t('保存图片')}}</view>
			<u-safe-bottom></u-safe-bottom>
		</view>

		<view class="btn-content" v-if="scene == 'withdraw' && curCoin != ''">
			<view class="box">
				<view class="btn-tip">
					<text>{{$t('手续费')}}：</text>{{curCoin[0].tranOutFee || 0}} {{curCoin[0].coinName}}
					<text
						style="margin-left: 60rpx;">{{$t('实际到账')}}：</text>{{curCoin[0].amount - (curCoin[0].tranOutFee || 0)}}
					{{curCoin[0].coinName}}
				</view>
				<view @click="submit">
					{{$t('提交')}}
				</view>
			</view>
			<u-safe-bottom></u-safe-bottom>
		</view>


	</view>
</template>

<script>
	import {
		queryDepositPayCoin,
		queryWithdrawCoin,
		withdraw
	} from "@/config/api"
	import {
		hex_md5
	} from "@/utils/md5.js"
	export default {
		data() {
			return {
				showPwd: false,
				password: '',
				withdrawalAmount: '',
				curNet: '',
				beneficiaryAddress: "",
				upx: uni.upx2px(328),
				show: false,
				showNet: false,
				coinList: [],
				curCoin: [],
				chainList: [],
				coin: '',
				scene: '',
				tranOutFee: 0
			};
		},
		onLoad(options) {
			this.coin = options.coin
			this.scene = options.scene || ''
			queryWithdrawCoin().then(e => {
				this.coinList = e
				this.oriList = e
				if (options.coin) {
					let find = e.filter(item => item.coinName == options.coin)
					if (find == '') {
						this.curCoin = [{
							coinName: this.$t('选择币种'),
							iconUrl:''
						}]
						return
					}
					this.curCoin = find
				} else {
					this.curCoin = e
				}

				queryDepositPayCoin().then(e => {
					this.chainList = e.filter(item => item.coinId == this.curCoin[0].coinId)[0].list
				})
			})
		},
		methods: {
			finish() {
				uni.showLoading({
					title: this.$t('加载中...'),
					mask: true
				})
				withdraw({
					toAddress: this.beneficiaryAddress,
					amount: this.withdrawalAmount,
					coinId: this.curCoin[0].coinId,
					chainName: this.curNet.chainName,
					fundsPassword: hex_md5(this.password).toUpperCase()
				}).then(e => {
					queryWithdrawCoin().then(res => {
						this.curCoin = res.filter(item => item.coinId == this.curCoin[0].coinId)
					})
					uni.showToast({
						title: this.$t('操作成功！')
					})
					this.showPwd = false
				})
			},
			submit() {
				if (this.curNet == '') {
					uni.showToast({
						title: this.$t('请先选择主网'),
						icon: 'none'
					})
					return
				}
				if (this.beneficiaryAddress == '') {
					uni.showToast({
						title: this.$t('请输入收款地址'),
						icon: 'none'
					})
					return
				}
				if (this.withdrawalAmount == '') {
					uni.showToast({
						title: this.$t('请输入提币数量'),
						icon: 'none'
					})
					return
				}
				this.showPwd = true
			},
			scan() {
				const self = this
				uni.scanCode({
					success: e => {
						setTimeout(() => {
							self.beneficiaryAddress = e.result
						}, 500)
					}
				})
			},
			save() {
				// 通过uni.createCanvasContext方式创建绘制上下文的，对应导出API为uni.canvasToTempFilePath
				// 调用完ctx.draw()方法后不能第一时间导出，否则会异常，需要有一定的延时
				uni.showLoading({
					title: this.$t('加载中...')
				})
				setTimeout(() => {
					uni.canvasToTempFilePath({
							canvasId: 'qrcode',
							success: ({
								tempFilePath
							}) => {
								uni.saveImageToPhotosAlbum({
									filePath: tempFilePath,
									success: res => {
										uni.showToast({
											title: this.$t('操作成功！')
										})
									},
									fail: err => {
										uni.showToast({
											title: JSON.stringify(err)
										})
									}
								});
							},
							fail: err => {
								uni.showToast({
									title: JSON.stringify(err)
								})
							}
						},
						// this // 组件内使用必传当前实例
					);
				}, 300);
			},
			copy() {
				uni.setClipboardData({
					data: this.curNet.address
				})
			},
			search(key) {
				if (key == '') {
					this.coinList = this.oriList
					return
				}
				this.coinList = this.oriList.filter(item => item.coinName == key)
			},
			selectNet(item) {
				this.curNet = item
				this.showNet = false
			},
			select(item) {
				this.curCoin = [item]
				this.chainList = item.list
				this.show = false
			}
		},
	}
</script>

<style lang="scss">
	::v-deep {
		.u-code-input__item {
			background: #F6F6F6;
		}
	}

	.btn-content {
		background-color: #FFFFFF;
		padding: 20rpx 30rpx;

		.box {
			>view {
				&:last-child {
					line-height: 80rpx;
					margin-top: 20rpx;
					background: #FEFA05;
					font-weight: 500;
					color: #2D270D;
					font-size: 32rpx;
					text-align: center;
					border-radius: 8rpx;
				}
			}

			.btn-tip {
				font-size: 24rpx;
				font-weight: 500;
				color: #0F0F0F;

				text {
					color: #B7BABF;
				}
			}
		}
	}

	.withdraw {
		margin-top: 60rpx;

		.tit {
			font-weight: 500;
			color: #0F0F0F;
			font-size: 28rpx;
			margin-bottom: 20rpx;
		}

		&.amount {
			.withdraw-tip {
				font-weight: 500;
				font-size: 24rpx;
				margin-top: 20rpx;

				text {
					color: #B7BABF;
				}
			}

			.unit {
				text {
					font-weight: 500;
					font-size: 26rpx;

					&:first-child {
						color: #060606;
					}

					&:last-child {
						margin-left: 42rpx;
						color: #FE9205;
					}
				}
			}
		}

		&.address {
			.withdraw-tip {
				margin-top: 20rpx;
				color: #FE9205;
				font-size: 20rpx;
			}
		}
	}

	.btn-box {
		padding: 20rpx 30rpx;

		.btn {
			line-height: 80rpx;
			background: #FEFA05;
			font-weight: 500;
			color: #2D270D;
			font-size: 32rpx;
			text-align: center;
			border-radius: 8rpx;
		}
	}

	.code-info {
		margin: 0 30rpx;
		background: #F6F6F6;
		margin-top: 80rpx;
		padding: 30rpx;

		>view {
			&:last-child {
				text-align: center;
				margin-top: 22rpx;
				color: #888C95;
				font-size: 24rpx;
			}

			&:first-child {
				display: flex;
				align-items: center;
				justify-content: center;

				text {
					margin-right: 30rpx;
					color: #888C95;
					font-size: 28rpx;
				}
			}
		}
	}

	.coin-popup {
		.warning {
			padding: 0 30rpx;
		}

		.box {
			height: 700rpx;
			overflow: auto;
		}

		.list {
			// padding: 0 30rpx;

			.item {
				margin: 0 30rpx;
				padding: 0 20rpx;
				margin-top: 20rpx;
				height: 136rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.right {
					view {
						&:last-child {
							font-weight: 500;
							color: #1F1E23;
							font-size: 32rpx;
							margin-top: 20rpx;
							text-align: right;
						}

						&:first-child {
							font-weight: 500;
							color: #929BA2;

							font-size: 24rpx;
						}
					}
				}

				.left {
					display: flex;
					align-items: center;

					text {
						font-size: 32rpx;
						margin-left: 20rpx;
						font-weight: 500;
						color: #1F1E23;
					}
				}
			}
		}

		.search {
			padding: 0 30rpx;
			padding-bottom: 20rpx;
		}

		.title {
			font-weight: 500;
			color: #1F1E23;
			font-size: 30rpx;
			text-align: center;
			line-height: 114rpx;

		}
	}

	.tip {
		height: 136rpx;
		background: #F6F6F6;
		border-radius: 8rpx;
		margin-top: 80rpx;
		color: #888C95;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 30rpx;
		font-size: 28rpx;
	}

	.code {
		width: 328rpx;
		height: 328rpx;
		margin: 0 auto;
		margin-top: 80rpx;
		background: #F6F6F6;
		border-radius: 12rpx;
	}

	.main-work {
		background: #F6F6F6;
		border-radius: 8rpx;
		padding: 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.left {
			view {
				&:first-child {

					color: #888C95;
					font-size: 28rpx;
				}

				&:last-child {
					margin-top: 16rpx;
					font-weight: 500;
					color: #B7BABF;
					font-size: 32rpx;
				}
			}
		}
	}

	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.content {
		flex: 1;
		background: #FFFFFF;
		padding: 0 30rpx;
		padding-top: 56rpx;
		border-radius: 40rpx 40rpx 0px 0px;
	}

	.coin-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 30rpx;
		margin: 0 30rpx;

		height: 96rpx;

		.left {
			display: flex;
			align-items: center;

			text {
				margin-left: 20rpx;
				font-weight: 500;
				color: #23282E;
				font-size: 40rpx;
			}
		}
	}

	page {
		background-color: #F6F6F6;
	}

	@media (prefers-color-scheme: dark) {
		page {
			background-color: #171E28;
		}

		.coin-box .left text,
		.coin-popup .title,
		.coin-popup .list .item .left text,
		.coin-popup .list .item .right view:last-child,
		.withdraw .tit,
		.btn-content .box .btn-tip,
		.withdraw.amount .unit text:first-child {

			color: #FFFFFF;
		}

		.btn-content {
			background-color: #1F282F;
		}

		.coin-popup .warning {
			::v-deep {
				.u-alert--warning--light {
					background-color: #36342F !important;
				}
			}
		}

		.main-work,
		.code,
		.code-info,
		.tip {
			background: #343A46;
		}

		.coin-popup .list .item {
			border-radius: 8rpx;
			background: #29313C;
			padding: 0 20rpx !important;
		}

		.btn-box {

			background: #29313C;
		}

		.content {
			background: #1F282F
		}

		::v-deep {

			.u-modal__button-group__wrapper--hover {
				background-color: transparent;
			}

			.u-line {
				border-bottom-color: #343B45 !important;
			}

			.u-code-input__item {
				background: #29313C;
			}

			.u-popup__content {
				background-color: #1F282F;
			}

			.u-code-input__item__dot {
				background-color: #fff !important
			}
		}
	}
</style>
