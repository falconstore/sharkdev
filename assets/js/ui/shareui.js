// assets/js/utils/share.js
// Sistema de compartilhamento OTIMIZADO - Sem Firebase

export class ShareSystem {
  constructor() {
    this.baseUrl = window.location.origin + window.location.pathname;
    this.compression = true; // Habilita compressão de dados
  }

  // ===== COMPRESSÃO DE DADOS =====
  compressData(data) {
    if (!this.compression) return data;
    
    // Remove campos vazios/nulos para economia de espaço
    const clean = (obj) => {
      if (Array.isArray(obj)) {
        return obj.map(clean).filter(item => 
          item !== null && item !== undefined && item !== ''
        );
      }
      
      if (obj && typeof obj === 'object') {
        const cleaned = {};
        Object.keys(obj).forEach(key => {
          const value = clean(obj[key]);
          if (value !== null && value !== undefined && value !== '') {
            cleaned[key] = value;
          }
        });
        return Object.keys(cleaned).length > 0 ? cleaned : null;
      }
      
      return obj;
    };
    
    return clean(data);
  }

  // ===== LINKS MAIS INTELIGENTES =====
  createShareableLink(config) {
    try {
      // 1. Comprime dados
      const compressed = this.compressData(config);
      console.log('Dados originais:', JSON.stringify(config).length, 'chars');
      console.log('Dados comprimidos:', JSON.stringify(compressed).length, 'chars');
      
      // 2. Gera URLs
      const jsonStr = JSON.stringify(compressed);
      const base64 = btoa(encodeURIComponent(jsonStr));
      
      // 3. Decide estratégia baseado no tamanho
      const fullUrl = `${this.baseUrl}?share=${base64}`;
      
      if (fullUrl.length > 2000) {
        // URL muito longa - força uso de localStorage
        const shortId = this.generateShortId(base64);
        const shareData = {
          id: shortId,
          config: compressed,
          created: Date.now(),
          expires: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 dias
          hits: 0,
          maxHits: 50 // Limite de acessos
        };
        
        this.saveShareData(shortId, shareData);
        
        return {
          fullUrl: fullUrl,
          shortUrl: `${this.baseUrl}?s=${shortId}`,
          shareId: shortId,
          recommendation: 'short' // Recomenda usar link curto
        };
      } else {
        // URL OK - pode usar ambos
        const shortId = this.generateShortId(base64);
        this.saveShareData(shortId, {
          id: shortId,
          config: compressed,
          created: Date.now(),
          expires: Date.now() + (7 * 24 * 60 * 60 * 1000),
          hits: 0,
          maxHits: 50
        });
        
        return {
          fullUrl: fullUrl,
          shortUrl: `${this.baseUrl}?s=${shortId}`,
          shareId: shortId,
          recommendation: 'both' // Ambos funcionam bem
        };
      }
    } catch (error) {
      console.error('Erro ao criar link:', error);
      return null;
    }
  }

  // ===== FALLBACK INTELIGENTE =====
  loadFromUrl() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      
      // 1. Tenta link completo primeiro (mais confiável)
      const shareParam = urlParams.get('share');
      if (shareParam) {
        try {
          const jsonStr = decodeURIComponent(atob(shareParam));
          const config = JSON.parse(jsonStr);
          console.log('✅ Configuração carregada via URL completa');
          return this.validateAndExpand(config);
        } catch (e) {
          console.warn('⚠️ URL completa corrompida, tentando link curto...');
        }
      }
      
      // 2. Fallback para link curto
      const shortParam = urlParams.get('s');
      if (shortParam) {
        const shareData = this.loadShareData(shortParam);
        if (shareData) {
          console.log('✅ Configuração carregada via link curto');
          this.incrementHitCount(shortParam);
          return this.validateAndExpand(shareData.config);
        } else {
          console.warn('❌ Link curto expirado ou não encontrado');
          this.showLinkExpiredMessage();
        }
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
      return null;
    }
  }

  // ===== VALIDAÇÃO E EXPANSÃO =====
  validateAndExpand(config) {
    if (!this.validateConfig(config)) {
      console.error('Configuração inválida');
      return null;
    }
    
    // Expande dados comprimidos com valores padrão
    if (config.t === 'arbipro') {
      return {
        ...config,
        h: (config.h || []).map(house => ({
          o: house.o || '',
          s: house.s || '',
          c: house.c !== undefined ? house.c : null,
          f: house.f || false,
          i: house.i !== undefined ? house.i : null,
          l: house.l || false,
          x: house.x || false
        }))
      };
    }
    
    if (config.t === 'freepro') {
      return {
        ...config,
        coverages: (config.coverages || []).map(cov => ({
          odd: cov.odd || '',
          commission: cov.commission || '',
          lay: cov.lay || false
        }))
      };
    }
    
    return config;
  }

  // ===== CONTROLE DE HITS =====
  incrementHitCount(shortId) {
    try {
      const key = `share_${shortId}`;
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      
      if (data.config) {
        data.hits = (data.hits || 0) + 1;
        
        if (data.hits >= (data.maxHits || 50)) {
          console.log('Link atingiu limite de acessos, removendo...');
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(data));
        }
      }
    } catch (e) {
      console.warn('Erro ao incrementar hits:', e);
    }
  }

  // ===== GESTÃO DE STORAGE =====
  saveShareData(shortId, data) {
    try {
      const key = `share_${shortId}`;
      localStorage.setItem(key, JSON.stringify(data));
      
      // Limpeza automática
      this.cleanupOldShares();
      
      // Verifica limite de espaço
      this.checkStorageLimit();
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('localStorage cheio, limpando dados antigos...');
        this.aggressiveCleanup();
        try {
          localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
          console.error('Impossível salvar, storage totalmente cheio');
        }
      } else {
        console.warn('Erro ao salvar:', error);
      }
    }
  }

  checkStorageLimit() {
    try {
      const used = new Blob(Object.values(localStorage)).size;
      const limit = 5 * 1024 * 1024; // ~5MB
      
      if (used > limit * 0.8) {
        console.warn('localStorage quase cheio, limpando...');
        this.cleanupOldShares();
      }
    } catch (e) {
      // Fallback se não conseguir calcular tamanho
      if (Object.keys(localStorage).length > 100) {
        this.cleanupOldShares();
      }
    }
  }

  aggressiveCleanup() {
    try {
      const keys = Object.keys(localStorage);
      const shareKeys = keys.filter(k => k.startsWith('share_'));
      
      // Remove 50% dos mais antigos
      const toRemove = shareKeys.slice(0, Math.ceil(shareKeys.length / 2));
      toRemove.forEach(key => localStorage.removeItem(key));
      
      console.log(`Removidos ${toRemove.length} links antigos`);
    } catch (e) {
      console.error('Erro na limpeza agressiva:', e);
    }
  }

  // ===== MELHOR UX =====
  showLinkExpiredMessage() {
    // Mostra mensagem amigável em vez de erro técnico
    const message = `
      🔗 Este link compartilhado expirou ou não foi encontrado.
      
      Links de compartilhamento são válidos por 7 dias e até 50 acessos.
      Peça para a pessoa gerar um novo link.
    `;
    
    if (window.showNotification) {
      window.showNotification(message, 'warning');
    } else {
      alert(message);
    }
  }

  // ===== ANALYTICS SIMPLES =====
  getShareStats() {
    try {
      const keys = Object.keys(localStorage);
      const shareKeys = keys.filter(k => k.startsWith('share_'));
      
      let totalShares = 0;
      let totalHits = 0;
      let activeShares = 0;
      
      shareKeys.forEach(key => {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          if (data.config) {
            totalShares++;
            totalHits += (data.hits || 0);
            if (data.expires > Date.now()) {
              activeShares++;
            }
          }
        } catch (e) {
          localStorage.removeItem(key); // Remove corrompidos
        }
      });
      
      return {
        totalShares,
        totalHits,
        activeShares,
        storageUsed: new Blob(Object.values(localStorage)).size
      };
    } catch (e) {
      return { error: 'Não foi possível calcular estatísticas' };
    }
  }

  // Resto dos métodos permanecem iguais...
  generateShortId(base64) {
    const hash = this.simpleHash(base64);
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    let num = Math.abs(hash);
    
    for (let i = 0; i < 8; i++) {
      result += chars[num % chars.length];
      num = Math.floor(num / chars.length);
    }
    
    return result;
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  cleanupOldShares() {
    try {
      const now = Date.now();
      const keys = Object.keys(localStorage);
      let removed = 0;
      
      keys.forEach(key => {
        if (key.startsWith('share_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key));
            if (data.expires && data.expires < now) {
              localStorage.removeItem(key);
              removed++;
            }
          } catch (e) {
            localStorage.removeItem(key);
            removed++;
          }
        }
      });
      
      if (removed > 0) {
        console.log(`Limpeza automática: ${removed} links expirados removidos`);
      }
    } catch (error) {
      console.warn('Erro na limpeza automática:', error);
    }
  }

  loadShareData(shortId) {
    try {
      const key = `share_${shortId}`;
      const data = localStorage.getItem(key);
      
      if (!data) return null;
      
      const shareData = JSON.parse(data);
      
      if (shareData.expires && shareData.expires < Date.now()) {
        localStorage.removeItem(key);
        return null;
      }
      
      if (shareData.hits >= (shareData.maxHits || 50)) {
        localStorage.removeItem(key);
        return null;
      }
      
      return shareData;
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      return null;
    }
  }

  cleanUrl() {
    try {
      const url = new URL(window.location);
      url.searchParams.delete('share');
      url.searchParams.delete('s');
      window.history.replaceState({}, document.title, url.toString());
    } catch (error) {
      console.warn('Não foi possível limpar URL:', error);
    }
  }

  async copyToClipboard(url) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        return true;
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
      }
    } catch (error) {
      console.error('Erro ao copiar:', error);
      return false;
    }
  }

  validateConfig(config) {
    if (!config || typeof config !== 'object') return false;
    
    const validTypes = ['arbipro', 'freepro'];
    if (!validTypes.includes(config.t)) return false;
    
    if (config.t === 'arbipro') {
      return typeof config.n === 'number' && config.n >= 2 && config.n <= 6;
    }
    
    if (config.t === 'freepro') {
      return typeof config.n === 'number' && 
             config.n >= 2 && config.n <= 6 &&
             ['freebet', 'cashback'].includes(config.mode);
    }
    
    return false;
  }

  // Métodos de geração de links específicos permanecem iguais
  generateArbiProLink(data) {
    const config = {
      t: 'arbipro',
      n: data.numHouses || 2,
      r: data.rounding || 0.01,
      h: data.houses.slice(0, data.numHouses).map(house => ({
        o: house.odd || '',
        s: house.stake || '',
        c: house.commission,
        f: house.freebet || false,
        i: house.increase,
        l: house.lay || false,
        x: house.fixedStake || false
      }))
    };

    return this.createShareableLink(config);
  }

  generateFreeProLink(data) {
    const config = {
      t: 'freepro',
      n: data.numEntradas || 3,
      r: data.roundStep || 1.00,
      mode: data.mode || 'freebet'
    };

    if (data.mode === 'cashback') {
      config.cashbackOdd = data.cashbackOdd || '';
      config.cashbackStake = data.cashbackStake || '';
      config.cashbackRate = data.cashbackRate || '';
    } else {
      config.promoOdd = data.promoOdd || '';
      config.promoComm = data.promoComm || '';
      config.promoStake = data.promoStake || '';
      config.freebetValue = data.freebetValue || '';
      config.extractionRate = data.extractionRate || '';
    }

    config.coverages = (data.coverages || []).map(cov => ({
      odd: cov.odd || '',
      commission: cov.commission || '',
      lay: cov.lay || false
    }));

    return this.createShareableLink(config);
  }
}

export default ShareSystem;
