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
        <!-- Hero Section -->
        <div class="hero-section">
          <div class="hero-content">
            <h1 class="hero-title">Calculadora Shark 100% Green</h1>
            <p class="hero-subtitle">
              As ferramentas mais avançadas para análise e cálculo de arbitragem em apostas 
              esportivas. Desenvolvida para maximizar seus lucros com precisão matemática.
            </p>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="features-section">
          <div class="container">
            <div class="features-grid">
              <div class="feature-card">
                <div class="feature-icon">🎯</div>
                <h3 class="feature-title">Precisão Matemática</h3>
                <p class="feature-description">
                  Cálculos baseados em fórmulas avançadas de arbitragem, garantindo 
                  resultados precisos e confiáveis para suas estratégias de apostas.
                </p>
              </div>

              <div class="feature-card">
                <div class="feature-icon">⚡</div>
                <h3 class="feature-title">Tempo Real</h3>
                <p class="feature-description">
                  Atualizações instantâneas dos cálculos conforme você insere os dados, 
                  permitindo análise rápida de diferentes cenários.
                </p>
              </div>

              <div class="feature-card">
                <div class="feature-icon">🛡️</div>
                <h3 class="feature-title">Gestão de Risco</h3>
                <p class="feature-description">
                  Controle total sobre seus stakes e análise detalhada do risco total da 
                  operação, ajudando você a tomar decisões informadas.
                </p>
              </div>

              <div class="feature-card">
                <div class="feature-icon">🔗</div>
                <h3 class="feature-title">Compartilhamento</h3>
                <p class="feature-description">
                  Sistema avançado de compartilhamento de configurações via links seguros, 
                  QR codes e integração com redes sociais.
                </p>
              </div>

              <div class="feature-card">
                <div class="feature-icon">📱</div>
                <h3 class="feature-title">Responsivo</h3>
                <p class="feature-description">
                  Interface totalmente responsiva que funciona perfeitamente em desktop, 
                  tablet e celular, sempre com a melhor experiência.
                </p>
              </div>

              <div class="feature-card">
                <div class="feature-icon">🌙</div>
                <h3 class="feature-title">Temas Personalizados</h3>
                <p class="feature-description">
                  Modo escuro e claro com transições suaves, garantindo conforto visual 
                  em qualquer ambiente de trabalho.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Technology Section -->
        <div class="tech-section">
          <div class="container">
            <h2 class="section-title">Tecnologia de Ponta</h2>
            <div class="tech-grid">
              <div class="tech-item">
                <span class="tech-icon">🚀</span>
                <div class="tech-content">
                  <h4>Performance Otimizada</h4>
                  <p>Algoritmos otimizados para cálculos instantâneos</p>
                </div>
              </div>
              <div class="tech-item">
                <span class="tech-icon">🔒</span>
                <div class="tech-content">
                  <h4>Segurança Total</h4>
                  <p>Dados processados localmente sem envio para servidores</p>
                </div>
              </div>
              <div class="tech-item">
                <span class="tech-icon">🎛️</span>
                <div class="tech-content">
                  <h4>Interface Intuitiva</h4>
                  <p>Design moderno e fácil de usar para todos os níveis</p>
                </div>
              </div>
              <div class="tech-item">
                <span class="tech-icon">🔄</span>
                <div class="tech-content">
                  <h4>Atualizações Constantes</h4>
                  <p>Sempre evoluindo com novas funcionalidades</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="cta-section">
          <div class="container">
            <div class="cta-content">
              <h2>Pronto para Maximizar seus Lucros?</h2>
              <p>Comece agora mesmo a usar as calculadoras mais avançadas do mercado</p>
              <button class="btn btn-primary btn-cta" onclick="window.SharkGreen.getModules().navigation.navigateTo('calculadora')">
                🧮 Usar Calculadoras
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
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
