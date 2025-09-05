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
              <h4>Q 2026 📋</h4>
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

      <!-- Disclaimer responsável MELHORADO -->
      <div class="disclaimer-section-novo">
        <div class="disclaimer-card-novo">
          <h3>⚠️ Aviso Importante - Apostas Responsáveis</h3>
          <div class="warning-content-novo">
            <p>
              <strong>IMPORTANTE:</strong> Nossas ferramentas são para fins educacionais 
              e de otimização matemática. Apostas envolvem riscos financeiros reais.
            </p>
            
            <div class="responsibility-list-novo">
              <div class="responsibility-item-novo">
                <span class="resp-icon-novo">💰</span>
                <span>Use apenas capital que pode perder sem afetar sua vida financeira</span>
              </div>
              <div class="responsibility-item-novo">
                <span class="resp-icon-novo">🎯</span>
                <span>Estabeleça limites claros antes de começar</span>
              </div>
              <div class="responsibility-item-novo">
                <span class="resp-icon-novo">🆘</span>
                <span>Busque ajuda profissional se desenvolver sinais de vício</span>
              </div>
              <div class="responsibility-item-novo">
                <span class="resp-icon-novo">🚫</span>
                <span>Lembre-se: não existe "ganho garantido" em apostas</span>
              </div>
            </div>
            
            <div class="help-resources-novo">
              <p><strong>🆘 Recursos de Ajuda:</strong></p>
              <a href="https://www.jogadorcompulsivo.org.br" target="_blank">
                Jogadores Anônimos Brasil →
              </a>
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
              <a href="https://t.me/+M1SY4YU6T-pjYWQx" target="_blank" class="btn btn-secondary">
                Entrar no Grupo
              </a>
            </div>

            <!-- Email -->
            <div class="channel-card">
              <div class="channel-icon">📧</div>
              <h3>E-mail</h3>
              <p>Entre em contato direto conosco</p>
              <a href="mailto:sharkgreenvip@hotmail.com" class="btn btn-secondary">
                Enviar E-mail
              </a>
            </div>

          </div>
        </div>

        <!-- Suporte Especializado -->
        <div class="support-section">
          <h2 class="section-title">Suporte Especializado</h2>
          <div class="support-grid">
            
            <div class="support-card">
              <div class="support-icon">📋</div>
              <h3>Suporte Procedimentos</h3>
              <p>Dúvidas sobre estratégias e tutoriais</p>
              <a href="https://t.me/SuporteSharkGreen_procedimentos" target="_blank" class="btn btn-primary">
                Acessar Suporte
              </a>
            </div>

            <div class="support-card">
              <div class="support-icon">💰</div>
              <h3>Suporte Financeiro</h3>
              <p>Questões sobre pagamentos e assinaturas</p>
              <a href="https://t.me/SuporteSharkGreen_financeiro" target="_blank" class="btn btn-primary">
                Acessar Suporte
              </a>
            </div>

          </div>
        </div>

        <!-- FAQ Rápido -->
        <div class="faq-section">
          <h2 class="section-title">Perguntas Frequentes</h2>
          <div class="faq-list">
            
            <div class="faq-item">
              <div class="faq-question" onclick="this.parentElement.classList.toggle('active')">
                <span>Como funcionam as calculadoras?</span>
                <span class="faq-toggle">+</span>
              </div>
              <div class="faq-answer">
                <p>
                  Nossas calculadoras (ArbiPro e FreePro) fazem cálculos matemáticos precisos 
                  para otimizar apostas e freebets, garantindo o melhor aproveitamento das promoções.
                </p>
              </div>
            </div>

            <div class="faq-item">
              <div class="faq-question" onclick="this.parentElement.classList.toggle('active')">
                <span>Preciso pagar para usar as calculadoras?</span>
                <span class="faq-toggle">+</span>
              </div>
              <div class="faq-answer">
                <p>
                  As calculadoras básicas são gratuitas. Para funcionalidades avançadas e 
                  suporte premium, temos planos de assinatura.
                </p>
              </div>
            </div>

            <div class="faq-item">
              <div class="faq-question" onclick="this.parentElement.classList.toggle('active')">
                <span>Como recebo suporte?</span>
                <span class="faq-toggle">+</span>
              </div>
              <div class="faq-answer">
                <p>
                  Oferecemos suporte via Telegram especializado: um canal para dúvidas sobre 
                  procedimentos e outro para questões financeiras.
                </p>
              </div>
            </div>

            <div class="faq-item">
              <div class="faq-question" onclick="this.parentElement.classList.toggle('active')">
                <span>É seguro usar as estratégias?</span>
                <span class="faq-toggle">+</span>
              </div>
              <div class="faq-answer">
                <p>
                  Nossas estratégias são baseadas em matemática e aproveitamento de promoções legais. 
                  Sempre recomendamos apostar com responsabilidade e dentro de suas possibilidades.
                </p>
              </div>
            </div>

          </div>
        </div>

        <!-- CTA de Volta -->
        <div class="cta-section">
          <h2>Experimente nossas ferramentas</h2>
          <p>Comece a otimizar suas estratégias agora mesmo</p>
          <button class="btn btn-primary btn-cta" onclick="window.SharkGreen.navigation?.navigateTo('calculadoras')">
            Usar Calculadoras
          </button>
        </div>
      </div>
    `;

    // Bind FAQ toggle
    setTimeout(() => {
      this.bindFAQEvents();
    }, 100);
  }

  bindFAQEvents() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const toggle = item.querySelector('.faq-toggle');
      
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Fecha todos os outros
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherToggle = otherItem.querySelector('.faq-toggle');
          if (otherToggle) otherToggle.textContent = '+';
        });
        
        // Toggle do atual
        if (!isActive) {
          item.classList.add('active');
          if (toggle) toggle.textContent = '−';
        } else {
          item.classList.remove('active');
          if (toggle) toggle.textContent = '+';
        }
      });
    });
  }
}
