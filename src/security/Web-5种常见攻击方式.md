---
title: Web安全问题
---

### Web 安全问题（5 种常见的攻击方式）

1. SQL 注入
2. XSS
3. CSRF
4. 点击劫持
5. 中间人攻击

### 1. SQL 注入

> 后端人员使用**用户输入的数据**来**【拼接 SQL 查询语句】**时未做防范，使得一些恶意的输入产生了有问题的 SQL 语句

`示例`

```js
//请求地址
test/index.php?id=1

//SQL语句
sql = "select * from test where id=", $id

//正常情况：我们只想获取id=1的文章内容

//攻击者可恶意输入
test/index.php?id=-1 OR 1 = 1
// 这样导致id=-1 OR 1=1 永远为true，进而where语句失效（无意义），则可以获取全部内容（test表）
```

`规避`

使用**过滤**和**验证**机制，有效预防**SQL 注入**攻击。

### 2. XSS

`描述`

**跨站脚本攻击**，通过**【代码注入】**的方式来达到攻击的目的。

```html
<form action="" method="POST">
  <input type="text" name="text" v-model='text'>
  <input type="submit" value="提交">
</form>
<h2>您输入的内容：{{text}}</h2>

<--!-->
	如果我们输入了类式 【 <script>alert('1')</script>】 这样的信息，导致提交后可以执行等操作（支付操作等），Chrome是可以提示并拦截的，但不是所有的浏览器都可以的。
</--!-->
```

`规避`

1. **字符转义**

   转义输入输出的内容【引号、尖括号、斜杠等】

   ```javascript
   & 替换为 &
   < ===>  &lt;
   > ===>  &gt;
   ” ===>  "
   ‘ ===>  &#x27;
   / ===>  &#x2f;
   ......
   ```

   回头看上面的例子

   ```html
   <script>
     alert("1");
   </script>
   转义为 &lt;script&gt;alert('1')&lt;&#x2f;script&gt;
   ```

   这样转义后，将无法执行对应的操作了。

   **但是**

   ```html
   <a href="{{url}}">跳转</a>

   这里的 url 可以是任何协议的地址，问题就在于，如果链接存在【 javascript：】开头的协议，便会执行后边的代码。 类式的还有：
   <img src="{{url}}" />
   <iframe src="{{url}}" frameborder="0"></iframe>

   上述的这几种情况：应该使用【白名单】检查协议，只允许http、https、meilto、等安全协议
   ```

   同理，【富文本】则也需要白名单过滤，参考：

2. **CSP** (Content Security Policy)

其本质也是使用白名单，**设置允许浏览器加载哪些外部资源**。

开启 CSP 的两种方式：

- 设置 **HTTP 的 Header** 中的 `Content-Security-Policy `
- 设置`meta`标签的方式

### 3. CSRF( Cross Site Request Forgery)

`跨站请求伪造` — **借用 用户的<u>身份</u>或<u>权限</u>**悄咪咪的完成某些操作。本质 — `Cookie`

- 理论基础
  - 登录 A 网站，此时 cookie 中便会记录登录标记，正常情况下在 A 网站发起【http://aaa.com/pay?id=123&money=1000】会自动携带cookie，以便server端权限认证；
  - 现在，A 网站请求 B 网站的 API，是不可能携带 cookie 的，**同源策略**限制；
  - 重点，C 网站中去请求 A 网站中的 API【http://aaa.com/pay?id=123&money=1000】则会携带A网站cookie
- 防御
  - 请求各个层级添加**权限验证** （如现金支付需要密码或扫码等验证）
  - 敏感接口使用 POST

### 4. 点击劫持（click-jacking）/ UI 覆盖攻击

主要攻击方式：**按钮上加一次透明的 iframe**

- 防御

  - HTTP 头防御

  通过配置 nginx 发送 [X-Frame-Options](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/X-Frame-Options) 响应头，这个 HTTP 响应头 就是为了防御用 iframe 嵌套的点击劫持攻击。 这样浏览器就会阻止嵌入网页的渲染。

  - javascript 防御 —— 域名一致性

  判断顶层视口的域名是不是和本页面的域名一致，如果不一致就让恶意网页自动跳转到我方的网页。

  ```javascript
  if (top.location.hostname !== self.location.hostname) {
    alert("您正在访问不安全的页面，即将跳转到安全页面！");
    top.location.href = self.location.href;
  }
  ```

### 5. 中间人攻击(Man-in-the-Middle Attack, MITM)

通过**拦截正常的网络通信数据**，并**进行数据篡改和嗅探**来达到攻击的目的，而通信的双方却毫不知情。如 SMB 会话劫持、DNS 欺骗攻击

- 建议

  - 确保当前你所访问的网站使用了 HTTPS
  - 如果你是一个网站管理员，你应当执行[HSTS 协议](https://zhangzifan.com/hsts.html)
  - 不要在公共 Wi-Fi 上发送敏感数据
  - 如果你的网站使用了 SSL，确保你禁用了不安全的 SSL/TLS 协议。
  - 不要点击恶意链接或电子邮件。

- window.opener 存在的隐藏问题

  带有 `target="_blank" `跳转的网页拥有了浏览器 `window.opener` 对象赋予的对原网页的跳转权限，这可能会被恶意网站利用，

  > 例如一个恶意网站在某 UGC 网站 Po 了其恶意网址，该 UGC 网站用户在新窗口打开页面时，恶意网站利用该漏洞将原 UGC 网站跳转到伪造的钓鱼页面，用户返回到原窗口时可能会忽视浏览器 URL 已发生了变化，伪造页面即可进一步进行钓鱼或其他恶意行为:

  `修复`

  ```html
  <a href="xxx" rel="noopener noreferrer"></a> /*添加 rel 属性值*/ 缺点： referrer会导致目标网址没办法检测来源地址。
  ```

  **好的做法**——所有的外部链接都替换为内部的跳转连接服务，点击连接时，先跳到内部地址，再由服务器重定向（ redirect） 到外部网址。（你应该指定限制很多站点都是这样做的，即规避了风险，也控制了非法站点的打开）​
