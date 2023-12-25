<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:18:16
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-08-16 09:18:17
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar title="注册"></CustomNavbar>
		</view>
		<view class="main_content">
			<view class="logo">
				<image class="image" :src="config.system.company" mode="widthFix"></image>
			</view>
			<view class="input_box">
				<u-form ref="uForm" :model="form" :rules="rules">
					<u-form-item prop="mobile">
						<view class="input">
							<u-input v-model="form.mobile" type="number" clearable placeholder="请输入手机号码"></u-input>
						</view>
					</u-form-item>
					<u-form-item prop="code">
						<view class="input">
							<u-input v-model="form.code" type="number" clearable placeholder="请输入验证码">
								<template slot="suffix">
									<u-code ref="uCode" uniqueKey="register-code" :keepRunning="true" @change="codeChange" seconds="60" changeText="X秒重新获取"></u-code>
									<view class="codebtn" @click="getCode">{{ login.codeTips }}</view>
								</template>
							</u-input>
						</view>
					</u-form-item>
					<u-form-item prop="registerPassword">
						<view class="input">
							<u-input v-model="form.registerPassword" type="password" clearable placeholder="请输入字母+数字组合的密码"></u-input>
						</view>
					</u-form-item>
					<u-form-item prop="againPassword">
						<view class="input">
							<u-input v-model="form.againPassword" type="password" clearable placeholder="请再次输入密码"></u-input>
						</view>
					</u-form-item>
				</u-form>
			</view>
			<view class="button_box">
				<u-button text="注册" :loading="buttonLoading" :customStyle="buttonStyle" @click="submitHandle" />
			</view>
			<view class="check_box">
				<u-checkbox-group @change="labelChange">
					<u-checkbox :name="true" label="阅读并同意" labelSize="28rpx" labelColor="#333"></u-checkbox>
				</u-checkbox-group>
				<text class="text">《服务协议》</text>
				<text>和</text>
				<text class="text">《隐私协议》</text>
			</view>
			<view class="text_info">
				<text class="text" @click="redirectPath">已有账号？去登录</text>
			</view>
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
					codeTips: '', // 验证码提示文字
					checked: false, // 协议勾选
					platform: this.$utils.platforms(), // 平台(H5 / wxMiniProgram / wxOfficialAccount)
				},
				form: {
					mobile: '', // 手机号
					code: '', // 验证码
					registerPassword: '', // 密码
					againPassword: '', // 确认密码
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
					code: [
						{ required: true, message: '请输入验证码', trigger: ['blur', 'change'] },
						{ min: 4, max: 6, message: '请输入4~6位验证码', trigger: ['blur', 'change'] }
					],
					registerPassword: [
						{ required: true, message: '请输入字母+数字组合的密码', trigger: ['blur', 'change'] },
						{ min: 6, max: 20, message: '密码格式有误', trigger: ['blur', 'change'] },
						{ validator: this.$utils.checkPassword, trigger: ['change','blur'] }
					],
					againPassword: [
						{ required: true, message: '请再次输入密码', trigger: ['blur', 'change'] },
						{
							validator: (rule, value, callback) => {
								this.$utils.checkAgainPassword(rule, value, callback, this.form.registerPassword)
							},
							trigger: ['change','blur'],
						}
					]
				}
			}
		},
		computed: {
			...mapGetters('app', ['config', "share"])
		},
		onLoad() {
			
		},
		onReady() {
			this.$nextTick(() => {
				this.$refs.uForm.setRules(this.rules)
			})
		},
		methods: {
			...mapActions('user', ['getUserInfo']),
			submitHandle() {
				if(!this.login.checked) {
					this.$u.toast('请勾选并同意协议')
					return
				}
				this.$refs.uForm.validate().then(res => {
					const obj = {
						mobile: this.form.mobile,
						code: this.form.code,
						password: this.form.againPassword,
						platform: this.login.platform,
						spm: this.share.spm || ''
					}
					this.registerAccount(obj)
				}).catch(err => {
					console.log(err, "验证未通过");
				})
			},
			// 1.注册账号
			registerAccount(obj) {
				this.$request('login.register', obj).then(res => {
					if(res.code === 1) {
						this.$u.toast("注册成功")
						this.getUserInfo(res.data.token)
						this.redirectPath(2)
					}
				})
			},
			// 重定向页面
			redirectPath(count = 1) {
				const page = getCurrentPages()[0];
				if(page.route.indexOf('pages/login/register') == -1) {
					uni.navigateBack({
						delta: Number(count)
					})
				} else {
					uni.switchTab({
						url: '/pages/home/index'
					});
				}
			},
			labelChange(detail) {
				this.login.checked = detail[0] ? detail[0] : false
			},
			codeChange(text) {
				this.login.codeTips = text;
			},
			getCode() {
				if(!this.form.mobile) {
					this.$u.toast("请输入手机号")
					return
				}
				let obj = {
					mobile: this.form.mobile,
					event: 'register'
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
		
		.text_info {
			margin-top: 60rpx;
			text-align: center;
			
			.text {
				color: #626262;
				font-size: 28rpx;
			}
		}
	}
</style>
