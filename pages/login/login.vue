<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:18:06
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-09-12 11:36:52
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar :title="navTitle"></CustomNavbar>
		</view>
		<view class="main_content">
			<view class="logo">
				<image class="image" :src="config.system.company" mode="widthFix"></image>
			</view>
			<view class="input_box" v-if="login.type == 2 || login.bind">
				<u-form ref="uForm" :model="form" :rules="rules">
					<u-form-item prop="mobile">
						<view class="input">
							<u-input v-model="form.mobile" type="number" clearable placeholder="请输入手机号码"></u-input>
						</view>
					</u-form-item>
					<u-form-item prop="password" v-if="login.type2 == 1">
						<view class="input">
							<u-input v-model="form.password" type="password" clearable placeholder="请输入密码"></u-input>
						</view>
					</u-form-item>
					<u-form-item prop="code" v-else>
						<view class="input">
							<u-input v-model="form.code" type="number" clearable placeholder="请输入验证码">
								<template slot="suffix">
									<u-code ref="uCode" uniqueKey="login-code" :keepRunning="true" @change="codeChange" seconds="60" changeText="X秒重新获取"></u-code>
									<view class="codebtn" @click="getCode">{{ login.codeTips }}</view>
								</template>
							</u-input>
						</view>
					</u-form-item>
					<u-form-item prop="newPassword" v-if="login.type2 == 3">
						<view class="input">
							<u-input v-model="form.newPassword" type="password" clearable placeholder="请输入新密码"></u-input>
						</view>
					</u-form-item>
				</u-form>
			</view>
			<view class="mobile_type" v-if="login.type == 2">
				<view class="text" v-if="login.type2 == 1">
					<text @click="login.type2 = 2">验证码登录</text>
					<text @click="login.type2 = 3">忘记密码？</text>
				</view>
				<view class="text" v-else>
					<text @click="login.type2 = 1">密码登录</text>
					<text v-if="login.platform == 'H5'" @click="goToRegister">还没有账号？注册</text>
				</view>
			</view>
			<view class="button_box">
				<u-button v-if="login.type == 1 && !login.bind" text="登录" :loading="buttonLoading" :customStyle="buttonStyle" @click="loginSubmit" />
				<u-button v-if="login.type == 1 && login.bind" text="绑定手机号" :loading="buttonLoading" :customStyle="buttonStyle" @click="loginSubmit" />
				<u-button v-if="login.type == 2" :text="login.type2 == 3 ? '修改密码' : '登录'" :loading="buttonLoading" :customStyle="buttonStyle" @click="loginSubmit" />
			</view>
			<view class="check_box">
				<u-checkbox-group @change="labelChange">
					<u-checkbox :name="true" label="阅读并同意" labelSize="28rpx" labelColor="#333"></u-checkbox>
				</u-checkbox-group>
				<text class="text" @click="agreementClick(1, '用户协议')">《用户协议》</text>
				<text>和</text>
				<text class="text" @click="agreementClick(2, '隐私协议')">《隐私协议》</text>
			</view>
			<!-- <view class="mode_text" v-if="login.platform != 'H5' && !login.bind">
				<view class="line left"></view>
				<view class="text">其他方式登录</view>
				<view class="line right"></view>
			</view>
			<view class="icon_box" v-if="login.platform != 'H5' && !login.bind">
				<view class="icon">
					<image class="image" v-if="login.type == 1" src="/static/icons/mobile.png" mode="aspectFill" @click="login.type = 2"></image>
					<image class="image" v-else src="/static/icons/wx.png" mode="aspectFill" @click="login.type = 1"></image>
				</view>
			</view>
			<view class="text_info" v-if="login.platform != 'H5' && !login.bind">
				<text class="text" @click="goToRegister">还没有账号？注册</text>
			</view> -->
		</view>
	</view>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		data() {
			return {
				buttonStyle: {
					width: '100%',
					height: '100rpx',
					border: 'none',
					fontSize: '28rpx',
					color: '#fff',
					background: 'linear-gradient(90deg, #2A82E4, #D269FF)',
					borderRadius: '20rpx',
					margin: '0',
					fontWeight: 'bold'
				},
				buttonLoading: false,
				login: {
					type: 1, // 1(微信) / 2(手机号)
					type2: 2, // 1(密码) / 2(验证码) / 3(找回密码)
					platform: this.$utils.platforms(), // 平台(H5 / wxMiniProgram / wxOfficialAccount)
					codeTips: '', // 验证码提示文字
					checked: false, // 协议勾选
					bind: false, // 需要绑定手机号(微信)
					auth: '', // 待绑定的授权ID
				},
				form: {
					mobile: '', // 手机号
					password: '', // 密码
					code: '', // 验证码
					newPassword: '', // 新密码
				},
				rules: {
					mobile: [
						{ required: true, message: '请输入手机号', trigger: ['blur', 'change'] },
						{
							validator: (rule, value, callback) => {
								return uni.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							trigger: ['change','blur'],
						}
					],
					password: [
						{ required: true, message: '请输入密码', trigger: ['blur', 'change'] },
						{ validator: this.$utils.checkPassword, trigger: ['change','blur'] }
					],
					code: [
						{ required: true, message: '请输入验证码', trigger: ['blur', 'change'] },
						{ min: 4, max: 6, message: '请输入4~6位验证码', trigger: ['blur', 'change'] }
					],
					newPassword: [
						{ required: true, min: 6, max: 20, message: '请输入新密码', trigger: ['blur', 'change'] },
						{ validator: this.$utils.checkPassword, trigger: ['change','blur'] }
					],
				},
				configStore: this.$store.state.app.config,
			}
		},
		watch: {
			"login.type": {
				deep: true,
				handler: function(newValue, oldValue) {
					if(newValue == 2) {
						this.$nextTick(() => {
							this.$refs.uForm.setRules(this.rules)
						})
					}
				}
			},
			"login.bind": {
				deep: true,
				handler: function(newValue, oldValue) {
					if(newValue) {
						this.$nextTick(() => {
							this.$refs.uForm.setRules(this.rules)
						})
					}
				}
			},
			config: {
				deep: true,
				handler: function(newValue, oldValue) {
					this.configStore = newValue
				}
			},
		},
		computed: {
			...mapGetters('app', ['config', "share"]),
			navTitle() {
				let result = '登录'
				if(this.login.bind) {
					result = '绑定手机号'
				} else {
					if(this.login.type == 2) {
						if(this.login.type2 == 1) {
							result = '密码登录'
						} else if(this.login.type2 == 2) {
							result = '验证码登录'
						} else if(this.login.type2 == 3) {
							result = '找回密码'
						}
					}
					
				}
				return result
			}
		},
		onLoad(option) {
			// 让App端同步H5端的登录
			if(this.$utils.platforms() === 'H5' || this.$utils.platforms() === 'App') {
				this.login.type = 2
			}
			if(this.$utils.platforms() === 'wxOfficialAccount' && option) {
				
				this.wxoaAuthCallback(option)
			}
		},
		methods: {
			...mapActions("user", ["getUserInfo"]),
			// 查看协议
			agreementClick(id, title) {
				const rid = id === 1 ? this.configStore.system.user_protocol : this.configStore.system.privacy_protocol
				if(!rid) return
				const obj = { id: rid, title }
				this.jumpView(`/pages/user/info/richtext?d=${encodeURIComponent(JSON.stringify(obj))}`)
			},
			// 登录提交
			loginSubmit() {
				if(!this.login.checked) {
					this.$u.toast('请勾选并同意协议')
					return
				}
				let obj = {}
				if(this.login.type == 1) {
					// #ifdef MP-WEIXIN 
					console.log(this.login.bind)
					
					// 微信小程序
					if(this.login.bind) {
						this.bindAuthMobile(true)
					} else {
						this.wxmpAuth()
					}
					// #endif
					// #ifdef H5
					// 微信公众号
					if(this.login.bind) {
						this.bindAuthMobile(true)
					} else {
						this.wxoaAuth()
					}
					// #endif
				} else {
					if(this.login.type2 == 1) {
						// 密码登录
						this.$refs.uForm.validateField(['mobile', 'password'], errors => {
							if(!errors.length) {
								obj = {
									account: this.form.mobile,
									password: this.form.password
								}
								this.accountLogin(obj)
							}
						})
					} else if(this.login.type2 == 2) {
						// 验证码登录
						this.$refs.uForm.validateField(['mobile', 'code'], errors => {
							if(!errors.length) {
								obj = {
									mobile: this.form.mobile,
									code: this.form.code,
									platform: this.login.platform,
									spm: this.share.spm || ''
								}
								this.codeLogin(obj)
							}
						})
					} else {
						// 找回密码
						this.$refs.uForm.validateField(['mobile', 'code', 'newPassword'], errors => {
							if(!errors.length) {
								obj = {
									mobile: this.form.mobile,
									code: this.form.code,
									password: this.form.newPassword
								}
								this.forgotPassword(obj)
							}
						})
					}
				}
			},
			// 1.账号密码登录
			accountLogin(obj) {
				this.$request('login.accountLogin', obj).then(res => {
					if(res.code === 1) {
						this.$u.toast("登录成功")
						this.getUserInfo(res.data.token)
						this.redirectPath()
					}
				})
			},
			// 2.验证码登录
			codeLogin(obj) {
				this.$request('login.codeLogin', obj).then(res => {
					if(res.code === 1) {
						this.$u.toast("登录成功")
						this.getUserInfo(res.data.token)
						this.redirectPath()
					}
				})
			},
			// 3.找回密码
			forgotPassword(obj) {
				this.$request('login.forgotPassword', obj).then(res => {
					if(res.code === 1) {
						this.$u.toast("密码修改成功")
						this.login.type2 = 1
					}
				})
			},
			
			wxmpAuth() {
				// 4.微信小程序授权
				// #ifdef MP-WEIXIN 
				const loginRequest = () => {
					console.log('走了进来')
					
					uni.login({
						provider: 'weixin',
						success: success => {
							if(success.errMsg === 'login:ok') {
								console.log('调用成功')
								
								this.$request('login.wxmpLogin', { code: success.code }).then(res => {
									if(res.code === 1) {
										if(res.data.token) {
											this.$u.toast("登录成功")
											this.getUserInfo(res.data.token)
											this.redirectPath()
										}
										if(res.data.user_oauth_id) {
											this.login.auth = res.data.user_oauth_id
											if(this.config.system.mobile_switch == 1) {
												this.login.bind = true
											} else {
												this.bindAuthMobile(false)
											}
										}
									}
								})
							}else{
								console.log('调用失败')
							}
						}
					})
				}
				
				if(process.env.NODE_ENV === 'development') {
					console.log("开发环境");
					// this.getUserInfo("b0c3d7cf-d6c8-4b77-993b-918c81ad19d0")
					// this.redirectPath()
					loginRequest()
				} else {
					loginRequest()
				}
				// #endif
				
			},
			// 5.微信公众号授权
			async wxoaAuth() {
				// #ifdef H5
				if (process.env.NODE_ENV === 'development') {
					console.log("开发环境");
					await this.getUserInfo("71067ca6-d3ca-465f-b640-eb858ca846e1")
					this.redirectPath('wxoa')
				} else {
					const obj = {
						host: this.$WXOA_CALLBACK,
						event: 'login',
					};
					const payload = encodeURIComponent(JSON.stringify(obj));
					const redirect_uri = encodeURIComponent(`${this.$BASE_URL}/addons/drama/user/wxOfficialAccountOauth/sign/${this.$SIGN}?payload=${payload}`);
					const oauthUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${this.$store.state.app.appid}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=1`
					const page = getCurrentPages();
					const prevPage = page[page.length - 2]
					const lastPage = prevPage.__page__.fullPath
					uni.setStorageSync("lastPage", lastPage);
					window.location.href = oauthUrl;
				}
				// #endif
			},
			// 微信公众号授权回调
			async wxoaAuthCallback(option) {
				if(option?.token) {
					await this.getUserInfo(option.token)
					await this.redirectPath('wxoa')
				}
				if(option?.user_oauth_id) {
					this.login.auth = option.user_oauth_id
					if(this.config.system.mobile_switch == 1) {
						this.login.bind = true
					} else {
						this.bindAuthMobile(false)
					}
				}
			},
			// 微信小程序/公众号 绑定授权手机号
			bindAuthMobile(bind) {
				let obj = {
					user_oauth_id: this.login.auth,
					spm: this.share.spm || ""
				}
				const api = () => {
					this.$request('login.wxBind', obj).then(res => {
						if(res.code === 1) {
							this.$u.toast("绑定成功")
							this.getUserInfo(res.data.token)
							this.redirectPath()
						}
					})
				}
				if (!bind) return api()
				this.$refs.uForm.validateField(["mobile", "code"], errors => {
					if (!errors.length) {
						obj = { ...obj, mobile: this.form.mobile, code: this.form.code }
						api()
					}
				})
			},
			// 重定向路径
			redirectPath(type) {
				if(type == 'wxoa') {
					// #ifdef H5
					const lastPage = uni.getStorageSync('lastPage');
					if (lastPage && lastPage.indexOf('/pages/login/login') == -1) {
						uni.removeStorageSync('lastPage');
						uni.switchTab({
							url: lastPage,
							success: () => {},
							fail: () => {
								uni.switchTab({
									url: '/pages/home/index',
									success: () => {
										uni.navigateTo({
											url: lastPage
										})
									}
								})
							}
						})
					} else {
						uni.switchTab({
							url: '/pages/home/user'
						});
					}
					// #endif
				} else {
					const page = getCurrentPages()[0];
					if(page.route.indexOf('pages/login/login') == -1) {
						uni.navigateBack()
					} else {
						uni.switchTab({
							url: '/pages/home/user'
						});
					}
				}
			},
			
			// 去注册
			goToRegister() {
				this.jumpView('/pages/login/register')
			},
			// 协议勾选
			labelChange(detail) {
				this.login.checked = detail[0] ? detail[0] : false
			},
			// 验证码倒计时
			codeChange(text) {
				this.login.codeTips = text;
			},
			// 获取验证码
			getCode() {
				if(!this.form.mobile) {
					this.$u.toast("请输入手机号")
					return
				}
				let event = ''
				if(this.login.type == 1) {
					event = 'changemobile'
				} else {
					if(this.login.type2 == 2) {
						event = 'mobilelogin'
					} else if(this.login.type2 == 3) {
						event = 'resetpwd'
					}
				}
				let obj = {
					mobile: this.form.mobile,
					event
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
		}
	}
</script>

<style lang="scss" scoped>
	.main_content {
		padding: 60rpx;
		overflow-y: auto;
		
		.logo {
			width: 100%;
			padding: 40rpx 100rpx 100rpx 100rpx;
			
			.image {
				width: 100%;
			}
		}
		
		.input_box {
			::v-deep .u-form {
				.u-form-item__body {
					padding: 0 0 40rpx 0 !important;
				}
				
				.u-form-item__body__right__message {
					margin-left: 0 !important;
					line-height: 1.5em;
					font-size: 28rpx;
					padding: 0 10rpx 20rpx 10rpx;
				}
			}
			
			.input {
				width: 100%;
				
				::v-deep .u-input {
					height: 100rpx;
					background: #F7F8F9;
					border-radius: 16rpx;
					border: none;
					padding: 12rpx 24rpx !important;
				}
				
				.codebtn {
					font-size: 28rpx;
					color: #333;
				}
			}
		}
		
		.mobile_type {
			.text {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 28rpx;
				color: #333;
			}
		}
		
		.button_box {
			margin: 40rpx 0;
		}
		
		.check_box {
			display: flex;
			align-items: center;
			font-size: 28rpx;
			
			.text {
				color: #583EF2;
			}
		}
		
		.mode_text {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 20rpx;
			margin-top: 100rpx;
			
			.line {
				width: 152rpx;
				height: 2rpx;
				background: #D5DDE0;
			}
			
			.text {
				color: #333E63;
				font-size: 28rpx;
			}
		}
		
		.icon_box {
			margin: 160rpx 0 80rpx 0;
			
			.icon {
				width: 96rpx;
				height: 96rpx;
				border-radius: 50%;
				overflow: hidden;
				margin: 0 auto;
				
				.image {
					width: 100%;
					height: 100%;
				}
			}
		}
		
		.text_info {
			text-align: center;
			
			.text {
				color: #626262;
				font-size: 28rpx;
			}
		}
	}

</style>
