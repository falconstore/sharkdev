// assets/js/ui/shareui.js
// Sistema de Interface para Compartilhamento - COM EXPORT CORRETO

import { ShareSystem } from '../utils/share.js';

export class ShareUI {
  constructor() {
    this.initialized = false;
    this.shareSystem = null;
  }

  async init() {
    try {
      this.shareSystem = new ShareSystem();
      this.initialized = true;
      console.log('✅ ShareUI inicializado com sucesso');
      return true;
    } catch (error) {
      console.error('❌ Erro ao inicializar ShareUI:', error);
      return false;
    }
  }

  // Manipula clique de compartilhamento
  async handleShareClick(calculator) {
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

      // Gera o link de compartilhamento
      const shareLink = calculator === 'arbipro' 
        ? this.shareSystem.generateArbiProLink(data)
        : this.shareSystem.generateFreeProLink(data);
      
      console.log('Link gerado:', shareLink);
      
      if (shareLink) {
        await this.showShareModal(shareLink);
      }
      
    } catch (error) {
      console.error('❌ Erro ao compartilhar:', error);
      alert('Erro ao gerar link de compartilhamento: ' + error.message);
    }
  }

  // Verifica se há dados válidos
  hasValidData(data, calculator) {
    if (!data) return false;
    
    if (calculator === 'arbipro') {
      return data.houses && data.houses.some(h => h && h.o && h.o !== '');
    } else if (calculator === 'freepro') {
      if (data.mode === 'cashback') {
        return data.p && (data.p.o || data.p.s || data.p.r);
      } else {
        return data.p && (data.p.o || data.p.s || data.p.f);
      }
    }
    
    return false;
  }

  // Obtém dados do ArbiPro
  getArbiProData() {
    console.log('Capturando dados ArbiPro...');
    
    try {
      if (!window.SharkGreen || !window.SharkGreen.arbiPro) {
        console.error('ArbiPro não encontrado');
        return null;
      }

      const arbiPro = window.SharkGreen.arbiPro;
      const data = {
        numHouses: arbiPro.numHouses || 2,
        rounding: arbiPro.roundingValue || 0.01,
        houses: []
      };

      // Captura dados de cada casa
      for (let i = 0; i < arbiPro.numHouses; i++) {
        const house = arbiPro.houses[i] || {};
        
        // Captura dados dos inputs DOM e do modelo
        const oddInput = document.getElementById(`odd-${i}`);
        const stakeInput = document.getElementById(`stake-${i}`);
        const commInput = document.getElementById(`commission-${i}`);
        const increaseInput = document.getElementById(`increase-${i}`);
        
        let oddValue = oddInput?.value || house.odd || '';
        let stakeValue = stakeInput?.value || house.stake || '0';
        let commissionValue = house.commission;
        let increaseValue = house.increase;
        
        if (commInput && commInput.value) {
          commissionValue = parseFloat(commInput.value) || 0;
        }
        
        if (increaseInput && increaseInput.value) {
          increaseValue = parseFloat(increaseInput.value) || 0;
        }
        
        data.houses.push({
          o: oddValue,
          s: stakeValue,
          c: commissionValue,
          f: house.freebet || false,
          i: increaseValue,
          l: house.lay || false,
          x: house.fixedStake || false
        });
      }

      console.log('Dados ArbiPro finais:', data);
      return data;
      
    } catch (error) {
      console.error('Erro ao capturar dados ArbiPro:', error);
      return null;
    }
  }

  // Obtém dados do FreePro
  getFreeProData() {
    console.log('Capturando dados FreePro...');
    
    try {
      const iframe = document.getElementById('calc2frame');
      if (!iframe || !iframe.contentDocument) {
        console.error('Iframe FreePro não encontrado');
        return null;
      }

      const doc = iframe.contentDocument;
      const isCashback = doc.body.classList.contains('mode-cashback');
      
      const data = {
        n: parseInt(doc.getElementById('numEntradas')?.value || '3'),
        r: parseFloat(doc.getElementById('round_step')?.value || '1.00'),
        t: 'freepro'
      };

      if (isCashback) {
        data.mode = 'cashback';
        data.p = {
          o: doc.getElementById('cashback_odd')?.value || '',
          s: doc.getElementById('cashback_stake')?.value || '',
          r: doc.getElementById('cashback_rate')?.value || ''
        };
      } else {
        data.mode = 'freebet';
        data.p = {
          o: doc.getElementById('o1')?.value || '',
          c: doc.getElementById('c1')?.value || '',
          s: doc.getElementById('s1')?.value || '',
          f: doc.getElementById('F')?.value || '',
          e: doc.getElementById('r')?.value || ''
        };
      }

      // Captura coberturas
      data.cov = [];
      const coverageCards = doc.querySelectorAll('.coverage-card');
      coverageCards.forEach((card) => {
        const oddInput = card.querySelector('input[data-type="odd"]');
        const commInput = card.querySelector('input[data-type="comm"]');
        const layInput = card.querySelector('input[data-type="lay"]');
        
        data.cov.push({
          odd: oddInput?.value || '',
          comm: commInput?.value || '',
          lay: layInput?.checked || false
        });
      });

      console.log('Dados FreePro finais:', data);
      return data;
      
    } catch (error) {
      console.error('Erro ao capturar dados FreePro:', error);
      return null;
    }
  }

  // Mostra modal de compartilhamento
  async showShareModal(shareLink) {
    const existingModal = document.getElementById('shareModal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'shareModal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      backdrop-filter: blur(5px);
    `;
    
    const url = shareLink.fullUrl; // Usa URL completa (base64)
    
    modal.innerHTML = `
      <div style="
        background: #1f2937;
        border-radius: 16px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        text-align: center;
        border: 2px solid #3b82f6;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
      ">
        <h3 style="
          color: white;
          margin-bottom: 1rem;
          font-size: 1.5rem;
          font-weight: 700;
        ">
          🔗 Link de Compartilhamento
        </h3>
        
        <p style="
          color: #9ca3af;
          margin-bottom: 1.5rem;
        ">
          Copie o link abaixo para compartilhar suas configurações
        </p>
        
        <textarea style="
          background: #111827;
          border: 1px solid #4b5563;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          word-break: break-all;
          font-family: monospace;
          color: #3b82f6;
          font-size: 0.875rem;
          width: 100%;
          height: 100px;
          resize: none;
        " id="shareUrlText" readonly>${url}</textarea>
        
        <div style="display: flex; gap: 1rem;">
          <button id="copyBtn" style="
            background: linear-gradient(135deg, #3b82f6, #22c55e);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0.75rem 2rem;
            font-weight: 600;
            cursor: pointer;
            flex: 1;
          ">
            📋 Copiar Link
          </button>
          
          <button id="closeBtn" style="
            background: #374151;
            color: white;
            border: 2px solid #4b5563;
            border-radius: 8px;
            padding: 0.75rem 2rem;
            font-weight: 600;
            cursor: pointer;
            flex: 1;
          ">
            ❌ Fechar
          </button>
        </div>
        
        <div id="copySuccess" style="
          margin-top: 1rem;
          color: #22c55e;
          font-weight: 600;
          display: none;
        ">
          ✅ Link copiado com sucesso!
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    document.getElementById('copyBtn').addEventListener('click', async () => {
      try {
        const textarea = document.getElementById('shareUrlText');
        textarea.select();
        
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(url);
        } else {
          document.execCommand('copy');
        }
        
        const successMsg = document.getElementById('copySuccess');
        successMsg.style.display = 'block';
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 2000);
      } catch (error) {
        console.error('Erro ao copiar:', error);
        alert('Selecione e copie o texto manualmente (CTRL+C)');
      }
    });
    
    document.getElementById('closeBtn').addEventListener('click', () => {
      modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
    
    const textarea = document.getElementById('shareUrlText');
    textarea.select();
    textarea.setSelectionRange(0, 99999);
  }

  // Carrega configuração compartilhada
  loadSharedConfig() {
    if (!this.shareSystem) return;
    
    try {
      const config = this.shareSystem.loadFromUrl();
      if (config) {
        console.log('📥 Configuração compartilhada encontrada:', config);
        
        setTimeout(() => {
          this.applyConfig(config);
        }, 1000);
        
        this.shareSystem.cleanUrl();
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    }
  }

  // Aplica configuração
  applyConfig(config) {
    console.log('Aplicando configuração:', config);
    
    if (config.t === 'arbipro') {
      this.applyArbiProConfig(config);
    } else if (config.t === 'freepro') {
      this.applyFreeProConfig(config);
    }
  }

  // Aplica configuração ArbiPro
  applyArbiProConfig(config) {
    console.log('Aplicando config ArbiPro...', config);
    
    if (!window.SharkGreen?.arbiPro) {
      setTimeout(() => this.applyArbiProConfig(config), 500);
      return;
    }

    const arbiPro = window.SharkGreen.arbiPro;
    
    // Define número de casas e arredondamento
    if (config.n) {
      arbiPro.numHouses = config.n;
      const select = document.getElementById('numHouses');
      if (select) {
        select.value = config.n;
      }
    }
    
    if (config.r) {
      arbiPro.roundingValue = config.r;
      const select = document.getElementById('rounding');
      if (select) {
        select.value = config.r;
      }
    }
    
    // Renderiza casas primeiro
    arbiPro.renderHouses();
    
    // Aplica dados das casas
    setTimeout(() => {
      if (config.h && Array.isArray(config.h)) {
        config.h.forEach((house, i) => {
          if (i < arbiPro.numHouses && house) {
            // Atualiza modelo
            arbiPro.houses[i] = {
              ...arbiPro.houses[i],
              odd: house.o || '',
              stake: house.s || '0',
              commission: house.c,
              freebet: house.f || false,
              increase: house.i,
              lay: house.l || false,
              fixedStake: house.x || false
            };
            
            // Atualiza inputs no DOM
            const oddInput = document.getElementById(`odd-${i}`);
            if (oddInput && house.o) {
              oddInput.value = house.o;
              oddInput.dispatchEvent(new Event('input'));
            }
            
            const stakeInput = document.getElementById(`stake-${i}`);
            if (stakeInput && house.s) {
              stakeInput.value = house.s;
              stakeInput.dispatchEvent(new Event('input'));
            }
            
            // Checkboxes e valores adicionais
            if (house.c !== null && house.c !== undefined) {
              const checkbox = document.querySelector(`[data-action="toggleCommission"][data-idx="${i}"]`);
              if (checkbox && !checkbox.checked) {
                checkbox.click();
              }
              setTimeout(() => {
                const commInput = document.getElementById(`commission-${i}`);
                if (commInput) {
                  commInput.value = house.c;
                  commInput.dispatchEvent(new Event('input'));
                }
              }, 100);
            }
            
            if (house.f) {
              const checkbox = document.querySelector(`[data-action="toggleFreebet"][data-idx="${i}"]`);
              if (checkbox && !checkbox.checked) {
                checkbox.click();
              }
            }
            
            if (house.i !== null && house.i !== undefined) {
              const checkbox = document.querySelector(`[data-action="toggleIncrease"][data-idx="${i}"]`);
              if (checkbox && !checkbox.checked) {
                checkbox.click();
              }
              setTimeout(() => {
                const increaseInput = document.getElementById(`increase-${i}`);
                if (increaseInput) {
                  increaseInput.value = house.i;
                  increaseInput.dispatchEvent(new Event('input'));
                }
              }, 100);
            }
            
            if (house.l) {
              const btn = document.querySelector(`[data-action="toggleLay"][data-idx="${i}"]`);
              if (btn && !btn.classList.contains('active')) {
                btn.click();
              }
            }
            
            if (house.x && i === 0) {
              const btn = document.querySelector(`[data-action="fixStake"][data-idx="${i}"]`);
              if (btn) {
                setTimeout(() => btn.click(), 200);
              }
            }
          }
        });
      }
      
      // Força recálculo
      arbiPro.scheduleUpdate();
      console.log('✅ Config ArbiPro aplicada');
    }, 500);
  }

  // Aplica configuração FreePro
  applyFreeProConfig(config) {
    console.log('Aplicando config FreePro...', config);
    
    // Ativa aba FreePro
    const tab2 = document.getElementById('tabBtn2');
    if (tab2 && tab2.getAttribute('aria-selected') !== 'true') {
      tab2.click();
    }
    
    setTimeout(() => {
      const iframe = document.getElementById('calc2frame');
      if (!iframe?.contentDocument) {
        console.error('Iframe FreePro não disponível');
        return;
      }

      const doc = iframe.contentDocument;
      
      // Configurações básicas
      if (config.n) {
        const select = doc.getElementById('numEntradas');
        if (select) {
          select.value = config.n;
          select.dispatchEvent(new Event('change'));
        }
      }
      
      if (config.r) {
        const select = doc.getElementById('round_step');
        if (select) {
          select.value = config.r;
          select.dispatchEvent(new Event('change'));
        }
      }
      
      // Aplica modo e dados
      if (config.mode === 'cashback') {
        const btn = doc.getElementById('modeCashbackBtn');
        if (btn && !btn.classList.contains('active')) {
          btn.click();
        }
        
        setTimeout(() => {
          if (config.p) {
            ['cashback_odd', 'cashback_stake', 'cashback_rate'].forEach((id, idx) => {
              const input = doc.getElementById(id);
              const value = [config.p.o, config.p.s, config.p.r][idx];
              if (input && value) {
                input.value = value;
                input.dispatchEvent(new Event('input'));
                input.dispatchEvent(new Event('change'));
              }
            });
          }
        }, 500);
      } else {
        const btn = doc.getElementById('modeFreebetBtn');
        if (btn && !btn.classList.contains('active')) {
          btn.click();
        }
        
        setTimeout(() => {
          if (config.p) {
            ['o1', 'c1', 's1', 'F', 'r'].forEach((id, idx) => {
              const input = doc.getElementById(id);
              const value = [config.p.o, config.p.c, config.p.s, config.p.f, config.p.e][idx];
              if (input && value) {
                input.value = value;
                input.dispatchEvent(new Event('input'));
                input.dispatchEvent(new Event('change'));
              }
            });
          }
        }, 500);
      }
      
      // Aplica coberturas
      if (config.cov) {
        setTimeout(() => {
          const cards = doc.querySelectorAll('.coverage-card');
          config.cov.forEach((cov, i) => {
            if (cards[i] && cov) {
              const oddInput = cards[i].querySelector('input[data-type="odd"]');
              const commInput = cards[i].querySelector('input[data-type="comm"]');
              const layInput = cards[i].querySelector('input[data-type="lay"]');
              
              if (oddInput && cov.odd) {
                oddInput.value = cov.odd;
                oddInput.dispatchEvent(new Event('input'));
              }
              if (commInput && cov.comm) {
                commInput.value = cov.comm;
                commInput.dispatchEvent(new Event('input'));
              }
              if (layInput && cov.lay !== undefined) {
                layInput.checked = cov.lay;
                layInput.dispatchEvent(new Event('change'));
              }
            }
          });
        }, 1000);
      }
      
      console.log('✅ Config FreePro aplicada');
    }, 2000);
  }
}

// IMPORTANTE: Export default também para compatibilidade
export default ShareUI;
