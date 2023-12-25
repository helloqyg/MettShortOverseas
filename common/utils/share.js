/**
  * @Description: 
  * @Author: FangYaoTang
  * @Date: 2023-08-16 09:33:47
  * @LastEditor: FangYaoTang
  * @LastEditTime: 2023-08-19 15:00:47
  * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
  */
 
 
import request from '@/common/request/index.js'
import utils from '@/common/utils/index.js'
import store from '@/common/store/index.js'
import { BASE_URL, SIGN } from '@/env.js'
const jweixin = require('jweixin-module')

// 微信公众号分享
const wxoaShare = () => {
	// #ifdef H5
	const { app, user } = store.state
	const spm = user.userInfo?.id ? `${user.userInfo.id}.1.0.2.1` : ""
	
	let title = app.config?.share?.title || ""
	let imgUrl = app.config?.share?.image || ""
	let desc = app.config?.share?.description || ""
	
	const uri = window.location.origin + window.location.pathname
	const curi = window.location.hash.indexOf('/pages/video/play')
	let link = ''
	if(curi != -1) {
		link = `${window.location.href}&scene=${spm}`
		if(utils.getUrlParams().d) {
			const params = JSON.parse(decodeURIComponent(utils.getUrlParams().d))
			title = params?.title || app.config?.share?.title || ""
			imgUrl = params?.image || app.config?.share?.image || ""
			desc = params?.desc || app.config?.share?.description || ""
		}
	} else {
		link = `${uri}?${SIGN}#/pages/home/index?scene=${spm}`
	}
	
	let status = navigator.userAgent.toLowerCase();
	        if (status.match(/MicroMessenger/i) == "micromessenger") {
	            request('user.share', { uri }).then(res => {
	            	if(res.code === 1) {
	            		jweixin.config({
	            			debug: false,
	            			appId: res.data.appId,
	            			nonceStr: res.data.nonceStr,
	            			timestamp: res.data.timestamp,
	            			signature: res.data.signature,
	            			jsApiList: [
	            				'updateAppMessageShareData',
	            				'updateTimelineShareData',
	            			]
	            		})
	            		jweixin.ready(() => {
	            			// true(已登录) false(未登录)
	            			store.commit('app/setJwx', spm ? true : false)
	            			// 分享给朋友
	            			jweixin.updateAppMessageShareData({ 
	            				title,
	            				desc,
	            				link,
	            				imgUrl,
	            				success: e => {
	            					console.log("分享好友");
	            				}
	            			})
	            			// 分享朋友圈
	            			jweixin.updateTimelineShareData({
	            				title,
	            				link,
	            				imgUrl,
	            				success: e => {
	            					console.log("分享朋友圈");
	            				}
	            			})
	            		})
	            		jweixin.error(e => {
	            			console.log(e, '微信分享config信息验证失败');
	            		})
	            	}
	            })
	        }else{
	            console.log('h5')
	        }
	

	// #endif
}

export default wxoaShare
