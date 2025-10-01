// assets/js/ui/shareui.js
// Shark DEV — Patch mínimo (hidratação segura + comissão marcada)
// Foco: não apagar stakes após compartilhar e marcar comissão no carregamento do link.

(() => {
  const NS = 'shareui.js';
  const log  = (...a) => console.log(`${NS}:`, ...a);
  const ok   = (m) => console.log(`${NS}: ✅ ${m}`);
  const info = (m) => console.log(`${NS}: ⚙️ ${m}`);
  const warn = (m) => console.warn(`${NS}: ⚠️ ${m}`);
  const step = (m) => console.log(`${NS}: 📝 ${m}`);
  const sub  = (m) => console.log(`${NS}:   ${m}`);

  // -----------------------------
  // PROTEÇÃO DE HIDRATAÇÃO (LOCK)
  // -----------------------------
  window.__SHAREUI_HYDRATING = window.__SHAREUI_HYDRATING || false;
  function withHydration(run) {
    const prev = window.__SHAREUI_HYDRATING;
    window.__SHAREUI_HYDRATING = true;
    try { run(); } finally { window.__SHAREUI_HYDRATING = prev; }
  }
  // Silencia funções globais de limpeza/recalculo enquanto hidratamos (se existirem)
  ['clearStakes','resetCasa','normalizeForm','recalculateAll'].forEach(fn => {
    if (typeof window[fn] === 'function' && !window[fn].__shareuiPatched) {
      const orig = window[fn];
      window[fn] = function(...args) {
        if (window.__SHAREUI_HYDRATING) return;     // não roda durante a hidratação
        return orig.apply(this, args);
      };
      window[fn].__shareuiPatched = true;
      log(`🔧 monkey-patch em ${fn}()`);
    }
  });

  // -----------------------------
  // HELPERS DE DOM
  // -----------------------------
  const q  = (sel, root=document) => root.querySelector(sel);
  function setVal(el, value) {
    if (!el) return false;
    const v = value == null ? '' : String(value);
    if (el.value !== v) el.value = v;
    el.dispatchEvent(new Event('input',  { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }
  function clickToggle(el, on) {
    if (!el) return;
    const active = el.classList?.contains('active')
               || el.getAttribute?.('aria-pressed') === 'true'
               || (el.type === 'checkbox' && el.checked === true);
    if (on && !active) el.click();
    if (!on && active) el.click();
  }

  // -----------------------------
  // PARSE DO ESTADO (?s=...)
  // -----------------------------
  function decodeShared() {
    try {
      const sp = new URLSearchParams(location.search);
      const s  = sp.get('s');
      if (!s) return null;
      const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
      const json = atob(b64);
      return JSON.parse(json);
    } catch (e) {
      warn(`Falha ao decodificar estado: ${e.message}`);
      return null;
    }
  }
  function cleanURL() {
    try {
      const u = new URL(location.href);
      if (u.searchParams.has('s')) {
        u.searchParams.delete('s');
        history.replaceState({}, '', u.toString());
        log('🧹 URL limpa');
      }
    } catch {}
  }

  // -----------------------------
  // APPLY: ARBIPRO
  // Estrutura esperada:
  // { t:'arbipro', n:2, r:0.01, h:[ {o,s,c,f,i,l,x}, {o,s,c,f,i,l,x} ] }
  // o=odd, s=stake, c=comissão, f=freebet(1/0), l=toggle comissão(1/0), x=fix-stake(1/0)
  // -----------------------------
  function applyCasa(index, casa) {
    log(`🏠 Carregando Casa ${index}:`, casa);

    const rootSel = `[data-casa="${index}"]`;
    const root = q(rootSel) || document;

    // Seletores do teu projeto (conforme logs). Pode manter assim.
    const sel = {
      odd:    `${rootSel} .odd-input, ${rootSel} [data-role="odd"]`,
      stake:  `${rootSel} .stake-input, ${rootSel} [data-role="stake"]`,
      fix:    `${rootSel} [data-action="fix-stake"]`,
      free:   `${rootSel} [data-action="toggle-freebet"]`,
      comTg:  `${rootSel} [data-action="toggle-comissao"], ${rootSel} .toggle-comissao`,
      comInp: `${rootSel} .comissao-input, ${rootSel} [data-role="comissao"]`,
    };

    // 1) Freebet
    if (typeof casa.f !== 'undefined') {
      const fb = q(sel.free);
      if (fb) {
        sub(`└─ ${casa.f ? 'Ativando' : 'Desativando'} freebet`);
        clickToggle(fb, !!casa.f);
      }
    }

    // 2) FIXAR ANTES de setar stake
    const shouldFix = !!casa.x || (!!casa.s && String(casa.s).trim() !== '');
    const fix = q(sel.fix);
    if (shouldFix && fix) {
      sub('└─ Fixando stake');
      clickToggle(fix, true);
    }

    // 3) Odd
    step('Etapa 1: Preenchendo ODD...');
    const oddEl = q(sel.odd);
    if (oddEl && setVal(oddEl, casa.o)) sub(`✓ Odd: ${casa.o}`);
    else warn(`Elemento não encontrado: ${sel.odd} (odd casa ${index})`);

    // 4) Stake
    step('Etapa 2: Preenchendo STAKE (se necessário)...');
    const stakeEl = q(sel.stake);
    if (shouldFix) {
      if (stakeEl && setVal(stakeEl, casa.s)) sub(`✓ Stake: ${casa.s}`);
      step('Etapa 3: Fixando (reforço)');
    } else {
      sub('⏭️ Stake não será preenchida (casa não fixada)');
    }

    // 5) Comissão: toggle + valor
    const comEnabled = !!casa.l || (casa.c != null && String(casa.c).trim() !== '');
    const comTg  = q(sel.comTg);
    const comInp = q(sel.comInp);
    if (comTg) clickToggle(comTg, comEnabled);
    if (comEnabled && comInp) setVal(comInp, String(casa.c ?? ''));
  }

  async function loadArbiPro(shared) {
    info('Carregando ArbiPro...');
    if (!shared) { warn('Sem estado compartilhado.'); return; }
    if ((shared.t || 'arbipro') !== 'arbipro') { warn(`Tipo não suportado: ${shared.t}`); return; }

    const casas = Array.isArray(shared.h) ? shared.h : [];
    const n = shared.n || casas.length || 2;
    log(`Casas: ${n}`);
    if (shared.r != null) log(`Arredondamento: ${shared.r}`);

    // Hidratação protegida para não apagar stakes
    withHydration(() => {
      casas.forEach((casa, i) => {
        step(`Carregando Casa ${i+1}...`);
        applyCasa(i + 1, casa);
      });
    });

    ok('ArbiPro carregado com sucesso!');

    // Cinto e suspensório: se alguma rotina externa zerar logo após,
    // repõe uma única vez (ex.: Casa 1)
    setTimeout(() => {
      try {
        const stake1 = q('[data-casa="1"] .stake-input, [data-casa="1"] [data-role="stake"]');
        if (stake1 && (!stake1.value || stake1.value === '0') && casas[0]?.s) {
          setVal(stake1, String(casas[0].s));
          log('🔁 Stake 1 reposta após limpeza tardia');
        }
      } catch {}
    }, 120);
  }

  // -----------------------------
  // BOOT
  // -----------------------------
  async function boot() {
    ok('Sistema de compartilhamento (ShareUI) inicializado');
    const shared = decodeShared();

    // aplica estado
    await loadArbiPro(shared);

    // limpa ?s da URL
    cleanURL();

    // recálculo final, agora com lock off
    if (typeof window.recalculateAll === 'function') {
      try { window.recalculateAll(); } catch {}
    }
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(boot, 0);
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})();
