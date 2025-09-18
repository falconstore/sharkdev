// assets/js/ui/shareui.js
// Sistema de interface de compartilhamento - VERSÃO SIMPLIFICADA

import ShareSystem from '../utils/share.js';

class ShareUI {
  constructor() {
    this.shareSystem = new ShareSystem();
    this.modal = null;
    this.initialized = false;
  }

  async init() {
    try {
      console.log('Inicializando ShareUI...');
      this.createModal();
      this.loadSharedConfig();
      this.initialized = true;
      console.log('✅ ShareUI inicializado');
      return true;
    } catch (error) {
      console.error('Erro ao inicializar ShareUI:', error);
      return false;
    }
  }

  createModal() {
    const existingModal = document.getElementById('shareModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'shareModal';
    modal.style.cssText = `
      display: none; position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%;
      background-color: rgba(0, 0, 0, 0.8); backdrop-filter: blur(10px);
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: linear-gradient(135deg, rgba(31, 41, 59, 0.95), rgba(55, 65, 81, 0.9));
      margin: 10% auto; padding: 2rem; border: 2px solid #4b5563; border-radius: 16px;
      max-width: 500px; width: 90%; position: relative;
    `;

    content.innerHTML = `
      <button id="closeModal" style="position: absolute; right: 1rem; top: 1rem; background: transparent; border: none; color: #d1d5db; font-size: 1.5rem; cursor: pointer;">✕</button>
      <h2 style="margin: 0 0 1.5rem 0; color: #f9fafb; font-size: 1.5rem; font-weight: 700;">🔗 Compartilhar Configuração</h2>
      <div id="shareContent"></div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);
    this.modal = modal;

    document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
    modal.addEventListener('click', (e) => { if (e.target === modal) this.closeModal(); });
  }

  handleShareClick(calculatorType) {
    console.log('ShareUI: handleShareClick para', calculatorType);
    
    if (!this.initialized) {
      console.error('ShareUI não inicializado');
      return;
    }

    try {
      let data = null;
      let links = null;

      if (calculatorType === 'arbipro') {
        data = this.getArbiProData();
        if (!data) {
          alert('Preencha os dados da calculadora primeiro');
          return;
        }
        links = this.shareSystem.generateArbiProLink(data);
      } else if (calculatorType === 'freepro') {
        data = this.getFreeProData();
        if (!data) {
          alert('Preencha os dados da calculadora primeiro');
          return;
        }
        links = this.shareSystem.generateFreeProLink(data);
      }

      if (links) {
        this.showShareModal(links);
      }
    } catch (error) {
      console.error('Erro ao gerar link:', error);
      alert('Erro ao gerar link de compartilhamento');
    }
  }

  getArbiProData() {
    try {
      const numHousesEl = document.getElementById('numHouses');
      const roundingEl = document.getElementById('rounding');
      
      if (!numHousesEl || !roundingEl) return null;

      const numHouses = parseInt(numHousesEl.value || '2');
      const rounding = parseFloat(roundingEl.value || '0.01');
      
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

        const commCheckbox = document.querySelector(`[data-action="toggleCommission"][data-idx="${i}"]`);
        if (commCheckbox?.checked) {
          house.commission = parseFloat(document.getElementById(`commission-${i}`)?.value || '0');
        }

        const freebetCheckbox = document.querySelector(`[data-action="toggleFreebet"][data-idx="${i}"]`);
        if (freebetCheckbox?.checked) house.freebet = true;

        const increaseCheckbox = document.querySelector(`[data-action="toggleIncrease"][data-idx="${i}"]`);
        if (increaseCheckbox?.checked) {
          house.increase = parseFloat(document.getElementById(`increase-${i}`)?.value || '0');
        }

        const layBtn = document.querySelector(`[data-action="toggleLay"][data-idx="${i}"]`);
        if (layBtn?.classList.contains('active')) house.lay = true;

        const fixBtn = document.querySelector(`[data-action="fixStake"][data-idx="${i}"]`);
        if (fixBtn?.classList.contains('btn-primary')) house.fixedStake = true;

        houses.push(house);
      }

      return { numHouses, rounding, houses };
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
      const isCashback = doc.body?.classList.contains('mode-cashback');
      const numEntradas = parseInt(doc.getElementById('numEntradas')?.value || '3');
      const roundStep = parseFloat(doc.getElementById('round_step')?.value || '1.00');
      
      const data = {
        numEntradas,
        roundStep,
        mode: isCashback ? 'cashback' : 'freebet'
      };

      if (isCashback) {
        data.cashbackOdd = doc.getElementById('cashback_odd')?.value || '';
        data.cashbackStake = doc.getElementById('cashback_stake')?.value || '';
        data.cashbackRate = doc.getElementById('cashback_rate')?.value || '';
      } else {
        data.promoOdd = doc.getElementById('o1')?.value || '';
        data.promoComm = doc.getElementById('c1')?.value || '';
        data.promoStake = doc.getElementById('s1')?.value || '';
        data.freebetValue = doc.getElementById('F')?.value || '';
        data.extractionRate = doc.getElementById('r')?.value || '';
      }

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
    const { fullUrl, shortUrl } = links;
    const shareContent = document.getElementById('shareContent');
    
    shareContent.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; color: #d1d5db; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Link Curto</label>
        <div style="display: flex; gap: 0.5rem;">
          <input id="shortUrlInput" type="text" value="${shortUrl}" readonly style="flex: 1; padding: 0.75rem; border: 2px solid #4b5563; border-radius: 8px; background: rgba(17, 24, 39, 0.8); color: #f9fafb; font-family: monospace;">
          <button onclick="window.SharkGreen.shareUI.copyToClipboard('shortUrlInput')" style="padding: 0.75rem 1.5rem; background: linear-gradient(135deg, #3b82f6, #22c55e); color: white; border: none; border-radius: 8px; cursor: pointer;">📋</button>
        </div>
      </div>
      <div style="margin-bottom: 1.5rem;">
        <label style="display: block; color: #d1d5db; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Link Completo</label>
        <div style="display: flex; gap: 0.5rem;">
          <input id="fullUrlInput" type="text" value="${fullUrl}" readonly style="flex: 1; padding: 0.75rem; border: 2px solid #4b5563; border-radius: 8px; background: rgba(17, 24, 39, 0.8); color: #f9fafb; font-family: monospace; font-size: 0.75rem;">
          <button onclick="window.SharkGreen.shareUI.copyToClipboard('fullUrlInput')" style="padding: 0.75rem 1.5rem; background: rgba(55, 65, 81, 0.8); color: #f9fafb; border: 2px solid #4b5563; border-radius: 8px; cursor: pointer;">📋</button>
        </div>
      </div>
      <div id="copyStatus" style="display: none; text-align: center; padding: 0.75rem; margin-top: 1rem; border-radius: 8px; background: rgba(34, 197, 94, 0.2); border: 1px solid #22c55e; color: #22c55e;"></div>
    `;

    this.modal.style.display = 'block';
  }

  async copyToClipboard(inputId) {
    const input = document.getElementById(inputId);
    const status = document.getElementById('copyStatus');
    
    try {
      await this.shareSystem.copyToClipboard(input.value);
      status.textContent = '✅ Link copiado!';
      status.style.display = 'block';
      setTimeout(() => status.style.display = 'none', 3000);
    } catch (error) {
      status.textContent = '❌ Erro ao copiar';
      status.style.background = 'rgba(220, 38, 38, 0.2)';
      status.style.color = '#dc2626';
      status.style.display = 'block';
      setTimeout(() => status.style.display = 'none', 3000);
    }
  }

  closeModal() {
    if (this.modal) this.modal.style.display = 'none';
  }

  loadSharedConfig() {
    try {
      const config = this.shareSystem.loadFromUrl();
      if (!config) return;

      console.log('Configuração encontrada:', config);
      
      setTimeout(() => {
        if (config.t === 'arbipro') {
          this.applyArbiProConfig(config);
        } else if (config.t === 'freepro') {
          this.applyFreeProConfig(config);
        }
      }, 2000);

      this.shareSystem.cleanUrl();
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
    }
  }

  applyArbiProConfig(config) {
    console.log('Aplicando ArbiPro config:', config);
    // Implementação básica - você pode expandir depois
  }

  applyFreeProConfig(config) {
    console.log('Aplicando FreePro config:', config);
    // Implementação básica - você pode expandir depois
  }
}

// Export default
export default ShareUI;
