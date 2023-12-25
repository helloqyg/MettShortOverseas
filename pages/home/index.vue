<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:16:52
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-09-12 14:29:26
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		
		<view class="head_content">
			<CustomNavbar :left="0" :title="navbarTitle"></CustomNavbar>
			<view class="tabs_box">
				<u-tabs :list="contentList" :current="contentCurrent" :activeStyle="tabsActiveStyle" :inactiveStyle="tabsInactiveStyle" :lineColor="isBgColor" @change="changeContent($event, 1)" />
				<view class="search" @click="jumpView('/pages/video/search')">
					<u-icon name="search" color="#666" size="28"></u-icon>
				</view>
			</view>
			
		</view>
		<view class="main_content" v-if="contentList && contentList.length">
			<swiper style="height: 100%" :skip-hidden-item-layout="true" :current="contentCurrent" @change="changeContent($event, 2)">
				<swiper-item style="height: 100%;" v-for="(item, index) in contentList" :key="item.id">
					<scroll-view style="height: 100%" :scroll-y="true" :refresher-enabled="true" :refresher-threshold="100" :refresher-triggered="refreshStatus" @refresherrefresh="refreshHandle" @scrolltolower="bottomHandle" @scroll="scrollHandle">
						<view class="content_box">
							<view class="tabs" v-if="item.id == 0  ">
								<view class="item" :style="tabsActive.id == tabItem.id ? `background:${isBgColor}`:''" :class="{ active: tabsActive.id == tabItem.id }" v-for="(tabItem, tabIndex) in tabsList" :key="tabIndex" @click="changeTabs(tabItem)">{{ tabItem.name }}</view>
							</view>
							<view class="list" v-if="item.id == 0">
								<block v-for="(lItem, lIndex) in item.list" :key="lIndex">
									
									<view  v-if="lIndex % 10 == 0" style="width: 100%;"> 
									<!-- <view class="tabs" v-if="item.id == 0 && lIndex == 0 && isStatue == 1">
										<view class="item" :style="tabsActive.id == tabItem.id ? `background:${isBgColor}`:''" :class="{ active: tabsActive.id == tabItem.id }" v-for="(tabItem, tabIndex) in tabsList" :key="tabIndex" @click="changeTabs(tabItem)">{{ tabItem.name }}</view>
									</view> -->
										<view class="sitem" @click="openVideoDetail(lItem.id, lItem.title, lItem.image, lItem.description)">
											<view class="left">
												<image class="image" :src="lItem.image" mode="aspectFill"></image>
											</view>
											
											<view class="right">
												<view class="info">
													<view class="tbox">
														<view class="title">{{ lItem.title }}</view>
														<view class="text u-line-5">{{ lItem.description }}</view>
													</view>
												</view>
												<view class="button" :class="{ collect: lItem.is_favorite == 1 }" hover-class="active" :hover-start-time="0" :hover-stay-time="200" @click.stop="handleCollect(lItem.id, lItem.is_favorite, lIndex)">
													<u-icon :name="lItem.is_favorite == 1 ? 'star-fill' : 'star'" color="#eee" size="18"></u-icon>
													<text class="text">{{ lItem.is_favorite == 1 ? '已追剧' : '追剧' }}</text>
												</view>
											</view>
											
										</view>
										<!-- <view class="tabs" v-if="item.id == 0 && lIndex == 0&& isStatue == 0">
											<view class="item" :style="tabsActive.id == tabItem.id ? `background:${isBgColor}`:''" :class="{ active: tabsActive.id == tabItem.id }" v-for="(tabItem, tabIndex) in tabsList" :key="tabIndex" @click="changeTabs(tabItem)">{{ tabItem.name }}</view>
										</view> -->
									</view>
									
									<view class="item item1" v-else @click="openVideoDetail(lItem.id, lItem.title, lItem.image, lItem.description)">
										<view class="img">
											<image class="image" :src="lItem.image" mode="aspectFill"></image>
										</view>
										<view class="info">
											<view class="title u-line-1">{{ lItem.title }}</view>
											<view class="text u-line-1">{{ lItem.description }}</view>
										</view>
									</view>
								</block>
							</view>
							<view class="list" v-else>
								<view class="item item2" v-for="(lItem, lIndex) in item.list" :key="lIndex" @click="openVideoDetail(lItem.id, lItem.title, lItem.image, lItem.description)">
									<view class="img">
										<image class="image" :src="lItem.image" mode="aspectFill"></image>
									</view>
									<view class="info">
										<view class="title u-line-1">{{ lItem.title }}</view>
										<view class="text u-line-1">{{ lItem.description }}</view>
									</view>
								</view>
							</view>
							
							<view class="nodata" v-if="!item.list.length && item.status == 'nomore'">
								<u-empty mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png" />
							</view>
							<view class="liststatus" v-else>
								<u-loadmore :status="item.status" :line="true" />
							</view>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		
		<!-- #ifdef MP-WEIXIN -->
		<zero-privacy :onNeed="false" :hideTabBar="true"></zero-privacy>
		<!-- #endif -->
		
		<!-- <tabBar v-if="tabChange" selectedIndex = 0></tabBar> -->
	</view>
</template>

<script>	
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		data() {
			return {		
				isBgColor:getApp().globalData.isBgColor,
				isStatue:getApp().globalData.status,
				navbarTitle: this.$store.state.app.title || '影视视频',
				tabsActiveStyle: {
				backgroundImage:`${getApp().globalData.isBgColor}`,
				// backgroundClip:'text',
				'-webkitBackgroundClip':'text',
				color:'transparent',
				WebkitTextFillColor: 'transparent',
				fontSize: '32rpx',
				fontWeight: 'bold',
					
					// color: '#EE7F33',
					
					fontSize: '32rpx',
					fontWeight: 'bold',
				},
				tabsInactiveStyle: {
					color: '#666666'
				},
				contentList: [
					{ id: 0, name: '精选短剧', list: [], page: 1, pagesize: 10, status: 'loadmore' },
				],
				contentCurrent: 0,
				refreshStatus: true,
				isRefresh: false,
				tabsList: [
					{ id: 1, name: '推荐', type: 'recommend' },
					{ id: 2, name: '最新', type: 'new' },
					{ id: 3, name: '热门', type: 'hot' },
					{ id: 4, name: '好评', type: 'score' },
					{ id: 5, name: '免费', type: 'free' },
				],
				tabsActive: { id: 1, name: '推荐', type: 'recommend' },
				isTabsFixed: false,
				//tab更新
				tabChange:false,
				
			}
		},
		computed: {
			...mapGetters("user", ["token", "userInfo"]),
			...mapGetters("app", ["title"]),
		},
		watch: {
			title(newValue, oldValue) {
				this.navbarTitle = newValue
			}
		},
		async onShow() {
		
			 await this.$onLaunched
			this.tabChange = true
			this.isBgColor  = getApp().globalData.isBgColor
			this.tabsActiveStyle.backgroundImage = getApp().globalData.isBgColor
			this.isStatue = getApp().globalData.status
		},
		onHide(){
			this.tabChange = false
		},
		async onLoad() {
			await this.$onLaunched
			this.getVideoClassify()
		},
		methods: {
			// 	收藏
			handleCollect(id, collect, index) {
				if(collect == 0) {
					const obj = { vid: id, type: 'favorite' }
					this.$request('video.addRecord', obj, false).then(res => {
						if(res.code === 1) {
							this.contentList[this.contentCurrent].list[index].is_favorite = 1
						}
					})
				} else {
					const obj = { ids: id, type: 'favorite' }
					this.$request('video.deleteRecord', obj, false).then(res => {
						if(res.code === 1) {
							this.contentList[this.contentCurrent].list[index].is_favorite = 0
						}
					})
				}
			},
			// 获取视频分类
			getVideoClassify() {
				this.$request('video.classify').then(res => {
					if(res.code === 1) {
						if(res.data && res.data.length) {
							const data = res.data.filter(item => item.type == 'video')[0].children
							const arr = data.map(({ id, name }) => ({ id, name, list: [], page: 1, pagesize: 10, status: 'loadmore' }))
							this.contentList = this.contentList.concat(arr)
							this.getVideoList()
						}
					}
				})
			},
			// 获取视频列表
			getVideoList() {
				let  status = uni.getSystemInfoSync().uniPlatform
				const obj = {
					category_id: this.contentCurrent == 0 ? '' : this.contentList[this.contentCurrent].id,
					type: this.contentCurrent == 0 ? this.tabsActive.type : '',
					page: this.contentList[this.contentCurrent].page,
					pagesize: this.contentList[this.contentCurrent].pagesize,
					platform: status == 'mp-weixin'? 2 :1,
					

					
				}
				this.contentList[this.contentCurrent].status = 'loading'
				this.$request('video.list', obj).then(res => {
					if(res.code === 1) {
						if(res.data && res.data.length) {
							this.contentList[this.contentCurrent].list = this.contentList[this.contentCurrent].list.concat(res.data)
							this.contentList[this.contentCurrent].status = 'loadmore'
							if(res.data.length < this.contentList[this.contentCurrent].pagesize) {
								this.contentList[this.contentCurrent].status = 'nomore'
							} else {
								this.contentList[this.contentCurrent].status = 'loadmore'
							}
						} else {
							this.contentList[this.contentCurrent].page > 1 && this.contentList[this.contentCurrent].page--
							const timer = setTimeout(() => {
								this.contentList[this.contentCurrent].status = 'nomore'
								clearTimeout(timer)
							}, 500)
						}
					}
					this.refreshStatus = false
					this.isRefresh = false
				}).catch(err => {
					this.refreshStatus = false
					this.isRefresh = false
				})
			},
			// 下拉刷新
			refreshHandle() {
				this.refreshStatus = true
				if(!this.isRefresh) {
					this.isRefresh = true
					this.contentList[this.contentCurrent].page = 1
					this.contentList[this.contentCurrent].list = []
					this.getVideoList()
				}
			},
			// 滚动监听
			scrollHandle(e) {
				if(this.contentCurrent == 0) {
					this.isTabsFixed = e.detail.scrollTop > 200 ? true : false
				}
			},
			// 触底滚动
			bottomHandle() {
				this.contentList[this.contentCurrent].page++
				this.getVideoList()
			},
			// 切换分类
			changeContent(e, i) {
				let current = i === 1 ? e.index : e.detail.current
				if(current == this.contentCurrent) return
				this.contentCurrent = current
				!this.contentList[this.contentCurrent].list.length && this.getVideoList()
			},
			// 切换tabs
			changeTabs(item) {
				if(item.id == this.tabsActive.id) return
				console.log('ddd')
				this.tabsActive = item
				this.contentList[0].page = 1
				this.contentList[0].list = []
				this.getVideoList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.page_content {
		overflow: hidden;
		
		.tabs {
			padding-bottom: 30rpx;
			display: flex;
			align-items: center;
			
			&.top {
				height: 0;
				padding: 0 40rpx;
				overflow: hidden;
				transition: all 0.2s linear;
				
				&.show {
					height: 94rpx;
					padding: 20rpx 40rpx;
				}
			}
			
			.item {
				color: #666666;
				padding: 6rpx 26rpx;
				border-radius: 50rpx;
				font-size: 24rpx;
				font-weight: 700;
				
				&.active {
					color: #fff;
					
				}
			}
		}
		
		.head_content {
			.tabs_box {
				padding: 0 20rpx 10rpx;
				margin-right: 80rpx;
				position: relative;
				
				.search {
					position: absolute;
					top: 50%;
					right: 0;
					transform: translate(100%, -55%);
				}
			}
		}
		
		.main_content {
			overflow: hidden;
			
			.content_box {
				padding: 20rpx 40rpx 20rpx 40rpx;
				
				.list {
					
					display: flex;
					flex-wrap: wrap;
					
					.sitem {
						width: 100%;
						height: 516rpx;
						border-radius: 20rpx;
						overflow: hidden;
						display: flex;
						margin-bottom: 40rpx;
						
						.left {
							width: 52%;
							
							.image {
								width: 100%;
								height: 100%;
							}
						}
						
						.right {
							width: 48%;
							background: linear-gradient(0deg, rgba(35, 36, 40, 1) 0%, rgba(100, 105, 124, 1) 100%);
							padding: 30rpx;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							color: #fff;
							
							.info {
								height: 100%;
								display: flex;
								flex-direction: column;
								
								.tbox {
									flex: 1;
								}
								
								.title {
									font-size: 32rpx;
									font-weight: 700;
								}
								
								.text {
									font-size: 24rpx;
									margin-top: 16rpx;
									color: #eee;
									line-height: 40rpx;
								}
								
								.text1 {
									flex: 1;
								}
							}
							
							.button {
								height: 70rpx;
								display: flex;
								align-items: center;
								justify-content: center;
								font-size: 28rpx;
								background: #484B52;
								border-radius: 10rpx;
								margin-top: 16rpx;
								
								&.collect {
									opacity: 0.6;
								}
								
								&.active {
									background: rgba(#000, 0.2);
								}
								
								.text {
									margin-left: 8rpx;
								}
							}
						}
					}
					
					.item {
						width: calc((100% - 50rpx) / 3);
						margin-bottom: 40rpx;
						margin-right: 25rpx;
						
						&.item1 {
							&:nth-child(10n),
							&:nth-child(10n-3),
							&:nth-child(10n-6) {
								margin-right: 0;
							}
						}
						
						&.item2 {
							&:nth-child(3n) {
								margin-right: 0;
							}
						}
						
						.img {
							width: 100%;
							height: 280rpx;
							border-radius: 20rpx;
							overflow: hidden;
							
							.image {
								width: 100%;
								height: 100%;
							}
						}
						
						.info {
							margin-top: 16rpx;
							
							.title {
								font-size: 28rpx;
								color: #111;
								font-weight: 700;
							}
							
							.text {
								font-size: 24rpx;
								color: #666;
								margin-top: 4rpx;
							}
						}
					}
				}
				
				.nodata {
					padding: 15vh 0;
				}
			}
		}
	}
</style>