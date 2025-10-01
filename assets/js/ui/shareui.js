// assets/js/ui/shareui.js
// Shark DEV — Hotfix mínimo: não apagar stakes e aplicar comissão sem interferir no share.

(() => {
  const NS = 'shareui.js';
  const log  = (...a) => console.log(`${NS}:`, ...a);
  const ok   = (m) => console.log(`${NS}: ✅ ${m}`);
  const info = (m) => console.log(`${NS}: ⚙️ ${m}`);
  const warn = (m) => console.warn(`${NS}: ⚠️ ${m}`);
  const step = (m) => console.log(`${NS}: 📝 ${m}`);
  const sub  = (m) => console.log(`${NS}:   ${m}`);

  // ---------- Helpers ----------
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
    const isActive = el.classList?.contains('active')
                  || el.getAttribute?.('aria-pressed') === 'true'
                  || (el.type === 'checkbox' && el.checked === true);
    if (on && !isActive) el.click();
    if (!on && isActive) el.click();
  }

  // ---------- Estado (?s=...) ----------
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

  // ---------- Aplicação: ArbiPro ----------
  // Estrutura esperada:
  // { t:'arbipro', n:2, r:0.01, h:[ {o,s,c,f,i,l,x}, {o,s,c,f,i,l,x} ] }
  // o=odd, s=stake, c=comissão, f=freebet(1/0), l=toggle comissão(1/0), x=fix-stake(1/0)
  function applyCasa(index, casa) {
    log(`🏠 Carregando Casa ${index}:`, casa);

    const rootSel = `[data-casa="${index}"]`;
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

  function reinforceStakeOnce(index, value) {
    // Reforço defensivo: se alguma rotina externa zerar a stake logo após a carga, repõe 1x.
    const sel = `[data-casa="${index}"] .stake-input, [data-casa="${index}"] [data-role="stake"]`;
    const el  = q(sel);
    if (el && (!el.value || el.value === '0')) {
      setVal(el, String(value));
      log(`🔁 Stake da casa ${index} reposta após limpeza tardia`);
    }
  }

  async function loadArbiPro(shared) {
    info('Carregando ArbiPro...');
    if (!shared) { warn('Sem estado compartilhado.'); return; }
    if ((shared.t || 'arbipro') !== 'arbipro') { warn(`Tipo não suportado: ${shared.t}`); return; }

    const casas = Array.isArray(shared.h) ? shared.h : [];
    const n = shared.n || casas.length || 2;
    log(`Casas: ${n}`);
    if (shared.r != null) log(`Arredondamento: ${shared.r}`);

    casas.forEach((casa, i) => {
      step(`Carregando Casa ${i+1}...`);
      applyCasa(i + 1, casa);
    });

    ok('ArbiPro carregado com sucesso!');

    // Reforço super leve (não afeta o botão de compartilhar):
    // tenta repor stake da casa 1 se alguma limpeza assíncrona a zerar
    if (casas[0]?.s) {
      setTimeout(() => reinforceStakeOnce(1, casas[0].s), 120);
      setTimeout(() => reinforceStakeOnce(1, casas[0].s), 300);
    }
  }

  // ---------- Boot ----------
  function boot() {
    ok('Sistema de compartilhamento (ShareUI) inicializado');
    const shared = decodeShared();
    loadArbiPro(shared);

    // Não limpamos a URL e não mexemos em rotinas globais,
    // para não interferir no botão de compartilhar.
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(boot, 0);
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})();
