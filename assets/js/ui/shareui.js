// assets/js/ui/shareui.js
// Sistema de interface de compartilhamento com DEBUG DETALHADO

import { ShareSystem } from '../utils/share.js';

export class ShareUI {
  constructor() {
    this.shareSystem = new ShareSystem();
    this.modal = null;
    this.modalContent = null;
    this.initialized = false;
    this.debugMode = true; // Ativar debug
  }

  log(...args) {
    if (this.debugMode) {
      console.log('🔗[ShareUI]', ...args);
    }
  }

  async init() {
    try {
      this.log('Inicializando ShareUI...');
      
      // Cria o modal se não existir
      this.createModal();
      
      // IMPORTANTE: Carrega configuração compartilhada IMEDIATAMENTE
      this.loadSharedConfig();
      
      this.initialized = true;
      this.log('ShareUI inicializado com sucesso');
      
      return true;
    } catch (error) {
      console.error('Erro ao inicializar ShareUI:', error);
      return false;
    }
  }

  createModal() {
    // Remove modal existente se houver
    const existingModal = document.getElementById('shareModal');
    if (existingModal) {
      existingModal.remove();
    }

    // Cria estrutura do modal
    const modal = document.createElement('div');
    modal.id = 'shareModal';
    modal.style.cssText = `
      display: none;
      position: fixed;
      z-index: 10000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(10px);
      animation: fadeIn 0.3s ease;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: linear-gradient(135deg, rgba(31, 41, 59, 0.95), rgba(55, 65, 81, 0.9));
      margin: 10% auto;
      padding: 2rem;
      border: 2px solid var(--border, #4b5563);
      border-radius: 16px;
      max-width: 500px;
      width: 90%;
      position: relative;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      animation: slideIn 0.3s ease;
    `;

    content.innerHTML = `
      <button id="closeModal" style="
        position: absolute;
        right: 1rem;
        top: 1rem;
        background: transparent;
        border: none;
        color: var(--text-secondary, #d1d5db);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        line-height: 1;
        transition: all 0.2s ease;
      ">✕</button>
      
      <h2 style="
        margin: 0 0 1.5rem 0;
        color: var(--text-primary, #f9fafb);
        font-size: 1.5rem;
        font-weight: 700;
      ">🔗 Compartilhar Configuração</h2>
      
      <div id="shareContent"></div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Adiciona estilos de animação
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideIn {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);

    this.modal = modal;
    this.modalContent = document.getElementById('shareContent');

    // Bind events
    document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeModal();
    });
  }

  handleShareClick(calculatorType) {
    this.log('handleShareClick chamado para:', calculatorType);
    
    if (!this.initialized) {
      console.error('ShareUI não está inicializado');
      return;
    }

    try {
      let data = null;
      let links = null;

      if (calculatorType === 'arbipro') {
        data = this.getArbiProData();
        this.log('Dados ArbiPro coletados:', data);
        if (!data) {
          this.showError('Preencha os dados da calculadora primeiro');
          return;
        }
        links = this.shareSystem.generateArbiProLink(data);
      } else if (calculatorType === 'freepro') {
        data = this.getFreeProData();
        this.log('Dados FreePro coletados:', data);
        if (!data) {
          this.showError('Preencha os dados da calculadora primeiro');
          return;
        }
        links = this.shareSystem.generateFreeProLink(data);
      } else {
        this.showError('Calculadora não reconhecida');
        return;
      }

      this.log('Links gerados:', links);

      if (links) {
        this.showShareModal(links);
      }
    } catch (error) {
      console.error('Erro ao gerar link:', error);
      this.showError('Erro ao gerar link de compartilhamento');
    }
  }

  getArbiProData() {
    try {
      // Coleta dados direto do DOM
      const numHousesEl = document.getElementById('numHouses');
      const roundingEl = document.getElementById('rounding');
      
      if (!numHousesEl || !roundingEl) {
        this.log('Elementos de configuração não encontrados');
        return null;
      }

      const numHouses = parseInt(numHousesEl.value || '2');
      const rounding = parseFloat(roundingEl.value || '0.01');
      
      this.log('Coletando dados para', numHouses, 'casas com arredondamento', rounding);
      
      const houses = [];
      for (let i = 0; i < numHouses; i++) {
        const house = {
          odd: document.getElementById(`odd-${i}`)?.value || '',
          stake: document.getElementById(`stake-${i}`)?.value || '',
          commission: null,
          freebet: false,
          increase: null,
          lay: false,
          fixedStake: false
        };

        // Verifica checkbox de comissão
        const commCheckbox = document.querySelector(`[data-action="toggleCommission"][data-idx="${i}"]`);
        if (commCheckbox?.checked) {
          house.commission = parseFloat(document.getElementById(`commission-${i}`)?.value || '0');
        }

        // Verifica checkbox de freebet
        const freebetCheckbox = document.querySelector(`[data-action="toggleFreebet"][data-idx="${i}"]`);
        if (freebetCheckbox?.checked) {
          house.freebet = true;
        }

        // Verifica checkbox de aumento
        const increaseCheckbox = document.querySelector(`[data-action="toggleIncrease"][data-idx="${i}"]`);
        if (increaseCheckbox?.checked) {
          house.increase = parseFloat(document.getElementById(`increase-${i}`)?.value || '0');
        }

        // Verifica botão LAY
        const layBtn = document.querySelector(`[data-action="toggleLay"][data-idx="${i}"]`);
        if (layBtn?.classList.contains('active')) {
          house.lay = true;
        }

        // Verifica stake fixada
        const fixBtn = document.querySelector(`[data-action="fixStake"][data-idx="${i}"]`);
        if (fixBtn?.classList.contains('btn-primary')) {
          house.fixedStake = true;
        }

        houses.push(house);
        this.log(`Casa ${i+1}:`, house);
      }

      return {
        numHouses,
        rounding,
        houses
      };
    } catch (error) {
      console.error('Erro ao coletar dados ArbiPro:', error);
      return null;
    }
  }

  getFreeProData() {
    try {
      const iframe = document.getElementById('calc2frame');
      if (!iframe || !iframe.contentDocument) {
        this.log('Iframe FreePro não encontrado ou não carregado');
        return null;
      }

      const doc = iframe.contentDocument;
      
      // Detecta o modo (freebet ou cashback)
      const isCashback = doc.body?.classList.contains('mode-cashback');
      
      const numEntradas = parseInt(doc.getElementById('numEntradas')?.value || '3');
      const roundStep = parseFloat(doc.getElementById('round_step')?.value || '1.00');
      
      this.log('Modo:', isCashback ? 'cashback' : 'freebet', 'Entradas:', numEntradas);
      
      const data = {
        numEntradas,
        roundStep,
        mode: isCashback ? 'cashback' : 'freebet'
      };

      if (isCashback) {
        // Modo Cashback
        data.cashbackOdd = doc.getElementById('cashback_odd')?.value || '';
        data.cashbackStake = doc.getElementById('cashback_stake')?.value || '';
        data.cashbackRate = doc.getElementById('cashback_rate')?.value || '';
        this.log('Dados Cashback:', { odd: data.cashbackOdd, stake: data.cashbackStake, rate: data.cashbackRate });
      } else {
        // Modo Freebet
        data.promoOdd = doc.getElementById('o1')?.value || '';
        data.promoComm = doc.getElementById('c1')?.value || '';
        data.promoStake = doc.getElementById('s1')?.value || '';
        data.freebetValue = doc.getElementById('F')?.value || '';
        data.extractionRate = doc.getElementById('r')?.value || '';
        this.log('Dados Freebet:', { odd: data.promoOdd, comm: data.promoComm, stake: data.promoStake, freebet: data.freebetValue, extraction: data.extractionRate });
      }

      // Coleta coberturas
      data.coverages = [];
      const coverageInputs = doc.querySelectorAll('#oddsContainer input[data-type="odd"]');
      const commInputs = doc.querySelectorAll('#oddsContainer input[data-type="comm"]');
      const layInputs = doc.querySelectorAll('#oddsContainer input[data-type="lay"]');
      
      for (let i = 0; i < coverageInputs.length; i++) {
        const coverage = {
          odd: coverageInputs[i]?.value || '',
          commission: commInputs[i]?.value || '',
          lay: layInputs[i]?.checked || false
        };
        data.coverages.push(coverage);
        this.log(`Cobertura ${i+1}:`, coverage);
      }

      return data;
    } catch (error) {
      console.error('Erro ao coletar dados FreePro:', error);
      return null;
    }
  }

  showShareModal(links) {
    if (!this.modal || !this.modalContent) return;

    const { fullUrl, shortUrl } = links;
    
    this.modalContent.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <label style="
          display: block;
          color: var(--text-secondary, #d1d5db);
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        ">Link Curto</label>
        <div style="display: flex; gap: 0.5rem;">
          <input id="shortUrlInput" type="text" value="${shortUrl}" readonly style="
            flex: 1;
            padding: 0.75rem;
            border: 2px solid var(--border, #4b5563);
            border-radius: 8px;
            background: rgba(17, 24, 39, 0.8);
            color: var(--text-primary, #f9fafb);
            font-family: monospace;
            font-size: 0.875rem;
          ">
          <button onclick="window.SharkGreen.shareUI.copyToClipboard('shortUrlInput')" style="
            padding: 0.75rem 1.5rem;
            background: linear-gradient(135deg, #3b82f6, #22c55e);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          ">📋 Copiar</button>
        </div>
      </div>

      <div style="margin-bottom: 1.5rem;">
        <label style="
          display: block;
          color: var(--text-secondary, #d1d5db);
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        ">Link Completo</label>
        <div style="display: flex; gap: 0.5rem;">
          <input id="fullUrlInput" type="text" value="${fullUrl}" readonly style="
            flex: 1;
            padding: 0.75rem;
            border: 2px solid var(--border, #4b5563);
            border-radius: 8px;
            background: rgba(17, 24, 39, 0.8);
            color: var(--text-primary, #f9fafb);
            font-family: monospace;
            font-size: 0.75rem;
          ">
          <button onclick="window.SharkGreen.shareUI.copyToClipboard('fullUrlInput')" style="
            padding: 0.75rem 1.5rem;
            background: rgba(55, 65, 81, 0.8);
            color: var(--text-primary, #f9fafb);
            border: 2px solid var(--border, #4b5563);
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          ">📋 Copiar</button>
        </div>
      </div>

      <div id="copyStatus" style="
        text-align: center;
        padding: 0.75rem;
        margin-top: 1rem;
        border-radius: 8px;
        display: none;
        background: rgba(34, 197, 94, 0.2);
        border: 1px solid #22c55e;
        color: #22c55e;
        font-weight: 600;
      "></div>

      <div style="margin-top: 1.5rem; padding: 1rem; border: 1px solid var(--border); border-radius: 8px; background: rgba(17, 24, 39, 0.4);">
        <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">🧪 Debug - Testar Aplicação:</h4>
        <button onclick="window.SharkGreen.shareUI.testConfigApplication('${btoa(JSON.stringify(links))}')" style="
          width: 100%;
          padding: 0.5rem;
          background: rgba(139, 92, 246, 0.8);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
        ">🔍 Testar Carregamento de Configuração</button>
      </div>
    `;

    this.modal.style.display = 'block';
  }

  // MÉTODO DE TESTE PARA DEBUG
  testConfigApplication(linksBase64) {
    try {
      const links = JSON.parse(atob(linksBase64));
      this.log('Testando aplicação de configuração...');
      
      // Simula carregamento de configuração
      const fullUrl = links.fullUrl;
      const shareParam = fullUrl.split('?share=')[1];
      
      if (shareParam) {
        const config = this.shareSystem.decodeConfig(shareParam);
        this.log('Configuração decodificada:', config);
        
        if (config) {
          if (config.t === 'arbipro') {
            this.log('Testando aplicação ArbiPro...');
            this.applyArbiProConfig(config);
          } else if (config.t === 'freepro') {
            this.log('Testando aplicação FreePro...');
            this.applyFreeProConfig(config);
          }
        }
      }
    } catch (error) {
      console.error('Erro no teste:', error);
    }
  }

  async copyToClipboard(inputId) {
    const input = document.getElementById(inputId);
    const status = document.getElementById('copyStatus');
    
    if (!input || !status) return;

    try {
      await this.shareSystem.copyToClipboard(input.value);
      
      status.textContent = '✅ Link copiado com sucesso!';
      status.style.display = 'block';
      
      setTimeout(() => {
        status.style.display = 'none';
      }, 3000);
    } catch (error) {
      status.textContent = '❌ Erro ao copiar';
      status.style.background = 'rgba(220, 38, 38, 0.2)';
      status.style.borderColor = '#dc2626';
      status.style.color = '#dc2626';
      status.style.display = 'block';
      
      setTimeout(() => {
        status.style.display = 'none';
      }, 3000);
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.style.display = 'none';
    }
  }

  showError(message) {
    console.error('ShareUI Error:', message);
    alert(message);
  }

  loadSharedConfig() {
    try {
      this.log('Verificando URL para configuração compartilhada...');
      const config = this.shareSystem.loadFromUrl();
      
      if (!config) {
        this.log('Nenhuma configuração compartilhada encontrada na URL');
        return;
      }

      this.log('🎉 Configuração compartilhada encontrada:', config);

      // Aplica configuração na calculadora apropriada
      // MUDANÇA: Vamos tentar aplicar em intervalos até conseguir
      this.waitAndApplyConfig(config, 0);

    } catch (error) {
      console.error('Erro ao carregar configuração compartilhada:', error);
    }
  }

  waitAndApplyConfig(config, attempt) {
    const maxAttempts = 10;
    const delay = 1000; // 1 segundo
    
    this.log(`Tentativa ${attempt + 1}/${maxAttempts} de aplicar configuração...`);
    
    if (attempt >= maxAttempts) {
      console.error('Falha ao aplicar configuração após', maxAttempts, 'tentativas');
      // Limpa URL mesmo assim
      this.shareSystem.cleanUrl();
      return;
    }
    
    try {
      let success = false;
      
      if (config.t === 'arbipro') {
        success = this.applyArbiProConfig(config);
      } else if (config.t === 'freepro') {
        success = this.applyFreeProConfig(config);
      }
      
      if (success) {
        this.log('✅ Configuração aplicada com sucesso!');
        // Limpa URL apenas após sucesso
        setTimeout(() => {
          this.shareSystem.cleanUrl();
        }, 1000);
      } else {
        // Tenta novamente
        setTimeout(() => {
          this.waitAndApplyConfig(config, attempt + 1);
        }, delay);
      }
      
    } catch (error) {
      console.error('Erro na tentativa', attempt + 1, ':', error);
      setTimeout(() => {
        this.waitAndApplyConfig(config, attempt + 1);
      }, delay);
    }
  }

  applyArbiProConfig(config) {
    try {
      this.log('Aplicando configuração ArbiPro:', config);
      
      // Verifica se a interface está pronta
      const numHousesSelect = document.getElementById('numHouses');
      const roundingSelect = document.getElementById('rounding');
      
      if (!numHousesSelect || !roundingSelect) {
        this.log('Interface ArbiPro ainda não está pronta');
        return false;
      }

      // 1. Aplica número de casas
      if (config.n && config.n !== parseInt(numHousesSelect.value)) {
        this.log('Aplicando número de casas:', config.n);
        numHousesSelect.value = config.n.toString();
        numHousesSelect.dispatchEvent(new Event('change'));
      }

      // 2. Aplica arredondamento
      if (config.r && config.r !== parseFloat(roundingSelect.value)) {
        this.log('Aplicando arredondamento:', config.r);
        roundingSelect.value = config.r.toString();
        roundingSelect.dispatchEvent(new Event('change'));
      }

      // 3. Aguarda as casas serem renderizadas e aplica os dados
      setTimeout(() => {
        this.fillArbiProHouses(config.h || []);
      }, 300);

      return true;
    } catch (error) {
      console.error('Erro ao aplicar configuração ArbiPro:', error);
      return false;
    }
  }

  fillArbiProHouses(houses) {
    try {
      this.log('Preenchendo', houses.length, 'casas...');
      
      houses.forEach((house, i) => {
        this.log(`Preenchendo casa ${i+1}:`, house);
        
        // Odd
        const oddInput = document.getElementById(`odd-${i}`);
        if (oddInput && house.o) {
          oddInput.value = house.o;
          oddInput.dispatchEvent(new Event('input'));
          this.log(`Casa ${i+1} - Odd aplicada:`, house.o);
        }

        // Stake
        const stakeInput = document.getElementById(`stake-${i}`);
        if (stakeInput && house.s) {
          stakeInput.value = house.s;
          stakeInput.dispatchEvent(new Event('input'));
          this.log(`Casa ${i+1} - Stake aplicado:`, house.s);
        }

        // Comissão
        if (house.c !== null && house.c !== undefined) {
          const commCheckbox = document.querySelector(`[data-action="toggleCommission"][data-idx="${i}"]`);
          if (commCheckbox && !commCheckbox.checked) {
            commCheckbox.checked = true;
            commCheckbox.dispatchEvent(new Event('change'));
            
            setTimeout(() => {
              const commInput = document.getElementById(`commission-${i}`);
              if (commInput) {
                commInput.value = house.c.toString();
                commInput.dispatchEvent(new Event('input'));
                this.log(`Casa ${i+1} - Comissão aplicada:`, house.c);
              }
            }, 100);
          }
        }

        // Freebet
        if (house.f) {
          const freebetCheckbox = document.querySelector(`[data-action="toggleFreebet"][data-idx="${i}"]`);
          if (freebetCheckbox && !freebetCheckbox.checked) {
            freebetCheckbox.checked = true;
            freebetCheckbox.dispatchEvent(new Event('change'));
            this.log(`Casa ${i+1} - Freebet ativado`);
          }
        }

        // Aumento de odd
        if (house.i !== null && house.i !== undefined) {
          const increaseCheckbox = document.querySelector(`[data-action="toggleIncrease"][data-idx="${i}"]`);
          if (increaseCheckbox && !increaseCheckbox.checked) {
            increaseCheckbox.checked = true;
            increaseCheckbox.dispatchEvent(new Event('change'));
            
            setTimeout(() => {
              const increaseInput = document.getElementById(`increase-${i}`);
              if (increaseInput) {
                increaseInput.value = house.i.toString();
                increaseInput.dispatchEvent(new Event('input'));
                this.log(`Casa ${i+1} - Aumento aplicado:`, house.i);
              }
            }, 100);
          }
        }

        // Lay
        if (house.l) {
          const layBtn = document.querySelector(`[data-action="toggleLay"][data-idx="${i}"]`);
          if (layBtn && !layBtn.classList.contains('active')) {
            layBtn.click();
            this.log(`Casa ${i+1} - LAY ativado`);
          }
        }

        // Stake fixada
        if (house.x) {
          const fixBtn = document.querySelector(`[data-action="fixStake"][data-idx="${i}"]`);
          if (fixBtn && !fixBtn.classList.contains('btn-primary')) {
            fixBtn.click();
            this.log(`Casa ${i+1} - Stake fixada`);
          }
        }
      });
    } catch (error) {
      console.error('Erro ao preencher casas ArbiPro:', error);
    }
  }

  applyFreeProConfig(config) {
    try {
      this.log('Aplicando configuração FreePro:', config);
      
      // Primeiro força a aba FreePro ser ativada
      const freeProTab = document.getElementById('tabBtn2');
      if (freeProTab && freeProTab.getAttribute('aria-selected') !== 'true') {
        this.log('Ativando aba FreePro...');
        freeProTab.click();
        
        // Aguarda um tempo para a aba carregar e tenta novamente
        setTimeout(() => {
          this.applyFreeProConfigDirect(config);
        }, 1500);
        return true;
      } else {
        return this.applyFreeProConfigDirect(config);
      }
      
    } catch (error) {
      console.error('Erro ao aplicar configuração FreePro:', error);
      return false;
    }
  }

  applyFreeProConfigDirect(config) {
    try {
      // Verifica se o iframe está pronto
      const iframe = document.getElementById('calc2frame');
      if (!iframe || !iframe.contentDocument) {
        this.log('Iframe FreePro ainda não está pronto');
        return false;
      }

      const doc = iframe.contentDocument;
      
      // 1. Aplica modo (freebet/cashback)
      if (config.mode === 'cashback') {
        const cashbackBtn = doc.getElementById('modeCashbackBtn');
        if (cashbackBtn && !cashbackBtn.classList.contains('active')) {
          this.log('Ativando modo Cashback...');
          cashbackBtn.click();
        }
      }

      // 2. Aplica número de entradas
      if (config.n) {
        const numEntradasSelect = doc.getElementById('numEntradas');
        if (numEntradasSelect && config.n !== parseInt(numEntradasSelect.value)) {
          this.log('Aplicando número de entradas:', config.n);
          numEntradasSelect.value = config.n.toString();
          numEntradasSelect.dispatchEvent(new Event('change'));
        }
      }

      // 3. Aplica arredondamento
      if (config.r) {
        const roundStepSelect = doc.getElementById('round_step');
        if (roundStepSelect && config.r !== parseFloat(roundStepSelect.value)) {
          this.log('Aplicando arredondamento:', config.r);
          roundStepSelect.value = config.r.toString();
          roundStepSelect.dispatchEvent(new Event('change'));
        }
      }

      // 4. Aguarda um pouco e aplica os dados específicos
      setTimeout(() => {
        this.fillFreeProData(config, doc);
      }, 300);

      return true;
    } catch (error) {
      console.error('Erro ao aplicar configuração FreePro diretamente:', error);
      return false;
    }
  }

  fillFreeProData(config, doc) {
    try {
      this.log('Preenchendo dados FreePro, modo:', config.mode);
      
      if (config.mode === 'cashback') {
        // Modo Cashback
        const fields = [
          { id: 'cashback_odd', value: config.cashbackOdd, label: 'Odd Cashback' },
          { id: 'cashback_stake', value: config.cashbackStake, label: 'Stake Cashback' },
          { id: 'cashback_rate', value: config.cashbackRate, label: 'Rate Cashback' }
        ];

        fields.forEach(field => {
          if (field.value) {
            const input = doc.getElementById(field.id);
            if (input) {
              input.value = field.value;
              input.dispatchEvent(new Event('input'));
              this.log(`${field.label} aplicado:`, field.value);
            }
          }
        });
      } else {
        // Modo Freebet
        const fields = [
          { id: 'o1', value: config.promoOdd, label: 'Odd Promo' },
          { id: 'c1', value: config.promoComm, label: 'Comissão Promo' },
          { id: 's1', value: config.promoStake, label: 'Stake Promo' },
          { id: 'F', value: config.freebetValue, label: 'Valor Freebet' },
          { id: 'r', value: config.extractionRate, label: 'Taxa Extração' }
        ];

        fields.forEach(field => {
          if (field.value) {
            const input = doc.getElementById(field.id);
            if (input) {
              input.value = field.value;
              input.dispatchEvent(new Event('input'));
              this.log(`${field.label} aplicado:`, field.value);
            }
          }
        });
      }

      // Aguarda um pouco e aplica as coberturas
      setTimeout(() => {
        this.fillFreeProCoverages(config.coverages || [], doc);
      }, 200);

    } catch (error) {
      console.error('Erro ao preencher dados FreePro:', error);
    }
  }

  fillFreeProCoverages(coverages, doc) {
    try {
      this.log('Preenchendo', coverages.length, 'coberturas...');
      
      const oddInputs = doc.querySelectorAll('#oddsContainer input[data-type="odd"]');
      const commInputs = doc.querySelectorAll('#oddsContainer input[data-type="comm"]');
      const layInputs = doc.querySelectorAll('#oddsContainer input[data-type="lay"]');

      coverages.forEach((coverage, i) => {
        this.log(`Cobertura ${i+1}:`, coverage);
        
        // Odd
        if (oddInputs[i] && coverage.odd) {
          oddInputs[i].value = coverage.odd;
          oddInputs[i].dispatchEvent(new Event('input'));
          this.log(`Cobertura ${i+1} - Odd aplicada:`, coverage.odd);
        }

        // Comissão
        if (commInputs[i] && coverage.commission) {
          commInputs[i].value = coverage.commission;
          commInputs[i].dispatchEvent(new Event('input'));
          this.log(`Cobertura ${i+1} - Comissão aplicada:`, coverage.commission);
        }

        // Lay
        if (layInputs[i] && coverage.lay && !layInputs[i].checked) {
          layInputs[i].checked = true;
          layInputs[i].dispatchEvent(new Event('change'));
          this.log(`Cobertura ${i+1} - LAY ativado`);
        }
      });
    } catch (error) {
      console.error('Erro ao preencher coberturas FreePro:', error);
    }
  }
}

// Export tanto named quanto default para máxima compatibilidade
export { ShareUI };
export default ShareUI;
