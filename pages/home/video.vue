<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:17:48
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-09-12 14:31:41
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="main_content" :style="[{ paddingTop: barHeight + 'px' }]">
			<swiper class="swiper" circular :vertical="true" :duration="300" :current="current" @change="swiperChange">
				<swiper-item class="swiper_item" v-for="(item, index) in videoData" :key="index">
					<view class="videos" v-if="videoIndex == index" @click="videoClick">
						<!-- #ifdef H5 -->
						<video class="video" :id="'video' + item.id" :ref="'video' + item.id"
							:loop="false" :controls="false" :autoplay="false" :object-fit="isLandscape ? 'contain' : 'cover'"
							:enable-progress-gesture="true" :show-center-play-btn="false" :src="item.url" :poster="item.image"
							@play="isPlaying = true, isPlayError = false" @pause="isPlaying = false" @timeupdate="videoTimeUpdate"
							@ended="videoEnded" @error="videoError" @loadedmetadata="VideoLoadedmetadata">
						</video>
						<!-- #endif -->
						<!-- #ifdef MP-WEIXIN -->
						<video class="video" :id="'video' + item.id" :ref="'video' + item.id"
							:loop="false" :controls="false" :autoplay="videoIndex == index" :object-fit="isLandscape ? 'contain' : 'cover'"
							:enable-progress-gesture="true" :show-center-play-btn="false" :src="item.url"
							@play="isPlaying = true, isPlayError = false" @timeupdate="videoTimeUpdate"
							@ended="videoEnded" @error="videoError" @loadedmetadata="VideoLoadedmetadata">
						</video>
						<!-- #endif -->
						<view class="verror" v-if="isPlayError">
							<image class="image" :src="item.image" mode="aspectFill"></image>
							<view class="content">
								<u-icon name="info-circle-fill" color="#fff" size="50"></u-icon>
								<text class="text">非常抱歉，视频播放出错啦！</text>
							</view>
						</view>
					</view>
					<view class="vcover" v-else>
						<image class="image" :src="item.image" mode="aspectFill"></image>
					</view>
					<view class="buttons" v-if="!isDrag && !isPlayError && videoIndex == index">
						<u-icon v-if="!isPlaying" name="play-right-fill" color="rgba(255, 255, 255, 0.8)" :size="60" @click="videoPlay"></u-icon>
					</view>
					<view class="sidebar" v-if="!isDrag && !isPlayError && videoIndex == index">
						<view class="item" @click="handleLikes(item.id, index)">
							<image class="image" :src="`https://img.nymaite.com/video_short/icons/likes_${item.is_like ? 1 : 0 }.png`" mode="widthFix"></image>
							<text class="text" :class="{ active: item.is_like }">{{ item.likes }}</text>
						</view>
						<view class="item" @click="handleCollect(item.vid, index)">
							<image class="image" :src="`https://img.nymaite.com/video_short/icons/collect_${item.video.is_favorite ? 1 : 0 }.png`" mode="widthFix"></image>
							<text class="text" :class="{ active: item.video.is_favorite }">{{ item.video.favorites }}</text>
						</view>
						<!-- #ifdef MP-WEIXIN -->
						<view class="item">
							<button class="btn" open-type="share" >
								<image class="image" src="https://img.nymaite.com/video_short/icons/share_0.png" mode="widthFix"></image>
								<text class="text">{{ item.shares }}</text>
							</button>
						</view>
						<!-- #endif -->
					</view>
					<view class="infobox" v-if="!isDrag && videoIndex == index">
						<view class="title">{{ item.video.title }}</view>
						<view class="textarea" v-if="!isIos">
							<view class="text" :class="{ active: isUnfold }">
								<text class="btn" v-if="$utils.countCharacters(item.video.description) > 74" @click="isUnfold = !isUnfold">{{ isUnfold ? '收起' : '展开' }}</text>
								{{ item.video.description }}
							</view>
						</view>
						<view class="content">
							<u-icon name="play-right-fill" color="#fff" size="18"></u-icon>
							<text class="text1">{{ item.name }}（共{{ item.video.episodes }}集）</text>
							<text class="text2" @click="openVideoDetail(item.video.id, item.video.title, item.video.image, item.video.description)">查看更多剧集</text>
						</view>
					</view>
					<view class="progress" v-if="duration > 0 && videoIndex == index">
						<view class="bartext" v-if="isDrag">
							<text class="text1">{{ dragStarTime }}</text>
							<text class="text0">/</text>
							<text class="text2">{{ dragEndTime }}</text>
						</view>
						<view class="barview" :class="{ active: isDrag }">
							<slider :value="currentTime" :min="0" :max="duration"
								:blockSize="6" backgroundColor="#333" activeColor="#fff"
								@change="sliderChange" @changing="sliderChanging">
							</slider>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<!-- <tabBar v-if="tabChange" selectedIndex =2></tabBar> -->
		<!-- #ifdef MP-WEIXIN  -->
		<view class="ad_box" v-if="userInfo && config.uniad_switch == '1' && config.adpid">
		    <button class="button" v-if="showAd && isLoaded" @click="adCheck"></button>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		data() {
			return {
				isIos: uni.getSystemInfoSync().osName == 'ios' ? true : false,
				barHeight: uni.getSystemInfoSync().statusBarHeight,
				
				current: 0,
				currentTime: 0, // 当前视频播放进度
				
				duration: 0, // 当前视频总时长
				isDrag: false, // 拖动进度条状态
				dragStarTime: "00:00", // 拖拽开始时长
				dragEndTime: "00:00", // 拖拽结束时长
				
				isPlaying: false, // 播放状态
				isPlayError: false, // 播放错误
				
				clickNum: 0, // 点击次数
				clickTimer: null, // 点击定时器
				
				isUnfold: false, // 展示文字
				
				originData: [], // 源数据
				originIndex: 0, // 源数据索引
				oldIndex: 0, // 源数据上一次索引
				
				videoData: [], // 渲染数据
				videoIndex: 0, // 渲染数据索引
				
				isLandscape: false, // 是否横屏
				
				countdown: 0,

				videoAd: null,
				isLoaded: false,
				//tab更新
				tabChange:false,
			}
		},
		computed: {
			...mapGetters("user", ["token", "userInfo", "showAd"]),
			...mapGetters("app", ["videoAutoplay", "adCountdown", "config"]),
		},
		watch: {
			adCountdown(newValue, oldValue) {
				this.countdown = newValue
			},
			token(newValue, oldValue) {
				// #ifdef MP-WEIXIN
				newValue && (this.config?.uniad_switch == '1') && this.config?.adpid && this.adCheck()
				// #endif
			}
		},
		onLoad() {
			this.getRecommendList()
			// #ifdef MP-WEIXIN
			this.token && (this.config?.uniad_switch == '1') && this.config?.adpid && this.adCheck()
			// #endif
		},
		onShow() {
			this.tabChange = true
			uni.setTabBarStyle({
				color: '#999',
				selectedColor: '#fff',
				backgroundColor: '#000',
				borderStyle: 'black'
			})
			// #ifdef H5
			if(this.originData.length) {
				this.videoPlay()
			}
			// #endif
		},
		onHide() {
			
			this.tabChange = false
			uni.setTabBarStyle({
				color: "#999",
				selectedColor: getApp().globalData.isColor,
				backgroundColor: "#fff",
				borderStyle: "black",
			})
		},
		onShareAppMessage(res) {
			// #ifdef MP-WEIXIN
			return {
				title: this.videoData[this.videoIndex].video.title,
				path: `/pages/video/play?scene=${this.shareData.spm}&id=${this.videoData[this.videoIndex].vid}`,
				imageUrl: this.videoData[this.videoIndex].image
			}
			// #endif
		},
		methods: {
			...mapActions("user", ["checkAdTask"]),
			async adCheck() {
				console.log('进入')
				// #ifdef MP-WEIXIN
				await this.checkAdTask()
				if(this.showAd) {
					if(this.videoAd) this.adShow()
					else this.adInit()
				} else {
					this.isLoaded = false
				}
				// #endif
			},
			adInit() {
				// #ifdef MP-WEIXIN
				// 在页面onLoad回调事件中创建激励视频广告实例
				if (wx.createRewardedVideoAd) {
					this.videoAd = wx.createRewardedVideoAd({
						adUnitId: this.config.adpid
					})
					this.videoAd.onLoad(() => this.isLoaded = true)
					this.videoAd.onError(() => this.isLoaded = false)
					this.videoAd.onClose((res) => {
						if(res && res.isEnded) {
							this.$request('task.finish', { type: 'uniad_success' }).then(res => {
								res.code == 1 && (this.$u.toast("奖励已发放"), this.checkAdTask())
							})
						}
						this.videoPlay()
					})
				}
				// #endif
			},
			adShow() {
				// #ifdef MP-WEIXIN
				// 用户触发广告后，显示激励视频广告
				if (this.videoAd) {
					this.videoPause()
					this.videoAd.show().catch(() => {
						// 失败重试
						this.videoAd.load()
							.then(() =>  this.videoAd.show())
							.catch(() => this.videoPlay())
					})
				} else {
					this.adCheck()
				}
				// #endif
			},
			// 获取推荐视频
			getRecommendList() {
				let  status = uni.getSystemInfoSync().uniPlatform
				const obj = {
					
					platform: status == 'mp-weixin'? 2 :1,
					
				}
				this.$request('video.recommend',obj).then(res => {
					if(res.code === 1) {
						if(res.data && res.data.length) {
							this.originData = this.originData.concat(res.data)
							this.initSwiperData(this.originIndex, 1)
						}
					}
				})
			},
			// 初始化swiper数据
			initSwiperData(originIndex = this.originIndex, init = 0) {
				const originDataLength = this.originData.length;
				const videoList = [];
				videoList[this.videoIndex] = this.originData[originIndex];
				videoList[this.videoIndex - 1 == -1 ? 2 : this.videoIndex - 1] = this.originData[originIndex - 1 == -1 ? originDataLength - 1 : originIndex - 1];
				videoList[this.videoIndex + 1 == 3 ? 0 : this.videoIndex + 1] = this.originData[originIndex + 1 == originDataLength ? 0 : originIndex + 1];
				this.videoData = videoList;
				
				if (this.oldIndex >= this.originData.length) {
					this.oldIndex = 0
				}
				if (this.oldIndex < 0) {
					this.oldIndex = this.originData.length - 1
				}
				
				// 重置进度条状态
				this.duration = 0
				this.currentTime = 0
				this.isDrag = false
				this.isPlayError = false
				// H5自动播放
				// #ifdef H5
				if(this.$utils.platforms() === 'wxOfficialAccount' && uni.getSystemInfoSync().platform == 'ios') {
					WeixinJSBridge.invoke('getNetworkType', {}, (e) => {
						this.videoPlay()
					})
				} else {
					if(this.videoAutoplay == 1) {
						const timer = setTimeout(() => {
							this.videoPlay()
							clearTimeout(timer)
						}, 500)
					} else {
						if(init != 1) {
							const timer = setTimeout(() => {
								this.videoPlay()
								clearTimeout(timer)
							}, 500)
						}
					}
				}
				// #endif
			},
			// swiper切换
			swiperChange(event) {
				const { current } = event.detail;
				const originDataLength = this.originData.length;
				if (this.videoIndex - current == 2 || this.videoIndex - current == -1) {
					this.originIndex = this.originIndex + 1 == originDataLength ? 0 : this.originIndex + 1;
					this.videoIndex = this.videoIndex + 1 == 3 ? 0 : this.videoIndex + 1;
					this.oldIndex = this.originIndex - 1
					this.initSwiperData(this.originIndex);
					if(this.originIndex == this.originData.length - 1) {
						this.getRecommendList()
					}
				} else if (this.videoIndex - current == -2 || this.videoIndex - current == 1) {
					this.originIndex = this.originIndex - 1 == -1 ? originDataLength - 1 : this.originIndex - 1;
					this.videoIndex = this.videoIndex - 1 == -1 ? 2 : this.videoIndex - 1;
					this.oldIndex = this.originIndex + 1
					this.initSwiperData(this.originIndex);
				}
			},
			// 播放
			videoPlay() {
				const video = this.getVideoCtx()
				if(!video) return
				video.play()
				this.isPlaying = true
			},
			// 暂停
			videoPause() {
				const video = this.getVideoCtx()
				if(!video) return
				video.pause()
				this.isPlaying = false
			},
			// 播放结束
			videoEnded(e) {
				// #ifdef H5
				if(this.$utils.platforms() === 'wxOfficialAccount' && uni.getSystemInfoSync().platform == 'ios') {
					if (this.videoIndex < 2) {
						this.current = this.videoIndex + 1
					} else {
						this.current = 0
					}
				} else {
					if(this.videoAutoplay == 1) {
						if (this.videoIndex < 2) {
							this.current = this.videoIndex + 1
						} else {
							this.current = 0
						}
					}
				}
				// #endif
				
				// #ifndef H5
				if (this.videoIndex < 2) {
					this.current = this.videoIndex + 1
				} else {
					this.current = 0
				}
				// #endif
			},
			// 视频播放出错
			videoError() {
				this.isPlayError = true
			},
			// 点击
			videoClick() {
				this.clickTimer && clearTimeout(this.clickTimer)
				this.clickNum++
				this.clickTimer = setTimeout(() => {
					if(this.clickNum >= 2) {
						console.log('你双击了')
					} else {
						console.log('你单击了')
						if(this.isPlaying) {
							this.videoPause()
						} else {
							this.videoPlay()
						}
					}
					this.clickNum = 0
				}, 250)
			},
			// 元数据加载完毕
			VideoLoadedmetadata(e) {
				const { width, height } = e.detail
				this.isLandscape = width >= height ? true : false
			},
			// 拖拽结束
			sliderChange(e) {
				const video = this.getVideoCtx()
				if(!video) return
				// 停止拖拽
				this.isDrag = false
				// 判断一下是否大于基础时间
				if (this.duration > 0.1) {
					// 跳到指定时间点
					video.seek(e.detail.value)
					// 并调用播放
					video.play()
				}
			},
			// 正在拖拽
			sliderChanging(e) {
				// 开始拖拽
				this.isDrag = true
				// 刷新时间
				this.dragStarTime = this.$utils.formatTime(e.detail.value)
				// 总时间
				this.dragEndTime = this.$utils.formatTime(this.duration)
			},
			// 更新进度
			videoTimeUpdate(e) {
				if(this.isDrag) return
			    const { currentTime, duration } = e.detail
				this.currentTime = Math.trunc(currentTime)
				this.duration = Math.trunc(duration)
				// 刷新时间
				this.dragStarTime = this.$utils.formatTime(this.currentTime)
				// 总时间
				this.dragEndTime = this.$utils.formatTime(this.duration)
			},
			// 获取video标签上下文
			getVideoCtx() {
				return uni.createVideoContext('video'+ this.originData[this.originIndex].id, this)
			},
			// 点赞
			handleLikes(id, index) {
				const obj = {
					episode_id: id,
					type: 'like'
				}
				this.$request('video.likes', obj, false).then(res => {
					if(res.code === 1) {
						if(this.videoData[index].is_like == 0) {
							this.videoData[index].is_like = 1
							this.videoData[index].likes++
						} else {
							this.videoData[index].is_like = 0
							this.videoData[index].likes--
						}
					}
				})
			},
			// 收藏
			handleCollect(id, index) {
				if(this.videoData[index].video.is_favorite == 0) {
					const obj = { vid: id, type: 'favorite' }
					this.$request('video.addRecord', obj, false).then(res => {
						if(res.code === 1) {
							this.videoData[index].video.is_favorite = 1
							this.videoData[index].video.favorites++
						}
					})
				} else {
					const obj = { ids: id, type: 'favorite' }
					this.$request('video.deleteRecord', obj, false).then(res => {
						if(res.code === 1) {
							this.videoData[index].video.is_favorite = 0
							this.videoData[index].video.favorites--
						}
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page_content {
		
		.ad_box {
			position: absolute;
			bottom: 80rpx;
			right: 30rpx;
			z-index: 1;
			
			.button {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				background: transparent;
				outline: none;
				background-image: url('https://img.nymaite.com/video_short/icons/jifen.png');
				background-size: cover;
			}
		}
		
		.main_content {
			position: relative;
			background: #000;
			
			.swiper {
				width: 100%;
				height: 100%;
				background: #000;
				border-radius: 16rpx;
				overflow: hidden;
				
				.swiper_item {
					position: relative;
					color: #fff;
					
					.videos {
						width: 100%;
						height: 100%;
						position: relative;
						
						.video {
							width: 100%;
							height: 100%;
							border-radius: 16rpx;
							overflow: hidden;
						}
						
						.verror {
							width: 100%;
							height: 100%;
							background: #000;
							position: absolute;
							top: 0;
							left: 0;
							z-index: 1;
							
							.image {
								width: 100%;
								height: 100%;
								opacity: 0.3;
							}
							
							.content {
								width: 100%;
								position: absolute;
								top: 50%;
								left: 0;
								transform: translateY(-50%);
								display: flex;
								flex-direction: column;
								align-items: center;
								
								.text {
									font-size: 32rpx;
									color: #fff;
									margin-top: 40rpx;
								}
							}
						}
					}
					
					.vcover {
						width: 100%;
						height: 100%;
						
						.image {
							width: 100%;
							height: 100%;
							opacity: 0.3;
						}
					}
					
					.buttons {
						position: absolute;
						top: 50%;
						left: 50%;
						z-index: 0;
						transform: translate(-50%, -50%);
						pointer-events: auto;
					}
					
					.sidebar {
						position: absolute;
						right: 30rpx;
						bottom: 260rpx;
						z-index: 1;
						
						.item {
							margin-bottom: 40rpx;
							text-align: center;
							
							&:last-child {
								margin-bottom: 0;
							}
							
							.image {
								width: 70rpx;
								margin: 0 auto;
								opacity: 0.9;
							}
							
							.text {
								font-size: 28rpx;
								
								&.active {
									color: #EE7F33;
								}
							}
							
							.btn {
								display: block;
								background: transparent;
								color: #fff;
								box-sizing: border-box;
								font-size: 28rpx;
								line-height: 40rpx;
								
								&::after {
									display: none;
								}
							}
						}
					}
					
					.infobox {
						width: 76%;
						position: absolute;
						bottom: 60rpx;
						left: 30rpx;
						z-index: 1;
						font-size: 32rpx;
						
						.title {
							font-weight: 700;
							margin-bottom: 20rpx;
						}
						
						.textarea {
							margin-bottom: 20rpx;
							display: flex;
							flex-direction: row;
							overflow: hidden;
							font-size: 30rpx;
							min-height: 80rpx;
							
							.text {
								width: 100%;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								text-overflow: ellipsis;
								-webkit-line-clamp: 2;
								overflow: hidden;
								
								text-align: justify;
								word-break: break-all;
								position: relative;
								line-height: 40rpx;

								&.active {
									-webkit-line-clamp: 999;
								}
								
								&::before {
									content: "";
									float: right;
									width: 0;
									height: 100%;
									background: #000;
									overflow: hidden;
									margin-bottom: -40rpx;
								}
								
								// &::after {
								// 	content: "";
								// 	position: absolute;
								// 	width: 100%;
								// 	height: 100px;
								// 	background: #fff;
								// 	background: transparent;
								// }
				
								.btn {
									float: right;
									clear: both;
									background: transparent;
									border: none;
									color: #fff;
									line-height: 40rpx;
								}
							}
						}
						
						.content {
							display: flex;
							flex-direction: row;
							align-items: center;
							
							.text1 {
								margin-left: 16rpx;
							}
							
							.text2 {
								text-decoration: underline;
							}
						}
					}
					
					.progress {
						width: 100%;
						position: absolute;
						bottom: 10rpx;
						left: 0;
						z-index: 1;
						
						uni-slider {
							margin: 0 36rpx;
						}
						
						slider {
							margin: 0 36rpx;
						}
						
						.bartext {
							display: flex;
							flex-direction: row;
							justify-content: center;
							font-size: 40rpx;
							margin-bottom: 60rpx;
							font-weight: 700;
							
							.text1 {
								
							}
							
							.text0 {
								padding: 0 8rpx;
							}
							
							.text2 {
								color: rgba(#fff, 0.5);
							}
						}
						
						.barview {
							@mixin whlt($w, $h, $l, $t) {
								width: $w !important;
								height: $h !important;
								margin-left: $l !important;
								margin-top: $t !important;
							}
							
							::v-deep .uni-slider-handle-wrapper .uni-slider-handle,
							::v-deep .wx-slider-handle-wrapper .wx-slider-handle {
								@include whlt(64rpx, 64rpx, -32rpx, -32rpx);
							}
							
							::v-deep .uni-slider-handle-wrapper,
							::v-deep .wx-slider-handle-wrapper {
								height: 4rpx;
								transition: all 0.3s;
							}
							
							::v-deep .uni-slider-handle-wrapper .uni-slider-thumb,
							::v-deep .wx-slider-handle-wrapper .wx-slider-thumb {
								@include whlt(12rpx, 12rpx, -6rpx, -6rpx);
							}
							
							&.active {
								::v-deep .uni-slider-handle-wrapper,
								::v-deep .wx-slider-handle-wrapper {
									height: 24rpx;
									transition: all 0.3s;
								}
								
								::v-deep .uni-slider-handle-wrapper .uni-slider-thumb,
								::v-deep .wx-slider-handle-wrapper .wx-slider-thumb {
									@include whlt(32rpx, 32rpx, -16rpx, -16rpx);
								}
							}
						}
					}
				}
			}
		}
	}
</style>