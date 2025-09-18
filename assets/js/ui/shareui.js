// ui/shareui.js — ES Module completo com retrocompatibilidade

export class ShareUI {
  /**
   * @param {Object} options
   * @param {string}  [options.paramName='share']
   * @param {number}  [options.maxUrlLength=1900]
   * @param {number}  [options.defaultTTL=7 dias em ms]
   * @param {boolean} [options.cleanUrlAfterLoad=true]
   * @param {(data:any)=>void} [options.onLoad]
   */
  constructor(options = {}) {
    this.paramName = options.paramName || 'share';
    this.maxUrlLength = options.maxUrlLength || 1900;
    this.defaultTTL = options.defaultTTL || (1000 * 60 * 60 * 24 * 7);
    this.cleanUrlAfterLoad = options.cleanUrlAfterLoad !== false;
    this.onLoad = typeof options.onLoad === 'function' ? options.onLoad : null;

    this.baseUrl = this._computeBaseUrl();

    // callbacks opcionais
    this._getData = null;
    this._notify = null;
  }

  /* ================= Base URL ================ */
  _computeBaseUrl() {
    try {
      const { origin, pathname, hash } = window.location;
      return origin + pathname + (hash || '');
    } catch { return ''; }
  }

  /* =========== Base64 URL-safe UTF-8 ========== */
  _utf8ToB64(str) {
    const bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
      (_, p1) => String.fromCharCode(parseInt(p1, 16)));
    return btoa(bytes);
  }
  _b64ToUtf8(b64) {
    const bin = atob(b64);
    const pct = Array.prototype.map.call(bin,
      c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('');
    return decodeURIComponent(pct);
  }
  _b64ToUrlSafe(b64) {
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  _urlSafeToB64(safe) {
    let b64 = safe.replace(/-/g, '+').replace(/_/g, '/');
    while (b64.length % 4) b64 += '=';
    return b64;
  }
  _encodePayload(obj) {
    const json = JSON.stringify(obj);
    return this._b64ToUrlSafe(this._utf8ToB64(json));
  }
  _decodePayload(token) {
    try {
      const json = this._b64ToUtf8(this._urlSafeToB64(token));
      return JSON.parse(json);
    } catch (e) {
      console.warn('[ShareUI] decode falhou:', e);
      return null;
    }
  }

  /* ============== Geração de link ============= */
  generateLink(data = {}, opts = {}) {
    const now = Date.now();
    const payload = { v: 1, ts: now, exp: now + (opts.ttl || this.defaultTTL), d: data };
    const token = this._encodePayload(payload);
    const url = this._attachParam(this.baseUrl, this.paramName, token);
    if (url.length > this.maxUrlLength) {
      console.warn(`[ShareUI] Link com ${url.length} chars pode exceder limites em alguns ambientes.`);
    }
    return url;
  }
  // aliases
  getLink(data = {}, opts = {}) { return this.generateLink(data, opts); }
  getShareLink(data = {}, opts = {}) { return this.generateLink(data, opts); }

  _attachParam(base, key, value) {
    try {
      const u = new URL(base, window.location.origin);
      u.searchParams.set(key, value);
      return u.toString();
    } catch {
      const sep = base.includes('?') ? '&' : '?';
      return `${base}${sep}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }
  }

  /* ================ Leitura ================ */
  _readTokenFromUrl(url = window.location.href) {
    try {
      const u = new URL(url, window.location.origin);
      return u.searchParams.get(this.paramName);
    } catch {
      const q = (url.split('?')[1] || '').split('#')[0] || '';
      return new URLSearchParams(q).get(this.paramName);
    }
  }

  parseFromUrl(url = window.location.href) {
    const token = this._readTokenFromUrl(url);
    if (!token) return null;
    const payload = this._decodePayload(token);
    if (!payload || typeof payload !== 'object') return null;
    if (!payload.v || !payload.ts || !('d' in payload)) return null;
    if (payload.exp && Date.now() > payload.exp) {
      console.info('[ShareUI] Link expirado (seguindo com carga).');
    }
    return payload;
  }

  /* ======= Aplicação / Inicialização ========= */
  handleIncoming() {
    const payload = this.parseFromUrl();
    if (!payload) return null;
    const data = payload.d;

    if (this.onLoad) {
      try { this.onLoad(data); }
      catch (e) { console.warn('[ShareUI] erro onLoad:', e); }
    } else {
      try { window.dispatchEvent(new CustomEvent('share:load', { detail: data })); }
      catch (e) { console.warn('[ShareUI] falha ao disparar share:load:', e); }
    }

    if (this.cleanUrlAfterLoad) this._cleanShareParamInPlace();
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
    } catch {}
  }

  /* ========== Retrocompatibilidade ========== */
  /**
   * init(callbackOrOptions?) — alias para handleIncoming com configuração de onLoad.
   * - Se receber função: vira onLoad.
   * - Se receber objeto com onLoad: seta e chama.
   */
  init(arg) {
    if (typeof arg === 'function') this.onLoad = arg;
    else if (arg && typeof arg.onLoad === 'function') this.onLoad = arg.onLoad;
    return this.handleIncoming();
  }

  /* ============= Callbacks (opcional) ============= */
  setGetData(fn) { if (typeof fn === 'function') this._getData = fn; }
  setNotify(fn) { if (typeof fn === 'function') this._notify = fn; }

  /* ============== Utilidades UI ============== */
  copyLinkToClipboard(text) {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
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
      } catch (e) { reject(e); }
    });
  }
  copyToClipboard(text) { return this.copyLinkToClipboard(text); } // alias

  /**
   * Handler retrocompatível para botão "Compartilhar".
   * Pode ser usado com onclick HTML ou addEventListener.
   * Aceita { data?, ttl?, notify? } como override.
   */
  async handleShareClick(eOrOptions) {
    if (eOrOptions && typeof eOrOptions.preventDefault === 'function') {
      eOrOptions.preventDefault();
      eOrOptions.stopPropagation?.();
    }
    const opts = (eOrOptions && typeof eOrOptions === 'object' && !('preventDefault' in eOrOptions))
      ? eOrOptions : {};

    try {
      const data = opts.data !== undefined
        ? opts.data
        : (typeof this._getData === 'function' ? this._getData() : {});

      const link = this.generateLink(data, { ttl: opts.ttl });
      await this.copyLinkToClipboard(link);

      const notify = opts.notify || this._notify;
      if (typeof notify === 'function') notify('Link copiado!', 'success');

      try { window.dispatchEvent(new CustomEvent('share:created', { detail: { link, data } })); }
      catch (_) {}
      return link;
    } catch (err) {
      const notify = opts.notify || this._notify;
      if (typeof notify === 'function') notify('Falha ao gerar/copiar link', 'error');
      console.warn('[ShareUI] erro em handleShareClick:', err);
      throw err;
    }
  }
  onShareClick(eOrOptions) { return this.handleShareClick(eOrOptions); } // alias

  bindShareButton(button, getData, notify) {
    const btn = typeof button === 'string' ? document.querySelector(button) : button;
    if (!btn) return;
    if (typeof getData === 'function') this.setGetData(getData);
    if (typeof notify === 'function') this.setNotify(notify);
    btn.addEventListener('click', this.handleShareClick.bind(this));
  }
}
