# zero-privacy

> 仅测试于 vue2, vue3, 微信小程序. 其他平台可自行测试

## 一. 介绍

1. 支持 居中弹出,底部弹出
2. 不依赖第三方弹窗组件,内置轻量动画效果
3. 支持自定义触发条件
4. 支持自定义主题色
5. 弹窗时可使用配置参数隐藏tabar,避免弹窗出现时可以跳转页面,关闭弹窗自动展示tabbar
6. 自动获取隐私协议名称
7. 底部弹出时自动适配安全距离

## 二. 为什么需要隐私协议

####为规范开发者的用户个人信息处理行为，保障用户的合法权益，自2023年9月15日起，对于涉及处理用户个人信息的小程序开发者，微信要求，仅当开发者主动向平台同步用户已阅读并同意了小程序的隐私保护指引等信息处理规则后，方可调用微信提供的隐私接口。

## 三. 使用方法

###  `使用前请确保配置等相关操作都做好了,划重点!划重点!划重点!`必看

### 配置详细教程: [如何配置才能触发小程序隐私协议弹窗](https://juejin.cn/post/7273803674790150183)


`组件内已处理相关逻辑,开发者仅需要在小程序后台填写所用户隐私保护指引,导入 `uni_modules` 后直接使用即可`

1.  **打开页面直接触发 (在小程序首页等tabbar页面直接处理隐私弹窗逻辑)**

```html
<template>
<!-- 有tabbar的页面 -->
	<view class="container">
		<zero-privacy :onNeed='false' :hideTabBar='true'></zero-privacy>
	</view>
</template>

<!-- 没有tabbar的页面 -->
<template>
	<view class="container">
		<zero-privacy :onNeed='false'></zero-privacy>
	</view>
</template>

```  

2.  **按需触发 (在页面点击某些需要用到隐私协议后处理隐私弹窗逻辑)**
```html
<template>
	<view class="container">
		<view class="btn" @click="handleCopy">
			复制
		</view>
		<zero-privacy></zero-privacy>
	</view>
</template>
```  


3.  **自定义内容使用**

```html
<template>
	<view class="container">
		<zero-privacy title="测试自定义标题" predesc="协议前内容" privacy-contract-name-custom="<自定义名称及括号>" subdesc="协议后内容协议后内容协议后内容.&#10;主动换行"></zero-privacy>
	</view>
</template>
```    


## 四. 参数说明

| 参数						| 类型		| 默认值																									| 描述																						|
| --------					| -------	| ------																									| ------------																				|
| position					| String	| center																									| 可选 `bottom`,从底部弹出																	|
| color						| String	| #0396FF																									| 主颜色: 协议名和同意按钮的背景色															|
| bgcolor					| String	| #ffffff																									| 弹窗背景色																				|
| onNeed					| Boolean	| true																										| 使用到隐私相关api时触发弹窗,设置为false时初始化弹窗将判断是否需要隐私授权,需要则直接弹出	|
| hideTabBar				| Boolean	| false																										| 是否需要隐藏tabbar,在首页等tabbar页面使用该弹窗时建议改为true								|
| title						| String	| #ffffff																									| 用户隐私保护提示																			|
| predesc					| String	|  使用前请仔细阅读																							|协议名称**前**的内容																		|
| subdesc					| String	| 当您点击同意后，即表示您已理解并同意该条款内容，该条款将对您产生法律约束力。如您拒绝，将无法使用该服务。	|协议名称**后**的内容																		|
|privacyContractNameCustom	|String		|''																											|自定义协议名称,不传则由小程序自动获取														|
|agreeBtnText				|String		|同意																										|同意按钮文案																				|
|disagreeBtnText			|String		|拒绝																										|拒绝按钮文案																				|

#### `predesc` 和 `subdesc` 的自定义内容,需要主动换行时在内容中添加实体字符 `&#10;` 即可

**event**

|参数		|描述									|
|---		|---									|
|agree		|同意协议								|
|disagree	| 点击拒绝,可以自行处理退出小程序等操作	|


## 五. 实战踩坑(作者仅测试少量api,大家可以在评论区分享自己用到的隐私api坑,这边会统一整理)

1. 获取微信昵称 `nickname` 的输入框无法按需触发隐私授权弹窗,请在登录注册等获取用户名页面使用直接触发方式调用
2. 获取定位等功能, 一般在页面加载就发起请求,此时隐私弹窗的授权判断可能还没获取到,所以请注意隐私api的触发时机


插件预览:
![code](https://img.zerojs.cn/mweb/we_code.jpg)

> 小程序搜索: zerojs零技术

> 预览的小程序不一定能及时更新当前插件
