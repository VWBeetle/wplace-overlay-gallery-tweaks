// ==UserScript==
// @name         Wplace Overlay Gallery Tweaks
// @namespace    https://github.com/VWBeetle/wplace-overlay-gallery-tweaks
// @version      1.1.0
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
    @media(max-width:540px) {
      [data-wptt-compact] > [data-overlay-gallery-item] { flex-wrap:nowrap; gap:4px; }
      [data-wptt-compact] .overlay-gallery-preview { width:60px!important; height:60px!important; flex-basis:60px; }
    }
  `;
  document.head.append(style);

  const visible = element => element.getClientRects().length > 0;
  const nativeClicks = new WeakSet();
  function openDetails(button) {
    nativeClicks.add(button);
    try { button.click(); } finally { nativeClicks.delete(button); }
  }
  const namedButton = (root, name) => [...root.querySelectorAll("button")]
    .find(button => button.textContent.trim() === name && visible(button));

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

  let layoutControlId = 0;
  function refresh() {
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
  }).observe(document.body, {childList:true, subtree:true, characterData:true});
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
