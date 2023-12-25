<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:20:20
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-08-16 09:20:20
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content" :style="{ '--bgcolor':isBgColor }">
		<view class="head_content">
			<CustomNavbar title="提现申请" color="#fff"></CustomNavbar>
		</view>
		<view class="main_content">
			<view class="top_card">
				<view class="line1">
					<view class="left">提现金额（需 ≥ {{ sumMin }}元）</view>
					<view class="right" @click="jumpView('/pages/user/share/payee')">
						<image class="image" src="https://img.nymaite.com/video_short/icons/setting.png" mode="widthFix"></image>
						<text>收款号设置</text>
					</view>
				</view>
				<view class="line2">
					<text class="text">￥</text>
					<input class="input" type="number" v-model="params.money" placeholder="请输入提现金额" placeholder-class="placeholder">
				</view>
				<view class="line3">
					<view class="left">提现至</view>
					<view class="right" :style="'color:'+isColor" @click="typePicker = true">{{ typeText }} > </view>
				</view>
				<view class="line4">
					<u-button text="确认提现" :loading="buttonLoading" :customStyle="buttonStyle" @click="withdrawHandle" />
				</view>
				<u-picker :show="typePicker" :columns="types" keyName="label" :closeOnClickOverlay="true" @close="typePicker = false" @cancel="typePicker = false" @confirm="selectedType"></u-picker>
			</view>
			<view class="content_box">
				<view class="title">提现记录</view>
				<view class="block_box">
					<scroll-view class="scroll_view" :scroll-y="true" @scrolltolower="scrollBottom">
						<view class="scroll_content">
							<view class="list_box" v-if="recordData.length">
								<view class="item" v-for="(item, index) in recordData" :key="index">
									<view class="left">
										<view class="photo">
											<image class="image" src="https://img.nymaite.com/video_short/icons/vip.png" mode="widthFix"></image>
										</view>
										<view class="info">
											<view class="text1">{{ `${item.money} (${item.apply_type_text})` }}</view>
											<view class="text2">{{ timestampToTime(item.createtime) }}</view>
										</view>
									</view>
									<view class="right">{{ item.status_text }}</view>
								</view>
							</view>
							<view class="be_empty" v-else>没有提现记录</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isColor:getApp().globalData.isColor,
				isBgColor:getApp().globalData.isBgColor,
				buttonStyle: {
					width: '100%',
					height: '108rpx',
					border: 'none',
					fontSize: '32rpx',
					color: '#fff',
					background: getApp().globalData.isBgColor,
					borderRadius: '16rpx',
					margin: '0',
					fontWeight: 'bold'
				},
				buttonLoading: false,
				types: [
					[
						{ id: 1, type: 'wechat', label: '微信' },
						{ id: 2, type: 'alipay', label: '支付宝' },
						{ id: 3, type: 'bank', label: '银行卡' }
					]
				],
				typePicker: false,
				typeText: '微信',
				params: {
					type: 'wechat',
					money: '',
					platform: 'wxMiniProgram'
				},
				recordData: [],
				page: 1,
				sumMin: 100,
				sumMax: 5000
			}
		},
		onLoad() {
			this.isColor = getApp().globalData.isColor
			this.isBgColor=getApp().globalData.isBgColor,
			this.withdrawRule()
			this.recordList()
		},
		methods: {
			// 提现规则
			withdrawRule() {
				this.$request('withdraw.rule').then(res => {
					if(res.code === 1) {
						this.sumMin = res.data.min
						this.sumMax = res.data.max
					}
				})
			},
			// 触底
			scrollBottom() {
				this.page++
				this.recordList()
			},
			// 时间戳转日期
			timestampToTime(value) {
				let date = new Date(value * 1000);
				let month = date.getMonth() + 1;
				let hours = date.getHours();
				if (hours < 10) hours = "0" + hours;
				let minutes = date.getMinutes();
				if (minutes < 10) minutes = "0" + minutes;
				let time = date.getFullYear() + "-" + month + "-" + date.getDate() + " " + hours + ":" + minutes;
				return time;
			},
			// 提现
			withdrawHandle() {
				const num = Number(this.params.money)
				if(!num) {
					this.$u.toast('请输入提现金额')
					return
				}
				if(num < this.sumMin) {
					this.$u.toast('提现金额需大于' + this.sumMin)
					return
				}
				if (num > this.sumMax) {
					this.$u.toast('提现金额需小于' + this.sumMax)
					return
				}
				this.buttonLoading = true
				this.$request('withdraw.apply', this.params).then(res => {
					if(res.code === 1) {
						this.$u.toast(res.msg)
						this.params.money = ''
						this.page = 1
						this.recordList()
						this.recordData = []
					}
					this.buttonLoading = false
				}).catch(err => {
					this.buttonLoading = false
				})
			},
			// 提现记录
			recordList() {
				this.$request('withdraw.record', {
					page: this.page
				}).then(res => {
					if(res.code === 1) {
						if(res.data.data && res.data.data.length) {
							this.recordData = this.recordData.concat(res.data.data)
						} else {
							this.page--
						}
					}
				})
			},
			// 选择提现类型
			selectedType(e) {
				this.params.type = e.value[0].type
				this.typeText = e.value[0].label
				this.typePicker = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		background: #F9F9F9;
		
		&::before {
			content: "";
			width: 100%;
			height: 420rpx;
			background:var(--bgcolor);
			position: absolute;
			top: 0;
			left: 0;
		}
		
		.main_content {
			overflow: hidden;
			padding: 24rpx 40rpx 0 40rpx;
			display: flex;
			flex-direction: column;
			
			.top_card {
				position: relative;
				border-radius: 20rpx;
				background: #fff;
				padding: 40rpx;
				font-weight: 700;
				
				.line1 {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 20rpx;
					
					.left {
						font-size: 36rpx;
						color: #000;
					}
					
					.right {
						font-size: 24rpx;
						color: rgba(46, 46, 46, 1);
						display: flex;
						align-items: center;
						
						.image {
							width: 32rpx;
							margin-right: 20rpx;
						}
					}
				}
				
				.line2 {
					display: flex;
					align-items: center;
					padding: 20rpx 0;
					border-bottom: 2rpx solid rgba(221, 221, 221, 1);
					
					.text {
						font-size: 32rpx;
						color: rgba(102, 102, 102, 1);
					}
					
					.input {
						font-size: 32rpx;
						color: #000;
					}
				}
				
				.line3 {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin: 40rpx 0;
					
					.left {
						font-size: 36rpx;
						color: #000;
					}
					
					.right {
						font-size: 28rpx;
						color: #FEB787;
					}
				}
				
				.line4 {
					
				}
			}
			
			.content_box {
				flex: 1;
				overflow: hidden;
				display: flex;
				flex-direction: column;
				
				.title {
					font-size: 36rpx;
					font-weight: 700;
					color: rgba(39, 45, 47, 1);
					padding: 20rpx 0;
				}
				
				.block_box {
					flex: 1;
					overflow: hidden;
					
					.scroll_view {
						height: 100%;
						
						.scroll_content {
							padding-bottom: 60rpx;
						}
					}
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
									width: 60rpx;
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
							
							&.type1 {
								color: rgba(81, 37, 105, 1);
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
