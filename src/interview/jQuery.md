---
title: jQuery
---

### $(this)和this关键字在jQuery中有何不同？ 

\$(this)是jquery对象，this就是简单指当前元素。jquery对象不能直接指定元素的属性（ele.style），需要get（index）或者直接（index）取得对象中元素才行

JQuery中的 \$\(\) 这个符号，实际上这个符号在JQuery中相当于JQuery\(\)，即\$(this)=jquery(this);

也就是说，这样可以返回一个jquery对象。那么，当你在网页中alert\(\$('#id'\));时，会弹出一个[object Object ]，这个object对象，也就是jquery对象了。

### jQuery中\$.get()提交和 \$.post()提交有区别吗？

相同点：都是异步请求的方式来获取服务端的数据；

不同点：

1. 请求方式不同：$.get\(\)方法是使用GET方法来进行异步请求的。$.post\(\)方法使用POST方法来进行异步请求的。
2. 参数传递方式不同：get请求会将参数跟在URL后进行传递，而POST请求则是作为HTTP消息的实体内容发送给web服务器的，这种传递是对用户不可见的。
3. 传递数据大小不同：get方式传输的数据大小不能超过2KB，而POST要大得多。
4. 安全问题：GET方式请求的数据会被浏览器缓存起来，因此有安全问题。[移步.参考](https://blog.csdn.net/hai1991yu/article/details/81407016)