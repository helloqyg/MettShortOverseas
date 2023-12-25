<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:16:04
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-08-16 09:16:18
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="ChatSharePoster">
		<view class="ChatSharePoster" v-if="show" @click="$emit('close')">
			<view class="poster_box">
				<view class="poster" id="pagePoster" :style="{ background: posterBgColor }">
					<img class="bgimg" v-if="posterBgImage" :src="posterBgImage" mode="widthFix" @load="loadImg('posterBgImage')" @error="loadImg('posterBgImage')"></img>
					<view class="text_box">
						<view class="title">{{ textData.message || '无标题' }}</view>
						<view class="content">{{ textData.response }}</view>
					</view>
					<view class="user_box">
						<view class="infos">
							<view class="avatar">
								<img class="img" :src="userInfo.avatar" mode="aspectFill"></img>
							</view>
							<view class="nickname">
								<view class="text1">{{ userInfo.nickname }}</view>
								<view class="">邀请您前来体验</view>
							</view>
						</view>
						<view class="qrcode">
							<img class="img" :src="posterQrcode" mode="aspectFill" @load="loadImg('posterQrcode')"></img>
						</view>
					</view>
				</view>
				<view class="poster_img">
					<image class="img" :src="posterImg" mode="aspectFit" show-menu-by-longpress></image>
				</view>
			</view>
			<view class="tips">长按保存图片到相册</view>
		</view>
		<!-- #ifdef H5 -->
		<tki-qrcode v-if="isCreate && !posterQrcode" ref="inviteQrcode" cid="invite-qrcode" :val="qrcodeValue" :size="260" :show="false" :loadMake="true" :showLoading="false" @result="qrcodeResult" />
		<!-- #endif -->
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import { pathToBase64, base64ToPath } from 'image-tools'
	import html2canvas from 'html2canvas'
	import tkiQrcode from "@/components/tki-qrcode/tki-qrcode.vue"
	import { mapState, mapGetters, mapMutations, mapActions } from "vuex"
	export default {
		name: 'ChatSharePoster',
		components: {
			tkiQrcode
		},
		props: {
			show: {
				type: Boolean,
				default: false
			},
			data: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				posterBgImage: this.$store.state.app.config?.share?.msg_title_bg || '', // 海报背景图片
				posterBgColor: this.$store.state.app.config?.share?.msg_title_bg_color || '', // 海报背景颜色
				UID: this.$store.state.user.userInfo.id || 0, // uid
				qrcodeValue: '', // 二维码参数
				posterQrcode: '', // 二维码图片
				imageLoadFinish: [], // 预加载, 已加载图片数组
				textData: {} , // 绘制信息
				posterImg: '', // 海报图片
				isCreate: false, // 是否开始生成
			}
		},
		computed: {
			...mapGetters('user', ["userInfo"]),
			...mapGetters('app', ["config"]),
		},
		watch: {
			data: {
				deep: true,
				handler: function(newValue, oldValue) {
					if(!newValue?.id) {
						this.$emit('close')
						return
					}
					if(newValue?.response != oldValue?.response) {
						this.textData = newValue
						this.isCreate = true
						this.posterImg = ''

						// this.$refs.uToast.show({
						// 	type: 'loading',
						// 	message: '正在生成图片',
						// 	duration: 2000000
						// })
						
						uni.showLoading({
							title: '加载中',
							mask: true
						})
						console.log("加载中");
						this.shareLink()
					}
				}
			},
			config: {
				deep: true,
				handler: function(newValue, oldValue) {
					this.posterBgColor = newValue.share?.msg_title_bg_color || ''
					this.posterBgImage = newValue.share?.msg_title_bg || ''
				}
			}
		},
		methods: {
			// 分享链接
			shareLink() {
				// #ifdef H5
				if(this.UID) {
					let spm = ''
					if(this.$utils.platforms() == 'H5') {
						spm = this.UID + '.1.0.1.2'
					} else if(this.$utils.platforms() == 'wxOfficialAccount') {
						spm = this.UID + '.1.0.2.2'
					}
					this.qrcodeValue = window.location.origin + window.location.pathname + `?${this.$SIGN}#/pages/home/index?scene=${spm}`
				}
				// #endif
			},
			// 图片加载完成
			loadImg(id) {
				if(!this.isCreate) return
				uni.showLoading({
					title: '图片加载中',
					mask: true
				})
				console.log("图片加载中");
				this.imageLoadFinish.push(id)
				const count = this.posterBgImage ? 2 : 1
				if(this.imageLoadFinish.length === count) {
					this.imageLoadFinish = []
					this.createPosterImage()
				}
			},
			// 获取H5二维码
			qrcodeResult(img) {
				this.posterQrcode = img
				uni.showLoading({
					title: '正在生成中',
					mask: true
				})
				console.log("正在生成中");
			},
			// 获取生成的base64图片路径
			receiveRenderData(val) {
				const url = val.replace(/[\r\n]/g, ''); // 去除base64位中的空格
				this.posterImg = url
			},
			// 生成海报图片
			createPosterImage() {
				uni.showLoading({
					title: '正在生成图片',
					mask: true
				})
				console.log("正在生成图片");
				const dom = document.getElementById('pagePoster') // 需要生成图片内容的 dom 节点
				html2canvas(dom, {
					width: dom.clientWidth, //dom 原始宽度
					height: dom.clientHeight,
					backgroundColor: "transparent",
					scrollY: 0, // html2canvas默认绘制视图内的页面，需要把scrollY，scrollX设置为0
					scrollX: 0,
					useCORS: true, //支持跨域
					scale: 3, // 设置生成图片的像素比例，默认是1，如果生成的图片模糊的话可以开启该配置项
				}).then(canvas => {
					this.isCreate = false
					this.receiveRenderData(canvas.toDataURL('image/png'))
					// this.$refs.uToast.hide()
					uni.hideLoading()
				}).catch(err => {
					this.isCreate = false
					uni.showModal({
						title: '提示',
						content: `【生成图片失败，请重试】${err}`
					});
					// this.$refs.uToast.hide()
					uni.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.ChatSharePoster {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 100;
		background: rgba(#000, 0.7);
		padding: 60rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		
		.poster_box {
			height: 90%;
			overflow: hidden;
			position: relative;
			
			display: flex;
			flex-direction: column;
			justify-content: center;
			
			.poster {
				position: relative;
				padding: 40rpx;
				background: #6A62D1;
				border-radius: 20rpx;
				
				position: fixed;
				top: -99999rpx;
				left: 0;
				
				.bgimg {
					width: 100%;
					height: auto;
				}
				
				.text_box {
					margin-top: 30rpx;
					background: #fff;
					border-radius: 20rpx;
					padding: 40rpx;
					
					.title {
						font-size: 32rpx;
						font-weight: 700;
						margin-bottom: 20rpx;
					}
					
					.content {
						font-size: 28rpx;
						white-space: pre-line;
						word-break: break-all;
						word-wrap: break-word;
						
						// display: -webkit-box;
						// -webkit-box-orient: vertical;
						// overflow: hidden;
						// text-overflow: ellipsis;
						// -webkit-line-clamp: 20;
					}
				}
				
				.user_box {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 40rpx;
					
					.infos {
						flex: 1;
						margin-right: 20rpx;
						display: flex;
						align-items: center;
						
						.avatar {
							width: 120rpx;
							height: 120rpx;
							border-radius: 50%;
							overflow: hidden;
							background: #fff;
							padding: 4rpx;
							
							.img {
								width: 100%;
								height: 100%;
								border-radius: 50%;
							}
						}
						
						.nickname {
							flex: 1;
							font-size: 28rpx;
							margin-left: 20rpx;
							color: #fff;
							
							.text1 {
								font-weight: 700;
								margin-bottom: 8rpx;
							}
						}
					}
					
					.qrcode {
						width: 150rpx;
						height: 150rpx;
						padding: 10rpx;
						background: #fff;
						border-radius: 8rpx;
						
						.img {
							width: 100%;
							height: 100%;
						}
					}
				}
			}
			
			.poster_img {
				width: 100%;
				height: 100%;
				
				position: absolute;
				top: 0;
				left: 0;
				z-index: 1;
				
				display: flex;
				align-items: center;
				justify-content: center;
				
				// display: none;
			
				.img {
					width: 100%;
					height: 100%;
				}
			}
		}
		
		.tips {
			margin-top: 40rpx;
			width: 100%;
			text-align: center;
			color: #fff;
			font-size: 28rpx;
			font-weight: bold;
		}
	}
</style>