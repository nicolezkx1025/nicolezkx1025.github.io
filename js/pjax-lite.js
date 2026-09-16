/*!
 * pjax-lite.js — 让站内跳转不再整页刷新
 *
 * 目的:主站左下角的 Spotify 播放器挂在 <body> 上,整页重载会把 iframe 销毁、音乐中断。
 *      本脚本拦截站内链接,只替换内容区,页面外壳(含播放器、背景波点)保持不变。
 *
 * 为什么自己写:
 *   主题自带 js/pjax.js 的配置,但依赖的 Pjax 库(lib/pjax/pjax.min.js)在本站没有构建出来,
 *   且 NexT 的 HTML 没有 #pjax-container;所以这里按主题同样的选择器自己实现一份,零依赖。
 *
 * 与主题的对接(复用主题既有机制,不另造一套):
 *   1. 交换 head title / og:title / 所有 script[type="application/json"](即 next-config);
 *   2. 交换 .main-inner(正文)与 .post-toc-wrap(侧栏目录);
 *   3. 派发 `pjax:success` —— 主题里 utils.js 会据此再派发 `page:loaded`,
 *      评论(Gitalk)、fancybox、katex、mermaid 等都在 `page:loaded` 上重新初始化;
 *      config.js 也会据此清空变量配置,让 CONFIG.gitalk / CONFIG.page 重新读取新页面的值;
 *   4. 再调 NexT.boot.refresh() / motion,重建目录、返回顶部、代码复制按钮等;
 *   5. 任何异常一律回退成普通跳转(宁可刷新一次,也不能让站点坏掉)。
 */
(function () {
  'use strict';

  if (window.__nzkPjaxLite) return;
  window.__nzkPjaxLite = true;

  var CONTAINER = '.main-inner';
  var TOC = '.post-toc-wrap';
  var EVENT = 'pjax:success';
  var busy = false;

  function log() {
    var args = [].slice.call(arguments);
    window.__nzkPjaxLog = window.__nzkPjaxLog || [];
    if (window.__nzkPjaxLog.length < 40) window.__nzkPjaxLog.push(args.join(' '));
    if (window.__nzkPjaxDebug) console.log.apply(console, ['[pjax-lite]'].concat(args));
  }

  // 该不该由 PJAX 接管这次点击
  function shouldHandle(event, anchor) {
    if (!anchor || !anchor.getAttribute) return false;
    if (event.defaultPrevented) return false;
    if (event.button !== 0) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (anchor.target && anchor.target !== '_self') return false;
    if (anchor.hasAttribute('download')) return false;

    var href = anchor.getAttribute('href');
    if (!href || href.charAt(0) === '#') return false;
    if (/^(mailto:|tel:|javascript:)/i.test(href)) return false;
    if (anchor.dataset && anchor.dataset.noPjax !== undefined) return false;

    var url;
    try { url = new URL(anchor.href, location.href); } catch (e) { return false; }
    if (url.origin !== location.origin) return false;
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return false;
    // 非 HTML 资源(图片、PDF、附件)不走 PJAX
    if (/\.(png|jpe?g|gif|svg|webp|pdf|zip|mp3|mp4|json|xml|txt|js|css)$/i.test(url.pathname)) return false;
    // 文件协议下 fetch 会被浏览器拦,直接用普通跳转
    if (location.protocol === 'file:') return false;
    return true;
  }

  function swapConfigScripts(doc) {
    // 主题的 next-config:main 是静态的,其余(如 gitalk / page)随页面变化
    doc.querySelectorAll('script.next-config[data-name]').forEach(function (next) {
      var name = next.getAttribute('data-name');
      var cur = document.querySelector('script.next-config[data-name="' + name + '"]');
      if (cur && cur.textContent !== next.textContent) {
        cur.textContent = next.textContent;
        log('config swapped:', name);
      }
    });
  }

  function swapMeta(doc) {
    document.title = doc.title;
    ['og:title', 'og:url', 'og:description', 'description'].forEach(function (key) {
      var sel = key === 'description' ? 'meta[name="description"]' : 'meta[property="' + key + '"]';
      var next = doc.querySelector(sel);
      var cur = document.querySelector(sel);
      if (next && cur) cur.setAttribute('content', next.getAttribute('content') || '');
    });
  }

  function swapTOC(doc) {
    var nextTOC = doc.querySelector(TOC);
    var curTOC = document.querySelector(TOC);
    if (!curTOC) return;
    if (nextTOC) {
      curTOC.innerHTML = nextTOC.innerHTML;
      curTOC.className = nextTOC.className;
    } else {
      // 新页面没有目录:保留占位,避免侧栏抖动
      var inner = curTOC.querySelector('.post-toc');
      if (inner) inner.classList.add('placeholder-toc');
    }
    curTOC.removeAttribute('class');
    if (nextTOC) curTOC.className = nextTOC.className;
  }

  function refresh() {
    try {
      document.dispatchEvent(new Event(EVENT, { bubbles: true }));   // 主题据此派发 page:loaded
    } catch (e) { log('dispatch failed', e); }

    try {
      if (window.NexT && NexT.boot) {
        NexT.boot.refresh && NexT.boot.refresh();
        if (NexT.motion && NexT.motion.integrator && window.CONFIG && CONFIG.motion && CONFIG.motion.enable) {
          NexT.motion.integrator.init()
            .add(NexT.motion.middleWares.subMenu)
            .add(NexT.motion.middleWares.sidebar)
            .add(NexT.motion.middleWares.postList)
            .bootstrap();
        }
      }
    } catch (e) { log('boot.refresh failed', e); }

    try {
      if (window.NexT && NexT.utils && window.CONFIG && CONFIG.sidebar && CONFIG.sidebar.display !== 'remove') {
        var hasTOC = document.querySelector('.post-toc:not(.placeholder-toc)');
        var sidebarInner = document.querySelector('.sidebar-inner');
        if (sidebarInner) sidebarInner.classList.toggle('sidebar-nav-active', !!hasTOC);
        NexT.utils.activateSidebarPanel && NexT.utils.activateSidebarPanel(hasTOC ? 0 : 1);
        NexT.utils.updateSidebarPosition && NexT.utils.updateSidebarPosition();
      }
    } catch (e) { log('sidebar refresh failed', e); }

    // 第三方脚本(图表、PDF 预览等)标了 data-pjax 的需要手动执行
    document.querySelectorAll('script[data-pjax]').forEach(function (old) {
      var s = document.createElement('script');
      [].slice.call(old.attributes).forEach(function (a) { s.setAttribute(a.name, a.value); });
      s.textContent = old.textContent;
      old.parentNode.replaceChild(s, old);
    });
  }

  function go(url, addHistory) {
    if (busy) return;
    busy = true;
    document.documentElement.classList.add('pjax-loading');

    fetch(url, { credentials: 'same-origin', headers: { 'X-Requested-With': 'pjax-lite' } })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        var type = res.headers.get('content-type') || '';
        if (type && type.indexOf('text/html') === -1) throw new Error('not html');
        return res.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var nextMain = doc.querySelector(CONTAINER);
        var curMain = document.querySelector(CONTAINER);
        if (!nextMain || !curMain) throw new Error('no container');

        swapConfigScripts(doc);
        swapMeta(doc);
        swapTOC(doc);

        curMain.replaceWith(document.importNode(nextMain, true));

        if (addHistory) history.pushState({ nzkPjax: 1 }, '', url);

        // 锚点优先,其次回到顶部
        var hash = '';
        try { hash = new URL(url, location.href).hash; } catch (e) { }
        if (hash) {
          var el = document.querySelector(hash);
          if (el && el.scrollIntoView) el.scrollIntoView();
          else window.scrollTo(0, 0);
        } else {
          window.scrollTo(0, 0);
        }

        refresh();
        window.__nzkPjaxCount = (window.__nzkPjaxCount || 0) + 1;
        log('navigated:', url, 'count', window.__nzkPjaxCount);
      })
      .catch(function (err) {
        log('fallback to full load:', url, err && err.message);
        location.href = url;
      })
      .then(function () {
        busy = false;
        document.documentElement.classList.remove('pjax-loading');
      });
  }

  document.addEventListener('click', function (event) {
    var anchor = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!anchor || !shouldHandle(event, anchor)) return;
    var url = anchor.href;
    event.preventDefault();
    go(url, true);
  }, false);

  window.addEventListener('popstate', function () {
    if (location.protocol === 'file:') return;
    go(location.href, false);
  });

  // 调试钩子:便于用浏览器自动化验证"哪些链接该接管、哪些不该"
  window.__nzkPjaxShouldHandle = shouldHandle;

  log('ready');
})();
