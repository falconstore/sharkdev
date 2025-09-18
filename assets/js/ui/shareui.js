/* shareui.js
 * Compartilhamento de estado via URL (Base64 URL-safe) com carregamento automático.
 * - Suporta ES Modules (export) e uso global (window.ShareUI)
 * - Não depende de localStorage para compartilhar entre navegadores/dispositivos.
 */

(function (factory) {
  // UMD leve: ES Module ou global
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    const exported = factory();
    // Disponibiliza no escopo global
    if (typeof window !== 'undefined') {
      window.ShareUI = exported.ShareUI;
    }
    // Suporte a ES Module via export (quando importado como módulo)
    if (typeof exported === 'object') {
      try { exported.__esModule = true; } catch(_) {}
    }
  }
}(function () {

  class ShareUI {
    /**
     * @param {Object} options
     * @param {string} [options.paramName='share'] - nome do query param
     * @param {number} [options.maxUrlLength=1900] - limite de aviso de tamanho de URL
     * @param {number} [options.defaultTTL=1000*60*60*24*7] - TTL padrão do link (ms)
     * @param {boolean} [options.cleanUrlAfterLoad=true] - remove ?share= da barra ao aplicar
     * @param {(data: any) => void} [options.onLoad] - callback para aplicar o payload na UI
     */
    constructor(options = {}) {
      this.paramName = options.paramName || 'share';
      this.maxUrlLength = options.maxUrlLength || 1900;
      this.defaultTTL = options.defaultTTL || (1000 * 60 * 60 * 24 * 7); // 7 dias
      this.cleanUrlAfterLoad = options.cleanUrlAfterLoad !== false; // default true
      this.onLoad = typeof options.onLoad === 'function' ? options.onLoad : null;

      // base URL sem query
      this.baseUrl = this._computeBaseUrl();
    }

    /* ============ Helpers base URL ============ */
    _computeBaseUrl() {
      try {
        // Preserva hash (para SPAs com roteamento)
        const { origin, pathname, hash } = window.location;
        return origin + pathname + (hash || '');
      } catch {
        return '';
      }
    }

    /* ============ Helpers b64/url-safe e UTF-8 ============ */
    _utf8ToB64(str) {
      // encodeURIComponent -> bytes -> btoa
      const utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        (_, p1) => String.fromCharCode(parseInt(p1, 16)));
      return btoa(utf8Bytes);
    }

    _b64ToUtf8(b64) {
      const binary = atob(b64);
      const percentEncoded = Array.prototype.map.call(binary, (c) =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('');
      return decodeURIComponent(percentEncoded);
    }

    _b64ToUrlSafe(b64) {
      return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    _urlSafeToB64(urlSafe) {
      let b64 = urlSafe.replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      return b64;
    }

    _encodePayload(obj) {
      const json = JSON.stringify(obj);
      const b64 = this._utf8ToB64(json);
      return this._b64ToUrlSafe(b64);
    }

    _decodePayload(token) {
      try {
        const b64 = this._urlSafeToB64(token);
        const json = this._b64ToUtf8(b64);
        return JSON.parse(json);
      } catch (err) {
        console.warn('[ShareUI] Erro ao decodificar payload:', err);
        return null;
      }
    }

    /* ============ Geração ============ */
    /**
     * Gera um link compartilhável contendo o objeto `data`.
     * @param {any} data - Seu estado/config a compartilhar (OBJETO serializável)
     * @param {{ ttl?: number }} [opts]
     * @returns {string} URL completa com ?share=...
     */
    generateLink(data = {}, opts = {}) {
      const now = Date.now();
      const payload = {
        v: 1,     // versão do schema
        ts: now,  // timestamp criação
        exp: now + (opts.ttl || this.defaultTTL), // expiração sugerida
        d: data   // dados do app
      };

      const token = this._encodePayload(payload);
      const url = this._attachParam(this.baseUrl, this.paramName, token);

      if (url.length > this.maxUrlLength) {
        console.warn(`[ShareUI] Link com ${url.length} caracteres pode exceder limites de alguns ambientes.`);
      }
      return url;
    }

    _attachParam(base, key, value) {
      try {
        const u = new URL(base, window.location.origin);
        // se base já tiver query/hash na string baseUrl, preserve
        const sp = u.searchParams;
        sp.set(key, value);
        u.search = sp.toString();
        return u.toString();
      } catch {
        // fallback simples
        const hasQ = base.includes('?');
        const sep = hasQ ? '&' : '?';
        return `${base}${sep}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }
    }

    /* ============ Leitura ============ */
    _readTokenFromUrl(url = window.location.href) {
      try {
        const u = new URL(url, window.location.origin);
        return u.searchParams.get(this.paramName);
      } catch {
        // fallback simples
        const q = (url.split('?')[1] || '').split('#')[0] || '';
        const params = new URLSearchParams(q);
        return params.get(this.paramName);
      }
    }

    /**
     * @param {string} [url] - opcional
     * @returns {{v:number, ts:number, exp?:number, d:any} | null}
     */
    parseFromUrl(url = window.location.href) {
      const token = this._readTokenFromUrl(url);
      if (!token) return null;
      const payload = this._decodePayload(token);
      if (!payload || typeof payload !== 'object') return null;

      // validação básica
      if (!payload.v || !payload.ts || !('d' in payload)) return null;

      // expiração (não bloqueia hard — apenas informa)
      if (payload.exp && Date.now() > payload.exp) {
        console.info('[ShareUI] Link expirado (exp < now). Seguindo com carga mesmo assim.');
      }

      return payload;
    }

    /* ============ Aplicação / Inicialização ============ */
    /**
     * Lê ?share=... na URL; chama `onLoad(data)` se presente; opcionalmente limpa a URL.
     * @returns {any|null} Os dados carregados (payload.d) ou null.
     */
    handleIncoming() {
      const payload = this.parseFromUrl();
      if (!payload) return null;

      const data = payload.d;
      // Callback do app para aplicar UI
      if (this.onLoad) {
        try {
          this.onLoad(data);
        } catch (err) {
          console.warn('[ShareUI] Erro no onLoad:', err);
        }
      } else {
        // Também dispara evento para quem preferir ouvir
        try {
          window.dispatchEvent(new CustomEvent('share:load', { detail: data }));
        } catch (err) {
          console.warn('[ShareUI] Falha ao disparar evento share:load:', err);
        }
      }

      if (this.cleanUrlAfterLoad) {
        this._cleanShareParamInPlace();
      }

      return data;
    }

    _cleanShareParamInPlace() {
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.has(this.paramName)) {
          url.searchParams.delete(this.paramName);
          const clean = url.pathname + (url.search ? '?' + url.searchParams.toString() : '') + url.hash;
          window.history.replaceState({}, document.title, clean);
        }
      } catch {
        // silencioso
      }
    }

    /* ============ Utilidades de UI ============ */
    /**
     * Copia texto para a área de transferência (com fallback).
     * @param {string} text
     * @returns {Promise<void>}
     */
    copyLinkToClipboard(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }
      return new Promise((resolve, reject) => {
        try {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    }

    /**
     * Conecta um botão para gerar/ copiar link rapidamente.
     * @param {string|Element} button - seletor ou elemento do botão
     * @param {() => any} getData - função que retorna o estado atual a compartilhar
     * @param {(msg: string) => void} [notify] - opcional, mostrar feedback
     */
    bindShareButton(button, getData, notify) {
      const btn = typeof button === 'string' ? document.querySelector(button) : button;
      if (!btn) return;
      btn.addEventListener('click', async () => {
        try {
          const data = getData ? getData() : {};
          const link = this.generateLink(data);
          await this.copyLinkToClipboard(link);
          if (notify) notify('Link copiado!');
        } catch (err) {
          if (notify) notify('Falha ao copiar link');
          console.warn('[ShareUI] Erro ao gerar/copiar link:', err);
        }
      });
    }
  }

  // Export para ES Module
  return { ShareUI };
}));
