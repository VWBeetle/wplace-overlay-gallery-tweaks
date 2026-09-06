// ==UserScript==
// @name         Wplace Overlay Gallery Tweaks
// @namespace    https://github.com/VWBeetle/wplace-overlay-gallery-tweaks
// @version      1.0.0
// @description  Experimental user script to improve the Wplace overlay gallery UX, making it more similar to older versions without removing new features
// @downloadURL  https://raw.githubusercontent.com/vwbeetle/wplace-overlay-gallery-tweaks/main/wplace-overlay-gallery-tweaks.user.js
// @updateURL    https://raw.githubusercontent.com/vwbeetle/wplace-overlay-gallery-tweaks/main/wplace-overlay-gallery-tweaks.user.js
// @match        https://wplace.live/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
  "use strict";
  if (document.getElementById("wptt-compact-style")) return;
  const preference = "wplace-template-tools.compact-progress";
  const layoutPreference = "wplace-template-tools.gallery-layout";
  let compact = true;
  try { compact = localStorage.getItem(layoutPreference) !== "grid"; } catch {}
  let showProgress = false;
  try { showProgress = localStorage.getItem(preference) === "true"; } catch {}
  const style = document.createElement("style");
  style.id = "wptt-compact-style";
  style.textContent = `
    .overlay-gallery-grid[data-wptt-compact] { display:flex!important; flex-direction:column; gap:6px!important; }
    [data-wptt-compact] > [data-overlay-gallery-item] { flex-direction:row!important; align-items:center; border:0!important; box-shadow:none!important; background:transparent!important; border-radius:8px!important; padding:8px 0; gap:8px; }
    [data-wptt-compact] > [data-overlay-gallery-item] > button { display:flex; align-items:center; flex:1; gap:10px; width:auto; min-width:0; }
    [data-wptt-compact] .overlay-gallery-preview { width:64px!important; height:64px!important; min-height:0!important; aspect-ratio:1; flex:0 0 64px; border-radius:10px; overflow:hidden; background-color:color-mix(in srgb,currentColor 5%,transparent)!important; background-image:conic-gradient(color-mix(in srgb,currentColor 12%,transparent) 25%,transparent 0 50%,color-mix(in srgb,currentColor 12%,transparent) 0 75%,transparent 0)!important; background-size:12px 12px!important; }
    [data-wptt-compact] .overlay-gallery-preview > img { padding:0; }
    [data-wptt-compact] p[title] { font-size:14px!important; font-weight:500!important; }
    .overlay-gallery-grid .wptt-native-counts { display:none!important; }
    .overlay-gallery-grid .overlay-gallery-status-badge { display:none!important; }
    .overlay-gallery-grid .overlay-gallery-preview > span { display:none!important; }
    [data-wptt-compact] .overlay-gallery-preview > div,
    [data-wptt-compact] .overlay-gallery-preview > span { display:none!important; }
    [data-wptt-compact] .overlay-gallery-preview + div { flex:1; min-width:0; padding:0!important; }
    [data-wptt-compact] .overlay-gallery-progress-track { margin:5px 0; height:3px; }
    .overlay-gallery-grid[data-progress="false"] .overlay-gallery-progress-track { display:none; }
    .wptt-row-meta { font-family:inherit; font-size:12px; line-height:1.4; opacity:.6; margin:2px 0; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
    .wptt-row-actions { display:flex; flex:0 0 44px; }
    .overlay-gallery-grid:not([data-wptt-compact]) > [data-overlay-gallery-item] { position:relative; }
    .overlay-gallery-grid:not([data-wptt-compact]) .wptt-row-actions { position:absolute; top:6px; right:6px; z-index:1; }
    .overlay-gallery-grid:not([data-wptt-compact]) .wptt-row-actions > button { background:var(--color-base-200,#293140); color:var(--color-base-content,#f1f3f7); box-shadow:0 1px 4px #0003; }
    .overlay-gallery-grid:not([data-wptt-compact]) .wptt-row-meta { white-space:normal; overflow-wrap:anywhere; margin:4px 0 8px; }
    .wptt-row-actions button, .wptt-gallery-options button { border:1px solid currentColor; border-color:color-mix(in srgb,currentColor 20%,transparent); border-radius:6px; padding:5px 9px; font-size:12px; cursor:pointer; background:transparent; }
    .wptt-row-actions > button { display:grid; place-items:center; box-sizing:border-box; flex:0 0 44px; width:44px; height:44px; padding:0; font-size:18px; line-height:1; border:0; border-radius:50%; }
    .wptt-row-actions > button[aria-expanded="true"] { background:color-mix(in srgb,currentColor 7%,transparent); box-shadow:inset 0 0 0 1px #80808025; }
    .wptt-row-menu { position:fixed; inset:auto; margin:0; width:260px; max-width:calc(100vw - 16px); max-height:calc(100dvh - 16px); overflow:auto; padding:8px; border:1px solid #80808020; border-radius:12px; background:var(--color-base-200,#293140); color:var(--color-base-content,#f1f3f7); box-shadow:0 6px 20px #0003; }
    .wptt-row-menu button { display:flex; align-items:center; gap:12px; width:100%; min-height:44px; padding:9px 12px; text-align:left; color:inherit; border:0; font-size:14px; }
    .wptt-row-menu button[data-danger] { color:#ff4f78; }
    .wptt-row-menu svg { width:18px; height:18px; flex-shrink:0; }
    .wptt-row-actions button:hover, .wptt-gallery-options button:hover { filter:brightness(1.2); background-color:color-mix(in srgb,#6853ef 25%,transparent); }
    .wptt-row-actions button:focus-visible, .wptt-gallery-options button:focus-visible { outline:2px solid #9584ff; outline-offset:2px; }
    .wptt-gallery-options { display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:8px; font-size:12px; }
    .wptt-gallery-options label { display:flex; align-items:center; gap:6px; cursor:pointer; }
    .wptt-gallery-options label[hidden] { display:none; }
    .wptt-layout-control { display:flex; flex-shrink:0; padding:3px; border:1px solid #80808040; border-radius:8px; }
    .wptt-layout-control label { position:relative; display:grid; place-items:center; }
    .wptt-layout-control input { position:absolute; opacity:0; width:1px; height:1px; }
    .wptt-layout-control span { display:block; padding:6px 12px; border-radius:5px; }
    .wptt-layout-control input:checked + span { background:#6853ef; color:white; }
    .wptt-layout-control input:focus-visible + span { outline:2px solid #9584ff; outline-offset:2px; }
    /* Keep progress available without making the compact toolbar wider. */
    .overlay-build-hud > .overlay-build-strip > .overlay-build-divider,
    .overlay-build-hud .overlay-build-mobile-head > .overlay-build-refresh-button,
    .overlay-build-hud .overlay-build-mobile-collapsed-progress {
      display:none!important;
    }
    .overlay-build-hud > .overlay-build-strip > .overlay-build-progress {
      display:grid!important;
      grid-template-columns:28px minmax(0, 1fr) 24px!important;
      align-items:center!important;
      gap:8px!important;
      position:absolute!important;
      box-sizing:border-box!important;
      width:min(270px, calc(100vw - 32px))!important;
      height:38px!important;
      min-height:38px!important;
      max-height:38px!important;
      padding:0 9px!important;
      border-radius:10px!important;
      background:var(--wptt-toolbar-surface, var(--color-base-200, #293140))!important;
      box-shadow:0 4px 14px rgba(0, 0, 0, .25)!important;
      pointer-events:auto!important;
      z-index:4!important;
    }
    .overlay-build-hud > .overlay-build-strip > .overlay-build-progress > .overlay-build-progress-copy,
    .overlay-build-hud > .overlay-build-strip > .overlay-build-progress > .overlay-build-progress-refresh {
      display:contents!important;
    }
    .overlay-build-hud > .overlay-build-strip > .overlay-build-progress > .overlay-build-progress-copy > :first-child,
    .overlay-build-hud > .overlay-build-strip > .overlay-build-progress > .overlay-build-progress-refresh > :first-child {
      display:none!important;
    }
    .overlay-build-hud > .overlay-build-strip > .overlay-build-progress > .overlay-build-progress-copy > :last-child {
      grid-column:1!important;
      display:grid!important;
      place-items:center!important;
      align-self:center!important;
      padding:0!important;
      margin:0!important;
      font-size:var(--wptt-toolbar-label-size, 12px)!important;
      line-height:1!important;
      text-align:center!important;
      color:color-mix(in oklab, var(--color-base-content, #f1f3f7) 72%, transparent)!important;
    }
    .overlay-build-hud > .overlay-build-strip > .overlay-build-progress > .overlay-build-progress-track {
      grid-column:2!important;
      align-self:center!important;
      width:100%!important;
      min-width:0!important;
      margin:0!important;
      transform:none!important;
    }
    .overlay-build-hud > .overlay-build-strip > .overlay-build-progress > .overlay-build-progress-refresh > button {
      grid-column:3!important;
      display:grid!important;
      place-items:center!important;
      position:static!important;
      box-sizing:border-box!important;
      width:24px!important;
      height:24px!important;
      min-width:24px!important;
      padding:0!important;
      margin:0!important;
      pointer-events:auto!important;
    }
    /* Fit Wplace's native mobile controls into one compact header. */
    .overlay-build-hud .overlay-build-mobile-head > .overlay-build-back,
    .overlay-build-hud .overlay-build-mobile-head > .overlay-build-mobile-lock {
      display:flex!important;
      position:static!important;
      flex:0 0 30px!important;
      width:30px!important;
      height:30px!important;
      min-width:30px!important;
      border-radius:50%!important;
    }
    .overlay-build-hud .overlay-build-mobile-head > button {
      box-sizing:border-box!important;
      height:30px!important;
      min-height:30px!important;
      max-height:30px!important;
      border:0!important;
      box-shadow:none!important;
    }
    .overlay-build-hud .overlay-build-mobile-head > .overlay-build-tools-button {
      padding-top:0!important;
      padding-bottom:0!important;
    }
    .overlay-build-hud:not(.mobile-collapsed) .overlay-build-mobile-head > button:not([aria-pressed="true"]):not([aria-checked="true"]):not([aria-expanded="true"]):not(.active) {
      background:transparent!important;
    }
    .overlay-build-hud .overlay-build-mobile-head > .overlay-build-mobile-palette,
    .overlay-build-hud .overlay-build-mobile-head > .overlay-build-mobile-collapse {
      border-radius:50%!important;
    }
    .overlay-build-hud .overlay-build-mobile-head > .overlay-build-back {
      color:color-mix(in oklab, var(--color-base-content, #f1f3f7) 72%, transparent)!important;
    }
    .overlay-build-hud .overlay-build-mobile-head > .overlay-build-tools-button[aria-expanded="false"] {
      color:color-mix(in oklab, var(--color-base-content, #f1f3f7) 72%, transparent)!important;
    }
    .overlay-build-hud .overlay-build-mobile-head > .overlay-build-mobile-palette,
    .overlay-build-hud .overlay-build-mobile-head > .overlay-build-mobile-lock {
      transition:none!important;
    }
    .overlay-build-hud .overlay-build-mobile-head > button svg {
      width:16px!important;
      height:16px!important;
    }
    .overlay-build-hud .overlay-build-mobile-head > .wptt-mobile-divider {
      align-self:center;
      flex:0 0 1px;
      width:1px;
      height:18px;
      background:currentColor;
      opacity:.18;
      pointer-events:none;
    }
    .overlay-build-hud:not(.mobile-collapsed) > .overlay-build-mobile-lock,
    .overlay-build-hud.mobile-collapsed .overlay-build-mobile-head > .overlay-build-back {
      display:none!important;
    }
    .overlay-build-hud.mobile-collapsed .wptt-mobile-divider {
      display:none!important;
    }
    /* Give desktop the same compact control treatment and ordering. */
    .overlay-build-strip[data-wptt-desktop-toolbar] {
      align-items:center!important;
      gap:9px!important;
      padding:7px 10px!important;
      overflow:visible!important;
    }
    .overlay-build-strip[data-wptt-desktop-toolbar] > .overlay-build-back {
      display:flex!important;
      position:static!important;
      box-sizing:border-box!important;
      flex:0 0 30px!important;
      width:30px!important;
      height:30px!important;
      min-width:30px!important;
      padding:0!important;
      border:0!important;
      border-radius:50%!important;
      background:transparent!important;
      color:color-mix(in oklab, var(--color-base-content, #f1f3f7) 72%, transparent)!important;
      box-shadow:none!important;
    }
    .overlay-build-strip[data-wptt-desktop-toolbar] > .overlay-build-back svg,
    .overlay-build-strip[data-wptt-desktop-toolbar] > .overlay-build-desktop-palette svg,
    .overlay-build-strip[data-wptt-desktop-toolbar] > .overlay-build-more svg {
      width:16px!important;
      height:16px!important;
    }
    .overlay-build-strip[data-wptt-desktop-toolbar] > .overlay-build-more,
    .overlay-build-strip[data-wptt-desktop-toolbar] > .overlay-build-desktop-palette {
      box-sizing:border-box!important;
      height:30px!important;
      min-height:30px!important;
      max-height:30px!important;
      border:0!important;
      box-shadow:none!important;
    }
    .overlay-build-strip[data-wptt-desktop-toolbar] > .overlay-build-desktop-palette {
      flex:0 0 30px!important;
      width:30px!important;
      min-width:30px!important;
      max-width:30px!important;
      min-height:30px!important;
      max-height:30px!important;
      aspect-ratio:1 / 1!important;
      padding:0!important;
      border-radius:50%!important;
      overflow:hidden!important;
    }
    .overlay-build-strip[data-wptt-desktop-toolbar] > .overlay-build-more[aria-expanded="false"],
    .overlay-build-strip[data-wptt-desktop-toolbar] > .overlay-build-desktop-palette[aria-pressed="false"] {
      background:transparent!important;
      color:color-mix(in oklab, var(--color-base-content, #f1f3f7) 72%, transparent)!important;
    }
    .overlay-build-strip[data-wptt-desktop-toolbar] > .wptt-desktop-divider {
      align-self:center;
      flex:0 0 1px;
      width:1px;
      height:18px;
      background:currentColor;
      opacity:.18;
      pointer-events:none;
    }
    .overlay-build-hud[data-wptt-desktop-toolbar] > .overlay-build-tools-popover {
      top:var(--wptt-desktop-popover-top)!important;
      right:var(--wptt-desktop-popover-right)!important;
      left:auto!important;
      transform:none!important;
      z-index:5!important;
    }
    .overlay-build-strip[data-wptt-desktop-toolbar] > .overlay-build-progress {
      top:calc(100% + 6px)!important;
      right:0!important;
      left:auto!important;
      transform:none!important;
    }
    @media(max-width:900px), (pointer:coarse) {
      /* On mobile this strip only contains the progress summary after Wplace
         moves the palette and Tools controls into the header. */
      .overlay-build-hud > .overlay-build-strip {
        display:block!important;
        position:absolute!important;
        top:0!important;
        right:0!important;
        left:auto!important;
        width:0!important;
        min-width:0!important;
        height:0!important;
        min-height:0!important;
        padding:0!important;
        border:0!important;
        background:transparent!important;
        box-shadow:none!important;
        transform:none!important;
        overflow:visible!important;
        pointer-events:none!important;
        z-index:1!important;
      }
      .overlay-build-hud .overlay-build-mobile-identity {
        display:none!important;
      }
      .overlay-build-hud:not(.mobile-collapsed) > .overlay-build-mobile-head {
        right:0!important;
        left:auto!important;
        width:max-content!important;
        max-width:100%!important;
      }
      .overlay-build-hud .overlay-build-tools-popover {
        top:52px!important;
        right:0!important;
        left:auto!important;
        transform:none!important;
        z-index:10!important;
      }
      .overlay-build-hud > .overlay-build-strip > .overlay-build-progress {
        top:52px!important;
        right:0!important;
        left:auto!important;
        transform:none!important;
      }
      .overlay-build-hud > .overlay-build-strip > .overlay-build-progress > .overlay-build-progress-refresh > button,
      .overlay-build-hud > .overlay-build-strip > .overlay-build-progress > .overlay-build-progress-refresh > button:hover,
      .overlay-build-hud > .overlay-build-strip > .overlay-build-progress > .overlay-build-progress-refresh > button:focus,
      .overlay-build-hud > .overlay-build-strip > .overlay-build-progress > .overlay-build-progress-refresh > button:focus-visible,
      .overlay-build-hud > .overlay-build-strip > .overlay-build-progress > .overlay-build-progress-refresh > button:active {
        border-radius:50%!important;
        background:transparent!important;
        color:color-mix(in oklab, var(--color-base-content, #f1f3f7) 72%, transparent)!important;
        box-shadow:none!important;
        filter:none!important;
        transition:none!important;
        -webkit-tap-highlight-color:transparent!important;
      }
      .overlay-build-hud.mobile-collapsed > .overlay-build-strip > .overlay-build-progress {
        display:none!important;
      }
      /* Keep collapsed controls in the toolbar's rightmost column. */
      .overlay-build-hud.mobile-collapsed > .overlay-build-mobile-collapsed {
        top:7px!important;
        right:10px!important;
        left:auto!important;
        width:30px!important;
        height:30px!important;
        padding:0!important;
        border:0!important;
        border-radius:50%!important;
        background:var(--color-base-200, #293140)!important;
        color:color-mix(in oklab, var(--color-base-content, #f1f3f7) 72%, transparent)!important;
        box-shadow:0 2px 8px rgba(0, 0, 0, .28)!important;
        transition:none!important;
      }
      .overlay-build-hud.mobile-collapsed > .overlay-build-mobile-collapsed svg {
        width:16px!important;
        height:16px!important;
      }
      .overlay-build-hud.mobile-collapsed > .overlay-build-mobile-head {
        top:0!important;
        right:10px!important;
        left:auto!important;
        width:30px!important;
        /* Match the rounded center of Wplace's 45.6px expanded header. */
        height:46px!important;
        padding:0!important;
        border:0!important;
        border-radius:50%!important;
        background:transparent!important;
        box-shadow:none!important;
        overflow:visible!important;
      }
      .overlay-build-hud.mobile-collapsed .overlay-build-mobile-palette {
        position:absolute!important;
        top:45px!important;
        right:0!important;
        left:auto!important;
        width:30px!important;
        height:30px!important;
        min-width:30px!important;
        flex-basis:30px!important;
        border-radius:50%!important;
        box-shadow:0 2px 8px rgba(0, 0, 0, .28)!important;
      }
      .overlay-build-hud.mobile-collapsed .overlay-build-mobile-palette,
      .overlay-build-hud.mobile-collapsed .overlay-build-mobile-head > .overlay-build-mobile-lock {
        background:var(--color-base-200, #293140)!important;
      }
      .overlay-build-hud.mobile-collapsed .overlay-build-mobile-palette[aria-pressed="true"],
      .overlay-build-hud.mobile-collapsed .overlay-build-mobile-head > .overlay-build-mobile-lock[aria-pressed="true"] {
        background:color-mix(in oklab, var(--color-primary, #6853ef) 28%, var(--color-base-200, #293140))!important;
      }
      .overlay-build-hud.mobile-collapsed .overlay-build-mobile-head > .overlay-build-mobile-lock {
        display:flex!important;
        position:absolute!important;
        top:83px!important;
        right:0!important;
        left:auto!important;
        width:30px!important;
        height:30px!important;
        min-width:30px!important;
        border:0!important;
        border-radius:50%!important;
        box-shadow:0 2px 8px rgba(0, 0, 0, .28)!important;
      }
      .overlay-build-hud.mobile-collapsed .overlay-build-mobile-head > .overlay-build-mobile-lock svg {
        width:16px!important;
        height:16px!important;
      }
    }
    @media(max-width:540px) {
      [data-wptt-compact] > [data-overlay-gallery-item] { flex-wrap:nowrap; gap:4px; }
      [data-wptt-compact] .overlay-gallery-preview { width:60px!important; height:60px!important; flex-basis:60px; }
    }
  `;
  document.head.append(style);

  const visible = element => element.getClientRects().length > 0;
  const nativeClicks = new WeakSet();
  const EXPAND_ICON_PATH = "m356-564-56-56 180-180 180 180-56 56-124-124-124 124Zm124 404L300-340l56-56 124 124 124-124 56 56-180 180Z";
  function openDetails(button) {
    nativeClicks.add(button);
    try { button.click(); } finally { nativeClicks.delete(button); }
  }
  const namedButton = (root, name) => [...root.querySelectorAll("button")]
    .find(button => button.textContent.trim() === name && visible(button));

  const desktopToolbarObservers = new WeakMap();
  function positionDesktopPopover(toolbar, strip) {
    if (!toolbar.hasAttribute("data-wptt-desktop-toolbar")) return;
    const toolbarRect = toolbar.getBoundingClientRect();
    const stripRect = strip.getBoundingClientRect();
    toolbar.style.setProperty(
      "--wptt-desktop-popover-right",
      `${Math.max(0, toolbarRect.right - stripRect.right)}px`,
    );
    toolbar.style.setProperty(
      "--wptt-desktop-popover-top",
      `${stripRect.bottom - toolbarRect.top + 6}px`,
    );
  }

  // Follow native navigation rather than accessing Wplace's private app state.
  // Only the panel opened by this action may supply the destination button.
  function navigate(open, heading, action) {
    const before = new Set([...document.querySelectorAll("h2")].filter(visible));
    let timer;
    const observer = new MutationObserver(check);
    function check() {
      const title = [...document.querySelectorAll("h2")].find(element =>
        visible(element) && !before.has(element) && element.textContent.trim() === heading);
      if (!title) return;
      let panel = title.closest(".overlay-detail-header, dialog, [role='dialog']");
      let button;
      while (panel && panel !== document.body) {
        button = namedButton(panel, action);
        if (button || panel.matches("dialog, [role='dialog']")) break;
        panel = panel.parentElement;
      }
      if (!button || button.disabled) return;
      observer.disconnect();
      clearTimeout(timer);
      button.click();
    }
    observer.observe(document.body, { childList:true, subtree:true });
    timer = setTimeout(() => observer.disconnect(), 2000);
    openDetails(open);
    check();
  }

  function refreshPaintUi() {
    for (const toolbar of document.querySelectorAll(".overlay-build-hud")) {
      const mobileHead = toolbar.querySelector(".overlay-build-mobile-head");
      const back = toolbar.querySelector(".overlay-build-back");
      const lock = toolbar.querySelector(".overlay-build-mobile-lock");
      const expand = toolbar.querySelector(":scope > .overlay-build-mobile-collapsed");
      const strip = toolbar.querySelector(".overlay-build-strip");
      const popover = toolbar.querySelector(".overlay-build-tools-popover");

      if (!back || !strip) continue;

      const expandPath = expand?.querySelector("svg path");
      if (expandPath?.getAttribute("d") !== EXPAND_ICON_PATH) {
        expandPath?.setAttribute("d", EXPAND_ICON_PATH);
      }

      const isMobileToolbar = matchMedia(
        "(max-width: 900px), (pointer: coarse)",
      ).matches;
      const surfaceSource = isMobileToolbar && mobileHead
        && !toolbar.classList.contains("mobile-collapsed")
        ? mobileHead
        : strip;
      let toolbarSurface = getComputedStyle(surfaceSource).backgroundColor;
      if (toolbarSurface === "rgba(0, 0, 0, 0)" && surfaceSource !== strip) {
        toolbarSurface = getComputedStyle(strip).backgroundColor;
      }
      if (toolbarSurface && toolbarSurface !== "rgba(0, 0, 0, 0)") {
        toolbar.style.setProperty("--wptt-toolbar-surface", toolbarSurface);
      }
      if (isMobileToolbar && mobileHead && back && lock) {
        delete strip.dataset.wpttDesktopToolbar;
        delete toolbar.dataset.wpttDesktopToolbar;
        toolbar.style.removeProperty("--wptt-desktop-popover-right");
        toolbar.style.removeProperty("--wptt-desktop-popover-top");
        if (popover && popover.parentElement !== toolbar) {
          toolbar.insertBefore(popover, strip);
        }
        if (back.parentElement !== mobileHead) mobileHead.prepend(back);
        let divider = mobileHead.querySelector(".wptt-mobile-divider");
        if (!divider) {
          divider = document.createElement("span");
          divider.className = "wptt-mobile-divider";
          divider.setAttribute("role", "separator");
          divider.setAttribute("aria-orientation", "vertical");
          back.after(divider);
        }
        const tools = mobileHead.querySelector(".overlay-build-tools-button");
        if (tools) {
          toolbar.style.setProperty(
            "--wptt-toolbar-label-size",
            getComputedStyle(tools).fontSize,
          );
        }
        const colorFilter = mobileHead.querySelector(
          ".overlay-build-mobile-palette",
        );
        const collapse = mobileHead.querySelector(
          ".overlay-build-mobile-collapse",
        );
        if (lock.parentElement !== mobileHead) {
          mobileHead.append(lock);
        }

        const desiredOrder = [
          back,
          divider,
          tools,
          colorFilter,
          lock,
          collapse,
        ].filter(Boolean);
        const currentOrder = [...mobileHead.children].filter(element =>
          desiredOrder.includes(element),
        );
        if (desiredOrder.some((element, index) => currentOrder[index] !== element)) {
          mobileHead.append(...desiredOrder);
        }
      } else if (!isMobileToolbar) {
        strip.dataset.wpttDesktopToolbar = "";
        toolbar.dataset.wpttDesktopToolbar = "";
        if (back.parentElement !== strip) strip.prepend(back);

        let divider = strip.querySelector(":scope > .wptt-desktop-divider");
        if (!divider) {
          divider = document.createElement("span");
          divider.className = "wptt-desktop-divider";
          divider.setAttribute("role", "separator");
          divider.setAttribute("aria-orientation", "vertical");
          back.after(divider);
        }

        const moreTools = strip.querySelector(":scope > .overlay-build-more");
        if (moreTools) {
          toolbar.style.setProperty(
            "--wptt-toolbar-label-size",
            getComputedStyle(moreTools).fontSize,
          );
        }
        const opacity = strip.querySelector(":scope > .overlay-build-opacity");
        const colorFilter = strip.querySelector(
          ":scope > .overlay-build-desktop-palette",
        );
        if (popover && popover.parentElement !== toolbar) {
          toolbar.insertBefore(popover, strip);
        }

        const desiredOrder = [
          back,
          divider,
          moreTools,
          opacity,
          colorFilter,
        ].filter(Boolean);
        const currentOrder = [...strip.children].filter(element =>
          desiredOrder.includes(element),
        );
        if (desiredOrder.some((element, index) => currentOrder[index] !== element)) {
          strip.append(...desiredOrder);
        }
        positionDesktopPopover(toolbar, strip);
        if (!desktopToolbarObservers.has(strip)) {
          const resizeObserver = new ResizeObserver(() => {
            positionDesktopPopover(toolbar, strip);
          });
          resizeObserver.observe(toolbar);
          resizeObserver.observe(strip);
          desktopToolbarObservers.set(strip, resizeObserver);
        }
      }
    }
  }

  let layoutControlId = 0;
  function refresh() {
    refreshPaintUi();
    for (const gallery of document.querySelectorAll(".overlay-gallery-grid[role='list']")) {
      if (compact) gallery.dataset.wpttCompact = "";
      else delete gallery.dataset.wpttCompact;
      gallery.dataset.progress = String(showProgress);
      if (!gallery.previousElementSibling?.classList.contains("wptt-gallery-options")) {
        const options = document.createElement("div");
        options.className = "wptt-gallery-options";
        const label = document.createElement("label");
        const toggle = document.createElement("input");
        toggle.type = "checkbox";
        toggle.checked = showProgress;
        toggle.addEventListener("change", () => {
          showProgress = toggle.checked;
          try { localStorage.setItem(preference, String(showProgress)); } catch {}
          refresh();
        });
        label.append(toggle, "Show progress bars");
        const layout = document.createElement("div");
        layout.className = "wptt-layout-control";
        layout.setAttribute("role", "radiogroup");
        layout.setAttribute("aria-label", "Gallery layout");
        const groupName = `wptt-layout-${++layoutControlId}`;
        for (const mode of ["list", "grid"]) {
          const choice = document.createElement("label");
          const radio = document.createElement("input");
          radio.type = "radio";
          radio.name = groupName;
          radio.value = mode;
          const caption = document.createElement("span");
          caption.textContent = mode === "list" ? "List" : "Grid";
          radio.addEventListener("change", () => {
            if (!radio.checked) return;
            for (const menu of document.querySelectorAll(".wptt-row-menu:popover-open")) menu.hidePopover();
            compact = mode === "list";
            try { localStorage.setItem(layoutPreference, mode); } catch {}
            refresh();
          });
          choice.append(radio, caption);
          layout.append(choice);
        }
        options.append(layout, label);
        gallery.before(options);
      }
      const options = gallery.previousElementSibling;
      for (const radio of options.querySelectorAll("input[type='radio']")) {
        radio.checked = radio.value === (compact ? "list" : "grid");
      }
      options.querySelector("input[type='checkbox']").checked = showProgress;
      for (const row of gallery.querySelectorAll(":scope > [data-overlay-gallery-item]")) {
        const open = row.querySelector(":scope > button");
        const preview = open?.querySelector(".overlay-gallery-preview");
        const name = open?.querySelector("p[title]");
        if (!open || !preview || !name) continue;
        const details = preview.nextElementSibling;
        if (!details) continue;
        let meta = details.querySelector(".wptt-row-meta");
        if (!meta) {
          meta = document.createElement("div");
          meta.className = "wptt-row-meta";
          details.firstElementChild?.after(meta);
        }
        const dimensions = preview.querySelector(":scope > span")?.textContent.trim() || "";
        const badges = [...preview.querySelectorAll(".overlay-gallery-status-badge")]
          .map(badge => badge.textContent.trim().replace(/% OFF$/, "% wrong color"));
        const progress = details.querySelector("[role='progressbar']");
        const counts = progress?.nextElementSibling;
        if (counts) counts.classList.add("wptt-native-counts");
        const percent = progress?.getAttribute("aria-valuenow");
        const progressLabel = progress?.getAttribute("aria-label") || "";
        const pixelCounts = progressLabel.match(/([\d,]+) completed,\s*([\d,]+) unpainted,\s*([\d,]+) mismatched/);
        let pixelReadout = "";
        if (pixelCounts) {
          const [completed, unpainted, mismatched] = pixelCounts.slice(1)
            .map(value => Number(value.replaceAll(",", "")));
          pixelReadout = ` (${completed}/${completed + unpainted + mismatched} pixels)`;
        }
        const text = [dimensions, percent != null ? `${percent}% complete${pixelReadout}` : "Progress unavailable"].filter(Boolean).join(" · ");
        if (meta.textContent !== text) meta.textContent = text;
        meta.title = [text, progress?.getAttribute("aria-label"), ...badges].filter(Boolean).join(" · ");
        if (row.querySelector(".wptt-row-actions")) continue;
        const actions = document.createElement("div");
        actions.className = "wptt-row-actions";
        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.textContent = "⋮";
        trigger.setAttribute("aria-label", "Template options");
        trigger.setAttribute("aria-expanded", "false");
        const menu = document.createElement("div");
        menu.className = "wptt-row-menu";
        menu.setAttribute("popover", "auto");
        // A native invoker prevents light-dismiss from closing the menu before
        // the same click toggles it, which otherwise immediately reopens it.
        trigger.popoverTargetElement = menu;
        trigger.popoverTargetAction = "toggle";
        trigger.addEventListener("click", event => event.stopPropagation());
        menu.addEventListener("toggle", event => {
          trigger.setAttribute("aria-expanded", String(event.newState === "open"));
          if (event.newState !== "open") return;
          const rect = trigger.getBoundingClientRect();
          menu.style.left = `${Math.max(8, Math.min(rect.right - menu.offsetWidth, innerWidth - menu.offsetWidth - 8))}px`;
          menu.style.top = `${Math.max(8, Math.min(rect.bottom + 4, innerHeight - menu.offsetHeight - 8))}px`;
          menu.querySelector("button").focus();
        });
        // Official Heroicons Outline SVGs: https://heroicons.com/ (MIT).
        const icons = {"pixels":[["path",{"stroke-linecap":"round","stroke-linejoin":"round","d":"M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"}]],"placement":[["path",{"stroke-linecap":"round","stroke-linejoin":"round","d":"M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"}],["path",{"stroke-linecap":"round","stroke-linejoin":"round","d":"M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"}]],"details":[["path",{"stroke-linecap":"round","stroke-linejoin":"round","d":"m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"}]],"delete":[["path",{"stroke-linecap":"round","stroke-linejoin":"round","d":"m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"}]]};
        for (const [label, destination, icon] of [
          ["Edit placement", "Place on map", "placement"],
          ["Edit pixels", "Edit pixels", "pixels"],
          ["Details", null, "details"],
          ["Delete", "Delete overlay", "delete"],
        ]) {
          const button = document.createElement("button");
          button.type = "button";
          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.setAttribute("viewBox", "0 0 24 24");
          svg.setAttribute("fill", "none");
          svg.setAttribute("stroke", "currentColor");
          svg.setAttribute("stroke-width", "1.5");
          svg.setAttribute("stroke-linecap", "round");
          svg.setAttribute("stroke-linejoin", "round");
          svg.setAttribute("aria-hidden", "true");
          for (const [tag, attributes] of icons[icon]) {
            const shape = document.createElementNS(svg.namespaceURI, tag);
            for (const [key, value] of Object.entries(attributes)) shape.setAttribute(key, String(value));
            svg.append(shape);
          }
          button.append(svg, label);
          if (icon === "delete") button.dataset.danger = "";
          button.addEventListener("click", event => {
            event.stopPropagation();
            menu.hidePopover();
            if (destination) navigate(open, name.textContent.trim(), destination);
            else openDetails(open);
          });
          menu.append(button);
        }
        actions.append(trigger, menu);
        row.append(actions);
        row.addEventListener("click", event => {
          if (nativeClicks.has(open) || actions.contains(event.target)) return;
          if (event.target.closest("button, a, input") && !open.contains(event.target)) return;
          event.preventDefault();
          event.stopImmediatePropagation();
          navigate(open, name.textContent.trim(), "Paint");
        }, true);
      }
    }
  }
  let scheduled = false;
  new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { scheduled = false; refresh(); });
  }).observe(document.body, {
    childList:true,
    subtree:true,
    characterData:true,
  });
  refresh();
})();

/* Bundled Heroicons license
MIT License

Copyright (c) Tailwind Labs, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

