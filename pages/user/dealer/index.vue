<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:18:29
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-08-16 09:18:30
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar title="开通经销商"></CustomNavbar>
		</view>
		<view class="main_content">
			<view class="info_box">
				<view class="user">
					<view class="avatar">
						<image class="image" :src="userInfo.avatar" mode="aspectFill"></image>
					</view>
					<view class="content" v-if="level == 0">
						<view class="p1">亲爱的平台用户，您好</view>
						<view class="p2">您还不是分销商，请在下面点击开通经销商</view>
					</view>
					<view class="content" v-else>
						<view class="p1">亲爱的{{ userInfo.levelText }}，您好</view>
						<view class="p2">恭喜你，您已是我们的{{ userInfo.levelText }}</view>
					</view>
				</view>
				<view class="card">
					<view class="texts" v-if="level == 0">
						<text class="text1" :style="'color:'+isColor">平台用户</text>
						<text class="text3">永久有效</text>
					</view>
					<view class="texts" v-else>
						<text class="text1">{{ userInfo.levelText }}</text>
						<!-- <text class="text2">开通时间:2023年5月26日</text> -->
						<text class="text3">{{ userInfo.expireText }}</text>
					</view>
				</view>
			</view>
			<view class="content_box">
				<view class="level_box">
					<view class="title">等级分类</view>
					<view class="list_box" v-if="levelData.length">
						<view class="item" :style="item.level == dredgeLevel ?'background-image: linear-gradient(to right, #000, #000),'+isBgColor :''" :class="{ active: item.level == dredgeLevel }" v-for="(item, index) in levelData" :key="index" @click="levelCardClick(item)">
							<view class="text1">{{ item.expire_text }}</view>
							<view class="text2" :style="'color:'+isColor">
								<text>￥</text>
								<text class="num">{{ item.price }}</text>
							</view>
							<view class="text3">直接分润{{ Number(item.direct) }}%</view>
							<view class="text3">间接分润{{ Number(item.indirect) }}%</view>
							<view class="tip" :style="'background:'+isBgColor">{{ item.name }}</view>
						</view>
					</view>
				</view>
				<view class="text_box">
					<u-parse :content="msg"></u-parse>
				</view>
			</view>
		</view>
		<view class="footer_content" v-if="levelData.length">
			<view class="button_box">
				<u-button text="立即开通" v-if="dredgeLevel != 0" :loading="buttonLoading" :customStyle="buttonStyle" @click="dredgeDealer" />
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
				buttonStyle: {
					width: '100%',
					height: '108rpx',
					border: 'none',
					fontSize: '32rpx',
					color: '#fff',
					background: `${getApp().globalData.isBgColor}`,
					borderRadius: '16rpx',
					margin: '0',
					fontWeight: 'bold'
				},
				buttonLoading: false,
				msg: '',
				levelData: [], // 等级列表
				level: 0, // 自己的等级
				dredgeLevel: 0, // 需要开通的等级
				maxLevel: 0, // 最大等级
				dredge: { // 需要开通的参数
					reseller_id: '',
					total_fee: ''
				},
				userInfo: ''
			}
		},
		computed: {
			...mapGetters("user", ["token"]),
			...mapGetters("app", ["iosIsPay"])
		},
		watch: {
			
		},
		onPageScroll(e) {
			let colorAlpha = e.scrollTop > 100 ? 0.95 : e.scrollTop * 0.0095
			this.navbarBg = `rgba(255, 255, 255, ${colorAlpha})`
		},
		onLoad() {
			this.getPageData()
			
		},
		async onShow(){
			 await this.$onLaunched
			 this.isColor = getApp().globalData.isColor
			 this.isBgColor=getApp().globalData.isBgColor
			 this.buttonStyle.background = getApp().globalData.isBgColor
			 console.log(this.isColor)
		},
		methods: {
			...mapActions("user", ["getUserInfo"]),
			// 开通经销商
			dredgeDealer() {
			// #ifdef MP-WEIXIN
			if(!this.iosIsPay) return this.jumpView('/pages/user/info/contact')
			// #endif
				
				const buy = () => {
					this.buttonLoading = true
					uni.showLoading({
						title: '开通中...',
						mask: true
					})
					
					this.$request('dealer.createOrder', {
						...this.dredge,
						platform: this.$utils.platforms()
					}).then(res => {
						if(res.code === 1) {
							this.callPay(res.data.order_sn, 'wechat', res.data.platform)
						} else {
							this.buttonLoading = false
							uni.hideLoading()
						}
					}).catch(err => {
						this.buttonLoading = false
						uni.hideLoading()
					})
				}
				
				if(this.dredgeLevel < this.level) {
					uni.showModal({
						title: '提示',
						content: '当前购买等级小于已购买等级，是否继续购买？',
						success: (res) => {
							if (res.confirm) {
								buy()
							} else if (res.cancel) {}
						}
					});
				} else {
					buy()
				}
			},
			// 发起支付请求
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
									const div = document.createElement('divpay');
									div.innerHTML = res.data.pay_data;
									document.body.appendChild(div);
								} else {
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
				
				if (that.compareVersion(SDKVersion, '2.19.2') >= 0 || wx.canIUse('requestVirtualPayment')) {
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
					that.buttonLoading = false
					that.getPageData()
					uni.hideLoading()
					
					
				    },
				    fail({ errMsg, errCode }) {
				      //console.error(errMsg, errCode)
					  uni.showToast({
					      title: '支付失败',
					  	icon: 'none',
					  	duration: 2000
					  });
					that.buttonLoading = false
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
				 that.buttonLoading = false
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
					var that = this
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
								that.buttonLoading = false
								that.getPageData()
								uni.hideLoading()
							},
							fail: fail => {
								uni.showToast({
								    title: '支付失败',
									icon: 'none',
									duration: 2000
								});
								that.buttonLoading = false
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
									that.buttonLoading = false
									that.getPageData()
									uni.hideLoading()
								} else {
									uni.showToast({
									    title: '支付失败',
										icon: 'none',
										duration: 2000
									});
									that.buttonLoading = false
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
											that.buttonLoading = false
											that.getPageData()
											uni.hideLoading()
											
										},
										fail: fail => {
											if(fail.errCode === -8) {
												uni.showToast({
													title: '未安装微信客户端',
													icon: 'none',
													duration: 2000
												});
												that.buttonLoading = false
												uni.hideLoading()
											} else {
												uni.showToast({
													title: '支付失败',
													icon: 'none',
													duration: 2000
												});
												that.buttonLoading = false
												uni.hideLoading()
											}
										}
									})
								},
								fail: e => {
									that.payFail("获取iap支付通道失败")
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
			// 点击的经销商等级
			levelCardClick(item) {
				this.dredgeLevel = item.level
				this.dredgeLevelId = item.id
			
				this.dredge.reseller_id = item.id
				this.dredge.total_fee = item.price
			},
			// 经销商等级
			dealerLevelList() {
				this.$request('dealer.level').then(res => {
					if(res.code === 1) {
						this.levelData = res.data.list
						// this.msg = res.data.list[0].content
						this.msg = res.data.reseller_desc.content
						let level = res.data.list.map(obj => obj.level);
						this.maxLevel = Math.max(...level)
						this.dredgeLevel = this.level + 1 > this.maxLevel ? this.maxLevel : this.level + 1
						if(this.dredgeLevel <= this.maxLevel) {
							let item = res.data.list.filter(item => item.level == this.dredgeLevel)[0]
							this.dredge.reseller_id = item.id
							this.dredge.total_fee = item.price
						}
					}
				})
			},
			// 个人信息
			getPageData() {
				this.getUserInfo().then(res => {
					if(res.code === 1) {
						this.level = res.data.reseller ? res.data.reseller.level : 0
						// this.userInfo = { avatar: res.data.avatar }
						this.userInfo = res.data
						if(res.data.reseller) {
							let obj = {
								id: res.data.reseller.reseller_id,
								level: res.data.reseller.level,
								levelText: res.data.reseller.reseller_json.name,
								expireText: res.data.reseller.expiretime_text
							}
							
							this.userInfo = {
								...this.userInfo,
								...obj
							}
						}
						this.dealerLevelList()
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		position: relative;
		
		&::before {
			content: "";
			width: 100%;
			height: 410rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 0;
			background-image: url('https://img.nymaite.com/video_short/images/v_bg.png');
			background-repeat: no-repeat;
			background-size: auto 100%;
			background-position: 110% 100%;
		}
		
		.head_content {
			background: #F9F9FB;
		}
		
		.main_content {
			overflow-x: hidden;
			padding-bottom: 200rpx;
			
			.info_box {
				width: 140%;
				background: #F9F9FB;
				border-radius: 0 0 50% 50%;
				margin-left: -20%;
				padding: 0 calc(20% + 32rpx);
				overflow: hidden;
				  
				.user {
					position: relative;
					display: flex;
					align-items: center;
					margin-top: 10rpx;
					
					.avatar {
						width: 114rpx;
						height: 114rpx;
						border-radius: 50%;
						overflow: hidden;
						
						.image {
							width: 100%;
							height: 100%;
						}
					}
					
					.content {
						margin-left: 24rpx;
						
						.p1 {
							font-size: 32rpx;
							color: #333;
							margin-bottom: 8rpx;
							font-weight: 700;
						}
						
						.p2 {
							font-size: 28rpx;
							color: #999;
						}
					}
				}
				
				.card {
					position: relative;
					height: 120rpx;
					margin-top: 10rpx;
					border-radius: 16rpx;
					padding: 32rpx 40rpx 0 40rpx;
					background: linear-gradient(269.64deg, rgba(92, 86, 96, 1) 0%, rgba(57, 52, 59, 1) 100%);
					
					&::before {
						content: "";
						width: 100%;
						height: 100%;
						position: absolute;
						top: 0;
						left: 0;
						background-image: url('https://img.nymaite.com/video_short/images/line_bg.png');
						background-repeat: no-repeat;
						background-size: auto 110%;
						background-position: 50% 0;
					}
					
					.texts {
						position: relative;
						display: flex;
						align-items: center;
						justify-content: space-between;
						
						.text1 {
							font-size: 36rpx;
							// color: #E6BD70;
							// color: #F28C46;
							color: #FEB787;
							font-weight: 700;
						}
						
						.text2 {
							font-size: 24rpx;
							color: #fff;
						}
						
						.text3 {
							font-size: 24rpx;
							color: #fff;
						}
					}
				}
			}
			
			.content_box {
				padding: 32rpx;
				
				.level_box {
					position: relative;
					background: #fff;
					
					.title {
						font-size: 36rpx;
						font-weight: 700;
						color: #272D2F;
					}
					
					.list_box {
						margin-top: 36rpx;
						display: flex;
						flex-wrap: wrap;
						
						.item {
							position: relative;
							width: calc((100% - 60rpx) / 3);
							border-radius: 20rpx;
							padding: 72rpx 20rpx 36rpx 20rpx;
							border: 4rpx solid transparent;
							background: rgba(77, 77, 77, 1);
							margin: 0 30rpx 30rpx 0;
							
							&:nth-child(3n) {
								margin-right: 0;
							}
							
							&.active {
								background-clip: padding-box, border-box;
								background-origin: padding-box, border-box;
								background-image: linear-gradient(to right, #000, #000), linear-gradient(90deg, #F28D48 0%, #FEB685 100%);
							}
							
							.text1 {
								font-size: 28rpx;
								color: #fff;
							}
							
							.text2 {
								font-size: 36rpx;
								color: #F28C46;
								margin: 8rpx 0;
								
								.num {
									font-size: 64rpx;
									font-weight: 900;
								}
							}
							
							.text3 {
								font-size: 24rpx;
								color: #fff;
							}
							
							.tip {
								font-size: 24rpx;
								font-weight: 700;
								color: #fff;
								padding: 8rpx 16rpx;
								border-radius: 0 20rpx 0 20rpx;
								background: linear-gradient(90deg, #F28B45 0%, #FEB787 100%);
								position: absolute;
								top: -4rpx;
								right: -4rpx;
							}
						}
					}
				}
				
				.text_box {
					margin-top: 40rpx;
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
	
		.footer_content {
			width: 100%;
			padding: 0 32rpx;
			position: fixed;
			bottom: 40rpx;
			left: 0;
		}
	}
</style>
