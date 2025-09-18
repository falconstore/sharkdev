// assets/js/utils/share.js
// Sistema de compartilhamento (gerar/ler links) – compatível com ShareUI

export class ShareSystem {
  constructor() {}

  // ====== PÚBLICO (usado pelo ShareUI) ======

  // ArbiPro -> URL
  generateArbiProLink(data) {
    // Esperado: { numHouses, rounding, houses: [{ o,s,c,f,i,l,x }...] }
    const url = new URL(window.location.href);
    url.search = ""; // zera params antigos

    const params = new URLSearchParams();
    params.set("t", "arbipro");               // tipo
    params.set("n", String(data.numHouses));  // número de casas
    if (data.rounding != null) params.set("r", String(data.rounding));

    // Casas: h0_o, h0_s, h0_c, h0_f, h0_i, h0_l, h0_x ...
    if (Array.isArray(data.houses)) {
      data.houses.forEach((h, i) => {
        const p = (k, v) => v != null && v !== "" ? params.set(`h${i}_${k}`, String(v)) : null;
        p("o", h.o);
        p("s", h.s);
        if (h.c !== null && h.c !== undefined) p("c", h.c);
        if (h.f) p("f", "1");
        if (h.i !== null && h.i !== undefined) p("i", h.i);
        if (h.l) p("l", "1");
        if (h.x) p("x", "1"); // fixedStake
      });
    }

    url.search = params.toString();
    return url.toString();
  }

  // FreePro -> URL
  generateFreeProLink(data) {
    // Esperado (pelo ShareUI):
    // - data.mode === 'cashback' | undefined
    // - data.p { o, s, f, e } (promo)  OU  { o, s, r } (cashback)
    // - data.cov: [{ odd, comm, lay }, ...]
    const url = new URL(window.location.href);
    url.search = "";

    const params = new URLSearchParams();
    params.set("t", "freepro");

    if (data.mode === "cashback") {
      params.set("mode", "cashback");
      if (data.p) {
        if (data.p.o) params.set("p_o", data.p.o);
        if (data.p.s) params.set("p_s", data.p.s);
        if (data.p.r) params.set("p_r", data.p.r); // cashback rate
      }
    } else {
      if (data.p) {
        if (data.p.o) params.set("p_o", data.p.o);
        if (data.p.s) params.set("p_s", data.p.s);
        if (data.p.f) params.set("p_f", data.p.f); // freebet
        if (data.p.e) params.set("p_e", data.p.e); // extract rate
      }
    }

    if (Array.isArray(data.cov)) {
      data.cov.forEach((c, i) => {
        const p = (k, v) => v != null && v !== "" ? params.set(`cv${i}_${k}`, String(v)) : null;
        p("o", c.odd);
        if (c.comm !== null && c.comm !== undefined) p("c", c.comm);
        if (c.lay) p("l", "1");
      });
    }

    url.search = params.toString();
    return url.toString();
  }

  // Ler config da URL atual e devolver objeto que o ShareUI espera
  loadFromUrl() {
    const sp = new URLSearchParams(window.location.search);
    const t = sp.get("t");
    if (!t) return null;

    if (t === "arbipro") {
      const n = parseInt(sp.get("n") || "2", 10);
      const r = sp.get("r");

      const houses = [];
      for (let i = 0; i < 10; i++) { // limite seguro
        const hasAny =
          sp.has(`h${i}_o`) || sp.has(`h${i}_s`) || sp.has(`h${i}_c`) ||
          sp.has(`h${i}_f`) || sp.has(`h${i}_i`) || sp.has(`h${i}_l`) || sp.has(`h${i}_x`);
        if (!hasAny) break;

        houses.push({
          o: sp.get(`h${i}_o`) || "",
          s: sp.get(`h${i}_s`) || "0",
          c: _numOrNull(sp.get(`h${i}_c`)),
          f: _bool(sp.get(`h${i}_f`)),
          i: _numOrNull(sp.get(`h${i}_i`)),
          l: _bool(sp.get(`h${i}_l`)),
          x: _bool(sp.get(`h${i}_x`)),
        });
      }

      return { t: "arbipro", n, r, h: houses };
    }

    if (t === "freepro") {
      const mode = sp.get("mode") === "cashback" ? "cashback" : undefined;

      let p = null;
      if (mode === "cashback") {
        p = {
          o: sp.get("p_o") || "",
          s: sp.get("p_s") || "",
          r: sp.get("p_r") || "",
        };
      } else {
        p = {
          o: sp.get("p_o") || "",
          s: sp.get("p_s") || "",
          f: sp.get("p_f") || "",
          e: sp.get("p_e") || "",
        };
      }

      const cov = [];
      for (let i = 0; i < 20; i++) {
        const hasAny =
          sp.has(`cv${i}_o`) || sp.has(`cv${i}_c`) || sp.has(`cv${i}_l`);
        if (!hasAny) break;

        cov.push({
          odd: sp.get(`cv${i}_o`) || "",
          comm: _numOrNull(sp.get(`cv${i}_c`)),
          lay: _bool(sp.get(`cv${i}_l`)),
        });
      }

      return { t: "freepro", mode, p, cov };
    }

    return null;
  }

  // Remove os parâmetros da URL sem recarregar a página
  cleanUrl() {
    const url = new URL(window.location.href);
    if (url.search) {
      url.search = "";
      window.history.replaceState({}, document.title, url.toString());
    }
  }

  // ====== OPCIONAL: encurtar com TinyURL (não é usado pelo ShareUI, mas disponível) ======
  async shorten(url) {
    try {
      const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
      if (!res.ok) throw new Error("Falha ao encurtar URL");
      const shortUrl = await res.text();
      // TinyURL às vezes retorna texto simples; validamos por via das dúvidas
      if (shortUrl.startsWith("http")) return shortUrl.trim();
      throw new Error("Resposta inválida do TinyURL");
    } catch (err) {
      console.error("Erro ao encurtar URL:", err);
      return url; // fallback: retorna original
    }
  }
}

// Helpers
function _bool(v) {
  if (!v) return false;
  return v === "1" || v === "true" || v === "on";
}
function _numOrNull(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

export default ShareSystem;
