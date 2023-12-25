<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:18:44
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-08-28 14:38:06
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar title="用户信息"></CustomNavbar>
		</view>
		<view class="main_content">
			<view class="wrapper">
				<view class="label">头像</view>
				<view class="content">
					<button class="avatar" type="default" open-type="chooseAvatar" @chooseavatar="onChooseAvatar" @click="changeAvatar">
						<image class="image" :src="user.avatar" mode="aspectFill"></image>
					</button>
					<image class="arrow" src="https://img.nymaite.com/video_short/icons/arrow.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="wrapper">
				<view class="label">昵称</view>
				<view class="content">
					<input class="nickname" v-model="user.nickname" type="nickname" placeholder="请输入昵称" placeholder-class="placeholder"/>
					<image class="arrow" src="https://img.nymaite.com/video_short/icons/arrow.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="wrapper">
				<view class="label">手机号</view>
				<view class="content" v-if="user.mobile">
					<input class="mobile" :value="user.mobile" type="number" disabled />
				</view>
				<view class="content" v-else @click="mobilePopup = true">
					<input class="mobile" type="number" placeholder="绑定手机号" placeholder-class="placeholder" disabled />
					<image class="arrow" src="https://img.nymaite.com/video_short/icons/arrow.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="wrapper">
				<view class="label">推荐人</view>
				<view class="content" v-if="user.parent_id">
					<input class="mobile" :value="user.parent_id" type="number" disabled />
				</view>
				<view class="content" v-else @click="referrer = true">
					<input class="mobile" type="number" placeholder="绑定推荐人" placeholder-class="placeholder" disabled />
					<image class="arrow" src="https://img.nymaite.com/video_short/icons/arrow.png" mode="widthFix"></image>
				</view>
			</view>
			
			<view class="button" style="margin-top: 40rpx;">
				<u-button type="error" :plain="true" text="退出登录" @click="logoutClick"></u-button>
			</view>
			
			<view class="button" style="margin-top: 40rpx;">
				<u-button type="error" text="注销账号" @click="deleteClick"></u-button>
			</view>
			
			<u-popup :show="mobilePopup" :round="20" :closeable="true" :closeOnClickOverlay="false" @close="mobilePopup = false">
				<view class="mobile_popup">
					<view class="input_box">
						<text class="label">手机号</text>
						<u-input v-model="form.mobile" type="number" :maxlength="11" border="none" cursorSpacing="200rpx" clearable placeholder="请输入手机号码"></u-input>
					</view>
					<view class="input_box">
						<text class="label">验证码</text>
						<u-input v-model="form.code" type="number" :maxlength="6" border="none" cursorSpacing="200rpx" clearable placeholder="请输入验证码"></u-input>
						<view class="send" @click="getCode">{{ codeTips }}</view>
					</view>
					<view class="button_box">
						<u-button text="取消" :customStyle="buttonStyleDisable" @click="mobilePopup = false"/>
						<u-button text="绑定" :customStyle="buttonStyle" @click="bindMobile" />
					</view>
				</view>
			</u-popup>
			<u-code ref="uCode" uniqueKey="info-code" :keepRunning="true" :seconds="60" @change="codeChange"></u-code>
			<u-popup :show="referrer" :round="20" :closeable="true" :closeOnClickOverlay="false" @close="referrer = false">
				<view class="mobile_popup">
					<view class="input_box">
						<text class="label">推荐人ID</text>
						<u-input v-model="referrerId" type="number" border="none" cursorSpacing="200rpx" clearable placeholder="请输入推荐人ID"></u-input>
					</view>
					<view class="button_box">
						<u-button text="取消" :customStyle="buttonStyleDisable" @click="referrer = false"/>
						<u-button text="绑定" :customStyle="buttonStyle" @click="referrerConfirm" />
					</view>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	import api from '@/common/request/api.js'
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		data() {
			return {
				buttonStyleDisable: {
					width: '300rpx',
					height: '80rpx',
					border: 'none',
					fontSize: '24rpx',
					color: '#fff',
					background: '#E0E0E0',
					borderRadius: '14rpx',
					margin: '0',
					fontWeight: 'bold'
				},
				buttonStyle: {
					width: '300rpx',
					height: '80rpx',
					border: 'none',
					fontSize: '24rpx',
					color: '#fff',
					background: 'linear-gradient(90deg, rgba(42, 130, 228, 1) 0%, rgba(172, 51, 193, 1) 100%)',
					borderRadius: '14rpx',
					margin: '0',
					fontWeight: 'bold'
				},
				userInfo: {},
				user: {
					avatar: '',
					nickname: '',
					mobile: '',
					parent_id: ''
				},
				uploadAvatar: '',
				// 推荐人
				referrer: false,
				referrerId: '',
				// 手机号
				mobilePopup: false,
				codeTips: '',
				form: {
					mobile: '',
					code: ''
				}
			}
		},
		computed: {
			...mapGetters("user", ["token"])
		},
		onLoad() {
			this.getPageData()
		},
		onUnload() {
			this.saveUserInfo()
		},
		methods: {
			...mapActions("user", ["logout", "getUserInfo"]),
			// 绑定手机号
			bindMobile() {
				if(!this.form.mobile) {
					this.$u.toast("请输入手机号")
					return
				}
				if(!this.form.code) {
					this.$u.toast("请输入验证码")
					return
				}
				const obj = {
					...this.form,
					user_oauth_id: this.userInfo.user_bind[this.$utils.platforms()] || 0
				}

				this.$request('login.wxBind', obj).then(res => {
					if(res.code === 1) {
						this.$u.toast("绑定成功")
						this.getUserInfo(res.data.token)
						uni.switchTab({
							url: '/pages/home/user'
						});
					} else if(res.code === 1314) {
						uni.showModal({
							title: '系统提示',
							content: res.msg,
							confirmText: '知道了',
							showCancel: false,
							success: res => {
								if (res.confirm) {
									console.log('用户点击确定');
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						})
					}
					this.mobilePopup = false
				})
			},
			// 退出登录
			logoutClick() {
				uni.showModal({
					title: '退出登录',
					content: '确认要退出登录吗？',
					success: res => {
						if (res.confirm) {
							console.log('用户点击确定');
							this.logout()
							uni.switchTab({
								url: '/pages/home/user'
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			// 注销账号
			deleteClick() {
				uni.showModal({
					title: '注销账号',
					content: '确认要注销账号吗？',
					success: res => {
						if (res.confirm) {
							console.log('用户点击确定');
							this.deleteAccount()
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			},
			// 删除账号
			deleteAccount() {
				this.$request('user.delete').then(res => {
					if(res.code === 1) {
						this.logout()
						uni.switchTab({
							url: '/pages/home/user'
						});
					}
				})
			},
			// 绑定推荐人
			referrerConfirm() {
				if(!this.referrerId) return
				this.$request('dealer.superior', { id: this.referrerId, platform: 'wxMiniProgram' }).then(res => {
					if(res.code === 1) {
						this.$u.toast(res.msg)
						this.referrer = false
						this.getPageData()
					} else {
						this.referrer = false
					}
				}).catch(err => {
					this.referrer = false
				})
			},
			// 验证码倒计时
			codeChange(text) {
				this.codeTips = text;
			},
			// 获取验证码
			getCode() {
				if(!this.form.mobile) {
					this.$u.toast("请输入手机号")
					return
				}
				
				let obj = {
					mobile: this.form.mobile,
					event: 'changemobile'
				}
				
				if (this.$refs.uCode.canGetCode) {
					uni.showLoading({
						title: '正在获取验证码'
					})
					this.$request('login.sendCode', obj, false).then(res => {
						if(res.code === 1) {
							uni.hideLoading();
							uni.$u.toast('验证码已发送');
							this.$refs.uCode.start();
						} else {
							uni.hideLoading();
							uni.$u.toast(res.msg);
						}
					}).catch(err => {
						uni.hideLoading();
						uni.$u.toast('验证码发送失败');
					})
				} else {
					uni.$u.toast('倒计时结束后再发送');
				}
			},
			// 获取页面数据
			getPageData() {
				this.getUserInfo().then(res => {
					if(res.code === 1) {
						this.userInfo = res.data
						this.user.avatar = res.data.avatar
						this.user.nickname = res.data.nickname
						this.user.mobile = res.data.mobile
						res.data.parent_id && (this.user.parent_id = res.data.parent_id)
					}
				})
			},
			// 修改头像
			changeAvatar() {
				// #ifndef MP-WEIXIN
				uni.chooseImage({
					success: (chooseImageRes) => {
						const tempFilePaths = chooseImageRes.tempFilePaths;
						this.uploadFile(tempFilePaths[0])
					}
				})
				// #endif
			},
			// 更换头像
			onChooseAvatar(e) {
				this.uploadFile(e.detail.avatarUrl)
			},
			// 上传文件
			uploadFile(url) {
				if(!url) return
				uni.showLoading({
					title: '上传中',
					mask: true
				})
				uni.uploadFile({
					url: this.$BASE_URL + api.common.upload.url,
					filePath: url,
					name: 'file',
					header: {
						'Token': this.token || '',
						'Sign': this.$SIGN || ''
					},
					success: file => {
						if(file.statusCode == 200) {
							const data = JSON.parse(file.data)
							if(data.code === 1) {
								this.user.avatar = data.data.fullurl
								this.uploadAvatar = data.data.url
							}
						}
						uni.hideLoading()
					},
					fail: err => {
						uni.hideLoading()
					}
				})
			},
			// 保存修改内容
			saveUserInfo() {
				const obj = {}
				if((this.userInfo.nickname != this.user.nickname) && this.user.nickname) {
					obj.nickname = this.user.nickname
				}
				if((this.userInfo.avatar != this.user.avatar) && this.uploadAvatar) {
					obj.avatar = this.uploadAvatar
				}
				if(Object.keys(obj).length === 0) return
				this.$request('user.updateInfo', obj).then(res => {
					if(res.code === 1) {
						uni.$emit('updateUserInfo', true)
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		.main_content {
			padding: 40rpx;
			overflow-y: auto;
			
			.wrapper {
				height: 100rpx;
				font-size: 32rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				
				.label {
					color: #000;
					white-space: nowrap;
				}
				
				.content {
					display: flex;
					align-items: center;
					color: #999;
					
					.avatar {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
						overflow: hidden;
						
						.image {
							width: 100%;
							height: 100%;
							border-radius: 50%;
						}
					}
					
					.arrow {
						width: 40rpx;
						margin-left: 10rpx;
					}
					
					.nickname,
					.mobile
					{
						font-size: 32rpx;
						color: #999;
						text-align: right;
					}
				}
			}
		}
		
		.mobile_popup {
			padding: 70rpx 40rpx 40rpx 40rpx;
			
			.input_box {
				height: 120rpx;
				position: relative;
				display: flex;
				align-items: center;
				
				.label {
					font-size: 32rpx;
					color: #000;
					white-space: nowrap;
					margin-right: 30rpx;
				}
				
				.input {
					flex: 1;
					font-size: 32rpx;
					color: #000;
					margin-left: 40rpx;
				}
				
				.send {
					font-size: 28rpx;
					color: #000;
					padding: 20rpx 0;
					position: absolute;
					top: 50%;
					right: 0;
					z-index: 10;
					transform: translateY(-50%);
				}
			}
			
			.button_box {
				margin-top: 70rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}
	}
</style>
