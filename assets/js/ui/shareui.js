// assets/js/ui/shareui.js - VERSÃO LIMPA E CORRIGIDA
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

      // Coleta dados da calculadora
      if (calculatorType === 'arbipro') {
        console.log('Coletando dados do ArbiPro...');
        shareData = this.getArbiProData();
        console.log('Dados coletados:', shareData);
        
        shareUrl = this.shareSystem.generateArbiProLink(shareData);
        console.log('URL gerada:', shareUrl);
        console.log('Tipo da URL:', typeof shareUrl);
      } else if (calculatorType === 'freepro') {
        console.log('Coletando dados do FreePro...');
        shareData = this.getFreeProData();
        console.log('Dados coletados:', shareData);
        
        shareUrl = this.shareSystem.generateFreeProLink(shareData);
        console.log('URL gerada:', shareUrl);
        console.log('Tipo da URL:', typeof shareUrl);
      } else {
        throw new Error('Tipo de calculadora inválido: ' + calculatorType);
      }

      // Verifica se o link foi gerado corretamente
      if (!shareUrl) {
        throw new Error('generateLink retornou null ou undefined');
      }
      
      if (typeof shareUrl !== 'string') {
        console.error('Objeto retornado:', shareUrl);
        console.error('Construtor:', shareUrl.constructor.name);
        
        // Se for URLSearchParams, converte para string
        if (shareUrl && typeof shareUrl.toString === 'function') {
          const urlString = shareUrl.toString();
          shareUrl = `${this.shareSystem.baseUrl}?${urlString}`;
          console.log('URL convertida:', shareUrl);
        } else {
          throw new Error('generateLink retornou um tipo inválido: ' + typeof shareUrl);
        }
      }
      
      if (shareUrl.trim() === '') {
        throw new Error('generateLink retornou uma string vazia');
      }

      console.log('Link final válido:', shareUrl);
      await this.showModal(shareUrl);
      
    } catch (error) {
      console.error('Erro detalhado ao compartilhar:', error);
      console.error('Stack trace:', error.stack);
      
      // Mostra erro mais detalhado para debug
      const errorMsg = `Erro ao gerar link: ${error.message}\n\nDetalhes técnicos:\n- Calculadora: ${calculatorType}\n- Erro: ${error.name}`;
      alert(errorMsg);
    }
  }

  getArbiProData() {
    // Busca dados da calculadora ArbiPro
    console.log('=== DEBUG: Coletando dados do ArbiPro ===');
    
    const app = window.SharkGreen;
    console.log('window.SharkGreen:', app);
    
    if (!app) {
      throw new Error('window.SharkGreen não encontrado');
    }
    
    console.log('app.arbiPro:', app.arbiPro);
    
    if (!app.arbiPro) {
      throw new Error('app.arbiPro não encontrado');
    }

    const arbiPro = app.arbiPro;
    console.log('ArbiPro instance:', arbiPro);
    console.log('numHouses:', arbiPro.numHouses);
    console.log('roundingValue:', arbiPro.roundingValue);
    console.log('houses array:', arbiPro.houses);

    const data = {
      numHouses: arbiPro.numHouses || 2,
      rounding: arbiPro.roundingValue || 0.01,
      houses: arbiPro.houses ? arbiPro.houses.slice(0, arbiPro.numHouses || 2) : []
    };

    console.log('Dados finais coletados:', data);
    return data;
  }

  // Método de debug - pode ser chamado do console
  debugShareSystem() {
    console.log('=== DEBUG SHARE SYSTEM ===');
    
    try {
      console.log('1. Verificando window.SharkGreen...');
      const app = window.SharkGreen;
      console.log('window.SharkGreen:', app);
      
      if (!app) {
        console.error('❌ window.SharkGreen não encontrado');
        return false;
      }
      
      console.log('2. Verificando ArbiPro...');
      console.log('app.arbiPro:', app.arbiPro);
      
      if (!app.arbiPro) {
        console.error('❌ app.arbiPro não encontrado');
        return false;
      }
      
      console.log('3. Verificando ShareUI...');
      console.log('app.shareUI:', app.shareUI);
      
      if (!app.shareUI) {
        console.error('❌ app.shareUI não encontrado');
        return false;
      }
      
      console.log('4. Testando coleta de dados...');
      const data = this.getArbiProData();
      console.log('Dados coletados:', data);
      
      console.log('5. Testando geração de link...');
      const link = app.shareUI.shareSystem.generateArbiProLink(data);
      console.log('Link gerado:', link);
      console.log('Tipo do link:', typeof link);
      
      // Teste direto do toString
      console.log('6. Testando URLSearchParams diretamente...');
      const params = new URLSearchParams();
      params.set('test', 'value');
      console.log('Params toString():', params.toString());
      console.log('Tipo:', typeof params.toString());
      
      console.log('✅ Sistema funcionando corretamente!');
      return true;
      
    } catch (error) {
      console.error('❌ Erro no debug:', error);
      return false;
    }
  }

  // Teste rápido do sistema
  testShareUrl() {
    try {
      const data = this.getArbiProData();
      const url = this.shareSystem.generateArbiProLink(data);
      
      console.log('=== TESTE RÁPIDO ===');
      console.log('Data:', data);
      console.log('URL:', url);
      console.log('Tipo:', typeof url);
      console.log('É string?', typeof url === 'string');
      
      return url;
    } catch (error) {
      console.error('Erro no teste:', error);
      return null;
    }
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
      // Garante que é uma string válida
      input.value = typeof url === 'string' ? url : '';
    }

    this.modal.style.display = 'block';
    
    // Auto-seleciona o texto
    setTimeout(() => {
      if (input && input.value) {
        input.focus();
        input.select();
      }
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

        console.log('Carregando configuração ArbiPro:', config);

        // Configura número de casas
        if (config.n) {
          const select = document.getElementById('numHouses');
          if (select) {
            select.value = config.n;
            select.dispatchEvent(new Event('change'));
            app.arbiPro.numHouses = config.n;
          }
        }

        // Configura arredondamento
        if (config.r) {
          const roundingSelect = document.getElementById('rounding');
          if (roundingSelect) {
            roundingSelect.value = config.r;
            roundingSelect.dispatchEvent(new Event('change'));
            app.arbiPro.roundingValue = config.r;
          }
        }

        // Aguarda re-renderização das casas
        setTimeout(() => {
          // Configura dados das casas
          if (config.houses && Array.isArray(config.houses)) {
            config.houses.forEach((house, index) => {
              if (index < app.arbiPro.houses.length) {
                
                // Preenche campos básicos
                const oddInput = document.getElementById(`odd-${index}`);
                const stakeInput = document.getElementById(`stake-${index}`);
                
                if (oddInput && house.odd) {
                  oddInput.value = house.odd;
                  oddInput.dispatchEvent(new Event('input'));
                }
                
                if (stakeInput && house.stake) {
                  stakeInput.value = house.stake;
                  stakeInput.dispatchEvent(new Event('input'));
                }

                // Configura checkboxes
                const commissionCheck = document.querySelector(`input[data-action="toggleCommission"][data-idx="${index}"]`);
                const freebetCheck = document.querySelector(`input[data-action="toggleFreebet"][data-idx="${index}"]`);
                const increaseCheck = document.querySelector(`input[data-action="toggleIncrease"][data-idx="${index}"]`);

                if (commissionCheck && (house.commission !== null && house.commission !== undefined)) {
                  commissionCheck.checked = true;
                  commissionCheck.dispatchEvent(new Event('change'));
                  
                  setTimeout(() => {
                    const commInput = document.getElementById(`commission-${index}`);
                    if (commInput) {
                      commInput.value = house.commission;
                      commInput.dispatchEvent(new Event('input'));
                    }
                  }, 100);
                }

                if (freebetCheck && house.freebet) {
                  freebetCheck.checked = true;
                  freebetCheck.dispatchEvent(new Event('change'));
                }

                if (increaseCheck && (house.increase !== null && house.increase !== undefined)) {
                  increaseCheck.checked = true;
                  increaseCheck.dispatchEvent(new Event('change'));
                  
                  setTimeout(() => {
                    const increaseInput = document.getElementById(`increase-${index}`);
                    if (increaseInput) {
                      increaseInput.value = house.increase;
                      increaseInput.dispatchEvent(new Event('input'));
                    }
                  }, 100);
                }

                // Configura lay
                if (house.lay) {
                  const layBtn = document.querySelector(`button[data-action="toggleLay"][data-idx="${index}"]`);
                  if (layBtn) {
                    layBtn.click();
                  }
                }

                // Configura stake fixada
                if (house.fixedStake) {
                  const fixBtn = document.querySelector(`button[data-action="fixStake"][data-idx="${index}"]`);
                  if (fixBtn) {
                    fixBtn.click();
                  }
                }
              }
            });
          }

          // Força recálculo
          app.arbiPro.scheduleUpdate();
        }, 300);

        console.log('Configuração ArbiPro carregada com sucesso');
        
      } catch (error) {
        console.error('Erro ao aplicar configuração ArbiPro:', error);
      }
    }, 1500);
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

        console.log('Carregando configuração FreePro:', config);

        // Configura modo
        if (config.mode === 'cashback') {
          doc.body.classList.add('mode-cashback');
          const cashbackBtn = $('modeCashbackBtn');
          const freebetBtn = $('modeFreebetBtn');
          if (cashbackBtn) cashbackBtn.classList.add('active');
          if (freebetBtn) freebetBtn.classList.remove('active');
        }

        // Configura número de entradas
        if (config.n && $('numEntradas')) {
          $('numEntradas').value = config.n;
          $('numEntradas').dispatchEvent(new Event('change'));
        }

        // Configura arredondamento
        if (config.r && $('round_step')) {
          $('round_step').value = config.r;
          $('round_step').dispatchEvent(new Event('change'));
        }

        // Configura dados da promoção
        if (config.mode === 'cashback') {
          if (config.promoOdd && $('cashback_odd')) {
            $('cashback_odd').value = config.promoOdd;
            $('cashback_odd').dispatchEvent(new Event('input'));
          }
          if (config.promoStake && $('cashback_stake')) {
            $('cashback_stake').value = config.promoStake;
            $('cashback_stake').dispatchEvent(new Event('input'));
          }
          if (config.cashbackRate && $('cashback_rate')) {
            $('cashback_rate').value = config.cashbackRate;
            $('cashback_rate').dispatchEvent(new Event('input'));
          }
        } else {
          if (config.promoOdd && $('o1')) {
            $('o1').value = config.promoOdd;
            $('o1').dispatchEvent(new Event('input'));
          }
          if (config.promoComm && $('c1')) {
            $('c1').value = config.promoComm;
            $('c1').dispatchEvent(new Event('input'));
          }
          if (config.promoStake && $('s1')) {
            $('s1').value = config.promoStake;
            $('s1').dispatchEvent(new Event('input'));
          }
          if (config.freebetValue && $('F')) {
            $('F').value = config.freebetValue;
            $('F').dispatchEvent(new Event('input'));
          }
          if (config.extractionRate && $('r')) {
            $('r').value = config.extractionRate;
            $('r').dispatchEvent(new Event('input'));
          }
        }

        // Aguarda renderização das coberturas e depois configura
        setTimeout(() => {
          if (config.coverages && Array.isArray(config.coverages)) {
            const coverageCards = doc.querySelectorAll('#oddsContainer > div');
            config.coverages.forEach((cov, index) => {
              if (index < coverageCards.length) {
                const card = coverageCards[index];
                const oddInput = card.querySelector('input[data-type="odd"]');
                const commInput = card.querySelector('input[data-type="comm"]');
                const layInput = card.querySelector('input[data-type="lay"]');
                
                if (oddInput && cov.odd) {
                  oddInput.value = cov.odd;
                  oddInput.dispatchEvent(new Event('input'));
                }
                if (commInput && cov.comm) {
                  commInput.value = cov.comm;
                  commInput.dispatchEvent(new Event('input'));
                }
                if (layInput && cov.lay) {
                  layInput.checked = true;
                  layInput.dispatchEvent(new Event('change'));
                }
              }
            });
          }

          // Dispara recálculo final
          setTimeout(() => {
            const autoCalcElements = doc.querySelectorAll('.auto-calc');
            if (autoCalcElements.length > 0) {
              autoCalcElements[0].dispatchEvent(new Event('input'));
            }
          }, 200);
        }, 500);

        console.log('Configuração FreePro carregada com sucesso');
        
      } catch (error) {
        console.error('Erro ao aplicar configuração FreePro:', error);
      }
    }, 2500);
  }
}
