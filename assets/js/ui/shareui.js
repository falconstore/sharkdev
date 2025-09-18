// assets/js/ui/shareui.js - VERSÃO CORRIGIDA
// Sistema de UI para compartilhamento

import { ShareSystem } from '../utils/share.js';

export class ShareUI {
  constructor() {
    this.shareSystem = new ShareSystem();
    this.modal = null;
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;
    
    console.log('Inicializando ShareUI...');
    
    // Cria modal de compartilhamento
    this.createShareModal();
    
    // Carrega configuração da URL se existir
    this.loadSharedConfig();
    
    this.initialized = true;
    console.log('ShareUI inicializado com sucesso');
  }

  createShareModal() {
    // Remove modal existente se houver
    const existingModal = document.getElementById('shareModal');
    if (existingModal) {
      existingModal.remove();
    }

    // Cria novo modal
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
      background-color: rgba(0,0,0,0.8);
      backdrop-filter: blur(5px);
    `;

    modal.innerHTML = `
      <div style="
        background: var(--bg-card);
        margin: 5% auto;
        padding: 2rem;
        border: 1px solid var(--border);
        border-radius: 16px;
        width: 90%;
        max-width: 500px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h3 style="color: var(--text-primary); margin: 0; font-size: 1.25rem; font-weight: 700;">
            🔗 Compartilhar Configuração
          </h3>
          <button id="closeShareModal" style="
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--text-muted);
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 4px;
            transition: all 0.2s ease;
          ">&times;</button>
        </div>
        
        <div style="margin-bottom: 1rem;">
          <label style="
            display: block;
            color: var(--text-secondary);
            font-weight: 600;
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          ">Link de Compartilhamento:</label>
          <div style="display: flex; gap: 0.75rem;">
            <input 
              id="shareUrlInput" 
              type="text" 
              readonly 
              style="
                flex: 1;
                padding: 0.75rem;
                border: 2px solid var(--border);
                border-radius: 8px;
                background: var(--bg-secondary);
                color: var(--text-primary);
                font-family: ui-monospace, monospace;
                font-size: 0.875rem;
              "
              placeholder="Gerando link..."
            />
            <button id="copyShareBtn" style="
              padding: 0.75rem 1.5rem;
              background: linear-gradient(135deg, var(--primary), var(--secondary));
              color: white;
              border: none;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;
              white-space: nowrap;
            ">
              Copiar
            </button>
          </div>
        </div>
        
        <div style="
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
        ">
          <p style="
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin: 0;
            line-height: 1.5;
          ">
            💡 <strong>Dica:</strong> Este link permite que outras pessoas vejam exatamente a mesma configuração que você está usando agora.
          </p>
        </div>
        
        <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
          <button id="shortenUrlBtn" style="
            padding: 0.75rem 1.5rem;
            background: rgba(55, 65, 81, 0.8);
            color: var(--text-primary);
            border: 2px solid var(--border);
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            Encurtar URL
          </button>
          <button id="shareWhatsappBtn" style="
            padding: 0.75rem 1.5rem;
            background: #25d366;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
          ">
            📱 WhatsApp
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modal = modal;

    // Bind eventos
    this.bindModalEvents();
  }

  bindModalEvents() {
    if (!this.modal) return;

    // Fechar modal
    const closeBtn = this.modal.querySelector('#closeShareModal');
    closeBtn?.addEventListener('click', () => this.hideModal());

    // Fechar ao clicar fora
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hideModal();
      }
    });

    // Copiar URL
    const copyBtn = this.modal.querySelector('#copyShareBtn');
    copyBtn?.addEventListener('click', () => this.copyShareUrl());

    // Encurtar URL
    const shortenBtn = this.modal.querySelector('#shortenUrlBtn');
    shortenBtn?.addEventListener('click', () => this.shortenShareUrl());

    // Compartilhar WhatsApp
    const whatsappBtn = this.modal.querySelector('#shareWhatsappBtn');
    whatsappBtn?.addEventListener('click', () => this.shareWhatsApp());

    // ESC para fechar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.style.display === 'block') {
        this.hideModal();
      }
    });
  }

  async handleShareClick(calculatorType) {
    console.log(`Compartilhando ${calculatorType}...`);
    
    try {
      let shareData;
      let shareUrl;

      if (calculatorType === 'arbipro') {
        shareData = this.getArbiProData();
        shareUrl = this.shareSystem.generateArbiProLink(shareData);
      } else if (calculatorType === 'freepro') {
        shareData = this.getFreeProData();
        shareUrl = this.shareSystem.generateFreeProLink(shareData);
      } else {
        throw new Error('Tipo de calculadora inválido');
      }

      if (!shareUrl) {
        throw new Error('Não foi possível gerar o link');
      }

      await this.showModal(shareUrl);
      
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      alert('Erro ao gerar link de compartilhamento: ' + error.message);
    }
  }

  getArbiProData() {
    // Busca dados da calculadora ArbiPro
    const app = window.SharkGreen;
    if (!app?.arbiPro) {
      throw new Error('ArbiPro não encontrado');
    }

    return {
      numHouses: app.arbiPro.numHouses,
      rounding: app.arbiPro.roundingValue,
      houses: app.arbiPro.houses.slice(0, app.arbiPro.numHouses)
    };
  }

  getFreeProData() {
    // Busca dados da calculadora FreePro via iframe
    try {
      const iframe = document.getElementById('calc2frame');
      if (!iframe?.contentDocument) {
        throw new Error('FreePro iframe não encontrado');
      }

      const doc = iframe.contentDocument;
      const $ = (id) => doc.getElementById(id);

      // Detecta modo atual
      const mode = doc.body.classList.contains('mode-cashback') ? 'cashback' : 'freebet';
      
      let data = {
        numEntradas: parseInt($('numEntradas')?.value || '3'),
        roundStep: parseFloat($('round_step')?.value || '1.00'),
        mode: mode
      };

      if (mode === 'freebet') {
        data.promoOdd = $('o1')?.value || '';
        data.promoComm = $('c1')?.value || '';
        data.promoStake = $('s1')?.value || '';
        data.freebetValue = $('F')?.value || '';
        data.extractionRate = $('r')?.value || '';
      } else {
        data.promoOdd = $('cashback_odd')?.value || '';
        data.promoStake = $('cashback_stake')?.value || '';
        data.cashbackRate = $('cashback_rate')?.value || '';
      }

      // Coleta dados das coberturas
      data.coverages = [];
      const coverageCards = doc.querySelectorAll('#oddsContainer > div');
      coverageCards.forEach(card => {
        const odd = card.querySelector('input[data-type="odd"]')?.value || '';
        const comm = card.querySelector('input[data-type="comm"]')?.value || '';
        const lay = card.querySelector('input[data-type="lay"]')?.checked || false;
        
        data.coverages.push({ odd, comm, lay });
      });

      return data;
    } catch (error) {
      console.error('Erro ao obter dados FreePro:', error);
      throw new Error('Não foi possível obter dados do FreePro');
    }
  }

  async showModal(url) {
    if (!this.modal) return;

    const input = this.modal.querySelector('#shareUrlInput');
    if (input) {
      input.value = url;
    }

    this.modal.style.display = 'block';
    
    // Auto-seleciona o texto
    setTimeout(() => {
      input?.select();
    }, 100);
  }

  hideModal() {
    if (this.modal) {
      this.modal.style.display = 'none';
    }
  }

  async copyShareUrl() {
    const input = this.modal?.querySelector('#shareUrlInput');
    const copyBtn = this.modal?.querySelector('#copyShareBtn');
    
    if (!input?.value || !copyBtn) return;

    try {
      const success = await this.shareSystem.copyToClipboard(input.value);
      
      if (success) {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copiado!';
        copyBtn.style.background = 'var(--success)';
        
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
        }, 2000);
      } else {
        throw new Error('Falha ao copiar');
      }
    } catch (error) {
      console.error('Erro ao copiar:', error);
      alert('Erro ao copiar para área de transferência');
    }
  }

  async shortenShareUrl() {
    const input = this.modal?.querySelector('#shareUrlInput');
    const shortenBtn = this.modal?.querySelector('#shortenUrlBtn');
    
    if (!input?.value || !shortenBtn) return;

    try {
      const originalText = shortenBtn.textContent;
      shortenBtn.textContent = 'Encurtando...';
      shortenBtn.disabled = true;

      const shortUrl = await this.shareSystem.shortenUrl(input.value);
      input.value = shortUrl;

      shortenBtn.textContent = '✅ Encurtado!';
      setTimeout(() => {
        shortenBtn.textContent = originalText;
        shortenBtn.disabled = false;
      }, 2000);

    } catch (error) {
      console.error('Erro ao encurtar URL:', error);
      shortenBtn.textContent = 'Erro';
      setTimeout(() => {
        shortenBtn.textContent = 'Encurtar URL';
        shortenBtn.disabled = false;
      }, 2000);
    }
  }

  shareWhatsApp() {
    const input = this.modal?.querySelector('#shareUrlInput');
    if (!input?.value) return;

    const message = encodeURIComponent(`Confira esta configuração das Calculadoras Shark Green: ${input.value}`);
    const whatsappUrl = `https://wa.me/?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
  }

  loadSharedConfig() {
    try {
      const config = this.shareSystem.loadFromUrl();
      if (!config) return;

      console.log('Carregando configuração compartilhada:', config);

      if (config.t === 'arbipro') {
        this.loadArbiProConfig(config);
      } else if (config.t === 'freepro') {
        this.loadFreeProConfig(config);
      }

      // Limpa URL
      this.shareSystem.cleanUrl();
      
    } catch (error) {
      console.error('Erro ao carregar configuração compartilhada:', error);
    }
  }

  loadArbiProConfig(config) {
    setTimeout(() => {
      try {
        const app = window.SharkGreen;
        if (!app?.arbiPro) {
          console.warn('ArbiPro não disponível ainda');
          return;
        }

        // Configura número de casas
        if (config.n) {
          const select = document.getElementById('numHouses');
          if (select) {
            select.value = config.n;
            app.arbiPro.numHouses = config.n;
          }
        }

        // Configura arredondamento
        if (config.r) {
          const roundingSelect = document.getElementById('rounding');
          if (roundingSelect) {
            roundingSelect.value = config.r;
            app.arbiPro.roundingValue = config.r;
          }
        }

        // Configura casas
        if (config.h && Array.isArray(config.h)) {
          config.h.forEach((house, index) => {
            if (index < app.arbiPro.houses.length) {
              app.arbiPro.houses[index] = {
                ...app.arbiPro.houses[index],
                odd: house.o || '',
                stake: house.s || '',
                commission: house.c,
                freebet: house.f || false,
                increase: house.i,
                lay: house.l || false,
                fixedStake: house.x || false
              };
            }
          });
        }

        // Re-renderiza e recalcula
        app.arbiPro.renderHouses();
        app.arbiPro.scheduleUpdate();

        console.log('Configuração ArbiPro carregada com sucesso');
        
      } catch (error) {
        console.error('Erro ao aplicar configuração ArbiPro:', error);
      }
    }, 1000);
  }

  loadFreeProConfig(config) {
    setTimeout(() => {
      try {
        const iframe = document.getElementById('calc2frame');
        if (!iframe?.contentDocument) {
          console.warn('FreePro iframe não disponível ainda');
          return;
        }

        const doc = iframe.contentDocument;
        const $ = (id) => doc.getElementById(id);

        // Configura modo
        if (config.m === 'cashback') {
          doc.body.classList.add('mode-cashback');
          $('modeCashbackBtn')?.classList.add('active');
          $('modeFreebetBtn')?.classList.remove('active');
        }

        // Configura número de entradas
        if (config.n && $('numEntradas')) {
          $('numEntradas').value = config.n;
          // Dispara evento change para re-renderizar
          $('numEntradas').dispatchEvent(new Event('change'));
        }

        // Configura arredondamento
        if (config.r && $('round_step')) {
          $('round_step').value = config.r;
        }

        // Configura dados da promoção
        if (config.p) {
          const p = config.p;
          
          if (config.m === 'cashback') {
            if ($('cashback_odd')) $('cashback_odd').value = p.o || '';
            if ($('cashback_stake')) $('cashback_stake').value = p.s || '';
            if ($('cashback_rate')) $('cashback_rate').value = p.cb || '';
          } else {
            if ($('o1')) $('o1').value = p.o || '';
            if ($('c1')) $('c1').value = p.c || '';
            if ($('s1')) $('s1').value = p.s || '';
            if ($('F')) $('F').value = p.f || '';
            if ($('r')) $('r').value = p.e || '';
          }
        }

        // Aguarda renderização das coberturas e depois configura
        setTimeout(() => {
          if (config.cov && Array.isArray(config.cov)) {
            const coverageCards = doc.querySelectorAll('#oddsContainer > div');
            config.cov.forEach((cov, index) => {
              if (index < coverageCards.length) {
                const card = coverageCards[index];
                const oddInput = card.querySelector('input[data-type="odd"]');
                const commInput = card.querySelector('input[data-type="comm"]');
                const layInput = card.querySelector('input[data-type="lay"]');
                
                if (oddInput) oddInput.value = cov.odd || '';
                if (commInput) commInput.value = cov.comm || '';
                if (layInput) layInput.checked = cov.lay || false;
              }
            });
          }

          // Dispara recálculo
          const autoCalcElements = doc.querySelectorAll('.auto-calc');
          if (autoCalcElements.length > 0) {
            autoCalcElements[0].dispatchEvent(new Event('input'));
          }
        }, 500);

        console.log('Configuração FreePro carregada com sucesso');
        
      } catch (error) {
        console.error('Erro ao aplicar configuração FreePro:', error);
      }
    }, 2000);
  }
}
