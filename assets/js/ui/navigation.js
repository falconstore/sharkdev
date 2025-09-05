// assets/js/ui/navigation.js
// Sistema de navegação entre páginas

export class Navigation {
  constructor() {
    this.currentPage = 'calculadoras';
    this.pages = ['calculadoras', 'sobre', 'contato'];
  }

  init() {
    this.bindEvents();
    console.log('Navigation inicializado');
  }

  bindEvents() {
    // Aguarda o DOM estar pronto
    setTimeout(() => {
      const navButtons = document.querySelectorAll('.nav-tab');
      navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const page = e.target.id.replace('nav', '').toLowerCase();
          this.navigateTo(page);
        });
      });
    }, 100);
  }

  navigateTo(page) {
    // Atualiza botões
    document.querySelectorAll('.nav-tab').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const activeBtn = document.getElementById(`nav${page.charAt(0).toUpperCase() + page.slice(1)}`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }

    // Atualiza conteúdo
    this.hideAllPages();
    
    switch(page) {
      case 'calculadoras':
        this.showCalculadoras();
        break;
      case 'sobre':
        this.showSobre();
        break;
      case 'contato':
        this.showContato();
        break;
    }
    
    this.currentPage = page;
  }

  hideAllPages() {
    const calculadoras = document.getElementById('calculadoras-content');
    const sobre = document.getElementById('sobre-content');
    const contato = document.getElementById('contato-content');
    
    if (calculadoras) calculadoras.classList.add('hidden');
    if (sobre) sobre.classList.add('hidden');
    if (contato) contato.classList.add('hidden');
  }

  showCalculadoras() {
    const content = document.getElementById('calculadoras-content');
    if (content) {
      content.classList.remove('hidden');
    }
  }

  showSobre() {
    const content = document.getElementById('sobre-content');
    if (content) {
      content.classList.remove('hidden');
      this.renderSobre();
    }
  }

  showContato() {
    const content = document.getElementById('contato-content');
    if (content) {
      content.classList.remove('hidden');
      this.renderContato();
    }
  }

  renderSobre() {
    const container = document.getElementById('sobre-content');
    if (!container) return;

    container.innerHTML = `
      <div class="container">
        <div class="page-header">
          <h1>Sobre o Shark 100% Green</h1>
          <p>Tecnologia de ponta para traders profissionais</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Precisão Matemática</h3>
            <p>Algoritmos avançados garantem cálculos precisos para maximizar seus lucros.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <h3>Tempo Real</h3>
            <p>Processamento instantâneo de dados para aproveitar as melhores oportunidades.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🛡️</div>
            <h3>Gestão de Risco</h3>
            <p>Ferramentas profissionais para minimizar riscos e proteger seu capital.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Análise Avançada</h3>
            <p>Relatórios detalhados e métricas para otimizar suas estratégias.</p>
          </div>
        </div>
        
        <div class="cta-section">
          <h2>Pronto para começar?</h2>
          <p>Experimente nossas calculadoras profissionais</p>
          <button class="btn btn-primary" onclick="window.SharkGreen.navigation?.navigateTo('calculadoras')">
            Acessar Calculadoras
          </button>
        </div>
      </div>
    `;
  }

  renderContato() {
    const container = document.getElementById('contato-content');
    if (!container) return;

    container.innerHTML = `
      <div class="container">
        <div class="page-header">
          <h1>Entre em Contato</h1>
          <p>Estamos aqui para ajudar você a maximizar seus resultados</p>
        </div>
        
        <div class="contact-grid">
          <div class="contact-info">
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
          
          <div class="contact-form">
            <h3>Envie sua Mensagem</h3>
            <form id="contactForm">
              <div class="form-group">
                <label class="form-label">Nome</label>
                <input type="text" class="form-control" required>
              </div>
              
              <div class="form-group">
                <label class="form-label">E-mail</label>
                <input type="email" class="form-control" required>
              </div>
              
              <div class="form-group">
                <label class="form-label">Assunto</label>
                <select class="form-control" required>
                  <option value="">Selecione um assunto</option>
                  <option value="suporte">Suporte Técnico</option>
                  <option value="vendas">Informações de Venda</option>
                  <option value="feedback">Feedback</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Mensagem</label>
                <textarea class="form-control" rows="5" required></textarea>
              </div>
              
              <button type="submit" class="btn btn-primary">
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    // Bind form submit
    const form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Mensagem enviada com sucesso! Retornaremos em breve.');
        form.reset();
      });
    }
  }
}
