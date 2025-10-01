// assets/js/utils/share.js - VERSÃO CORRIGIDA
export class ShareSystem {
  generateArbiProLink(data) {
    const numHouses = data?.numHouses ?? data?.n ?? 2;
    const rounding  = data?.rounding  ?? data?.r ?? 0.01;

    const housesIn = Array.isArray(data?.houses) ? data.houses
                    : Array.isArray(data?.h)      ? data.h
                    : [];

    const houses = housesIn.slice(0, numHouses).map((h) => ({
      o: h?.o ?? h?.odd ?? '',
      s: h?.s ?? h?.stake ?? '',
      c: _nullishToNumberOrNull(h?.c ?? h?.commission),
      f: _toBool(h?.f ?? h?.freebet, false),
      i: _nullishToNumberOrNull(h?.i ?? h?.increase),
      l: _toBool(h?.l ?? h?.lay, false),
      x: _toBool(h?.x ?? h?.fixedStake, false),
    }));

    const config = { t: 'arbipro', n: numHouses, r: rounding, h: houses };
    return this.createShareableLink(config);
  }

  generateFreeProLink(data) {
    const n = data?.n ?? data?.numEntradas ?? 3;
    const r = data?.r ?? data?.roundStep   ?? 1.0;
    const mode = data?.mode ?? 'freebet'; // 🔥 CORREÇÃO: inclui modo

    const pIn = data?.p ?? {
      o: data?.promoOdd ?? '',
      c: data?.promoComm ?? '',
      s: data?.promoStake ?? '',
      f: data?.freebetValue ?? '',
      e: data?.extractionRate ?? 70,
      r: data?.cashbackRate ?? '',
    };

    const p = {
      o: pIn?.o ?? data?.promoOdd ?? '',
      c: pIn?.c ?? data?.promoComm ?? '',
      s: pIn?.s ?? data?.promoStake ?? '',
      f: pIn?.f ?? data?.freebetValue ?? '',
      e: pIn?.e ?? data?.extractionRate ?? 70,
      r: pIn?.r ?? data?.cashbackRate ?? '',
    };

    const covIn = Array.isArray(data?.cov) ? data.cov
                : Array.isArray(data?.coverages) ? data.coverages
                : [];

    const cov = covIn.map((c) => ({
      odd:  c?.odd ?? c?.o ?? '',
      comm: c?.comm ?? c?.c ?? '',
      lay:  _toBool(c?.lay ?? c?.l, false),
    }));

    const config = { t: 'freepro', n, r, p, cov, mode }; // 🔥 CORREÇÃO: adiciona mode
    return this.createShareableLink(config);
  }

  createShareableLink(config) {
    try {
      if (typeof window !== 'undefined' && typeof window.ShareCreateLink === 'function') {
        return window.ShareCreateLink(config);
      }
      if (typeof this._externalCreateShareableLink === 'function') {
        return this._externalCreateShareableLink(config);
      }
    } catch (_) {}

    const url = new URL(typeof window !== 'undefined' ? window.location.href : 'https://example.com/');
    const key = _detectShareKey(url.searchParams) ?? 'share';

    const encoded = _encodePayload(config);
    url.searchParams.set(key, encoded);

    if (url.hash && /^#(s|share)=/i.test(url.hash.slice(1))) {
      url.hash = '';
    }
    return url.toString();
  }

  static readFromUrl(currentHref) {
    const url = new URL(currentHref || (typeof window !== 'undefined' ? window.location.href : 'https://example.com/'));
    const sp  = url.searchParams;
    const hash = (url.hash || '').replace(/^#/, '');

    let raw = sp.get('share') || sp.get('s') || null;
    if (!raw && hash) {
      const parts = hash.split('=');
      if (parts.length === 2 && (parts[0] === 'share' || parts[0] === 's')) {
        raw = parts[1];
      }
    }
    if (!raw) return null;

    return _decodePayload(raw);
  }
}

/* Helpers */
function _detectShareKey(params) {
  if (!params) return null;
  if (params.has('s')) return 's';
  if (params.has('share')) return 'share';
  return null;
}

function _encodePayload(obj) {
  try {
    const json = JSON.stringify(obj);
    const b64 = _toBase64Url(json);
    return `b64:${b64}`;
  } catch {
    try {
      return `j:${encodeURIComponent(JSON.stringify(obj))}`;
    } catch {
      return `j:${encodeURIComponent(String(obj))}`;
    }
  }
}

function _decodePayload(raw) {
  let s = String(raw || '');

  if (s.startsWith('b64:')) {
    const body = s.slice(4);
    try {
      const json = _fromBase64Url(body);
      return JSON.parse(json);
    } catch {}
  }
  if (s.startsWith('j:')) {
    const body = s.slice(2);
    try {
      const json = decodeURIComponent(body);
      return JSON.parse(json);
    } catch {}
  }

  if (/^[A-Za-z0-9_\-]+$/.test(s)) {
    try {
      const json = _fromBase64Url(s);
      return JSON.parse(json);
    } catch {}
  }

  try {
    const json = decodeURIComponent(s);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function _toBase64Url(str) {
  if (typeof btoa === 'function') {
    const utf8 = unescape(encodeURIComponent(str));
    return btoa(utf8).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }
  return Buffer.from(str, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function _fromBase64Url(b64url) {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 2 ? '==' : b64.length % 4 === 3 ? '=' : '';
  const full = b64 + pad;

  if (typeof atob === 'function') {
    const bin = atob(full);
    try {
      return decodeURIComponent(escape(bin));
    } catch {
      return bin;
    }
  }
  return Buffer.from(full, 'base64').toString('utf8');
}

function _toBool(v, fallback = false) {
  if (typeof v === 'boolean') return v;
  if (v === 'true') return true;
  if (v === 'false') return false;
  if (v == null) return fallback;
  if (v === 1 || v === '1') return true;
  if (v === 0 || v === '0') return false;
  return Boolean(v);
}

function _nullishToNumberOrNull(v) {
  if (v === '' || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export const ShareHelpers = {
  encode: _encodePayload,
  decode: _decodePayload,
  base64url: { to: _toBase64Url, from: _fromBase64Url },
};
