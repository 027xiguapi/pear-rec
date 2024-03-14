import{_ as s}from"./chunks/logo.f08e2029.js";import{_ as a,o as n,c as e,M as l}from"./chunks/framework.b7e7358f.js";const u=JSON.parse('{"title":"pear-rec 例子","description":"","frontmatter":{},"headers":[],"relativePath":"md/markdown-examples.md","filePath":"md/markdown-examples.md"}'),p={name:"md/markdown-examples.md"},t=l('<h1 id="pear-rec-例子" tabindex="-1">pear-rec 例子 <a class="header-anchor" href="#pear-rec-例子" aria-label="Permalink to &quot;pear-rec 例子&quot;">​</a></h1><p><img src="'+s+`" alt="An image"> 本页展示 pear-rec 的一些功能例子</p><h2 id="syntax-highlighting" tabindex="-1">Syntax Highlighting <a class="header-anchor" href="#syntax-highlighting" aria-label="Permalink to &quot;Syntax Highlighting&quot;">​</a></h2><p>VitePress provides Syntax Highlighting powered by <a href="https://github.com/shikijs/shiki" target="_blank" rel="noreferrer">Shiki</a>, with additional features like line-highlighting:</p><p><strong>Input</strong></p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#babed8;">\`\`\`js{4}</span></span>
<span class="line"><span style="color:#babed8;">export default {</span></span>
<span class="line"><span style="color:#babed8;">  data () {</span></span>
<span class="line"><span style="color:#babed8;">    return {</span></span>
<span class="line"><span style="color:#babed8;">      msg: &#39;Highlighted!&#39;</span></span>
<span class="line"><span style="color:#babed8;">    }</span></span>
<span class="line"><span style="color:#babed8;">  }</span></span>
<span class="line"><span style="color:#babed8;">}</span></span>
<span class="line"><span style="color:#babed8;">\`\`\`</span></span></code></pre></div><p><strong>Output</strong></p><div class="language-js"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki material-theme-palenight has-highlighted-lines"><code><span class="line"><span style="color:#89DDFF;font-style:italic;">export</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;font-style:italic;">default</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#BABED8;">  </span><span style="color:#F07178;">data</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">()</span><span style="color:#BABED8;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;font-style:italic;">return</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line highlighted"><span style="color:#F07178;">      msg</span><span style="color:#89DDFF;">:</span><span style="color:#F07178;"> </span><span style="color:#89DDFF;">&#39;</span><span style="color:#C3E88D;">Highlighted!</span><span style="color:#89DDFF;">&#39;</span></span>
<span class="line"><span style="color:#F07178;">    </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#F07178;">  </span><span style="color:#89DDFF;">}</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span></code></pre></div><h2 id="custom-containers" tabindex="-1">Custom Containers <a class="header-anchor" href="#custom-containers" aria-label="Permalink to &quot;Custom Containers&quot;">​</a></h2><p><strong>Input</strong></p><div class="language-md"><button title="Copy Code" class="copy"></button><span class="lang">md</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#BABED8;">::: info</span></span>
<span class="line"><span style="color:#BABED8;">This is an info box.</span></span>
<span class="line"><span style="color:#BABED8;">:::</span></span>
<span class="line"></span>
<span class="line"><span style="color:#BABED8;">::: tip</span></span>
<span class="line"><span style="color:#BABED8;">This is a tip.</span></span>
<span class="line"><span style="color:#BABED8;">:::</span></span>
<span class="line"></span>
<span class="line"><span style="color:#BABED8;">::: warning</span></span>
<span class="line"><span style="color:#BABED8;">This is a warning.</span></span>
<span class="line"><span style="color:#BABED8;">:::</span></span>
<span class="line"></span>
<span class="line"><span style="color:#BABED8;">::: danger</span></span>
<span class="line"><span style="color:#BABED8;">This is a dangerous warning.</span></span>
<span class="line"><span style="color:#BABED8;">:::</span></span>
<span class="line"></span>
<span class="line"><span style="color:#BABED8;">::: details</span></span>
<span class="line"><span style="color:#BABED8;">This is a details block.</span></span>
<span class="line"><span style="color:#BABED8;">:::</span></span></code></pre></div><p><strong>Output</strong></p><div class="info custom-block"><p class="custom-block-title">INFO</p><p>This is an info box.</p></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>This is a tip.</p></div><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>This is a warning.</p></div><div class="danger custom-block"><p class="custom-block-title">DANGER</p><p>This is a dangerous warning.</p></div><details class="details custom-block"><summary>Details</summary><p>This is a details block.</p></details><h2 id="react" tabindex="-1">react <a class="header-anchor" href="#react" aria-label="Permalink to &quot;react&quot;">​</a></h2><p><a href="https://stackblitz.com/edit/vite-dnqmyv?file=package.json" target="_blank" rel="noreferrer">https://stackblitz.com/edit/vite-dnqmyv?file=package.json</a></p><div class="language-"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#babed8;">&lt;div ref=&quot;el&quot; /&gt;</span></span>
<span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;">&lt;script setup&gt;</span></span>
<span class="line"><span style="color:#babed8;">import { createElement } from &#39;react&#39;</span></span>
<span class="line"><span style="color:#babed8;">import { createRoot } from &#39;react-dom/client&#39;</span></span>
<span class="line"><span style="color:#babed8;">import { ref, onMounted } from &#39;vue&#39;</span></span>
<span class="line"><span style="color:#babed8;">import FooBar from &#39;./FooBar&#39;</span></span>
<span class="line"><span style="color:#babed8;"></span></span>
<span class="line"><span style="color:#babed8;">const el = ref()</span></span>
<span class="line"><span style="color:#babed8;">onMounted(() =&gt; {</span></span>
<span class="line"><span style="color:#babed8;">  const root = createRoot(el.value)</span></span>
<span class="line"><span style="color:#babed8;">  root.render(createElement(FooBar, {}, null))</span></span>
<span class="line"><span style="color:#babed8;">})</span></span>
<span class="line"><span style="color:#babed8;">&lt;/script&gt;</span></span></code></pre></div><h2 id="more" tabindex="-1">More <a class="header-anchor" href="#more" aria-label="Permalink to &quot;More&quot;">​</a></h2><p>Check out the documentation for the <a href="https://vitepress.dev/guide/markdown" target="_blank" rel="noreferrer">full list of markdown extensions</a>.</p>`,22),o=[t];function i(c,r,d,h,y,b){return n(),e("div",null,o)}const D=a(p,[["render",i]]);export{u as __pageData,D as default};
