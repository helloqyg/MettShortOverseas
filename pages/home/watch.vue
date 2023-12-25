<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:17:56
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-08-19 14:56:20
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar :left="0" title="追剧"></CustomNavbar>
			<view class="tabs_box">
				<u-tabs :scrollable="false" :lineWidth="0" :list="contentList" :current="contentCurrent" :activeStyle="tabsActiveStyle" :inactiveStyle="tabsInactiveStyle" lineColor="#EE7F33" @change="changeContent($event, 1)" />
			</view>
		</view>
		<view class="main_content" v-if="contentList && contentList.length">
			<swiper style="height: 100%" :skip-hidden-item-layout="true" :current="contentCurrent" @change="changeContent($event, 2)">
				<swiper-item style="height: 100%;" v-for="(item, index) in contentList" :key="item.id">
					<scroll-view style="height: 100%" :scroll-y="true" :refresher-enabled="true" :refresher-threshold="100" :refresher-triggered="refreshStatus" @refresherrefresh="refreshHandle" @scrolltolower="bottomHandle" @scroll="scrollHandle">
						<view class="content_box">
							<view class="list">
								<view class="item" v-for="(lItem, lIndex) in item.list" :key="lIndex" @click="openVideoDetail(lItem.video.id, lItem.video.title, lItem.video.image, lItem.video.description)">
									<view class="img">
										<image class="image" :src="lItem.video.image" mode="aspectFill"></image>
									</view>
									<view class="info">
										<view class="title u-line-1">{{ lItem.video.title }}</view>
										<view class="text1 u-line-2">{{ lItem.video.description }}</view>
										<view class="text2">看到{{ lItem.episode.name }} / 共{{ lItem.video.episodes }}集</view>
										<view class="btns">
											<view class="button" v-if="item.id == 1" :class="{ collect: lItem.is_favorite == 1 }" hover-class="active" :hover-start-time="0" :hover-stay-time="200" @click.stop="handleCollect(lItem.vid, lItem.is_favorite, lIndex)">
												<u-icon :name="lItem.is_favorite == 1 ? 'star-fill' : 'star'" color="#eee" size="18"></u-icon>
												<text class="text">{{ lItem.is_favorite == 1 ? '已追剧' : '追剧' }}</text>
											</view>
											<view class="button" v-else hover-class="active" :hover-start-time="0" :hover-stay-time="200">
												<u-icon name="play-right-fill" color="#eee" size="18"></u-icon>
												<text class="text">立即观看</text>
											</view>
										</view>
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
		<!-- <tabBar v-if="tabChange" selectedIndex =1></tabBar> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				navbarTitle: '影视视频',
				tabsActiveStyle: {
					color: getApp().globalData.isColor,
					fontSize: '32rpx',
					fontWeight: 'bold',
				},
				tabsInactiveStyle: {
					color: '#666666'
				},
				contentList: [
					{ id: 1, name: '最近观看记录', type: 'log', list: [], page: 1, pagesize: 10, status: 'loadmore' },
					{ id: 2, name: '我的追剧记录', type: 'favorite', list: [], page: 1, pagesize: 10, status: 'loadmore' },
				],
				contentCurrent: 0,
				refreshStatus: true,
				isRefresh: false,
				//tab更新
				tabChange:false,
			}
		},
		onShow() {
			this.tabChange = true
		},
		onHide(){
			this.tabChange = false
		},
		onLoad() {
			this.getPlayRecordList()
		},
		methods: {
			// 	收藏
			handleCollect(vid, collect, index) {
				if(collect == 0) {
					const obj = {
						vid,
						type: 'favorite'
					}
					this.$request('video.addRecord', obj, false).then(res => {
						if(res.code === 1) {
							this.contentList[this.contentCurrent].list[index].is_favorite = 1
						}
					})
				} else {
					const obj = {
						ids: vid,
						type: 'favorite'
					}
					this.$request('video.deleteRecord', obj, false).then(res => {
						if(res.code === 1) {
							this.contentList[this.contentCurrent].list[index].is_favorite = 0
						}
					})
				}
			},
			// 获取播放记录
			getPlayRecordList() {
				let  status =uni.getSystemInfoSync().uniPlatform
				
				const obj = {
					type: this.contentList[this.contentCurrent].type,
					page: this.contentList[this.contentCurrent].page,
					pagesize: this.contentList[this.contentCurrent].pagesize,
					platform: status == 'mp-weixin'? 2 :1,
				}
				this.contentList[this.contentCurrent].status = 'loading'
				this.$request('video.getRecord', obj).then(res => {
					if(res.code === 1) {
						if(res.data && res.data.length) {
							this.contentList[this.contentCurrent].list = this.contentList[this.contentCurrent].list.concat(res.data)
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
					this.getPlayRecordList()
				}
			},
			// 滚动监听
			scrollHandle(e) {
				
			},
			// 触底滚动
			bottomHandle() {
				this.contentList[this.contentCurrent].page++
				this.getPlayRecordList()
			},
			// 切换分类
			changeContent(e, i) {
				const current = i === 1 ? e.index : e.detail.current
				if(current == this.contentCurrent) return
				this.contentCurrent = current
				!this.contentList[this.contentCurrent].list.length && this.getPlayRecordList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		overflow: hidden;
		
		.head_content {
			.tabs_box {
				padding: 0 100rpx;
			}
		}
		
		.main_content {
			overflow: hidden;

			.content_box {
				padding: 20rpx 40rpx 60rpx 40rpx;
				
				.list {

					.item {
						margin-bottom: 40rpx;
						display: flex;
						align-items: center;
						
						.img {
							width: 206rpx;
							height: 276rpx;
							border-radius: 20rpx;
							overflow: hidden;
							
							.image {
								width: 100%;
								height: 100%;
							}
						}
						
						.info {
							flex: 1;
							margin-left: 40rpx;
							
							.title {
								font-size: 32rpx;
								color: #000;
								font-weight: 700;
							}
							
							.text1 {
								height: 68rpx;
								font-size: 24rpx;
								color: #666;
								margin-top: 4rpx;
								line-height: 34rpx;
								margin: 10rpx 0;
							}
							
							.text2 {
								font-size: 24rpx;
								color: #111;
								line-height: 34rpx;
							}
							
							.btns {
								margin-top: 20rpx;
								display: flex;
								align-items: center;
								justify-content: space-between;
								
								.button {
									width: calc((100% - 30rpx) / 2);
									height: 60rpx;
									display: flex;
									align-items: center;
									justify-content: center;
									font-size: 28rpx;
									background: #484B52;
									border-radius: 10rpx;
									color: #fff;
									
									&.collect {
										opacity: 0.6;
									}
								
									&.active {
										background: rgba(#000, 0.9);
									}
									
									.text {
										margin-left: 8rpx;
									}
								}
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