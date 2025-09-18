// assets/js/utils/share.js
// Sistema de compartilhamento com DEBUG e decodificação corrigida

export class ShareSystem {
  constructor() {
    this.baseUrl = window.location.origin + window.location.pathname;
    this.debugMode = true;
  }

  log(...args) {
    if (this.debugMode) {
      console.log('🔗[ShareSystem]', ...args);
    }
  }

  // Gera link compartilhável para ArbiPro
  generateArbiProLink(data) {
    const config = {
      t: 'arbipro', // tipo
      n: data.numHouses || 2, // número de casas
      r: data.rounding || 0.01, // arredondamento
      h: data.houses.slice(0, data.numHouses).map(house => ({
        o: house.odd || '', // odd
        s: house.stake || '', // stake
        c: house.commission, // comissão (null se não tem)
        f: house.freebet || false, // freebet
        i: house.increase, // aumento de odd (null se não tem)
        l: house.lay || false, // lay
        x: house.fixedStake || false // stake fixada
      }))
    };

    this.log('Configuração ArbiPro a ser codificada:', config);
    return this.createShareableLink(config);
  }

  // Gera link compartilhável para FreePro
  generateFreeProLink(data) {
    const config = {
      t: 'freepro', // tipo
      n: data.numEntradas || 3, // número de entradas
      r: data.roundStep || 1.00, // arredondamento
      mode: data.mode || 'freebet' // modo: freebet ou cashback
    };

    if (data.mode === 'cashback') {
      // Dados específicos do cashback
      config.cashbackOdd = data.cashbackOdd || '';
      config.cashbackStake = data.cashbackStake || '';
      config.cashbackRate = data.cashbackRate || '';
    } else {
      // Dados específicos do freebet (casa promoção)
      config.promoOdd = data.promoOdd || '';
      config.promoComm = data.promoComm || '';
      config.promoStake = data.promoStake || '';
      config.freebetValue = data.freebetValue || '';
      config.extractionRate = data.extractionRate || '';
    }

    // Coberturas (comum para ambos os modos)
    config.coverages = (data.coverages || []).map(cov => ({
      odd: cov.odd || '',
      commission: cov.commission || '',
      lay: cov.lay || false
    }));

    this.log('Configuração FreePro a ser codificada:', config);
    return this.createShareableLink(config);
  }

  // Cria link encurtado usando base64
  createShareableLink(config) {
    try {
      const jsonStr = JSON.stringify(config);
      this.log('JSON a ser codificado:', jsonStr);
      
      // Codificação segura para URL
      const base64 = btoa(unescape(encodeURIComponent(jsonStr)));
      this.log('Base64 gerado:', base64);
      
      const shortId = this.generateShortId(base64);
      
      // Salva no localStorage para recuperação
      const shareData = {
        id: shortId,
        config: config,
        created: Date.now(),
        expires: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 dias
      };
      
      this.saveShareData(shortId, shareData);
      
      const result = {
        fullUrl: `${this.baseUrl}?share=${base64}`,
        shortUrl: `${this.baseUrl}?s=${shortId}`,
        shareId: shortId
      };
      
      this.log('Links gerados:', result);
      
      // Teste imediato de decodificação
      this.testDecoding(base64, config);
      
      return result;
    } catch (error) {
      console.error('Erro ao criar link compartilhável:', error);
      return null;
    }
  }

  // Método para testar decodificação
  testDecoding(base64, originalConfig) {
    try {
      this.log('Testando decodificação...');
      const decoded = this.decodeConfig(base64);
      this.log('Original:', originalConfig);
      this.log('Decodificado:', decoded);
      
      if (JSON.stringify(originalConfig) === JSON.stringify(decoded)) {
        this.log('✅ Teste de codificação/decodificação passou!');
      } else {
        console.error('❌ Teste de codificação/decodificação falhou!');
      }
    } catch (error) {
      console.error('❌ Erro no teste de decodificação:', error);
    }
  }

  // Método público para decodificar configuração
  decodeConfig(base64) {
    try {
      const jsonStr = decodeURIComponent(escape(atob(base64)));
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error('Erro ao decodificar configuração:', error);
      return null;
    }
  }

  // Carrega configuração do URL
  loadFromUrl() {
    try {
      this.log('Verificando URL atual:', window.location.href);
      const urlParams = new URLSearchParams(window.location.search);
      
      // Link completo (base64)
      const shareParam = urlParams.get('share');
      if (shareParam) {
        this.log('Parâmetro share encontrado:', shareParam);
        const config = this.decodeConfig(shareParam);
        this.log('Configuração decodificada do URL completo:', config);
        return config;
      }
      
      // Link curto
      const shortParam = urlParams.get('s');
      if (shortParam) {
        this.log('Parâmetro s encontrado:', shortParam);
        const shareData = this.loadShareData(shortParam);
        if (shareData) {
          this.log('Configuração carregada do link curto:', shareData.config);
          return shareData.config;
        }
      }
      
      this.log('Nenhum parâmetro de compartilhamento encontrado');
      return null;
    } catch (error) {
      console.error('Erro ao carregar configuração do URL:', error);
      return null;
    }
  }

  // Gera ID curto para link encurtado
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

  // Hash simples para gerar ID
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash;
  }

  // Salva dados de compartilhamento
  saveShareData(shortId, data) {
    try {
      const key = `share_${shortId}`;
      localStorage.setItem(key, JSON.stringify(data));
      this.log('Dados salvos no localStorage com chave:', key);
      
      // Limpa dados antigos
      this.cleanupOldShares();
    } catch (error) {
      console.warn('Não foi possível salvar dados de compartilhamento:', error);
    }
  }

  // Limpa compartilhamentos expirados
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
            localStorage.removeItem(key); // Remove dados corrompidos
            removed++;
          }
        }
      });
      
      if (removed > 0) {
        this.log(`Limpeza: ${removed} compartilhamentos expirados removidos`);
      }
    } catch (error) {
      console.warn('Erro na limpeza automática:', error);
    }
  }

  // Carrega dados de compartilhamento
  loadShareData(shortId) {
    try {
      const key = `share_${shortId}`;
      const data = localStorage.getItem(key);
      
      if (!data) {
        this.log('Dados não encontrados para ID:', shortId);
        return null;
      }
      
      const shareData = JSON.parse(data);
      
      // Verifica se não expirou
      if (shareData.expires && shareData.expires < Date.now()) {
        localStorage.removeItem(key);
        this.log('Dados expirados removidos para ID:', shortId);
        return null;
      }
      
      this.log('Dados carregados para ID:', shortId);
      return shareData;
    } catch (error) {
      console.error('Erro ao carregar dados de compartilhamento:', error);
      return null;
    }
  }

  // Remove parâmetros de compartilhamento da URL
  cleanUrl() {
    try {
      const url = new URL(window.location);
      const hadParams = url.searchParams.has('share') || url.searchParams.has('s');
      
      url.searchParams.delete('share');
      url.searchParams.delete('s');
      
      if (hadParams) {
        // Atualiza URL sem recarregar a página
        window.history.replaceState({}, document.title, url.toString());
        this.log('URL limpa:', url.toString());
      }
    } catch (error) {
      console.warn('Não foi possível limpar URL:', error);
    }
  }

  // Copia link para área de transferência
  async copyToClipboard(url) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        return true;
      } else {
        // Fallback para navegadores mais antigos
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
      console.error('Erro ao copiar para área de transferência:', error);
      return false;
    }
  }

  // Valida se uma configuração é válida
  validateConfig(config) {
    if (!config || typeof config !== 'object') {
      this.log('Configuração inválida: não é um objeto');
      return false;
    }
    
    const validTypes = ['arbipro', 'freepro'];
    if (!validTypes.includes(config.t)) {
      this.log('Configuração inválida: tipo não reconhecido:', config.t);
      return false;
    }
    
    if (config.t === 'arbipro') {
      return this.validateArbiProConfig(config);
    } else if (config.t === 'freepro') {
      return this.validateFreeProConfig(config);
    }
    
    return false;
  }

  validateArbiProConfig(config) {
    const isValid = (
      typeof config.n === 'number' &&
      config.n >= 2 && config.n <= 6 &&
      Array.isArray(config.h) &&
      config.h.length <= config.n
    );
    
    if (!isValid) {
      this.log('Configuração ArbiPro inválida:', config);
    } else {
      this.log('Configuração ArbiPro válida');
    }
    
    return isValid;
  }

  validateFreeProConfig(config) {
    const isValid = (
      typeof config.n === 'number' &&
      config.n >= 2 && config.n <= 6 &&
      (config.mode === 'freebet' || config.mode === 'cashback')
    );
    
    if (!isValid) {
      this.log('Configuração FreePro inválida:', config);
    } else {
      this.log('Configuração FreePro válida');
    }
    
    return isValid;
  }

  // Método de teste para debug
  testEncodingDecoding() {
    this.log('=== TESTE DE CODIFICAÇÃO/DECODIFICAÇÃO ===');
    
    // Teste 1: ArbiPro
    const arbiTest = {
      t: 'arbipro',
      n: 2,
      r: 0.01,
      h: [
        { o: '3.50', s: '100', c: null, f: false, i: null, l: false, x: true },
        { o: '2.80', s: '125', c: 5, f: false, i: 10, l: true, x: false }
      ]
    };
    
    this.log('Teste ArbiPro original:', arbiTest);
    const arbiJson = JSON.stringify(arbiTest);
    const arbiB64 = btoa(unescape(encodeURIComponent(arbiJson)));
    const arbiDecoded = this.decodeConfig(arbiB64);
    this.log('Teste ArbiPro decodificado:', arbiDecoded);
    this.log('ArbiPro match:', JSON.stringify(arbiTest) === JSON.stringify(arbiDecoded));
    
    // Teste 2: FreePro Freebet
    const freeTest = {
      t: 'freepro',
      n: 3,
      r: 1.00,
      mode: 'freebet',
      promoOdd: '4.00',
      promoComm: '0',
      promoStake: '50',
      freebetValue: '25',
      extractionRate: '70',
      coverages: [
        { odd: '2.50', commission: '0', lay: false },
        { odd: '3.20', commission: '5', lay: true }
      ]
    };
    
    this.log('Teste FreePro original:', freeTest);
    const freeJson = JSON.stringify(freeTest);
    const freeB64 = btoa(unescape(encodeURIComponent(freeJson)));
    const freeDecoded = this.decodeConfig(freeB64);
    this.log('Teste FreePro decodificado:', freeDecoded);
    this.log('FreePro match:', JSON.stringify(freeTest) === JSON.stringify(freeDecoded));
    
    // Teste 3: FreePro Cashback
    const cashTest = {
      t: 'freepro',
      n: 2,
      r: 0.50,
      mode: 'cashback',
      cashbackOdd: '2.00',
      cashbackStake: '100',
      cashbackRate: '10',
      coverages: [
        { odd: '1.90', commission: '0', lay: false }
      ]
    };
    
    this.log('Teste Cashback original:', cashTest);
    const cashJson = JSON.stringify(cashTest);
    const cashB64 = btoa(unescape(encodeURIComponent(cashJson)));
    const cashDecoded = this.decodeConfig(cashB64);
    this.log('Teste Cashback decodificado:', cashDecoded);
    this.log('Cashback match:', JSON.stringify(cashTest) === JSON.stringify(cashDecoded));
    
    this.log('=== FIM DOS TESTES ===');
  }
}

// Export default também para flexibilidade
export default ShareSystem;
