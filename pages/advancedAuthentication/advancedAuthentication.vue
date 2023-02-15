<template>
	<view>
		<view class="tip">
			<view class="lab">{{$t('请上传证件正反面及手持证件图像')}}</view>
			<view class="desc">{{$t('*请使用本人有效证件拍摄，拍摄时确保证件边款完整，字迹清晰，亮度均匀，确保照片和个人签字的内容清晰可见。')}}</view>
		</view>
		<u-gap height="45rpx"></u-gap>
		<view class="item">
			<u-image width="500rpx" src="/static/icon29.png" height="280rpx" radius="12rpx"></u-image>
		</view>
		<view class="item">
			<u-image width="500rpx" src="/static/icon31.png" height="280rpx" radius="12rpx"></u-image>
		</view>
		<view class="item">
			<u-image width="500rpx" src="/static/icon30.png" height="280rpx" radius="12rpx"></u-image>
		</view>

		<view class="notice">
			*{{$t('手写 CoinHome，本人签字，电话，证件号和当天日期')}}
		</view>
		<view class="btn">
			{{$t('提交')}}
		</view>
		<u-gap height="88rpx"></u-gap>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
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
		margin-top: 66rpx;
		text-align: center;
		border-radius: 8rpx;
		font-size: 32rpx;
	}

	.notice {
		color: #FE9205;
		font-size: 24rpx;
		padding-left: 30rpx;
		margin-top: 30rpx;
	}

	.item {
		display: flex;
		margin-top: 30rpx;
		justify-content: center;
	}

	.tip {

		background: #F6F6F6;
		padding: 30rpx;

		.desc {
			color: #FE9205;
			font-size: 24rpx;
		}

		.lab {

			margin-bottom: 30rpx;
			color: #070707;
			font-size: 32rpx;
		}
	}
	@media (prefers-color-scheme: dark) {
		page{
			background-color: #1A1B1F;
		}
		.tip .lab{
			
color: #FFFFFF;
		}
		.tip{
			
background: #0A0E11;
		}
	}
</style>
