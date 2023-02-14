<template>
	<view>
		<view class="tip">
			{{$t('standard')}}
		</view>
		<view class="content">
			<view class="country">
				<view class="title" style="padding-top: 40rpx;">{{$t('证件签发国家/地区')}}</view>
				<view class="picker-box">
					<view class="left">
						<u-image width="48rpx" height="48rpx"></u-image>
						<text>中国</text>
					</view>
					<view>
						<u-icon color="#8B8F92" size="20rpx" name="arrow-down-fill"></u-icon>
					</view>
				</view>
			</view>
			<view class="id">
				<view class="title">{{$t('证件类型')}}</view>

				<view @click="idType = 0" class="item" :class="{
					active:idType == 0
				}">
					<view class="left">
						<u-image src="/static/icon28.png" width="48rpx" height="48rpx"></u-image>
						<text>{{$t('身份证')}}</text>
					</view>
					<view class="right">
						<u-icon :color="idType == 0 ? '#FEFA05' : '#B9B9BB'" :name="idType == 0 ? 'checkmark-circle-fill' : 'checkmark-circle'"></u-icon>
					</view>
				</view>
				<view @click="idType = 1" class="item" style="margin-top: 20rpx;" :class="{
					active:idType == 1
				}">
					<view class="left">
						<u-image src="/static/icon3.png" width="48rpx" height="48rpx"></u-image>
						<text>{{$t('护照')}}</text>
					</view>
					<view class="right">
						<u-icon :color="idType == 1 ? '#FEFA05' : '#B9B9BB'" :name="idType == 1 ? 'checkmark-circle-fill' : 'checkmark-circle'"></u-icon>
					</view>
				</view>
			</view>

			<view class="info">
				<view class="title">{{$t('证件信息')}}</view>
				<view class="item">
					<view class="lab">{{$t('姓名')}}</view>
					<view class="input">
						<u-input fontSize="26rpx" border="none" :placeholder="$t('请输入您的真实姓名')"></u-input>
					</view>
				</view>
				<view class="item">
					<view class="lab">{{$t('证件号')}}</view>
					<view class="input">
						<u-input fontSize="26rpx" border="none" type="idcard" :placeholder="$t('请输入您的证件号')"></u-input>
					</view>
				</view>
			</view>
		</view>

		<view class="btn" @click="submit">
			{{$t('提交')}}
		</view>
		<u-gap height="88rpx"></u-gap>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				idType: 0
			};
		},
		methods: {
			submit() {
				
			}
		},
	}
</script>

<style lang="scss">
	.btn {
		line-height: 90rpx;
		background: #FEFA05;
		font-weight: 500;
		color: #2D270D;
		margin: 0 30rpx;
		margin-top: 190rpx;
		text-align: center;
		border-radius: 8rpx;
		font-size: 32rpx;
	}

	.info {
		.item {
			margin-top: 20rpx;

			.lab {

				color: #8B8F92;
				margin-bottom: 20rpx;
				font-size: 26rpx;
			}

			.input {
				height: 90rpx;
				display: flex;
				padding: 0 30rpx;
				align-items: center;
				background: #F6F6F6;
			}
		}
	}

	.id {
		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 20rpx;
			height: 100rpx;
			border: 2rpx solid #EBEBEB;
			border-radius: 8rpx;
			&.active {
				border-color: #FEFA05;
			}

			.left {
				display: flex;
				align-items: center;

				text {
					margin-left: 20rpx;
					font-weight: 500;
					color: #1C1C1C;
					font-size: 28rpx;
				}
			}
		}
	}

	.content {
		padding: 0 30rpx;
	}

	.picker-box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;

		.left {
			display: flex;
			align-items: center;

			text {

				color: #1C1C1C;
				font-size: 28rpx;
				margin-left: 20rpx;
			}
		}

		border: 2rpx solid #EAEAEA;
		height: 90rpx;
		border-radius: 8rpx;
	}

	.country,
	.info,
	.id {
		.title {
			font-weight: 500;
			padding-top: 60rpx;
			margin-bottom: 20rpx;
			color: #1C1C1C;
			font-size: 28rpx;
		}
	}

	.tip {
		padding: 56rpx 30rpx;
		background: #F6F6F6;
		font-weight: bold;
		color: #23282E;
		font-size: 48rpx;
	}
</style>
