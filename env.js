/**
  * @Description: 
  * @Author: FangYaoTang
  * @Date: 2023-08-16 09:12:13
  * @LastEditor: FangYaoTang
  * @LastEditTime: 2023-09-12 11:27:35
  * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
  */


// #ifdef MP-WEIXIN
let BASE_URL = '', SIGN = ''
// BASE_URL = 'https://www.lnshuanghe.top/'

// SIGN = ''
 
const extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : {}
if(Object.keys(extConfig).length === 0) {
	uni.showModal({
		title: '未配置ext信息，请联系管理员'
	})
} else {
	if(!extConfig.domain) {
		uni.showModal({
			title: '域名信息有误，请联系管理员'
		})
	}
	BASE_URL = 'https://' + extConfig.domain
	SIGN = extConfig.sign
}
// #endif

// #ifdef H5
let BASE_URL = '', SIGN = ''
if (process.env.NODE_ENV === 'development') {
	BASE_URL = 'https://duanju.nymaite.cn'
	SIGN = ''
} else {
	BASE_URL = window.location.origin
	SIGN = window.location.search.replace(/\?/g, "")
}
// #endif

// #ifdef APP-PLUS
let BASE_URL = 'https://vip.doupian.vip',
	SIGN = ''
// #endif


export {
	BASE_URL,
	SIGN
}