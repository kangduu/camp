---
title: display、position和visibility
category: html-css
---

### [display](https://www.w3school.com.cn/cssref/pr_class_display.asp)

- **none**

表示该元素不会显示，并且该元素的空间也不存在，可理解为已删除；

visibility：hidden只是将元素隐藏，但不会改变页面布局，但也不会触发该元素已经绑定的事件；

opacity：0，将元素隐藏，不会改变页面布局，但会触发该元素绑定的事件。

- **inline**

行级元素（描述性）

一行显示（与其他元素在一行）；宽高不可控；

默认内容宽高；只能嵌套行类元素；

**<u>*a标签可以嵌套img，但不得嵌套a标签；*</u>**

**margin-top与margin-bottom无效，但margin-left与margin-right有效；**

**padding-left与padding-right同样有效，但是padding-top与padding-bottom不会影响元素高度，会影响背景高度；**

![](http://dukangblog.top/img/inline-ele.padding.jpg)

span、a、img、button、sup、sub、i、em、del、u（下划线）、br、b、strong、td、input、textarea、select、

- **block**

块级元素（结构性）

独占一行；宽高可控；宽默认100%；

***<u>p标签不能嵌套块标签；</u>***

address、center（地址文字）、blockquote、h1~h6、hr、p、marquee（滚动文本）、ul、ol、dl、table、form、div、pre

- **inline-block**

行内块元素，即是内联元素，又可设置宽高以及行高及顶和底边距；

常见的有\<img\>、\<input\>。

- **其它**

特殊的：行内元素绝对定位（absolute）后可设置宽高

空标签（单标签）：br、hr、img、input、link、meta、base

替换标签（行内标签）：img、input、textarea、select、object；（特殊的：替换元素可设宽高，类比img）

### [position](https://www.w3school.com.cn/cssref/pr_class_position.asp)

- static 

默认值，元素出现在正常的文档流中，不会受left、top、right、bottom的影响。

- relative 

**相对定位**，相对<u>自身位置</u>定位，可通过设置left、top、right、bottom的值来设置位置；

并且它原本所占的空间不变，即不会影响其他元素布局；

经常被用来作绝对元素的容器块。

- absolute 

**绝对定位**，相对于<u>最近的除static定位以外的元素</u>定位，若没有，则相对于html定位；

脱离了文档流，不占据文档空间；

若设置absolute，但没有设置top、left等值，其位置不变；

若设置absolute，会影响未定义宽度的块级元素，使其变为包裹元素内容的宽度。

- fixed 

**固定定位** 相对于<u>浏览器窗口</u>定位，脱离文档流，不会随页面滚动而变化。

### [visibility](https://www.w3school.com.cn/cssref/pr_class_visibility.asp)

- visible

  默认值，元素是可见的

- hidden

  元素是不可见的，但是**位置还在**。

- collapse

  当在<u>表格元素中</u>使用时，此值可删除一行或一列，但是它不会影响表格的布局。

  被行或列占据的空间会留给其他内容使用。

  如果此值被用在其他的元素上，会呈现为 "hidden"。

- inherit

  规定应该从父元素继承 visibility 属性的值。

### display:none和visibility:hidden的区别

- display：none 

  元素完全**不陈列出来**，**不占据空间**，

  涉及到了DOM结构，产生**回流（reflow）与重绘（repaint）**

- visibility：hidden

  指的是元素不可见但存在，保留空间，

  不影响结构，只产生**重绘（repaint）**