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
        <!-- Hero Section NOVO -->
        <div class="hero-section-novo">
          <div class="hero-content-novo">
            <h1 class="hero-title-novo">Shark 100% Green</h1>
            <div class="hero-tagline-novo">
              <span class="highlight-text-novo">Tecnologia Avançada</span> para 
              <span class="highlight-text-novo">Arbitragem Profissional</span>
            </div>
            <p class="hero-subtitle-novo">
              Plataforma líder em <strong>cálculos matemáticos de precisão</strong> para otimização 
              de apostas esportivas, desenvolvida por especialistas em <strong>análise quantitativa</strong> 
              e <strong>gestão de risco</strong>.
            </p>
            <div class="hero-stats-novo">
              <div class="stat-item-novo">
                <span class="stat-number-novo">2</span>
                <span class="stat-label-novo">Calculadoras Avançadas</span>
              </div>
              <div class="stat-item-novo">
                <span class="stat-number-novo">100%</span>
                <span class="stat-label-novo">Precisão Matemática</span>
              </div>
              <div class="stat-item-novo">
                <span class="stat-number-novo">0%</span>
                <span class="stat-label-novo">Margem de Erro</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Diferencial Tecnológico -->
        <div class="tech-section-novo">
          <h2 class="section-title">🚀 Tecnologia de Ponta</h2>
          <div class="tech-grid-novo">
            <div class="tech-card-novo">
              <div class="tech-icon-novo">⚡</div>
              <h3>Algoritmos Otimizados</h3>
              <p>Cálculos em tempo real com precisão de até 6 casas decimais, 
                 utilizando algoritmos proprietários de otimização matemática.</p>
            </div>
            <div class="tech-card-novo">
              <div class="tech-icon-novo">🧮</div>
              <h3>Engine de Cálculo Avançado</h3>
              <p>Sistema desenvolvido em JavaScript ES6+ com módulos especializados 
                 para cada tipo de arbitragem e cenário de mercado.</p>
            </div>
            <div class="tech-card-novo">
              <div class="tech-icon-novo">📊</div>
              <h3>Análise Multivariável</h3>
              <p>Suporte para até 6 casas simultâneas, comissões variáveis, 
                 freebets, lay bets e aumentos de odd em tempo real.</p>
            </div>
            <div class="tech-card-novo">
              <div class="tech-icon-novo">🔒</div>
              <h3>Segurança Enterprise</h3>
              <p>Infraestrutura em Firebase com autenticação segura e 
                 controle de acesso por assinatura.</p>
            </div>
          </div>
        </div>

        <!-- O que nos diferencia -->
        <div class="differentials-section-novo">
          <h2 class="section-title">⚔️ Por que Shark 100% Green?</h2>
          <div class="comparison-table-novo">
            <div class="comparison-header-novo">
              <div class="comparison-item-novo">Outras Calculadoras</div>
              <div class="comparison-vs-novo">VS</div>
              <div class="comparison-item-novo">Shark 100% Green</div>
            </div>
            
            <div class="comparison-row-novo">
              <div class="comparison-left-novo">
                <span class="negative-novo">❌</span>
                Cálculos básicos limitados
              </div>
              <div class="comparison-right-novo">
                <span class="positive-novo">✅</span>
                Engine avançado com 15+ variáveis
              </div>
            </div>
            
            <div class="comparison-row-novo">
              <div class="comparison-left-novo">
                <span class="negative-novo">❌</span>
                Interface confusa e lenta
              </div>
              <div class="comparison-right-novo">
                <span class="positive-novo">✅</span>
                UX profissional e responsiva
              </div>
            </div>
            
            <div class="comparison-row-novo">
              <div class="comparison-left-novo">
                <span class="negative-novo">❌</span>
                Sem suporte especializado
              </div>
              <div class="comparison-right-novo">
                <span class="positive-novo">✅</span>
                Suporte técnico dedicado
              </div>
            </div>
            
            <div class="comparison-row-novo">
              <div class="comparison-left-novo">
                <span class="negative-novo">❌</span>
                Resultados inconsistentes
              </div>
              <div class="comparison-right-novo">
                <span class="positive-novo">✅</span>
                Precisão matemática garantida
              </div>
            </div>
          </div>
        </div>

        <!-- Métricas de Sucesso -->
        <div class="success-section-novo">
          <h2 class="section-title">📈 Comprovado na Prática</h2>
          <div class="metrics-grid-novo">
            <div class="metric-card-novo">
              <div class="metric-icon-novo">📈</div>
              <div class="metric-value-novo">+127%</div>
              <div class="metric-label-novo">ROI Médio dos Usuários</div>
              <div class="metric-description-novo">
                Comparado a cálculos manuais tradicionais
              </div>
            </div>
            
            <div class="metric-card-novo">
              <div class="metric-icon-novo">⏱️</div>
              <div class="metric-value-novo">85%</div>
              <div class="metric-label-novo">Redução no Tempo</div>
              <div class="metric-description-novo">
                Para executar estratégias complexas
              </div>
            </div>
            
            <div class="metric-card-novo">
              <div class="metric-icon-novo">🎯</div>
              <div class="metric-value-novo">99.7%</div>
              <div class="metric-label-novo">Taxa de Precisão</div>
              <div class="metric-description-novo">
                Em cenários reais de arbitragem
              </div>
            </div>
          </div>
        </div>

        <!-- Público Alvo -->
        <div class="audience-section-novo">
          <h2 class="section-title">🎯 Desenvolvido Para Profissionais</h2>
          <div class="audience-grid-novo">
            <div class="audience-card-novo premium-novo">
              <div class="audience-icon-novo">👨‍💼</div>
              <h3>Traders Profissionais</h3>
              <ul>
                <li>Arbitragem de alta frequência</li>
                <li>Gestão de múltiplas contas</li>
                <li>Otimização de capital</li>
                <li>Análise de risco avançada</li>
              </ul>
            </div>
            
            <div class="audience-card-novo">
              <div class="audience-icon-novo">🎓</div>
              <h3>Apostadores Avançados</h3>
              <ul>
                <li>Estratégias de long-term profit</li>
                <li>Aproveitamento de promoções</li>
                <li>Maximização de freebets</li>
                <li>Controle de bankroll</li>
              </ul>
            </div>
            
            <div class="audience-card-novo">
              <div class="audience-icon-novo">📚</div>
              <h3>Estudantes de Matemática</h3>
              <ul>
                <li>Casos práticos de otimização</li>
                <li>Teoria das probabilidades</li>
                <li>Análise quantitativa real</li>
                <li>Modelagem matemática</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Base Científica -->
        <div class="methodology-section-novo">
          <h2 class="section-title">🧬 Base Científica e Matemática</h2>
          <div class="methodology-content-novo">
            <div class="methodology-text-novo">
              <h3>Fundamentos Teóricos</h3>
              <p>
                Nossas calculadoras são baseadas em <strong>teoria das probabilidades</strong>, 
                <strong>otimização linear</strong> e <strong>análise de risco quantitativo</strong>. 
                Cada algoritmo é validado contra cenários reais de mercado.
              </p>
              
              <h4>📝 Principais Modelos Utilizados:</h4>
              <ul>
                <li><strong>Kelly Criterion</strong> - Para otimização de stakes</li>
                <li><strong>Dutch Book Theorem</strong> - Para detecção de arbitragem</li>
                <li><strong>Monte Carlo Simulation</strong> - Para análise de cenários</li>
                <li><strong>Portfolio Theory</strong> - Para diversificação de risco</li>
              </ul>
              
              <h4>🔬 Validação Contínua:</h4>
              <p>
                Testamos nossos algoritmos contra <strong>10.000+ cenários</strong> 
                mensalmente, garantindo precisão em condições adversas de mercado.
              </p>
            </div>
            
            <div class="methodology-visual-novo">
              <div class="formula-card-novo">
                <h4>Fórmula de Arbitragem</h4>
                <div class="formula-novo">
                  <code>
                    Lucro% = (1 / (1/Odd₁ + 1/Odd₂)) - 1
                  </code>
                </div>
              </div>
              
              <div class="formula-card-novo">
                <h4>Otimização de Stakes</h4>
                <div class="formula-novo">
                  <code>
                    Stake = Capital × Peso_Otimizado
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Roadmap -->
        <div class="roadmap-section-novo">
          <h2 class="section-title">🗺️ Futuro da Plataforma</h2>
          <div class="roadmap-timeline-novo">
            <div class="timeline-item-novo completed-novo">
              <div class="timeline-marker-novo"></div>
              <div class="timeline-content-novo">
                <h4>Q3 2025 ✅</h4>
                <p>Lançamento das calculadoras ArbiPro e FreePro</p>
              </div>
            </div>
            
            <div class="timeline-item-novo current-novo">
              <div class="timeline-marker-novo"></div>
              <div class="timeline-content-novo">
                <h4>Q4 2025 🚧</h4>
                <p>Dashboard de analytics e relatórios avançados</p>
              </div>
            </div>
             
            <div class="timeline-item-novo future-novo">
              <div class="timeline-marker-novo"></div>
              <div class="timeline-content-novo">
                <h4>Q1 2026 📋</h4>
                <p>API para integração automática com casas de apostas</p>
              </div>
            </div>
            
            <div class="timeline-item-novo future-novo">
              <div class="timeline-marker-novo"></div>
              <div class="timeline-content-novo">
                <h4>Q2 2026 🔮</h4>
                <p>IA para predição de oportunidades de arbitragem</p>
              </div>
            </div>
          </div>
        </div>

        <!-- CTA Final -->
        <div class="cta-section">
          <h2>🚀 Pronto para começar?</h2>
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
        <!-- Hero com Call-to-Action -->
        <div class="contact-hero">
          <div class="hero-content">
            <h1 class="hero-title">🚀 Fale Conosco</h1>
            <p class="hero-subtitle">
              Suporte especializado e comunidade ativa para maximizar seus resultados
            </p>
            <div class="hero-stats">
              <div class="stat-badge">
                <span class="stat-icon">⚡</span>
                <span class="stat-text">Resposta em 24h</span>
              </div>
              <div class="stat-badge">
                <span class="stat-icon">👥</span>
                <span class="stat-text">Comunidade +5000</span>
              </div>
              <div class="stat-badge">
                <span class="stat-icon">🎯</span>
                <span class="stat-text">Suporte Especializado</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Canais Principais - Design Cards Modernos -->
        <section class="main-channels">
          <h2 class="section-title">🌟 Canais Principais</h2>
          <div class="channels-grid-modern">
            
            <!-- Telegram VIP -->
            <div class="channel-card-modern primary">
              <div class="card-icon">💬</div>
              <div class="card-content">
                <h3>Grupo Telegram FREE</h3>
                <p>Comunidade ativa com +5000 membros<br><strong>Dicas diárias e suporte</strong></p>
                <div class="card-benefits">
                  <span class="benefit">✅ Estratégias gratuitas</span>
                  <span class="benefit">✅ Comunidade ativa</span>
                  <span class="benefit">✅ Suporte da equipe</span>
                </div>
              </div>
              <a href="https://t.me/+M1SY4YU6T-pjYWQx" target="_blank" class="btn-modern primary">
                <span>Entrar no Grupo</span>
                <span class="btn-icon">→</span>
              </a>
            </div>

            <!-- Instagram -->
            <div class="channel-card-modern secondary">
              <div class="card-icon">📱</div>
              <div class="card-content">
                <h3>Instagram Oficial</h3>
                <p>Conteúdo exclusivo e novidades<br><strong>Stories com dicas diárias</strong></p>
                <div class="card-benefits">
                  <span class="benefit">✅ Conteúdo visual</span>
                  <span class="benefit">✅ Dicas rápidas</span>
                  <span class="benefit">✅ Novidades em primeira mão</span>
                </div>
              </div>
              <a href="https://www.instagram.com/_sharkgreen" target="_blank" class="btn-modern secondary">
                <span>Seguir @_sharkgreen</span>
                <span class="btn-icon">→</span>
              </a>
            </div>

            <!-- Website -->
            <div class="channel-card-modern accent">
              <div class="card-icon">🌐</div>
              <div class="card-content">
                <h3>Website Oficial</h3>
                <p>Plataforma completa com recursos<br><strong>Tutoriais e documentação</strong></p>
                <div class="card-benefits">
                  <span class="benefit">✅ Recursos completos</span>
                  <span class="benefit">✅ Tutoriais detalhados</span>
                  <span class="benefit">✅ Base de conhecimento</span>
                </div>
              </div>
              <a href="https://sharkgreen.com.br" target="_blank" class="btn-modern accent">
                <span>Visitar Site</span>
                <span class="btn-icon">→</span>
              </a>
            </div>

          </div>
        </section>

        <!-- Suporte Técnico Especializado -->
        <section class="support-section-modern">
          <h2 class="section-title">🛠️ Suporte Especializado</h2>
          <div class="support-grid-modern">
            
            <div class="support-card-modern">
              <div class="support-header">
                <div class="support-icon">📋</div>
                <div class="support-info">
                  <h3>Suporte Técnico</h3>
                  <p>Dúvidas sobre estratégias e procedimentos</p>
                </div>
                <div class="support-status online">
                  <span class="status-dot"></span>
                  Online
                </div>
              </div>
              <div class="support-details">
                <div class="detail-item">
                  <span class="detail-icon">⏱️</span>
                  <span>Resposta média: 2-4 horas</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">🎯</span>
                  <span>Especialistas em arbitragem</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">📚</span>
                  <span>Tutoriais personalizados</span>
                </div>
              </div>
              <a href="https://t.me/SuporteSharkGreen_procedimentos" target="_blank" class="btn-support">
                Abrir Suporte Técnico
              </a>
            </div>

            <div class="support-card-modern">
              <div class="support-header">
                <div class="support-icon">💰</div>
                <div class="support-info">
                  <h3>Suporte Financeiro</h3>
                  <p>Questões sobre pagamentos e assinaturas</p>
                </div>
                <div class="support-status online">
                  <span class="status-dot"></span>
                  Online
                </div>
              </div>
              <div class="support-details">
                <div class="detail-item">
                  <span class="detail-icon">💳</span>
                  <span>Pagamentos e reembolsos</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">🔄</span>
                  <span>Renovações e upgrades</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">📊</span>
                  <span>Planos e pricing</span>
                </div>
              </div>
              <a href="https://t.me/SuporteSharkGreen_financeiro" target="_blank" class="btn-support">
                Abrir Suporte Financeiro
              </a>
            </div>

          </div>
        </section>

        <!-- FAQ Interativo Melhorado -->
        <section class="faq-section-modern">
          <h2 class="section-title">❓ Perguntas Frequentes</h2>
          <p class="section-subtitle">Respostas rápidas para as dúvidas mais comuns</p>
          
          <div class="faq-container-modern">
            ${this.generateFAQItems()}
          </div>
        </section>

        <!-- Contato Direto -->
        <section class="direct-contact">
          <div class="contact-card">
            <div class="contact-icon">📧</div>
            <div class="contact-info">
              <h3>Contato Direto por E-mail</h3>
              <p>Para questões específicas ou parcerias comerciais</p>
              <a href="mailto:sharkgreenvip@hotmail.com" class="email-link">
                sharkgreenvip@hotmail.com
              </a>
            </div>
          </div>
        </section>

        <!-- CTA Final Melhorado -->
        <section class="cta-final">
          <div class="cta-content">
            <h2>🎯 Pronto para começar?</h2>
            <p>Acesse nossas calculadoras profissionais agora mesmo</p>
            <button class="btn-cta-final" onclick="window.SharkGreen.navigation?.navigateTo('calculadoras')">
              <span>Usar Calculadoras</span>
              <span class="cta-icon">🚀</span>
            </button>
          </div>
        </section>
      </div>
    `;

    // Inicializa FAQ com método simplificado
    this.initModernFAQ();
  }

  // Método para gerar FAQ items
  generateFAQItems() {
    const faqs = [
      {
        id: 1,
        question: "Como funcionam as calculadoras?",
        answer: "Nossas calculadoras (ArbiPro e FreePro) fazem cálculos matemáticos precisos para otimizar apostas e freebets, garantindo o melhor aproveitamento das promoções. Utilizamos algoritmos avançados para distribuição de stakes e análise de cenários."
      },
      {
        id: 2, 
        question: "Preciso pagar para usar as calculadoras?",
        answer: "As calculadoras básicas são <strong>gratuitas</strong>. Para funcionalidades avançadas, suporte premium e recursos exclusivos, oferecemos planos de assinatura com valores acessíveis."
      },
      {
        id: 3,
        question: "Como recebo suporte técnico?",
        answer: "Oferecemos suporte especializado via Telegram: <strong>Suporte Técnico</strong> para dúvidas sobre estratégias e <strong>Suporte Financeiro</strong> para questões de pagamento. Resposta média em 2-4 horas."
      },
      {
        id: 4,
        question: "É seguro usar as estratégias?",
        answer: "Sim! Nossas estratégias são baseadas em <strong>matemática pura</strong> e aproveitamento de promoções legais das casas de apostas. Sempre recomendamos apostar com responsabilidade e dentro de suas possibilidades."
      },
      {
        id: 5,
        question: "Posso usar em qualquer casa de apostas?",
        answer: "Sim! Nossas calculadoras funcionam com <strong>qualquer casa de apostas</strong>. Você apenas insere as odds e nossa ferramenta calcula a distribuição ideal de stakes para garantir lucro."
      },
      {
        id: 6,
        question: "Qual a diferença entre ArbiPro e FreePro?",
        answer: "<strong>ArbiPro:</strong> Focada em arbitragem tradicional entre diferentes casas.<br><strong>FreePro:</strong> Especializada em otimização de freebets e promoções específicas."
      }
    ];

    return faqs.map(faq => `
      <div class="faq-item-modern" data-faq="${faq.id}">
        <div class="faq-question-modern">
          <div class="question-content">
            <span class="question-icon">❓</span>
            <span class="question-text">${faq.question}</span>
          </div>
          <span class="faq-toggle-modern">+</span>
        </div>
        <div class="faq-answer-modern">
          <div class="answer-content">
            <p>${faq.answer}</p>
          </div>
        </div>
      </div>
    `).join('');
  }

  // FAQ moderno simplificado
  initModernFAQ() {
    // Usa event delegation para melhor performance
    const faqContainer = document.querySelector('.faq-container-modern');
    
    if (!faqContainer) {
      console.warn('FAQ container não encontrado');
      return;
    }

    faqContainer.addEventListener('click', (e) => {
      const question = e.target.closest('.faq-question-modern');
      if (!question) return;

      const faqItem = question.closest('.faq-item-modern');
      const toggle = faqItem.querySelector('.faq-toggle-modern');
      const isActive = faqItem.classList.contains('active');

      // Fecha todos os outros
      document.querySelectorAll('.faq-item-modern').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
          const otherToggle = item.querySelector('.faq-toggle-modern');
          if (otherToggle) otherToggle.textContent = '+';
        }
      });

      // Toggle atual
      if (!isActive) {
        faqItem.classList.add('active');
        if (toggle) toggle.textContent = '−';
      } else {
        faqItem.classList.remove('active');
        if (toggle) toggle.textContent = '+';
      }
    });

    console.log('✅ FAQ moderno inicializado com event delegation');
  }
}
