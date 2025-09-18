// ui/shareui.js
// Componente responsável por controlar botões e modal de compartilhamento
// Integra com ShareSystem (utils/share.js)

import ShareSystem from "../utils/share.js";

export class ShareUI {
  constructor(options = {}) {
    this.shareSystem = new ShareSystem();
    this.arbiPro = options.arbiPro;   // referência para a calculadora ArbiPro
    this.freePro = options.freePro;   // referência para a calculadora FreePro
    this.active = null;

    this.arbiBtn = document.getElementById("share-arbipro");
    this.freeBtn = document.getElementById("share-freepro");

    this.modal = null;
  }

  init() {
    // Botão ArbiPro
    if (this.arbiBtn) {
      this.arbiBtn.addEventListener("click", () => {
        this.handleArbiProShare();
      });
    }

    // Botão FreePro
    if (this.freeBtn) {
      this.freeBtn.addEventListener("click", () => {
        this.handleFreeProShare();
      });
    }

    // Modal
    this.modal = document.getElementById("share-modal");
    if (this.modal) {
      const closeBtn = this.modal.querySelector(".close");
      if (closeBtn) {
        closeBtn.addEventListener("click", () => this.hideShareModal());
      }
    }

    // Carregar config da URL (se houver)
    const config = this.shareSystem.loadFromUrl();
    if (config) {
      if (config.t === "arbipro" && this.arbiPro) {
        this.arbiPro.loadConfig(config);
        this.active = "arbipro";
      } else if (config.t === "freepro" && this.freePro) {
        this.freePro.loadConfig(config);
        this.active = "freepro";
      }
      this.shareSystem.cleanUrl();
    }
  }

  // ======== AÇÕES ========

  async handleArbiProShare() {
    if (!this.arbiPro) return;
    const data = this.arbiPro.getShareData();
    const link = this.shareSystem.generateArbiProLink(data);

    // Se quiser encurtar:
    // const shortLink = await this.shareSystem.shorten(link);
    // await this.showShareModal(shortLink);

    await this.showShareModal(link);
  }

  async handleFreeProShare() {
    if (!this.freePro) return;
    const data = this.freePro.getShareData();
    const link = this.shareSystem.generateFreeProLink(data);

    // Se quiser encurtar:
    // const shortLink = await this.shareSystem.shorten(link);
    // await this.showShareModal(shortLink);

    await this.showShareModal(link);
  }

  async showShareModal(link) {
    if (!this.modal) return;

    const input = this.modal.querySelector("input");
    if (input) {
      input.value = link;
      input.focus();
      input.select();
    }

    this.modal.style.display = "block";
  }

  hideShareModal() {
    if (this.modal) {
      this.modal.style.display = "none";
    }
  }
}

// Export default também (para flexibilidade)
export default ShareUI;
