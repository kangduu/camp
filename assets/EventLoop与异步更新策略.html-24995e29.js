import{_ as s}from"./plugin-vue_export-helper-c27b6911.js";import{r as a,o as r,c as l,a as e,b as i,d,e as c}from"./app-c0280372.js";const t={},o=c(`<p>Vue 和 React 都实现了异步更新策略。虽然实现的方式不尽相同，但都达到了减少 DOM 操作、避免过度渲染的目的。通过研究框架的运行机制，其设计思路将深化我们对 DOM 优化的理解，其实现手法将拓宽我们对 DOM 实践的认知。</p><p>本节我们将基于 Event Loop 机制，对 Vue 的异步更新策略作探讨。</p><h2 id="前置知识-event-loop-中的-渲染时机" tabindex="-1"><a class="header-anchor" href="#前置知识-event-loop-中的-渲染时机" aria-hidden="true">#</a> 前置知识：Event Loop 中的“渲染时机”</h2><p>搞懂 Event Loop，是理解 Vue 对 DOM 操作优化的第一步。</p><h3 id="micro-task-与-macro-task" tabindex="-1"><a class="header-anchor" href="#micro-task-与-macro-task" aria-hidden="true">#</a> Micro-Task 与 Macro-Task</h3><p>事件循环中的异步队列有两种：macro（宏任务）队列和 micro（微任务）队列。</p><p>常见的 macro-task 比如： setTimeout、setInterval、 setImmediate、script（整体代码）、 I/O 操作、UI 渲染等。<br> 常见的 micro-task 比如: process.nextTick、Promise、MutationObserver 等。</p><h3 id="event-loop-过程解析" tabindex="-1"><a class="header-anchor" href="#event-loop-过程解析" aria-hidden="true">#</a> Event Loop 过程解析</h3><p>基于对 micro 和 macro 的认知，我们来走一遍完整的事件循环过程。</p><p>一个完整的 Event Loop 过程，可以概括为以下阶段：</p><ul><li>初始状态：调用栈空。micro 队列空，macro 队列里有且只有一个 script 脚本（整体代码）。</li><li>全局上下文（script 标签）被推入调用栈，同步代码执行。在执行的过程中，通过对一些接口的调用，可以产生新的 macro-task 与 micro-task，它们会分别被推入各自的任务队列里。同步代码执行完了，script 脚本会被移出 macro 队列，<strong>这个过程本质上是队列的 macro-task 的执行和出队的过程</strong>。</li><li>上一步我们出队的是一个 macro-task，这一步我们处理的是 micro-task。但需要注意的是：当 macro-task 出队时，任务是<strong>一个一个</strong>执行的；而 micro-task 出队时，任务是<strong>一队一队</strong>执行的（如下图所示）。因此，我们处理 micro 队列这一步，会逐个执行队列中的任务并把它出队，直到队列被清空。</li></ul><figure><img src="https://user-gold-cdn.xitu.io/2018/10/1/1662fc9d8bf609a6?w=480&amp;h=410&amp;f=png&amp;s=8715" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><ul><li><strong>执行渲染操作，更新界面</strong>（敲黑板划重点）。</li><li>检查是否存在 Web worker 任务，如果有，则对其进行处理 。</li></ul><p>（上述过程循环往复，直到两个队列都清空）</p><p>我们总结一下，每一次循环都是一个这样的过程：</p><figure><img src="https://user-gold-cdn.xitu.io/2018/10/1/1662ff57ebe7a73f?w=857&amp;h=243&amp;f=png&amp;s=28272" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="渲染的时机" tabindex="-1"><a class="header-anchor" href="#渲染的时机" aria-hidden="true">#</a> 渲染的时机</h3><p>大家现在思考一个这样的问题：假如我想要在异步任务里进行 DOM 更新，我该把它包装成 micro 还是 macro 呢？</p><p>我们先假设它是一个 macro 任务，比如我在 script 脚本中用 setTimeout 来处理它：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// task是一个用于修改DOM的回调
setTimeout(task, 0)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在 task 被推入的 macro 队列。但因为 script 脚本本身是一个 macro 任务，所以本次执行完 script 脚本之后，下一个步骤就要去处理 micro 队列了，再往下就去执行了一次 render，对不对？</p><p>但本次 render 我的目标 task 其实并没有执行，想要修改的 DOM 也没有修改，因此这一次的 render 其实是一次无效的 render。</p><p>macro 不 ok，我们转向 micro 试试看。我用 Promise 来把 task 包装成是一个 micro 任务：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Promise.resolve().then(task)

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>那么我们结束了对 script 脚本的执行，是不是紧接着就去处理 micro-task 队列了？micro-task 处理完，DOM 修改好了，紧接着就可以走 render 流程了——不需要再消耗多余的一次渲染，不需要再等待一轮事件循环，直接为用户呈现最即时的更新结果。</p><p>因此，我们更新 DOM 的时间点，应该尽可能靠近渲染的时机。<strong>当我们需要在异步任务中实现 DOM 修改时，把它包装成 micro 任务是相对明智的选择</strong>。</p><h2 id="生产实践-异步更新策略——以-vue-为例" tabindex="-1"><a class="header-anchor" href="#生产实践-异步更新策略——以-vue-为例" aria-hidden="true">#</a> 生产实践：异步更新策略——以 Vue 为例</h2><p>什么是异步更新？</p><p>当我们使用 Vue 或 React 提供的接口去更新数据时，这个更新并不会立即生效，而是会被推入到一个队列里。待到适当的时机，队列中的更新任务会被<strong>批量触发</strong>。这就是异步更新。</p><p>异步更新可以帮助我们避免过度渲染，是我们上节提到的“让 JS 为 DOM 分压”的典范之一。</p><h3 id="异步更新的优越性" tabindex="-1"><a class="header-anchor" href="#异步更新的优越性" aria-hidden="true">#</a> 异步更新的优越性</h3><p>异步更新的特性在于它<strong>只看结果</strong>，因此渲染引擎<strong>不需要为过程买单</strong>。</p><p>最典型的例子，比如有时我们会遇到这样的情况：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 任务一
this.content = &#39;第一次测试&#39;
// 任务二
this.content = &#39;第二次测试&#39;
// 任务三
this.content = &#39;第三次测试&#39;

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们在三个更新任务中对同一个状态修改了三次，如果我们采取传统的同步更新策略，那么就要操作三次 DOM。但本质上需要呈现给用户的目标内容其实只是第三次的结果，也就是说只有第三次的操作是有意义的——我们白白浪费了两次计算。</p><p>但如果我们把这三个任务塞进异步更新队列里，它们会先在 JS 的层面上被<strong>批量执行完毕</strong>。当流程走到渲染这一步时，它仅仅需要针对有意义的计算结果操作一次 DOM——这就是异步更新的妙处。</p><h3 id="vue-状态更新手法-nexttick" tabindex="-1"><a class="header-anchor" href="#vue-状态更新手法-nexttick" aria-hidden="true">#</a> Vue 状态更新手法：nextTick</h3><p>Vue 每次想要更新一个状态的时候，会先把它这个更新操作给包装成一个异步操作派发出去。这件事情，在源码中是由一个叫做 nextTick 的函数来完成的：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  callbacks.push(() =&gt; {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, &#39;nextTick&#39;)
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  // 检查上一个异步任务队列（即名为callbacks的任务数组）是否派发和执行完毕了。pending此处相当于一个锁
  if (!pending) {
    // 若上一个异步任务队列已经执行完毕，则将pending设定为true（把锁锁上）
    pending = true
    // 是否要求一定要派发为macro任务
    if (useMacroTask) {
      macroTimerFunc()
    } else {
      // 如果不说明一定要macro 你们就全都是micro
      microTimerFunc()
    }
  }
  // $flow-disable-line
  if (!cb &amp;&amp; typeof Promise !== &#39;undefined&#39;) {
    return new Promise(resolve =&gt; {
      _resolve = resolve
    })
  }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们看到，Vue 的异步任务默认情况下都是用 Promise 来包装的，也就是是说它们都是 micro-task。这一点和我们“前置知识”中的渲染时机的分析不谋而合。</p><p>为了带大家熟悉一下常见的 macro 和 micro 派发方式、加深对 Event Loop 的理解，我们继续细化解析一下 macroTimeFunc() 和 microTimeFunc() 两个方法。</p><p>macroTimeFunc() 是这么实现的：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// macro首选setImmediate 这个兼容性最差
if (typeof setImmediate !== &#39;undefined&#39; &amp;&amp; isNative(setImmediate)) {
  macroTimerFunc = () =&gt; {
    setImmediate(flushCallbacks)
  }
} else if (typeof MessageChannel !== &#39;undefined&#39; &amp;&amp; (
    isNative(MessageChannel) ||
    // PhantomJS
    MessageChannel.toString() === &#39;[object MessageChannelConstructor]&#39;
  )) {
  const channel = new MessageChannel()
  const port = channel.port2
  channel.port1.onmessage = flushCallbacks
  macroTimerFunc = () =&gt; {
    port.postMessage(1)
  }
} else {
  // 兼容性最好的派发方式是setTimeout
  macroTimerFunc = () =&gt; {
    setTimeout(flushCallbacks, 0)
  }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>microTimeFunc() 是这么实现的：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>// 简单粗暴 不是ios全都给我去Promise 如果不兼容promise 那么你只能将就一下变成macro了
if (typeof Promise !== &#39;undefined&#39; &amp;&amp; isNative(Promise)) {
  const p = Promise.resolve()
  microTimerFunc = () =&gt; {
    p.then(flushCallbacks)
    // in problematic UIWebViews, Promise.then doesn&#39;t completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn&#39;t being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // &quot;force&quot; the microtask queue to be flushed by adding an empty timer.
    if (isIOS) setTimeout(noop)
  }
} else {
  // 如果无法派发micro，就退而求其次派发为macro
  microTimerFunc = macroTimerFunc
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们注意到，无论是派发 macro 任务还是派发 micro 任务，派发的任务对象都是一个叫做 flushCallbacks 的东西，这个东西做了什么呢？</p><p>flushCallbacks 源码如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>function flushCallbacks () {
  pending = false
  // callbacks在nextick中出现过 它是任务数组（队列）
  const copies = callbacks.slice(0)
  callbacks.length = 0
  // 将callbacks中的任务逐个取出执行
  for (let i = 0; i &lt; copies.length; i++) {
    copies[i]()
  }
}

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在我们理清楚了：Vue 中每产生一个状态更新任务，它就会被塞进一个叫 callbacks 的数组（此处是任务队列的实现形式）中。这个任务队列在被丢进 micro 或 macro 队列之前，会先去检查当前是否有异步更新任务正在执行（即检查 pending 锁）。如果确认 pending 锁是开着的（false），就把它设置为锁上（true），然后对当前 callbacks 数组的任务进行派发（丢进 micro 或 macro 队列）和执行。设置 pending 锁的意义在于保证状态更新任务的有序进行，避免发生混乱。</p>`,49),m={href:"https://juejin.im/book/5a36661851882538e2259c0f",target:"_blank",rel:"noopener noreferrer"},v=e("h2",{id:"小结",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#小结","aria-hidden":"true"},"#"),i(" 小结")],-1),u=e("p",null,"至此，我们的 DOM 优化之路才走完了一半。",-1),p=e("p",null,"以上我们都在讨论“如何减少 DOM 操作”的话题。这个话题比较宏观——DOM 操作也分很多种，它们带来的变化各不相同。有的操作只触发重绘，这时我们的性能损耗就小一些；有的操作会触发回流，这时我们更“肉疼”一些。那么如何理解回流与重绘，如何借助这些理解去提升页面渲染效率呢？",-1),b=e("p",null,"结束了 JS 的征程，我们下面就走进 CSS 的世界一窥究竟。",-1);function h(g,f){const n=a("ExternalLinkIcon");return r(),l("div",null,[o,e("p",null,[i("本小节我们从性能优化的角度出发，通过解析 Vue 源码，对异步更新这一高效的 DOM 优化手段有了感性的认知。同时帮助大家进一步熟悉了 micro 与 macro 在生产中的应用，加深了对 Event Loop 的理解。事实上，Vue 源码中还有许多值得称道的生产实践，其设计模式与编码细节都值得我们去细细品味。对这个话题感兴趣的同学，课后不妨移步 "),e("a",m,[i("Vue 运行机制解析"),d(n)]),i(" 进行探索。")]),v,u,p,b])}const _=s(t,[["render",h],["__file","EventLoop与异步更新策略.html.vue"]]);export{_ as default};
