<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:18:38
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-08-16 09:18:38
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar color="#fff" bg="#262626"></CustomNavbar>
		</view>
		<view class="main_content" v-if="status == 1">
			<view class="task_box box_bg">
				<view class="title_box">
					<image class="image1" src="https://img.nymaite.com/video_short/images/arrow.png" mode="widthFix"></image>
					<text class="text">联系我们</text>
					<image class="image2" src="https://img.nymaite.com/video_short/images/arrow.png" mode="widthFix"></image>
				</view>
				<view class="item_box">
					<view class="item" v-for="(item, index) in taskList" :key="item.id">
						<view class="texts">
							<text class="text1">{{ item.text }}</text>
							<text class="text2">{{ item.value }}</text>
						</view>
						<view class="button" @click="copyText(item.value)">复制</view>
					</view>
				</view>
			</view>
		</view>
		<view class="main_content" v-if="status == 0">
			<view class="task_box box_bg">
				<view class="title_box">
					<image class="image1" src="https://img.nymaite.com/video_short/images/arrow.png" mode="widthFix"></image>
					<text class="text" :style="'color:'+isColor">联系我们</text>
					<image class="image2" src="https://img.nymaite.com/video_short/images/arrow.png" mode="widthFix"></image>
				</view>
				<view class="item_box">
					<view class="item" v-for="(item, index) in taskList" :key="item.id">
						<view class="texts" :style="'color:'+isColor">
							<text class="text1">{{ item.text }}</text>
							<text class="text2">{{ item.value }}</text>
						</view>
						<view class="button" :style="'background:'+isColor" @click="copyText(item.value)">复制</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		data() {
			return {
				status:getApp().globalData.status,
				isColor:getApp().globalData.isColor,
				taskList: [
					{ id: 1, text: '手机号', value: '' },
					{ id: 2, text: '邮箱', value: '' },
					{ id: 3, text: '微信号', value: '' },
				],
			}
		},
		computed: {
			...mapGetters("app", ["config"])
		},
		onLoad() {
			this.taskList[0].value = this.config.system.mobile
			this.taskList[1].value = this.config.system.email
			this.taskList[2].value = this.config.system.wechat
		},
		methods: {
			copyText(info) {
				// #ifndef H5
				uni.setClipboardData({
					data: info,
					success: () => {
						uni.showToast({
							title: '复制成功',
							icon: 'none'
						})
					}
				});
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		background: #262626;
		
		.main_content {
			overflow-y: auto;
			padding: 24rpx 32rpx 60rpx 32rpx;
			
			.title_box {
				margin-bottom: 40rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				
				.image1 {
					width: 56rpx;
					transform: rotate(180deg);
				}
				
				.text {
					font-size: 40rpx;
					color: #EAD0AE;
					text-shadow: 0 2rpx 0 0 #000000;
					font-weight: bold;
					margin: 0 56rpx;
				}
				
				.image2 {
					width: 56rpx;
				}
			}
			
			.box_bg {
				border-radius: 20rpx;
				padding: 40rpx 32rpx 48rpx 32rpx;
				border: 2rpx solid #96948C;
				background: linear-gradient(225deg, #3D3D3B 0%, #2F2D2D 100%);
				box-shadow: 0 0 16rpx 0rpx rgba(#000, 0.2);
			}
			
			.task_box {
				margin-top: 32rpx;
				
				.item_box {
					.item {
						height: 100rpx;
						border-radius: 20rpx;
						background: #42403E;
						padding: 24rpx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-weight: bold;
						margin-bottom: 16rpx;
						
						&:last-child {
							margin-bottom: 0;
						}
						
						.texts {
							flex: 1;
							margin-right: 40rpx;
							font-size: 28rpx;
							color: #FAD9B4;
							display: flex;
							align-items: center;
							justify-content: space-between;
						}
						
						.button {
							width: 140rpx;
							height: 56rpx;
							line-height: 56rpx;
							border-radius: 50rpx;
							background: #F3D2A6;
							text-align: center;
							font-size: 28rpx;
							color: #3A3A38;
						}
					}
				}
			}
		}
	}
</style>
