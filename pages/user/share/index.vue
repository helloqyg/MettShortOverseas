<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:19:47
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-08-16 09:19:47
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar title="分享赚钱"></CustomNavbar>
		</view>
		<view class="main_content">
			<view class="top_card" :class="[levelCount(info.level)]">
				<view class="line line1">
					<view class="left">{{ info.total }}元</view>
					<view class="right" @click="jumpView('/pages/user/share/withdraw')">提现</view>
				</view>
				<view class="line line2">
					<text>{{ info.levelText || '普通用户' }}</text>
					<text>直推分佣{{ Number(info.zhitui) }}%</text>
					<text>间推分佣{{ Number(info.jiantui) }}%</text>
				</view>
				<view class="line line3">
					<text>当前总收入</text>
					<text>{{ info.jine }}元</text>
				</view>
			</view>
			<view class="menu_card">
				<!-- #ifndef APP-PLUS -->
				<view class="item active" :style="'background:'+isBgColor"  @click="$store.state.user.token && jumpView('/pages/user/share/poster')">
					<view class="photo">
						<image class="image" src="https://img.nymaite.com/video_short/icons/share_1.png" mode="aspectFill"></image>
					</view>
					<view class="text">分享赚钱</view>
				</view>
				<!-- #endif -->
				<view class="item" @click="jumpView('/pages/user/share/team')">
					<view class="photo">
						<image class="image" src="https://img.nymaite.com/video_short/icons/share_2.png" mode="aspectFill"></image>
					</view>
					<view class="text">团队管理</view>
				</view>
				<view class="item" @click="jumpView('/pages/user/share/brokerage')">
					<view class="photo">
						<image class="image" src="https://img.nymaite.com/video_short/icons/share_3.png" mode="aspectFill"></image>
					</view>
					<view class="text">佣金明细</view>
				</view>
			</view>
			<view class="text_box">
				<!-- <view class="title">利用这款创作工具如何赚钱？</view> -->
				<u-parse :content="info.content"></u-parse>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isBgColor:getApp().globalData.isBgColor,
				msg: '',
				info: {
					jine: 0, // 金额
					total: 0, // 总收入
					level: 0, // 分销商等级
					levelText: '', // 分销商等级
					zhitui: 0, // 直推
					jiantui: 0, // 间推
					content: '', // 文本
				}
			}
		},
		onLoad() {
			this.dealerInfo()
		},
		methods: {
			levelCount(count) {
				if(count < 1) {
					return 'level1'
				} else if(count > 3) {
					return 'level3'
				} else {
					return 'level' + count
				}
			},
			dealerInfo() {
				this.$request('dealer.info').then(res => {
					if(res.code === 1) {
						this.info.jine = res.data.reseller_money
						this.info.total = res.data.money
						this.info.content = res.data.reseller_desc.content
						if(res.data.reseller) {
							this.info.level = res.data.reseller.level
							this.info.levelText = res.data.reseller.reseller_json.name
							this.info.zhitui = res.data.reseller.reseller_json.direct
							this.info.jiantui = res.data.reseller.reseller_json.indirect
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
			overflow-y: auto;
			padding: 24rpx 40rpx 60rpx 40rpx;
			
			.top_card {
				height: 340rpx;
				border-radius: 40rpx;
				background-repeat: no-repeat;
				background-size: 100% 100%;
				padding: 52rpx 40rpx 40rpx 40rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				
				&.level1 {
					// wBack.png
					background-image: url('https://img.nymaite.com/video_short/images/wBack.png');
					
					.line1 {
						.right {
							color: #000;
						}
					}
				}
				
				&.level2 {
					//wHBack.png
					background-image: url('https://img.nymaite.com/video_short/images/wHBack.png');
				
					.line1 {
						.right {
							color: rgba(142, 95, 6, 1);
						}
					}
				}
				
				&.level3 {
					//wLBack.png
					background-image: url('https://img.nymaite.com/video_short/images/wLBack.png');
					
					.line1 {
						.right {
							color: rgba(142, 95, 6, 1);
						}
					}
				}
				
				.line {
					display: flex;
					align-items: center;
					justify-content: space-between;
					color: #fff;
				}
				
				.line1 {
					.left {
						font-size: 48rpx;
						font-weight: 900;
					}
					
					.right {
						width: 120rpx;
						height: 52rpx;
						line-height: 52rpx;
						font-size: 28rpx;
						background: #fff;
						border-radius: 8rpx;
						text-align: center;
						font-weight: bold;
					}
				}
				
				.line2 {
					font-size: 28rpx;
					font-weight: 900;
				}
				
				.line3 {
					font-size: 28rpx;
					font-weight: 700;
				}
			}
			
			.menu_card {
				margin: 44rpx 0;
				display: flex;
				align-items: center;
				
				.item {
					width: 208rpx;
					height: 172rpx;
					border-radius: 30rpx;
					background: #fff;
					box-shadow: 0 0 60rpx 0 rgba(102, 102, 102, 0.15);
					color: #000;
					font-size: 28rpx;
					font-weight: bold;
					text-align: center;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					margin-right: calc((100% - 208rpx * 3) / 2);
					
					&:nth-child(3n) {
						margin-right: 0;
					}
					
					&.active {
						background: linear-gradient(90deg, #F28B45 0%, #FEB787 100%);
						color: #fff;
					}
					
					.photo {
						width: 108rpx;
						height: 108rpx;

						.image {
							width: 100%;
							height: 100%;
						}
					}
				}
			}
			
			.text_box {
				border-radius: 16rpx;
				box-shadow: 0 0 60rpx 0 rgba(102, 102, 102, 0.15);
				padding: 40rpx;
				font-size: 28rpx;
				color: rgba(51, 51, 51, 1);
				overflow: hidden;
				
				.title {
					font-weight: bold;
					padding-bottom: 36rpx;
					border-bottom: 2rpx solid rgba(221, 221, 221, 1);
					margin-bottom: 36rpx;
				}
			}
		}
	}
</style>
