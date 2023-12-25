<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 08:57:26
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-09-08 11:22:45
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<script>
	// #ifdef APP-PLUS
	const request = require('./common/request/index').default
	const utils = require('./common/utils/index.js').default
	import checkappupdate from '@/common/utils/checkappupdate.js'
	import api from '@/common/request/api.js'
	// #endif
	import {imgAxios} from "@/components/jqueryImg.js"

	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		globalData:{
			status:1,
			isColor:'',
			isBgColor:''
		},
		 async onLaunch(options) {
			
			let that = this
			//做img接口请求
		
			console.log("App Launch");
			
			// 保存分享参数（H5、小程序）
			options.query.scene && this.setShare({ spm: options.query.scene })
			// 获取配置信息
			 await this.getConfigInfo()
					
			// #ifdef APP-PLUS
			// nvue变量
			this.request = request
			this.utils = utils
			// 锁定竖屏模式
			plus.screen.lockOrientation('portrait-primary');
			// app版本检测
			checkappupdate.check({
				api: this.$BASE_URL + api.common.update.url
			})
			// #endif

			// #ifdef H5
			// 非微信浏览器拦截
			// const useragent = navigator.userAgent
			// if (useragent.match(/MicroMessenger/i) != 'MicroMessenger') {
			// 	window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=888"
			// }
			// #endif

			// #ifdef MP-WEIXIN
			// 朋友圈场景
			if(options.scene === 1155) {
				if(options.path != 'pages/home/index') {
					uni.switchTab({
						url: '/pages/home/index'
					})
				}
			}
			
			// 小程序更新
			const updateManager = uni.getUpdateManager()
			updateManager.onCheckForUpdate(function (res) {
				// 请求完新版本信息的回调
				console.log(res.hasUpdate, "版本检测");
				if(res.hasUpdate) {
					updateManager.onUpdateReady(function (res) {
						uni.showModal({
							title: '更新提示',
							content: '新版本已经准备好，是否重启应用？',
							success: res => {
								if (res.confirm) {
									// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
									updateManager.applyUpdate()
								}
							}
						})
					})
					updateManager.onUpdateFailed(function (res) {
						// 新版本下载失败
						uni.showModal({
							title: '提示',
							content: '新版小程序下载失败\n请自行退出程序，手动卸载本程序，再运行',
							confirmText: "知道了"
						});
					})
				}
			})
			// #endif
		
			that.$isResolve()
			
		},
		async  onShow() {
			// #ifdef H5
			
			imgAxios().then(res=>{
				
			})
			// #endif
			//小程序自动登陆
			this.isLogin()
			console.log('App Show')
	
		},
	
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			async isLogin(){
				// #ifdef H5
				console.log('进入')
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
				// #endif
			},
			...mapActions("user", ["getUserInfo"]),
			...mapActions("app", ["getConfigInfo"]),
			...mapMutations("app", ["setShare"])
			
		},
		
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uview-ui/index.scss";
	@import "@/common/style/style.scss";
</style>
