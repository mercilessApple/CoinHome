<template>
	<view>
		<view class="title">
			{{$t('设置')}}
		</view>
		<u-gap height="40rpx"></u-gap>
		<view class="nav">
			<view class="item" v-for="(item,index) in nav" :key="index" @click="item.url ? $u.route(item.url) : false">
				<view class="left">{{item.name}}</view>
				<view class="right">
					<text>{{item.val}}</text>
					<u-icon name="arrow-right"></u-icon>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				nav: [{
						name: this.$t('语言'),
						val: uni.getLocale() == 'zh' ? '中文简体' : 'English',
						url: '/pages/language/language'
					},
					{
						name: this.$t('主题'),
						val: this.$t('自动'),
						url: '/pages/theme/theme'
					},
					{
						name: this.$t('清空缓存'),
						val: '0kb'
					},
					{
						name: this.$t('服务协议'),
						val: ''
					},
					{
						name: this.$t('隐私声明'),
						val: ''
					},
					{
						name: this.$t('关于我们'),
						// #ifdef APP-PLUS
						val: 'v' + plus.runtime.version,
						// #endif
					}
				]
			};
		},
		onLoad() {

		}
	}
</script>

<style lang="scss">
	.nav {
		.item {
			height: 96rpx;
			padding: 0 30rpx;
			display: flex;
			/* #ifdef APP-PLUS */
			padding-right: 0;
			/* #endif */
			justify-content: space-between;
			align-items: center;
			margin-top: 20rpx;

			.right {
				display: flex;
				align-items: center;

				text {
					margin-right: 20rpx;
					color: #9599A4;
					font-size: 28rpx;
				}
			}

			.left {
				font-weight: 500;
				color: #23212C;
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
</style>
