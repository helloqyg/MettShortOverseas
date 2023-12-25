<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:18:51
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-08-16 09:18:52
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="page_content">
		<view class="head_content">
			<CustomNavbar :title="navbarTitle"></CustomNavbar>
		</view>
		<view class="main_content">
			<u-parse :content="info.content"></u-parse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				options: '',
				info: ''
			}
		},
		onLoad(options) {
			if(options && options.d) {
				this.options = JSON.parse(decodeURIComponent(options.d))
				this.navbarTitle = this.options.title
				this.getRichText()
			}
		},
		methods: {
			getRichText() {
				this.$request('common.richtext', {
					id: this.options.id
				}).then(res => {
					if(res.code === 1) {
						this.info = res.data
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main_content {
		overflow-y: auto;
		padding: 40rpx;
	}
</style>
