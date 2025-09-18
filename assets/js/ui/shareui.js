// assets/js/ui/shareui.js
// Sistema de interface de compartilhamento
// Integra com ShareSystem para criar links compartilháveis

import { ShareSystem } from '../utils/share.js';

export class ShareUI {
  constructor() {
    this.shareSystem = new ShareSystem();
    this.modal = null;
    this.modalContent = null;
    this.initialized = false;
  }

  async init() {
    try {
      console.log('Inicializando ShareUI...');
      
      // Cria o modal se não existir
      this.createModal();
      
      // Carrega configuração compartilhada da URL se existir
      this.loadSharedConfig();
      
      this.initialized = true;
      console.log('ShareUI inicializado com sucesso');
      
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
    console.log('ShareUI.handleShareClick chamado para:', calculatorType);
    
    if (!this.initialized) {
      console.error('ShareUI não está inicializado');
      return;
    }

    try {
      let data = null;
      let links = null;

      if (calculatorType === 'arbipro') {
        data = this.getArbiProData();
        if (!data) {
          this.showError('Preencha os dados da calculadora primeiro');
          return;
        }
        links = this.shareSystem.generateArbiProLink(data);
      } else if (calculatorType === 'freepro') {
        data = this.getFreeProData();
        if (!data) {
          this.showError('Preencha os dados da calculadora primeiro');
          return;
        }
        links = this.shareSystem.generateFreeProLink(data);
      } else {
        this.showError('Calculadora não reconhecida');
        return;
      }

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
      const arbiProApp = window.SharkGreen?.arbiPro;
      if (!arbiProApp) return null;

      // Coleta dados direto do DOM
      const numHouses = parseInt(document.getElementById('numHouses')?.value || '2');
      const rounding = parseFloat(document.getElementById('rounding')?.value || '0.01');
      
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
      if (!iframe || !iframe.contentDocument) return null;

      const doc = iframe.contentDocument;
      
      // Detecta o modo (freebet ou cashback)
      const isCashback = doc.body?.classList.contains('mode-cashback');
      
      const numEntradas = parseInt(doc.getElementById('numEntradas')?.value || '3');
      const roundStep = parseFloat(doc.getElementById('round_step')?.value || '1.00');
      
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
      } else {
        // Modo Freebet
        data.promoOdd = doc.getElementById('o1')?.value || '';
        data.promoComm = doc.getElementById('c1')?.value || '';
        data.promoStake = doc.getElementById('s1')?.value || '';
        data.freebetValue = doc.getElementById('F')?.value || '';
        data.extractionRate = doc.getElementById('r')?.value || '';
      }

      // Coleta coberturas
      data.coverages = [];
      const coverageInputs = doc.querySelectorAll('#oddsContainer input[data-type="odd"]');
      const commInputs = doc.querySelectorAll('#oddsContainer input[data-type="comm"]');
      const layInputs = doc.querySelectorAll('#oddsContainer input[data-type="lay"]');
      
      for (let i = 0; i < coverageInputs.length; i++) {
        data.coverages.push({
          odd: coverageInputs[i]?.value || '',
          commission: commInputs[i]?.value || '',
          lay: layInputs[i]?.checked || false
        });
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
    `;

    this.modal.style.display = 'block';
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
    alert(message); // Simplificado, você pode melhorar isso
  }

  loadSharedConfig() {
    try {
      const config = this.shareSystem.loadFromUrl();
      if (!config) return;

      console.log('Configuração compartilhada encontrada:', config);

      // Aplica configuração na calculadora apropriada
      setTimeout(() => {
        if (config.t === 'arbipro') {
          this.applyArbiProConfig(config);
        } else if (config.t === 'freepro') {
          this.applyFreeProConfig(config);
        }
      }, 2000);

      // Limpa URL
      this.shareSystem.cleanUrl();
    } catch (error) {
      console.error('Erro ao carregar configuração compartilhada:', error);
    }
  }

  applyArbiProConfig(config) {
    // TODO: Implementar aplicação da configuração no ArbiPro
    console.log('Aplicando configuração ArbiPro:', config);
  }

  applyFreeProConfig(config) {
    // TODO: Implementar aplicação da configuração no FreePro  
    console.log('Aplicando configuração FreePro:', config);
  }
}

// Export default para compatibilidade
export default ShareUI;
