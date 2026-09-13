/*!
 * spotify-player.js — 周杰伦 · Spotify(迷你版)
 *
 * 要点:
 *  1. 主题 CSS 有 `#spotify-player { display: none !important; }`(历史遗留),
 *     故本脚本自建容器挂在 <body>,不受其影响;
 *  2. 默认只显示一个迷你胶囊按钮;点击才展开,展开后整体缩放到 0.62 倍(约 218px);
 *  3. 未展开时不加载任何 iframe(省流量、避免空白框)。
 */
(function () {
  'use strict';

  var EMBED = 'https://open.spotify.com/embed/artist/2elBjNSdBE2Y3f0j1mjrql?utm_source=generator&theme=0';
  var W = 352, H = 352;      // Spotify 艺人页嵌入的最小原始尺寸
  var SCALE = 0.62;          // 视觉缩放(要更小就调这个;0.5 = 很迷你)
  var KEY = 'spotify-open';
  var WRAP = 'jay-spotify-wrap';

  // 清理历史版本(自研背景乐)遗留记录
  try {
    localStorage.removeItem('calm-music-on');
    localStorage.removeItem('calm-music-vol');
  } catch (e) {}

  function el(id) { return document.getElementById(id); }

  function ensureWrap() {
    var wrap = el(WRAP);
    if (wrap) return wrap;

    wrap = document.createElement('div');
    wrap.id = WRAP;
    wrap.style.cssText = [
      'position:fixed', 'left:16px', 'bottom:16px', 'z-index:2147483000',
      'display:flex', 'flex-direction:column', 'align-items:flex-start', 'gap:6px',
      'max-width:calc(100vw - 32px)'
    ].join(';');

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'jay-spotify-toggle';
    btn.title = '点击展开/收起周杰伦歌单(需可访问 Spotify)';
    btn.style.cssText = [
      'border:1px solid rgba(0,0,0,0.16)', 'background:rgba(255,255,255,0.94)',
      'color:#222', 'font-size:12px', 'line-height:1.5', 'padding:5px 10px',
      'border-radius:999px', 'cursor:pointer', 'font-family:inherit', 'font-weight:600',
      'box-shadow:0 2px 8px rgba(0,0,0,0.14)', 'opacity:0.92',
      '-webkit-backdrop-filter:blur(6px)', 'backdrop-filter:blur(6px)'
    ].join(';');
    btn.textContent = '\u266B 周杰伦';

    btn.addEventListener('click', function () {
      var frame = el('jay-spotify-frame');
      var open = !(frame && frame.style.display !== 'none');
      setOpen(open, true);
    });

    wrap.appendChild(btn);
    document.body.appendChild(wrap);
    return wrap;
  }

  function ensureFrame() {
    var frame = el('jay-spotify-frame');
    if (frame) return frame;

    var wrap = ensureWrap();

    frame = document.createElement('div');
    frame.id = 'jay-spotify-frame';
    frame.style.cssText = [
      'display:none',
      'width:' + Math.round(W * SCALE) + 'px',
      'height:' + Math.round(H * SCALE) + 'px',
      'border-radius:10px', 'overflow:hidden',
      'box-shadow:0 6px 18px rgba(0,0,0,0.20)', 'background:#fff'
    ].join(';');

    var scaler = document.createElement('div');
    scaler.style.cssText = [
      'width:' + W + 'px', 'height:' + H + 'px',
      'transform:scale(' + SCALE + ')', 'transform-origin:top left'
    ].join(';');

    var iframe = document.createElement('iframe');
    iframe.style.border = '0';
    iframe.style.display = 'block';
    iframe.setAttribute('width', String(W));
    iframe.setAttribute('height', String(H));
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture');
    iframe.setAttribute('loading', 'lazy');
    iframe.src = EMBED;

    scaler.appendChild(iframe);
    frame.appendChild(scaler);
    wrap.appendChild(frame);
    return frame;
  }

  function paint(open) {
    var btn = el('jay-spotify-toggle');
    if (!btn) return;
    btn.textContent = open ? '\u266B 周杰伦 · 收起' : '\u266B 周杰伦';
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function setOpen(open, remember) {
    if (open) {
      var f = ensureFrame();
      f.style.display = 'block';
    } else {
      var cur = el('jay-spotify-frame');
      if (cur) cur.style.display = 'none';
    }
    paint(open);
    if (remember) {
      try { localStorage.setItem(KEY, open ? '1' : '0'); } catch (e) {}
    }
  }

  function init() {
    ensureWrap();

    var legacy = el('spotify-player');
    if (legacy && legacy.querySelector) {
      var old = legacy.querySelector('iframe');
      if (old && old.parentNode) old.parentNode.removeChild(old);
    }

    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    // 默认收起:页面只用一个小胶囊,保持干净(要默认展开就把下一行改成 true)
    setOpen(saved === '1', false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
