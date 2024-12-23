---
title: HTML/CSS
---

### 在 HTML 中如何做 SEO 优化？

1. `h`标签的使用，h1 标签只能出现一次，它是当前页面的主标题，对爬虫的吸引力是最强的
2. `strong`标签的使用，strong 标签对关键词的强调作用仅次于 h 标签，用于加粗段落标题或是重点关键词
3. head 标签内容【SEO 的重点】
   - \<title\>网站 SEO 标题\</title\>
   - \<meta name="descriptiion" content="网站描述"/\>
   - \<meta name="keywords" content="网站关键词/"\>
4. \<a href="链接地址" title="链接说明"\>链接关键词\</a\>，站内丰富的超链接会方便爬虫，体现网站的深度和广度
5. \<img src="图片链接地址" alt="图片说明"/\>，这是针对网页中图片的，当然也可以写成\<img src="图片链接地址"title="图片说明"/\>
6. \<div id="copyright"\>**版权部分**加上网站名称和链接\</div\>
7. HTML 优化要富于逻辑，重点明确，层次分明，这也是符合 SEO 精神的

### HTML 页面性能优化

- html

  - 语义化标签
  - 加载顺序:
    - css 放 head 里面(用户看到顺畅页面)；
    - js 放尾部（会阻塞 dom 渲染，且 dom 树没搭建好时，js 里面的 dom 操作会有问题）
  - 减少页面请求：合并 img，合并 css，避免使用@import 方式引入 css 文件
  - 减少文件大小：
    - 使用图片精灵；
    - 减少 img 文件大小，选用合适的格式并且用工具进行压缩；
    - 删除不必要的标签。

- css

  - 选择器：越简单越短越好,同样的样式进行选择器合并

  - css 值缩写：margin 等，值为 0 的省略单位,

    ```css
    font: normal small-caps bold 14px/1.5em "宋体", arial, verdana;
    /*等价于：*/
    font-style: normal;
    font-variant: small-caps;
    font-weight: bold;
    font-size: 14px;
    line-height: 1.5em;
    font-family: "宋体", arial, verdana;
    ```

  - 减少文件大小（压缩）:YUI Compressor,cssmin

  - 少用耗性能的属性:expresion,border-radius,filter,box-shadow,gradients 等

  - 图片设置宽高，不要缩放，减少浏览器的回流和重绘。

  - 所有表现用 css 实现

  - [模块化](https://blog.csdn.net/xiangzhihong8/article/details/53195926)

  - 命名规范、语义化

  - 尽量减少 hack

  > 由于不同厂商的流览器或某浏览器的不同版本（如 IE6-IE11,Firefox/Safari/Opera/Chrome 等），对 CSS 的支持、解析不一样，导致在不同浏览器的环境中呈现出不一致的页面展现效果。这时，我们为了获得统一的页面效果，就需要针对不同的浏览器或不同版本写特定的 CSS 样式，我们把这个针对不同的浏览器/不同版本写相应的 CSS code 的过程，叫做 CSS hack!

- javascript
  - 页面懒加载(图片等资源)
  - 图片的预加载
  - 通过事件委托等减少 dom 操作
  - [模块化](https://www.cnblogs.com/winyh/p/11133486.html)（CommonJS、AMD/CMD、ES6）
  - 动态列表（用最少的 DOM 元素实现）
  - ...

### 初始化一个 div 标签，默认宽度（width） 是多少？

- 默认情况下： `继承父级元素的宽度`，高度默认为 0（不设置的情况由子元素撑开）
- 设置了`浮动`：如果父级设置了浮动，子元素也设置了浮动，那么宽度（width）为 0

### 首屏，白屏时间如何计算？

**准备**

1. 加载是并行的，执行是串行的；
2. 执行需要等待加载完；
3. 浏览器的执行是串行的

[llink](https://www.cnblogs.com/littlelittlecat/p/6810294.html)

### BFC（块级格式化上下文）

- **思路**

  - BFC 是什么
  - 触发条件
  - 可以做些什么

- **什么是 BFC**

  块级格式化上下文 (Block Formatting Context) 。

  针对可视化布局提供一个环境，在此环境，决定**元素如何对其内容进行定位和布局**以及**与其他元素之间的关系**，环境与环境之间彼此独立（互不影响）。

  > 注意：只要元素可以触发 BFC，就无需清楚浮动（正确）

- 触发

  - 根元素 或 其它包含它的元素
  - 浮动元素 (元素的 `float` 不是 `none`)
  - 绝对定位元素 (元素具有 `position` 为 `absolute` 或 `fixed`)
  - 内联块 (元素具有 `display: inline-block`)
  - 表格单元格 (元素具有 `display: table-cell`，HTML 表格单元格默认属性)
  - 表格标题 (元素具有 `display: table-caption`, HTML 表格标题默认属性)
  - 具有`overflow` 且值不是 `visible` 的块元素
  - 弹性盒（`flex`或`inline-flex`）
  - `display: flow-root`
  - `column-span: all`

- 约束规则

  - 内部的盒会在垂直方向一个接一个排列（可以看作 BFC 中有一个的常规流）
  - 处于同一个 BFC 中的元素相互影响，可能会发生外边距重叠
  - 每个元素的 margin box 的左边，与容器块 border box 的左边相接触(对于从左往右的格式化，否则相反)，即使存在浮动也是如此
  - BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然
  - 计算 BFC 的高度时，考虑 BFC 所包含的所有元素，连浮动元素也参与计算
  - 浮动盒区域不叠加到 BFC 上

- 解决问题

  - 垂直外边距重叠问题（margin 塌陷）
  - 去除浮动
  - 自适用两列布局（`float` + `overflow`）

### CSS 选择器以及这些选择器的优先级

- `!important`
- 内联样式（1000）
- ID 选择器（0100）
- 类选择器/属性选择器/伪类选择器（0010）
- 元素选择器/关系选择器/伪元素选择器（0001）
- 通配符选择器（0000）

### 简述 display: flex ( Flex 布局 )

- **思路**

> 1.  Flex 的基本概念，结构组成
> 2.  列举一些属性（常用的）
> 3.  使用 Flex 布局案例（常用的）

- **参考**
  - [弹性布局](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
  - [常见布局的 Flex 写法](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)

### table 布局？div 布局? 二者的区别？

### 浮动元素高度塌陷问题？

- **思路**

> 1. 解决高度塌陷问题的两种类型：`clear` 和 `BFC`
> 2. 具体方案
>    - 追加元素并设置 clear 属性
>    - css 样式插入**伪元素**
>    - **BFC** （Bootstrap 如何做的）

- **实操**
- **思考**
  - 高度塌陷产生的原因是什么？
  - `clear` 属性清除浮动的原理是什么？
  - 采用 BFC 解决高度塌陷和`clear` 属性清除浮动相比的优势是什么？

### 伪元素、伪类、二者的区别### CSS 中的 `background` 的 `background-image` 属性可以和 `background-color` 属性一起生效么？

### img 后缀

- svg：图片在**放大或改变尺寸的情况下其图形质量不会有所损失**，适合**小图标**；
- png：**无损压缩**，更适合需要**高保真**的修饰图片；
- jpeg：支持**高动态范围成像**，支持**图片透明度**，色彩丰富的照片；
- gif：可插入多帧，从而实现**动画效果**，可设置透明色以产生对象浮现于背景之上的效果。

### img 属性 alt 和 title 的区别

### `background-color` 属性可以覆盖 `background-image` 属性吗？

### reset.css？为什么要使用？（初始化 CSS 的作用与好处？）

​ 重置的目的不是清除浏览器的默认样式，这仅是部分工作。我们希望让默认样式在所有浏览器基本保持一致，从而减少默认样式有可能带来的问题。我们应该清楚，清除和重置是紧密不可分的。（因为浏览器的品种很多，每个浏览器的默认样式也是不同的，所以定义一套初始化 css 可以使各浏览器的默认样式统一。以便项目在不同浏览器上的效果是一致的）

### CSS 中哪些属性可以继承？

[可继承的属性](http://dukangblog.top/2020/03/30/HTML.CSS-%E5%8F%AF%E7%BB%A7%E6%89%BF%E5%B1%9E%E6%80%A7/)

### 什么是 css 的选择器？

​ CSS 是一种用于屏幕上渲染 html，xml 等一种语言，CSS 主要是在相应的元素中应用样式，来渲染相对应用的元素，那么这样我们选择相应的元素就很重要了，如何选择对应的元素，此时就需要我们所说的选择器。在 CSS 中，选择器是一种模式，用于选择需要添加样式的元素。选择器主要是用来确定 html 的树形结构中的 DOM 元素节点

### Web 标准

Web 标准不是某一个标准，是由 W3C 和其他标准化组织指定的一系列标准的集合，主要包括结构（Structure）、表现（Presentation）和行为（Behavior）三个方面。

- 好处

1. 让 Web 的发展前景更广阔
2. 内容能被更广泛的设备访问
3. 更容易被搜索引擎搜索
4. 降低网站流量费用
5. 使网站更易于维护
6. 提高页面浏览速度

### CSS 引入的方式有哪些? link 和@import 的区别?

```
1. link可以用js修改，@import不可以
2. link比@import先载入
3. @import只能引入css
4. link兼容性高
```

### 什么是 css sprites（精灵）

<https://www.cnblogs.com/yangguoe/p/8466117.html>

**加速的关键，不是降低质量，而是减少个数。**

css sprites 适用范围：

1，需要通过降低 http 请求数完成网页加速。

2，网页中含有大量小图标。或者，某些图标通用性很强。

3，网页中有需要预载的图片。主要是 a 与 a:hover 背景图这种关系的。如果 a 与 a:hover 的背景图分别加载，那么，就会出现用户鼠标移到某个按钮上，按钮的背景突然消失再出来，产生“闪烁”，如果按钮文字色与大背景相同或相近，就更囧了，有可能让人产生按钮“消失”了的错觉。

### CSS 中的 [`vertical-align`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/vertical-align) 属性值？什么情况下生效？

- `vertical-align` 生效的前提

  1. 内联元素 `span` `strong` `em` `img` `button` `input` 等；
  2. `display` 属性值为`inline` `inline-block` `inline-table` 或 `table-cell`;

  **特别注意：浮动和绝对定位会让元素块状化，不会生效。**

- `vertical-align` 的属性值：

  线类：`baseline` `top` `middle` `bottom`

  文本类：`text-top`、`text-bottom`

  上标下标类：`sub`、`super`

  数值百分比类：20px、2em、20%等（对于基线往上或往下偏移）

`提示`

> `负值` 相对于基线往下移，`正值` 往上移；
>
> `vertical-align：baseline` 等同于 `vertical-align：0` ;
>
> 巧用正负值。
