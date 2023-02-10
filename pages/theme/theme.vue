<template>
	<view>
		<view class="title">
			{{$t('主题模式')}}
		</view>
		<view class="nav">
			<view class="item">
				<view class="left">{{$t('自动')}}</view>
				<view class="right">
					<u-icon color="#FE9205" name="checkmark"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods: {
			
		},
	}
</script>

<style lang="scss">
	.nav {
		.item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 96rpx;
			margin-top: 20rpx;
			padding: 0 30rpx;

			.left {
				color: #23212C;
				font-size: 28rpx;
			}
		}
	}

	.title {
		font-weight: bold;
		color: #23282E;
		font-size: 48rpx;
		padding: 44rpx 30rpx;
	}
</style>
