<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:20:11
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-08-16 09:20:12
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar title="团队管理"></CustomNavbar>
		</view>
		<view class="main_content">
			<scroll-view class="scroll_view" :scroll-y="true" @scrolltolower="scrollBottom">
				<view class="scroll_content">
					<view class="top_card" :style="'background:'+isBgColor" >
						<view class="text1">{{ info.count }}人</view>
						<view class="text2">直推用户{{ info.count_direct }}人  间推用户{{ info.count_indirect }}人</view>
					</view>
					<view class="content_box">
						<view class="title">团队信息</view>
						<view class="list_box" v-if="list.length">
							<view class="item" v-for="(item, index) in list" :key="index">
								<view class="left">
									<view class="photo">
										<image class="image" :src="item.avatar" mode="aspectFill"></image>
									</view>
									<view class="info">
										<view class="text1">{{ item.nickname }}</view>
										<view class="text2">{{ item.createtime }}</view>
									</view>
								</view>
								<view class="right">{{ item.type == '1' ? '直推' : '间推' }}用户</view>
							</view>
						</view>
						<view class="be_empty" v-else>没有团队信息</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isBgColor:getApp().globalData.isBgColor,
				info: {
					count: 0,
					count_direct: 0,
					count_indirect: 0
				},
				list: [],
				page: 1,
				pagesize: 10
			}
		},
		onLoad() {
			this.teamList()
		},
		methods: {
			scrollBottom() {
				this.page++
				this.teamList()
			},
			teamList() {
				this.$request('share.team', {
					page: this.page,
					pagesize: this.pagesize
				}).then(res => {
					if(res.code === 1) {
						this.info = {
							count: res.data.count,
							count_direct: res.data.count_direct,
							count_indirect: res.data.count_indirect
						}
						if(res.data.reseller_user && res.data.reseller_user.length) {
							this.list = this.list.concat(res.data.reseller_user)
						} else {
							this.page--
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		.main_content {
			overflow: hidden;
			
			.scroll_view {
				height: 100%;
				
				.scroll_content {
					padding: 24rpx 40rpx 60rpx 40rpx;
				}
			}

			.top_card {
				height: 220rpx;
				border-radius: 16rpx;
				background: linear-gradient(90deg, rgba(242, 139, 69, 1) 0%, rgba(254, 183, 135, 1) 100%);
				position: relative;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				font-weight: bold;
				color: #fff;
				
				&::before {
					content: "";
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					background-image: url('https://img.nymaite.com/video_short/images/texture.png');
					background-repeat: no-repeat;
					background-size: 100% 100%;
				}
				
				.text1 {
					font-size: 40rpx;
					margin-bottom: 20rpx;
				}
				
				.text2 {
					font-size: 32rpx;
				}
			}
			
			.content_box {
				margin-top: 40rpx;

				.title {
					font-size: 36rpx;
					font-weight: 700;
					color: rgba(39, 45, 47, 1);
				}
				
				.list_box {
					.item {
						padding: 40rpx 0;
						border-bottom: 2rpx solid rgba(240, 240, 240, 1);
						display: flex;
						align-items: center;
						justify-content: space-between;
					
						.left {
							display: flex;
							align-items: center;
							
							.photo {
								width: 100rpx;
								height: 100rpx;
								border-radius: 20rpx;
								background: #fff;
								box-shadow: 0 0 60rpx 0 rgba(202, 202, 202, 0.3);
								overflow: hidden;
								display: flex;
								align-items: center;
								justify-content: center;
								
								.image {
									width: 100%;
									height: 100%;
								}
							}
							
							.info {
								margin-left: 40rpx;
								
								.text1 {
									font-size: 32rpx;
									font-weight: 700;
									color: #272D2F;
									margin-bottom: 12rpx;
								}
								
								.text2 {
									font-size: 24rpx;
									color: #A5ACB6;
								}
							}
						}
						
						.right {
							font-size: 32rpx;
							font-weight: 700;
							color: #000;
						}
					}
				}
				
				.be_empty {
					font-size: 28rpx;
					color: #999;
					text-align: center;
					padding: 40rpx 0;
				}
			}
		}
	}
</style>
