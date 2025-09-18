// assets/js/ui/shareui.js
// Sistema de Interface para Compartilhamento - VERSÃO CORRIGIDA

export class ShareUI {
  constructor() {
    this.initialized = false;
    this.shareSystem = null;
  }

  init() {
    this.initialized = true;
    this.initShareSystem();
    console.log('ShareUI inicializado');
  }

  async initShareSystem() {
    try {
      const { ShareSystem } = await import('../utils/share.js');
      this.shareSystem = new ShareSystem();
      console.log('ShareSystem carregado com sucesso');
    } catch (error) {
      console.warn('ShareSystem não disponível:', error.message);
    }
  }

  // Cria botão de compartilhamento
  createShareButton(calculator) {
    if (!this.shareSystem) {
      console.warn('ShareSystem não disponível para criar botão');
      return null;
    }

    const button = document.createElement('button');
    button.className = 'btn btn-share';
    button.innerHTML = '🔗 Compartilhar';
    button.style.background = 'linear-gradient(135deg, #8b5cf6, #3b82f6)';
    button.style.color = 'white';
    
    button.addEventListener('click', () => {
      this.handleShareClick(calculator);
    });
    
    return button;
  }

  // Manipula clique de compartilhamento
  async handleShareClick(calculator) {
    if (!this.shareSystem) {
      alert('Sistema de compartilhamento não disponível');
      return;
    }

    try {
      console.log('Capturando dados para compartilhar:', calculator);
      let data;
      
      if (calculator === 'arbipro') {
        data = this.getArbiProData();
      } else if (calculator === 'freepro') {
        data = this.getFreeProData();
      }
      
      console.log('Dados capturados:', data);
      
      if (data) {
        const shareLink = calculator === 'arbipro' 
          ? this.shareSystem.generateArbiProLink(data)
          : this.shareSystem.generateFreeProLink(data);
        
        if (shareLink) {
          await this.showShareModal(shareLink);
        }
      } else {
        alert('Não há dados para compartilhar. Preencha as informações da calculadora primeiro.');
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      alert('Erro ao gerar link de compartilhamento');
    }
  }

  // Obtém dados do ArbiPro - VERSÃO CORRIGIDA
  getArbiProData() {
    try {
      console.log('Capturando dados ArbiPro...');
      
      if (window.SharkGreen && window.SharkGreen.arbiPro) {
        const arbiPro = window.SharkGreen.arbiPro;
        
        // Captura dados completos das casas
        const housesData = [];
        for (let i = 0; i < arbiPro.numHouses; i++) {
          const house = arbiPro.houses[i];
          
          // Captura valores dos inputs diretamente do DOM se necessário
          const oddInput = document.getElementById(`odd-${i}`);
          const stakeInput = document.getElementById(`stake-${i}`);
          const commInput = document.getElementById(`commission-${i}`);
          const increaseInput = document.getElementById(`increase-${i}`);
          const responsibilityInput = document.getElementById(`responsibility-${i}`);
          
          housesData.push({
            odd: oddInput?.value || house.odd || '',
            stake: stakeInput?.value || house.stake || '',
            commission: commInput ? commInput.value : (house.commission !== null ? house.commission : null),
            freebet: house.freebet || false,
            increase: increaseInput ? increaseInput.value : (house.increase !== null ? house.increase : null),
            lay: house.lay || false,
            fixedStake: house.fixedStake || false,
            responsibility: responsibilityInput?.value || house.responsibility || ''
          });
        }
        
        const data = {
          numHouses: arbiPro.numHouses,
          rounding: arbiPro.roundingValue,
          houses: housesData
        };
        
        console.log('Dados ArbiPro capturados:', data);
        return data;
      }
      
      console.warn('ArbiPro não encontrado');
      return null;
    } catch (error) {
      console.error('Erro ao obter dados ArbiPro:', error);
      return null;
    }
  }

  // Obtém dados do FreePro - VERSÃO CORRIGIDA
  getFreeProData() {
    try {
      console.log('Capturando dados FreePro...');
      
      const iframe = document.getElementById('calc2frame');
      if (!iframe || !iframe.contentDocument) {
        console.warn('Iframe FreePro não encontrado');
        return null;
      }
      
      const doc = iframe.contentDocument;
      
      // Detecta o modo atual (freebet ou cashback)
      const isCashback = doc.body.classList.contains('mode-cashback');
      console.log('Modo detectado:', isCashback ? 'cashback' : 'freebet');
      
      // Captura dados básicos
      const numEntradas = parseInt(doc.getElementById('numEntradas')?.value || '3');
      const roundStep = parseFloat(doc.getElementById('round_step')?.value || '1.00');
      
      // Captura dados específicos do modo
      let modeData = {};
      
      if (isCashback) {
        // Modo Cashback
        modeData = {
          mode: 'cashback',
          cashbackOdd: doc.getElementById('cashback_odd')?.value || '',
          cashbackStake: doc.getElementById('cashback_stake')?.value || '',
          cashbackRate: doc.getElementById('cashback_rate')?.value || ''
        };
      } else {
        // Modo Freebet
        modeData = {
          mode: 'freebet',
          promoOdd: doc.getElementById('o1')?.value || '',
          promoComm: doc.getElementById('c1')?.value || '',
          promoStake: doc.getElementById('s1')?.value || '',
          freebetValue: doc.getElementById('F')?.value || '',
          extractionRate: doc.getElementById('r')?.value || ''
        };
      }
      
      // Captura dados das coberturas
      const coverages = this.extractCoverageData(doc);
      
      const data = {
        numEntradas: numEntradas,
        roundStep: roundStep,
        ...modeData,
        coverages: coverages
      };
      
      console.log('Dados FreePro capturados:', data);
      
      // Verifica se há dados preenchidos
      const hasData = isCashback 
        ? (modeData.cashbackOdd || modeData.cashbackStake || modeData.cashbackRate)
        : (modeData.promoOdd || modeData.promoStake || modeData.freebetValue);
      
      return hasData ? data : null;
    } catch (error) {
      console.error('Erro ao obter dados FreePro:', error);
      return null;
    }
  }

  // Extrai dados de cobertura do FreePro - VERSÃO MELHORADA
  extractCoverageData(doc) {
    try {
      const coverages = [];
      
      // Busca todos os cards de cobertura
      const coverageCards = doc.querySelectorAll('.coverage-card');
      
      coverageCards.forEach((card, index) => {
        const oddInput = card.querySelector('input[data-type="odd"]');
        const commInput = card.querySelector('input[data-type="comm"]');
        const layInput = card.querySelector('input[data-type="lay"]');
        
        if (oddInput || commInput || layInput) {
          coverages.push({
            odd: oddInput?.value || '',
            comm: commInput?.value || '',
            lay: layInput?.checked || false
          });
        }
      });
      
      console.log('Coberturas extraídas:', coverages);
      return coverages;
    } catch (error) {
      console.error('Erro ao extrair dados de cobertura:', error);
      return [];
    }
  }

  // Mostra modal de compartilhamento - VERSÃO MELHORADA
  async showShareModal(shareLink) {
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      backdrop-filter: blur(5px);
    `;
    
    modal.innerHTML = `
      <div style="
        background: var(--bg-card);
        border-radius: 16px;
        padding: 2rem;
        max-width: 500px;
        width: 90%;
        text-align: center;
        border: 1px solid var(--border);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      ">
        <h3 style="
          color: var(--text-primary);
          margin-bottom: 1rem;
          font-size: 1.5rem;
          font-weight: 700;
        ">
          🔗 Link de Compartilhamento
        </h3>
        <p style="
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
          line-height: 1.5;
        ">
          Copie o link abaixo para compartilhar suas configurações
        </p>
        
        <div style="
          background: rgba(17, 24, 39, 0.8);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          word-break: break-all;
          font-family: monospace;
          color: var(--text-primary);
          font-size: 0.875rem;
          user-select: all;
          cursor: text;
        " id="shareUrl">
          ${shareLink.shortUrl || shareLink.fullUrl}
        </div>
        
        <div style="
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        ">
          <button id="copyBtn" style="
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0.75rem 2rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            flex: 1;
            min-width: 120px;
          ">
            📋 Copiar Link
          </button>
          
          <button id="closeBtn" style="
            background: rgba(55, 65, 81, 0.8);
            color: var(--text-primary);
            border: 2px solid var(--border);
            border-radius: 8px;
            padding: 0.75rem 2rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            flex: 1;
            min-width: 120px;
          ">
            ❌ Fechar
          </button>
        </div>
        
        <div id="copySuccess" style="
          margin-top: 1rem;
          color: var(--success);
          font-weight: 600;
          display: none;
        ">
          ✅ Link copiado com sucesso!
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Event listeners
    modal.querySelector('#copyBtn').addEventListener('click', async () => {
      try {
        const url = shareLink.shortUrl || shareLink.fullUrl;
        await this.shareSystem.copyToClipboard(url);
        
        // Mostra mensagem de sucesso
        const successMsg = modal.querySelector('#copySuccess');
        successMsg.style.display = 'block';
        
        // Esconde mensagem após 2 segundos
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 2000);
        
      } catch (error) {
        console.error('Erro ao copiar:', error);
        alert('Erro ao copiar link. Selecione o texto manualmente.');
      }
    });
    
    modal.querySelector('#closeBtn').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
    
    // Fecha ao clicar fora
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
    
    // Seleciona o texto automaticamente para facilitar cópia manual
    const urlDiv = modal.querySelector('#shareUrl');
    if (window.getSelection && document.createRange) {
      const range = document.createRange();
      range.selectNodeContents(urlDiv);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  // Carrega configuração compartilhada na inicialização
  loadSharedConfig() {
    if (!this.shareSystem) return;
    
    try {
      const config = this.shareSystem.loadFromUrl();
      if (config && this.shareSystem.validateConfig(config)) {
        console.log('Configuração compartilhada encontrada:', config);
        
        // Aguarda as calculadoras carregarem antes de aplicar
        setTimeout(() => {
          this.applyConfig(config);
        }, 1000);
        
        // Limpa URL após carregar
        this.shareSystem.cleanUrl();
      }
    } catch (error) {
      console.error('Erro ao carregar configuração compartilhada:', error);
    }
  }

  // Aplica configuração carregada
  applyConfig(config) {
    console.log('Aplicando configuração compartilhada:', config);
    
    if (config.t === 'arbipro') {
      this.applyArbiProConfig(config);
    } else if (config.t === 'freepro') {
      this.applyFreeProConfig(config);
    }
  }

  // Aplica configuração do ArbiPro - VERSÃO CORRIGIDA
  applyArbiProConfig(config) {
    setTimeout(() => {
      if (window.SharkGreen?.arbiPro) {
        const arbiPro = window.SharkGreen.arbiPro;
        
        console.log('Aplicando config ArbiPro:', config);
        
        // Aplica configurações básicas
        if (config.n) {
          arbiPro.numHouses = config.n;
          const numHousesSelect = document.getElementById('numHouses');
          if (numHousesSelect) {
            numHousesSelect.value = config.n;
          }
        }
        
        if (config.r) {
          arbiPro.roundingValue = config.r;
          const roundingSelect = document.getElementById('rounding');
          if (roundingSelect) {
            roundingSelect.value = config.r;
          }
        }
        
        // Renderiza as casas primeiro
        arbiPro.renderHouses();
        
        // Aplica dados das casas após renderização
        setTimeout(() => {
          if (config.h && Array.isArray(config.h)) {
            config.h.forEach((house, idx) => {
              if (idx < arbiPro.numHouses) {
                // Atualiza o modelo
                if (arbiPro.houses[idx]) {
                  arbiPro.houses[idx] = {
                    ...arbiPro.houses[idx],
                    odd: house.o || '',
                    stake: house.s || '',
                    commission: house.c,
                    freebet: house.f || false,
                    increase: house.i,
                    lay: house.l || false,
                    fixedStake: house.x || false,
                    responsibility: house.responsibility || ''
                  };
                }
                
                // Atualiza os inputs no DOM
                const oddInput = document.getElementById(`odd-${idx}`);
                if (oddInput && house.o) oddInput.value = house.o;
                
                const stakeInput = document.getElementById(`stake-${idx}`);
                if (stakeInput && house.s) stakeInput.value = house.s;
                
                // Marca checkboxes se necessário
                if (house.c !== null && house.c !== undefined) {
                  const commCheckbox = document.querySelector(`[data-action="toggleCommission"][data-idx="${idx}"]`);
                  if (commCheckbox && !commCheckbox.checked) {
                    commCheckbox.checked = true;
                    commCheckbox.dispatchEvent(new Event('change'));
                  }
                }
                
                if (house.f) {
                  const freebetCheckbox = document.querySelector(`[data-action="toggleFreebet"][data-idx="${idx}"]`);
                  if (freebetCheckbox && !freebetCheckbox.checked) {
                    freebetCheckbox.checked = true;
                    freebetCheckbox.dispatchEvent(new Event('change'));
                  }
                }
                
                if (house.i !== null && house.i !== undefined) {
                  const increaseCheckbox = document.querySelector(`[data-action="toggleIncrease"][data-idx="${idx}"]`);
                  if (increaseCheckbox && !increaseCheckbox.checked) {
                    increaseCheckbox.checked = true;
                    increaseCheckbox.dispatchEvent(new Event('change'));
                  }
                }
              }
            });
          }
          
          // Força recálculo
          arbiPro.scheduleUpdate();
          
          console.log('Configuração ArbiPro aplicada com sucesso');
        }, 500);
      }
    }, 1000);
  }

  // Aplica configuração do FreePro - VERSÃO CORRIGIDA
  applyFreeProConfig(config) {
    // Primeiro, ativa a aba FreePro se necessário
    const tabBtn2 = document.getElementById('tabBtn2');
    if (tabBtn2 && tabBtn2.getAttribute('aria-selected') !== 'true') {
      tabBtn2.click();
    }
    
    setTimeout(() => {
      const iframe = document.getElementById('calc2frame');
      if (iframe && iframe.contentDocument) {
        const doc = iframe.contentDocument;
        
        console.log('Aplicando config FreePro:', config);
        
        // Aplica configurações básicas
        if (doc.getElementById('numEntradas')) {
          doc.getElementById('numEntradas').value = config.n || 3;
          doc.getElementById('numEntradas').dispatchEvent(new Event('change'));
        }
        
        if (doc.getElementById('round_step')) {
          doc.getElementById('round_step').value = config.r || 1.00;
        }
        
        // Detecta o modo e aplica
        if (config.mode === 'cashback') {
          // Ativa modo cashback se necessário
          const cashbackBtn = doc.getElementById('modeCashbackBtn');
          if (cashbackBtn && !cashbackBtn.classList.contains('active')) {
            cashbackBtn.click();
          }
          
          // Aplica dados do cashback
          setTimeout(() => {
            if (doc.getElementById('cashback_odd')) {
              doc.getElementById('cashback_odd').value = config.cashbackOdd || '';
            }
            if (doc.getElementById('cashback_stake')) {
              doc.getElementById('cashback_stake').value = config.cashbackStake || '';
            }
            if (doc.getElementById('cashback_rate')) {
              doc.getElementById('cashback_rate').value = config.cashbackRate || '';
            }
            
            // Dispara eventos para recálculo
            ['cashback_odd', 'cashback_stake', 'cashback_rate'].forEach(id => {
              const el = doc.getElementById(id);
              if (el) {
                el.dispatchEvent(new Event('input'));
                el.dispatchEvent(new Event('change'));
              }
            });
          }, 500);
          
        } else {
          // Modo freebet (padrão)
          const freebetBtn = doc.getElementById('modeFreebetBtn');
          if (freebetBtn && !freebetBtn.classList.contains('active')) {
            freebetBtn.click();
          }
          
          // Aplica dados da promoção freebet
          setTimeout(() => {
            if (config.promoOdd && doc.getElementById('o1')) {
              doc.getElementById('o1').value = config.promoOdd;
            }
            if (config.promoComm && doc.getElementById('c1')) {
              doc.getElementById('c1').value = config.promoComm;
            }
            if (config.promoStake && doc.getElementById('s1')) {
              doc.getElementById('s1').value = config.promoStake;
            }
            if (config.freebetValue && doc.getElementById('F')) {
              doc.getElementById('F').value = config.freebetValue;
            }
            if (config.extractionRate && doc.getElementById('r')) {
              doc.getElementById('r').value = config.extractionRate;
            }
            
            // Dispara eventos para recálculo
            ['o1', 'c1', 's1', 'F', 'r'].forEach(id => {
              const el = doc.getElementById(id);
              if (el) {
                el.dispatchEvent(new Event('input'));
                el.dispatchEvent(new Event('change'));
              }
            });
          }, 500);
        }
        
        // Aplica dados das coberturas
        if (config.coverages && Array.isArray(config.coverages)) {
          setTimeout(() => {
            const coverageCards = doc.querySelectorAll('.coverage-card');
            
            config.coverages.forEach((coverage, index) => {
              if (coverageCards[index]) {
                const card = coverageCards[index];
                
                const oddInput = card.querySelector('input[data-type="odd"]');
                if (oddInput && coverage.odd) {
                  oddInput.value = coverage.odd;
                  oddInput.dispatchEvent(new Event('input'));
                }
                
                const commInput = card.querySelector('input[data-type="comm"]');
                if (commInput && coverage.comm) {
                  commInput.value = coverage.comm;
                  commInput.dispatchEvent(new Event('input'));
                }
                
                const layInput = card.querySelector('input[data-type="lay"]');
                if (layInput && coverage.lay !== undefined) {
                  layInput.checked = coverage.lay;
                  layInput.dispatchEvent(new Event('change'));
                }
              }
            });
          }, 1000);
        }
        
        console.log('Configuração FreePro aplicada com sucesso');
      }
    }, 2000);
  }
}
