<template>
	<view>
		<view class="title">
			{{info.title}}
		</view>
		<view class="time">
			{{info.createTime}}
		</view>

		<view class="content">
			<rich-text :nodes="info.content"></rich-text>
		</view>
		<u-safe-bottom></u-safe-bottom>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				info: uni.getStorageSync('noticeDetail')
			};
		},
		onLoad() {
			console.log(this.info);
		}
	}
</script>

<style lang="scss">
	page {
		padding: 0 30rpx;
		padding-bottom: 30rpx;

		.time {
			font-size: 25rpx;
			margin-top: 10rpx;
			color: #929BA2;
		}

		.content {
			margin-top: 30rpx;
		}

		.title {
			font-size: 40rpx;
			font-weight: bold;
			padding: 20rpx 0;
		}
	}
</style>
