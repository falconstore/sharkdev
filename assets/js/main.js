// assets/js/main.js - VERSÃO CORRIGIDA COM COMPARTILHAMENTO
// Controlador principal da aplicação

import { Theme } from './ui/theme.js';
import { TabSystem } from './ui/tabs.js';
import { ArbiPro } from './calculators/arbipro.js';
import { FreePro } from './calculators/freepro.js';
import { CasasRegulamentadas } from './calculators/casas-regulamentadas.js';
import { ShareUI } from './ui/shareui.js';

class App {
  constructor() {
    this.theme = new Theme();
    this.tabSystem = null;
    this.arbiPro = null;
    this.freePro = null;
    this.casasRegulamentadas = null;
    this.navigation = null;
    this.shareUI = null;
  }

  async init() {
    try {
      console.log('Iniciando Calculadoras Shark 100% Green...');
      
      // Inicializa tema
      this.theme.init();
      
      // Carrega módulos opcionais
      await this.loadOptionalModules();
      
      // Carrega aplicação principal
      await this.loadMainApp();
      
      // IMPORTANTE: Inicializa ShareUI após as calculadoras estarem prontas
      this.shareUI = new ShareUI();
      await this.shareUI.init();
      console.log('✅ ShareUI inicializado');
      
      // Configura sistema de compartilhamento
      this.setupShareSystem();
      
      console.log('Calculadoras Shark 100% Green inicializadas com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar app:', error);
      this.showError('Erro ao inicializar aplicação: ' + error.message);
    }
  }

  async loadOptionalModules() {
    // Carrega Navigation de forma segura
    try {
      const { Navigation } = await import('./ui/navigation.js');
      this.navigation = new Navigation();
      this.navigation.init();
      console.log('✅ Navigation carregado');
    } catch (e) {
      console.warn('⚠️ Navigation não disponível:', e.message);
    }
  }

  async loadMainApp() {
    try {
      console.log('Carregando calculadoras...');
      
      // Mostra loading
      this.showLoadingScreen();
      
      // Aguarda um pouco para mostrar loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const container = document.getElementById('app-container');
      if (!container) {
        throw new Error('Container app-container não encontrado');
      }

      // Template com navegação
      const navigationTabs = this.navigation ? `
        <div class="main-navigation">
          <div class="nav-tabs">
            <button id="navCalculadoras" class="nav-tab active">Calculadoras</button>
            <button id="navCasasRegulamentadas" class="nav-tab">Casas Regulamentadas</button>
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
        
        <div id="casas-regulamentadas-content" class="page-content hidden"></div>
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
      this.casasRegulamentadas = new CasasRegulamentadas();

      await this.arbiPro.init();
      this.freePro.init();
      this.casasRegulamentadas.init();

      // Conecta navegação com casas regulamentadas
      if (this.navigation && this.casasRegulamentadas) {
        this.navigation.casasRegulamentadas = this.casasRegulamentadas;
      }
      
      console.log('Calculadoras carregadas com sucesso');
      
    } catch (error) {
      console.error('Erro ao carregar calculadoras:', error);
      this.showError('Erro ao carregar calculadoras: ' + error.message);
    }
  }

  setupShareSystem() {
    console.log('Configurando sistema de compartilhamento...');
    
    if (!this.shareUI) {
      console.error('ShareUI não está inicializado');
      return;
    }

    // Aguarda DOM estar pronto e configura botões
    setTimeout(() => {
      this.setupArbiProShareButton();
      this.setupFreeProShareButton();
    }, 1000);
  }

  setupArbiProShareButton() {
    // Tenta múltiplas vezes encontrar e configurar o botão
    let attempts = 0;
    const maxAttempts = 10;
    
    const trySetup = () => {
      attempts++;
      
      const shareBtn = document.getElementById('shareBtn');
      if (shareBtn) {
        // Remove listeners antigos clonando o elemento
        const newShareBtn = shareBtn.cloneNode(true);
        shareBtn.parentNode.replaceChild(newShareBtn, shareBtn);
        
        // Adiciona novo listener
        newShareBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('Botão ArbiPro clicado');
          
          if (this.shareUI) {
            this.shareUI.handleShareClick('arbipro');
          } else {
            console.error('ShareUI não disponível');
          }
        });
        
        console.log('✅ Botão ArbiPro configurado');
        return true;
      }
      
      if (attempts < maxAttempts) {
        console.log(`Tentativa ${attempts} de configurar botão ArbiPro...`);
        setTimeout(trySetup, 500);
        return false;
      }
      
      console.warn('❌ Não foi possível configurar botão ArbiPro após', maxAttempts, 'tentativas');
      return false;
    };
    
    trySetup();
  }

  setupFreeProShareButton() {
    let attempts = 0;
    const maxAttempts = 15;
    
    const trySetup = () => {
      attempts++;
      
      try {
        const iframe = document.getElementById('calc2frame');
        if (iframe && iframe.contentDocument) {
          const doc = iframe.contentDocument;
          const shareBtn = doc.getElementById('shareBtn');
          
          if (shareBtn) {
            // Remove listeners antigos clonando o elemento
            const newShareBtn = shareBtn.cloneNode(true);
            shareBtn.parentNode.replaceChild(newShareBtn, shareBtn);
            
            // Adiciona novo listener
            newShareBtn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Botão FreePro clicado');
              
              // Acessa ShareUI do parent window
              try {
                if (window.SharkGreen && window.SharkGreen.shareUI) {
                  window.SharkGreen.shareUI.handleShareClick('freepro');
                } else {
                  console.error('ShareUI não disponível no parent window');
                }
              } catch (error) {
                console.error('Erro ao acessar ShareUI:', error);
              }
            });
            
            console.log('✅ Botão FreePro configurado');
            return true;
          }
        }
      } catch (e) {
        // Erro normal durante carregamento do iframe
      }
      
      if (attempts < maxAttempts) {
        console.log(`Tentativa ${attempts} de configurar botão FreePro...`);
        setTimeout(trySetup, 1000);
        return false;
      }
      
      console.warn('❌ Não foi possível configurar botão FreePro após', maxAttempts, 'tentativas');
      return false;
    };
    
    // Aguarda iframe carregar
    setTimeout(trySetup, 2000);
  }

  showLoadingScreen() {
    const container = document.getElementById('app-container');
    if (container) {
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
  }

  showError(message) {
    const container = document.getElementById('app-container');
    if (container) {
      container.innerHTML = `
        <div class="container" style="text-align: center; margin-top: 2rem;">
          <div class="card" style="max-width: 500px; margin: 0 auto; padding: 2rem;">
            <h2 style="color: var(--danger); margin-bottom: 1rem;">⚠️ Erro</h2>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">${message}</p>
            <button onclick="location.reload()" class="btn btn-primary">Recarregar Página</button>
          </div>
        </div>
      `;
    }
  }

  // Métodos públicos para debug
  getModules() {
    return {
      theme: this.theme,
      navigation: this.navigation,
      tabSystem: this.tabSystem,
      arbiPro: this.arbiPro,
      freePro: this.freePro,
      casasRegulamentadas: this.casasRegulamentadas,
      shareUI: this.shareUI
    };
  }
}

// Inicializa app quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  try {
    const app = new App();
    window.SharkGreen = app; // Para debug global e acesso do iframe
    app.init();
  } catch (error) {
    console.error('Erro crítico ao inicializar:', error);
    document.body.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #dc2626;">
        <h1>Erro Crítico</h1>
        <p>Não foi possível inicializar a aplicação.</p>
        <p>Erro: ${error.message}</p>
        <button onclick="location.reload()" style="padding: 1rem 2rem; margin-top: 1rem; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer;">
          Recarregar
        </button>
      </div>
    `;
  }
});

// Exporta classe
export { App };
