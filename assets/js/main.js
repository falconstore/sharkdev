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
      
      // Carrega configuração compartilhada da URL
      setTimeout(() => {
        this.loadSharedConfiguration();
      }, 2000);
      
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
            this.shareUI.openShareModal('arbipro');
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
                this.shareUI.openShareModal('freepro');
              } else if (window.parent?.SharkGreen?.shareUI) {
                window.parent.SharkGreen.shareUI.openShareModal('freepro');
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

  async loadSharedConfiguration() {
    try {
      const { ShareSystem } = await import('./utils/share.js');
      const config = ShareSystem.readFromUrl(window.location.href);
      
      if (!config) return;
      
      console.log('🔗 Configuração compartilhada detectada:', config);
      
      // 🔥 CORREÇÃO: Abre a calculadora correta
      if (config.t === 'arbipro') {
        // Garante que está na aba ArbiPro
        const tab1 = document.getElementById('tabBtn1');
        if (tab1) tab1.click();
        
        setTimeout(() => this.loadArbiProConfig(config), 500);
      } else if (config.t === 'freepro') {
        // Garante que está na aba FreePro
        const tab2 = document.getElementById('tabBtn2');
        if (tab2) tab2.click();
        
        setTimeout(() => this.loadFreeProConfig(config), 1500);
      }
      
      // Limpa URL
      const url = new URL(window.location.href);
      url.searchParams.delete('share');
      url.searchParams.delete('s');
      window.history.replaceState({}, document.title, url.toString());
      
    } catch (error) {
      console.error('Erro ao carregar configuração compartilhada:', error);
    }
  }

  loadArbiProConfig(config) {
    if (!this.arbiPro) return;
    
    console.log('📥 Carregando ArbiPro config:', config);
    
    // Define número de casas
    const numHousesSelect = document.getElementById('numHouses');
    if (numHousesSelect && config.n) {
      numHousesSelect.value = config.n;
      numHousesSelect.dispatchEvent(new Event('change'));
    }
    
    // Define arredondamento
    const roundSelect = document.getElementById('rounding');
    if (roundSelect && config.r) {
      roundSelect.value = config.r;
      roundSelect.dispatchEvent(new Event('change'));
    }
    
    setTimeout(() => {
      if (!config.h || !Array.isArray(config.h)) return;
      
      config.h.forEach((house, idx) => {
        // Odd
        const oddInput = document.getElementById(`odd-${idx}`);
        if (oddInput && house.o) {
          oddInput.value = String(house.o).replace('.', ',');
          oddInput.dispatchEvent(new Event('input'));
        }
        
        // 🔥 CORREÇÃO DEFINITIVA: Stake APENAS para casa 0 (fixa)
        if (idx === 0) {
          const stakeInput = document.getElementById(`stake-${idx}`);
          if (stakeInput && house.s) {
            // Remove override manual se existir
            if (this.arbiPro.manualOverrides[idx]) {
              delete this.arbiPro.manualOverrides[idx].stake;
            }
            
            stakeInput.value = String(house.s).replace('.', ',');
            
            // Dispara múltiplos eventos para garantir
            stakeInput.dispatchEvent(new Event('input', { bubbles: true }));
            stakeInput.dispatchEvent(new Event('change', { bubbles: true }));
            
            setTimeout(() => {
              stakeInput.dispatchEvent(new Event('blur', { bubbles: true }));
              
              // Atualiza diretamente no objeto
              if (this.arbiPro.houses[idx]) {
                this.arbiPro.houses[idx].stake = String(house.s).replace('.', ',');
                this.arbiPro.houses[idx].fixedStake = true;
              }
            }, 100);
          }
        }
        
        // 🔥 CORREÇÃO: Comissão - ativa checkbox e define valor
        if (house.c !== null && house.c !== undefined) {
          const commCheck = document.querySelector(`input[data-action="toggleCommission"][data-idx="${idx}"]`);
          if (commCheck && !commCheck.checked) {
            commCheck.checked = true;
            commCheck.dispatchEvent(new Event('change'));
            
            setTimeout(() => {
              const commInput = document.getElementById(`commission-${idx}`);
              if (commInput) {
                commInput.value = String(house.c).replace('.', ',');
                commInput.dispatchEvent(new Event('input'));
              }
            }, 200);
          }
        }
        
        // Freebet
        if (house.f) {
          const fbCheck = document.querySelector(`input[data-action="toggleFreebet"][data-idx="${idx}"]`);
          if (fbCheck && !fbCheck.checked) {
            fbCheck.checked = true;
            fbCheck.dispatchEvent(new Event('change'));
          }
        }
        
        // Aumento de odd
        if (house.i !== null && house.i !== undefined) {
          const incCheck = document.querySelector(`input[data-action="toggleIncrease"][data-idx="${idx}"]`);
          if (incCheck && !incCheck.checked) {
            incCheck.checked = true;
            incCheck.dispatchEvent(new Event('change'));
            
              setTimeout(() => {
              const incInput = document.getElementById(`increase-${idx}`);
              if (incInput) {
                incInput.value = String(house.i).replace('.', ',');
                incInput.dispatchEvent(new Event('input'));
              }
            }, 200);
          }
        }
        
        // 🔥 CORREÇÃO: LAY - clica no botão se necessário
        if (house.l) {
          const layBtn = document.querySelector(`button[data-action="toggleLay"][data-idx="${idx}"]`);
          if (layBtn && !layBtn.classList.contains('active')) {
            layBtn.click();
          }
        }
      });
      
      // Força recálculo FINAL
      setTimeout(() => {
        if (this.arbiPro) {
          this.arbiPro.scheduleUpdate();
        }
      }, 500);
    }, 800);
  }

  loadFreeProConfig(config) {
    console.log('📥 Carregando FreePro config:', config);
    
    const iframe = document.getElementById('calc2frame');
    if (!iframe?.contentDocument) {
      console.warn('Iframe FreePro não disponível ainda');
      return;
    }
    
    const doc = iframe.contentDocument;
    const $ = (id) => doc.getElementById(id);
    
    // 🔥 CORREÇÃO: Define o modo correto (freebet ou cashback)
    const isCashback = config.mode === 'cashback';
    
    if (isCashback) {
      const cashbackBtn = $('modeCashbackBtn');
      if (cashbackBtn && !doc.body.classList.contains('mode-cashback')) {
        cashbackBtn.click();
      }
    } else {
      const freebetBtn = $('modeFreebetBtn');
      if (freebetBtn && doc.body.classList.contains('mode-cashback')) {
        freebetBtn.click();
      }
    }
    
    setTimeout(() => {
      // Número de entradas
      if ($('numEntradas') && config.n) {
        $('numEntradas').value = config.n;
        $('numEntradas').dispatchEvent(new Event('change'));
      }
      
      // Arredondamento
      if ($('round_step') && config.r) {
        $('round_step').value = config.r;
      }
      
      setTimeout(() => {
        const p = config.p || {};
        
        if (isCashback) {
          // Modo Cashback
          if ($('cashback_odd')) $('cashback_odd').value = p.o || '';
          if ($('cashback_comm')) $('cashback_comm').value = p.c || '';
          if ($('cashback_stake')) $('cashback_stake').value = p.s || '';
          if ($('cashback_rate')) $('cashback_rate').value = p.r || '';
        } else {
          // Modo Freebet
          if ($('o1')) $('o1').value = p.o || '';
          if ($('c1')) $('c1').value = p.c || '';
          if ($('s1')) $('s1').value = p.s || '';
          if ($('F')) $('F').value = p.f || '';
          if ($('r')) $('r').value = p.e || 70;
        }
        
        // Coberturas
        setTimeout(() => {
          const cards = doc.querySelectorAll('#oddsContainer > div');
          const cov = config.cov || [];
          
          cov.forEach((c, index) => {
            if (index < cards.length) {
              const card = cards[index];
              const oddInput = card.querySelector('input[data-type="odd"]');
              const commInput = card.querySelector('input[data-type="comm"]');
              const layInput = card.querySelector('input[data-type="lay"]');
              
              if (oddInput) oddInput.value = c.odd || '';
              if (commInput) commInput.value = c.comm || '';
              if (layInput) layInput.checked = c.lay || false;
            }
          });
          
          // Dispara cálculo automático
          const autoCalc = doc.querySelector('.auto-calc');
          if (autoCalc) autoCalc.dispatchEvent(new Event('input'));
        }, 400);
      }, 400);
    }, 300);
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
