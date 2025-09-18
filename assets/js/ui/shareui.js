// assets/js/utils/share.js
// Sistema de compartilhamento de configurações - VERSÃO CORRIGIDA

export class ShareSystem {
  constructor() {
    this.baseUrl = window.location.origin + window.location.pathname;
  }

  // Gera link compartilhável para ArbiPro
  generateArbiProLink(data) {
    console.log('Gerando link ArbiPro com dados:', data);
    
    const config = {
      t: 'arbipro', // tipo
      n: data.numHouses || 2, // número de casas
      r: data.rounding || 0.01, // arredondamento
      h: data.houses || [] // casas com dados
    };

    return this.createShareableLink(config);
  }

  // Gera link compartilhável para FreePro
  generateFreeProLink(data) {
    console.log('Gerando link FreePro com dados:', data);
    
    const config = {
      t: 'freepro', // tipo
      n: data.n || 3, // número de entradas
      r: data.r || 1.00, // arredondamento
      mode: data.mode || 'freebet', // modo
      p: data.p || {}, // dados da promoção
      cov: data.cov || [] // coberturas
    };

    return this.createShareableLink(config);
  }

  // Cria link compartilhável
  createShareableLink(config) {
    try {
      // Converte para JSON
      const jsonStr = JSON.stringify(config);
      console.log('JSON original:', jsonStr);
      
      // Comprime para base64
      const base64 = btoa(encodeURIComponent(jsonStr));
      console.log('Base64 gerado:', base64);
      
      // Cria URL completa
      const fullUrl = `${this.baseUrl}?share=${base64}`;
      
      // Tenta criar URL encurtada (simplificada)
      const shortId = this.generateShortId();
      this.saveToLocalStorage(shortId, config);
      const shortUrl = `${this.baseUrl}?s=${shortId}`;
      
      console.log('URLs geradas:', { fullUrl, shortUrl });
      
      return {
        fullUrl: fullUrl,
        shortUrl: shortUrl,
        shareId: shortId,
        config: config
      };
      
    } catch (error) {
      console.error('Erro ao criar link compartilhável:', error);
      return null;
    }
  }

  // Gera ID curto único
  generateShortId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `${timestamp}-${random}`;
  }

  // Salva no localStorage
  saveToLocalStorage(id, config) {
    try {
      const key = `share_${id}`;
      const data = {
        config: config,
        created: Date.now(),
        expires: Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 dias
      };
      localStorage.setItem(key, JSON.stringify(data));
      console.log('Salvo no localStorage:', key, data);
    } catch (error) {
      console.warn('Erro ao salvar no localStorage:', error);
    }
  }

  // Carrega configuração da URL
  loadFromUrl() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      console.log('Parâmetros da URL:', urlParams.toString());
      
      // Tenta carregar do parâmetro 'share' (base64)
      const shareParam = urlParams.get('share');
      if (shareParam) {
        console.log('Parâmetro share encontrado:', shareParam);
        try {
          // Decodifica de base64
          const jsonStr = decodeURIComponent(atob(shareParam));
          console.log('JSON decodificado:', jsonStr);
          
          const config = JSON.parse(jsonStr);
          console.log('Configuração carregada:', config);
          
          if (this.validateConfig(config)) {
            return config;
          }
        } catch (e) {
          console.error('Erro ao decodificar share:', e);
        }
      }
      
      // Tenta carregar do parâmetro 's' (ID curto)
      const shortParam = urlParams.get('s');
      if (shortParam) {
        console.log('Parâmetro curto encontrado:', shortParam);
        const data = this.loadFromLocalStorage(shortParam);
        if (data && data.config) {
          console.log('Configuração carregada do localStorage:', data.config);
          return data.config;
        }
      }
      
      return null;
      
    } catch (error) {
      console.error('Erro ao carregar configuração da URL:', error);
      return null;
    }
  }

  // Carrega do localStorage
  loadFromLocalStorage(id) {
    try {
      const key = `share_${id}`;
      const data = localStorage.getItem(key);
      
      if (!data) {
        console.log('Dados não encontrados no localStorage para:', key);
        return null;
      }
      
      const parsed = JSON.parse(data);
      
      // Verifica expiração
      if (parsed.expires && parsed.expires < Date.now()) {
        console.log('Link expirado');
        localStorage.removeItem(key);
        return null;
      }
      
      return parsed;
      
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
      return null;
    }
  }

  // Valida configuração
  validateConfig(config) {
    if (!config || typeof config !== 'object') {
      console.error('Configuração inválida: não é um objeto');
      return false;
    }
    
    if (!config.t || !['arbipro', 'freepro'].includes(config.t)) {
      console.error('Tipo de configuração inválido:', config.t);
      return false;
    }
    
    if (config.t === 'arbipro') {
      return this.validateArbiProConfig(config);
    } else if (config.t === 'freepro') {
      return this.validateFreeProConfig(config);
    }
    
    return false;
  }

  // Valida configuração ArbiPro
  validateArbiProConfig(config) {
    const valid = (
      typeof config.n === 'number' &&
      config.n >= 2 && config.n <= 6 &&
      Array.isArray(config.h)
    );
    
    if (!valid) {
      console.error('Configuração ArbiPro inválida:', config);
    }
    
    return valid;
  }

  // Valida configuração FreePro
  validateFreeProConfig(config) {
    const valid = (
      typeof config.n === 'number' &&
      config.n >= 2 && config.n <= 6 &&
      config.p && typeof config.p === 'object'
    );
    
    if (!valid) {
      console.error('Configuração FreePro inválida:', config);
    }
    
    return valid;
  }

  // Remove parâmetros de compartilhamento da URL
  cleanUrl() {
    try {
      const url = new URL(window.location);
      url.searchParams.delete('share');
      url.searchParams.delete('s');
      
      // Atualiza URL sem recarregar
      window.history.replaceState({}, document.title, url.toString());
      console.log('URL limpa');
      
    } catch (error) {
      console.warn('Erro ao limpar URL:', error);
    }
  }

  // Copia para área de transferência
  async copyToClipboard(text) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = text;
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

  // Método de debug para testar encoding/decoding
  testEncodingDecoding(config) {
    console.group('Teste de Encoding/Decoding');
    
    // Encode
    const jsonStr = JSON.stringify(config);
    console.log('1. JSON original:', jsonStr);
    
    const encoded = btoa(encodeURIComponent(jsonStr));
    console.log('2. Base64 encoded:', encoded);
    
    // Decode
    const decoded = decodeURIComponent(atob(encoded));
    console.log('3. JSON decoded:', decoded);
    
    const parsed = JSON.parse(decoded);
    console.log('4. Objeto final:', parsed);
    
    console.groupEnd();
    
    return parsed;
  }
}
