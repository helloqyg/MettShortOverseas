<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:19:28
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-08-16 09:19:29
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar title="会员中心" color="#fff" bg="#262626"></CustomNavbar>
		</view>
		<view class="main_content">
			<view class="vip_box">
				<view class="top" v-if="userInfo.is_vip == 1">
					<view class="line1">尊贵的VIP用户</view>
					<view class="line2">
						<text class="text1"></text>
						<text class="text2">{{ userInfo.vip_expiretime_text }}到期</text>
					</view>
				</view>
				<view class="top" v-else>
					<view class="line1">月度会员</view>
					<view class="line2">
						<text class="text1">开通会员享受</text>
						<text class="text2">更好的服务</text>
					</view>
				</view>
				<view class="bottom">
					<view class="line1">
						<text class="text1">开通会员即享会员专属视频免费看</text>
						<!-- <text class="text2">Ai智能助手</text> -->
					</view>
					<view class="line2"></view>
				</view>
				<image class="vip_image" src="https://img.nymaite.com/video_short/icons/vip.png" mode="widthFix"></image>
			</view>
			<view class="pay_box box_bg">
				<view class="title_box">
					<image class="image1" src="https://img.nymaite.com/video_short/images/arrow.png" mode="widthFix"></image>
					<text class="text">开通会员选择</text>
					<image class="image2" src="https://img.nymaite.com/video_short/images/arrow.png" mode="widthFix"></image>
				</view>
				<view class="card_box">
					<view class="item" v-for="(item, index) in vipList" :key="item.id" @click="openVip(item.id, item.price)">
						<view class="price">
							<view class="oprice">￥{{ item.original_price }}</view>
							<view class="cprice">
								<text class="text1">￥</text>
								<text class="text2">{{ item.price }}</text>
								<text class="text3">/{{ item.type_text }}</text>
							</view>
						</view>
						<view class="button">立即开通</view>
					</view>
				</view>
			</view>
			
			<view class="task_box box_bg">
				<view class="title_box">
					<image class="image1" src="https://img.nymaite.com/video_short/images/arrow.png" mode="widthFix"></image>
					<text class="text">{{ textTitle }}</text>
					<image class="image2" src="https://img.nymaite.com/video_short/images/arrow.png" mode="widthFix"></image>
				</view>
				<view class="info_box">
					<u-parse :content="textInfo"></u-parse>
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
				isColor:getApp().globalData.isColor,
				isBgColor:getApp().globalData.isBgColor,
				vipList: [],
				buttonLoading: true,
				textTitle: "",
				textInfo: "",
			}
		},
		computed: {
			...mapGetters("user", ["token", "userInfo"]),
			...mapGetters("app", ["iosIsPay"]),
		},
		watch: {

		},
		async onShow(){
			 await this.$onLaunched
			 this.isColor = getApp().globalData.isColor
			 this.isBgColor=getApp().globalData.isBgColor
		},
		onLoad() {
			this.getVipList()
		},
		methods: {
			...mapActions("user", ["getUserInfo"]),
			// 获取vip类型
			getVipList() {
				this.$request('user.vip').then(res => {
					if(res.code === 1) {
						if(res.data.list && res.data.list.length) {
							this.vipList = res.data.list
						}
						this.textTitle = res.data?.vip_desc?.title || ""
						this.textInfo = res.data?.vip_desc?.content || ""
					}
				})
			},
			// 开通vip
			openVip(id, price) {
				// #ifdef MP-WEIXIN
				if(!this.iosIsPay) return this.jumpView('/pages/user/info/contact')
				// #endif
				if(this.buttonLoading) {
					this.buttonLoading = false
					uni.showLoading({
						title: '开通中...',
						mask: true
					})
					
					this.$request('order.create', {
						vip_id: id,
						total_fee: price,
						platform: this.$utils.platforms()
					}).then(res => {
						if(res.code === 1) {
							this.callPay(res.data.order_sn, 'wechat', res.data.platform)
						}
					})
				}
			},
			// 获取支付参数
			callPay(order_sn, payment, platform) {
				this.$request('common.ifxunipay').then(res=>{
					console.log(res)
					if(res.data.xunipay_switch == 0){
						this.$request('common.pay', {
							order_sn,
							payment,
							platform,
						}).then(res => {
							console.log(res)
							if(res.code === 1) {
								if(platform == 'H5') {
									console.log('进入这里\(^o^)/~')
									const div = document.createElement('divpay');
									div.innerHTML = res.data.pay_data;
									document.body.appendChild(div);
								} else {
									console.log('进入这里无语')
									
									this.pay(res.data.pay_data)
								}
							}
						})
					}else{
						// #ifdef MP-WEIXIN
						uni.login({
							provider: 'weixin',
							success: success => {
								if(success.errMsg === 'login:ok') {
									
									this.$request('common.xunipay', {
										order_sn,
										payment,
										platform,
										code: success.code
									}).then(res => {
										console.log(res)
										if(res.code === 1) {
											if(platform == 'H5') {
												const div = document.createElement('divpay');
												div.innerHTML = res.data.pay_data;
												document.body.appendChild(div);
											} else {
												this.xunipay(res.data.pay_data)
											}
										}
									})
									
								}
							}
						})
					// #endif
					// #ifndef MP-WEIXIN
					
						this.$request('common.pay', {
							order_sn,
							payment,
							platform,
						}).then(res => {
							console.log(res)
							if(res.code === 1) {
								if(platform == 'H5') {
									const div = document.createElement('divpay');
									div.innerHTML = res.data.pay_data;
									document.body.appendChild(div);
								} else {
									this.pay(res.data.pay_data)
								}
							}
						})
							// #endif
					}
				})
				
			},
			// 发起 小程序/公众号 支付
			xunipay(pay){
				var that = this
				// #ifdef MP-WEIXIN
				const SDKVersion = wx.getSystemInfoSync().SDKVersion
				
				if (this.compareVersion(SDKVersion, '2.19.2') >= 0 || wx.canIUse('requestVirtualPayment')) {
				  wx.requestVirtualPayment({
				    signData: JSON.stringify({
				      offerId: pay.signData.offerId,
				      buyQuantity: pay.signData.buyQuantity,
				      env: pay.signData.env,
				      currencyType: pay.signData.currencyType,
				      platform: pay.signData.platform,
				      productId: pay.signData.productId,
				      goodsPrice: pay.signData.goodsPrice,
				      outTradeNo: pay.signData.outTradeNo,
				      attach: pay.signData.attach,
				    }),
				    paySig: pay.paySig, 
				    signature: pay.signature,
				    mode: pay.mode,
				    success(res) {
				      //console.log('requestVirtualPayment success', res)
					  uni.showToast({
					      title: '支付成功',
					  	icon: 'none',
					  	duration: 2000
					  });
					that.buttonLoading = true
					that.getUserInfo()
					uni.$emit('updateUserInfo', true)
					uni.hideLoading()
					
				    },
				    fail({ errMsg, errCode }) {
				      //console.error(errMsg, errCode)
					  uni.showToast({
					      title: '支付失败',
					  	icon: 'none',
					  	duration: 2000
					  });
					that.buttonLoading = true
					uni.hideLoading()
				    },
				  })
				} else {
				  //console.log('当前用户的客户端版本不支持 wx.requestVirtualPayment')
				  
				  uni.showToast({
				      title: '当前用户的客户端版本不支持小程序虚拟支付',
				  	icon: 'none',
				  	duration: 2000
				  });
				 this.buttonLoading = true
				 uni.hideLoading()
				  
				}
				// #endif
				
				// // #ifdef H5
				
				// WeixinJSBridge.invoke(
				// 	'getBrandWCPayRequest', {
				// 		"appId": pay.appId, // 公众号ID，由商户传入     
				// 		"timeStamp": pay.timeStamp, // 时间戳，自1970年以来的秒数     
				// 		"nonceStr": pay.nonceStr, // 随机串     
				// 		"package": pay.package, // 订单详情扩展字符串
				// 		"signType": pay.signType, // 微信签名方式：     
				// 		"paySign": pay.paySign // 微信签名 
				// 	},
				// 	res => {
				// 		if (res.err_msg == "get_brand_wcpay_request:ok") {
				// 			uni.showToast({
				// 			    title: '支付成功',
				// 				icon: 'none',
				// 				duration: 2000
				// 			});
				// 			this.buttonLoading = true
				// 			this.getUserInfo()
				// 			uni.$emit('updateUserInfo', true)
				// 			uni.hideLoading()
				// 		} else {
				// 			uni.showToast({
				// 			    title: '支付失败',
				// 				icon: 'none',
				// 				duration: 2000
				// 			});
				// 			this.buttonLoading = true
				// 			uni.hideLoading()
				// 		}
				// 	});
				// // #endif
				
				// // #ifdef APP-PLUS
				// // APP
				// 	uni.getProvider({
				// 		service: "payment",
				// 		success: e => {
				// 			const type = e.provider.includes('wxpay')
				// 			type && uni.requestPayment({
				// 				"provider": "wxpay",
				// 				"orderInfo": pay,
				// 				success: success => {
				// 					uni.showToast({
				// 						title: '支付成功',
				// 						icon: 'none',
				// 						duration: 2000
				// 					});
								
				// 					this.buttonLoading = true
				// 					this.getUserInfo()
				// 					uni.$emit('updateUserInfo', true)
				// 					uni.hideLoading()
				// 				},
				// 				fail: fail => {
				// 					if(fail.errCode === -8) {
				// 						uni.showToast({
				// 							title: '未安装微信客户端',
				// 							icon: 'none',
				// 							duration: 2000
				// 						});
				// 						this.buttonLoading = true
				// 						uni.hideLoading()
				// 					} else {
				// 						uni.showToast({
				// 							title: '支付失败',
				// 							icon: 'none',
				// 							duration: 2000
				// 						});
				// 						this.buttonLoading = true
				// 						uni.hideLoading()
				// 					}
				// 				}
				// 			})
				// 		},
				// 		fail: e => {
				// 			this.payFail("获取iap支付通道失败")
				// 		}
				// 	});
				// // #endif
			},
			pay(pay) {
						// #ifdef MP-WEIXIN
						uni.requestPayment({
							timeStamp: pay.timeStamp,
							nonceStr: pay.nonceStr,
							package: pay.package,
							signType: pay.signType,
							paySign: pay.paySign,
							success: success => {
								uni.showToast({
								    title: '支付成功',
									icon: 'none',
									duration: 2000
								});
								this.buttonLoading = true
								this.getUserInfo()
								uni.$emit('updateUserInfo', true)
								uni.hideLoading()
							},
							fail: fail => {
								uni.showToast({
								    title: '支付失败',
									icon: 'none',
									duration: 2000
								});
								this.buttonLoading = true
								uni.hideLoading()
							}
						})
						// #endif
						
						// #ifdef H5
						
						WeixinJSBridge.invoke(
							'getBrandWCPayRequest', {
								"appId": pay.appId, // 公众号ID，由商户传入     
								"timeStamp": pay.timeStamp, // 时间戳，自1970年以来的秒数     
								"nonceStr": pay.nonceStr, // 随机串     
								"package": pay.package, // 订单详情扩展字符串
								"signType": pay.signType, // 微信签名方式：     
								"paySign": pay.paySign // 微信签名 
							},
							res => {
								if (res.err_msg == "get_brand_wcpay_request:ok") {
									uni.showToast({
									    title: '支付成功',
										icon: 'none',
										duration: 2000
									});
									this.buttonLoading = true
									this.getUserInfo()
									uni.$emit('updateUserInfo', true)
									uni.hideLoading()
								} else {
									uni.showToast({
									    title: '支付失败',
										icon: 'none',
										duration: 2000
									});
									this.buttonLoading = true
									uni.hideLoading()
								}
							});
						// #endif
						// #ifdef APP-PLUS
						// APP
							uni.getProvider({
								service: "payment",
								success: e => {
									const type = e.provider.includes('wxpay')
									type && uni.requestPayment({
										"provider": "wxpay",
										"orderInfo": pay,
										success: success => {
											uni.showToast({
												title: '支付成功',
												icon: 'none',
												duration: 2000
											});
										
											this.buttonLoading = true
											this.getUserInfo()
											uni.$emit('updateUserInfo', true)
											uni.hideLoading()
										},
										fail: fail => {
											if(fail.errCode === -8) {
												uni.showToast({
													title: '未安装微信客户端',
													icon: 'none',
													duration: 2000
												});
												this.buttonLoading = true
												uni.hideLoading()
											} else {
												uni.showToast({
													title: '支付失败',
													icon: 'none',
													duration: 2000
												});
												this.buttonLoading = true
												uni.hideLoading()
											}
										}
									})
								},
								fail: e => {
									this.payFail("获取iap支付通道失败")
								}
							});
						// #endif
					
				
			},
			//判断微信js版本用
			compareVersion(_v1, _v2) {
			  if (typeof _v1 !== 'string' || typeof _v2 !== 'string') return 0
			
			  const v1 = _v1.split('.')
			  const v2 = _v2.split('.')
			  const len = Math.max(v1.length, v2.length)
			
			  while (v1.length < len) {
			    v1.push('0')
			  }
			  while (v2.length < len) {
			    v2.push('0')
			  }
			
			  for (let i = 0; i < len; i++) {
			    const num1 = parseInt(v1[i], 10)
			    const num2 = parseInt(v2[i], 10)
			
			    if (num1 > num2) {
			      return 1
			    } else if (num1 < num2) {
			      return -1
			    }
			  }
			
			  return 0
			},
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
			
			.vip_box {
				height: 300rpx;
				border: 2rpx solid transparent;
				border-radius: 40rpx;
				background-clip: padding-box, border-box;
				background-origin: padding-box, border-box;
				background-image: linear-gradient(90deg, #1F2123, #141211), linear-gradient(90deg, #D2D2BB, #393834);
			
				padding: 32rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				position: relative;
				
				.top {
					.line1 {
						color:transparent;
						background: linear-gradient(90deg, #F1B873 0%, #F2DBA8 100%);
						-webkit-background-clip: text;
						font-size: 48rpx;
						font-weight: 900;
						// font-style: italic;
					}
					
					.line2 {
						font-size: 24rpx;
						margin-top: 12rpx;
						
						.text1 {
							color: #827F75;
						}
						
						.text2 {
							color: #E4CEAC;
						}
					}
				}
				
				.bottom {
					.line1 {
						font-size: 24rpx;
						color: #E4CEAC;
						display: flex;
						align-items: center;
						justify-content: space-between;
						
						.text1 {}
						.text2 {}
					}
					
					.line2 {
						width: 100%;
						height: 8rpx;
						border-radius: 8rpx;
						background: linear-gradient(90deg, #EDD9AB 0%, #F6C787 100%);
						margin-top: 12rpx;
					}
				}
				
				.vip_image {
					width: 260rpx;
					position: absolute;
					top: -52rpx;
					right: 0;
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
			
			.info_box {
				color: #FAD9B4;
				font-size: 28rpx;
			}
			
			.box_bg {
				border-radius: 20rpx;
				padding: 40rpx 32rpx 48rpx 32rpx;
				border: 2rpx solid #96948C;
				background: linear-gradient(225deg, #3D3D3B 0%, #2F2D2D 100%);
				box-shadow: 0 0 16rpx 0rpx rgba(#000, 0.2);
			}
			
			.pay_box {
				margin-top: 48rpx;
				
				.card_box {
					display: flex;
					flex-wrap: wrap;
					margin-bottom: -20rpx;
					
					.item {
						width: calc((100% - 60rpx) / 3);
						height: 284rpx;
						background-image: url('https://img.nymaite.com/video_short/images/card_1.png');
						background-repeat: no-repeat;
						background-size: 100% 100%;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						align-items: center;
						padding: 40rpx 0 24rpx;
						font-weight: bold;
						margin: 0 30rpx 30rpx 0;
						
						&:nth-child(3n) {
							margin-right: 0;
						}
						
						.price {
							text-align: center;
							margin-top: 10rpx;
							
							.oprice {
								font-size: 24rpx;
								color: #62615D;
								text-decoration: line-through;
								margin-bottom: 4rpx;
							}
							
							.cprice {
								color: #603B25;

								.text1 {
									font-size: 24rpx;
								}
								
								.text2 {
									font-size: 32rpx;
								}
								
								.text3 {
									font-size: 32rpx;
								}
							}
						}

						.button {
							width: 164rpx;
							height: 56rpx;
							line-height: 54rpx;
							text-align: center;
							color: #D2BB9F;
							font-size: 28rpx;
							background-image: url('https://img.nymaite.com/video_short/images/button.png');
							background-repeat: no-repeat;
							background-size: 100% 100%;
							font-weight: bold;
						}
					}
				}
			}
			
			.task_box {
				margin-top: 32rpx;
			}
		}
	}
</style>
