<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:19:18
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-09-12 14:34:24
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar title="积分任务" color="#fff" bg="#262626"></CustomNavbar>
		</view>
		<view class="main_content">
			<view class="task_box box_bg" v-if="status == 1">
				<view class="title_box">
					<image class="image1" src="https://img.nymaite.com/video_short/images/arrow.png" mode="widthFix"></image>
					<text class="text">免费获取次数</text>
					<image class="image2" src="https://img.nymaite.com/video_short/images/arrow.png" mode="widthFix"></image>
				</view>
				<view class="item_box">
					<view class="item" v-for="(item, index) in taskData" :key="item.id">
						<view class="texts">
							<view class="line">
								<text>{{ item.title }}</text>
								<text>+{{ item.usable }}积分</text>
							</view>
							<view class="line">
								<text v-if="item.type == 'day'">每日</text>
								<text>限{{ item.limit }}次</text>
								<text>（{{ item.user_count }} / {{ item.limit }}）</text>
							</view>
						</view>
						<view class="button disabled" v-if="item.user_count == item.limit">已完成</view>
						<view class="button" v-else @click="taskItemClick(item.hook)">去完成</view>
					</view>
				</view>
			</view>
			<view class="task_box box_bg" v-if="status == 0">
				<view class="title_box">
					<image class="image1" src="https://img.nymaite.com/video_short/images/arrow.png" mode="widthFix"></image>
					<text class="text" :style="'color:'+isColor">免费获取次数</text>
					<image class="image2" src="https://img.nymaite.com/video_short/images/arrow.png" mode="widthFix"></image>
				</view>
				<view class="item_box">
					<view class="item" v-for="(item, index) in taskData" :key="item.id">
						<view class="texts" :style="'color:'+isColor">
							<view class="line">
								<text>{{ item.title }}</text>
								<text>+{{ item.usable }}积分</text>
							</view>
							<view class="line">
								<text v-if="item.type == 'day'">每日</text>
								<text>限{{ item.limit }}次</text>
								<text>（{{ item.user_count }} / {{ item.limit }}）</text>
							</view>
						</view>
						<view class="button disabled" :style="'background:'+isColor" v-if="item.user_count == item.limit">已完成</view>
						<view class="button" :style="'background:'+isColor" v-else @click="taskItemClick(item.hook)">去完成</view>
						
					</view>
				</view>
			</view>
			<view class="dialog_modal" v-if="isDialog" @click="isDialog = false">
				<image class="arrow" src="https://img.nymaite.com/video_short/images/arrow2.png" mode="widthFix"></image>
				<view class="tips">
					<view class="line">
						<view class="">1. 点击右上角的</view>
						<view class="dots">
							<view class="dot"></view>
							<view class="dot"></view>
							<view class="dot"></view>
						</view>
						<view class="">按钮</view>
					</view>
					<view class="line">2. 分享给好友或朋友圈</view>
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
				taskData: [],
				isDialog: false,
				videoAd: null,
				isLoaded: false
			}
		},
		computed: {
			...mapGetters("user", ["token", "userInfo"]),
			...mapGetters("app", ["config"]),
		},
		onLoad() {
			this.getTaskList()
			// #ifdef MP-WEIXIN
			this.token && (this.config?.uniad_switch == '1') && this.config?.adpid && this.adInit()
			// #endif
		},
		methods: {
			adInit() {
				// #ifdef MP-WEIXIN
				// 在页面onLoad回调事件中创建激励视频广告实例
				if (wx.createRewardedVideoAd) {
					this.videoAd = wx.createRewardedVideoAd({
						adUnitId: this.config.adpid
					})
					this.videoAd.onLoad(() => this.isLoaded = true)
					this.videoAd.onError(() => this.isLoaded = false)
					this.videoAd.onClose((res) => {
						if(res && res.isEnded) {
							this.$request('task.finish', { type: 'uniad_success' }).then(res => {
								res.code == 1 && (this.$u.toast("奖励已发放"), this.getTaskList())
							})
						}
					})
				}
				// #endif
			},
			// onadload(e) {
			//       console.log('广告数据加载成功');
			//     },
			// onadclose(e) {
			//   const detail = e.detail
			//   // 用户点击了【关闭广告】按钮
			//   if (detail && detail.isEnded) {
			// 	// 正常播放结束
			// 	console.log("onadclose1 " + detail.isEnded);
			// 	this.$request('task.finish', { type: 'uniad_success' }).then(res => {
			// 		res.code == 1 && (this.$u.toast("奖励已发放"), this.getTaskList())
			// 	})
			//   } else {
			// 	// 播放中途退出
			// 	console.log("onadclose " + detail.isEnded);
			//   }
			// },
			// onaderror(e) {
			//   // 广告加载失败
			//   console.log("onaderror: ", e.detail);
			// },
			adShow() {
				// #ifdef MP-WEIXIN
				// 用户触发广告后，显示激励视频广告
				if (this.videoAd) {
						console.log(this.videoAd)
					this.videoAd.show().catch(() => {
						// 失败重试
						this.videoAd.load()
							.then(() =>  this.videoAd.show())
							.catch(() => {})
					})
				} else {
					this.adInit()
				}
				// #endif
			},
			// 做任务
			taskItemClick(type) {
				if(type == 'share_wx_after' || type == 'share_wxf_after' || type == 'share_success') {
					this.isDialog = true
				} else if(type == 'user_bind_name_after' || type == 'user_bind_avatar_after') {
					this.jumpView('/pages/user/info/index')
				} else if(type == 'uniad_success') {
					// #ifdef MP-WEIXIN
					this.adShow()
						// uni.showToast({
						//     title: '请配置广告相关内容',
						// 	icon: 'none',
						// 	duration: 2000
						// });
					// #endif
					
				}
			},
			// 获取积分任务
			getTaskList() {
				this.$request('task.list', { platform: this.$utils.platforms() }).then(res => {
					if(res.code === 1) {
						this.taskData = res.data
					}
				})
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
			position: relative;
			
			.dialog_modal {
				width: 100%;
				height: 100%;
				position: fixed;
				top: 0;
				left: 0;
				z-index: 100;
				background: rgba(#000, 0.5);
				
				.arrow {
					width: 200rpx;
					position: absolute;
					
					/* #ifdef MP-WEIXIN */
					top: 150rpx;
					right: 150rpx;
					/* #endif */
					
					/* #ifndef MP-WEIXIN */
					top: 80rpx;
					right: 60rpx;
					/* #endif */
				}
				
				.tips {
					color: #fff;
					font-size: 36rpx;
					font-weight: 700;
					position: absolute;

					/* #ifdef MP-WEIXIN */
					top: 300rpx;
					left: 60rpx;
					/* #endif */
					
					/* #ifndef MP-WEIXIN */
					top: 230rpx;
					left: 120rpx;
					/* #endif */
					
					.line {
						display: flex;
						align-items: center;
						line-height: 60rpx;
						
						.dots {
							padding: 0 16rpx;
							display: flex;
							align-items: center;
							
							.dot {
								width: 10rpx;
								height: 10rpx;
								border-radius: 50%;
								background: #fff;
								
								&:nth-child(2) {
									width: 12rpx;
									height: 12rpx;
									margin: 0 8rpx;
								}
							}
						}
					}
				}
			}
			
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
							margin-right: 80rpx;
							font-size: 28rpx;
							color: #FAD9B4;
							
							.line {
								margin-bottom: 10rpx;
								
								&:last-child {
									margin-bottom: 0;
								}
							}
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
							
							&.disabled {
								background: rgba(#F3D2A6, 0.3);
							}
						}
					}
				}
			}
		}
	}
</style>
