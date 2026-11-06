/* PULP FUSION — install plumbing, shared by index.html + pulp-fusion.html
   Expects (optional) markup:
     <a id="installBtn" href="#">⤓ INSTALL</a>
     <div id="installHint"></div>
   Behavior:
     - registers the service worker on http(s) only (silent no-op on file://)
     - shows the pill when Chrome fires beforeinstallprompt
     - after a few seconds WITHOUT the event, shows platform-correct fallback
       instructions (iOS never fires the event — Share menu is the only way)
     - hides itself in standalone mode (already installed)                      */
(function () {
  'use strict';

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }

  const pill = document.getElementById('installBtn');
  const hint = document.getElementById('installHint');
  const standalone = matchMedia('(display-mode: standalone)').matches ||
                     navigator.standalone === true;

  // already running as the installed app — no install UI needed
  if (standalone) {
    if (pill) pill.remove();
    if (hint) hint.remove();
    return;
  }
  if (pill) {
    // same markup is tolerated without any value; only really an issue for anchors
    if (!pill.getAttribute('href') || pill.getAttribute('href') === '#') {
      pill.removeAttribute('href');
      pill.style.cursor = 'pointer';
    }
  }

  let deferred = null;
  let fired = false;

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferred = e; fired = true;
    if (pill) { pill.classList.add('show'); }
    if (hint) { hint.textContent = 'ONE TAP & THE CRATE LIVES ON YOUR HOME SCREEN'; }
  });

  window.addEventListener('appinstalled', () => {
    if (pill) pill.remove();
    if (hint) hint.textContent = '★ INSTALLED — LOOK FOR THE CHERRY ON YOUR HOME SCREEN';
  });

  if (pill) {
    pill.addEventListener('click', async e => {
      e.preventDefault();
      if (!deferred) return;
      deferred.prompt();
      try { await deferred.userChoice; } catch (err) {}
      deferred = null;
    });
  }

  // adaptive fallback instructions when the native prompt isn't coming
  setTimeout(() => {
    if (fired || standalone || window.matchMedia === undefined) return;
    if (!hint) return;
    const ua = navigator.userAgent;
    const isIOS = /iP(hone|ad|od)/.test(ua) ||
      (/Macintosh/.test(ua) && 'ontouchend' in document);
    const isAndroid = /Android/.test(ua);

    if (isIOS && !/CriOS|FxiOS|EdgiOS/.test(ua)) {
      hint.innerHTML = 'ON iPHONE SAFARI: NO POPUP EXISTS —<br>TAP <b>SHARE</b> □↑ THEN <b>ADD TO HOME SCREEN</b>';
      if (pill) pill.classList.add('IOS_HIDDEN'); // Chrome pill can't work on iOS Safari; keep visual consistent though
      pill.style.display = 'none';
    } else if (isAndroid) {
      hint.innerHTML = 'NO POPUP YET? OPEN THE <b>⋮ MENU</b> → <b>INSTALL APP / ADD TO HOME SCREEN</b><br><span style="opacity:.7">(sometimes Chrome waits for a second visit — browse &amp; come back)</span>';
    } else {
      hint.innerHTML = 'LOOK FOR THE <b>INSTALL ICON</b> AT THE RIGHT END OF THE ADDRESS BAR';
    }
  }, 5000);
})();
