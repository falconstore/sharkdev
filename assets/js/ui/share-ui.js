// assets/js/ui/share-ui.js
// Interface do usuário para compartilhamento

import { ShareSystem } from '../utils/share.js';

export class ShareUI {
  constructor() {
    this.shareSystem = new ShareSystem();
    this.modalElement = null;
    this.currentShareData = null;
  }

  // Cria modal de compartilhamento
  createShareModal() {
    if (this.modalElement) return this.modalElement;

    const modal = document.createElement('div');
    modal.id = 'shareModal';
    modal.className = 'share-modal hidden';
    modal.innerHTML = `
      <div class="share-modal-backdrop" aria-hidden="true"></div>
      <div class="share-modal-content" role="dialog" aria-labelledby="shareModalTitle" aria-modal="true">
        <div class="share-modal-header">
          <h3 id="shareModalTitle" class="share-modal-title">
            🔗 Compartilhar Configuração
          </h3>
          <button class="share-modal-close" aria-label="Fechar modal">&times;</button>
        </div>
        
        <div class="share-modal-body">
          <div class="share-option">
            <div class="share-option-header">
              <span class="share-option-icon">🌐</span>
              <div>
                <div class="share-option-title">Link Completo</div>
                <div class="share-option-desc">URL com todas as configurações (pode ser longo)</div>
              </div>
            </div>
            <div class="share-url-container">
              <input type="text" id="fullShareUrl" class="share-url-input" readonly>
              <button class="btn btn-copy" data-action="copy-full">
                📋 Copiar
              </button>
            </div>
          </div>

          <div class="share-option">
            <div class="share-option-header">
              <span class="share-option-icon">⚡</span>
              <div>
                <div class="share-option-title">Link Encurtado</div>
                <div class="share-option-desc">URL curta e fácil de compartilhar</div>
              </div>
            </div>
            <div class="share-url-container">
              <input type="text" id="shortShareUrl" class="share-url-input" readonly>
              <button class="btn btn-copy" data-action="copy-short">
                📋 Copiar
              </button>
            </div>
          </div>

          <div class="share-option">
            <div class="share-option-header">
              <span class="share-option-icon">📱</span>
              <div>
                <div class="share-option-title">QR Code</div>
                <div class="share-option-desc">Para compartilhar via celular</div>
              </div>
            </div>
            <div class="share-qr-container">
              <img id="shareQRCode" alt="QR Code" class="share-qr-image">
              <button class="btn btn-secondary" data-action="download-qr">
                💾 Baixar QR
              </button>
            </div>
          </div>

          <div class="share-actions">
            <button class="btn btn-primary" data-action="share-whatsapp">
              📱 WhatsApp
            </button>
            <button class="btn btn-primary" data-action="share-telegram">
              ✈️ Telegram
            </button>
            <button class="btn btn-secondary" data-action="share-email">
              📧 E-mail
            </button>
          </div>
        </div>

        <div class="share-modal-footer">
          <div class="share-info">
            💡 Links ficam válidos por 30 dias
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modalElement = modal;
    this.bindModalEvents();
    
    return modal;
  }

  // Vincula eventos do modal
  bindModalEvents() {
    if (!this.modalElement) return;

    // Fechar modal
    this.modalElement.querySelector('.share-modal-close').addEventListener('click', () => {
      this.hideModal();
    });

    this.modalElement.querySelector('.share-modal-backdrop').addEventListener('click', () => {
      this.hideModal();
    });

    // Copiar URLs
    this.modalElement.querySelector('[data-action="copy-full"]').addEventListener('click', () => {
      this.copyUrl('full');
    });

    this.modalElement.querySelector('[data-action="copy-short"]').addEventListener('click', () => {
      this.copyUrl('short');
    });

    // Download QR
    this.modalElement.querySelector('[data-action="download-qr"]').addEventListener('click', () => {
      this.downloadQR();
    });

    // Compartilhamento social
    this.modalElement.querySelector('[data-action="share-whatsapp"]').addEventListener('click', () => {
      this.shareToSocial('whatsapp');
    });

    this.modalElement.querySelector('[data-action="share-telegram"]').addEventListener('click', () => {
      this.shareToSocial('telegram');
    });

    this.modalElement.querySelector('[data-action="share-email"]').addEventListener('click', () => {
      this.shareToSocial('email');
    });

    // ESC para fechar
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !this.modalElement.classList.contains('hidden')) {
        this.hideModal();
      }
    });
  }

  // Mostra modal com dados de compartilhamento
  showShareModal(shareData) {
    const modal = this.createShareModal();
    
    if (!shareData) {
      this.showError('Erro ao gerar link de compartilhamento');
      return;
    }

    // Preenche URLs
    modal.querySelector('#fullShareUrl').value = shareData.fullUrl;
    modal.querySelector('#shortShareUrl').value = shareData.shortUrl;
    
    // Gera QR Code
    const qrUrl = this.shareSystem.generateQRCodeUrl(shareData.shortUrl);
    modal.querySelector('#shareQRCode').src = qrUrl;
    
    // Armazena dados para uso posterior
    this.currentShareData = shareData;
    
    // Mostra modal
    modal.classList.remove('hidden');
    
    // Foca no primeiro input
    setTimeout(() => {
      modal.querySelector('#shortShareUrl').select();
    }, 100);
  }

  // Esconde modal
  hideModal() {
    if (this.modalElement) {
      this.modalElement.classList.add('hidden');
    }
  }

  // Copia URL para área de transferência
  async copyUrl(type) {
    const url = type === 'full' ? this.currentShareData?.fullUrl : this.currentShareData?.shortUrl;
    
    if (!url) {
      this.showError('URL não disponível');
      return;
    }

    const success = await this.shareSystem.copyToClipboard(url);
    
    if (success) {
      this.showSuccess(`Link ${type === 'full' ? 'completo' : 'encurtado'} copiado!`);
      
      // Feedback visual no botão
      const button = this.modalElement.querySelector(`[data-action="copy-${type}"]`);
      const originalText = button.textContent;
      button.textContent = '✅ Copiado!';
      button.style.background = 'var(--success)';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
      }, 2000);
    } else {
      this.showError('Não foi possível copiar. Use Ctrl+C manualmente.');
    }
  }

  // Download do QR Code
  async downloadQR() {
    try {
      const qrImage = this.modalElement.querySelector('#shareQRCode');
      const qrUrl = qrImage.src;
      
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'shark-green-qr-code.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      this.showSuccess('QR Code baixado!');
    } catch (error) {
      console.error('Erro ao baixar QR:', error);
      this.showError('Erro ao baixar QR Code');
    }
  }

  // Compartilhamento social
  shareToSocial(platform) {
    const url = this.currentShareData?.shortUrl;
    const text = 'Confira esta configuração da Calculadora Shark Green! 🦈💚';
    
    if (!url) {
      this.showError('URL não disponível');
      return;
    }

    let shareUrl;
    
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('Configuração Shark Green')}&body=${encodeURIComponent(text + '\n\n' + url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }

  // Cria botão de compartilhamento
  createShareButton(calculator) {
    const button = document.createElement('button');
    button.className = 'btn btn-share';
    button.innerHTML = '🔗 Compartilhar';
    button.setAttribute('data-calculator', calculator);
    
    button.addEventListener('click', () => {
      this.handleShareClick(calculator);
    });
    
    return button;
  }

  // Manipula clique no botão de compartilhar
  async handleShareClick(calculator) {
    try {
      let shareData;
      
      if (calculator === 'arbipro') {
        const arbiPro = window.SharkGreen?.getModules()?.arbiPro;
        if (!arbiPro) {
          this.showError('ArbiPro não disponível');
          return;
        }
        
        const config = this.extractArbiProConfig(arbiPro);
        shareData = this.shareSystem.generateArbiProLink(config);
      } else if (calculator === 'freepro') {
        const config = this.extractFreeProConfig();
        shareData = this.shareSystem.generateFreeProLink(config);
      }
      
      if (shareData) {
        this.showShareModal(shareData);
      } else {
        this.showError('Erro ao gerar link de compartilhamento');
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      this.showError('Erro ao preparar compartilhamento');
    }
  }

  // Extrai configuração do ArbiPro
  extractArbiProConfig(arbiPro) {
    return {
      numHouses: arbiPro.numHouses,
      rounding: arbiPro.roundingValue,
      houses: arbiPro.houses
    };
  }

  // Extrai configuração do FreePro
  extractFreeProConfig() {
    // Busca valores do iframe do FreePro
    const iframe = document.getElementById('calc2frame');
    if (!iframe || !iframe.contentDocument) {
      throw new Error('FreePro não carregado');
    }
    
    const doc = iframe.contentDocument;
    
    return {
      numEntradas: parseInt(doc.getElementById('numEntradas')?.value || '3'),
      roundStep: parseFloat(doc.getElementById('round_step')?.value || '1.00'),
      promoOdd: doc.getElementById('o1')?.value || '',
      promoComm: doc.getElementById('c1')?.value || '',
      promoStake: doc.getElementById('s1')?.value || '',
      freebetValue: doc.getElementById('F')?.value || '',
      extractionRate: doc.getElementById('r')?.value || '70',
      coverages: this.extractFreeProCoverages(doc)
    };
  }

  // Extrai coberturas do FreePro
  extractFreeProCoverages(doc) {
    const coverages = [];
    const oddInputs = doc.querySelectorAll('#oddsContainer input[data-type="odd"]');
    const commInputs = doc.querySelectorAll('#oddsContainer input[data-type="comm"]');
    const layInputs = doc.querySelectorAll('#oddsContainer input[data-type="lay"]');
    
    for (let i = 0; i < oddInputs.length; i++) {
      coverages.push({
        odd: oddInputs[i]?.value || '',
        comm: commInputs[i]?.value || '',
        lay: layInputs[i]?.checked || false
      });
    }
    
    return coverages;
  }

  // Aplica configuração compartilhada
  applySharedConfig(config) {
    if (!config || !this.shareSystem.validateConfig(config)) {
      this.showError('Configuração inválida');
      return false;
    }

    try {
      if (config.t === 'arbipro') {
        this.applyArbiProConfig(config);
      } else if (config.t === 'freepro') {
        this.applyFreeProConfig(config);
      }
      
      this.showSuccess('Configuração aplicada com sucesso! 🎉');
      
      // Limpa URL
      this.shareSystem.cleanUrl();
      
      return true;
    } catch (error) {
      console.error('Erro ao aplicar configuração:', error);
      this.showError('Erro ao aplicar configuração');
      return false;
    }
  }

  // Aplica configuração do ArbiPro
  applyArbiProConfig(config) {
    const arbiPro = window.SharkGreen?.getModules()?.arbiPro;
    if (!arbiPro) throw new Error('ArbiPro não disponível');

    // Configura número de casas
    const numHousesSelect = document.getElementById('numHouses');
    if (numHousesSelect) {
      numHousesSelect.value = config.n;
      arbiPro.numHouses = config.n;
    }

    // Configura arredondamento
    const roundingSelect = document.getElementById('rounding');
    if (roundingSelect) {
      roundingSelect.value = config.r;
      arbiPro.roundingValue = config.r;
    }

    // Configura casas
    config.h.forEach((house, idx) => {
      if (idx < arbiPro.houses.length) {
        arbiPro.houses[idx] = {
          ...arbiPro.houses[idx],
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

    // Atualiza interface
    arbiPro.renderHouses();
    arbiPro.scheduleUpdate();
  }

  // Aplica configuração do FreePro
  applyFreeProConfig(config) {
    const iframe = document.getElementById('calc2frame');
    if (!iframe || !iframe.contentDocument) {
      throw new Error('FreePro não carregado');
    }

    const doc = iframe.contentDocument;

    // Configura valores básicos
    if (doc.getElementById('numEntradas')) {
      doc.getElementById('numEntradas').value = config.n;
    }
    if (doc.getElementById('round_step')) {
      doc.getElementById('round_step').value = config.r;
    }

    // Configura casa promoção
    if (config.p) {
      if (doc.getElementById('o1')) doc.getElementById('o1').value = config.p.o || '';
      if (doc.getElementById('c1')) doc.getElementById('c1').value = config.p.c || '';
      if (doc.getElementById('s1')) doc.getElementById('s1').value = config.p.s || '';
      if (doc.getElementById('F')) doc.getElementById('F').value = config.p.f || '';
      if (doc.getElementById('r')) doc.getElementById('r').value = config.p.e || '70';
    }

    // Atualiza coberturas
    if (config.cov && Array.isArray(config.cov)) {
      // Dispara evento para recriar as coberturas
      const numEntradasEl = doc.getElementById('numEntradas');
      if (numEntradasEl) {
        numEntradasEl.dispatchEvent(new Event('change'));
      }

      // Aguarda um pouco para os campos serem criados
      setTimeout(() => {
        const oddInputs = doc.querySelectorAll('#oddsContainer input[data-type="odd"]');
        const commInputs = doc.querySelectorAll('#oddsContainer input[data-type="comm"]');
        const layInputs = doc.querySelectorAll('#oddsContainer input[data-type="lay"]');

        config.cov.forEach((coverage, idx) => {
          if (oddInputs[idx]) oddInputs[idx].value = coverage.odd || '';
          if (commInputs[idx]) commInputs[idx].value = coverage.comm || '';
          if (layInputs[idx]) layInputs[idx].checked = coverage.lay || false;
        });
      }, 100);
    }
  }

  // Mostra mensagem de sucesso
  showSuccess(message) {
    this.showToast(message, 'success');
  }

  // Mostra mensagem de erro
  showError(message) {
    this.showToast(message, 'error');
  }

  // Mostra toast de notificação
  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `share-toast share-toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animação de entrada
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    // Remove após 3 segundos
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  // Inicializa sistema de compartilhamento
  init() {
    // Verifica se há configuração para carregar
    const sharedConfig = this.shareSystem.loadFromUrl();
    if (sharedConfig) {
      // Aguarda carregamento das calculadoras
      setTimeout(() => {
        this.applySharedConfig(sharedConfig);
      }, 2000);
    }
  }
}
