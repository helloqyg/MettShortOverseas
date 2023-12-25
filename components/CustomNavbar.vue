<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:16:36
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-09-02 10:19:01
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="CustomNavbar">
		<!-- <u-navbar v-if="left > 0" @leftClick="utils.navBack()" :leftText="lText" :leftIconSize="left" :leftIconColor="color" :title="title" :titleStyle="{ color, fontWeight: 'bold' }" :bgColor="bg" :placeholder="true" /> -->
		<u-navbar v-if="left > 0" :title="title" :titleStyle="{ color, fontWeight: 'bold' }" :bgColor="bg" :placeholder="true">
			<view class="n_left" slot="left">
				<view class="back_prev" @click="utils.navBack()">
					<u-icon name="arrow-left" :size="left" :color="color"></u-icon>
				</view>
				<u-line :color="color" direction="column" length="10" margin="0 20rpx"></u-line>
				<view class="back_home" @click="backHome">
					<u-icon name="home" size="20" :color="color"></u-icon>
				</view>
				<!-- #ifdef APP-PLUS -->
				<text :style="{ color: color, marginLeft: '20rpx' }">{{ lText }}</text>
				<!-- #endif -->
			</view>
		</u-navbar>
		<u-navbar v-else :leftIconSize="left" :title="title" :titleStyle="{ color, fontWeight: 'bold' }" :bgColor="bg" :placeholder="true" />
	</view>
</template>

<script>
	import tools from '@/common/utils/index.js'
	export default {
		name: "CustomNavbar",
		props: {
			title: { // 标题
				type: String,
				default: ''
			},
			bg: { // 导航条背景
				type: String,
				default: 'transparent'
			},
			color: { // 文字 图标 颜色
				type: String,
				default: '#000'
			},
			left: { // 左侧图标
				type: Number,
				default: 16
			},
			lText: { // 左侧文字
				type: String,
				default: ''
			},
		},
		data() {
			return {
				utils: tools
			};
		},
		methods: {
			backHome() {
				uni.switchTab({
					url: '/pages/home/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.CustomNavbar {
		.n_left {
			display: flex;
			align-items: center;
			flex-direction: row;
			margin: 0 -26rpx;
			
			.back_prev {
				padding-left: 26rpx;
			}
			
			.back_home {
				padding-right: 26rpx;
			}
		}
	}
</style>