<template>

		<view class="tab-bar">
		    <view v-for="(item,index) in list" :key="index" class="tab-bar-item" @click="switchTab(item, index)">
		        <image class="tab_img" :src="currentIndex == index ? item.selectedIconPath : item.iconPath"></image>
		        <view class="tab_text" :style="{color: currentIndex == index ? selectedColor : color}">{{item.text}}</view>
		    </view>
		</view>
   
</template>

<script>
    export default {
        props: {
            selectedIndex: { // 当前选中的tab index
                default: 0
            },
        },
        data() {
            return {
                color: "#999",
                selectedColor:getApp().globalData.isColor,
                list: [],
                currentIndex:0,
            }
        },
        created() {
			uni.hideTabBar({
				index:this.default
			})
			this.$nextTick(()=>{
				  this.currentIndex = this.selectedIndex;
			})
          
            
            var _this = this
			
				if (uni.getStorageSync('identify') == 1) {
				    //橙色
				    _this.list = [{
				            "pagePath": "/pages/home/index",
				            "iconPath": "/static/tabbar/home_default.png",
				            "selectedIconPath": "/static/tabbar/home_selected.png",
				            "text": "首页"
				        },
				        {
				            "pagePath": "/pages/home/watch",
				            "iconPath": "/static/tabbar/watch_default.png",
				            "selectedIconPath": "/static/tabbar/watch_selected.png",
				            "text": "追剧"
				        },
						{
							"pagePath": "/pages/home/video",
							"text": "推荐",
							"iconPath": "/static/tabbar/recommend_default.png",
							"selectedIconPath": "/static/tabbar/recommend_selected.png"
						},
						{
							"pagePath": "/pages/home/user",
							"text": "我的",
							"iconPath": "/static/tabbar/user_default.png",
							"selectedIconPath": "/static/tabbar/user_selected.png"
						}
				    ]
				} else {
				    //青色
				   _this.list = [{
				           "pagePath": "/pages/home/index",
				           "iconPath": "/static/tabbar/home_default.png",
				           "selectedIconPath": "/static/images/inhome.png",
				           "text": "首页"
				       },
				       {
				           "pagePath": "/pages/home/watch",
				           "iconPath": "/static/images/chasing.png",
				           "selectedIconPath": "/static/images/inchasing.png",
				           "text": "追剧"
				       },
						{
							"pagePath": "/pages/home/video",
							"text": "介绍",
							"iconPath": "/static/images/introduce.png",
							"selectedIconPath": "/static/images/inintroduce.png"
						},
						{
							"pagePath": "/pages/home/user",
							"text": "我的",
							"iconPath": "/static/images/duce.png",
							"selectedIconPath": "/static/images/induce.png"
						}
					]
				}
		
            
        },
        methods: {
            switchTab(item, index) {
				
				this.$nextTick(()=>{
					this.currentIndex = index;
				})
                
                let url = item.pagePath;
                uni.switchTab({url:url})
            }
        }
    }
</script>

<style lang="scss">
    .tab-bar {
        position: sticky;
        bottom: 0;
        left: 0;
        right: 0;
        min-height: 100rpx;
        background: white;
        display: flex;
		padding-top: 10rpx;
        justify-content: center;
        align-items: center;
        padding-bottom: env(safe-area-inset-bottom); // 适配iphoneX的底部

        .tab-bar-item {
            flex: 1;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            .tab_img {
                width: 37rpx;
                height: 41rpx;
            }
            .tab_text {
                font-size: 20rpx;
                margin-top: 9rpx;
            }
        }
    }
</style>