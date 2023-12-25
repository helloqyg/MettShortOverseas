/**
 * 切换系统样式
*/
//type是接收外部的传参来判断选择哪一个样式
const setSystemStyle =(type,iscolor) => {
	if(type == 0){
		const tabbarList =[{
				           "pagePath": "pages/home/index",
				           "iconPath": "static/tabbar/home_default.png",
				           "selectedIconPath": "static/images/inhome.png",
				           "text": "首页"
				       },
				       {
				           "pagePath": "pages/home/watch",
				           "iconPath": "static/images/chasing.png",
				           "selectedIconPath": "static/images/inchasing.png",
				           "text": "追剧"
				       },
						{
							"pagePath": "pages/home/video",
							"text": "介绍",
							"iconPath": "static/images/introduce.png",
							"selectedIconPath": "static/images/inintroduce.png"
						},
						{
							"pagePath": "pages/home/user",
							"text": "我的",
							"iconPath": "static/images/duce.png",
							"selectedIconPath": "static/images/induce.png"
						}
					]
					
					tabbarList.forEach((item, index) => {
						uni.setTabBarItem({
							index,
							iconPath: item.iconPath,
							selectedIconPath: item.selectedIconPath,
							success: function(res) {
								console.log('成功', res);
							},
							fail: function(er) {
							console.log('失败', err);
							}
						})
					})
					
						uni.setTabBarStyle({
							backgroundColor: "#ffffff",
							borderStyle: "black",
							color: "#999",
							selectedColor:"#5e73c3",
							success: function(res) {
								console.log('颜色成功', res);
							},
							fail: function(er) {
							console.log('颜色失败', err);
							}
							
						})
	}else{
			const tabbarList =[{
		        "pagePath": "pages/home/index",
		        "iconPath": "static/tabbar/home_default.png",
		        "selectedIconPath": "static/tabbar/home_selected.png",
		        "text": "首页"
		    },
		    {
		        "pagePath": "pages/home/watch",
		        "iconPath": "static/tabbar/watch_default.png",
		        "selectedIconPath": "static/tabbar/watch_selected.png",
		        "text": "追剧"
		    },
			{
				"pagePath": "pages/home/video",
				"text": "推荐",
				"iconPath": "static/tabbar/recommend_default.png",
				"selectedIconPath": "static/tabbar/recommend_selected.png"
			},
			{
				"pagePath": "pages/home/user",
				"text": "我的",
				"iconPath": "static/tabbar/user_default.png",
				"selectedIconPath": "static/tabbar/user_selected.png"
			}
		]
		
		tabbarList.forEach((item, index) => {
			uni.setTabBarItem({
				index,
				iconPath: item.iconPath,
				selectedIconPath: item.selectedIconPath,
				success: function(res) {
					console.log('成功', res);
				},
				fail: function(er) {
				console.log('失败', err);
				}
			})
		})
		
		uni.setTabBarStyle({
			backgroundColor: "#ffffff",
			borderStyle: "black",
			color: "#999",
			selectedColor:"#ee7f33",
			success: function(res) {
				console.log('颜色成功', res);
			},
			fail: function(er) {
			console.log('颜色失败', err);
			}
			
		})
	}
	
	
	
	
	
}

export { setSystemStyle }