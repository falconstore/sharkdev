// assets/js/main.js - VERSÃO CORRIGIDA PARA FREEPRO
// Controlador principal da aplicação

import { Theme } from './ui/theme.js';
import { TabSystem } from './ui/tabs.js';
import { ArbiPro } from './calculators/arbipro.js';
import { FreePro } from './calculators/freepro.js';

class App {
  constructor() {
    this.theme = new Theme();
    this.tabSystem = null;
    this.arbiPro = null;
    this.freePro = null;
    this.navigation = null;
    this.shareUI = null;
    this.initialized = false;
  }

  async init() {
    try {
      console.log('🚀 Iniciando Calculadoras Shark 100% Green...');
      
      // Inicializa tema primeiro
      this.theme.init();
      console.log('✅ Tema inicializado');
      
      // Carrega módulos opcionais de forma segura
      await this.loadOptionalModules();
      
      // Carrega aplicação principal
      await this.loadMainApp();
      
      this.initialized = true;
      console.log('🎉 Calculadoras Shark 100% Green inicializadas com sucesso');
      
    } catch (error) {
      console.error('❌ Erro ao inicializar app:', error);
      this.showError('Erro ao inicializar aplicação: ' + error.message);
      throw error; // Re-throw para tratamento no index.html
    }
  }

  async loadOptionalModules() {
    console.log('📦 Carregando módulos opcionais...');
    
    // Carrega Navigation de forma segura
    try {
      const { Navigation } = await import('./ui/navigation.js');
      this.navigation = new Navigation();
      this.navigation.init();
      console.log('✅ Navigation carregado');
    } catch (e) {
      console.warn('⚠️ Navigation não disponível:', e.message);
    }

    // Carrega ShareUI de forma segura
    try {
      const { ShareUI } = await import('./ui/shareui.js');
      this.shareUI = new ShareUI();
      this.shareUI.init();
      console.log('✅ ShareUI carregado');
    } catch (e) {
      console.warn('⚠️ ShareUI não disponível:', e.message);
    }
  }

  async loadMainApp() {
    try {
      console.log('🎯 Carregando interface principal...');
      
      // Mostra loading específico
      this.showLoadingScreen();
      
      // Aguarda um pouco para UX
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const container = document.getElementById('app-container');
      if (!container) {
        throw new Error('Container app-container não encontrado no DOM');
      }

      // Template com navegação condicional
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
      console.log('✅ HTML principal inserido');

      // Inicializa sistema de abas PRIMEIRO
      console.log('🔄 Inicializando sistema de abas...');
      this.tabSystem = new TabSystem();
      this.tabSystem.init();
      console.log('✅ Sistema de abas inicializado');

      // Inicializa calculadoras
      console.log('🧮 Inicializando calculadoras...');
      
      // ArbiPro
      this.arbiPro = new ArbiPro();
      await this.arbiPro.init();
      console.log('✅ ArbiPro inicializada');
      
      // FreePro - com verificação adicional
      this.freePro = new FreePro();
      this.freePro.init();
      console.log('✅ FreePro inicializada');
      
      // Verifica se iframe existe
      const iframe = document.getElementById('calc2frame');
      if (!iframe) {
        console.error('❌ Iframe calc2frame não encontrado!');
        throw new Error('Iframe da FreePro não foi criado corretamente');
      }
      console.log('✅ Iframe FreePro encontrado:', iframe);
      
      // Carrega configuração compartilhada se disponível
      if (this.shareUI && this.shareUI.loadSharedConfig) {
        setTimeout(() => {
          try {
            this.shareUI.loadSharedConfig();
            console.log('✅ Configuração compartilhada carregada');
          } catch (e) {
            console.warn('⚠️ Erro ao carregar configuração compartilhada:', e);
          }
        }, 1500);
      }
      
      // Adiciona botões de compartilhamento se disponível
      if (this.shareUI && this.shareUI.createShareButton) {
        setTimeout(() => {
          try {
            this.addShareButtons();
            console.log('✅ Botões de compartilhamento adicionados');
          } catch (e) {
            console.warn('⚠️ Erro ao adicionar botões de compartilhamento:', e);
          }
        }, 2000);
      }
      
      console.log('🎉 Aplicação carregada com sucesso');
      
    } catch (error) {
      console.error('❌ Erro ao carregar aplicação principal:', error);
      this.showError('Erro ao carregar calculadoras: ' + error.message);
      throw error;
    }
  }

  addShareButtons() {
    if (!this.shareUI || !this.shareUI.createShareButton) return;
    
    try {
      // Conecta o botão existente do ArbiPro ao sistema de compartilhamento
      const shareBtn = document.getElementById('shareBtn');
      if (shareBtn) {
        shareBtn.addEventListener('click', () => {
          if (this.shareUI.handleShareClick) {
            this.shareUI.handleShareClick('arbipro');
          }
        });
        console.log('✅ Botão ArbiPro conectado ao sistema de compartilhamento');
      }

      // Adiciona botão no FreePro (dentro do iframe)
      this.setupFreeProShareButton();

    } catch (error) {
      console.warn('⚠️ Erro ao configurar botões de compartilhamento:', error);
    }
  }

  setupFreeProShareButton() {
    if (!this.shareUI) return;
    
    let attempts = 0;
    const maxAttempts = 15; // Aumentei tentativas
    
    const tryAddButton = () => {
      attempts++;
      
      try {
        const iframe = document.getElementById('calc2frame');
        if (iframe && iframe.contentDocument && iframe.contentDocument.body) {
          const doc = iframe.contentDocument;
          const actions = doc.querySelector('.actions');
          const existingShareBtn = doc.querySelector('.btn-share');
          
          if (actions && !existingShareBtn) {
            const shareBtn = doc.createElement('button');
            shareBtn.className = 'btn btn-share';
            shareBtn.innerHTML = '🔗 Compartilhar';
            shareBtn.style.cssText = `
              background: linear-gradient(135deg, #8b5cf6, #3b82f6) !important;
              color: white !important;
              margin-top: 0.75rem !important;
              border: none !important;
              border-radius: 8px !important;
              padding: 0.75rem 1rem !important;
              font-size: 0.875rem !important;
              font-weight: 600 !important;
              cursor: pointer !important;
              transition: all 0.2s ease !important;
            `;
            
            shareBtn.addEventListener('click', () => {
              if (this.shareUI.handleShareClick) {
                this.shareUI.handleShareClick('freepro');
              }
            });
            
            actions.appendChild(shareBtn);
            console.log('✅ Botão FreePro adicionado com sucesso');
            return true; // Sucesso
          }
        }
      } catch (e) {
        // Ignora erros de acesso ao iframe
        console.log(`Tentativa ${attempts}/${maxAttempts} - iframe ainda não acessível`);
      }
      
      if (attempts < maxAttempts) {
        setTimeout(tryAddButton, 1000); // Aumentei intervalo
      } else {
        console.warn('⚠️ Não foi possível adicionar botão de compartilhamento ao FreePro após', maxAttempts, 'tentativas');
      }
      
      return false;
    };
    
    // Inicia tentativas com delay inicial
    setTimeout(tryAddButton, 2000);
  }

  showLoadingScreen() {
    const container = document.getElementById('app-container');
    if (container) {
      container.innerHTML = `
        <div class="post-login-loading">
          <div class="post-login-content">
            <div class="post-login-title">🦈 Shark 100% Green</div>
            <div class="post-login-spinner"></div>
            <div class="post-login-message">Carregando calculadoras profissionais...</div>
          </div>
        </div>
      `;
    }
  }

  showError(message) {
    console.error('💥 Mostrando erro:', message);
    const container = document.getElementById('app-container');
    if (container) {
      container.innerHTML = `
        <div class="container" style="text-align: center; margin-top: 2rem;">
          <div class="card" style="max-width: 600px; margin: 0 auto; padding: 2rem;">
            <h2 style="color: var(--danger); margin-bottom: 1rem;">⚠️ Erro na Aplicação</h2>
            <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6;">${message}</p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <button onclick="location.reload()" class="btn btn-primary">
                🔄 Recarregar Página
              </button>
              <button onclick="console.clear(); this.parentElement.parentElement.parentElement.style.display='none'" class="btn btn-secondary">
                ✖️ Fechar Erro
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }

  // Métodos públicos para debug e acesso externo
  getModules() {
    return {
      theme: this.theme,
      navigation: this.navigation,
      tabSystem: this.tabSystem,
      arbiPro: this.arbiPro,
      freePro: this.freePro,
      shareUI: this.shareUI,
      initialized: this.initialized
    };
  }

  // Método para forçar reinicialização
  async restart() {
    console.log('🔄 Reiniciando aplicação...');
    try {
      this.initialized = false;
      await this.init();
    } catch (error) {
      console.error('❌ Erro ao reiniciar:', error);
      throw error;
    }
  }
}

// Inicializa app quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('📄 DOM carregado, inicializando aplicação...');
    
    const app = new App();
    window.SharkGreen = app; // Para debug global e acesso do iframe
    
    await app.init();
    
    console.log('🎯 Aplicação totalmente inicializada!');
    
  } catch (error) {
    console.error('💥 Erro crítico na inicialização:', error);
    
    // Mostra erro detalhado
    if (window.showErrorFallback) {
      window.showErrorFallback(
        'Erro crítico ao inicializar a aplicação. Verifique a console do navegador para mais detalhes.',
        error
      );
    } else {
      // Fallback se função de erro não existir
      document.body.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #dc2626; background: #111827; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
          <div style="max-width: 500px;">
            <h1 style="color: #f59e0b; margin-bottom: 1rem;">❌ Erro Crítico</h1>
            <p style="margin-bottom: 1rem; color: #d1d5db;">Não foi possível inicializar a aplicação.</p>
            <p style="margin-bottom: 2rem; color: #9ca3af; font-size: 0.875rem;">Erro: ${error.message}</p>
            <button onclick="location.reload()" style="padding: 1rem 2rem; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
              🔄 Recarregar Página
            </button>
          </div>
        </div>
      `;
    }
  }
});

// Exporta classe para uso externo se necessário
export { App };
