# 前端微专业大作业

    网易云课堂前端微专业大作业demo，原生js实现：
    - 浏览器兼容到IE8
    - 宽窄屏两种布局效果，阈值1205px
    - 跨域异步请求

## 目录说明

```
├── README.md
├── favicon.ico
├── index.css
├── index.html
├── js  // js源码
│   ├── base // 基础工具
│   ├── components  // 组件
├── images  // 图片

```

## 启动说明

    下载后浏览器打开index.html，或者丢到任意服务器均可

## 槽点

    以前做的东西有很多值得吐槽的地方：
    - html没有利用语义化标签（nav等）
    - IE8缺少mediaQuery的hack方式很偷懒
    - css布局方式部分有问题
    - js组件封装程度不够，另外比如courselist组件可以进一步拆分，存在比较多冗余代码