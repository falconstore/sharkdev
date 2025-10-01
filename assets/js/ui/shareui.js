// assets/js/ui/shareui.js - VERSÃO CORRIGIDA COMPLETA
import { ShareSystem } from '../utils/share.js';

function $(root, sel) {
  try { return (root || document).querySelector(sel) || null; } catch { return null; }
}
function qsa(root, sel) {
  try { return Array.from((root || document).querySelectorAll(sel)); } catch { return []; }
}
function val(input) {
  if (!input) return '';
  const v = (input.value ?? '').toString().trim();
  return v;
}
function num(input, fallback = null) {
  const v = val(input);
  if (v === '') return fallback;
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) ? n : fallback;
}
function bool(el) {
  if (!el) return false;
  if ('checked' in el) return !!el.checked;
  return !!el.value;
}
function any(...xs) {
  for (const x of xs) {
    if (!x) continue;
    if (typeof x === 'string') {
      const el = document.querySelector(x);
      if (el) return el;
    } else if (Array.isArray(x) && x.length === 2 && x[0] && x[1]) {
      try {
        const el = x[0].querySelector(x[1]);
        if (el) return el;
      } catch {}
    }
  }
  return null;
}

const SEL = {
  arbipro: {
    rounding: '#rounding',
    numHouses: '#numHouses',
    houseRow: (i) => `#card-${i}`,
    odd:   (i) => `#odd-${i}`,
    stake: (i) => `#stake-${i}`,
    comm:  (i) => `#commission-${i}`,
    commCheck: (i) => `input[data-action="toggleCommission"][data-idx="${i}"]`,
    freebet:(i)=> `input[data-action="toggleFreebet"][data-idx="${i}"]`,
    increase:(i)=> `#increase-${i}`,
    increaseCheck:(i)=> `input[data-action="toggleIncrease"][data-idx="${i}"]`,
    lay:   (i) => `button[data-action="toggleLay"][data-idx="${i}"]`,
    fixed: (i) => `button[data-action="fixStake"][data-idx="${i}"]`,
  },
  freepro: {
    iframe: '#calc2frame',
    numEntradas: '#numEntradas',
    roundStep:   '#round_step',
    modeFreebetBtn: '#modeFreebetBtn',
    modeCashbackBtn: '#modeCashbackBtn',
    // Freebet
    promoOdd:      '#o1',
    promoComm:     '#c1',
    promoStake:    '#s1',
    freebetValue:  '#F',
    extractionRate:'#r',
    // Cashback
    cashbackOdd:   '#cashback_odd',
    cashbackComm:  '#cashback_comm',
    cashbackStake: '#cashback_stake',
    cashbackRate:  '#cashback_rate',
    // Coberturas
    covOdd:  (i) => `input[data-type="odd"]`,
    covComm: (i) => `input[data-type="comm"]`,
    covLay:  (i) => `input[data-type="lay"]`,
  },
};

export class ShareUI {
  constructor() {
    this.initialized = false;
    this.shareSystem = null;
    this.handleShareClick = this.handleShareClick.bind(this);
  }

  async init() {
    try {
      this.shareSystem = new ShareSystem();
      this.initialized = true;
      console.log('✅ ShareUI inicializado');
    } catch (e) {
      console.error('❌ Falha ao inicializar ShareUI:', e);
      this.initialized = false;
    }
  }

  handleShareClick(evOrCalc) {
    try {
      if (typeof evOrCalc === 'string') {
        const calc = /freepro/i.test(evOrCalc) ? 'freepro' : 'arbipro';
        this.openShareModal(calc);
        return;
      }

      const ev = evOrCalc;
      if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();

      const el = ev?.currentTarget || ev?.target || null;
      let calc = this._guessCalculatorFromElement(el);
      if (!calc) calc = 'arbipro';

      this.openShareModal(calc);
    } catch (err) {
      console.error('Erro em handleShareClick:', err);
      alert('Não foi possível iniciar o compartilhamento. Veja o console.');
    }
  }

  _guessCalculatorFromElement(el) {
    if (!el) return null;

    const ds = el.dataset || {};
    const hinted = ds.calc || ds.shareCalc || ds.calculator || ds.share || null;
    if (hinted && /freepro/i.test(hinted)) return 'freepro';
    if (hinted && /arbi/i.test(hinted))   return 'arbipro';

    const id = (el.id || '').toLowerCase();
    if (id.includes('freepro')) return 'freepro';
    if (id.includes('arbipro') || id.includes('arbi')) return 'arbipro';

    const txt = (el.textContent || '').toLowerCase();
    if (txt.includes('freepro')) return 'freepro';
    if (txt.includes('arbipro') || txt.includes('arbi')) return 'arbipro';

    const withData = el.closest?.('[data-calc],[data-share],[data-calculator]');
    if (withData) {
      const ds2 = withData.dataset || {};
      const hinted2 = ds2.calc || ds2.share || ds2.calculator || null;
      if (hinted2 && /freepro/i.test(hinted2)) return 'freepro';
      if (hinted2 && /arbi/i.test(hinted2))    return 'arbipro';
    }

    return null;
  }

  async openShareModal(calculator = 'arbipro') {
    console.log('=== INICIANDO COMPARTILHAMENTO ===');
    console.log('Calculadora:', calculator);

    if (!this.shareSystem) {
      alert('Sistema de compartilhamento não disponível');
      return;
    }

    try {
      let data = null;

      if (calculator === 'arbipro') {
        data = this.getArbiProData();
      } else if (calculator === 'freepro') {
        data = this.getFreeProData();
      }

      console.log('Dados capturados:', data);

      if (!data || !this.hasValidData(data, calculator)) {
        alert('Preencha os dados da calculadora antes de compartilhar');
        return;
      }

      const shareLink = calculator === 'arbipro'
        ? this.shareSystem.generateArbiProLink(data)
        : this.shareSystem.generateFreeProLink(data);

      console.log('Link gerado:', shareLink);
      this.showShareModal(shareLink);
    } catch (error) {
      console.error('❌ Erro ao compartilhar:', error);
      alert('Erro ao gerar link de compartilhamento: ' + error.message);
    }
  }

  hasValidData(data, calculator) {
    if (!data) return false;

    if (calculator === 'arbipro') {
      return Array.isArray(data.houses) && data.houses.some(h => h && h.o);
    }

    if (calculator === 'freepro') {
      if (!data.p) return false;
      if (data.mode !== 'cashback') {
        return !!(data.p.o || data.p.s || data.p.f);
      }
      return !!(data.p.o || data.p.s || data.p.r);
    }

    return false;
  }

  getArbiProData() {
    console.log('Capturando dados ArbiPro...');
    try {
      const numHousesEl = any(SEL.arbipro.numHouses);
      const numHouses = parseInt(val(numHousesEl) || '2', 10);
      
      const roundingEl = any(SEL.arbipro.rounding);
      const rounding = num(roundingEl, 0.01);

      const data = { 
        numHouses: numHouses,
        rounding: Number.isFinite(rounding) ? rounding : 0.01, 
        houses: [] 
      };

      for (let i = 0; i < numHouses; i++) {
        const row = any(SEL.arbipro.houseRow(i));
        if (!row) continue;

        const o = num(any(row, SEL.arbipro.odd(i)), null);
        
        // 🔥 CORREÇÃO: Só captura stake da Casa 1 (índice 0)
        const s = i === 0 ? num(any(row, SEL.arbipro.stake(i)), null) : null;
        
        // Verifica se checkbox de comissão está marcada
        const commCheck = any(row, SEL.arbipro.commCheck(i));
        const hasComm = commCheck ? commCheck.checked : false;
        const c = hasComm ? num(any(row, SEL.arbipro.comm(i)), null) : null;
        
        // Verifica se checkbox de freebet está marcada
        const freebetCheck = any(row, SEL.arbipro.freebet(i));
        const f = freebetCheck ? freebetCheck.checked : false;
        
        // Verifica se checkbox de aumento está marcada
        const increaseCheck = any(row, SEL.arbipro.increaseCheck(i));
        const hasIncrease = increaseCheck ? increaseCheck.checked : false;
        const inc = hasIncrease ? num(any(row, SEL.arbipro.increase(i)), null) : null;
        
        // Verifica se botão LAY está ativo
        const layBtn = any(row, SEL.arbipro.lay(i));
        const l = layBtn ? layBtn.classList.contains('active') : false;
        
        // Verifica se está fixado (só Casa 1 deve estar)
        const fixBtn = any(row, SEL.arbipro.fixed(i));
        const x = fixBtn ? fixBtn.classList.contains('btn-primary') : (i === 0);

        data.houses.push({
          o: o ?? '',
          s: s ?? '',
          c: c,
          f: f,
          i: inc,
          l: l,
          x: x,
        });
      }

      console.log('Dados ArbiPro finais:', data);
      return data;
    } catch (error) {
      console.error('Erro ao capturar dados ArbiPro:', error);
      return null;
    }
  }

  getFreeProData() {
    console.log('Capturando dados FreePro...');
    try {
      const iframe = any(SEL.freepro.iframe);
      const frame = typeof iframe?.contentDocument !== 'undefined' ? iframe : null;
      if (!frame) {
        console.error('Iframe FreePro não encontrado');
        return null;
      }

      const doc = frame.contentDocument;
      
      // 🔥 CORREÇÃO: Detecta modo correto
      const isCashback = doc.body.classList.contains('mode-cashback');
      const mode = isCashback ? 'cashback' : 'freebet';

      const n = Math.max(2, parseInt(val($(doc, SEL.freepro.numEntradas)) || '3', 10) || 3);
      const r = num($(doc, SEL.freepro.roundStep), 1.0) ?? 1.0;

      const p = {};
      
      if (isCashback) {
        p.o = num($(doc, SEL.freepro.cashbackOdd), '') ?? '';
        p.c = num($(doc, SEL.freepro.cashbackComm), '') ?? '';
        p.s = num($(doc, SEL.freepro.cashbackStake), '') ?? '';
        p.r = num($(doc, SEL.freepro.cashbackRate), '') ?? '';
        p.f = '';
        p.e = '';
      } else {
        p.o = num($(doc, SEL.freepro.promoOdd), '') ?? '';
        p.c = num($(doc, SEL.freepro.promoComm), '') ?? '';
        p.s = num($(doc, SEL.freepro.promoStake), '') ?? '';
        p.f = num($(doc, SEL.freepro.freebetValue), '') ?? '';
        p.e = num($(doc, SEL.freepro.extractionRate), 70) ?? 70;
        p.r = '';
      }

      const cov = [];
      const cards = qsa(doc, '#oddsContainer > div');
      
      for (let i = 0; i < cards.length && i < (n - 1); i++) {
        const card = cards[i];
        const oddInputs = qsa(card, SEL.freepro.covOdd(i + 2));
        const commInputs = qsa(card, SEL.freepro.covComm(i + 2));
        const layInputs = qsa(card, SEL.freepro.covLay(i + 2));

        const cOdd  = oddInputs[0] ? num(oddInputs[0], '') : '';
        const cComm = commInputs[0] ? num(commInputs[0], '') : '';
        const cLay  = layInputs[0] ? bool(layInputs[0]) : false;

        cov.push({
          odd:  cOdd  === '' ? '' : cOdd,
          comm: cComm === '' ? '' : cComm,
          lay:  cLay,
        });
      }

      const data = { n, r, p, cov, mode };
      console.log('Dados FreePro finais:', data);
      return data;
    } catch (error) {
      console.error('Erro ao capturar dados FreePro:', error);
      return null;
    }
  }

  showShareModal(url) {
    try {
      let overlay = document.getElementById('shareOverlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'shareOverlay';
        overlay.style.cssText = `
          position: fixed; inset: 0; z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.6);
        `;
        document.body.appendChild(overlay);
      }

      overlay.innerHTML = `
        <div id="shareCard" style="
          width: min(560px, 92vw);
          background: #0f172a;
          border: 1px solid #1f2a36;
          color: #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.45);
          font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Arial;
        ">
          <div style="display:flex; align-items:center; gap:.75rem; margin-bottom: 12px;">
            <span style="font-size: 22px;">🔗</span>
            <h3 style="margin:0; font-size: 18px;">Link de Compartilhamento</h3>
          </div>
          <p style="margin: 0 0 12px; color: #94a3b8;">Copie o link abaixo para compartilhar suas configurações.</p>
          <textarea id="shareUrlText" readonly style="
            width:100%; height: 112px; resize: none; padding: 12px;
            border-radius: 12px; background: #0b1220; border: 1px solid #1f2a36;
            color:#93c5fd; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
            word-break: break-all;
          ">${url}</textarea>
          <div style="display:flex; gap: 12px; margin-top: 14px;">
            <button id="copyBtn" style="
              flex:1; padding: 10px 14px; border: none; border-radius: 10px;
              background: linear-gradient(135deg, #3b82f6, #22c55e); color:white; font-weight: 600;
              cursor: pointer;
            ">Copiar Link</button>
            <button id="closeBtn" style="
              padding: 10px 14px; border: 1px solid #334155; border-radius: 10px;
              background: #0b1220; color: #cbd5e1; cursor: pointer;
            ">Fechar</button>
          </div>
        </div>
      `;

      const ta = document.getElementById('shareUrlText');
      const copyBtn = document.getElementById('copyBtn');
      const closeBtn = document.getElementById('closeBtn');

      if (copyBtn && ta) {
        copyBtn.onclick = async () => {
          try {
            ta.select();
            await navigator.clipboard.writeText(ta.value);
            copyBtn.textContent = 'Copiado!';
            setTimeout(() => (copyBtn.textContent = 'Copiar Link'), 1600);
          } catch {
            try {
              document.execCommand('copy');
              copyBtn.textContent = 'Copiado!';
              setTimeout(() => (copyBtn.textContent = 'Copiar Link'), 1600);
            } catch {
              alert('Não foi possível copiar automaticamente. Copie manualmente.');
            }
          }
        };
      }
      if (closeBtn) {
        closeBtn.onclick = () => overlay.remove();
      }
    } catch (e) {
      console.error('Erro ao exibir modal de compartilhamento:', e);
      alert('Falha ao exibir o link. Veja o console.');
    }
  }

  bindButtons(selectors = { arbipro: '#shareBtn', freepro: '#shareBtn' }) {
    const tryBind = (sel, fn) => {
      let tries = 0;
      const MAX = 20;
      const iv = setInterval(() => {
        const el = document.querySelector(sel);
        if (el) {
          clearInterval(iv);
          el.addEventListener('click', fn, { passive: true });
          console.log(`✅ Botão vinculado: ${sel}`);
          return;
        }
        tries++;
        if (tries >= MAX) {
          clearInterval(iv);
          console.warn(`⚠️ Não foi possível vincular: ${sel} após ${MAX} tentativas`);
        }
      }, 250);
    };

    if (selectors.arbipro) tryBind(selectors.arbipro, this.handleShareClick);
    if (selectors.freepro) tryBind(selectors.freepro, this.handleShareClick);
  }
}

export default ShareUI;
