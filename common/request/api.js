/**
  * @Description: 
  * @Author: FangYaoTang
  * @Date: 2023-08-16 09:13:24
  * @LastEditor: FangYaoTang
  * @LastEditTime: 2023-09-08 16:19:50
  * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
  */
 

const api = {
	// 公用
	common: {
		ifxunipay:{
			url:"/addons/drama/pay/xunipayswitch",
			method:"POST",
			desc:"虚拟支付"
		},
		xunipay:{
			url:"/addons/drama/pay/xunipay",
			method:"POST",
			desc:"虚拟支付"
		},
		init: {
			url: '/addons/drama/index/init',
			method: 'GET',
			desc: '初始信息'
		},
		wxmpLogin: {
			url: '/addons/drama/user/wxMinilogin',
			method: 'POST',
			desc: '微信小程序登录'
		},
		pay: {
			url: '/addons/drama/pay/prepay',
			method: 'POST',
			desc: '支付'
		},
		upload: {
			url: '/addons/drama/index/upload',
			method: 'POST',
			desc: '上传文件'
		},
		richtext: {
			url: '/addons/drama/index/richtext',
			method: 'GET',
			desc: '协议内容'
		},
		wxmpQrcode: {
			url: '/addons/drama/share/qrcode',
			method: 'GET',
			desc: '微信小程序分享小程序码'
		},
		swiper: {
			url: '/addons/drama/block/index',
			method: 'GET',
			desc: '轮播图'
		},
		module: {
			url: '/addons/drama/module/index',
			method: 'GET',
			desc: '功能模块'
		},
		update: {
			url: '/addons/drama/index/version',
			method: 'GET',
			desc: 'app版本检测'
		}
	},
	// 登录
	login: {
		wxmpLogin: {
			url: '/addons/drama/user/wxMinilogin',
			method: 'POST',
			desc: '微信小程序登录'
		},
		accountLogin: {
			url: '/addons/drama/user/accountLogin',
			method: 'POST',
			desc: '账号密码登录'
		},
		codeLogin: {
			url: '/addons/drama/user/smsLogin',
			method: 'POST',
			desc: '验证码登录/注册'
		},
		register: {
			url: '/addons/drama/user/smsRegister',
			method: 'POST',
			desc: '注册'
		},
		forgotPassword: {
			url: '/addons/drama/user/forgotPwd',
			method: 'POST',
			desc: '找回密码'
		},
		sendCode: {
			url: '/addons/drama/sms/send',
			method: 'POST',
			desc: '发送验证码'
		},
		wxBind: {
			url: '/addons/drama/user/register',
			method: 'POST',
			desc: '微信授权后绑定手机号'
		},
		getWxMobile: {
			url: '/addons/drama/user/getWxPhone',
			method: 'POST',
			desc: '获取微信手机号'
		}
	},
	// 用户
	user: {
		info: {
			url: '/addons/drama/user/index',
			method: 'GET',
			desc: '个人信息'
		},
		vip: {
			url: '/addons/drama/vip/index',
			method: 'GET',
			desc: '会员规格'
		},
		updateInfo: {
			url: '/addons/drama/user/profile',
			method: 'POST',
			desc: '修改用户信息'
		},
		delete: {
			url: '/addons/drama/user/delete',
			method: 'GET',
			desc: '删除用户'
		},
		cdkey: {
			url: '/addons/drama/cryptocard/decrypt_card',
			method: 'GET',
			desc: '兑换卡密'
		},
		share: {
			url: '/addons/drama/wechat/jssdk',
			method: 'POST',
			desc: '微信公众号分享'
		}
	},
	// 积分任务
	task: {
		list: {
			url: '/addons/drama/task/index',
			method: 'GET',
			desc: '获取积分任务'
		},
		finish: {
			url: '/addons/drama/task/add',
			method: 'POST',
			desc: '完成任务'
		},
		adtask: {
			url: '/addons/drama/task/uniad',
			method: 'POST',
			desc: '广告任务'
		}
	},
	// 视频
	video: {
		classify: {
			url: '/addons/drama/category/index',
			method: 'GET',
			desc: '分类'
		},
		list: {
			url: '/addons/drama/video/index',
			method: 'GET',
			desc: '列表'
		},
		menu: {
			url: '/addons/drama/video/detail',
			method: 'GET',
			desc: '节目单'
		},
		play: {
			url: '/addons/drama/video/getEpisodesUrl',
			method: 'POST',
			desc: '获取视频播放链接'
		},
		recommend: {
			url: '/addons/drama/video/recommend',
			method: 'GET',
			desc: '推荐视频'
		},
		addRecord: {
			url: '/addons/drama/video/log',
			method: 'POST',
			desc: '添加追剧和保存视频进度'
		},
		deleteRecord: {
			url: '/addons/drama/video/delLog',
			method: 'POST',
			desc: '取消追剧和删除播放记录'
		},
		getRecord: {
			url: '/addons/drama/video/logList',
			method: 'GET',
			desc: '获取播放记录'
		},
		likes: {
			url: '/addons/drama/video/favorite',
			method: 'POST',
			desc: '点赞'
		}
	},
	// 案例
	case: {
		classify: {
			url: '/addons/drama/archives/cotegory',
			method: 'GET',
			desc: '分类'
		},
		list: {
			url: '/addons/drama/archives/index',
			method: 'GET',
			desc: '列表'
		},
		detail: {
			url: '/addons/drama/archives/show',
			method: 'GET',
			desc: '详情'
		}
	},
	// 订单 (vip)
	order: {
		list: {
			url: '/addons/drama/vip_order/index',
			method: 'GET',
			desc: '列表'
		},
		detail: {
			url: '/addons/drama/vip_order/detail',
			method: 'GET',
			desc: '详情'
		},
		create: {
			url: '/addons/drama/vip_order/recharge',
			method: 'POST',
			desc: '生成订单'
		}
	},
	// 分销商
	dealer: {
		info: {
			url: '/addons/drama/user/userData',
			method: 'GET',
			desc: '分销商信息'
		},
		level: {
			url: '/addons/drama/reseller/index',
			method: 'GET',
			desc: '等级'
		},
		orderList: {
			url: '/addons/drama/reseller/order_list',
			method: 'GET',
			desc: '订单记录'
		},
		orderDetail: {
			url: '/addons/drama/reseller/order_detail',
			method: 'GET',
			desc: '订单详情'
		},
		createOrder: {
			url: '/addons/drama/reseller/recharge',
			method: 'POST',
			desc: '创建订单'
		},
		superior: {
			url: '/addons/drama/share/add',
			method: 'GET',
			desc: '添加上级'
		}
	},
	// 积分
	integral: {
		list: {
			url: '/addons/drama/usable/index',
			method: 'get',
			desc: '积分套餐'
		},
		record: {
			url: '/addons/drama/user_wallet_log/index',
			method: 'GET',
			desc: '积分流水记录'
		},
		create: {
			url: '/addons/drama/usable/recharge',
			method: 'post',
			dessc: '创建订单'
		}
	},
	// 分享
	share: {
		record: {
			url: '/addons/drama/share/index',
			method: 'GET',
			desc: '分享记录'
		},
		team: {
			url: '/addons/drama/reseller/user',
			method: 'GET',
			desc: '团队'
		},
		brokerage: {
			url: '/addons/drama/reseller/log',
			method: 'GET',
			desc: '佣金'
		}
	},
	// 提现
	withdraw: {
		account: {
			url: '/addons/drama/user_bank/info',
			method: 'GET',
			desc: '提现账户'
		},
		addAccount: {
			url: '/addons/drama/user_bank/edit',
			method: 'POST',
			desc: '添加提现账户'
		},
		record: {
			url: '/addons/drama/user_wallet_apply/index',
			method: 'GET',
			desc: '提现记录'
		},
		apply: {
			url: '/addons/drama/user_wallet_apply/apply',
			method: 'POST',
			desc: '提现申请'
		},
		rule: {
			url: '/addons/drama/user_wallet_apply/rule',
			method: 'GET',
			desc: '提现规则'
		}
	}
}

export default api;