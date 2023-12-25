/**
  * @Description: 
  * @Author: FangYaoTang
  * @Date: 2023-08-16 09:15:22
  * @LastEditor: FangYaoTang
  * @LastEditTime: 2023-09-02 10:37:09
  * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
  */


import store from '@/common/store/index.js'

class IsMaxVserson {
	constructor(versonOld, versonNew) {
		this.versonOld = '';
		this.versonNew = '';
	}
	VsersonFlag(verson) {
		if (this.versonOld != '' && this.versonNew != '') {
			return Number(verson.split('').map(res => {
				return Number(res)
			}).filter(res => {
				return isNaN(res) != true
			}).join(''));
		}
	}
	isVserson(versonOld, versonNew) {
		this.versonOld = versonOld;
		this.versonNew = versonNew;
		if (this.VsersonFlag(versonOld) == this.VsersonFlag(versonNew)) {
			return {
				type: false,
				title: '已是最新版'
			}
		} else {
			return this.VsersonFlag(versonOld) < this.VsersonFlag(versonNew) ? {
				type: true,
				title: '检测到最新版'
			} : {
				type: false,
				title: '服务器版本过低'
			}
		}
	}
}

function check(param = {}) {
	if (!param.api) return false
	plus.runtime.getProperty(plus.runtime.appid, widgetInfo => {
		const platform = plus.os.name.toLocaleLowerCase()
		uni.request({
			url: param['api'],
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			method: 'GET',
			dataType: 'json',
			success: res => {
				if(!res?.data?.data?.newversion) return
				const app = new IsMaxVserson().isVserson(widgetInfo.version, res.data.data.newversion)
				if(!app.type) return
				const data = res?.data?.data || null
				if (data && data.downloadurl) {
					store.commit('app/setUpdateInfo', data)
					const timer = setTimeout(() => {
						uni.navigateTo({
							url: '/pages/home/update'
						})
						clearTimeout(timer)
					}, 200)
				}
			},
			fail: err => {
				console.log('fail', err)
			}
		})
	});
}

export default {
	check
}
