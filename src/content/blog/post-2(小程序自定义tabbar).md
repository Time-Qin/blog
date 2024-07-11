---
title: '小程序自定义Tabbar组件实现及注意事项'
description: '本文介绍了小程序自定义tabbar组件的实现及注意事项'
pubDate: '2024-7-11'
heroImage: 'https://picsum.photos/id/2/510/255.webp'
author: 'Ekko'
tags: ["wxml", "ts",'miniprogram','scss']
---

> 本文所介绍的是微信小程序自定义tabbar组件

### 背景

根据产品所说，用户反馈我们自己的小程序tabbar不够明显，产品希望可以更改tabbar的背景颜色。

懂得都懂，本着多一事不如少一事的原则，肯定是要和产品`battle`一下，最终各退一步，决定先加icon，再看看用户的反馈。

虽然需求可以推掉，但是咱们开发的原则不能变---可以不做，但不能不会。

### 准备工作

先看看微信小程序官方对自定义tabbar的介绍

> [基础能力 / 自定义 tabBar (qq.com)](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/custom-tabbar.html)

##### 总结一下流程：<br/>
1. 配置信息
2. 添加 tabBar 代码文件
3. 编写 tabBar 代码

<br/>

### 配置信息

在小程序项目下 `app.json` 文件中的 `tabBar` 项指定 `custom` 字段，保留`usingComponents`项。

```json
{
  "tabBar": {
        "custom": true,
        "color": "#333",
        "selectedColor": "#DF2D45",
        "borderStyle": "black",
        "backgroundColor": "#ffffff",
        "list": [
          {
            "iconPath": "...",
            "selectedIconPath": "...",
            "pagePath": "pages/index/index",
            "text": "首页"
          },
          {
            "iconPath": "...",
            "selectedIconPath": "...",
            "pagePath": "pages/user/user",
            "text": "我的"
          }
        ]
  },
  "usingComponents": {}
}
```
<br/>

### 添加 tabBar 代码文件

在项目根目录下新增文件夹custom-tab-bar(该文件夹需要与components文件夹在同一层级),右键新建component（在微信开发者工具中操作）

```text
 custom-tab-bar/index.ts
 custom-tab-bar/index.json
 custom-tab-bar/index.wxml
 custom-tab-bar/index.scss
```
<br/>

如此 自定义tabbar便可替代原生tabbar

### 编写 tabBar 代码

那就让我们开始吧 <br/>
ts代码:
```js
//index.ts
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },
  /**
   * 组件的初始数据
   */
  data: {
    selected: 0,
    color: "#444",
    selectedColor: "#DF2D45",
    list: [
      {
        "iconPath": "...",
        "selectedIconPath": "...",
        "pagePath": "pages/index/index",
        "text": "首页"
      },
      {
        "iconPath": "...",
        "selectedIconPath": "...",
        "pagePath": "pages/user/user",
        "text": "我的"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e: WechatMiniprogram.TouchEvent) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({
        url
      })
    },
  },
})
```
<br/>
wxml代码:

```html
//index.wxml
<view class="tab-bar">
  <view class="tab-bar-border"></view>
  <view wx:for="{{list}}" wx:key="index" class="tab-bar-item" data-path="{{item.pagePath}}" data-index="{{index}}" bindtap="switchTab">
      <image class="tab-bar-item-image" src="{{selected === index ? item.selectedIconPath : item.iconPath}}"></image>
      <view class="tab-bar-item-view" style="color: {{selected === index ? selectedColor : color}}">
        {{item.text}}
      </view>
  </view>
</view>
```
<br/>
scss代码:

```scss
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 96rpx;
  background: white;
  display: flex;
  padding-bottom: env(safe-area-inset-bottom);
}

.tab-bar-border {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(240, 240, 240, 0.3) 98%);
  position: absolute;
  left: 0;
  top: -24rpx;
  width: 100%;
  height: 24rpx;
  transform: scaleY(0.5);
}

.tab-bar-item {
  flex: 1;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.tab-bar-item-image {
  width: 36rpx;
  height: 40rpx;
}

.tab-bar-item-view {
  font-size: 28rpx;
  font-weight: normal;
}
```
<br/>

### 使用tabbar

根据微信官方文档描述，每个 tab 页面 tabBar 的实例是不同的：

> 每个 tab 页下的自定义 tabBar 组件实例是不同的，可通过自定义组件下的 getTabBar 接口，获取当前页面的自定义 tabBar 组件实例。

显而易见，每当切换 tab 页时，我们都需要更新 tabBar 的选中态。关于选中态的实现，官方文档描述如下：

> 注意：如需实现 tab 选中态，要在当前页面下，通过 getTabBar 接口获取组件实例，并调用 setData 更新选中态。

> 注：这里的给出的代码和官方给出的实例代码略有不同，区别在于，实例代码中所用的是Component组件生命周期，而我们常用的是page生命周期函数。

```js
//pages/index/index.ts
//pages/user/user
Page({
      onShow() {
            this.setTabBerData()
      },
      setTabBerData() {			//当然这个方法可以抽出去 调用的时候把this和selected传入即可
        if (typeof this.getTabBar === 'function' && this.getTabBar()) {
          this.getTabBar().setData({
            selected: 0,		//pages/user/user 这里的值要改为 1
          })
        }
      }
})
```

<br/>

### tips

- 自定义tabbar是有层级的，当页面弹窗层级超过`z-index:99999`时便可以覆盖在tabbar层级之上。<br/>
- 关于自定义tabbar切换时闪烁问题，其实它只存在于启动小程序后第一次切换未加载的tabbar页面时会出现，也就是说它其实是tabbar组件在页面加载时创建当前页面tabbar实例产生的

### 注意事项

- 自定义样式需要符合设计规范: 在自定义tabbar切换时使用强制登录逻辑且不等了就不能切换，导致小程序被官方警告责令整改。
- 处理页面切换的逻辑：在自定义tabbar中，需要处理页面切换的逻辑，必须使用 wx.switchTab() 方法实现页面切换（wx.redirectTo() 方法会新开一个页面）
- 兼容性问题：自定义tabbar可能会存在兼容性问题，需要在不同的设备和平台上进行测试，确保兼容性。