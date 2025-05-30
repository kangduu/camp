---
title: CDN的缓存与回源机制解析
---

## CDN的缓存与回源机制解析

> CDN （Content Delivery Network，即内容分发网络）指的是一组分布在各个地区的服务器。这些服务器存储着数据的副本，因此服务器可以根据哪些服务器与用户距离最近，来满足数据的请求。 CDN 提供快速服务，较少受高流量影响。

### 为什么要用 CDN

浏览器存储的相关知识此刻离我们还不太远，大家趁热回忆一下：缓存、本地存储带来的性能提升，是不是只能在“获取到资源并把它们存起来”这件事情发生之后？也就是说，首次请求资源的时候，这些招数都是救不了我们的。要提升首次请求的响应能力，除了我们 2、3、4 节提到的方案之外，我们还需要借助 CDN 的能力。

### CDN 如何工作

借中国地图一角来给大家举一个简单的🌰：

![](https://user-gold-cdn.xitu.io/2018/9/23/16605c1a4961f07e?w=1184&h=1020&f=png&s=1191786)

假设我的根服务器在杭州，同时在图示的五个城市里都有自己可用的机房。

此时有一位北京的用户向我请求资源。在网络带宽小、用户访问量大的情况下，杭州的这一台服务器或许不那么给力，不能给用户非常快的响应速度。于是我灵机一动，把这批资源 copy 了一批放在北京的机房里。当用户请求资源时，就近请求北京的服务器，北京这台服务器低头一看，这个资源我存了，离得这么近，响应速度肯定噌噌的！那如果北京这台服务器没有 copy 这批资源呢？它会再向杭州的根服务器去要这个资源。在这个过程中，北京这台服务器就扮演着 CDN 的角色。

### CDN的核心功能特写

CDN 的核心点有两个，一个是**缓存**，一个是**回源**。

这两个概念都非常好理解。对标到上面描述的过程，“缓存”就是说我们把资源 copy 一份到 CDN 服务器上这个过程，“回源”就是说 CDN 发现自己没有这个资源（一般是缓存的数据过期了），转头向根服务器（或者它的上层服务器）去要这个资源的过程。

### CDN 与前端性能优化

一个彩蛋的自我修养——CDN 往往是被前端认为前端不需要了解的东西。

具体来说，我身边许多同学对其的了解止步于：部署界面上有一个“部署到CDN”按钮，我去点一下，资源就在 CDN 上啦！

“眼下业务开发用不到的可以暂缓了解”，这是没毛病的。但正如我小册开篇所说的，前端工程师首先是软件工程师。对整个技术架构的理解，将会反哺我们对某一具体环节的理解；知识点的适当拓展，也会对大家技术高度和技术广度的提升大有裨益。

那么，我们了解一下 CDN 是怎么帮助前端的。

**CDN 往往被用来存放静态资源**。上文中我们举例所提到的“根服务器”本质上是业务服务器，它的核心任务在于**生成动态页面或返回非纯静态页面**，这两种过程都是需要计算的。业务服务器仿佛一个车间，车间里运转的机器轰鸣着为我们产出所需的资源；相比之下，CDN 服务器则像一个仓库，它只充当资源的“栖息地”和“搬运工”。

所谓“静态资源”，就是像 JS、CSS、图片等**不需要业务服务器进行计算即得的资源**。而“动态资源”，顾名思义是需要**后端实时动态生成的资源**，较为常见的就是 JSP、ASP 或者依赖服务端渲染得到的 HTML 页面。

什么是“非纯静态资源”呢？它是指**需要服务器在页面之外作额外计算的 HTML 页面**。具体来说，当我打开某一网站之前，该网站需要通过权限认证等一系列手段确认我的身份、进而决定是否要把 HTML 页面呈现给我。这种情况下 HTML 确实是静态的，但它**和业务服务器的操作耦合**，我们把它丢到CDN 上显然是不合适的。

### CDN 的实际应用

静态资源本身具有访问频率高、承接流量大的特点，因此静态资源加载速度始终是前端性能的一个非常关键的指标。CDN 是静态资源提速的重要手段，在许多一线的互联网公司，“静态资源走 CDN”并不是一个建议，而是一个规定。

比如以淘宝为代表的阿里系产品，就遵循着这个“规定”。  
打开淘宝首页，我们可以在 Network 面板中看到，“非纯静态”的 HTML 页面，是向业务服务器请求来的：

![](https://user-gold-cdn.xitu.io/2018/9/25/1660f50337974e82?w=1118&h=678&f=png&s=236400)

我们点击 preview，可以看到业务服务器确实是返回给了我们一个尚未被静态资源加持过的简单 HTML 页面，所有的图片内容都是先以一个 div 占位：

![](https://user-gold-cdn.xitu.io/2018/9/25/1660f52fe65facba?w=2102&h=1150&f=png&s=64675)

相应地，我们随便点开一个静态资源，可以看到它都是从 CDN 服务器上请求来的。

比如说图片：

![](https://user-gold-cdn.xitu.io/2018/9/25/1660f555fb76a89a?w=1124&h=106&f=png&s=26307)

再比如 JS、CSS 文件：

![](https://user-gold-cdn.xitu.io/2018/9/25/1660f57436da98f0?w=1606&h=134&f=png&s=43046)

![](https://user-gold-cdn.xitu.io/2018/9/25/1660f57b6b995d5e?w=1708&h=150&f=png&s=56740)

### CDN 优化细节

如何让 CDN 的效用最大化？这又是需要前后端程序员一起思考的庞大命题。它涉及到 CDN 服务器本身的性能优化、CDN 节点的地址选取等。但我们今天不写高深的论文，只谈离前端最近的这部分细节：CDN 的域名选取。

大家先回头看一下我刚刚选取的淘宝首页的例子，我们注意到业务服务器的域名是这个：

```
www.taobao.com

```

而 CDN 服务器的域名是这个：

```
g.alicdn.com

```

没错，我们不一样！

再看另一方面，我们讲到 Cookie 的时候，为了凸显 Local Storage 的优越性，曾经提到过：

> Cookie 是紧跟域名的。同一个域名下的所有请求，都会携带 Cookie。大家试想，如果我们此刻仅仅是请求一张图片或者一个 CSS 文件，我们也要携带一个 Cookie 跑来跑去（关键是 Cookie 里存储的信息我现在并不需要），这是一件多么劳民伤财的事情。Cookie 虽然小，请求却可以有很多，随着请求的叠加，这样的不必要的 Cookie 带来的开销将是无法想象的……

同一个域名下的请求会不分青红皂白地携带 Cookie，而静态资源往往并不需要 Cookie 携带什么认证信息。把静态资源和主页面置于不同的域名下，完美地避免了不必要的 Cookie 的出现！

看起来是一个不起眼的小细节，但带来的效用却是惊人的。以电商网站静态资源的流量之庞大，如果没把这个多余的 Cookie 拿下来，不仅用户体验会大打折扣，每年因性能浪费带来的经济开销也将是一个非常恐怖的数字。

如此看来，性能优化还真是要步步为营！

## 小结

结束了对 CDN 的剖析，我们网络层面的优化之旅也终于告一段落了。接下来等待大家的就是另一个庞大的知识板块——渲染层面的挑战。

与其说是“渲染层面的优化”，不如说是“浏览器端的优化”。这个板块旨在要大家对浏览器及其相关运行机制“知根知底”，进而通过具体的代码片段学习代码层面的应用手段。这部分是实打实的“硬骨头”，需要大家花些精力。

过去的几个小节里，我们考虑了服务端，考虑了网络，考虑了协议。那么接下来，我们就以“服务端渲染”为引子，承上启下，切入浏览器渲染的世界。