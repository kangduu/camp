import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as a,e}from"./app-d562ab54.js";const t={},p=e(`<h2 id="是否写过loader-简单描述一下编写loader的过程" tabindex="-1"><a class="header-anchor" href="#是否写过loader-简单描述一下编写loader的过程" aria-hidden="true">#</a> 是否写过Loader？简单描述一下编写Loader的过程？</h2><p>我们都知道，Webpack最后打包出来的成果是一份Javascript代码，实际上在Webpack内部默认也只能够处理JS模块代码，在打包过程中，会默认把所有遇到的文件都当作JavaScript代码进行解析，因此当项目存在非JS类型文件时，我们需要先对其进行必要的转换，才能继续执行打包任务，这也是Loader机制存在的意义。</p><p>Loader的配置使用我们应该已经非常的熟悉：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// webpack.config.js</span>
module<span class="token punctuation">.</span>exports <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token comment">// ...other config</span>
  <span class="token literal-property property">module</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">rules</span><span class="token operator">:</span> <span class="token punctuation">[</span>
      <span class="token punctuation">{</span>
        <span class="token literal-property property">test</span><span class="token operator">:</span> <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">^your-regExp$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span>
        <span class="token literal-property property">use</span><span class="token operator">:</span> <span class="token punctuation">[</span>
          <span class="token punctuation">{</span>
             <span class="token literal-property property">loader</span><span class="token operator">:</span> <span class="token string">&#39;loader-name-A&#39;</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">,</span> 
          <span class="token punctuation">{</span>
             <span class="token literal-property property">loader</span><span class="token operator">:</span> <span class="token string">&#39;loader-name-B&#39;</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span>
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过配置可以看出，针对每个文件类型，loader是支持以数组的形式配置多个的，因此当Webpack在转换该文件类型的时候，会按顺序链式调用每一个loader，前一个loader返回的内容会作为下一个loader的入参。</p><p>因此loader的开发需要遵循一些规范，比如返回值必须是标准的JS代码字符串，以保证下一个loader能够正常工作，同时在开发上需要严格遵循“单一职责”，只关心loader的输出以及对应的输出。</p><p>loader函数中的this上下文由webpack提供，可以通过this对象提供的相关属性，获取当前loader需要的各种信息数据，事实上，这个this指向了一个叫loaderContext的loader-runner特有对象。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>module<span class="token punctuation">.</span><span class="token function-variable function">exports</span> <span class="token operator">=</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">source</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> content <span class="token operator">=</span> <span class="token function">doSomeThing2JsString</span><span class="token punctuation">(</span>source<span class="token punctuation">)</span><span class="token punctuation">;</span>
    
    <span class="token comment">// 如果 loader 配置了 options 对象，那么this.query将指向 options</span>
    <span class="token keyword">const</span> options <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>query<span class="token punctuation">;</span>
    
    <span class="token comment">// 可以用作解析其他模块路径的上下文</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;this.context&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    
    <span class="token comment">/*
     * this.callback 参数：
     * error：Error | null，当 loader 出错时向外抛出一个 error
     * content：String | Buffer，经过 loader 编译后需要导出的内容
     * sourceMap：为方便调试生成的编译后内容的 source map
     * ast：本次编译生成的 AST 静态语法树，之后执行的 loader 可以直接使用这个 AST，进而省去重复生成 AST 的过程
     */</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">callback</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> content<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// or return content;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,8),o=[p];function l(c,i){return s(),a("div",null,o)}const d=n(t,[["render",l],["__file","loader.html.vue"]]);export{d as default};
