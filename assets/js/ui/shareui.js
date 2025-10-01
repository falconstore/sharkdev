// assets/js/ui/shareui.js - VERSÃO COM RETRY ROBUSTO
import { ShareSystem } from '../utils/share.js';

export class ShareUI {
  constructor() {
    this.shareSystem = new ShareSystem();
    this.modal = null;
    this.initialized = false;
  }

  async init() {
    console.log('🚀 Inicializando ShareUI...');
    this.createModal();
    this.loadSharedConfig();
    this.initialized = true;
    console.log('✅ ShareUI inicializado');
  }

  createModal() {
    if (document.getElementById('shareModal')) return;

    const modal = document.createElement('div');
    modal.id = 'shareModal';
    modal.innerHTML = `
      <div id="shareOverlay" style="
        display: none;
        position: fixed;
        inset: 0;
        z-index: 10000;
        background: rgba(0,0,0,0.85);
        align-items: center;
        justify-content: center;
      ">
        <div style="
          background: var(--bg-card);
          border-radius: 16px;
          padding: 2rem;
          width: 90%;
          max-width: 600px;
          border: 2px solid var(--primary);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h3 style="margin: 0; color: var(--text-primary); font-size: 1.5rem;">
              🔗 Link de Compartilhamento
            </h3>
            <button id="closeShareModal" style="
              background: none;
              border: none;
              font-size: 2rem;
              cursor: pointer;
              color: var(--text-muted);
              line-height: 1;
              padding: 0;
              width: 32px;
              height: 32px;
            ">&times;</button>
          </div>
          
          <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.875rem;">
            Copie o link abaixo para compartilhar suas configurações:
          </p>
          
          <textarea id="shareUrlInput" readonly style="
            width: 100%;
            height: 120px;
            padding: 1rem;
            border: 2px solid var(--border);
            border-radius: 12px;
            background: var(--bg-secondary);
            color: var(--primary);
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
            resize: none;
            margin-bottom: 1.5rem;
            word-break: break-all;
          "></textarea>
          
          <div style="display: flex; gap: 1rem;">
            <button id="copyShareBtn" class="btn btn-primary" style="flex: 1; font-size: 1rem; padding: 1rem;">
              📋 Copiar Link
            </button>
            <button id="closeShareBtn" class="btn btn-secondary" style="padding: 1rem 1.5rem;">
              Fechar
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.bindModalEvents();
  }

  bindModalEvents() {
    const overlay = document.getElementById('shareOverlay');
    const closeBtn1 = document.getElementById('closeShareModal');
    const closeBtn2 = document.getElementById('closeShareBtn');
    const copyBtn = document.getElementById('copyShareBtn');

    const close = () => overlay.style.display = 'none';
    
    closeBtn1.onclick = close;
    closeBtn2.onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };
    
    copyBtn.onclick = async () => {
      const input = document.getElementById('shareUrlInput');
      try {
        await navigator.clipboard.writeText(input.value);
        copyBtn.innerHTML = '✅ Link Copiado!';
        setTimeout(() => { copyBtn.innerHTML = '📋 Copiar Link'; }, 2000);
      } catch (e) {
        input.select();
        document.execCommand('copy');
        copyBtn.innerHTML = '✅ Link Copiado!';
        setTimeout(() => { copyBtn.innerHTML = '📋 Copiar Link'; }, 2000);
      }
    };
  }

  async share(calculator) {
    console.log('='.repeat(50));
    console.log('📤 COMPARTILHANDO:', calculator.toUpperCase());
    console.log('='.repeat(50));
    
    try {
      let data, url;
      
      if (calculator === 'arbipro') {
        data = this.getArbiProData();
        url = this.shareSystem.generateArbiProLink(data);
      } else if (calculator === 'freepro') {
        data = this.getFreeProData();
        url = this.shareSystem.generateFreeProLink(data);
      } else {
        throw new Error('Calculadora inválida: ' + calculator);
      }

      this.showModal(url);
      
    } catch (error) {
      console.error('❌ ERRO ao compartilhar:', error);
      alert('Erro ao gerar link: ' + error.message);
    }
  }

  showModal(url) {
    const overlay = document.getElementById('shareOverlay');
    const input = document.getElementById('shareUrlInput');
    
    input.value = url;
    overlay.style.display = 'flex';
    
    setTimeout(() => {
      input.select();
      input.focus();
    }, 100);
  }

  getArbiProData() {
    console.log('📸 Capturando dados ArbiPro...');
    
    const app = window.SharkGreen?.arbiPro;
    if (!app) {
      throw new Error('ArbiPro não encontrado');
    }

    const houses = app.houses.slice(0, app.numHouses).map(house => {
      const normalized = {
        odd: house.odd || '',
        stake: house.stake || '',
        commission: null,
        increase: null,
        freebet: false,
        lay: false,
        fixedStake: false
      };

      if (house.commission !== null && house.commission !== undefined) {
        normalized.commission = house.commission;
      }

      if (house.increase !== null && house.increase !== undefined) {
        normalized.increase = house.increase;
      }

      if (house.freebet === true) {
        normalized.freebet = true;
      }

      if (house.lay === true) {
        normalized.lay = true;
      }

      if (house.fixedStake === true) {
        normalized.fixedStake = true;
      }

      return normalized;
    });

    const data = {
      numHouses: app.numHouses,
      rounding: app.roundingValue,
      houses: houses
    };
    
    console.log('✅ Dados capturados (normalizados):', data);
    return data;
  }

  getFreeProData() {
    console.log('📸 Capturando dados FreePro...');
    
    const iframe = document.getElementById('calc2frame');
    if (!iframe?.contentDocument) {
      throw new Error('FreePro não encontrado');
    }

    const doc = iframe.contentDocument;
    const $ = (id) => doc.getElementById(id);
    
    const mode = doc.body.classList.contains('mode-cashback') ? 'cashback' : 'freebet';
    
    const data = {
      n: parseInt($('numEntradas')?.value || '3'),
      r: parseFloat($('round_step')?.value || '1.0'),
      mode,
      p: {},
      cov: []
    };

    if (mode === 'cashback') {
      data.p = {
        o: $('cashback_odd')?.value || '',
        c: $('cashback_comm')?.value || '',
        s: $('cashback_stake')?.value || '',
        r: $('cashback_rate')?.value || ''
      };
    } else {
      data.p = {
        o: $('o1')?.value || '',
        c: $('c1')?.value || '',
        s: $('s1')?.value || '',
        f: $('F')?.value || '',
        e: $('r')?.value || ''
      };
    }

    const cards = doc.querySelectorAll('#oddsContainer > div');
    cards.forEach(card => {
      const odd = card.querySelector('input[data-type="odd"]')?.value || '';
      const comm = card.querySelector('input[data-type="comm"]')?.value || '';
      const lay = card.querySelector('input[data-type="lay"]')?.checked || false;
      data.cov.push({ odd, comm, lay });
    });

    console.log('✅ Dados capturados:', data);
    return data;
  }

  loadSharedConfig() {
    const config = this.shareSystem.readFromUrl();
    if (!config) return;

    console.log('='.repeat(50));
    console.log('📥 CARREGANDO CONFIGURAÇÃO COMPARTILHADA');
    console.log('='.repeat(50));
    console.log('Config:', config);

    const loadWithRetry = (attempts = 0, maxAttempts = 10) => {
      const app = window.SharkGreen;
      
      const isReady = config.t === 'arbipro' 
        ? (app?.arbiPro && document.getElementById('numHouses'))
        : (document.getElementById('calc2frame')?.contentDocument);
      
      if (isReady) {
        console.log(`✅ Sistema pronto (tentativa ${attempts + 1})`);
        
        if (config.t === 'arbipro') {
          this.loadArbiPro(config);
        } else if (config.t === 'freepro') {
          this.loadFreePro(config);
        }
        
        setTimeout(() => {
          this.shareSystem.cleanUrl();
        }, 500);
        
      } else if (attempts < maxAttempts) {
        console.log(`⏳ Aguardando sistema... (tentativa ${attempts + 1}/${maxAttempts})`);
        setTimeout(() => loadWithRetry(attempts + 1, maxAttempts), 1000);
      } else {
        console.error('❌ Timeout: Sistema não carregou');
        alert('Erro ao carregar configuração. Tente recarregar.');
      }
    };
    
    setTimeout(() => loadWithRetry(), 1000);
  }

  loadArbiPro(config) {
    console.log('⚙️ Carregando ArbiPro...');
    
    const app = window.SharkGreen?.arbiPro;
    if (!app) {
      console.error('❌ ArbiPro não encontrado');
      return;
    }

    const applyConfig = () => {
      const numSelect = document.getElementById('numHouses');
      const roundSelect = document.getElementById('rounding');
      
      if (!numSelect || !roundSelect) {
        setTimeout(applyConfig, 300);
        return;
      }

      if (config.n) {
        console.log('🏠 Casas:', config.n);
        numSelect.value = config.n;
        numSelect.dispatchEvent(new Event('change'));
      }

      if (config.r) {
        console.log('🔢 Arredondamento:', config.r);
        roundSelect.value = config.r;
        roundSelect.dispatchEvent(new Event('change'));
      }

      setTimeout(() => {
        this.fillArbiProHouses(config, app);
      }, 1000);
    };
    
    applyConfig();
  }

  fillArbiProHouses(config, app) {
    let currentIndex = 0;
    const houses = config.h || [];

    const processNextHouse = () => {
      if (currentIndex >= houses.length) {
        setTimeout(() => {
          app.scheduleUpdate();
          console.log('✅ ArbiPro carregado com sucesso!');
        }, 500);
        return;
      }

      const house = houses[currentIndex];
      const idx = currentIndex;
      console.log(`🏠 Carregando Casa ${idx + 1}:`, house);

      // FASE 1: CHECKBOXES/BOTÕES
      if (house.f === true || house.f === 1) {
        console.log(`  └─ Ativando freebet`);
        const fbCheck = document.querySelector(`input[data-action="toggleFreebet"][data-idx="${idx}"]`);
        if (fbCheck && !fbCheck.checked) {
          fbCheck.checked = true;
          fbCheck.dispatchEvent(new Event('change'));
        }
      }

      if (house.l === true || house.l === 1) {
        console.log(`  └─ Ativando LAY`);
        const layBtn = document.querySelector(`button[data-action="toggleLay"][data-idx="${idx}"]`);
        if (layBtn) {
          const currentLay = app.houses[idx]?.lay;
          if (!currentLay) {
            layBtn.click();
          }
        }
      }

      if (house.c !== null && house.c !== undefined) {
        console.log(`  └─ Ativando checkbox comissão`);
        const commCheck = document.querySelector(`input[data-action="toggleCommission"][data-idx="${idx}"]`);
        if (commCheck && !commCheck.checked) {
          commCheck.checked = true;
          commCheck.dispatchEvent(new Event('change'));
        }
      }

      if (house.i !== null && house.i !== undefined) {
        console.log(`  └─ Ativando checkbox aumento`);
        const incCheck = document.querySelector(`input[data-action="toggleIncrease"][data-idx="${idx}"]`);
        if (incCheck && !incCheck.checked) {
          incCheck.checked = true;
          incCheck.dispatchEvent(new Event('change'));
        }
      }

      setTimeout(() => {
        console.log(`  ⏳ Aguardando re-render...`);
        
        setTimeout(() => {
          console.log(`  📝 Preenchendo campos...`);

          // FASE 2: PREENCHER CAMPOS
          if (house.o) {
            const oddInput = document.getElementById(`odd-${idx}`);
            if (oddInput) {
              oddInput.value = house.o;
              oddInput.dispatchEvent(new Event('input'));
              console.log(`    ✓ Odd: ${house.o}`);
            }
          }

          if (house.s) {
            const stakeInput = document.getElementById(`stake-${idx}`);
            if (stakeInput) {
              stakeInput.value = house.s;
              stakeInput.dispatchEvent(new Event('input'));
              console.log(`    ✓ Stake: ${house.s}`);
            }
          }

          // COMISSÃO COM RETRY
          if (house.c !== null && house.c !== undefined) {
            let attempts = 0;
            const maxAttempts = 10;
            
            const tryFillCommission = () => {
              const commInput = document.getElementById(`commission-${idx}`);
              
              if (commInput) {
                commInput.value = house.c;
                commInput.dispatchEvent(new Event('input'));
                console.log(`    ✓ Comissão: ${house.c}% (tentativa ${attempts + 1})`);
              } else {
                attempts++;
                if (attempts < maxAttempts) {
                  console.log(`    ⏳ Tentando novamente... (${attempts}/${maxAttempts})`);
                  setTimeout(tryFillCommission, 300);
                } else {
                  console.error(`    ✗ Campo commission-${idx} não encontrado após ${maxAttempts} tentativas`);
                  console.error(`    📋 Campos disponíveis:`, 
                    Array.from(document.querySelectorAll(`[id*="commission"]`)).map(el => el.id)
                  );
                }
              }
            };
            
            tryFillCommission();
          }

          // AUMENTO COM RETRY
          if (house.i !== null && house.i !== undefined) {
            let attempts = 0;
            const maxAttempts = 10;
            
            const tryFillIncrease = () => {
              const incInput = document.getElementById(`increase-${idx}`);
              
              if (incInput) {
                incInput.value = house.i;
                incInput.dispatchEvent(new Event('input'));
                console.log(`    ✓ Aumento: ${house.i}%`);
              } else {
                attempts++;
                if (attempts < maxAttempts) {
                  setTimeout(tryFillIncrease, 300);
                } else {
                  console.error(`    ✗ Campo increase-${idx} não encontrado`);
                }
              }
            };
            
            tryFillIncrease();
          }

          if (house.x === true || house.x === 1) {
            setTimeout(() => {
              const fixBtn = document.querySelector(`button[data-action="fixStake"][data-idx="${idx}"]`);
              if (fixBtn) {
                const currentFixed = app.houses[idx]?.fixedStake;
                if (!currentFixed) {
                  fixBtn.click();
                  console.log(`    ✓ Stake fixada`);
                }
              }
            }, 400);
          }

          setTimeout(() => {
            currentIndex++;
            processNextHouse();
          }, 1500);
        }, 600);
      }, 1200);
    };

    processNextHouse();
  }

  loadFreePro(config) {
    console.log('⚙️ Carregando FreePro...');
    
    const iframe = document.getElementById('calc2frame');
    if (!iframe?.contentDocument) {
      console.error('❌ FreePro não encontrado');
      return;
    }

    const doc = iframe.contentDocument;
    const $ = (id) => doc.getElementById(id);

    if (config.m === 'cashback') {
      doc.body.classList.add('mode-cashback');
      $('modeCashbackBtn')?.classList.add('active');
      $('modeFreebetBtn')?.classList.remove('active');
    }

    if ($('numEntradas')) {
      $('numEntradas').value = config.n;
      $('numEntradas').dispatchEvent(new Event('change'));
    }

    if ($('round_step')) {
      $('round_step').value = config.r;
    }

    setTimeout(() => {
      if (config.m === 'cashback') {
        if ($('cashback_odd')) $('cashback_odd').value = config.p.o || '';
        if ($('cashback_comm')) $('cashback_comm').value = config.p.c || '';
        if ($('cashback_stake')) $('cashback_stake').value = config.p.s || '';
        if ($('cashback_rate')) $('cashback_rate').value = config.p.r || '';
      } else {
        if ($('o1')) $('o1').value = config.p.o || '';
        if ($('c1')) $('c1').value = config.p.c || '';
        if ($('s1')) $('s1').value = config.p.s || '';
        if ($('F')) $('F').value = config.p.f || '';
        if ($('r')) $('r').value = config.p.e || '';
      }

      setTimeout(() => {
        const cards = doc.querySelectorAll('#oddsContainer > div');
        (config.cov || []).forEach((cov, idx) => {
          if (idx < cards.length) {
            const card = cards[idx];
            const oddInput = card.querySelector('input[data-type="odd"]');
            const commInput = card.querySelector('input[data-type="comm"]');
            const layInput = card.querySelector('input[data-type="lay"]');

            if (oddInput) oddInput.value = cov.odd;
            if (commInput) commInput.value = cov.comm;
            if (layInput) layInput.checked = cov.lay;
          }
        });

        const triggerEl = $('o1') || $('cashback_odd');
        if (triggerEl) triggerEl.dispatchEvent(new Event('input'));
        
        console.log('✅ FreePro carregado com sucesso!');
      }, 300);
    }, 300);
  }
}
