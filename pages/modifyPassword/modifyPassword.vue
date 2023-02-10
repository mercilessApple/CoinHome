<template>
	<view>
		<view class="tip">
			*{{$t('密码仅支持6-20个字母、数字、下划线')}}
		</view>
		<view class="item">
			<view class="lab">{{$t('新密码')}}</view>
			<view class="input">
				<u-input password v-model="password" clearable border="none">
				</u-input>
			</view>
		</view>
		<view class="item" style="margin-top: 40rpx;">
			<view class="lab">{{$t('确认密码')}}</view>
			<view class="input">
				<u-input password v-model="againPassword" clearable border="none">
				</u-input>
			</view>
		</view>


		<view class="btn" @click="submit" :class="{
			active:password != '' && againPassword != ''
		}">{{$t('确认')}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				againPassword: '',
				password: ''
			};
		},
		onLoad() {

		},
		methods: {
			submit() {
				uni.$u.route('/pages/modifyPassword/modifyPassword')
			},
		},
	}
</script>

<style lang="scss">
	.tip {
		background: #F6F6F6;
		padding: 40rpx 30rpx;
		color: #F5475E;
		margin-bottom: 80rpx;
		font-size: 28rpx;
	}

	.btn {
		line-height: 90rpx;
		margin: 0 30rpx;
		border-radius: 8rpx;
		font-weight: 500;
		font-size: 32rpx;
		text-align: center;
		margin-top: 140rpx;
		background: #EEF0F2;
		color: #787884;

		&.active {
			background: #FEFA05;

			color: #000000;
		}
	}

	.item {
		padding: 0 30rpx;

		.input {
			padding: 0 20rpx;
			height: 90rpx;
			background: #F6F6F6;
			display: flex;
			align-items: center;
			border-radius: 8rpx;
		}

		.lab {
			margin-bottom: 18rpx;
			color: #8B8F92;
			font-size: 26rpx;
		}
	}
</style>
