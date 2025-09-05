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

initRevolutionaryAnimations() {
  // Animação das formas flutuantes
  const shapes = document.querySelectorAll('.shape');
  shapes.forEach((shape, index) => {
    const duration = 8 + index * 2;
    const delay = index * 0.5;
    shape.style.animationDuration = `${duration}s`;
    shape.style.animationDelay = `${delay}s`;
  });

  // Animação hover nos cards
  const featureCards = document.querySelectorAll('.feature-card-revolutionary');
  featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.classList.add('active');
    });
    
    card.addEventListener('mouseleave', () => {
      card.classList.remove('active');
    });
  });

  // Animação de typing no título
  this.typeWriterEffect();

  // Scroll reveal animations
  this.initScrollReveal();
}

typeWriterEffect() {
  const titleElement = document.querySelector('.hero-title-revolutionary');
  if (!titleElement) return;

  const text = titleElement.innerHTML;
  titleElement.innerHTML = '';
  titleElement.style.opacity = '1';

  let index = 0;
  const speed = 50;

  function typeChar() {
    if (index < text.length) {
      titleElement.innerHTML += text.charAt(index);
      index++;
      setTimeout(typeChar, speed);
    }
  }

  setTimeout(typeChar, 1000);
}

initScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
      }
    });
  }, observerOptions);

  // Observa todos os elementos que devem ser revelados
  const elementsToReveal = document.querySelectorAll(
    '.feature-card-revolutionary, .tech-showcase, .revolutionary-cta'
  );
  
  elementsToReveal.forEach(el => {
    el.classList.add('hidden-initially');
    observer.observe(el);
  });
}

  renderContatoPage(container) {
  container.innerHTML = `
    <div class="page-container">
      <!-- Contact Hero Revolucionário -->
      <div class="contact-hero-revolutionary">
        <div class="contact-background">
          <div class="contact-grid-bg">
            <div class="grid-line"></div>
            <div class="grid-line"></div>
            <div class="grid-line"></div>
            <div class="grid-line"></div>
          </div>
          <div class="contact-orbs">
            <div class="orb orb-1"></div>
            <div class="orb orb-2"></div>
            <div class="orb orb-3"></div>
          </div>
        </div>
        <div class="container">
          <div class="contact-hero-content">
            <div class="contact-badge">💬 CANAL DIRETO</div>
            <h1 class="contact-title">
              Conecte-se ao <span class="text-cyber">Futuro</span>
            </h1>
            <p class="contact-subtitle">
              Nossa equipe de especialistas está online 24/7 para revolucionar sua experiência
            </p>
            <div class="contact-status">
              <div class="status-indicator"></div>
              <span>Sistema Online • Resposta Instantânea</span>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="contact-main-content">
          <!-- Canais de Contato Futuristas -->
          <div class="contact-channels">
            <h2 class="channels-title">Canais de Comunicação</h2>
            <div class="channels-grid">
              
              <!-- WhatsApp -->
              <div class="channel-card whatsapp-card">
                <div class="channel-bg"></div>
                <div class="channel-icon">
                  <div class="icon-container">📱</div>
                  <div class="icon-pulse"></div>
                </div>
                <div class="channel-content">
                  <h3 class="channel-name">WhatsApp Business</h3>
                  <p class="channel-description">Chat direto com IA + Humanos</p>
                  <div class="channel-info">
                    <span class="info-item">
                      <span class="info-icon">⚡</span>
                      Resposta em 30s
                    </span>
                    <span class="info-item">
                      <span class="info-icon">🤖</span>
                      IA Integrada
                    </span>
                  </div>
                  <button class="channel-btn" onclick="window.open('https://wa.me/5511999999999', '_blank')">
                    <span class="btn-text">Iniciar Chat</span>
                    <div class="btn-ripple"></div>
                  </button>
                </div>
                <div class="card-glow"></div>
              </div>

              <!-- Discord -->
              <div class="channel-card discord-card">
                <div class="channel-bg"></div>
                <div class="channel-icon">
                  <div class="icon-container">🎮</div>
                  <div class="icon-pulse"></div>
                </div>
                <div class="channel-content">
                  <h3 class="channel-name">Comunidade Discord</h3>
                  <p class="channel-description">Hub de traders avançados</p>
                  <div class="channel-info">
                    <span class="info-item">
                      <span class="info-icon">👥</span>
                      5.2k+ Membros
                    </span>
                    <span class="info-item">
                      <span class="info-icon">🚀</span>
                      Sala VIP
                    </span>
                  </div>
                  <button class="channel-btn">
                    <span class="btn-text">Entrar Server</span>
                    <div class="btn-ripple"></div>
                  </button>
                </div>
                <div class="card-glow"></div>
              </div>

              <!-- Telegram -->
              <div class="channel-card telegram-card">
                <div class="channel-bg"></div>
                <div class="channel-icon">
                  <div class="icon-container">✈️</div>
                  <div class="icon-pulse"></div>
                </div>
                <div class="channel-content">
                  <h3 class="channel-name">Telegram Premium</h3>
                  <p class="channel-description">Sinais e alertas em tempo real</p>
                  <div class="channel-info">
                    <span class="info-item">
                      <span class="info-icon">📊</span>
                      Live Alerts
                    </span>
                    <span class="info-item">
                      <span class="info-icon">🔔</span>
                      Push Notify
                    </span>
                  </div>
                  <button class="channel-btn" onclick="window.open('https://t.me/SharkGreenSuport', '_blank')">
                    <span class="btn-text">Acessar Canal</span>
                    <div class="btn-ripple"></div>
                  </button>
                </div>
                <div class="card-glow"></div>
              </div>

              <!-- Email -->
              <div class="channel-card email-card">
                <div class="channel-bg"></div>
                <div class="channel-icon">
                  <div class="icon-container">📧</div>
                  <div class="icon-pulse"></div>
                </div>
                <div class="channel-content">
                  <h3 class="channel-name">E-mail Corporativo</h3>
                  <p class="channel-description">Suporte técnico especializado</p>
                  <div class="channel-info">
                    <span class="info-item">
                      <span class="info-icon">🎯</span>
                      Prioridade Alta
                    </span>
                    <span class="info-item">
                      <span class="info-icon">📋</span>
                      Tickets
                    </span>
                  </div>
                  <button class="channel-btn" onclick="window.open('mailto:suporte@sharkgreen.com.br', '_blank')">
                    <span class="btn-text">Enviar E-mail</span>
                    <div class="btn-ripple"></div>
                  </button>
                </div>
                <div class="card-glow"></div>
              </div>
            </div>
          </div>

          <!-- Formulário Futurista -->
          <div class="contact-form-revolutionary">
            <div class="form-header">
              <h2 class="form-title">Mensagem Direta</h2>
              <p class="form-subtitle">IA analisa e roteia automaticamente sua solicitação</p>
            </div>
            
            <form class="cyber-form" id="contactForm">
              <div class="form-scanning">
                <div class="scan-line"></div>
                <div class="scan-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
              
              <div class="form-row">
                <div class="cyber-input-group">
                  <input type="text" id="contactName" class="cyber-input" required>
                  <label class="cyber-label">Nome Completo</label>
                  <div class="input-border"></div>
                  <div class="input-focus"></div>
                </div>
                <div class="cyber-input-group">
                  <input type="email" id="contactEmail" class="cyber-input" required>
                  <label class="cyber-label">E-mail</label>
                  <div class="input-border"></div>
                  <div class="input-focus"></div>
                </div>
              </div>
              
              <div class="cyber-input-group">
                <select id="contactSubject" class="cyber-select" required>
                  <option value="">Selecione o Tipo</option>
                  <option value="suporte">🔧 Suporte Técnico</option>
                  <option value="parceria">🤝 Parceria Estratégica</option>
                  <option value="feedback">💡 Feedback & Sugestões</option>
                  <option value="bug">🐛 Report de Bug</option>
                  <option value="feature">⭐ Solicitação de Feature</option>
                  <option value="outro">💬 Outro Assunto</option>
                </select>
                <label class="cyber-label">Categoria</label>
                <div class="input-border"></div>
                <div class="input-focus"></div>
              </div>
              
              <div class="cyber-input-group">
                <textarea id="contactMessage" class="cyber-textarea" rows="5" required
                          placeholder="Descreva sua necessidade com detalhes..."></textarea>
                <label class="cyber-label">Mensagem</label>
                <div class="input-border"></div>
                <div class="input-focus"></div>
              </div>
              
              <div class="form-ai-analysis">
                <div class="ai-indicator">
                  <div class="ai-avatar">🤖</div>
                  <div class="ai-status">
                    <span class="ai-text">IA analisando mensagem...</span>
                    <div class="ai-progress">
                      <div class="progress-bar"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="form-actions-revolutionary">
                <button type="submit" class="cyber-submit-btn">
                  <span class="btn-icon">🚀</span>
                  <span class="btn-text">Enviar Mensagem</span>
                  <div class="btn-loading">
                    <div class="loading-ring"></div>
                  </div>
                  <div class="btn-success">✅</div>
                </button>
                <button type="reset" class="cyber-reset-btn">
                  <span class="btn-icon">🗑️</span>
                  <span class="btn-text">Limpar Tudo</span>
                </button>
              </div>
            </form>
          </div>

          <!-- FAQ Inteligente -->
          <div class="faq-revolutionary">
            <div class="faq-header">
              <h2 class="faq-title">Central de Conhecimento</h2>
              <p class="faq-subtitle">Respostas instantâneas alimentadas por IA</p>
            </div>
            
            <div class="faq-search">
              <div class="search-container">
                <input type="text" class="search-input" placeholder="Buscar dúvidas..." id="faqSearch">
                <div class="search-icon">🔍</div>
                <div class="search-ai">🤖</div>
              </div>
            </div>

            <div class="faq-categories">
              <button class="faq-category active" data-category="all">
                <span class="category-icon">📚</span>
                Todas
              </button>
              <button class="faq-category" data-category="calculadoras">
                <span class="category-icon">🧮</span>
                Calculadoras
              </button>
              <button class="faq-category" data-category="conta">
                <span class="category-icon">👤</span>
                Conta
              </button>
              <button class="faq-category" data-category="tecnico">
                <span class="category-icon">⚙️</span>
                Técnico
              </button>
            </div>

            <div class="faq-list-revolutionary" id="faqList">
              <!-- FAQ items serão inseridos aqui -->
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Inicializa funcionalidades
  this.initRevolutionaryContact();
  this.initCyberForm();
  this.initIntelligentFAQ();
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
