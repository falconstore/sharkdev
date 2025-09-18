// assets/js/ui/shareui.js
// Sistema de Interface para Compartilhamento - VERSÃO SIMPLIFICADA E FUNCIONAL

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
      
      if (!data) {
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

  // Obtém dados do ArbiPro
  getArbiProData() {
    console.log('Capturando dados ArbiPro...');
    
    try {
      // Verifica se ArbiPro existe
      if (!window.SharkGreen || !window.SharkGreen.arbiPro) {
        console.error('ArbiPro não encontrado');
        return null;
      }

      const arbiPro = window.SharkGreen.arbiPro;
      const data = {
        numHouses: arbiPro.numHouses,
        rounding: arbiPro.roundingValue,
        houses: []
      };

      // Captura dados de cada casa
      for (let i = 0; i < arbiPro.numHouses; i++) {
        const house = arbiPro.houses[i] || {};
        
        // Tenta pegar do DOM primeiro, depois do modelo
        const oddInput = document.getElementById(`odd-${i}`);
        const stakeInput = document.getElementById(`stake-${i}`);
        const commInput = document.getElementById(`commission-${i}`);
        const increaseInput = document.getElementById(`increase-${i}`);
        const responsibilityInput = document.getElementById(`responsibility-${i}`);
        
        data.houses.push({
          o: oddInput?.value || house.odd || '',
          s: stakeInput?.value || house.stake || '0',
          c: commInput ? parseFloat(commInput.value) || 0 : (house.commission || null),
          f: house.freebet || false,
          i: increaseInput ? parseFloat(increaseInput.value) || 0 : (house.increase || null),
          l: house.lay || false,
          x: house.fixedStake || false
        });
      }

      // Verifica se há dados preenchidos
      const hasData = data.houses.some(h => h.o || h.s !== '0');
      
      console.log('Dados ArbiPro capturados:', data);
      return hasData ? data : null;
      
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
        r: parseFloat(doc.getElementById('round_step')?.value || '1.00')
      };

      if (isCashback) {
        // Modo Cashback
        data.t = 'freepro';
        data.mode = 'cashback';
        data.p = {
          o: doc.getElementById('cashback_odd')?.value || '',
          s: doc.getElementById('cashback_stake')?.value || '',
          r: doc.getElementById('cashback_rate')?.value || ''
        };
      } else {
        // Modo Freebet
        data.t = 'freepro';
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
      coverageCards.forEach(card => {
        const oddInput = card.querySelector('input[data-type="odd"]');
        const commInput = card.querySelector('input[data-type="comm"]');
        const layInput = card.querySelector('input[data-type="lay"]');
        
        data.cov.push({
          odd: oddInput?.value || '',
          comm: commInput?.value || '',
          lay: layInput?.checked || false
        });
      });

      // Verifica se há dados
      const hasPromoData = isCashback 
        ? (data.p.o || data.p.s || data.p.r)
        : (data.p.o || data.p.s || data.p.f);
      
      console.log('Dados FreePro capturados:', data);
      return hasPromoData ? data : null;
      
    } catch (error) {
      console.error('Erro ao capturar dados FreePro:', error);
      return null;
    }
  }

  // Mostra modal de compartilhamento
  async showShareModal(shareLink) {
    // Remove modal anterior se existir
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
    
    const url = shareLink.shortUrl || shareLink.fullUrl;
    
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
        
        <div style="
          background: #111827;
          border: 1px solid #4b5563;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          word-break: break-all;
          font-family: monospace;
          color: #3b82f6;
          font-size: 0.875rem;
          user-select: all;
          cursor: text;
        " id="shareUrlText">
          ${url}
        </div>
        
        <div style="display: flex; gap: 1rem;">
          <button onclick="
            navigator.clipboard.writeText('${url}').then(() => {
              document.getElementById('copySuccess').style.display = 'block';
              setTimeout(() => {
                document.getElementById('copySuccess').style.display = 'none';
              }, 2000);
            }).catch(() => {
              alert('Selecione e copie o texto manualmente');
            });
          " style="
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
          
          <button onclick="
            document.getElementById('shareModal').remove();
          " style="
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
    
    // Seleciona o texto automaticamente
    const urlDiv = document.getElementById('shareUrlText');
    if (window.getSelection) {
      const range = document.createRange();
      range.selectNodeContents(urlDiv);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  // Carrega configuração compartilhada
  loadSharedConfig() {
    if (!this.shareSystem) return;
    
    try {
      const config = this.shareSystem.loadFromUrl();
      if (config) {
        console.log('📥 Configuração compartilhada encontrada:', config);
        
        // Aplica a configuração após um delay
        setTimeout(() => {
          this.applyConfig(config);
        }, 1000);
        
        // Limpa URL
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
    console.log('Aplicando config ArbiPro...');
    
    if (!window.SharkGreen?.arbiPro) {
      console.error('ArbiPro não disponível');
      return;
    }

    const arbiPro = window.SharkGreen.arbiPro;
    
    // Define número de casas
    if (config.n) {
      arbiPro.numHouses = config.n;
      const select = document.getElementById('numHouses');
      if (select) select.value = config.n;
    }
    
    // Define arredondamento
    if (config.r) {
      arbiPro.roundingValue = config.r;
      const select = document.getElementById('rounding');
      if (select) select.value = config.r;
    }
    
    // Renderiza casas
    arbiPro.renderHouses();
    
    // Aplica dados das casas
    setTimeout(() => {
      if (config.h) {
        config.h.forEach((house, i) => {
          if (i < arbiPro.numHouses) {
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
            
            // Atualiza DOM
            const oddInput = document.getElementById(`odd-${i}`);
            if (oddInput) oddInput.value = house.o || '';
            
            const stakeInput = document.getElementById(`stake-${i}`);
            if (stakeInput) stakeInput.value = house.s || '0';
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
    console.log('Aplicando config FreePro...');
    
    // Ativa aba FreePro
    const tab2 = document.getElementById('tabBtn2');
    if (tab2) tab2.click();
    
    setTimeout(() => {
      const iframe = document.getElementById('calc2frame');
      if (!iframe?.contentDocument) {
        console.error('Iframe FreePro não disponível');
        return;
      }

      const doc = iframe.contentDocument;
      
      // Número de entradas
      if (config.n) {
        const select = doc.getElementById('numEntradas');
        if (select) {
          select.value = config.n;
          select.dispatchEvent(new Event('change'));
        }
      }
      
      // Arredondamento
      if (config.r) {
        const select = doc.getElementById('round_step');
        if (select) select.value = config.r;
      }
      
      // Modo e dados
      if (config.mode === 'cashback') {
        // Ativa cashback
        const btn = doc.getElementById('modeCashbackBtn');
        if (btn) btn.click();
        
        setTimeout(() => {
          if (config.p) {
            const oddInput = doc.getElementById('cashback_odd');
            if (oddInput) oddInput.value = config.p.o || '';
            
            const stakeInput = doc.getElementById('cashback_stake');
            if (stakeInput) stakeInput.value = config.p.s || '';
            
            const rateInput = doc.getElementById('cashback_rate');
            if (rateInput) rateInput.value = config.p.r || '';
            
            // Dispara eventos
            [oddInput, stakeInput, rateInput].forEach(el => {
              if (el) {
                el.dispatchEvent(new Event('input'));
                el.dispatchEvent(new Event('change'));
              }
            });
          }
        }, 500);
      } else {
        // Modo freebet
        if (config.p) {
          const o1 = doc.getElementById('o1');
          if (o1) o1.value = config.p.o || '';
          
          const c1 = doc.getElementById('c1');
          if (c1) c1.value = config.p.c || '';
          
          const s1 = doc.getElementById('s1');
          if (s1) s1.value = config.p.s || '';
          
          const F = doc.getElementById('F');
          if (F) F.value = config.p.f || '';
          
          const r = doc.getElementById('r');
          if (r) r.value = config.p.e || '';
          
          // Dispara eventos
          [o1, c1, s1, F, r].forEach(el => {
            if (el) {
              el.dispatchEvent(new Event('input'));
              el.dispatchEvent(new Event('change'));
            }
          });
        }
      }
      
      // Aplica coberturas
      if (config.cov) {
        setTimeout(() => {
          const cards = doc.querySelectorAll('.coverage-card');
          config.cov.forEach((cov, i) => {
            if (cards[i]) {
              const oddInput = cards[i].querySelector('input[data-type="odd"]');
              if (oddInput) {
                oddInput.value = cov.odd || '';
                oddInput.dispatchEvent(new Event('input'));
              }
              
              const commInput = cards[i].querySelector('input[data-type="comm"]');
              if (commInput) {
                commInput.value = cov.comm || '';
                commInput.dispatchEvent(new Event('input'));
              }
              
              const layInput = cards[i].querySelector('input[data-type="lay"]');
              if (layInput) {
                layInput.checked = cov.lay || false;
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
