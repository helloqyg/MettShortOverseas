/**
  * @Description: 
  * @Author: FangYaoTang
  * @Date: 2023-08-16 09:14:24
  * @LastEditor: FangYaoTang
  * @LastEditTime: 2023-08-16 09:14:26
  * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
  */


import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

const modulesFiles = require.context("./modules", true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
	const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1")
	const value = modulesFiles(modulePath)
	modules[moduleName] = value.default
	return modules
}, {})

const store = new Vuex.Store({
	plugins: [
		createPersistedState({
			key: "vuex",
			storage: {
				getItem: key => uni.getStorageSync(key),
				setItem: (key, value) => uni.setStorageSync(key, value),
				removeItem: key => uni.removeStorageSync(key)
			},
			// reducer(val) {
			// 	return {
			// 		app: {
			// 			config: val.app.config,
			// 			appid: val.app.appid,
			// 		},
			// 		user: {
			// 			token: val.user.token,
			// 			userInfo: val.user.userInfo,
			// 		}
			// 	}
			// }
		})
	],
	modules
})

export default store
