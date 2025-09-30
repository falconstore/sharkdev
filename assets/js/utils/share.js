// assets/js/utils/share.js - VERSÃO FINAL TESTADA
export class ShareSystem {
  
  constructor() {
    this.baseUrl = window.location.origin + window.location.pathname;
  }

  // ========== ARBIPRO ==========
  generateArbiProLink(data) {
    console.log('📤 Gerando link ArbiPro com dados:', data);
    
    const config = {
      t: 'arbipro',
      n: data.numHouses || 2,
      r: data.rounding || 0.01,
      h: (data.houses || []).slice(0, data.numHouses).map(h => ({
        o: h.odd || '',
        s: h.stake || '',
        c: h.commission,
        f: h.freebet ? 1 : 0,
        i: h.increase,
        l: h.lay ? 1 : 0,
        x: h.fixedStake ? 1 : 0
      }))
    };
    
    const link = this._createLink(config);
    console.log('✅ Link gerado:', link);
    return link;
  }

  // ========== FREEPRO ==========
  generateFreeProLink(data) {
    console.log('📤 Gerando link FreePro com dados:', data);
    
    const config = {
      t: 'freepro',
      n: data.n || 3,
      r: data.r || 1.0,
      m: data.mode || 'freebet',
      p: data.p || {},
      cov: data.cov || []
    };
    
    const link = this._createLink(config);
    console.log('✅ Link gerado:', link);
    return link;
  }

  // ========== CRIAR LINK ==========
  _createLink(config) {
    const encoded = this._encode(config);
    return `${this.baseUrl}?s=${encoded}`;
  }

  // ========== ENCODE ==========
  _encode(obj) {
    try {
      const json = JSON.stringify(obj);
      console.log('📝 JSON:', json);
      
      const utf8 = unescape(encodeURIComponent(json));
      const b64 = btoa(utf8)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      
      console.log('🔐 Base64:', b64);
      return b64;
    } catch (e) {
      console.error('❌ Erro ao encodar:', e);
      return '';
    }
  }

  // ========== DECODE ==========
  _decode(str) {
    try {
      console.log('🔓 Decodificando:', str);
      
      const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
      const pad = '='.repeat((4 - b64.length % 4) % 4);
      const full = b64 + pad;
      
      const decoded = atob(full);
      const json = decodeURIComponent(escape(decoded));
      const obj = JSON.parse(json);
      
      console.log('✅ Decodificado:', obj);
      return obj;
    } catch (e) {
      console.error('❌ Erro ao decodar:', e);
      return null;
    }
  }

  // ========== LER DA URL ==========
  readFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('s') || params.get('share');
    
    if (!encoded) {
      console.log('ℹ️ Nenhuma configuração para carregar');
      return null;
    }
    
    console.log('📥 Configuração encontrada na URL');
    return this._decode(encoded);
  }

  // ========== LIMPAR URL ==========
  cleanUrl() {
    const url = new URL(window.location);
    url.searchParams.delete('s');
    url.searchParams.delete('share');
    window.history.replaceState({}, '', url.toString());
    console.log('🧹 URL limpa');
  }
}
