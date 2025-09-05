// assets/js/main.js - Versão completa com todas as funcionalidades
// Controlador principal da aplicação

import { Theme } from './ui/theme.js';
import { TabSystem } from './ui/tabs.js';
import { ArbiPro } from './calculators/arbipro.js';
import { FreePro } from './calculators/freepro.js';

// Importação condicional - só importa se os arquivos existirem
let Navigation = null;
let ShareUI = null;

try {
  const navModule = await import('./ui/navigation.js');
  Navigation = navModule.Navigation;
} catch (e) {
  console.warn('Navigation não encontrado, usando fallback');
}

try {
  const shareModule = await import('./ui/share-ui.js');
  ShareUI = shareModule.ShareUI;
} catch (e) {
  console.warn('ShareUI não encontrado, usando fallback');
}

class App {
  constructor() {
    this.theme = new Theme();
    this.navigation = Navigation ? new Navigation() : null;
    this.tabSystem = null;
    this.arbiPro = null;
    this.freePro = null;
    this.shareUI = ShareUI ? new ShareUI() : null;
  }

  async init() {
    try {
      console.log('Iniciando Calculadoras Shark 100% Green...');
      
      // Inicializa tema
      this.theme.init();
      
      // Inicializa navegação se disponível
      if (this.navigation) {
        this.navigation.init();
      }
      
      // Inicializa sistema de compartilhamento se disponível
      if (this.shareUI) {
        this.shareUI.init();
      }
      
      // Carrega aplicação principal diretamente
      await this.loadMainApp();
      
      console.log('Calculadoras Shark 100% Green inicializadas com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar app:', error);
      this.showError('Erro ao inicializar aplicação');
    }
  }

  async loadMainApp() {
    try {
      console.log('Carregando calculadoras...');
      
      // Mostra loading inicial
      this.showLoadingScreen();
      
      // Simula carregamento de 2 segundos
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const container = document.getElementById('app-container');

      // Template das calculadoras com navegação condicional
      const navigationTabs = this.navigation ? `
        <div class="main-navigation">
          <div class="nav-tabs">
            <button id="navCalculadoras" class="nav-tab active">Calculadoras</button>
            <button id="navSobre" class="nav-tab">Sobre</button>
            <button id="navContato" class="nav-tab">Contato</button>
          </div>
        </div>
      ` : '';

      const html = `
        ${navigationTabs}
        
        <div id="calculadoras-content">
          <div role="tablist" aria-label="Calculadoras" class="tabs-container">
            <button id="tabBtn1" role="tab" aria-selected="true" aria-controls="panel-1" class="tab" tabindex="0">
              Calculadora ArbiPro
            </button>
            <button id="tabBtn2" role="tab" aria-selected="false" aria-controls="panel-2" class="tab" tabindex="-1">
              Calculadora FreePro
            </button>
          </div>

          <section id="panel-1" role="tabpanel" aria-labelledby="tabBtn1">
            <div class="panel">
              <div id="app"></div>
            </div>
          </section>

          <section id="panel-2" role="tabpanel" aria-labelledby="tabBtn2" hidden>
            <div class="panel">
              <iframe id="calc2frame" title="Calculadora FreePro" 
                style="width: 100%; height: auto; border: none; border-radius: 16px; background: transparent; display: block; overflow: hidden;" 
                scrolling="no">
              </iframe>
            </div>
          </section>
        </div>
        
        <div id="sobre-content" class="page-content hidden"></div>
        <div id="contato-content" class="page-content hidden"></div>
      `;
      
      container.innerHTML = html;

      // Inicializa sistema de abas
      this.tabSystem = new TabSystem();
      this.tabSystem.init();

      // Inicializa calculadoras
      this.arbiPro = new ArbiPro();
      this.freePro = new FreePro();

      await this.arbiPro.init();
      this.freePro.init();
      
      // Adiciona botões de compartilhamento após carregamento
      if (this.shareUI) {
        setTimeout(() => {
          this.addShareButtons();
        }, 1000);
      }
      
      console.log('Calculadoras carregadas com sucesso');
      
    } catch (error) {
      console.error('Erro ao carregar calculadoras:', error);
      this.showError('Erro ao carregar calculadoras');
    }
  }

  addShareButtons() {
    if (!this.shareUI) return;
    
    try {
      // Adiciona botão no ArbiPro (na seção de configurações)
      const arbiProConfig = document.querySelector('#panel-1 .stats-grid .card:first-child');
      if (arbiProConfig && this.shareUI.createShareButton) {
        const shareBtn = this.shareUI.createShareButton('arbipro');
        shareBtn.style.marginTop = '1rem';
        shareBtn.style.width = '100%';
        arbiProConfig.appendChild(shareBtn);
        console.log('Botão de compartilhamento adicionado ao ArbiPro');
      }

      // Sistema melhorado para FreePro
      this.setupFreeProButton();

    } catch (error) {
      console.warn('Erro ao adicionar botões de compartilhamento:', error);
    }
  }

  // Método específico para FreePro
  setupFreeProButton() {
    if (!this.shareUI) return;
    
    let attempts = 0;
    const maxAttempts = 20;
    
    const tryAddButton = () => {
      attempts++;
      
      const iframe = document.getElementById('calc2frame');
      if (iframe && iframe.contentDocument) {
        const doc = iframe.contentDocument;
        const actions = doc.querySelector('.actions');
        
        if (actions && !doc.querySelector('.btn-share')) {
          this.addFreeProShareButton(doc);
          console.log(`✅ Botão FreePro adicionado na tentativa ${attempts}`);
          return;
        }
      }
      
      if (attempts < maxAttempts) {
        setTimeout(tryAddButton, 500);
      } else {
        console.warn('⚠️ Não foi possível adicionar botão FreePro após 10 segundos');
      }
    };
    
    tryAddButton();
  }

  addFreeProShareButton(doc) {
    if (!this.shareUI) return false;
    
    try {
      const actions = doc.querySelector('.actions');
      if (actions && !doc.querySelector('.btn-share')) {
        const shareBtn = doc.createElement('button');
        shareBtn.className = 'btn btn-share';
        shareBtn.innerHTML = '🔗 Compartilhar';
        shareBtn.style.background = 'linear-gradient(135deg, #8b5cf6, #3b82f6)';
        shareBtn.style.color = 'white';
        shareBtn.style.marginTop = '0.75rem';
        
        shareBtn.addEventListener('click', () => {
          if (this.shareUI.handleShareClick) {
            this.shareUI.handleShareClick('freepro');
          }
        });
        
        actions.appendChild(shareBtn);
        console.log('✅ Botão de compartilhamento adicionado ao FreePro');
        
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Erro ao adicionar botão no FreePro:', error);
      return false;
    }
  }

  showLoadingScreen() {
    const container = document.getElementById('app-container');
    container.innerHTML = `
      <div class="post-login-loading">
        <div class="post-login-content">
          <div class="post-login-title">Carregando Shark 100% Green</div>
          <div class="post-login-spinner"></div>
          <div class="post-login-message">Inicializando calculadoras profissionais...</div>
        </div>
      </div>
    `;
  }

  showError(message) {
    const container = document.getElementById('app-container');
    container.innerHTML = `
      <div class="container" style="text-align: center; margin-top: 2rem;">
        <div class="auth-container">
          <h2 style="color: var(--danger); margin-bottom: 1rem;">❌ Erro</h2>
          <p style="color: var(--text-secondary); margin-bottom: 2rem;">${message}</p>
          <button onclick="location.reload()" class="btn btn-primary">Recarregar Página</button>
        </div>
      </div>
    `;
  }

  // Métodos públicos para debug
  getModules() {
    return {
      theme: this.theme,
      navigation: this.navigation,
      tabSystem: this.tabSystem,
      arbiPro: this.arbiPro,
      freePro: this.freePro,
      shareUI: this.shareUI
    };
  }
}

// Inicializa app quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  window.SharkGreen = app; // Para debug global
  app.init();
});
