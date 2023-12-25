<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:17:02
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-08-18 15:02:49
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_container">
		<u-modal
			:show="show"
			:showCancelButton="showCancelButton"
			:showConfirmButton="showConfirmButton"
			:asyncClose="true"
			confirmText="立即升级"
			title="发现新版本"
			@cancel="cancel"
			@confirm="confirm">
			<view class="update_content">
				<rich-text :nodes="info.content"></rich-text>
				<view class="bar" v-if="!showConfirmButton">
					<u-line-progress :percentage="info.percent" :showText="false" activeColor="#ff9900"></u-line-progress>
					<view class="tip">正在下载，请稍后...</view>
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import { mapMutations, mapActions, mapState, mapGetters } from 'vuex';
	export default {
		data() {
			return {
				show: true,
				showCancelButton: false,
				showConfirmButton: true,
				info: {
					content: '',
					url: '',
					percent: 0
				},
			}
		},
		computed: {
			...mapGetters('app', ['updateInfo']),
		},
		onBackPress() {
			return true
		},
		onLoad() {
			this.showCancelButton = this.updateInfo.enforce === 1 ? false : true
			this.info.url = this.updateInfo.downloadurl
			this.info.content = this.updateInfo.content
		},
		methods: {
			cancel() {
				uni.switchTab({
					url: '/pages/home/index'
				})
			},
			confirm() {
				this.showCancelButton = false
				this.showConfirmButton = false
				// 开始下载, 创建下载任务
				const dtask = plus.downloader.createDownload(this.info.url, {
					filename: '_downloads/update/' + new Date().getTime() + '/'
				}, (download, status) => {
					// 下载完成
					if (status == 200) {
						plus.runtime.install(download.filename, { force: false }, () => {
							plus.runtime.restart();
						}, e => {
							uni.showToast({
								title: '安装升级包失败:' + JSON.stringify(e),
								icon: 'none'
							})
						})
					} else {
						uni.showToast({
							title: '下载升级包失败，请手动去站点下载安装，错误码: ' + status,
							icon: 'none'
						})
					}
				});
				// 监听 进度
				dtask.addEventListener("statechanged", e => {
					if (e && e.downloadedSize > 0) {
						const jindu = ((e.downloadedSize / e.totalSize) * 100).toFixed(2)
						this.info.percent = Number(jindu)
					}
				}, false);
				dtask.start();
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: transparent;
	}
</style>
<style lang="scss" scoped>
	.page_container {
		
		.update_content {
			font-size: 28rpx;
			color: #666;
			line-height: 46rpx;
			padding: 40rpx;
			
			.bar {
				padding: 40rpx 40rpx;
				
				.tip {
					text-align: center;
					font-size: 28rpx;
					margin-top: 20rpx;
				}
			}
		}
	}
</style>