// assets/js/ui/navigation.js
// Sistema de navegação entre páginas (Calculadora, Sobre, Contato)

export class Navigation {
  constructor() {
    this.currentPage = 'calculadora';
    this.pages = {
      calculadora: 'Calculadoras',
      sobre: 'Sobre',
      contato: 'Contato'
    };
  }

  init() {
    this.createNavigation();
    this.bindEvents();
  }

  createNavigation() {
    // Cria a navegação no header
    const headerControls = document.querySelector('.header-controls');
    if (!headerControls) return;

    // Cria container de navegação
    const navContainer = document.createElement('div');
    navContainer.className = 'main-navigation';
    navContainer.innerHTML = `
      <div class="nav-tabs">
        <button class="nav-tab active" data-page="calculadora">Calculadora</button>
        <button class="nav-tab" data-page="sobre">Sobre</button>
        <button class="nav-tab" data-page="contato">Contato</button>
      </div>
    `;

    // Insere antes dos controles de tema
    headerControls.insertBefore(navContainer, headerControls.firstChild);
  }

  bindEvents() {
    document.addEventListener('click', (e) => {
      const navTab = e.target.closest('.nav-tab');
      if (navTab) {
        const page = navTab.dataset.page;
        this.navigateTo(page);
      }
    });
  }

  navigateTo(page) {
    if (!this.pages[page] || page === this.currentPage) return;

    // Atualiza tabs ativos
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.page === page);
    });

    // Atualiza conteúdo
    this.currentPage = page;
    this.renderPage(page);
  }

  renderPage(page) {
    const container = document.getElementById('app-container');
    if (!container) return;

    switch (page) {
      case 'calculadora':
        this.renderCalculadoraPage(container);
        break;
      case 'sobre':
        this.renderSobrePage(container);
        break;
      case 'contato':
        this.renderContatoPage(container);
        break;
    }
  }

  renderCalculadoraPage(container) {
    // Recarrega as calculadoras
    if (window.SharkGreen) {
      window.SharkGreen.loadMainApp();
    }
  }

  renderSobrePage(container) {
  container.innerHTML = `
    <div class="page-container">
      <!-- Revolutionary Hero Section -->
      <div class="revolutionary-hero">
        <div class="hero-background-animation">
          <div class="floating-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
            <div class="shape shape-4"></div>
            <div class="shape shape-5"></div>
          </div>
        </div>
        <div class="container">
          <div class="hero-content-revolutionary">
            <div class="hero-badge">🦈 SHARK GREEN TECHNOLOGY</div>
            <h1 class="hero-title-revolutionary">
              <span class="text-gradient">Revolução</span> em 
              <span class="text-neon">Arbitragem Esportiva</span>
            </h1>
            <p class="hero-description-revolutionary">
              Descubra a próxima geração de ferramentas de análise quantitativa. 
              Nossos algoritmos de machine learning transformam dados em lucro garantido.
            </p>
            <div class="hero-stats">
              <div class="stat-item">
                <div class="stat-number">99.7%</div>
                <div class="stat-label">Precisão</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">0.2s</div>
                <div class="stat-label">Velocidade</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">24/7</div>
                <div class="stat-label">Disponível</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Revolutionary Features Grid -->
      <div class="revolutionary-features">
        <div class="container">
          <div class="section-header-revolutionary">
            <h2 class="section-title-revolutionary">Tecnologias de Vanguarda</h2>
            <p class="section-subtitle-revolutionary">
              Cada funcionalidade foi desenvolvida para superar os limites do possível
            </p>
          </div>

          <div class="features-grid-revolutionary">
            <!-- Feature 1 - AI Powered -->
            <div class="feature-card-revolutionary feature-ai" data-feature="ai">
              <div class="feature-glow"></div>
              <div class="feature-icon-revolutionary">
                <div class="icon-brain">🧠</div>
                <div class="ai-particles">
                  <span></span><span></span><span></span>
                </div>
              </div>
              <div class="feature-content-revolutionary">
                <h3 class="feature-title-revolutionary">Inteligência Artificial</h3>
                <p class="feature-description-revolutionary">
                  Algoritmos neurais avançados analisam milhões de cenários simultaneamente, 
                  identificando oportunidades invisíveis ao olho humano.
                </p>
                <div class="feature-metrics">
                  <div class="metric">
                    <span class="metric-value">1M+</span>
                    <span class="metric-label">Cálculos/seg</span>
                  </div>
                </div>
              </div>
              <div class="feature-hover-effect"></div>
            </div>

            <!-- Feature 2 - Real Time -->
            <div class="feature-card-revolutionary feature-realtime" data-feature="realtime">
              <div class="feature-glow"></div>
              <div class="feature-icon-revolutionary">
                <div class="icon-lightning">⚡</div>
                <div class="lightning-effects">
                  <div class="lightning-bolt"></div>
                </div>
              </div>
              <div class="feature-content-revolutionary">
                <h3 class="feature-title-revolutionary">Processamento Quântico</h3>
                <p class="feature-description-revolutionary">
                  Atualizações em tempo real com latência inferior a milissegundos. 
                  Seus cálculos acontecem antes mesmo de você terminar de digitar.
                </p>
                <div class="feature-metrics">
                  <div class="metric">
                    <span class="metric-value">0.002s</span>
                    <span class="metric-label">Latência</span>
                  </div>
                </div>
              </div>
              <div class="feature-hover-effect"></div>
            </div>

            <!-- Feature 3 - Security -->
            <div class="feature-card-revolutionary feature-security" data-feature="security">
              <div class="feature-glow"></div>
              <div class="feature-icon-revolutionary">
                <div class="icon-shield">🛡️</div>
                <div class="security-grid">
                  <div class="grid-dot"></div>
                  <div class="grid-dot"></div>
                  <div class="grid-dot"></div>
                  <div class="grid-dot"></div>
                </div>
              </div>
              <div class="feature-content-revolutionary">
                <h3 class="feature-title-revolutionary">Fortaleza Digital</h3>
                <p class="feature-description-revolutionary">
                  Criptografia militar de 256 bits protege cada operação. 
                  Seus dados nunca saem do seu dispositivo - privacidade absoluta.
                </p>
                <div class="feature-metrics">
                  <div class="metric">
                    <span class="metric-value">256-bit</span>
                    <span class="metric-label">Criptografia</span>
                  </div>
                </div>
              </div>
              <div class="feature-hover-effect"></div>
            </div>

            <!-- Feature 4 - Analytics -->
            <div class="feature-card-revolutionary feature-analytics" data-feature="analytics">
              <div class="feature-glow"></div>
              <div class="feature-icon-revolutionary">
                <div class="icon-chart">📊</div>
                <div class="chart-animation">
                  <div class="chart-bar" style="height: 40%"></div>
                  <div class="chart-bar" style="height: 70%"></div>
                  <div class="chart-bar" style="height: 55%"></div>
                  <div class="chart-bar" style="height: 85%"></div>
                </div>
              </div>
              <div class="feature-content-revolutionary">
                <h3 class="feature-title-revolutionary">Analytics Avançado</h3>
                <p class="feature-description-revolutionary">
                  Visualizações interativas revelam padrões ocultos nos mercados. 
                  Dashboards adaptativos que evoluem com sua estratégia.
                </p>
                <div class="feature-metrics">
                  <div class="metric">
                    <span class="metric-value">360°</span>
                    <span class="metric-label">Análise</span>
                  </div>
                </div>
              </div>
              <div class="feature-hover-effect"></div>
            </div>

            <!-- Feature 5 - Automation -->
            <div class="feature-card-revolutionary feature-automation" data-feature="automation">
              <div class="feature-glow"></div>
              <div class="feature-icon-revolutionary">
                <div class="icon-robot">🤖</div>
                <div class="automation-gears">
                  <div class="gear gear-1"></div>
                  <div class="gear gear-2"></div>
                </div>
              </div>
              <div class="feature-content-revolutionary">
                <h3 class="feature-title-revolutionary">Automação Inteligente</h3>
                <p class="feature-description-revolutionary">
                  Robôs especializados executam suas estratégias 24/7. 
                  Otimização contínua que aprende com cada operação realizada.
                </p>
                <div class="feature-metrics">
                  <div class="metric">
                    <span class="metric-value">24/7</span>
                    <span class="metric-label">Ativo</span>
                  </div>
                </div>
              </div>
              <div class="feature-hover-effect"></div>
            </div>

            <!-- Feature 6 - Innovation -->
            <div class="feature-card-revolutionary feature-innovation" data-feature="innovation">
              <div class="feature-glow"></div>
              <div class="feature-icon-revolutionary">
                <div class="icon-rocket">🚀</div>
                <div class="rocket-trail">
                  <div class="trail-particle"></div>
                  <div class="trail-particle"></div>
                  <div class="trail-particle"></div>
                </div>
              </div>
              <div class="feature-content-revolutionary">
                <h3 class="feature-title-revolutionary">Inovação Perpétua</h3>
                <p class="feature-description-revolutionary">
                  Atualizações semanais com novas funcionalidades. 
                  Sempre um passo à frente da concorrência com tecnologia de ponta.
                </p>
                <div class="feature-metrics">
                  <div class="metric">
                    <span class="metric-value">52x</span>
                    <span class="metric-label">Updates/ano</span>
                  </div>
                </div>
              </div>
              <div class="feature-hover-effect"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Revolutionary Technology Showcase -->
      <div class="tech-showcase">
        <div class="container">
          <div class="showcase-content">
            <div class="showcase-text">
              <h2 class="showcase-title">
                Construído para o <span class="text-highlight">Futuro</span>
              </h2>
              <p class="showcase-description">
                Nossa infraestrutura combina computação em nuvem, edge computing 
                e blockchain para criar a experiência mais avançada do mercado.
              </p>
              <div class="tech-badges">
                <div class="tech-badge">
                  <span class="badge-icon">⚛️</span>
                  <span class="badge-text">React 18</span>
                </div>
                <div class="tech-badge">
                  <span class="badge-icon">🔥</span>
                  <span class="badge-text">WebAssembly</span>
                </div>
                <div class="tech-badge">
                  <span class="badge-icon">🌐</span>
                  <span class="badge-text">Edge Computing</span>
                </div>
                <div class="tech-badge">
                  <span class="badge-icon">🔗</span>
                  <span class="badge-text">Blockchain</span>
                </div>
              </div>
            </div>
            <div class="showcase-visual">
              <div class="hologram-container">
                <div class="hologram-circle">
                  <div class="hologram-ring ring-1"></div>
                  <div class="hologram-ring ring-2"></div>
                  <div class="hologram-ring ring-3"></div>
                  <div class="hologram-center">🦈</div>
                </div>
                <div class="hologram-particles">
                  <div class="particle"></div>
                  <div class="particle"></div>
                  <div class="particle"></div>
                  <div class="particle"></div>
                  <div class="particle"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Revolutionary CTA -->
      <div class="revolutionary-cta">
        <div class="cta-background">
          <div class="cta-waves">
            <div class="wave wave-1"></div>
            <div class="wave wave-2"></div>
            <div class="wave wave-3"></div>
          </div>
        </div>
        <div class="container">
          <div class="cta-content-revolutionary">
            <h2 class="cta-title">Pronto para Dominar os Mercados?</h2>
            <p class="cta-subtitle">
              Junte-se à elite de traders que já descobriram o futuro da arbitragem
            </p>
            <button class="btn-revolutionary" onclick="window.SharkGreen.getModules().navigation.navigateTo('calculadora')">
              <span class="btn-text">🎯 Iniciar Jornada</span>
              <div class="btn-glow"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Inicializa animações
  this.initRevolutionaryAnimations();
}

  renderContatoPage(container) {
    container.innerHTML = `
      <div class="page-container">
        <!-- Contact Hero -->
        <div class="contact-hero">
          <div class="container">
            <h1 class="hero-title">Entre em Contato</h1>
            <p class="hero-subtitle">
              Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo 
              ou envie sua mensagem diretamente.
            </p>
          </div>
        </div>

        <div class="container">
          <div class="contact-content">
            <!-- Contact Cards -->
            <div class="contact-cards">
              <div class="contact-card">
                <div class="contact-icon">📧</div>
                <h3>E-mail</h3>
                <p>suporte@sharkgreen.com.br</p>
                <a href="mailto:suporte@sharkgreen.com.br" class="btn btn-secondary">
                  Enviar E-mail
                </a>
              </div>

              <div class="contact-card">
                <div class="contact-icon">💬</div>
                <h3>WhatsApp</h3>
                <p>+55 (11) 99999-9999</p>
                <a href="https://wa.me/5511999999999" target="_blank" class="btn btn-secondary">
                  Abrir WhatsApp
                </a>
              </div>

              <div class="contact-card">
                <div class="contact-icon">📱</div>
                <h3>Telegram</h3>
                <p>@SharkGreenSuport</p>
                <a href="https://t.me/SharkGreenSuport" target="_blank" class="btn btn-secondary">
                  Abrir Telegram
                </a>
              </div>

              <div class="contact-card">
                <div class="contact-icon">🌐</div>
                <h3>Discord</h3>
                <p>Comunidade Shark Green</p>
                <a href="#" class="btn btn-secondary">
                  Entrar no Discord
                </a>
              </div>
            </div>

            <!-- Contact Form -->
            <div class="contact-form-section">
              <div class="form-container">
                <h2>Envie sua Mensagem</h2>
                <form class="contact-form" id="contactForm">
                  <div class="form-grid">
                    <div class="form-group">
                      <label class="form-label" for="contactName">Nome Completo</label>
                      <input type="text" id="contactName" class="form-input" required>
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="contactEmail">E-mail</label>
                      <input type="email" id="contactEmail" class="form-input" required>
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label" for="contactSubject">Assunto</label>
                    <select id="contactSubject" class="form-select" required>
                      <option value="">Selecione um assunto</option>
                      <option value="suporte">Suporte Técnico</option>
                      <option value="sugestao">Sugestão de Melhoria</option>
                      <option value="bug">Relatar Bug</option>
                      <option value="parceria">Parceria</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                  
                  <div class="form-group">
                    <label class="form-label" for="contactMessage">Mensagem</label>
                    <textarea id="contactMessage" class="form-textarea" rows="5" 
                              placeholder="Descreva sua dúvida, sugestão ou problema..." required></textarea>
                  </div>
                  
                  <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                      📤 Enviar Mensagem
                    </button>
                    <button type="reset" class="btn btn-secondary">
                      🗑️ Limpar
                    </button>
                  </div>
                </form>
              </div>

              <!-- FAQ Section -->
              <div class="faq-container">
                <h2>Perguntas Frequentes</h2>
                <div class="faq-list">
                  <div class="faq-item">
                    <div class="faq-question">
                      <span>Como funcionam as calculadoras?</span>
                      <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer hidden">
                      <p>Nossas calculadoras utilizam algoritmos matemáticos avançados para calcular automaticamente as distribuições de stake ideais para arbitragem e otimização de freebets.</p>
                    </div>
                  </div>

                  <div class="faq-item">
                    <div class="faq-question">
                      <span>É seguro usar as calculadoras?</span>
                      <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer hidden">
                      <p>Sim! Todos os cálculos são feitos localmente no seu navegador. Nenhum dado é enviado para nossos servidores, garantindo total privacidade.</p>
                    </div>
                  </div>

                  <div class="faq-item">
                    <div class="faq-question">
                      <span>Posso usar no celular?</span>
                      <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer hidden">
                      <p>Claro! Nossa interface é totalmente responsiva e funciona perfeitamente em smartphones, tablets e computadores.</p>
                    </div>
                  </div>

                  <div class="faq-item">
                    <div class="faq-question">
                      <span>Como compartilhar configurações?</span>
                      <span class="faq-toggle">+</span>
                    </div>
                    <div class="faq-answer hidden">
                      <p>Use o botão "🔗 Compartilhar" em cada calculadora para gerar links seguros que preservam todas as suas configurações.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Adiciona funcionalidade ao FAQ
    this.initFAQ();
    this.initContactForm();
  }

  initFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
      question.addEventListener('click', () => {
        const item = question.parentElement;
        const answer = item.querySelector('.faq-answer');
        const toggle = question.querySelector('.faq-toggle');

        // Toggle answer
        answer.classList.toggle('hidden');
        
        // Update toggle icon
        toggle.textContent = answer.classList.contains('hidden') ? '+' : '−';
        
        // Close others (optional - accordion behavior)
        document.querySelectorAll('.faq-item').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.querySelector('.faq-answer').classList.add('hidden');
            otherItem.querySelector('.faq-toggle').textContent = '+';
          }
        });
      });
    });
  }

  initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simula envio do formulário
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      console.log('Dados do formulário:', data);
      
      // Feedback visual
      this.showContactSuccess();
      
      // Reset form
      form.reset();
    });
  }

  showContactSuccess() {
    // Reutiliza o sistema de toast do ShareUI
    if (window.SharkGreen?.getModules()?.shareUI) {
      window.SharkGreen.getModules().shareUI.showSuccess(
        'Mensagem enviada com sucesso! Entraremos em contato em breve. 📧'
      );
    } else {
      alert('Mensagem enviada com sucesso!');
    }
  }
}
