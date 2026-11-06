/* ===========================================================
   《信息系统分析与设计》配套数字教材 · 交互脚本
   功能：术语浮窗 / 进度跟踪 / 标记已读 / 导出PDF
   =========================================================== */
(function(){
  "use strict";

  /* ---------- 1. 进度跟踪（localStorage） ---------- */
  var TOTAL = 9;
  function key(ch){ return "isad_dt_ch" + ch + "_read"; }
  function showStorageError(error){
    if(!error || (error.name !== "SecurityError" && error.name !== "QuotaExceededError")) throw error;
    var txt = document.getElementById("progress-txt");
    if(txt) txt.textContent = "无法访问本地学习进度（浏览器存储受限），请检查浏览器设置后重试。";
    var btn = document.getElementById("markRead");
    if(btn){
      btn.textContent = "本地进度不可用";
      btn.setAttribute("aria-label", "无法访问本地学习进度，请检查浏览器设置后重试");
      btn.setAttribute("aria-live", "polite");
      btn.disabled = true;
    }
    return false;
  }
  function isRead(ch){
    try { return localStorage.getItem(key(ch)) === "1"; }
    catch(error){ showStorageError(error); return null; }
  }
  function setRead(ch, v){
    try { localStorage.setItem(key(ch), v ? "1" : "0"); return true; }
    catch(error){ return showStorageError(error); }
  }

  function renderIndexProgress(){
    var bar = document.getElementById("progress-fill");
    var txt = document.getElementById("progress-txt");
    if(!bar) return;
    var n = 0;
    for(var i=1;i<=TOTAL;i++){
      var read = isRead(i);
      if(read === null) return;
      if(read) n++;
    }
    var pct = Math.round(n/TOTAL*100);
    bar.style.width = pct + "%";
    bar.setAttribute("aria-valuenow", pct);
    if(txt) txt.textContent = "已读 " + n + " / " + TOTAL + " 章（" + pct + "%）";
  }

  /* ---------- 2. 标记本章已读 ---------- */
  function wireMarkRead(){
    var btn = document.getElementById("markRead");
    if(!btn) return;
    var ch = btn.getAttribute("data-ch");
    function sync(){
      var dot = document.getElementById("readDot");
      var read = isRead(ch);
      btn.disabled = read === null;
      if(read === null) return;
      btn.textContent = read ? "✓ 已标记为已读" : "标记为已读";
      btn.classList.toggle("ghost", read);
      btn.setAttribute("aria-pressed", String(read));
      if(dot) dot.classList.toggle("on", read);
    }
    sync();
    btn.addEventListener("click", function(){
      var read = isRead(ch);
      if(read === null || !setRead(ch, !read)) return;
      sync();
      renderIndexProgress();
    });
  }

  /* ---------- 3. 术语浮窗 ---------- */
  function wireTerms(){
    var tip = document.getElementById("termtip");
    if(!tip) return;
    tip.setAttribute("role", "tooltip");
    Array.prototype.forEach.call(document.querySelectorAll(".term"), function(t){
      if(!t.hasAttribute("tabindex")) t.tabIndex = 0;
    });
    function show(t){
      if(!t) return;
      if(!t.hasAttribute("tabindex")) t.tabIndex = 0;
      var describedBy = (t.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean);
      if(describedBy.indexOf("termtip") === -1) describedBy.push("termtip");
      t.setAttribute("aria-describedby", describedBy.join(" "));
      tip.textContent = t.getAttribute("data-def") || "";
      tip.style.display = "block";
      var r = t.getBoundingClientRect();
      var x = Math.min(Math.max(8, r.left), window.innerWidth - tip.offsetWidth - 8);
      var y = r.bottom + 8;
      if(y + tip.offsetHeight > window.innerHeight) y = r.top - tip.offsetHeight - 8;
      y = Math.max(8, Math.min(y, window.innerHeight - tip.offsetHeight - 8));
      tip.style.left = x + "px";
      tip.style.top = y + "px";
    }
    function termFromEvent(e){ return e.target.closest && e.target.closest(".term"); }
    document.addEventListener("mouseover", function(e){
      var t = termFromEvent(e);
      if(t && !t.contains(e.relatedTarget)) show(t);
    });
    document.addEventListener("mouseout", function(e){
      var t = termFromEvent(e);
      if(t && !t.contains(e.relatedTarget)) tip.style.display = "none";
    });
    document.addEventListener("focusin", function(e){ show(termFromEvent(e)); });
    document.addEventListener("focusout", function(e){
      var t = termFromEvent(e);
      if(t && !t.contains(e.relatedTarget)) tip.style.display = "none";
    });
  }

  /* ---------- 5. 导出 PDF（调用浏览器打印） ---------- */
  function wirePrint(){
    var b = document.getElementById("exportPdf");
    if(b) b.addEventListener("click", function(){ window.print(); });
  }

  document.addEventListener("DOMContentLoaded", function(){
    renderIndexProgress();
    wireMarkRead();
    wireTerms();
    wirePrint();
  });
})();


/* ---------- 6. 原版课件对照：内嵌轮播 + 灯箱（渐进增强） ---------- */
(function(){
  "use strict";

  var lb, lbImg, lbCount, lbPrev, lbNext, lbState = null;

  /* ---- 灯箱（沿用 #pptLightbox 全屏遮罩，增加前后翻页与页码） ---- */
  function ensureBox(){
    if(lb) return lb;
    lb = document.createElement("div");
    lb.id = "pptLightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "课件图片浏览");
    lb.tabIndex = -1;
    lb.innerHTML =
      '<span class="lb-count"></span>' +
      '<button class="lb-nav lb-prev" type="button" aria-label="上一页">\u2039</button>' +
      '<img alt="放大查看">' +
      '<button class="lb-nav lb-next" type="button" aria-label="下一页">\u203a</button>';
    document.body.appendChild(lb);
    lbImg   = lb.querySelector("img");
    lbCount = lb.querySelector(".lb-count");
    lbPrev  = lb.querySelector(".lb-prev");
    lbNext  = lb.querySelector(".lb-next");
    lb.addEventListener("click", function(e){ if(e.target === lbPrev || e.target === lbNext) return; close(); });
    lbPrev.addEventListener("click", function(e){ e.stopPropagation(); nav(-1); });
    lbNext.addEventListener("click", function(e){ e.stopPropagation(); nav(1); });
    return lb;
  }
  function sync(){
    if(!lbState) return;
    var st = lbState.gallery.__ppt;
    lbImg.src = st.slides[lbState.index].getAttribute("src");
    lbImg.alt = st.slides[lbState.index].getAttribute("alt") || "放大查看课件图片";
    lbCount.textContent = (lbState.index + 1) + " / " + st.total;
  }
  var previousFocus = null;
  function openLightbox(gallery, index){
    ensureBox();
    previousFocus = document.activeElement;
    lbState = {gallery:gallery, index:index};
    sync();
    lb.style.display = "flex";
    lb.focus();
  }
  function nav(d){
    if(!lbState) return;
    var st = lbState.gallery.__ppt;
    var n = lbState.index + d;
    if(n < 0 || n >= st.total) return;
    lbState.index = n;
    st.go(n);            /* 主图与灯箱同步 */
  }
  function close(){
    lb.style.display = "none";
    lbState = null;
    if(previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
    previousFocus = null;
  }
  window.__pptSyncLightbox = function(gallery, idx){
    if(lbState && lbState.gallery === gallery){ lbState.index = idx; sync(); }
  };
  document.addEventListener("keydown", function(e){
    if(!lbState) return;
    if(e.key === "ArrowLeft"){ nav(-1); }
    else if(e.key === "ArrowRight"){ nav(1); }
    else if(e.key === "Escape"){ close(); }
    else if(e.key === "Tab"){
      if(document.activeElement === lb){
        e.preventDefault();
        (e.shiftKey ? lbNext : lbPrev).focus();
      }else if(e.shiftKey && document.activeElement === lbPrev){
        e.preventDefault();
        lbNext.focus();
      }else if(!e.shiftKey && document.activeElement === lbNext){
        e.preventDefault();
        lbPrev.focus();
      }
    }
  });

  /* ---- 把每个 .ppt-gallery 就地升级为「单页大图 + 左右箭头」轮播 ---- */
  function buildCarousel(gallery){
    if(gallery.classList.contains("ppt-enhanced")) return;      /* 幂等 */
    var imgs = Array.prototype.slice.call(gallery.querySelectorAll("figure img"));
    if(imgs.length < 1) return;
    if(imgs.length === 1){
      gallery.classList.add("ppt-single");
      gallery.__ppt = {go:function(){}, total:1, slides:imgs};
      imgs[0].setAttribute("tabindex", "0");
      imgs[0].setAttribute("role", "button");
      var alt = imgs[0].getAttribute("alt");
      imgs[0].setAttribute("aria-label", alt ? "放大查看：" + alt : "放大查看课件图片");
      imgs[0].addEventListener("click", function(){ openLightbox(gallery, 0); });
      imgs[0].addEventListener("keydown", function(e){
        if(e.key === "Enter" || e.key === " "){
          e.preventDefault();
          openLightbox(gallery, 0);
        }
      });
      return;
    }
    gallery.classList.add("ppt-enhanced");

    var wrap = document.createElement("div");
    wrap.className = "ppt-carousel";
    wrap.tabIndex = 0;
    wrap.setAttribute("role", "region");
    wrap.setAttribute("aria-roledescription", "轮播");
    wrap.setAttribute("aria-label", "课件轮播，共 " + imgs.length + " 页");
    wrap.innerHTML =
      '<div class="ppt-stage">' +
        '<img class="ppt-current" alt="">' +
        '<button class="ppt-zoombtn" type="button">放大</button>' +
        '<span class="ppt-count" role="status" aria-live="polite" aria-atomic="true"></span>' +
        '<button class="ppt-nav ppt-prev" type="button" aria-label="上一页">\u2039</button>' +
        '<button class="ppt-nav ppt-next" type="button" aria-label="下一页">\u203a</button>' +
      '</div>' +
      '<div class="ppt-bar">' +
        '<button class="ppt-first" type="button">\u00ab 首页</button>' +
        '<button class="ppt-previous" type="button">\u2039 上一页</button>' +
        '<input class="ppt-jump" type="number" min="1" value="1" aria-label="跳转到页码">' +
        '<span class="ppt-total"></span>' +
        '<button class="ppt-nextb" type="button">下一页 \u203a</button>' +
        '<button class="ppt-last" type="button">末页 \u00bb</button>' +
      '</div>';
    gallery.insertBefore(wrap, gallery.firstChild);

    var cur   = wrap.querySelector(".ppt-current");
    var count = wrap.querySelector(".ppt-count");
    var total = wrap.querySelector(".ppt-total");
    var jump  = wrap.querySelector(".ppt-jump");
    var N = imgs.length, idx = 0;
    total.textContent = "/ " + N;
    jump.max = N;

    var prevBtns = [wrap.querySelector(".ppt-prev"), wrap.querySelector(".ppt-previous"), wrap.querySelector(".ppt-first")];
    var nextBtns = [wrap.querySelector(".ppt-next"), wrap.querySelector(".ppt-nextb"), wrap.querySelector(".ppt-last")];

    function render(){
      cur.setAttribute("src", imgs[idx].getAttribute("src"));
      cur.setAttribute("alt", imgs[idx].getAttribute("alt") || "");
      count.textContent = (idx + 1) + " / " + N;
      jump.value = idx + 1;
      prevBtns.forEach(function(b){ b.disabled = (idx === 0); });
      nextBtns.forEach(function(b){ b.disabled = (idx === N - 1); });
      if(window.__pptSyncLightbox) window.__pptSyncLightbox(gallery, idx);
    }
    function go(n){ idx = Math.max(0, Math.min(N - 1, n)); render(); }
    gallery.__ppt = {go: go, total: N, slides: imgs};

    wrap.querySelector(".ppt-prev").addEventListener("click", function(e){ e.stopPropagation(); go(idx - 1); });
    wrap.querySelector(".ppt-previous").addEventListener("click", function(e){ e.stopPropagation(); go(idx - 1); });
    wrap.querySelector(".ppt-next").addEventListener("click", function(e){ e.stopPropagation(); go(idx + 1); });
    wrap.querySelector(".ppt-nextb").addEventListener("click", function(e){ e.stopPropagation(); go(idx + 1); });
    wrap.querySelector(".ppt-first").addEventListener("click", function(e){ e.stopPropagation(); go(0); });
    wrap.querySelector(".ppt-last").addEventListener("click", function(e){ e.stopPropagation(); go(N - 1); });
    jump.addEventListener("change", function(){ var v = parseInt(jump.value, 10); go(isNaN(v) ? idx : v - 1); });
    jump.addEventListener("keydown", function(e){ if(e.key === "Enter"){ e.preventDefault(); var v = parseInt(jump.value, 10); go(isNaN(v) ? idx : v - 1); } });

    cur.addEventListener("click", function(){ openLightbox(gallery, idx); });
    wrap.querySelector(".ppt-zoombtn").addEventListener("click", function(e){ e.stopPropagation(); openLightbox(gallery, idx); });

    wrap.addEventListener("keydown", function(e){
      if(e.target !== wrap) return;
      if(e.key === "ArrowLeft"){ e.preventDefault(); go(idx - 1); }
      else if(e.key === "ArrowRight"){ e.preventDefault(); go(idx + 1); }
    });

    var x0 = null;
    wrap.addEventListener("touchstart", function(e){ x0 = e.touches.length === 1 ? e.touches[0].clientX : null; }, {passive:true});
    wrap.addEventListener("touchend", function(e){
      if(x0 === null || !e.changedTouches.length) return;
      var dx = e.changedTouches[0].clientX - x0;
      if(Math.abs(dx) > 40){ go(dx < 0 ? idx + 1 : idx - 1); }
      x0 = null;
    }, {passive:true});
    wrap.addEventListener("touchcancel", function(){ x0 = null; }, {passive:true});

    render();
  }

  document.addEventListener("DOMContentLoaded", function(){
    var gs = document.querySelectorAll(".ppt-gallery, .pptgrid");
    for(var i = 0; i < gs.length; i++) buildCarousel(gs[i]);
  });
})();
