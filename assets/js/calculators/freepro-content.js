// assets/js/calculators/freepro-content.js - VERSÃO PADRONIZADA
// HTML da FreePro com MESMO padrão visual do ArbiPro

export function getFreeProfHTML() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Calculadora FreePro</title>
  <style>
    :root {
      --primary: #3b82f6;
      --secondary: #22c55e;
      --accent: #8b5cf6;
      --warning: #f59e0b;
      --danger: #dc2626;
      --success: #22c55e;
      --bg-primary: #111827;
      --bg-secondary: #1f2937;
      --bg-card: #374151;
      --text-primary: #f9fafb;
      --text-secondary: #d1d5db;
      --text-muted: #9ca3af;
      --border: #4b5563;
    }

    [data-theme="light"] {
      --bg-primary: #f8fafc;
      --bg-secondary: #f1f5f9;
      --bg-card: #ffffff;
      --text-primary: #1e293b;
      --text-secondary: #475569;
      --text-muted: #64748b;
      --border: #e2e8f0;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    html, body {
      background: transparent;
      color: var(--text-primary);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
      padding: 1rem;
      margin: 0;
      overflow: visible;
      height: auto;
      transition: color 0.3s ease;
    }

    /* === HEADER PADRONIZADO === */
    .calc-header {
      text-align: center;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: rgba(31, 41, 59, 0.4);
      border-radius: 12px;
      border: 1px solid var(--border);
    }

    [data-theme="light"] .calc-header {
      background: rgba(255, 255, 255, 0.6);
    }

    .calc-title {
      font-size: 1.75rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }

    .calc-subtitle {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    /* === STATS GRID PADRONIZADO === */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }

    .stat-card {
      background: rgba(17, 24, 39, 0.6);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      transition: all 0.3s ease;
      min-height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    [data-theme="light"] .stat-card {
      background: rgba(255, 255, 255, 0.8);
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 800;
      font-family: ui-monospace, monospace;
      margin-bottom: 0.25rem;
      color: var(--primary);
    }

    .stat-label {
      font-size: 0.625rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }

    /* === CARDS PADRONIZADOS === */
    .card {
      background: rgba(31, 41, 59, 0.8);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 1rem;
      transition: all 0.3s ease;
    }

    [data-theme="light"] .card {
      background: rgba(255, 255, 255, 0.9);
    }

    .section-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .section-title::before {
      content: '';
      width: 3px;
      height: 20px;
      background: linear-gradient(180deg, var(--primary), var(--secondary));
      border-radius: 2px;
    }

    /* === HOUSE CARDS PADRONIZADOS === */
    .house-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .house-card {
      background: linear-gradient(135deg, rgba(31, 41, 59, 0.8), rgba(55, 65, 81, 0.6));
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1rem;
      transition: all 0.3s ease;
      position: relative;
    }

    [data-theme="light"] .house-card {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 250, 252, 0.8));
    }

    .house-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      border-radius: 12px 12px 0 0;
    }

    .house-card:nth-child(1)::before { background: linear-gradient(90deg, var(--primary), var(--secondary)); }
    .house-card:nth-child(2)::before { background: linear-gradient(90deg, var(--success), var(--primary)); }
    .house-card:nth-child(3)::before { background: linear-gradient(90deg, var(--warning), var(--danger)); }
    .house-card:nth-child(4)::before { background: linear-gradient(90deg, var(--accent), var(--primary)); }
    .house-card:nth-child(5)::before { background: linear-gradient(90deg, var(--danger), var(--warning)); }

    .house-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* === FORMULÁRIOS PADRONIZADOS === */
    .grid-2 { 
      display: grid; 
      grid-template-columns: repeat(2, 1fr); 
      gap: 1rem; 
    }

    .form-group {
      margin-bottom: 0.75rem;
    }

    .form-label {
      display: block;
      font-weight: 600;
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-bottom: 0.375rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-input, .form-select {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid var(--border);
      border-radius: 8px;
      background: rgba(17, 24, 39, 0.8);
      color: var(--text-primary);
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    [data-theme="light"] .form-input,
    [data-theme="light"] .form-select {
      background: rgba(255, 255, 255, 0.9);
    }

    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    /* === BOTÕES PADRONIZADOS === */
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      text-decoration: none;
      display: inline-block;
      text-align: center;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
    }

    .btn-secondary {
      background: rgba(55, 65, 81, 0.8);
      color: var(--text-primary);
      border: 2px solid var(--border);
    }

    .btn-toggle {
      background: rgba(55, 65, 81, 0.8);
      color: var(--text-secondary);
      border: 2px solid var(--border);
      min-width: 60px;
      padding: 0.75rem 1rem;
      transition: all 0.3s ease;
    }

    .btn-toggle.active {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      border-color: var(--primary);
    }

    .btn-share {
      background: linear-gradient(135deg, #8b5cf6, #3b82f6) !important;
      color: white !important;
      border: none !important;
    }

    /* === CHECKBOXES PADRONIZADOS === */
    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0.5rem 0;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .checkbox-group input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: var(--primary);
      cursor: pointer;
    }

    /* === MODO TOGGLES PADRONIZADOS === */
    .mode-toggles {
      display: flex;
      gap: 0.25rem;
      background: rgba(31, 41, 59, 0.8);
      border-radius: 12px;
      padding: 0.25rem;
      border: 1px solid var(--border);
      margin-bottom: 1rem;
    }

    [data-theme="light"] .mode-toggles {
      background: rgba(255, 255, 255, 0.9);
    }

    .mode-toggle {
      flex: 1;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .mode-toggle.active {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
    }

    /* === TABELA PADRONIZADA === */
    .results-table {
      width: 100%;
      border-collapse: collapse;
      background: rgba(17, 24, 39, 0.8);
      border-radius: 12px;
      overflow: hidden;
      margin-top: 1rem;
    }

    [data-theme="light"] .results-table {
      background: rgba(255, 255, 255, 0.9);
    }

    .results-table th {
      background: rgba(17, 24, 39, 0.9);
      color: var(--text-primary);
      font-weight: 700;
      text-transform: uppercase;
      padding: 0.75rem 0.5rem;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      border-bottom: 2px solid var(--primary);
    }

    [data-theme="light"] .results-table th {
      background: rgba(248, 250, 252, 0.9);
    }

    .results-table td {
      padding: 0.75rem 0.5rem;
      border-bottom: 1px solid var(--border);
      color: var(--text-primary);
      font-size: 0.875rem;
    }

    .results-table th:first-child,
    .results-table td:first-child { text-align: left; }

    .results-table th:not(:first-child),
    .results-table td:not(:first-child) { text-align: right; }

    /* === CLASSES DE LUCRO === */
    .profit-positive { color: #22c55e !important; font-weight: 700 !important; }
    .profit-negative { color: #dc2626 !important; font-weight: 700 !important; }
    .profit-highlight { color: #3b82f6 !important; font-weight: 800 !important; }
    .text-small { font-size: 0.75rem; color: var(--text-muted); }

    /* === CAMPOS CONDICIONAIS === */
    .freebet-only { display: block; }
    .cashback-only { display: none; }

    .mode-cashback .freebet-only { display: none; }
    .mode-cashback .cashback-only { display: block; }

    /* === RESPONSIVIDADE === */
    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
      }
      
      .house-grid {
        grid-template-columns: 1fr;
      }
      
      .grid-2 { 
        grid-template-columns: 1fr; 
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }
      
      .stat-card {
        min-height: 70px;
        padding: 0.5rem;
      }
      
      .stat-value {
        font-size: 0.875rem;
      }
      
      .stat-label {
        font-size: 0.5rem;
      }
    }
  </style>
</head>
<body>
  <!-- HEADER IGUAL AO ARBIPRO -->
  <div class="calc-header">
    <h1 class="calc-title">Calculadora Shark FreePro</h1>
    <p class="calc-subtitle">Otimize seus lucros com freebets e cashbacks - Padrão Shark Green</p>
  </div>

  <!-- STATS GRID IGUAL AO ARBIPRO -->
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-label">Configurações</div>
      <div class="form-group" style="margin: 0.75rem 0 0 0;">
        <select id="numEntradas" class="form-select" style="font-size: 0.75rem; padding: 0.5rem;">
          <option value="2">2 Mercados</option>
          <option value="3" selected>3 Mercados</option>
          <option value="4">4 Mercados</option>
          <option value="5">5 Mercados</option>
          <option value="6">6 Mercados</option>
        </select>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-label">Arredondamento</div>
      <div class="form-group" style="margin: 0.75rem 0 0 0;">
        <select id="round_step" class="form-select auto-calc" style="font-size: 0.75rem; padding: 0.5rem;">
          <option value="0.01">R$ 0,01</option>
          <option value="0.10">R$ 0,10</option>
          <option value="0.50">R$ 0,50</option>
          <option value="1.00" selected>R$ 1,00</option>
        </select>
      </div>
    </div>

    <div class="stat-card">
      <div class="stat-value" id="k_S">R$ 0,00</div>
      <div class="stat-label">Total Investido</div>
    </div>

    <div class="stat-card">
      <div class="stat-value profit-highlight">100%</div>
      <div class="stat-label">Shark Green</div>
    </div>

    <div class="stat-card">
      <div class="stat-label">Compartilhar</div>
      <button id="shareBtn" class="btn-share" style="margin-top: 0.75rem; width: 100%; padding: 0.5rem; font-size: 0.75rem;">
        🔗 Compartilhar
      </button>
    </div>
  </div>

  <!-- MODO TOGGLE IGUAL AO ARBIPRO -->
  <div class="card">
    <div class="section-title">Modo de Cálculo</div>
    <div class="mode-toggles">
      <button id="modeFreebetBtn" class="mode-toggle active">🎁 Freebet</button>
      <button id="modeCashbackBtn" class="mode-toggle">💰 Cashback</button>
    </div>
  </div>

  <!-- CASA PROMOÇÃO IGUAL AO ARBIPRO -->
  <div class="card">
    <div class="section-title">Casa Promoção</div>
    
    <!-- FREEBET MODE -->
    <div class="freebet-only">
      <div class="form-group">
        <label class="form-label" for="o1">Odd</label>
        <input id="o1" class="form-input auto-calc" placeholder="ex: 3.00" inputmode="decimal" />
      </div>

      <div class="form-group">
        <label class="form-label" for="s1">Stake</label>
        <div style="display: flex; gap: 0.5rem;">
          <div style="position: relative; flex: 1;">
            <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-weight: 600; font-size: 0.75rem;">R$</span>
            <input id="s1" class="form-input auto-calc" placeholder="ex: 50" inputmode="decimal" 
              style="padding-left: 2.25rem; font-family: ui-monospace, monospace;" />
          </div>
          <button id="promoLayBtn" class="btn-toggle">BACK</button>
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem; margin: 0.75rem 0; flex-wrap: wrap;">
        <label class="checkbox-group">
          <input type="checkbox" id="toggleCommission1" />
          <span>Comissão</span>
        </label>
        <label class="checkbox-group">
          <input type="checkbox" id="toggleFreebet1" />
          <span>Freebet</span>
        </label>
      </div>

      <div id="conditionalFields1"></div>

      <div class="grid-2">
        <div class="form-group">
          <label class="form-label" for="F">Valor da Freebet</label>
          <input id="F" class="form-input auto-calc" placeholder="ex: 50" inputmode="decimal" />
        </div>
        <div class="form-group">
          <label class="form-label" for="r">Taxa de Extração (%)</label>
          <input id="r" class="form-input auto-calc" placeholder="ex: 70" inputmode="decimal" />
        </div>
      </div>
    </div>

    <!-- CASHBACK MODE -->
    <div class="cashback-only">
      <div class="form-group">
        <label class="form-label" for="cashback_odd">Odd</label>
        <input id="cashback_odd" class="form-input auto-calc" placeholder="ex: 3.00" inputmode="decimal" />
      </div>

      <div class="form-group">
        <label class="form-label" for="cashback_stake">Stake</label>
        <div style="display: flex; gap: 0.5rem;">
          <div style="position: relative; flex: 1;">
            <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-weight: 600; font-size: 0.75rem;">R$</span>
            <input id="cashback_stake" class="form-input auto-calc" placeholder="ex: 50" inputmode="decimal" 
              style="padding-left: 2.25rem; font-family: ui-monospace, monospace;" />
          </div>
          <button id="cashbackLayBtn" class="btn-toggle">BACK</button>
        </div>
      </div>

      <div style="display: flex; gap: 0.75rem; margin: 0.75rem 0; flex-wrap: wrap;">
        <label class="checkbox-group">
          <input type="checkbox" id="toggleCashbackCommission" />
          <span>Comissão</span>
        </label>
      </div>

      <div id="conditionalFieldsCashback"></div>

      <div class="form-group">
        <label class="form-label" for="cashback_rate">Taxa do Cashback (%)</label>
        <input id="cashback_rate" class="form-input auto-calc" placeholder="ex: 10" inputmode="decimal" />
      </div>
    </div>
  </div>

  <!-- COBERTURAS IGUAL AO ARBIPRO -->
  <div class="card">
    <div class="section-title">Coberturas</div>
    <div id="oddsContainer" class="house-grid"></div>
  </div>

  <!-- AÇÕES PADRONIZADAS -->
  <div class="actions" style="display: flex; gap: 0.75rem; justify-content: center; margin: 1.5rem 0;">
    <button class="btn btn-secondary" id="clearBtn">Limpar Dados</button>
  </div>

  <!-- RESULTADOS IGUAL AO ARBIPRO -->
  <div class="card" id="results" style="display:none">
    <div class="section-title">Resultados Shark FreePro</div>
    <div style="overflow-x:auto">
      <table class="results-table">
        <thead></thead>
        <tbody id="tbody"></tbody>
      </table>
    </div>
  </div>

<script>
'use strict';

// CÓDIGO JAVASCRIPT MANTÉM A FUNCIONALIDADE, MAS USA LAYOUT PADRONIZADO
// Sincronização de tema com parent
(function() {
   function syncTheme() {
    try {
      const parentTheme = parent.document.body.getAttribute('data-theme');
      if (parentTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
      } else {
        document.body.removeAttribute('data-theme');
      }
    } catch (e) {}
  }
  syncTheme();
  try {
    const observer = new MutationObserver(syncTheme);
    observer.observe(parent.document.body, { attributes: true, attributeFilter: ['data-theme'] });
  } catch (e) {}
})();

(function(){
  var autoCalcTimeout = null;
  var isCalculating = false;
  var currentMode = 'freebet';
  
  function $(id){ return document.getElementById(id); }
  function nf(v){ return Number.isFinite(v) ? new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:2}).format(v) : '—'; }
  function toNum(s){ 
    if(s===undefined||s===null) return NaN; 
    var str=String(s).trim(); 
    if(!str) return NaN; 
    if(str.indexOf(',')!==-1 && str.indexOf('.')!==-1) return parseFloat(str.replace(/\.|\,/g, function(match) { return match === ',' ? '.' : ''; })); 
    if(str.indexOf(',')!==-1) return parseFloat(str.replace(',','.')); 
    return parseFloat(str); 
  }

  function effOdd(o,c){ 
    var cc=(Number.isFinite(c)&&c>0)?c/100:0; 
    return 1+(o-1)*(1-cc); 
  }

  function setMode(mode) {
    currentMode = mode;
    document.body.classList.toggle('mode-cashback', mode === 'cashback');
    $('modeFreebetBtn').classList.toggle('active', mode === 'freebet');
    $('modeCashbackBtn').classList.toggle('active', mode === 'cashback');
    clearAll();
    setTimeout(scheduleAutoCalc, 0);
  }

  function debounce(func, wait) {
    return function executedFunction() {
      var args = Array.prototype.slice.call(arguments);
      var later = function() {
        clearTimeout(autoCalcTimeout);
        autoCalcTimeout = null;
        func.apply(null, args);
      };
      clearTimeout(autoCalcTimeout);
      autoCalcTimeout = setTimeout(later, wait);
    };
  }

  var scheduleAutoCalc = debounce(function() {
    if (!isCalculating) {
      if (currentMode === 'freebet') {
        autoCalcFreebet();
      } else {
        autoCalcCashback();
      }
    }
  }, 300);

  function captureCoverageValues(){ 
    var nodes=document.querySelectorAll('#oddsContainer > div'); 
    var out=[]; 
    for(var i=0;i<nodes.length;i++){ 
      var odd=nodes[i].querySelector('input[data-type="odd"]'); 
      var com=nodes[i].querySelector('input[data-type="comm"]'); 
      var lay=nodes[i].querySelector('input[data-type="lay"]'); 
      out.push({odd:odd?odd.value:'', com:com?com.value:'', lay:lay?lay.checked:false}); 
    } 
    return out; 
  }

  function renderOddsInputs(){
    var n=parseInt($("numEntradas").value||'3',10);
    var prev=captureCoverageValues();
    var c=$("oddsContainer"); 
    c.innerHTML='';
    var blocks=Math.max(1,n-1);
    
    for(var i=0;i<blocks;i++){
      var card=document.createElement('div'); 
      card.className='house-card';
      
      var title=document.createElement('div'); 
      title.className='house-title'; 
      title.textContent='Cobertura '+(i+2);
      
      // GRID SIMPLES SEM ODD FINAL
      var grid=document.createElement('div'); 
      grid.className='grid-2';
      grid.style.marginBottom='0.75rem';
      
      var fOdd=document.createElement('div'); 
      fOdd.className='form-group';
      fOdd.style.margin='0';
      var lOdd=document.createElement('label'); 
      lOdd.className='form-label';
      lOdd.textContent='Odd'; 
      var iOdd=document.createElement('input'); 
      iOdd.className='form-input auto-calc';
      iOdd.setAttribute('inputmode','decimal'); 
      iOdd.placeholder='ex: 2,50'; 
      iOdd.setAttribute('data-type','odd');
      
      // COMISSÃO NO GRID
      var fComm=document.createElement('div'); 
      fComm.className='form-group';
      fComm.style.margin='0';
      var lComm=document.createElement('label'); 
      lComm.className='form-label';
      lComm.textContent='Comissão (%)'; 
      var iComm=document.createElement('input'); 
      iComm.className='form-input auto-calc';
      iComm.setAttribute('inputmode','decimal'); 
      iComm.placeholder='ex: 0'; 
      iComm.setAttribute('data-type','comm');
      
      fOdd.appendChild(lOdd); 
      fOdd.appendChild(iOdd);
      fComm.appendChild(lComm); 
      fComm.appendChild(iComm);
      
      grid.appendChild(fOdd);
      grid.appendChild(fComm);
      
      // STAKE COM BOTÃO LAY IGUAL ARBIPRO
      var fStake=document.createElement('div'); 
      fStake.className='form-group';
      var lStake=document.createElement('label'); 
      lStake.className='form-label';
      lStake.textContent='Stake'; 
      var divStake=document.createElement('div');
      divStake.style.cssText='display: flex; gap: 0.5rem;';
      
      var divRelative=document.createElement('div');
      divRelative.style.cssText='position: relative; flex: 1;';
      var spanReal=document.createElement('span');
      spanReal.style.cssText='position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-weight: 600; font-size: 0.75rem;';
      spanReal.textContent='R$';
      var iStake=document.createElement('input'); 
      iStake.className='form-input auto-calc';
      iStake.setAttribute('inputmode','decimal'); 
      iStake.placeholder='auto'; 
      iStake.setAttribute('data-type','stake');
      iStake.style.cssText='padding-left: 2.25rem; font-family: ui-monospace, monospace;';
      
      var btnLay=document.createElement('button');
      btnLay.className='btn-toggle';
      btnLay.setAttribute('data-type','lay');
      btnLay.textContent='BACK';
      
      divRelative.appendChild(spanReal);
      divRelative.appendChild(iStake);
      divStake.appendChild(divRelative);
      divStake.appendChild(btnLay);
      
      fStake.appendChild(lStake);
      fStake.appendChild(divStake);
      
      // CHECKBOXES SIMPLIFICADOS - SEM COMISSÃO (já está no grid)
      var checkboxDiv=document.createElement('div');
      checkboxDiv.style.cssText='display: flex; gap: 0.75rem; margin: 0.75rem 0; flex-wrap: wrap;';
      
      var layLabel=document.createElement('label');
      layLabel.className='checkbox-group';
      layLabel.innerHTML='<span>Configurações da Cobertura</span>';
      
      checkboxDiv.appendChild(layLabel);
      
      // CAMPOS CONDICIONAIS
      var condDiv=document.createElement('div');
      condDiv.setAttribute('data-conditional',i);
      
      if(prev[i]){ 
        iOdd.value=prev[i].odd; 
        iComm.value=prev[i].com || ''; 
        if(prev[i].lay) {
          btnLay.classList.add('active');
          btnLay.textContent='LAY';
        }
      }
      
      card.appendChild(title); 
      card.appendChild(grid);
      card.appendChild(fStake);
      card.appendChild(checkboxDiv);
      card.appendChild(condDiv);
      c.appendChild(card);
    }
    
    bindAutoCalcEvents();
    bindConditionalEvents();
    scheduleAutoCalc();
  }

  function bindConditionalEvents() {
    // Apenas botões LAY (comissão já está sempre visível)
    document.querySelectorAll('[data-type="lay"]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        this.classList.toggle('active');
        if (this.classList.contains('active')) {
          this.textContent = 'LAY';
        } else {
          this.textContent = 'BACK';
        }
        scheduleAutoCalc();
      });
    });
  }

  function readCoverage(){ 
    var odds=[],comm=[],isLay=[];
    var oInputs=document.querySelectorAll('#oddsContainer [data-type="odd"]'); 
    var cInputs=document.querySelectorAll('#oddsContainer [data-type="comm"]'); 
    var lBtns=document.querySelectorAll('#oddsContainer [data-type="lay"]'); 
    
    for(var i=0;i<oInputs.length;i++){
      odds.push(toNum(oInputs[i].value));
    } 
    
    for(var j=0;j<cInputs.length;j++){
      var commValue = toNum(cInputs[j].value);
      comm.push(Number.isFinite(commValue) ? commValue : 0); // Default 0 se vazio
    } 
    
    for(var k=0;k<lBtns.length;k++){
      isLay.push(lBtns[k].classList.contains('active'));
    } 
    
    // Garante que arrays tenham mesmo tamanho
    while(comm.length < odds.length) comm.push(0);
    while(isLay.length < odds.length) isLay.push(false);
    
    return {odds:odds,comm:comm,isLay:isLay}; 
  }

  // CÁLCULO FREEBET CORRIGIDO
  function autoCalcFreebet() {
    isCalculating = true;
    try {
      var o1=toNum($("o1").value);
      var c1_input = document.getElementById('c1');
      var c1 = c1_input ? toNum(c1_input.value) : 0;
      var n=parseInt($("numEntradas").value||'3',10);
      var cov=readCoverage();
      var F=toNum($("F").value);
      var rPerc=toNum($("r").value);
      var s1=toNum($("s1").value);
      
      console.log('DEBUG Freebet:', {o1, c1, n, F, rPerc, s1, cov});
      
      // Validações básicas
      if(!Number.isFinite(o1) || o1<=1) {
        console.log('Odd principal inválida:', o1);
        $("k_S").textContent='R$ 0,00';
        $("results").style.display='none';
        isCalculating = false;
        return;
      }
      
      if(cov.odds.length !== (n-1)) {
        console.log('Número de coberturas incorreto:', cov.odds.length, 'esperado:', n-1);
        $("k_S").textContent='R$ 0,00';
        $("results").style.display='none';
        isCalculating = false;
        return;
      }
      
      if(cov.odds.some(function(v){return !Number.isFinite(v)||v<=1;})) {
        console.log('Odds de cobertura inválidas:', cov.odds);
        $("k_S").textContent='R$ 0,00';
        $("results").style.display='none';
        isCalculating = false;
        return;
      }
      
      if(!Number.isFinite(F) || F<0) {
        console.log('Freebet inválida:', F);
        $("k_S").textContent='R$ 0,00';
        $("results").style.display='none';
        isCalculating = false;
        return;
      }
      
      if(!Number.isFinite(rPerc) || rPerc<0 || rPerc>100) {
        console.log('Taxa extração inválida:', rPerc);
        $("k_S").textContent='R$ 0,00';
        $("results").style.display='none';
        isCalculating = false;
        return;
      }
      
      if(!Number.isFinite(s1) || s1<=0) {
        console.log('Stake principal inválido:', s1);
        $("k_S").textContent='R$ 0,00';
        $("results").style.display='none';
        isCalculating = false;
        return;
      }

      var o1e=effOdd(o1,c1), r=rPerc/100, rF=r*F;
      var A=s1*o1e - rF;

      var stakes=[],eBack=[],commFrac=[],oddsOrig=cov.odds.slice();
      
      for(var i=0;i<cov.odds.length;i++){
        var L=cov.odds[i], cfrac=cov.comm[i]/100;
        commFrac[i]=cfrac;
        
        if(cov.isLay[i]){ 
          var denom=L-1; 
          if(!(denom>0)){
            console.log('Denominador LAY inválido:', denom, 'para odd:', L);
            $("k_S").textContent='R$ 0,00';
            $("results").style.display='none';
            isCalculating = false;
            return;
          }
          var eLay=1+(1-cfrac)/denom; 
          var equivStake=A/eLay; 
          stakes[i]=equivStake/denom; 
          eBack[i]=eLay; 
        } else { 
          var e=effOdd(L,cov.comm[i]); 
          eBack[i]=e; 
          stakes[i]=A/e; 
        }
      }

      var step=parseFloat($("round_step").value)||1; 
      function roundStep(v){return Math.round(v/step)*step;} 
      stakes=stakes.map(roundStep);
      
      var MIN_STAKE = 0.50;
      stakes = stakes.map(function(stake) { return Math.max(stake, MIN_STAKE); });
      
      var liabilities=stakes.map(function(s,i){return cov.isLay[i]?(cov.odds[i]-1)*s:0;});
      var S=s1+stakes.reduce(function(a,s,idx){return a+(cov.isLay[idx]?(cov.odds[idx]-1)*s:s);},0);

      var net1=s1*o1e-S;

      var defs=[], nets=[];
      for(var win=0;win<stakes.length;win++){
        var deficit;
        if(cov.isLay[win]){ 
          var ganhoLay=stakes[win]*(1-commFrac[win]); 
          var liab=liabilities[win]; 
          deficit=ganhoLay-(S-liab); 
        } else { 
          deficit=(stakes[win]*eBack[win]) - S; 
        }
        defs[win]=deficit;
        nets[win]=deficit + rF;
      }

      console.log('Cálculo concluído:', {S, net1, defs, nets});

      $("k_S").textContent=nf(S);
      
      // Atualiza stakes nos inputs
      var stakeInputs = document.querySelectorAll('#oddsContainer [data-type="stake"]');
      stakes.forEach(function(stake, i) {
        if (stakeInputs[i]) {
          stakeInputs[i].value = stake.toFixed(2).replace('.', ',');
        }
      });
      
      updateResultsTable(stakes, defs, nets, net1, o1, c1, s1, oddsOrig, cov, liabilities);
      $("results").style.display='block';
      
    } catch (error) {
      console.error('Erro no cálculo automático freebet:', error);
      $("k_S").textContent='R$ 0,00';
      $("results").style.display='none';
    }
    isCalculating = false;
  }

  function autoCalcCashback() {
    isCalculating = true;
    try {
      var odd = toNum($("cashback_odd").value),
          stake = toNum($("cashback_stake").value),
          cashbackRate = toNum($("cashback_rate").value),
          mainCommCb = toNum($("cashback_comm").value),
          n = parseInt($("numEntradas").value || '3', 10),
          cov = readCoverage();

      if (!Number.isFinite(odd) || odd <= 1 ||
          !Number.isFinite(stake) || stake <= 0 ||
          !Number.isFinite(cashbackRate) || cashbackRate < 0 || cashbackRate > 100 ||
          cov.odds.length !== (n - 1) ||
          cov.odds.some(function(v){ return !Number.isFinite(v) || v <= 1; })) {
        $("k_S").textContent = 'R$ 0,00';
        $("results").style.display = 'none';
        isCalculating = false;
        return;
      }

      var cashbackAmount = stake * (cashbackRate / 100);
      var oddsOrig = cov.odds.slice();
      var commFrac = cov.comm.map(function(c){ return (Number.isFinite(c) && c > 0) ? c/100 : 0; });

      var Oeff = effOdd(odd, mainCommCb);
      var stakes = [], eBack = [];
      var step = parseFloat($("round_step").value) || 1;
      function roundStep(v){ return Math.round(v / step) * step; }
      var MIN_STAKE = 0.50;

      var baseLoss = stake;
      for (var j = 0; j < cov.odds.length; j++) {
        var L = cov.odds[j], cfrac = commFrac[j];
        if (cov.isLay[j]) {
          stakes[j] = baseLoss / (1 - cfrac);
          var denom = L - 1;
          eBack[j] = 1 + (1 - cfrac) / denom;
        } else {
          var e3 = effOdd(L, cov.comm[j]);
          eBack[j] = e3;
          var util3 = (e3 - 1);
          if (!(util3 > 0)) { $("k_S").textContent='R$ 0,00'; $("results").style.display='none'; isCalculating=false; return; }
          stakes[j] = baseLoss / util3;
        }
      }

      stakes = stakes.map(roundStep).map(function(v){ return Math.max(v, MIN_STAKE); });

      var liabilities = stakes.map(function(s, i){
        return cov.isLay[i] ? (cov.odds[i] - 1) * s : 0;
      });

      var S = stake + stakes.reduce(function(a, s, idx){
        return a + (cov.isLay[idx] ? (cov.odds[idx]-1)*s : s);
      }, 0);

      var net1 = (stake * Oeff) - S;

      var defs = [], nets = [];
      for (var win = 0; win < stakes.length; win++) {
        var deficit;
        if (cov.isLay[win]) {
          var ganhoLay = stakes[win] * (1 - commFrac[win]);
          var liab = liabilities[win];
          deficit = ganhoLay - (S - liab);
        } else {
          deficit = (stakes[win] * eBack[win]) - S;
        }
        defs[win] = deficit;
        nets[win] = deficit + cashbackAmount;
      }

      $("k_S").textContent = nf(S);
      
      // Atualiza stakes nos inputs
      var stakeInputs = document.querySelectorAll('#oddsContainer [data-type="stake"]');
      stakes.forEach(function(stake, i) {
        if (stakeInputs[i]) {
          stakeInputs[i].value = stake.toFixed(2).replace('.', ',');
        }
      });
      
      updateResultsTable(stakes, defs, nets, net1, odd, mainCommCb, stake, oddsOrig, cov, liabilities);
      $("results").style.display = 'block';

    } catch (error) {
      console.warn('Erro no cálculo automático cashback:', error);
      $("k_S").textContent = 'R$ 0,00';
      $("results").style.display = 'none';
    }
    isCalculating = false;
  }

  function updateResultsTable(stakes, defs, nets, net1, mainOdd, mainComm, mainStake, oddsOrig, cov, liabilities) {
    var hasLayBets = cov.isLay.some(function(lay) { return lay; });
    var thead = document.querySelector('.results-table thead');
    var headerHTML = hasLayBets
      ? '<tr><th>Cenário</th><th>Odd</th><th>Comissão</th><th>Stake</th><th>Responsabilidade</th><th>Déficit</th><th>Lucro Final</th></tr>'
      : '<tr><th>Cenário</th><th>Odd</th><th>Comissão</th><th>Stake</th><th>Déficit</th><th>Lucro Final</th></tr>';
    thead.innerHTML = headerHTML;

    var tb=$("tbody"); 
    tb.innerHTML='';
    
    function oddf(v){return Number.isFinite(v)?new Intl.NumberFormat('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}).format(v):'—';}
    function pf(v){return Number.isFinite(v)?new Intl.NumberFormat('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}).format(v)+'%':'—';}

    var mainLabel = currentMode === 'cashback' ? '1 vence (Ganhou)' : '1 vence (Casa Promo)';
    var rows=[[ mainLabel, mainOdd, mainComm, mainStake, net1, net1, false, 0, '' ]];
    for(var k=0;k<stakes.length;k++){
      var isLay=cov.isLay[k]; 
      var liab=liabilities[k];
      rows.push([ (k+2)+' vence', oddsOrig[k], cov.comm[k], stakes[k], defs[k], nets[k], isLay, liab, '' ]);
    }

    for(var rix=0; rix<rows.length; rix++){
      var nome=rows[rix][0], odd=rows[rix][1], comm=rows[rix][2], stake=rows[rix][3], 
          deficit=rows[rix][4], final=rows[rix][5], isLayRow=rows[rix][6], liabRow=rows[rix][7];
      
      var apostarCell = '<strong>'+nf(stake)+'</strong>' + (isLayRow ? '<br><span class="text-small">(LAY)</span>' : '');
      var responsabilidadeCell = hasLayBets ? ('<td>' + (isLayRow ? '<strong>'+nf(liabRow)+'</strong>' : '—') + '</td>') : '';

      var deficitClass = deficit >= 0 ? 'profit-positive' : 'profit-negative';
      var finalClass = final >= 0 ? 'profit-positive' : 'profit-negative';
      
      var tr=document.createElement('tr');
      tr.innerHTML = '<td><strong>'+nome+'</strong></td>'+
                     '<td>'+oddf(odd)+'</td>'+
                     '<td>'+pf(comm)+'</td>'+
                     '<td>'+apostarCell+'</td>'+
                     responsabilidadeCell +
                     '<td class="'+deficitClass+'"><strong>'+nf(deficit)+'</strong></td>'+
                     '<td class="'+finalClass+'"><strong>'+nf(final)+'</strong></td>';
      tb.appendChild(tr);
    }
  }

  function clearAll() {
    ["o1","c1","F","r","s1"].forEach(function(id){ var el = $(id); if(el) el.value=''; }); 
    ["cashback_odd","cashback_stake","cashback_rate","cashback_comm"].forEach(function(id){ var el = $(id); if(el) el.value=''; }); 
    $("tbody").innerHTML=''; 
    $("results").style.display='none'; 
    $("k_S").textContent='R$ 0,00'; 
    renderOddsInputs(); 
  }

  function bindAutoCalcEvents() {
    var elements = document.querySelectorAll('.auto-calc');
    for(var i = 0; i < elements.length; i++) {
      elements[i].removeEventListener('input', scheduleAutoCalc);
      elements[i].removeEventListener('change', scheduleAutoCalc);
    }
    for(var j = 0; j < elements.length; j++) {
      if (elements[j].type === 'checkbox') {
        elements[j].addEventListener('change', scheduleAutoCalc);
      } else {
        elements[j].addEventListener('input', scheduleAutoCalc);
        elements[j].addEventListener('change', scheduleAutoCalc);
      }
    }
  }

  // Eventos para campos condicionais da casa promo
  function bindPromoConditionals() {
    // Comissão freebet
    var toggleComm1 = document.getElementById('toggleCommission1');
    if (toggleComm1) {
      toggleComm1.addEventListener('change', function() {
        var condDiv = document.getElementById('conditionalFields1');
        if (this.checked) {
          if (!document.getElementById('c1')) {
            condDiv.innerHTML += '<div class="form-group"><label class="form-label">Comissão (%)</label><input id="c1" class="form-input auto-calc" placeholder="ex: 0" inputmode="decimal" /></div>';
            bindAutoCalcEvents();
          }
        } else {
          var c1Input = document.getElementById('c1');
          if (c1Input) c1Input.closest('.form-group').remove();
        }
        scheduleAutoCalc();
      });
    }

    // Comissão cashback
    var toggleCashbackComm = document.getElementById('toggleCashbackCommission');
    if (toggleCashbackComm) {
      toggleCashbackComm.addEventListener('change', function() {
        var condDiv = document.getElementById('conditionalFieldsCashback');
        if (this.checked) {
          if (!document.getElementById('cashback_comm')) {
            condDiv.innerHTML += '<div class="form-group"><label class="form-label">Comissão (%)</label><input id="cashback_comm" class="form-input auto-calc" placeholder="ex: 0" inputmode="decimal" /></div>';
            bindAutoCalcEvents();
          }
        } else {
          var commInput = document.getElementById('cashback_comm');
          if (commInput) commInput.closest('.form-group').remove();
        }
        scheduleAutoCalc();
      });
    }

    // Botão LAY promo freebet
    var promoLayBtn = document.getElementById('promoLayBtn');
    if (promoLayBtn) {
      promoLayBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        this.textContent = this.classList.contains('active') ? 'LAY' : 'BACK';
        scheduleAutoCalc();
      });
    }

    // Botão LAY cashback
    var cashbackLayBtn = document.getElementById('cashbackLayBtn');
    if (cashbackLayBtn) {
      cashbackLayBtn.addEventListener('click', function() {
        this.classList.toggle('active'); 
        this.textContent = this.classList.contains('active') ? 'LAY' : 'BACK';
        scheduleAutoCalc();
      });
    }
  }

  // Inicialização
  window.addEventListener('DOMContentLoaded', function(){
    renderOddsInputs();
    bindAutoCalcEvents();
    bindPromoConditionals();

    $("numEntradas") && $("numEntradas").addEventListener('change', renderOddsInputs);
    $("clearBtn") && $("clearBtn").addEventListener('click', clearAll);
    $('modeFreebetBtn') && $('modeFreebetBtn').addEventListener('click', function(){ setMode('freebet'); });
    $('modeCashbackBtn') && $('modeCashbackBtn').addEventListener('click', function(){ setMode('cashback'); });
    $("shareBtn") && $("shareBtn").addEventListener('click', function(){
      try {
        if (window.parent && window.parent.SharkGreen && window.parent.SharkGreen.shareUI) {
          window.parent.SharkGreen.shareUI.handleShareClick('freepro');
        } else {
          alert('Sistema de compartilhamento não disponível');
        }
      } catch (e) {
        alert('Erro ao compartilhar configuração');
      }
    });

    setTimeout(scheduleAutoCalc, 500);
  });
})();
</script>
</body>
</html>`;
}
