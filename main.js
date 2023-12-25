/**
  * @Description: 
  * @Author: FangYaoTang
  * @Date: 2023-08-16 09:12:28
  * @LastEditor: FangYaoTang
  * @LastEditTime: 2023-09-08 16:19:40
  * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
  */
 

import Vue from 'vue'
import App from './App'

import { BASE_URL, SIGN } from './env.js'
Vue.prototype.$BASE_URL = BASE_URL
Vue.prototype.$SIGN = SIGN

// #ifdef H5
Vue.prototype.$WXOA_CALLBACK = `${window.location.origin + window.location.pathname}?${SIGN}#/pages/login/login`
// #endif

import uView from '@/uview-ui'
Vue.use(uView)

import request from '@/common/request/index.js'
Vue.prototype.$request = request

import utils from '@/common/utils/index.js'
Vue.prototype.$utils = utils

import store from '@/common/store/index.js'
Vue.prototype.$store = store

import CustomNavbar from '@/components/CustomNavbar.vue'
Vue.component('CustomNavbar', CustomNavbar)

import CustomBackTop from '@/components/CustomBackTop.vue'
Vue.component('CustomBackTop', CustomBackTop)

//自定义tabbar


// import * as system from "@/components/system.js"
// Vue.prototype.$system = system
// #ifdef H5
// import Vconsole from 'vconsole'
// const vConsole = new Vconsole();

import wxoaShare from '@/common/utils/share.js'
// #endif
//定义APP先执行$onLaunched
Vue.prototype.$onLaunched = new Promise(resolve => {
    Vue.prototype.$isResolve = resolve
})

Vue.mixin({
	data() {
		return {
			shareData: {
				spm: this.$store.state.user.userInfo?.id ? `${this.$store.state.user?.userInfo?.id}.1.0.3.1` : "",
				title: this.$store.state.app.config?.share?.title ? this.$store.state.app.config?.share?.title : "",
				imageUrl: this.$store.state.app.config?.share?.image ? this.$store.state.app.config?.share?.image : "",
				desc: this.$store.state.app.config?.share?.description ? this.$store.state.app.config?.share?.description : ""
			}
		}
	},
	onLoad(option) {
		
		// #ifdef MP-WEIXIN
		wx.showShareMenu({
			withShareTicket: false,
			menus: ["shareAppMessage", "shareTimeline"]
		})
		// #endif
	},
	onShow() {
		// #ifdef H5
		wxoaShare()
		// #endif
	},
	onShareAppMessage(res) {
		// #ifdef MP-WEIXIN
		this.$request('task.finish', { type: 'share_wx_after' })
		return {
			title: this.shareData.title,
			path: `/pages/home/index?scene=${this.shareData.spm}`,
			imageUrl: this.shareData.imageUrl
		}
		// #endif
	},
	onShareTimeline(res) {
		// #ifdef MP-WEIXIN
		this.$request('task.finish', { type: 'share_wxf_after' })
		return {
			title: this.shareData.title,
			query: `scene=${this.shareData.spm}`,
			imageUrl: this.shareData.imageUrl
		}
		// #endif
	},
	methods: {
		// 跳转页面
		jumpView(url) {
			uni.navigateTo({ url })
		},
		// 视频详情
		openVideoDetail(id, title, image, desc) {
			// #ifdef H5
			const obj = { title, image, desc }
			this.jumpView(`/pages/video/play?id=${id}&d=${JSON.stringify(obj)}`)
			// #endif
			// #ifndef H5
			this.jumpView(`/pages/video/play?id=${id}`)
			// #endif
		},
	}
})

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount()
