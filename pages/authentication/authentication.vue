<template>
	<view>
		<view class="tip">
			{{$t('个人验证')}}
			<block v-if="verifiedAudit != null">
				<view class="tag" v-if="verifiedAudit != 3 && tabIndex == 0">
					<u-image src="@/static/icon18.png" width="34rpx" height="32rpx"></u-image>
					<text>{{$t('已完成')}}</text>
				</view>

				<view class="tag" v-if="verifiedAudit == 4 && tabIndex == 1">
					<u-image src="@/static/icon18.png" width="34rpx" height="32rpx"></u-image>
					<text>{{$t('已完成')}}</text>
				</view>

				<view class="tag err" v-if="verifiedAudit == 2 && tabIndex == 1">
					<u-image src="@/static/icon14.png" width="34rpx" height="32rpx"></u-image>
					<text>{{$t('认证失败')}}</text>
				</view>

				<view class="tag" style="background-color: rgba(254, 250, 5, 0.16);"
					v-if="verifiedAudit == 0 && tabIndex == 1">
					<text style="color: #FE9205;">{{$t('待审核')}}</text>
				</view>
			</block>
		</view>
		<view class="tab">
			<view @click="tabIndex = 0" :class="{
				active:tabIndex == 0
			}">{{$t('standard')}}</view>
			<view @click="tabIndex = 1" :class="{
				active:tabIndex == 1
			}">{{$t('advanced')}}</view>
		</view>

		<view class="content">
			<view class="item-box" style="margin-top: 60rpx;">
				<view class="item-title">{{$t('要求')}}</view>
				<view class="item">{{$t('个人信息')}}</view>
				<view class="item">{{$t('政府发行的身份证')}}</view>
			</view>
			<view class="item-box" style="display: none;">
				<view class="item-title">{{$t('功能与限制')}}</view>
				<view class="item">
					<view class="left">
						<block v-if="tabIndex == 0 && verifiedAudit != 3">
							<u-icon name="checkmark-circle-fill" color="#2DBE87" style="margin-right:10rpx" />
						</block>
						<block v-if="tabIndex == 1 && verifiedAudit == 4">
							<u-icon name="checkmark-circle-fill" color="#2DBE87" style="margin-right:10rpx" />
						</block>
						<text>
							{{$t('充值')}}</text>
					</view>

					<text>{{$t('无限额')}}</text>
				</view>
				<view class="item">
					<view class="left">
						<block v-if="tabIndex == 0 && verifiedAudit != 3">
							<u-icon name="checkmark-circle-fill" color="#2DBE87" style="margin-right:10rpx" />
						</block>
						<block v-if="tabIndex == 1 && verifiedAudit == 4">
							<u-icon name="checkmark-circle-fill" color="#2DBE87" style="margin-right:10rpx" />
						</block>
						<text>
							{{$t('提现')}}</text>
					</view>

					<text>300 USDT</text>
				</view>
			</view>
			<view class="item-box" v-if="verifiedAudit == 2 && tabIndex == 1">
				<view class="item-title">{{$t('失败原因')}}</view>
				<view class="item" style="color: #F5475E;">*{{failedReason}}</view>
			</view>
			<view class="item-box" v-if="(verifiedAudit == 1 || verifiedAudit == 3) && tabIndex == 1">
				<view class="item-title">{{$t('预计审核时间')}}</view>
				<view class="item">2{{$t('天')}}</view>
			</view>
		</view>

		<block v-if="tabIndex == 0">
			<view v-if="verifiedAudit == 3 " class="btn"
				@click="$u.route('/pages/standardAuthentication/standardAuthentication')">
				{{$t('开始验证')}}
			</view>
		</block>

		<block v-if="tabIndex == 1">
			<view class="btn " :class="{
				disabled:verifiedAudit == 3
			}">
				<text v-if="verifiedAudit == 3">
					{{$t('不适用')}}
				</text>
				<block v-else>
					<text v-if="verifiedAudit == 1"
						@click="$u.route('/pages/advancedAuthentication/advancedAuthentication')">
						{{$t('立即开始')}}
					</text>
					<text v-if="verifiedAudit == 2"
						@click="$u.route('/pages/advancedAuthentication/advancedAuthentication')">
						{{$t('继续验证')}}
					</text>
				</block>
			</view>
		</block>
		<u-gap height="88rpx"></u-gap>
	</view>
</template>

<script>
	import {
		userInfo
	} from "@/config/api"
	export default {
		data() {
			return {
				tabIndex: 0,
				verifiedAudit: null,
				failedReason: ''
			};
		},
		onShow() {
			userInfo().then(e => {
				const {
					verifiedAudit
				} = e
				this.verifiedAudit = verifiedAudit
				this.failedReason = e.failedReason
			})
		}
	}
</script>

<style lang="scss">
	.btn {
		line-height: 90rpx;
		background: #FEFA05;
		font-weight: 500;
		color: #2D270D;
		margin: 0 30rpx;
		margin-top: 350rpx;
		text-align: center;
		border-radius: 8rpx;
		font-size: 32rpx;
		text{
			display: block;
		}
		&.disabled {

			background: #EEF0F2;

			color: #787884;
		}
	}

	.content {
		padding: 0 30rpx;

		.item-box {
			margin-top: 80rpx;

			.item {
				display: flex;
				justify-content: space-between;
				color: #929BA2;
				margin-top: 40rpx;
				font-size: 28rpx;

				.left {
					display: flex;
					align-items: center;

					text {
						// margin-left: 10rpx;
					}
				}
			}

			.item-title {
				font-weight: 500;
				font-size: 32rpx;
				color: #23282E;
			}
		}
	}

	.tip {
		padding: 56rpx 30rpx;
		background: #F6F6F6;
		font-weight: bold;
		color: #23282E;
		font-size: 48rpx;
		position: relative;

		.tag {
			position: absolute;
			height: 56rpx;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
			padding: 0 30rpx;
			border-radius: 40rpx 0px 0px 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: rgba(45, 190, 135, 0.16);

			&.err {
				background-color: rgba(245, 71, 94, 0.16);

				text {
					color: #F5475E;
				}
			}

			text {
				font-weight: 500;
				color: #2DBE87;
				margin-left: 10rpx;
				font-size: 22rpx;
			}
		}
	}

	.tab {
		display: flex;
		padding: 0 30rpx;
		margin-top: 62rpx;

		view {
			padding: 22rpx 26rpx;
			font-weight: 500;
			border-radius: 40rpx;
			color: #23282E;
			margin-right: 30rpx;
			font-size: 28rpx;

			&.active {
				background-color: #FEFA05;
			}
		}
	}

	@media (prefers-color-scheme: dark) {
		page {
			background-color: #1A1B1F !important;
		}

		.content {
			.item-title {

				color: #FFFFFF !important;
			}
		}

		.tab {
			view {
				color: #FFFFFF;

				&.active {
					color: #23282E;
				}
			}
		}

		.tip {
			color: #FFFFFF;
			background: #0A0E11;
		}
	}
</style>
