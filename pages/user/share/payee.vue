<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:19:54
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-08-16 09:19:55
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar title="设置收款信息"></CustomNavbar>
			<view class="tabs_box">
				<u-tabs :list="contentList" :current="contentCurrent" :activeStyle="tabsActiveStyle" :inactiveStyle="tabsInactiveStyle" :lineColor="isColor" @change="changeContent($event, 1)" />
			</view>
		</view>
		<view class="main_content">
			<scroll-view style="height: 100%" :refresher-enabled="false">
				<swiper style="height: 100%" :skip-hidden-item-layout="true" :current="contentCurrent" @change="changeContent($event, 2)">
					<swiper-item class="swiper_item" v-for="(item, index) in contentList" :key="item.id">
						<view class="form_box" v-if="item.id === 1">
							<view class="form_input">
								<view class="label">真实姓名</view>
								<input class="input" type="text" v-model="wxParams.name" placeholder="请输入真实姓名" placeholder-class="placeholder">
							</view>
							<view class="form_input">
								<view class="label">微信收款码</view>
								<view class="upload">
									<view class="photo" v-if="wxParams.url">
										<image class="image" :src="wxParams.fullurl" mode="aspectFill" @click="previewImage(1)"></image>
										<view class="icon" @click="deleteImage(1)">
											<u-icon name="close" color="#fff" size="16"></u-icon>
										</view>
									</view>
									<view class="tip" v-else @click="uploadImage(1)">
										<view>请上传 <br> 收款码</view>
									</view>
								</u-upload>
								</view>
							</view>
						</view>
						<view class="form_box" v-if="item.id === 2">
							<view class="form_input">
								<view class="label">真实姓名</view>
								<input class="input" type="text" v-model="aliParams.name" placeholder="请输入真实姓名" placeholder-class="placeholder">
							</view>
							<view class="form_input">
								<view class="label">支付宝账户</view>
								<input class="input" type="text" v-model="aliParams.account" placeholder="请输入收款账号" placeholder-class="placeholder">
							</view>
							<view class="form_input">
								<view class="label">支付宝收款码</view>
								<view class="upload">
									<view class="photo" v-if="aliParams.url">
										<image class="image" :src="aliParams.fullurl" mode="aspectFill" @click="previewImage(2)"></image>
										<view class="icon" @click="deleteImage(2)">
											<u-icon name="close" color="#fff" size="16"></u-icon>
										</view>
									</view>
									<view class="tip" v-else @click="uploadImage(2)">
										<view>请上传 <br> 收款码</view>
									</view>
								</u-upload>
								</view>
							</view>
						</view>
						<view class="form_box" v-if="item.id === 3">
							<view class="form_input">
								<view class="label">真实姓名</view>
								<input class="input" type="text" v-model="bankParams.name" placeholder="请输入真实姓名" placeholder-class="placeholder">
							</view>
							<view class="form_input">
								<view class="label">开户行</view>
								<input class="input" type="text" v-model="bankParams.address" placeholder="请输入开户行" placeholder-class="placeholder">
							</view>
							<view class="form_input">
								<view class="label">银行卡号</view>
								<input class="input" type="text" v-model="bankParams.cardno" placeholder="请输入银行卡号" placeholder-class="placeholder">
							</view>
						</view>
					</swiper-item>
				</swiper>
			</scroll-view>
		</view>
		<view class="footer_content">
			<view class="button_box">
				<u-button text="保存信息" :loading="buttonLoading" :customStyle="buttonStyle" @click="submitHandle" />
			</view>
		</view>
	</view>
</template>

<script>
	import api from '@/common/request/api.js'
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
					background: getApp().globalData.isBgColor,
					borderRadius: '16rpx',
					margin: '0',
					fontWeight: 'bold'
				},
				buttonLoading: false,
				tabsActiveStyle: {
					background: getApp().globalData.isBgColor,
					'-webkit-background-clip': 'text',
					color: 'transparent',
					fontSize: '32rpx',
					fontWeight: 'bold',
				},
				tabsInactiveStyle: {
					color: '#808080'
				},
				contentList: [
					{ id: 1, name: '微信', type: 'wechat' },
					{ id: 2, name: '支付宝', type: 'alipay' },
					{ id: 3, name: '银行卡', type: 'bank' },
				],
				contentCurrent: 0,
				wxParams: {
					name: '',
					// fullurl: "https://mettgpt.nymaite.cn/uploads/20230526/b69d7d1cbbff0f828ff3dff354ecca3c.png",
					// url: "/uploads/20230526/b69d7d1cbbff0f828ff3dff354ecca3c.png"
					fullurl: '',
					url: ''
				},
				aliParams: {
					name: '',
					account: '',
					fullurl: '',
					url: ''
				},
				bankParams: {
					name: '',
					address: '',
					cardno: ''
				}
			}
		},
		computed: {
			...mapGetters("user", ["token", "userInfo"])
		},
		onLoad() {
			this.playback()
		},
		methods: {
			// 账户信息回显
			playback() {
				const type = this.contentList[this.contentCurrent].type
				this.$request('withdraw.account', { type }, false).then(res => {
					if(res.code === 1) {
						switch(this.contentCurrent) {
							case 0:
								this.wxParams.name = res.data.real_name
								this.wxParams.url = res.data.image
								this.wxParams.fullurl = res.data.image_url
								break;
							case 1:
								this.aliParams.name = res.data.real_name
								this.aliParams.account = res.data.card_no
								this.aliParams.url = res.data.image
								this.aliParams.fullurl = res.data.image_url
								break;
							case 2:
								this.bankParams.name = res.data.real_name
								this.bankParams.address = res.data.bank_name
								this.bankParams.cardno = res.data.card_no
								break;
						}
						
					}
				})
			},
			// 提交
			submitHandle() {
				const type = this.contentList[this.contentCurrent].type
				let obj = {}
				switch(this.contentCurrent) {
					case 0:
						obj = {
							type,
							real_name: this.wxParams.name,
							image: this.wxParams.url
						}
						break;
					case 1:
						obj = {
							type,
							real_name: this.aliParams.name,
							card_no: this.aliParams.account,
							image: this.aliParams.url
						}
						break;
					case 2:
						obj = {
							type,
							real_name: this.bankParams.name,
							bank_name: this.bankParams.address,
							card_no: this.bankParams.cardno
						}
						break;
				}
				
				if(this.contentCurrent == 1) {
					if(!obj.real_name) {
						this.$u.toast('请完善收款信息')
						return
					}
					if(!obj.card_no && !obj.image) {
						this.$u.toast('请完善收款信息')
						return
					}
				} else {
					const verify = Object.values(obj).every(val => val !== null && val !== undefined && val !== '');
					if(!verify) {
						this.$u.toast('请完善收款信息')
						return
					}
				}
				this.buttonLoading = true
				this.$request('withdraw.addAccount', obj).then(res => {
					if(res.code === 1) {
						this.$u.toast(res.msg)
						const timer = setTimeout(() => {
							this.$utils.navBack()
							clearTimeout(timer)
						}, 1500)
					}
					this.buttonLoading = false
				}).catch(err => {
					this.buttonLoading = false
				})
			},
			// 切换选项卡
			changeContent(e, i) {
				this.contentCurrent = i === 1 ? e.index : e.detail.current
				this.playback()
			},
			// 删除图片
			deleteImage(id) {
				uni.showModal({
					title: '提示',
					content: '确认要删除此项？',
					success: (res) => {
						if (res.confirm) {
							if(id === 1) {
								this.wxParams.url = ''
								this.wxParams.fullurl = ''
							} else if(id === 2) {
								this.aliParams.url = ''
								this.aliParams.fullurl = ''
							}
						} else if (res.cancel) {}
					}
				});
			},
			// 预览图片
			previewImage(id) {
				if(id === 1) {
					uni.previewImage({
						urls: [this.wxParams.fullurl]
					});
				} else if(id === 2) {
					uni.previewImage({
						urls: [this.aliParams.fullurl]
					});
				}
			},
			// 上传图片
			uploadImage(id) {
				uni.chooseImage({
					count: 1,
					success: chooseImageRes => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						uni.showLoading({
							title: '上传中...',
							mask: true
						})
						const uploadTask = uni.uploadFile({
							url: this.$BASE_URL + api.common.upload.url, //仅为示例，非真实的接口地址
							filePath: tempFilePaths[0],
							name: 'file',
							header: {
								'Token': this.token || '',
								'Sign': this.$SIGN || ''
							},
							success: uploadFileRes => {
								const file = JSON.parse(uploadFileRes.data)
								if(file.code == 1) {
									if(id === 1) {
										this.wxParams.url = file.data.url
										this.wxParams.fullurl = file.data.fullurl
									} else if(id === 2) {
										this.aliParams.url = file.data.url
										this.aliParams.fullurl = file.data.fullurl
									}
								} else {
									this.$u.toast(file.msg)
								}
								uni.hideLoading()
							},
							fail: fail => {
								uni.hideLoading()
								console.log("上传失败 =>", fail);
							}
						});
						
						uploadTask.onProgressUpdate(res => {
							console.log('上传进度' + res.progress);
							console.log('已经上传的数据长度' + res.totalBytesSent);
							console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
						});
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		padding-bottom: 60rpx;
		
		.head_content {
			.tabs_box {
				padding: 0 20rpx 10rpx;
			}
		}
		
		.main_content {
			overflow: hidden;
			
			.swiper_item {
				height: 100%;
				overflow-y: auto;
			}
			
			.form_box {
				padding: 24rpx 40rpx;
				
				.form_input {
					font-weight: 700;
					margin-bottom: 40rpx;
					
					.label {
						font-size: 36rpx;
						color: rgba(39, 45, 47, 1);
					}
					
					.input {
						height: auto;
						font-size: 32rpx;
						color: #000;
						padding: 20rpx 0;
						border-bottom: 2rpx solid rgba(221, 221, 221, 1);
					}
					
					.upload {
						margin-top: 28rpx;
						width: 196rpx;
						height: 196rpx;
						border-radius: 20rpx;
						background: #F4F5F7;
						display: flex;
						align-items: center;
						justify-content: center;
						overflow: hidden;
						
						.photo {
							width: 100%;
							height: 100%;
							position: relative;
							
							.image {
								width: 100%;
								height: 100%;
							}
							
							.icon {
								position: absolute;
								top: 10rpx;
								right: 10rpx;
								background: rgba(255, 0, 0, 1);
								padding: 4rpx;
								border-radius: 50%;
								opacity: 0.8;
							}
						}
						
						.tip {
							width: 100%;
							height: 100%;
							font-size: 28rpx;
							font-weight: normal;
							color: rgba(153, 153, 153, 1);
							display: flex;
							align-items: center;
							justify-content: center;
						}
					}
				}
			}
		}
		
		.footer_content {
			padding: 0 40rpx;
		}
	}
</style>
