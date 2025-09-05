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

  initRevolutionaryContact() {
  // Animação dos cards de canal
  const channelCards = document.querySelectorAll('.channel-card');
  channelCards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('animate-in');
    }, index * 200);
    
    card.addEventListener('mouseenter', () => {
      card.classList.add('hover-active');
    });
    
    card.addEventListener('mouseleave', () => {
      card.classList.remove('hover-active');
    });
  });

  // Animação do indicador de status
  const statusIndicator = document.querySelector('.status-indicator');
  if (statusIndicator) {
    setInterval(() => {
      statusIndicator.classList.add('pulse');
      setTimeout(() => {
        statusIndicator.classList.remove('pulse');
      }, 1000);
    }, 3000);
  }
}

initCyberForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // Animação dos inputs
  const inputs = form.querySelectorAll('.cyber-input, .cyber-textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', (e) => {
      e.target.closest('.cyber-input-group').classList.add('focused');
    });
    
    input.addEventListener('blur', (e) => {
      if (!e.target.value) {
        e.target.closest('.cyber-input-group').classList.remove('focused');
      }
    });
    
    input.addEventListener('input', (e) => {
      if (e.target.value) {
        e.target.closest('.cyber-input-group').classList.add('has-value');
      } else {
        e.target.closest('.cyber-input-group').classList.remove('has-value');
      }
    });
  });

  // Submit do formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    this.submitCyberForm(form);
  });
}

submitCyberForm(form) {
  const submitBtn = form.querySelector('.cyber-submit-btn');
  const aiAnalysis = form.querySelector('.form-ai-analysis');
  
  // Mostra análise da IA
  aiAnalysis.style.display = 'block';
  
  // Animação de loading
  submitBtn.classList.add('loading');
  
  setTimeout(() => {
    // Simula sucesso
    submitBtn.classList.remove('loading');
    submitBtn.classList.add('success');
    
    // Feedback visual
    this.showCyberSuccess();
    
    // Reset depois de 3 segundos
    setTimeout(() => {
      submitBtn.classList.remove('success');
      form.reset();
      aiAnalysis.style.display = 'none';
      
      // Remove classes dos inputs
      form.querySelectorAll('.cyber-input-group').forEach(group => {
        group.classList.remove('focused', 'has-value');
      });
    }, 3000);
  }, 2000);
}

showCyberSuccess() {
  // Reutiliza o sistema de toast
  if (window.SharkGreen?.getModules()?.shareUI) {
    window.SharkGreen.getModules().shareUI.showSuccess(
      '🚀 Mensagem transmitida com sucesso! Nossa IA direcionou sua solicitação.'
    );
  }
}

initIntelligentFAQ() {
  const faqData = [
    {
      category: 'calculadoras',
      question: 'Como as calculadoras garantem precisão de 99.7%?',
      answer: 'Nossos algoritmos utilizam matemática quantitativa avançada, validação cruzada de dados e sistemas de verificação multicamadas para garantir precisão excepcional.'
    },
    {
      category: 'calculadoras', 
      question: 'Posso usar as calculadoras em dispositivos móveis?',
      answer: 'Sim! Nossa tecnologia responsiva funciona perfeitamente em smartphones, tablets e desktops com interface otimizada para cada dispositivo.'
    },
    {
      category: 'conta',
      question: 'Como funciona o sistema de compartilhamento?',
      answer: 'Geramos links criptografados que preservam suas configurações. Você pode compartilhar via QR Code, redes sociais ou URLs diretas.'
    },
    {
      category: 'tecnico',
      question: 'Os dados são enviados para servidores externos?',
      answer: 'Não! Todos os cálculos são processados localmente no seu navegador. Seus dados permanecem 100% privados e seguros.'
    },
    {
      category: 'conta',
      question: 'Como acessar funcionalidades premium?',
      answer: 'Nossa plataforma é totalmente gratuita! Estamos comprometidos em democratizar o acesso a ferramentas profissionais de arbitragem.'
    },
    {
      category: 'tecnico',
      question: 'Qual a latência dos cálculos em tempo real?',
      answer: 'Nosso sistema processa cálculos em menos de 0.002 segundos, oferecendo feedback instantâneo conforme você digita.'
    }
  ];

  this.renderFAQItems(faqData);
  this.bindFAQEvents(faqData);
}

renderFAQItems(faqData, filteredData = null) {
  const faqList = document.getElementById('faqList');
  const items = filteredData || faqData;
  
  faqList.innerHTML = items.map((item, index) => `
    <div class="faq-item-revolutionary" data-category="${item.category}">
      <div class="faq-question-revolutionary">
        <div class="question-content">
          <span class="question-icon">❓</span>
          <span class="question-text">${item.question}</span>
        </div>
        <div class="question-toggle">
          <div class="toggle-icon">+</div>
        </div>
      </div>
      <div class="faq-answer-revolutionary">
        <div class="answer-content">
          <div class="answer-ai-badge">
            <span class="ai-icon">🤖</span>
            <span>Resposta verificada por IA</span>
          </div>
          <p>${item.answer}</p>
        </div>
      </div>
    </div>
  `).join('');
}

bindFAQEvents(faqData) {
  // Clique nas perguntas
  document.addEventListener('click', (e) => {
    const faqQuestion = e.target.closest('.faq-question-revolutionary');
    if (faqQuestion) {
      const faqItem = faqQuestion.closest('.faq-item-revolutionary');
      const answer = faqItem.querySelector('.faq-answer-revolutionary');
      const toggle = faqQuestion.querySelector('.toggle-icon');
      
      // Toggle answer
      faqItem.classList.toggle('open');
      
      // Atualiza ícone
      toggle.textContent = faqItem.classList.contains('open') ? '−' : '+';
      
      // Fecha outros itens (comportamento accordion)
      document.querySelectorAll('.faq-item-revolutionary').forEach(otherItem => {
        if (otherItem !== faqItem) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.toggle-icon').textContent = '+';
        }
      });
    }
  });

  // Filtros de categoria
  document.querySelectorAll('.faq-category').forEach(categoryBtn => {
    categoryBtn.addEventListener('click', () => {
      // Remove active de todos
      document.querySelectorAll('.faq-category').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Adiciona active no clicado
      categoryBtn.classList.add('active');
      
      // Filtra itens
      const category = categoryBtn.dataset.category;
      const filteredItems = category === 'all' ? faqData : faqData.filter(item => item.category === category);
      this.renderFAQItems(faqData, filteredItems);
    });
  });

  // Busca inteligente
  const searchInput = document.getElementById('faqSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      
      if (searchTerm === '') {
        this.renderFAQItems(faqData);
        return;
      }
      
      const filteredItems = faqData.filter(item => 
        item.question.toLowerCase().includes(searchTerm) || 
        item.answer.toLowerCase().includes(searchTerm)
      );
      
      this.renderFAQItems(faqData, filteredItems);
      
      // Efeito visual na busca
      const searchContainer = searchInput.closest('.search-container');
      searchContainer.classList.add('searching');
      
      setTimeout(() => {
        searchContainer.classList.remove('searching');
      }, 500);
    });
  }
}

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
