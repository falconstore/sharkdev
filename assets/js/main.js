// assets/js/main.js - VERSÃO COMPLETA E ATUALIZADA
// Controlador principal da aplicação

import { Theme } from './ui/theme.js';
import { TabSystem } from './ui/tabs.js';
import { ArbiPro } from './calculators/arbipro.js';
import { FreePro } from './calculators/freepro.js';
import { CasasRegulamentadas } from './calculators/casas-regulamentadas.js';

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
      
      // Carrega aplicação principal DIRETO (sem login)
      await this.loadMainApp();
      
      // Carrega sistema de compartilhamento
      await this.loadShareSystem();
      
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
      
      // Remove tela de loading se existir
      this.removeLoadingScreen();
      
      const container = document.getElementById('app-container');
      if (!container) {
        throw new Error('Container app-container não encontrado');
      }

      // Template SEM sistema de login
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

      // Inicializa calculadoras DIRETO
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

  async loadShareSystem() {
    try {
      console.log('🔗 Carregando sistema de compartilhamento...');
      
      const { ShareUI } = await import('./ui/shareui.js');
      this.shareUI = new ShareUI();
      await this.shareUI.init();
      
      // Expor globalmente para facilitar acesso
      window.SharkShareUI = this.shareUI;
      
      // Bind ArbiPro - tenta múltiplas vezes
      this.bindArbiProShare();
      
      // Bind FreePro - tenta múltiplas vezes
      this.bindFreeProShare();
      
      console.log('✅ Sistema de compartilhamento carregado');
    } catch (e) {
      console.error('❌ Erro ao carregar share:', e);
    }
  }

  bindArbiProShare() {
    let attempts = 0;
    const maxAttempts = 10;
    
    const tryBind = () => {
      attempts++;
      const arbiBtn = document.getElementById('shareArbiBtn');
      
      if (arbiBtn) {
        arbiBtn.onclick = () => {
          if (this.shareUI) {
            this.shareUI.share('arbipro');
          } else {
            console.error('ShareUI não disponível');
          }
        };
        console.log('✅ Botão ArbiPro vinculado');
        return true;
      }
      
      if (attempts < maxAttempts) {
        setTimeout(tryBind, 500);
      } else {
        console.warn('⚠️ Botão shareArbiBtn não encontrado após', maxAttempts, 'tentativas');
      }
      return false;
    };
    
    setTimeout(tryBind, 1500);
  }

  bindFreeProShare() {
    let attempts = 0;
    const maxAttempts = 15;
    
    const tryBind = () => {
      attempts++;
      
      try {
        const iframe = document.getElementById('calc2frame');
        if (iframe?.contentDocument) {
          const freeBtn = iframe.contentDocument.getElementById('shareBtn');
          
          if (freeBtn) {
            freeBtn.onclick = () => {
              if (this.shareUI) {
                this.shareUI.share('freepro');
              } else if (window.parent?.SharkGreen?.shareUI) {
                window.parent.SharkGreen.shareUI.share('freepro');
              } else {
                console.error('ShareUI não disponível');
              }
            };
            console.log('✅ Botão FreePro vinculado');
            return true;
          }
        }
      } catch (e) {
        // Esperado durante carregamento
      }
      
      if (attempts < maxAttempts) {
        setTimeout(tryBind, 1000);
      } else {
        console.warn('⚠️ Botão shareBtn (FreePro) não encontrado após', maxAttempts, 'tentativas');
      }
      return false;
    };
    
    setTimeout(tryBind, 3500);
  }

  removeLoadingScreen() {
    const loadingContainers = [
      document.querySelector('.loading-container'),
      document.querySelector('.post-login-loading')
    ];
    
    loadingContainers.forEach(container => {
      if (container) {
        container.remove();
      }
    });
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
    window.SharkGreen = app; // Para debug global
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
