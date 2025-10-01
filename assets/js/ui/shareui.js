// assets/js/ui/shareui.js
// Shark DEV — ShareUI UMD (compatível com new ShareUI())
// Hotfix mínimo: fixa antes de setar stake, aplica comissão e reforça stake se algum listener externo zerar.
// Não mexe em URL, não faz monkey-patch, não interfere no botão de compartilhar.

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS (bundlers)
    module.exports = factory();
  } else {
    // Browser global
    root.ShareUI = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this), function () {
  const NS  = 'shareui.js';
  const log = (...a) => console.log(`${NS}:`, ...a);
  const ok  = (m)   => console.log(`${NS}: ✅ ${m}`);
  const inf = (m)   => console.log(`${NS}: ⚙️ ${m}`);
  const warn= (m)   => console.warn(`${NS}: ⚠️ ${m}`);
  const step= (m)   => console.log(`${NS}: 📝 ${m}`);
  const sub = (m)   => console.log(`${NS}:   ${m}`);

  const q = (sel, root=document) => root.querySelector(sel);

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
    const isActive = el.classList?.contains('active')
                  || el.getAttribute?.('aria-pressed') === 'true'
                  || (el.type === 'checkbox' && el.checked === true);
    if (on && !isActive) el.click();
    if (!on && isActive) el.click();
  }

  class ShareUI {
    constructor(options = {}) {
      this.options = options;
      ok('Sistema de compartilhamento (ShareUI) inicializado');
      // Não auto-inicia para combinar com apps que chamam init() explicitamente.
      // Se preferir auto-start, descomente a linha abaixo:
      // this.init();
    }

    async init() {
      const shared = this._decodeShared();
      await this._loadArbiPro(shared);
    }

    _decodeShared() {
      try {
        const sp = new URLSearchParams(location.search);
        const s  = sp.get('s');
        if (!s) return null;
        const b64  = s.replace(/-/g, '+').replace(/_/g, '/');
        const json = atob(b64);
        return JSON.parse(json);
      } catch (e) {
        warn(`Falha ao decodificar estado: ${e.message}`);
        return null;
      }
    }

    _applyCasa(index, casa) {
      log(`🏠 Carregando Casa ${index}:`, casa);

      const rootSel  = `[data-casa="${index}"]`;
      const oddSel   = `${rootSel} .odd-input, ${rootSel} [data-role="odd"]`;
      const stakeSel = `${rootSel} .stake-input, ${rootSel} [data-role="stake"]`;
      const fixSel   = `${rootSel} [data-action="fix-stake"]`;
      const freeSel  = `${rootSel} [data-action="toggle-freebet"]`;
      const comTgSel = `${rootSel} [data-action="toggle-comissao"], ${rootSel} .toggle-comissao`;
      const comInSel = `${rootSel} .comissao-input, ${rootSel} [data-role="comissao"]`;

      // 1) Freebet (opcional)
      if (typeof casa.f !== 'undefined') {
        const fb = q(freeSel);
        if (fb) {
          sub(`└─ ${casa.f ? 'Ativando' : 'Desativando'} freebet`);
          clickToggle(fb, !!casa.f);
        }
      }

      // 2) FIXAR ANTES de setar stake
      const shouldFix = !!casa.x || (!!casa.s && String(casa.s).trim() !== '');
      const fixBtn = q(fixSel);
      if (shouldFix && fixBtn) {
        sub('└─ Fixando stake');
        clickToggle(fixBtn, true);
      }

      // 3) Odd
      step('Etapa 1: Preenchendo ODD...');
      const oddEl = q(oddSel);
      if (oddEl && setVal(oddEl, casa.o)) sub(`✓ Odd: ${casa.o}`);
      else warn(`Elemento não encontrado: ${oddSel} (odd casa ${index})`);

      // 4) Stake
      step('Etapa 2: Preenchendo STAKE (se necessário)...');
      const stakeEl = q(stakeSel);
      if (shouldFix) {
        if (stakeEl && setVal(stakeEl, casa.s)) sub(`✓ Stake: ${casa.s}`);
        step('Etapa 3: Fixando (reforço)');
      } else {
        sub('⏭️ Stake não será preenchida (casa não fixada)');
      }

      // 5) Comissão (toggle + valor)
      const comEnabled = !!casa.l || (casa.c != null && String(casa.c).trim() !== '');
      const comTg  = q(comTgSel);
      const comInp = q(comInSel);
      if (comTg)  clickToggle(comTg, comEnabled);
      if (comEnabled && comInp) setVal(comInp, String(casa.c ?? ''));
    }

    _reinforceStakeOnce(index, value) {
      // Se alguma rotina externa zerar a stake logo após a carga, repõe 1x.
      const sel = `[data-casa="${index}"] .stake-input, [data-casa="${index}"] [data-role="stake"]`;
      const el  = q(sel);
      if (el && (!el.value || el.value === '0')) {
        setVal(el, String(value));
        log(`🔁 Stake da casa ${index} reposta após limpeza tardia`);
      }
    }

    async _loadArbiPro(shared) {
      inf('Carregando ArbiPro...');
      if (!shared) { warn('Sem estado compartilhado.'); return; }
      if ((shared.t || 'arbipro') !== 'arbipro') { warn(`Tipo não suportado: ${shared.t}`); return; }

      const casas = Array.isArray(shared.h) ? shared.h : [];
      const n = shared.n || casas.length || 2;
      log(`Casas: ${n}`);
      if (shared.r != null) log(`Arredondamento: ${shared.r}`);

      casas.forEach((casa, i) => {
        step(`Carregando Casa ${i+1}...`);
        this._applyCasa(i + 1, casa);
      });

      ok('ArbiPro carregado com sucesso!');

      // Reforço leve: se alguma limpeza assíncrona zerar a stake da Casa 1, repõe.
      if (casas[0]?.s) {
        setTimeout(() => this._reinforceStakeOnce(1, casas[0].s), 120);
        setTimeout(() => this._reinforceStakeOnce(1, casas[0].s), 300);
      }
    }
  }

  // Retorna a classe para UMD
  return ShareUI;
});
