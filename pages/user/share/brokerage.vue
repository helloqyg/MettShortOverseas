<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:19:38
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-08-16 09:19:39
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar title="佣金明细"></CustomNavbar>
		</view>
		<view class="main_content">
			<scroll-view class="scroll_view" :scroll-y="true" @scrolltolower="scrollBottom" >
				<view class="scroll_content">
					<view class="top_card" :style="'background:'+isBgColor">
						<view class="text1">{{ info.sum }}元</view>
						<view class="text2">总订单数量{{ info.count }}</view>
					</view>
					<view class="content_box">
						<view class="title">佣金信息</view>
						<view class="list_box" v-if="list.length">
							<view class="item" v-for="(item, index) in list" :key="index">
								<view class="line">
									<text class="bold">{{ item.nickname }}</text>
									<text>推荐关系：{{ item.type_text }}</text>
								</view>
								<view class="line">
									<text>分佣：{{ item.money }}元</text>
									<text>充值金额：{{ item.pay_money }}元</text>
								</view>
								<view class="line">
									<text>类型：{{ item.order_type_text }}</text>
									<text>{{ item.createtime }}</text>
								</view>
							</view>
						</view>
						<view class="be_empty" v-else>没有佣金信息</view>
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
					sum: 0,
					count: 0
				},
				list: [],
				page: 1,
				pagesize: 10
			}
		},
		onLoad() {
			this.brokerageList()
		},
		methods: {
			scrollBottom() {
				this.page++
				this.brokerageList()
			},
			brokerageList() {
				this.$request('share.brokerage', {
					page: this.page,
					pagesize: this.pagesize
				}).then(res => {
					if(res.code === 1) {
						this.info = {
							sum: res.data.sum,
							count: res.data.count
						}
						if(res.data.list && res.data.list.length) {
							this.list = this.list.concat(res.data.list)
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
						padding: 32rpx 0;
						border-bottom: 2rpx solid rgba(240, 240, 240, 1);
						
						.line {
							display: flex;
							align-items: center;
							justify-content: space-between;
							font-size: 28rpx;
							color: rgba(39, 45, 47, 1);
							line-height: 52rpx;
							
							.bold {
								font-size: 32rpx;
								font-weight: 700;
							}
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
