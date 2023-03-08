<template>
	<view>
		<view class="title">
			{{$t('taskCenter')}}
		</view>
		<view class="tabs u-border-bottom">
			<u-tabs lineWidth="40rpx" lineHeight="8rpx" lineColor="#FEFA05" :list="uTabs" :activeStyle="{
						'color':theme == 'light' ? '#23282E' : '#fff'
					}" inactiveStyle="color:#8A8B9B" @click="({index})=>uTabsIndex = index"></u-tabs>
		</view>

		<view class="content">
			<view class="new-hand-task" v-show="uTabsIndex == 0">
				<block v-if="noLogin">
					<u-gap height="240rpx"></u-gap>
					<u-empty :show="noLogin" :text="$t('请先登录')"></u-empty>
				</block>
				
				<u-loading-icon mode="circle" :show="newTaskLoading && !noLogin"></u-loading-icon>
				
				<block v-if="!newTaskLoading && !noLogin">
					<view class="item">
						<view class="box-title">{{$t('任务奖励')}}:</view>
						<view class="desc">{{$t('价值50RMB等额的数字货币盲盒: BTC / ETH / USDT / GODE/ BAYE等。')}}</view>
					</view>
					<view class="item">
						<view class="box-title">{{$t('任务规则')}}:</view>
						<view class="rule">
							<text>1.{{$t('完成账号注册')}} </text><text :class="{
							'success':newTaskData.completedRegister
						}">{{$t('已完成')}}</text>
						</view>
						<view class="rule">
							<text>2.{{$t('完成进阶身份验证')}} </text><text
								@click="newTaskData.completeAdvancedAuthentication ? false:$u.route('/pages/authentication/authentication')"
								:class="{
							'success':newTaskData.completeAdvancedAuthentication
						}">{{$t(newTaskData.completeAdvancedAuthentication? '已完成' :'去验证')}} ></text>
						</view>
						<view class="rule">
							<text>3.{{$t('为您的账户注资')}} </text><text
								@click="newTaskData.completeDeposit?false:$u.route('/pages/recharge/recharge')" :class="{
							'success':newTaskData.completeDeposit
						}">{{$t(newTaskData.completeDeposit ? '已完成':'去充值')}} ></text>
						</view>
						<view class="rule">
							<text>4.{{$t('完成首次现货交易')}} </text><text @click="newTaskData.completeSpotTrade? false :toTrade()"
								:class="{
							'success':newTaskData.completeSpotTrade
						}">{{$t(newTaskData.completeSpotTrade ?'已完成': '去交易')}} ></text>
						</view>
					</view>
					<div class="tip">
						{{$t(`*注：在账户注册后7天内完成所有任务，即可获得奖励，奖励
					将自动投放至用户账户资产。`)}}
					</div>
				</block>
			</view>

			<view class="limit-task" v-show="uTabsIndex == 1">
				<u-gap height="300rpx"></u-gap>
				<u-empty :text="$t('暂无数据')"></u-empty>
				<!-- <view class="item u-border-bottom">
					<view class="upper">
						<view class="left">
							<u-image :src="inverseParams(require('@/static/icon57.png'),require('@/static/icon56.png'))"
								width="72rpx" height="72rpx"></u-image>
							<view class="info">
								<view class="info-title">{{$t('点击“完成”领取奖励')}}</view>
								<view class="rule" @click="showRule = true">{{$t('规则')}}</view>
							</view>
						</view>
						<view class="right">
							{{$t('进行中')}}
						</view>
					</view>
					<view class="lower">
						<view class="award">
							<view class="ticket">
								<u-image src="@/static/icon55.png" width="32rpx" height="32rpx"></u-image>
								<text class="worth">20 USDT</text>
								<view class="type">{{$t('手续费返还券')}}</view>
							</view>
						</view>
						<view class="time">
							{{$t('领取时间')}}：2029-02-28 06：22（UTC+0）
						</view>
					</view>
				</view>
				<view class="item">
					<view class="upper">
						<view class="left">
							<u-image :src="inverseParams(require('@/static/icon57.png'),require('@/static/icon56.png'))"
								width="72rpx" height="72rpx"></u-image>
							<view class="info">
								<view class="info-title">点击“完成”领取奖励</view>
								<view class="rule" @click="showRule = true">规则</view>
							</view>
						</view>
						<view class="right already">
							{{$t('已领取')}}
						</view>
					</view>
					<view class="lower">
						<view class="award">
							<view class="ticket">
								<u-image src="@/static/icon55.png" width="32rpx" height="32rpx"></u-image>
								<text class="worth">20 USDT</text>
								<view class="type">手续费返还券</view>
							</view>
						</view>
						<view class="time">
							领取时间：2029-02-28 06：22（UTC+0）
						</view>
					</view>
				</view> -->
			</view>
		</view>

		<u-popup :bgColor="theme == 'light' ? '#fff':'#1F282F'" @close="showRule = false" mode="center"
			:safe-area-inset-bottom="false" closeable round="20rpx" :show="showRule">
			<view class="rule-content">
				<view class="rule-title">{{$t('规则')}}</view>
				<text>1.活动奖励有限，先到先得。若您完成任务后无法领取奖励，则表示所有奖励份额已经被其他用户领取完。敬请期待下一次活动。2.coinhome
					保留取消其合理认为有欺诈行为或未按照任何适用条款和条件行事的任何参与者的资格的权利。3.coinhome
					保留随时自行决定和/或修改或更改本任务和奖励的条款和条件的权利，恕不另行通知，包括但不限于取消、延长、终止或暂停本任务和奖励、资格条件和标准、获奖者的选择和数量以及活动时间，所有参与者均应受这些修订的约束。4.仅有主账号可参与该任务，子账号无法参加。5.翻译版本与英文原版有差异时，以英文版为准。</text>
			</view>
		</u-popup>

		<u-popup :bgColor="inverseParams('#fff','#1F282F')" :show="showOverdue " mode="center"
			:safe-area-inset-bottom="false" round="20rpx">
			<view class="overdue-content">
				<view class="overdue-title">{{$t('服务通知')}}</view>
				<view class="tip">
					当前任务已经超过有效期
				</view>
				<view class="btn" @click="toIndex">
					{{$t('返回首页')}}
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		noviceGiftPack
	} from "@/config/api"
	export default {
		data() {
			return {
				showRule: false,
				newTaskLoading:true,
				showOverdue: false,
				uTabsIndex: 0,
				noLogin:true,
				uTabs: [{
						name: this.$t('新手任务')
					},
					{
						name: this.$t('限时任务')
					}
				],
				newTaskData: {
					completeAdvancedAuthentication: false,
					completeDeposit: false,
					completeSpotTrade: false,
					completedRegister: false
				}
			};
		},
		onLoad() {

		},
		onShow() {
			if (!uni.getStorageSync('token')){
				this.newTaskLoading = false
				this.noLogin = true
				 return
			}
			this.noLogin = false
			noviceGiftPack({
				userId: uni.getStorageSync('userInfo').userId
			}).then(e => {
				this.newTaskLoading = false
				this.newTaskData = {
					...e
				}
			}).catch(e=>this.newTaskLoading = false)
		},
		methods: {
			toTrade() {
				uni.switchTab({
					url: '/pages/transaction/transaction'
				})
			},
			toIndex() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			click() {

			}
		},
	}
</script>

<style lang="scss">
	.overdue-content {
		width: 520rpx;
		padding: 40rpx;
		text-align: center;

		.btn {
			line-height: 80rpx;
			background: #FEFA05;
			border-radius: 8rpx;
			font-weight: 500;
			color: #2D270D;
			font-size: 32rpx;
		}

		.tip {
			color: #7D858D;
			font-size: 26rpx;
			margin-bottom: 66rpx;
		}

		.overdue-title {
			font-weight: 500;
			color: #23212C;
			margin-bottom: 76rpx;
			font-size: 32rpx;
		}
	}

	.rule-content {
		padding: 0 30rpx;
		padding-top: 36rpx;
		padding-bottom: 52rpx;
		width: 630rpx;

		text {
			font-weight: 400;
			color: #23212C;
			line-height: 45rpx;
			font-size: 24rpx;
		}

		.rule-title {
			margin-bottom: 60rpx;
			font-weight: 500;
			color: #23212C;
			font-size: 40rpx;
		}
	}

	.limit-task {
		.item {
			// padding: 0 28rpx;
			// margin-top: 82rpx;
			padding: 40rpx 0;

			.lower {
				.time {
					font-weight: 500;
					color: #8A8B9B;
					margin-top: 20rpx;
					font-size: 20rpx;
				}

				.award {
					display: flex;
					align-items: center;

					.ticket {
						align-items: center;
						height: 60rpx;
						display: flex;
						background: #FEFA05;
						border-radius: 8rpx;
						padding-right: 2rpx;
						padding-left: 8rpx;

						.worth {
							font-weight: 500;
							color: #4B4D40;
							font-size: 20rpx;
							margin: 0 10rpx;
						}

						.type {
							font-weight: 500;
							color: #4B4D40;
							font-size: 20rpx;
							line-height: 56rpx;
							height: 56rpx;
							background: #FFFFFF;
							padding: 0 10rpx;
							border-radius: 0px 8rpx 8rpx 0px;
						}
					}
				}
			}

			.upper {
				display: flex;
				justify-content: space-between;
				margin-bottom: 30rpx;

				.left {
					display: flex;

					.info {
						margin-left: 12rpx;

						.rule {
							font-weight: 500;
							color: #FE9205;
							margin-top: 20rpx;
							font-size: 24rpx;
						}

						.info-title {
							font-weight: 500;
							color: #23282E;
							font-size: 28rpx;
						}
					}
				}

				.right {
					height: 48rpx;
					background: #FEFA05;
					line-height: 48rpx;
					border-radius: 8rpx;
					font-weight: 500;
					color: #010101;
					font-size: 24rpx;
					padding: 0 34rpx;

					&.already {
						background: #FFFD9C;
						color: #7A7C89;
					}
				}
			}

			&:first-child {
				// margin-top: 32rpx;
			}
		}
	}

	.tabs {
		padding: 0 8rpx;

		::v-deep {
			.u-tabs__wrapper__nav__item__text {
				font-size: 32rpx !important;
			}
		}
	}

	.title {
		padding-left: 30rpx;
		line-height: 136rpx;
		font-weight: bold;
		color: #23282E;
		font-size: 48rpx;
		background: #F6F6F6;
	}

	.content {
		padding: 0 30rpx;

		.new-hand-task {
			padding-top: 62rpx;

			.tip {
				font-weight: 500;
				color: #23282E;
				font-size: 24rpx;
			}

			.item {
				margin-bottom: 60rpx;

				.rule {
					margin-top: 40rpx;

					text {
						font-size: 24rpx;

						&:first-child {
							color: #838B93;
						}

						&:last-child {
							margin-left: 15rpx;
							color: #FE9205;

							&.success {
								color: #2DBE87;
							}
						}
					}
				}

				.box-title {
					font-weight: 500;
					color: #23282E;
					font-size: 28rpx;
					margin-bottom: 30rpx;
				}

				.desc {
					font-weight: 500;
					color: #838B93;
					font-size: 24rpx;
				}
			}
		}
	}

	::v-deep {
		.u-tabs__wrapper__nav__line {
			bottom: 0 !important;
		}
	}

	@media (prefers-color-scheme: dark) {
		.title {
			background: #171E28;
		}

		.content .new-hand-task .item .box-title,
		.title,
		.content .new-hand-task .tip,
		.limit-task .item .upper .left .info .info-title,
		.rule-content .rule-title,
		.rule-content text,
		.overdue-content .overdue-title {
			color: #fff;
		}

		.tabs,
		.limit-task .item {
			&.u-border-bottom {
				border-color: #343B45 !important;
			}
		}
	}
</style>
