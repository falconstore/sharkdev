// assets/js/ui/shareui.js
// Versão: 2025-09-30 – Shark DEV (ShareUI com hidratação segura + comissão)
// Este arquivo é independente e pode ser colado direto no seu projeto.

(() => {
  // ===========================
  // CONFIGURAÇÃO DE SELETORES
  // ===========================
  const SEL = {
    // Container principal por casa (usar data-casa="1", "2", etc.)
    casaRoot: (idx) => `[data-casa="${idx}"]`,

    // Inputs (ajuste se necessário)
    oddInput: (idx) => `${SEL.casaRoot(idx)} .odd-input, ${SEL.casaRoot(idx)} [data-role="odd"]`,
    stakeInput: (idx) => `${SEL.casaRoot(idx)} .stake-input, ${SEL.casaRoot(idx)} [data-role="stake"]`,
    comissaoInput: (idx) => `${SEL.casaRoot(idx)} .comissao-input, ${SEL.casaRoot(idx)} [data-role="comissao"]`,

    // Botões/toggles (ajuste se necessário)
    fixStakeBtn: (idx) => `${SEL.casaRoot(idx)} [data-action="fix-stake"], ${SEL.casaRoot(idx)} .btn-fix-stake`,
    freebetToggle: (idx) => `${SEL.casaRoot(idx)} [data-action="toggle-freebet"], ${SEL.casaRoot(idx)} .toggle-freebet`,
    comissaoToggle: (idx) => `${SEL.casaRoot(idx)} [data-action="toggle-comissao"], ${SEL.casaRoot(idx)} .toggle-comissao`,

    // Elemento que indica que o ArbiPro está montado (qualquer coisa estável no DOM)
    arbiProReadyProbe: '[data-arbipro-ready], #arbipro, .arbipro-wrapper',
  };

  // ===========================
  // ESTADO / LOG / UTILITÁRIOS
  // ===========================
  const LOG_NS = 'shareui.js';

  function log(...args)   { console.log(`${LOG_NS}:`, ...args); }
  function ok(msg)        { console.log(`${LOG_NS}: ✅ ${msg}`); }
  function info(msg)      { console.log(`${LOG_NS}: ⚙️ ${msg}`); }
  function warn(msg)      { console.warn(`${LOG_NS}: ⚠️ ${msg}`); }
  function step(msg)      { console.log(`${LOG_NS}: 📝 ${msg}`); }
  function sub(msg)       { console.log(`${LOG_NS}:     ${msg}`); }

  // Lock global para hidratação
  if (typeof window.__SHAREUI_HYDRATING === 'undefined') {
    window.__SHAREUI_HYDRATING = false;
  }

  function withHydration(cb) {
    const prev = window.__SHAREUI_HYDRATING;
    window.__SHAREUI_HYDRATING = true;
    try { cb(); } finally { window.__SHAREUI_HYDRATING = prev; }
  }

  // Patch defensivo em funções globais conhecidas (se existirem)
  const maybePatch = (name) => {
    const host = window;
    if (typeof host[name] === 'function' && !host[name].__patchedByShareUI) {
      const original = host[name];
      host[name] = function patchedShareUI(...args) {
        if (window.__SHAREUI_HYDRATING) {
          // Silencia durante a hidratação
          return;
        }
        return original.apply(this, args);
      };
      host[name].__patchedByShareUI = true;
      log(`🔧 monkey-patch aplicado em ${name}()`);
    }
  };
  ['clearStakes', 'resetCasa', 'normalizeForm', 'recalculateAll'].forEach(maybePatch);

  // Helpers DOM
  const q = (sel, root = document) => root.querySelector(sel);
  const qa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function clickIf(el, shouldBeActive) {
    if (!el) return;
    const isActive = el.classList?.contains('active') || el.getAttribute('aria-pressed') === 'true' || (el.type === 'checkbox' && el.checked);
    if (shouldBeActive && !isActive) el.click();
    if (!shouldBeActive && isActive) el.click();
  }

  function setInputValue(selector, value) {
    const el = q(selector);
    if (!el) return false;
    const str = (value == null) ? '' : String(value).replace(',', '.'); // normaliza vírgula → ponto
    // Evita sobrescrever se já está igual
    if (el.value === str) {
      // ainda assim disparamos input pra recalculo quando necessário
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    el.value = str;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  function ensureExists(selector, ctx) {
    const el = q(selector);
    if (!el) warn(`Elemento não encontrado: ${selector} ${ctx ? `(${ctx})` : ''}`);
    return el;
  }

  // ===========================
  // PARSE DO ESTADO COMPARTILHADO (?s=...)
  // ===========================
  function decodeStateFromURL() {
    try {
      const sp = new URLSearchParams(location.search);
      const s = sp.get('s');
      if (!s) return null;
      // Base64 url-safe (sem padding)
      const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
      const json = atob(b64);
      return JSON.parse(json);
    } catch (e) {
      warn(`Falha ao decodificar estado compartilhado: ${e.message}`);
      return null;
    }
  }

  // Pequena limpeza de URL (opcional — se o seu share.js já faz, ok manter duplicado)
  function cleanURL() {
    try {
      const url = new URL(location.href);
      if (url.searchParams.has('s')) {
        url.searchParams.delete('s');
        history.replaceState({}, '', url.toString());
        log('🧹 URL limpa');
      }
    } catch { /* ignore */ }
  }

  // ===========================
  // APLICAÇÃO DO ESTADO
  // ===========================
  function applyFreebet(casaIndex, enabled) {
    const el = ensureExists(SEL.freebetToggle(casaIndex), `freebet casa ${casaIndex}`);
    if (!el) return;
    sub(`└─ ${enabled ? 'Ativando' : 'Desativando'} freebet`);
    clickIf(el, !!enabled);
  }

  function applyFixStake(casaIndex, shouldFix) {
    const el = ensureExists(SEL.fixStakeBtn(casaIndex), `fix stake casa ${casaIndex}`);
    if (!el) return;
    if (shouldFix) {
      sub('└─ Fixando stake');
      clickIf(el, true);
    } else {
      clickIf(el, false);
    }
  }

  function applyComissao(casaIndex, enabled, value) {
    const toggle = ensureExists(SEL.comissaoToggle(casaIndex), `toggle comissão casa ${casaIndex}`);
    const input = q(SEL.comissaoInput(casaIndex));
    if (toggle) clickIf(toggle, !!enabled);
    if (enabled && input) {
      const v = (value == null || value === '') ? '' : String(value);
      setInputValue(SEL.comissaoInput(casaIndex), v);
    }
  }

  function applyCasa(casaIndex, casaData) {
    // casaData esperado (conforme seus logs): { o, s, c, f, i, l, x }
    // o: odd; s: stake; c: comissão; f: freebet(1/0); l: comissao ligada(1/0); x: fix stake(1/0)
    log(`🏠 Carregando Casa ${casaIndex}:`, casaData);

    // 1) Freebet
    if (typeof casaData.f !== 'undefined') {
      applyFreebet(casaIndex, !!casaData.f);
    }

    // 2) Ordem crítica: FIXAR ANTES de setar stake
    const shouldFix = !!casaData.x || (!!casaData.s && String(casaData.s).trim() !== '');
    if (shouldFix) applyFixStake(casaIndex, true);

    // 3) Odd
    step('Etapa 1: Preenchendo ODD...');
    if (setInputValue(SEL.oddInput(casaIndex), casaData.o)) {
      sub(`✓ Odd: ${casaData.o}`);
    }

    // 4) Stake (apenas se casa estiver fixada)
    step('Etapa 2: Preenchendo STAKE (se necessário)...');
    if (shouldFix) {
      if (setInputValue(SEL.stakeInput(casaIndex), casaData.s)) {
        sub(`✓ Stake: ${casaData.s}`);
      }
      step('🔒 Etapa 3: Fixando stake...'); // reforço visual no log
    } else {
      sub('⏭️ Stake não será preenchida (casa não fixada)');
    }

    // 5) Comissão
    const comEnabled = !!casaData.l || (casaData.c != null && String(casaData.c).trim() !== '');
    applyComissao(casaIndex, comEnabled, casaData.c);
  }

  // ===========================
  // CARREGAMENTO ArbiPro
  // ===========================
  function waitForArbiProReady(maxTries = 20, delayMs = 150) {
    return new Promise((resolve, reject) => {
      let tries = 0;
      const t = setInterval(() => {
        tries++;
        if (q(SEL.arbiProReadyProbe)) {
          clearInterval(t);
          ok(`Sistema pronto (tentativa ${tries})`);
          resolve(true);
        }
        if (tries >= maxTries) {
          clearInterval(t);
          reject(new Error('Timeout aguardando ArbiPro'));
        }
      }, delayMs);
    });
  }

  async function loadArbiProFromSharedState(shared) {
    info('Carregando ArbiPro...');
    if (!shared) {
      warn('Sem estado compartilhado; nada a aplicar.');
      return;
    }

    // Estrutura observada nos seus logs:
    // { t: "arbipro", n: 2, r: 0.01, h: [ {o,s,c,f,i,l,x}, {o,s,c,f,i,l,x} ] }
    const tipo = shared.t || 'arbipro';
    if (tipo !== 'arbipro') {
      warn(`Tipo de calculadora não suportado: ${tipo}`);
      return;
    }

    const casas = Array.isArray(shared.h) ? shared.h : [];
    const arred = shared.r;
    const nCasas = shared.n || casas.length;

    log(`🏠 Casas: ${nCasas}`);
    if (arred != null) log(`🔢 Arredondamento: ${arred}`);

    withHydration(() => {
      casas.forEach((casa, idx) => {
        const cIndex = idx + 1;
        step(`Carregando Casa ${cIndex}...`);
        applyCasa(cIndex, casa);
      });
    });

    ok('ArbiPro carregado com sucesso!');
  }

  // ===========================
  // BOOT
  // ===========================
  async function boot() {
    ok('Sistema de compartilhamento (ShareUI) inicializado');

    // Decodifica estado do ?s=
    const shared = decodeStateFromURL();

    // Espera o app principal montar (inputs, botões, etc.)
    try {
      await waitForArbiProReady();
    } catch (err) {
      warn(`Não foi possível detectar ArbiPro pronto: ${err.message}`);
      // Mesmo assim, tenta aplicar — pode já estar disponível.
    }

    // Aplica estado
    await loadArbiProFromSharedState(shared);

    // Limpa a URL (opcional — se seu share.js já limpa, isso será redundante porém inofensivo)
    cleanURL();

    // Recalcula no final (se existir), agora sem lock
    if (typeof window.recalculateAll === 'function') {
      try { window.recalculateAll(); } catch (e) { /* ignore */ }
    }
  }

  // Inicialização segura
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(boot, 0);
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})();
