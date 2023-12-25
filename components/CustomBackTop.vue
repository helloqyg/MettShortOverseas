<!--
 * @Description:
 * @Author: FangYaoTang
 * @Date: 2023-08-16 09:16:28
 * @LastEditor: FangYaoTang
 * @LastEditTime: 2023-08-16 09:16:28
 * @Copyright: by 南阳迈特网络科技有限公司 禁止任何形式（包含二次开发）转售系统源码，违者必究。
-->


<template>
	<view class="CustomBackTop">
		<u-back-top :scroll-top="scrollTop" :duration="500" :customStyle="backTopStyle" :iconStyle="backTopIconStyle"></u-back-top>
	</view>
</template>

<script>
	export default {
		name: "CustomBackTop",
		props: {
			scrollTop: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				backTopStyle: {
					background: 'rgba(0, 0, 0, 0.5)'
				},
				backTopIconStyle: {
					fontSize: '32rpx',
					color: '#fff'
				},
			};
		}
	}
</script>

<style>

</style>