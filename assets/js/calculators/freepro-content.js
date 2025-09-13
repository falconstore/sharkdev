<script>
'use strict';

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
    } catch (e) {
      // Fallback se não conseguir acessar o parent
    }
  }
  syncTheme();
  try {
    const observer = new MutationObserver(syncTheme);
    observer.observe(parent.document.body, { attributes: true, attributeFilter: ['data-theme'] });
  } catch (e) {}
})();

(function(){
  // SISTEMA DE CÁLCULO AUTOMÁTICO
  var autoCalcTimeout = null;
  var isCalculating = false;
  var currentMode = 'freebet'; // 'freebet' ou 'cashback'
  
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
  function showStatus(cls,msg){ 
    var el=$("status"); 
    el.className='alert alert-'+cls; 
    el.style.display='block'; 
    el.textContent=msg; 
  }
  function hideStatus(){ $("status").style.display='none'; }
  function effOdd(o,c){ 
    var cc=(Number.isFinite(c)&&c>0)?c/100:0; 
    return 1+(o-1)*(1-cc); 
  }

  // Alterna modo (sem sobrescrever outras classes do <body>)
  function setMode(mode) {
    currentMode = mode;
    document.body.classList.toggle('mode-cashback', mode === 'cashback');
    $('modeFreebetBtn').classList.toggle('active', mode === 'freebet');
    $('modeCashbackBtn').classList.toggle('active', mode === 'cashback');
    clearAll();
    setTimeout(scheduleAutoCalc, 0);
  }

  // Debounce para otimizar performance
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

  // Cálculo automático com debounce
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
      card.className='coverage-card';
      
      var title=document.createElement('div'); 
      title.className='coverage-title'; 
      title.innerHTML='<span style="width:10px;height:10px;border-radius:50%;background:currentColor;display:inline-block"></span>Resultado '+(i+2);
      
      var fieldsDiv=document.createElement('div'); 
      fieldsDiv.className='coverage-fields';
      
      var fOdd=document.createElement('div'); 
      fOdd.className='form-group';
      fOdd.style.margin='0';
      var lOdd=document.createElement('label'); 
      lOdd.className='form-label';
      lOdd.textContent='Odd'; 
      var iOdd=document.createElement('input'); 
      iOdd.className='form-control auto-calc';
      iOdd.setAttribute('inputmode','decimal'); 
      iOdd.placeholder='ex: 2,50'; 
      iOdd.setAttribute('data-type','odd');
      
      var fCom=document.createElement('div'); 
      fCom.className='form-group';
      fCom.style.margin='0';
      var lCom=document.createElement('label'); 
      lCom.className='form-label';
      lCom.textContent='Comissão (%)'; 
      var iCom=document.createElement('input'); 
      iCom.className='form-control auto-calc';
      iCom.setAttribute('inputmode','decimal'); 
      iCom.placeholder='ex: 0'; 
      iCom.setAttribute('data-type','comm');
      
      var fLay=document.createElement('div'); 
      fLay.className='checkbox-wrapper'; 
      var iLay=document.createElement('input'); 
      iLay.type='checkbox'; 
      iLay.className='auto-calc';
      iLay.setAttribute('data-type','lay'); 
      var tLay=document.createElement('span'); 
      tLay.textContent='Lay';
      
      if(prev[i]){ 
        iOdd.value=prev[i].odd; 
        iCom.value=prev[i].com; 
        iLay.checked=!!prev[i].lay; 
      }
      
      fOdd.appendChild(lOdd); 
      fOdd.appendChild(iOdd);
      fCom.appendChild(lCom); 
      fCom.appendChild(iCom);
      fLay.appendChild(iLay); 
      fLay.appendChild(tLay);
      
      fieldsDiv.appendChild(fOdd); 
      fieldsDiv.appendChild(fCom); 
      fieldsDiv.appendChild(fLay);
      
      card.appendChild(title); 
      card.appendChild(fieldsDiv);
      c.appendChild(card);
    }
    
    // Aplica listeners nos novos elementos
    bindAutoCalcEvents();
    scheduleAutoCalc();
  }

  function readCoverage(){ 
    var odds=[],comm=[],isLay=[];
    var oInputs=document.querySelectorAll('#oddsContainer input[data-type="odd"]'); 
    var cInputs=document.querySelectorAll('#oddsContainer input[data-type="comm"]'); 
    var lInputs=document.querySelectorAll('#oddsContainer input[data-type="lay"]'); 
    
    for(var i=0;i<oInputs.length;i++){odds.push(toNum(oInputs[i].value));} 
    for(var j=0;j<cInputs.length;j++){comm.push(toNum(cInputs[j].value));} 
    for(var k=0;k<lInputs.length;k++){isLay.push(!!lInputs[k].checked);} 
    
    return {odds:odds,comm:comm,isLay:isLay}; 
  }

  // CÁLCULO FREEBET (original)
  function autoCalcFreebet() {
    isCalculating = true;
    try {
      hideStatus();
      var o1=toNum($("o1").value), c1=toNum($("c1").value), n=parseInt($("numEntradas").value||'3',10), 
          cov=readCoverage(), F=toNum($("F").value), rPerc=toNum($("r").value), s1=toNum($("s1").value);
      
      if(!Number.isFinite(o1)||o1<=1||
         cov.odds.length!==(n-1)||cov.odds.some(function(v){return !Number.isFinite(v)||v<=1;})||
         !Number.isFinite(F)||F<0||
         !Number.isFinite(rPerc)||rPerc<0||rPerc>100||
         !Number.isFinite(s1)||s1<=0) {
        $("k_S").textContent='—';
        $("results").style.display='none';
        isCalculating = false;
        return;
      }

      var o1e=effOdd(o1,c1), r=rPerc/100, rF=r*F;
      var A=s1*o1e - rF;

      var stakes=[],eBack=[],commFrac=[],oddsOrig=cov.odds.slice();
      
      for(var i=0;i<cov.odds.length;i++){
        var L=cov.odds[i], cfrac=(Number.isFinite(cov.comm[i])&&cov.comm[i]>0)?cov.comm[i]/100:0; 
        commFrac[i]=cfrac;
        
        if(cov.isLay[i]){ 
          var denom=L-1; 
          if(!(denom>0)){
            $("k_S").textContent='—';
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

      $("k_S").textContent=nf(S);
      updateResultsTable(stakes, defs, nets, net1, o1, c1, s1, oddsOrig, cov, liabilities);
      $("results").style.display='block';
      
    } catch (error) {
      console.warn('Erro no cálculo automático freebet:', error);
      $("k_S").textContent='—';
      $("results").style.display='none';
    }
    isCalculating = false;
  }

  // CASHBACK — BACK-only com nivelamento analítico + fallback quando houver LAY
  function autoCalcCashback() {
    isCalculating = true;
    try {
      hideStatus();
      var odd = toNum($("cashback_odd").value),
          stake = toNum($("cashback_stake").value),
          cashbackRate = toNum($("cashback_rate").value),
          n = parseInt($("numEntradas").value || '3', 10),
          cov = readCoverage();

      if (!Number.isFinite(odd) || odd <= 1 ||
          !Number.isFinite(stake) || stake <= 0 ||
          !Number.isFinite(cashbackRate) || cashbackRate < 0 || cashbackRate > 100 ||
          cov.odds.length !== (n - 1) ||
          cov.odds.some(function(v){ return !Number.isFinite(v) || v <= 1; })) {
        $("k_S").textContent = '—';
        $("results").style.display = 'none';
        isCalculating = false;
        return;
      }

      var cashbackAmount = stake * (cashbackRate / 100);
      var oddsOrig = cov.odds.slice();
      var commFrac = cov.comm.map(function(c){ return (Number.isFinite(c) && c > 0) ? c/100 : 0; });
      var onlyBack = !cov.isLay.some(Boolean);

      var stakes = [], eBack = [];
      var step = parseFloat($("round_step").value) || 1;
      function roundStep(v){ return Math.round(v / step) * step; }
      var MIN_STAKE = 0.50;

      if (onlyBack) {
        // e_i = odd efetiva com comissão
        for (var i = 0; i < cov.odds.length; i++) {
          var e = effOdd(cov.odds[i], cov.comm[i]); // 1 + (L-1)*(1 - c%)
          eBack[i] = e;
        }
        // H = Σ (1/e_i)
        var H = eBack.reduce(function(a, e){ return a + (1 / e); }, 0);

        if (H >= 1) {
          // Impossível nivelar — fallback simples
          showStatus('warning', 'Impossível nivelar (Σ 1/e ≥ 1). Usando modo de cobertura.');
          var baseLoss = stake;
          for (var j = 0; j < cov.odds.length; j++) {
            var e2 = eBack[j];
            var util = (e2 - 1);
            if (!(util > 0)) { $("k_S").textContent='—'; $("results").style.display='none'; isCalculating=false; return; }
            stakes[j] = baseLoss / util;
          }
        } else {
          // Nível analítico (bate com seus exemplos)
          var P = stake, O = odd, C = cashbackAmount;
          // N = -P * (1 - O + H*O) + H * C
          var N = -P * (1 - O + H*O) + H * C;
          // S_total = P*O - N
          var S_total = P * O - N;
          // s_i = (N + S_total - C) / e_i
          var numer = (N + S_total - C);
          for (var k = 0; k < eBack.length; k++) {
            stakes[k] = numer / eBack[k];
          }
        }
      } else {
        // FALLBACK quando existe LAY
        var baseLossLay = stake;
        for (var m = 0; m < cov.odds.length; m++) {
          var L = cov.odds[m], cfrac = commFrac[m];
          if (cov.isLay[m]) {
            // ganho quando a seleção perde = stakeLay * (1 - comissão)
            stakes[m] = baseLossLay / (1 - cfrac);
            var denom = L - 1;
            eBack[m] = 1 + (1 - cfrac) / denom; // só para exibição coerente
          } else {
            var e3 = effOdd(L, cov.comm[m]);
            eBack[m] = e3;
            var util3 = (e3 - 1);
            if (!(util3 > 0)) { $("k_S").textContent='—'; $("results").style.display='none'; isCalculating=false; return; }
            stakes[m] = baseLossLay / util3;
          }
        }
      }

      // Arredonda e aplica mínimo
      stakes = stakes.map(roundStep).map(function(v){ return Math.max(v, MIN_STAKE); });

      // Responsabilidades LAY
      var liabilities = stakes.map(function(s, i){
        return cov.isLay[i] ? (cov.odds[i] - 1) * s : 0;
      });

      // Stake total S (para LAY soma a responsabilidade)
      var S = stake + stakes.reduce(function(a, s, idx){
        return a + (cov.isLay[idx] ? (cov.odds[idx]-1)*s : s);
      }, 0);

      // (1) Principal vence: sem cashback
      var net1 = (stake * (odd - 1)) - (S - stake);

      // (2) Coberturas vencem: principal perde — soma cashback
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
      updateResultsTable(stakes, defs, nets, net1, odd, 0, stake, oddsOrig, cov, liabilities);
      $("results").style.display = 'block';

    } catch (error) {
      console.warn('Erro no cálculo automático cashback:', error);
      $("k_S").textContent = '—';
      $("results").style.display = 'none';
    }
    isCalculating = false;
  }

  function updateResultsTable(stakes, defs, nets, net1, mainOdd, mainComm, mainStake, oddsOrig, cov, liabilities) {
    var hasLayBets = cov.isLay.some(function(lay) { return lay; });
    var thead = document.querySelector('.results-table thead');
    var headerHTML = hasLayBets
      ? '<tr><th>Cenário</th><th>Odd</th><th>Comissão</th><th>Apostar</th><th>Responsabilidade</th><th>Déficit</th><th>Lucro Final</th></tr>'
      : '<tr><th>Cenário</th><th>Odd</th><th>Comissão</th><th>Apostar</th><th>Déficit</th><th>Lucro Final</th></tr>';
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
    ["cashback_odd","cashback_stake","cashback_rate"].forEach(function(id){ var el = $(id); if(el) el.value=''; }); 
    $("tbody").innerHTML=''; 
    $("results").style.display='none'; 
    $("k_S").textContent='—'; 
    hideStatus(); 
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

  // Inicialização
  window.addEventListener('DOMContentLoaded', function(){
    renderOddsInputs();
    bindAutoCalcEvents();

    // Listeners principais (aqui dentro garante que os elementos existam)
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

    // Cálculo inicial se houver dados
    setTimeout(scheduleAutoCalc, 500);
  });
})();
</script>
