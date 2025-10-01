// assets/js/ui/shareui.js
// Versão: 2025-09-30 – Shark DEV (Auto-detecção de seletores + hidratação segura)

(() => {
  const LOG_NS = 'shareui.js';
  const log  = (...a) => console.log(`${LOG_NS}:`, ...a);
  const ok   = (m) => console.log(`${LOG_NS}: ✅ ${m}`);
  const inf  = (m) => console.log(`${LOG_NS}: ⚙️ ${m}`);
  const warn = (m) => console.warn(`${LOG_NS}: ⚠️ ${m}`);
  const step = (m) => console.log(`${LOG_NS}: 📝 ${m}`);
  const sub  = (m) => console.log(`${LOG_NS}:   ${m}`);

  // Lock global para impedir rotinas de limpeza enquanto hidratamos
  if (typeof window.__SHAREUI_HYDRATING === 'undefined') window.__SHAREUI_HYDRATING = false;
  function withHydration(cb){ const p=window.__SHAREUI_HYDRATING; window.__SHAREUI_HYDRATING=true; try{cb();}finally{window.__SHAREUI_HYDRATING=p;} }

  // Monkey-patch defensivo (se existirem)
  ['clearStakes','resetCasa','normalizeForm','recalculateAll'].forEach(name=>{
    const h=window; if(typeof h[name]==='function' && !h[name].__patchedByShareUI){
      const orig=h[name];
      h[name]=function(...args){ if(window.__SHAREUI_HYDRATING) return; return orig.apply(this,args); };
      h[name].__patchedByShareUI=true; log(`🔧 monkey-patch aplicado em ${name}()`);
    }
  });

  // Utils DOM
  const q  = (sel,root=document)=>root.querySelector(sel);
  const qa = (sel,root=document)=>Array.from(root.querySelectorAll(sel));

  // ---- Decodifica ?s=... (base64 url-safe) ----
  function decodeStateFromURL(){
    try{
      const sp=new URLSearchParams(location.search);
      const s=sp.get('s'); if(!s) return null;
      const b64=s.replace(/-/g,'+').replace(/_/g,'/');
      const json=atob(b64);
      return JSON.parse(json);
    }catch(e){ warn(`Falha ao decodificar estado: ${e.message}`); return null; }
  }

  // Limpa ?s= da URL (se quiser manter, comente)
  function cleanURL(){
    try{
      const url=new URL(location.href);
      if(url.searchParams.has('s')){ url.searchParams.delete('s'); history.replaceState({},'',url.toString()); log('🧹 URL limpa'); }
    }catch{}
  }

  // -------------------------------------------------
  // AUTO-DETECÇÃO DE SELETORES POR CASA
  // -------------------------------------------------
  // Heurísticas: procura por atributos comuns, placeholders, nomes, rótulos próximos, e botões por texto
  function findInput(root, kinds){
    // kinds: array de strings a procurar (ex.: ['odd','odds'])
    const selAttrs = [
      'input[id*="{k}"]',
      'input[name*="{k}"]',
      'input[data-role*="{k}"]',
      'input[placeholder*="{k}"]',
      '[data-action*="{k}"] input',
      '.{k}-input',
      '[data-{k}] input',
    ];
    for(const k of kinds){
      for(const s of selAttrs){
        const sel=s.replaceAll('{k}', k);
        const el=q(sel, root);
        if(el) return el;
      }
    }
    // último recurso: primeiro input numérico visível
    const candidate=qa('input',root).find(e=>e.type==='number' && e.offsetParent);
    return candidate || null;
  }

  function findToggle(root, keywords){
    // tenta por data-action, classes, e por texto dentro de botões
    const candidates = [
      ...qa('[data-action]', root),
      ...qa('button, .btn, [role="button"], label', root)
    ];
    // 1) por data-action
    for(const el of candidates){
      const act=(el.getAttribute('data-action')||'').toLowerCase();
      if(keywords.some(k=>act.includes(k))) return el;
    }
    // 2) por classes
    for(const el of candidates){
      const cls=(el.className||'').toLowerCase();
      if(keywords.some(k=>cls.includes(k))) return el;
    }
    // 3) por texto
    for(const el of candidates){
      const txt=(el.textContent||'').toLowerCase().trim();
      if(keywords.some(k=>txt.includes(k))) return el;
    }
    return null;
  }

  function detectCasa(index){
    // tenta achar um container para a casa; se não existir, usa document
    const candidates = [
      `[data-casa="${index}"]`,
      `[data-index="${index}"]`,
      `#casa-${index}`,
      `.casa-${index}`,
    ];
    let root = null;
    for(const sel of candidates){ const el=q(sel); if(el){ root=el; break; } }
    if(!root){ root=document; warn(`Casa ${index}: container não encontrado (usando document como root)`); }

    // inputs
    const odd = findInput(root, ['odd','odds','cotacao','cota']);
    const stake = findInput(root, ['stake','valor','aposta','entrada']);
    const comissaoInput = findInput(root, ['comissao','comissão','taxa','fee','commission']);

    // toggles
    const freebetToggle = findToggle(root, ['freebet','free-bet','gratis','grátis','free']);
    const fixStakeBtn   = findToggle(root, ['fix','fixar','travar','lock','pin','fix-stake']);
    const comissaoToggle= findToggle(root, ['comissao','comissão','taxa','fee','commission']);

    log(`🔎 Auto-detecção casa ${index}:`, {
      root: root===document ? 'document' : root,
      odd, stake, freebetToggle, fixStakeBtn, comissaoToggle, comissaoInput
    });

    return { root, odd, stake, freebetToggle, fixStakeBtn, comissaoToggle, comissaoInput };
  }

  function clickIf(el, shouldBeActive){
    if(!el) return;
    // tenta inferir estado atual
    const isActive = el.classList?.contains('active') ||
                     el.getAttribute?.('aria-pressed')==='true' ||
                     (el.type==='checkbox' && el.checked===true);
    if(shouldBeActive && !isActive) el.click();
    if(!shouldBeActive && isActive) el.click();
  }

  function setVal(el, value){
    if(!el) return false;
    const str = (value==null) ? '' : String(value).replace(',', '.');
    if(el.value === str){
      el.dispatchEvent(new Event('input', {bubbles:true}));
      el.dispatchEvent(new Event('change',{bubbles:true}));
      return true;
    }
    el.value=str;
    el.dispatchEvent(new Event('input', {bubbles:true}));
    el.dispatchEvent(new Event('change',{bubbles:true}));
    return true;
  }

  // -------------------------------------------------
  // APLICAÇÃO POR CASA
  // -------------------------------------------------
  function applyCasa(index, casaData, det){
    log(`🏠 Carregando Casa ${index}:`, casaData);

    // 1) Freebet
    if(typeof casaData.f!=='undefined' && det.freebetToggle){
      sub(`└─ ${casaData.f ? 'Ativando' : 'Desativando'} freebet`);
      clickIf(det.freebetToggle, !!casaData.f);
    }

    // 2) Fixar ANTES de stake
    const shouldFix = !!casaData.x || (!!casaData.s && String(casaData.s).trim()!=='');
    if(shouldFix && det.fixStakeBtn){
      sub('└─ Fixando stake');
      clickIf(det.fixStakeBtn, true);
    }

    // 3) Odd
    step('Etapa 1: Preenchendo ODD...');
    if(det.odd){ setVal(det.odd, casaData.o); sub(`✓ Odd: ${casaData.o}`); }
    else warn(`Casa ${index}: input de ODD não encontrado`);

    // 4) Stake (se fixada)
    step('Etapa 2: Preenchendo STAKE (se necessário)...');
    if(shouldFix){
      if(det.stake){ setVal(det.stake, casaData.s); sub(`✓ Stake: ${casaData.s}`); }
      step('Etapa 3: Fixando (reforço visual)');
    } else {
      sub('⏭️ Stake não será preenchida (casa não fixada)');
    }

    // 5) Comissão
    const comEnabled = !!casaData.l || (casaData.c != null && String(casaData.c).trim()!=='');
    if(det.comissaoToggle) clickIf(det.comissaoToggle, comEnabled);
    if(comEnabled && det.comissaoInput) setVal(det.comissaoInput, casaData.c);
  }

  // -------------------------------------------------
  // MAIN
  // -------------------------------------------------
  function getCasasCountFallback(){
    // tenta deduzir número de casas pelo DOM
    const hints = [
      '[data-casa]', '.casa', '.book', '.linha-casa', '.casa-item'
    ];
    for(const s of hints){
      const els=qa(s);
      if(els.length>=2) return els.length;
    }
    return 2; // padrão mínimo
  }

  async function waitForElements(detectors, maxMs=4000){
    // re-tenta até achar pelo menos odd/stake de cada casa
    const start=Date.now();
    return new Promise((resolve)=>{
      const tick=()=>{
        const okAll = detectors.every(d=> d().odd || d().stake || d().freebetToggle || d().fixStakeBtn || d().comissaoToggle || d().comissaoInput);
        if(okAll || (Date.now()-start)>maxMs) return resolve();
        setTimeout(tick, 150);
      };
      tick();
    });
  }

  async function boot(){
    ok('Sistema de compartilhamento (ShareUI) inicializado');

    const shared = decodeStateFromURL();
    if(!shared){ warn('Sem estado compartilhado (?s).'); return; }

    // Estrutura típica: { t:'arbipro', n:2, r:0.01, h:[ {o,s,c,f,i,l,x}, ... ] }
    const tipo = shared.t || 'arbipro';
    if(tipo!=='arbipro'){ warn(`Tipo não suportado: ${tipo}`); return; }

    const casas = Array.isArray(shared.h) ? shared.h : [];
    const n = shared.n || casas.length || getCasasCountFallback();

    inf('Carregando ArbiPro...');
    log(`Casas: ${n}`);
    if(shared.r!=null) log(`Arredondamento: ${shared.r}`);

    // Auto-detecção (criamos closures para re-detectar caso ainda não estejam no DOM)
    const detectors = [];
    for(let i=1;i<=n;i++){
      let cache=null;
      detectors.push(()=>{
        if(!cache) cache=detectCasa(i);
        return cache;
      });
    }

    // Aguarda surgirem (até maxMs). Não falha se não achar tudo; aplica o que tiver.
    await waitForElements(detectors, 5000);

    withHydration(()=>{
      casas.forEach((casa,i)=>{
        const idx=i+1;
        step(`Carregando Casa ${idx}...`);
        const det=detectors[i]();
        applyCasa(idx, casa, det);
      });
    });

    ok('ArbiPro carregado com sucesso!');
    cleanURL();

    // Recalcula no fim (se existir)
    if(typeof window.recalculateAll==='function'){
      try{ window.recalculateAll(); }catch{}
    }
  }

  if(document.readyState==='complete' || document.readyState==='interactive') setTimeout(boot,0);
  else document.addEventListener('DOMContentLoaded', boot);
})();
