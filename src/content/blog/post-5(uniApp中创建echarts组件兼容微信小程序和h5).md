---
title: "在uniApp中支持h5和微信小程序的echarts组件"
description: "本文是记录在uniApp中使用echarts时为解决组件兼容问题而编写的扩展组件"
pubDate: "2024-8-01"
heroImage: "/banner-img/1755164053.png"
author: "Ekko"
tags: ["web", "js", "miniprogram", "vue", "echarts"]
---

## 简介

本文是记录在`uniApp`中使用`echarts`时为解决组件兼容问题而编写的扩展组件

## 背景

最近产品提了一个需要使用`echarts`画图且小程序和 h5 都要实现；对于`echarts`我并不陌生，但是在小程序中用`echarts`还是第一次。看了许多文档，都不太满意，于是想着自己写一个本地组件试试。

## 主要内容

先区分小程序组件和 H5 组件，将两个组件的逻辑区分开，确保不同编译模式下编译的组件代码是我需要的。

### H5

第一步先安装`echarts`

```js
pnpm i  echarts
```

<br/>

第二步创建组件`custom-echarts`

```vue
<script setup lang="ts">
import * as echarts from "echarts";
import { ref, nextTick, onMounted } from "vue";

const props = withDefaults(
  defineProps<{
    type: "2d";
    option: any;
  }>(),
  {}
);

const echart = ref<any>(null);
const echartInit = () => {
  /* 基于准备好的dom，初始化echarts实例*/
  const myChart = echarts.init(echart.value, "", { renderer: "svg" });
  myChart.setOption(props?.option as any);
};
onMounted(() => {
  if (props.option) {
    //等待dom更新之后执行
    nextTick(() => {
      // #ifdef WEB
      echartInit();
      // #endif
    });
  }
});
</script>

<template>
  <!-- #ifdef WEB -->
  <div ref="echart" class="w-[100%] h-[200rpx] mt-[20rpx]"></div>
  <!-- #endif -->
</template>

<style scoped lang="scss">
.costom-canvas {
  width: 100%;
  height: 310rpx;
  padding: 20rpx 0;
}
</style>
```

<br/>

### **微信小程序**

去 [lime-echart ](https://gitee.com/liangei/lime-echart/tree/master/components/l-echart)找到`canvas.js`、`l-echart.vue`和`utils.js`文件

创建 lime-chart 组件，再引用

```vue
<script setup lang="ts">
import * as echarts from "echarts";
import { ref, nextTick, onMounted } from "vue";
import LEchart from "../l-echart/index.vue";

const props = withDefaults(
  defineProps<{
    type: "2d";
    option: any;
  }>(),
  {}
);

const echart = ref<any>(null);

const wxEchartInit = () => {
  if (echart.value && echart.value.init) {
    echart.value.init(echarts, (chart: any) => {
      chart.setOption(props.option);
    });
  }
};
onMounted(() => {
  if (props.option) {
    nextTick(() => {
      // #ifdef MP-WEIXIN
      wxEchartInit();
      // #endif
    });
  }
});
</script>

<template>
  <!-- #ifdef MP-WEIXIN -->
  <LEchart
    class="costom-canvas"
    style="z-index: 1"
    ref="echart"
    v-if="option"
  ></LEchart>
  <!-- #endif -->
</template>

<style scoped lang="scss">
.costom-canvas {
  width: 100%;
  height: 310rpx;
  padding: 20rpx 0;
}
</style>
```

再将内容部分合并即可

```vue
//custom-echarts.vue
<script setup lang="ts">
import * as echarts from "echarts";
import { ref, nextTick, onMounted } from "vue";
import LEchart from "../l-echart/index.vue";

const props = withDefaults(
  defineProps<{
    type: "2d";
    option: any;
  }>(),
  {}
);

const echart = ref<any>(null);
const echartInit = () => {
  /* 基于准备好的dom，初始化echarts实例*/
  const myChart = echarts.init(echart.value, "", { renderer: "svg" });
  myChart.setOption(props?.option as any);
};

const wxEchartInit = () => {
  if (echart.value && echart.value.init) {
    echart.value.init(echarts, (chart: any) => {
      chart.setOption(props.option);
    });
  }
};
onMounted(() => {
  if (props.option) {
    nextTick(() => {
      // #ifdef MP-WEIXIN
      wxEchartInit();
      // #endif
      // #ifdef WEB
      echartInit();
      // #endif
    });
  }
});
</script>

<template>
  <!-- #ifdef WEB -->
  <div ref="echart" class="w-[100%] h-[200rpx] mt-[20rpx]"></div>
  <!-- #endif -->
  <!-- #ifdef MP-WEIXIN -->
  <LEchart
    class="costom-canvas"
    style="z-index: 1"
    ref="echart"
    v-if="option"
  ></LEchart>
  <!-- #endif -->
</template>

<style scoped lang="scss">
.costom-canvas {
  width: 100%;
  height: 310rpx;
  padding: 20rpx 0;
}
</style>
```

使用：

```vue
<template>
  <CustomEcharts
    v-if="options"
    class="echart"
    type="2d"
    :option="options"
  ></CustomEcharts>
</template>

<script setup lang="ts">
const options = ref(...)
</script>
```

如果数据会因为一些状态的改变而更新则需要在组件中添加监听函数再去执行对应的函数即可：

```vue
//custom-echarts.vue ......
<script setup lang="ts">
watch([props?.option], () => {
  if (props?.option) {
    nextTick(() => {
      // #ifdef MP-WEIXIN
      wxEchartInit();
      // #endif
      // #ifdef WEB
      echartInit();
      // #endif
    });
  }
});
</script>
......
```

若需要 tooltips 时，h5 就正常在 options 中添加即可，小程序则需要自己手动获取数据，再写一个单独的数据展示模块来实现...

```vue
......
<script setup lang="ts">

const showTip = ref(false);
const position = ref([]);
const params = ref([]);
//将内容添加搭配options中
const tooltip.position = (point, param, dom, rect, size) => {
    const box = [170, 170];
    // 偏移
    const offsetX = point[0] < size.viewSize[0] / 2 ? 20 : -box[0] - 20;
    const offsetY = 400;
    const x = point[0] + offsetX;
    const y = point[1] - 100;
    //记录位置
    position.value = [x, y];
    //记录数据
    params.value = param;
 };
const wxEchartInit = () => {
    if (echart.value && echart.value.init) {
        const option = Object.assign({}, props.option, {tooltip});
        echart.value.init(echarts,(chart: any) => {
          chart.setOption(option)
          chart.on('showTip', (params) => {
              	//展示内容
                showTip.value = true
           });
        })
    }
}
</script>
......
```

<br/>

## 总结

像我们这样实现 echarts 图，在小程序打包的时候所占用的代码体积是比较小的，没有太多的负担，而且在开发的时候也不用再考虑编译环境，可以一个组件两端通用，提高了我们的开发效率。在小程序中使用 echarts 有很多的限制，目前我们只是用了很简单的应用，如果需要在小程序中使用大量的图表，为了用户体验和小程序的性能还是建议使用 webview 来实现。
