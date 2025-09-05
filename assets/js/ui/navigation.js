// assets/js/ui/navigation.js
// Sistema de navegação completo com páginas Sobre e Contato

export class Navigation {
  constructor() {
    this.currentPage = 'calculadoras';
    this.pages = ['calculadoras', 'sobre', 'contato'];
  }

  init() {
    console.log('Navigation inicializando...');
    this.bindEvents();
    console.log('Navigation inicializado');
  }

  bindEvents() {
    // Função para adicionar eventos
    const addEventListeners = () => {
      const navButtons = document.querySelectorAll('.nav-tab');
      console.log('Botões encontrados:', navButtons.length); // Debug
      
      if (navButtons.length === 0) {
        console.warn('Nenhum botão de navegação encontrado');
        return false;
      }
      
      navButtons.forEach((btn, index) => {
        // Remove listeners antigos se existirem
        btn.replaceWith(btn.cloneNode(true));
        const newBtn = document.querySelectorAll('.nav-tab')[index];
        
        newBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          console.log('Clique detectado em:', e.target.id); // Debug
          
          const page = e.target.id.replace('nav', '').toLowerCase();
          this.navigateTo(page);
        });
        
        console.log('Event listener adicionado ao botão:', newBtn.id); // Debug
      });
      
      return true;
    };

    // Tenta adicionar eventos imediatamente
    if (!addEventListeners()) {
      // Se não conseguiu, tenta novamente após um delay
      setTimeout(() => {
        if (!addEventListeners()) {
          // Última tentativa
          setTimeout(() => {
            addEventListeners();
          }, 2000);
        }
      }, 500);
    }
  }

  navigateTo(page) {
    console.log('Navegando para:', page); // Debug
    
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
        <!-- Hero Section -->
        <div class="hero-section">
          <div class="hero-content">
            <h1 class="hero-title">Sobre o Shark 100% Green</h1>
            <p class="hero-subtitle">
              Ferramentas profissionais para trading esportivo e aproveitamento de promoções de casas de apostas
            </p>
          </div>
        </div>

        <!-- O que é o Shark Green -->
        <div class="about-intro">
          <div class="intro-card">
            <h2 class="section-title">O que é o Shark 100% Green?</h2>
            <p class="intro-text">
              Somos um grupo especializado em mostrar, de forma 100% didática, como aproveitar 
              promoções de casas de apostas e oportunidades de trading esportivo de forma responsável.
            </p>
            
            <div class="features-list">
              <div class="feature-item">
                <span class="feature-icon">🎯</span>
                <span class="feature-text">Cashback e promoções</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🔥</span>
                <span class="feature-text">Super Odds otimizadas</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🎁</span>
                <span class="feature-text">Apostas grátis</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🎰</span>
                <span class="feature-text">Giros grátis</span>
              </div>
            </div>
          </div>
        </div>

        <!-- O que oferecemos -->
        <div class="services-section">
          <h2 class="section-title">O que oferecemos</h2>
          <div class="services-grid">
            <div class="service-card">
              <div class="service-icon">📄</div>
              <h3>Instruções Detalhadas</h3>
              <p>Passo a passo completo para cada estratégia e promoção</p>
            </div>
            <div class="service-card">
              <div class="service-icon">🖼</div>
              <h3>Material Visual</h3>
              <p>Imagens explicativas e tutoriais visuais</p>
            </div>
            <div class="service-card">
              <div class="service-icon">🔗</div>
              <h3>Links Diretos</h3>
              <p>Acesso direto às melhores promoções</p>
            </div>
            <div class="service-card">
              <div class="service-icon">📽</div>
              <h3>Vídeo Tutoriais</h3>
              <p>Explicações simples em formato de vídeo</p>
            </div>
            <div class="service-card">
              <div class="service-icon">🧑‍💻</div>
              <h3>Suporte Rápido</h3>
              <p>Atendimento ágil para tirar suas dúvidas</p>
            </div>
            <div class="service-card">
              <div class="service-icon">⚡</div>
              <h3>Calculadoras Pro</h3>
              <p>Ferramentas avançadas para otimização</p>
            </div>
          </div>
        </div>

        <!-- Requisitos -->
        <div class="requirements-section">
          <h2 class="section-title">Você só precisa de 3 coisas</h2>
          <div class="requirements-list">
            <div class="requirement-item">
              <span class="req-number">1</span>
              <div class="req-content">
                <h3>Um celular com internet</h3>
                <p>Acesso básico à internet é suficiente</p>
              </div>
            </div>
            <div class="requirement-item">
              <span class="req-number">2</span>
              <div class="req-content">
                <h3>Saber copiar e colar</h3>
                <p>Conhecimentos básicos de informática</p>
              </div>
            </div>
            <div class="requirement-item">
              <span class="req-number">3</span>
              <div class="req-content">
                <h3>Vontade de aprender</h3>
                <p>Disposição para seguir as orientações</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Disclaimer responsável -->
        <div class="disclaimer-section">
          <div class="disclaimer-card">
            <h3>⚠️ Aviso Importante</h3>
            <p>
              As apostas esportivas envolvem riscos financeiros. Sempre aposte com responsabilidade, 
              dentro de suas possibilidades, e busque ajuda se desenvolver sinais de vício. 
              Nossas ferramentas são para fins educacionais e de otimização matemática.
            </p>
          </div>
        </div>

        <!-- CTA -->
        <div class="cta-section">
          <h2>Pronto para começar?</h2>
          <p>Explore nossas calculadoras profissionais</p>
          <button class="btn btn-primary btn-cta" onclick="window.SharkGreen.navigation?.navigateTo('calculadoras')">
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
        <!-- Hero Section -->
        <div class="hero-section">
          <div class="hero-content">
            <h1 class="hero-title">Entre em Contato</h1>
            <p class="hero-subtitle">
              Estamos aqui para ajudar você a aproveitar ao máximo nossas ferramentas
            </p>
          </div>
        </div>

        <!-- Canais de Contato -->
        <div class="contact-channels">
          <h2 class="section-title">Nossos Canais</h2>
          <div class="channels-grid">
            
            <!-- Website Principal -->
            <div class="channel-card">
              <div class="channel-icon">🌐</div>
              <h3>Website Principal</h3>
              <p>Nossa landing page com todas as informações</p>
              <a href="https://sharkgreen.com.br" target="_blank" class="btn btn-primary">
                Visitar Site
              </a>
            </div>

            <!-- Instagram -->
            <div class="channel-card">
              <div class="channel-icon">📱</div>
              <h3>Instagram</h3>
              <p>Acompanhe nossas dicas e atualizações</p>
              <a href="https://www.instagram.com/_sharkgreen" target="_blank" class="btn btn-secondary">
                Seguir no Instagram
              </a>
            </div>

            <!-- Grupo Free -->
            <div class="channel-card">
              <div class="channel-icon">💬</div>
              <h3>Grupo Free Telegram</h3>
              <p>Participe da nossa comunidade gratuita</p>
              <a href="https://t.me/+M1SY4YU6T-pjYWQx" target="_bl
