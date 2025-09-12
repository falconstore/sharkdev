export class CasasRegulamentadas {
  constructor() {
    this.dados = [];
    this.dadosFiltrados = [];
    this.marcasSet = new Set();
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    this.carregarDados();
    this.initialized = true;
    
    // Escuta eventos de mudança de aba
    document.addEventListener('tabChanged', (e) => {
      if (e.detail.tabName === 'casas-regulamentadas') {
        this.onTabActivated();
      }
    });

    console.log('CasasRegulamentadas controller inicializado');
  }

  onTabActivated() {
    const container = document.querySelector('#panel-3 #casas-content');
    if (container && !container.innerHTML.trim()) {
      this.render();
      this.bindEvents();
      this.popularFiltroMarcas();
      this.filtrarDados();
    }
  }

  carregarDados() {
    // Dados das empresas autorizadas
    const dadosManuais = [
      {req:"0001/2024",portaria:"SPA/MF nº 246, de 07/02/2025",empresa:"KAIZEN GAMING BRASIL LTDA",cnpj:"46.786.961/0001-74",marca:"BETANO",dominio:"betano.bet.br"},
      {req:"0002/2024",portaria:"SPA/MF nº 2.090, de 30/12/2024",empresa:"SPRBT INTERACTIVE BRASIL LTDA",cnpj:"54.071.596/0001-40",marca:"SUPERBET",dominio:"superbet.bet.br"},
      {req:"0002/2024",portaria:"SPA/MF nº 2.090, de 30/12/2024",empresa:"SPRBT INTERACTIVE BRASIL LTDA",cnpj:"54.071.596/0001-40",marca:"MAGICJACKPOT",dominio:"magicjackpot.bet.br"},
      {req:"0002/2024",portaria:"SPA/MF nº 2.090, de 30/12/2024",empresa:"SPRBT INTERACTIVE BRASIL LTDA",cnpj:"54.071.596/0001-40",marca:"SUPER",dominio:"super.bet.br"},
      {req:"0003/2024",portaria:"SPA/MF nº 2.091, de 30/12/2024 (alt. Port. 1.142, 23/05/2025)",empresa:"MMD TECNOLOGIA, ENTRETENIMENTO E MARKETING LTDA",cnpj:"34.935.286/0001-19",marca:"REI DO PITACO",dominio:"reidopitaco.bet.br"},
      {req:"0003/2024",portaria:"SPA/MF nº 2.091, de 30/12/2024 (alt. Port. 1.142, 23/05/2025)",empresa:"MMD TECNOLOGIA, ENTRETENIMENTO E MARKETING LTDA",cnpj:"34.935.286/0001-19",marca:"PITACO",dominio:"pitaco.bet.br"},
      {req:"0003/2024",portaria:"SPA/MF nº 2.091, de 30/12/2024 (alt. Port. 1.142, 23/05/2025)",empresa:"MMD TECNOLOGIA, ENTRETENIMENTO E MARKETING LTDA",cnpj:"34.935.286/0001-19",marca:"RdP",dominio:"rdp.bet.br"},
      {req:"0004/2024",portaria:"SPA/MF nº 247, de 07/02/2025",empresa:"VENTMEAR BRASIL S.A.",cnpj:"52.868.380/0001-84",marca:"SPORTINGBET",dominio:"sportingbet.bet.br"},
      {req:"0004/2024",portaria:"SPA/MF nº 247, de 07/02/2025",empresa:"VENTMEAR BRASIL S.A.",cnpj:"52.868.380/0001-84",marca:"BETBOO",dominio:"betboo.bet.br"},
      {req:"0005/2024",portaria:"SPA/MF nº 370, de 24/02/2025 (alt. 479/10-03-2025 e 755/08-04-2025)",empresa:"BIG BRAZIL TECNOLOGIA E LOTERIA S.A.",cnpj:"41.590.869/0001-10",marca:"BIG",dominio:"big.bet.br"},
      {req:"0005/2024",portaria:"SPA/MF nº 370, de 24/02/2025 (alt. 479/10-03-2025 e 755/08-04-2025)",empresa:"BIG BRAZIL TECNOLOGIA E LOTERIA S.A.",cnpj:"41.590.869/0001-10",marca:"APOSTAR",dominio:"apostar.bet.br"},
      {req:"0005/2024",portaria:"SPA/MF nº 370, de 24/02/2025 (alt. 479/10-03-2025 e 755/08-04-2025)",empresa:"BIG BRAZIL TECNOLOGIA E LOTERIA S.A.",cnpj:"41.590.869/0001-10",marca:"CAESARS",dominio:"caesars.bet.br"},
      {req:"0006/2024",portaria:"SPA/MF nº 2.092, de 30/12/2024 (alt. 1.814, 15/08/2025)",empresa:"NSX BRASIL S.A.",cnpj:"55.056.104/0001-00",marca:"BETNACIONAL",dominio:"betnacional.bet.br"},
      {req:"0007/2024",portaria:"SPA/MF nº 2.093, de 30/12/2024",empresa:"APOLLO OPERATIONS LTDA",cnpj:"54.923.003/0001-26",marca:"KTO",dominio:"kto.bet.br"},
      {req:"0008/2024",portaria:"SPA/MF nº 371, de 24/02/2025",empresa:"SIMULCASTING BRASIL SOM E IMAGEM S.A.",cnpj:"17.385.948/0001-05",marca:"BETSSON",dominio:"betsson.bet.br"},
      {req:"0009/2024",portaria:"SPA/MF nº 2.094, de 30/12/2024",empresa:"GALERA GAMING JOGOS ELETRONICOS S.A.",cnpj:"31.853.299/0001-50",marca:"GALERA.BET",dominio:"galera.bet.br"},
      {req:"0010/2024",portaria:"SPA/MF nº 319, de 17/02/2025 (alt. 1.423, 30/06/2025)",empresa:"F12 DO BRASIL JOGOS ELETRONICOS LTDA",cnpj:"51.897.834/0001-82",marca:"F12.BET",dominio:"f12.bet.br"},
      {req:"0010/2024",portaria:"SPA/MF nº 319, de 17/02/2025 (alt. 1.423, 30/06/2025)",empresa:"F12 DO BRASIL JOGOS ELETRONICOS LTDA",cnpj:"51.897.834/0001-82",marca:"LUVA.BET",dominio:"luva.bet.br"},
      {req:"0010/2024",portaria:"SPA/MF nº 319, de 17/02/2025 (alt. 1.423, 30/06/2025)",empresa:"F12 DO BRASIL JOGOS ELETRONICOS LTDA",cnpj:"51.897.834/0001-82",marca:"BRASIL.BET",dominio:"brasil.bet.br"},
      {req:"0011/2024",portaria:"SPA/MF nº 2.095, de 30/12/2024 (alt. 480, 10/03/2025)",empresa:"BLAC JOGOS LTDA",cnpj:"55.988.317/0001-70",marca:"SPORTYBET",dominio:"sporty.bet.br"},
      {req:"0012/2024",portaria:"SPA/MF nº 320, de 17/02/2025 (alt. 1.792, 11/08/2025)",empresa:"EB INTERMEDIACOES E JOGOS S.A.",cnpj:"52.639.845/0001-25",marca:"ESTRELABET",dominio:"estrelabet.bet.br"},
      {req:"0012/2024",portaria:"SPA/MF nº 320, de 17/02/2025 (alt. 1.792, 11/08/2025)",empresa:"EB INTERMEDIACOES E JOGOS S.A.",cnpj:"52.639.845/0001-25",marca:"VUPI",dominio:"vupi.bet.br"},
      {req:"0013/2024",portaria:"SPA/MF nº 372, de 24/02/2025 (alt. 1.896, 27/08/2025)",empresa:"REALS BRASIL LTDA",cnpj:"56.197.912/0001-50",marca:"REALS",dominio:"reals.bet.br"},
      {req:"0013/2024",portaria:"SPA/MF nº 372, de 24/02/2025 (alt. 1.896, 27/08/2025)",empresa:"REALS BRASIL LTDA",cnpj:"56.197.912/0001-50",marca:"UX",dominio:"ux.bet.br"},
      {req:"0013/2024",portaria:"SPA/MF nº 372, de 24/02/2025 (alt. 1.896, 27/08/2025)",empresa:"REALS BRASIL LTDA",cnpj:"56.197.912/0001-50",marca:"BINGO",dominio:"bingo.bet.br",obs:"A marca NETPIX foi substituída pela marca BINGO (Portaria SPA/MF nº 1.896/2025)."},
      {req:"0014/2024",portaria:"SPA/MF nº 248, de 07/02/2025",empresa:"BETFAIR BRASIL LTDA",cnpj:"55.229.080/0001-43",marca:"BETFAIR",dominio:"betfair.bet.br"},
      {req:"0015/2024",portaria:"SPA/MF nº 2.096, de 30/12/2024",empresa:"OIG GAMING BRAZIL LTDA",cnpj:"55.459.453/0001-72",marca:"7GAMES",dominio:"7games.bet.br"},
      {req:"0015/2024",portaria:"SPA/MF nº 2.096, de 30/12/2024",empresa:"OIG GAMING BRAZIL LTDA",cnpj:"55.459.453/0001-72",marca:"BETÃO",dominio:"betao.bet.br"},
      {req:"0015/2024",portaria:"SPA/MF nº 2.096, de 30/12/2024",empresa:"OIG GAMING BRAZIL LTDA",cnpj:"55.459.453/0001-72",marca:"R7",dominio:"r7.bet.br"},
      {req:"0016/2024",portaria:"SPA/MF nº 321, de 17/02/2025",empresa:"HIPER BET TECNOLOGIA LTDA.",cnpj:"55.404.799/0001-73",marca:"HIPERBET",dominio:"hiper.bet.br"},
      {req:"0017/2024",portaria:"SPA/MF nº 249, de 07/02/2025",empresa:"NVBT GAMING LTDA",cnpj:"50.587.712/0001-27",marca:"NOVIBET",dominio:"novibet.bet.br"},
      {req:"0018/2024",portaria:"SPA/MF nº 2.097, de 30/12/2024",empresa:"SEGURO BET LTDA",cnpj:"56.268.974/0001-05",marca:"SEGURO BET",dominio:"seguro.bet.br"},
      {req:"0018/2024",portaria:"SPA/MF nº 2.097, de 30/12/2024",empresa:"SEGURO BET LTDA",cnpj:"56.268.974/0001-05",marca:"KING PANDA",dominio:"kingpanda.bet.br"},
      {req:"0021/2024",portaria:"SPA/MF nº 250, de 07/02/2025",empresa:"HS DO BRASIL LTDA",cnpj:"47.123.407/0001-70",marca:"BET365",dominio:"bet365.bet.br"},
      {req:"0022/2024",portaria:"SPA/MF nº 251, de 07/02/2025",empresa:"APOSTA GANHA LOTERIAS LTDA",cnpj:"56.001.749/0001-08",marca:"APOSTA GANHA",dominio:"apostaganha.bet.br"},
      {req:"0023/2024",portaria:"SPA/MF nº 466, de 10/03/2025",empresa:"FUTURAS APOSTAS LTDA",cnpj:"55.399.607/0001-88",marca:"BRAZINO777",dominio:"brazino777.bet.br"},
      {req:"0030/2024",portaria:"SPA/MF nº 136, de 22/01/2025 (alt. 1.559, 16/07/2025; retif. 18/07/2025)",empresa:"ESPORTES GAMING BRASIL LTDA",cnpj:"56.075.466/0001-00",marca:"ESPORTES DA SORTE",dominio:"esportesdasorte.bet.br"},
      {req:"0042/2024",portaria:"SPA/MF nº 806, de 14/04/2025",empresa:"PIXBET SOLUÇÕES TECNOLÓGICAS LTDA.",cnpj:"40.633.348/0001-30",marca:"PIXBET",dominio:"pix.bet.br"},
      {req:"0079/2024",portaria:"SPA/MF nº 263, de 07/02/2025",empresa:"STAKE BRAZIL LTDA",cnpj:"56.525.936/0001-90",marca:"STAKE",dominio:"stake.bet.br"},
      {req:"0081/2024",portaria:"SPA/MF nº 1.665, de 29/07/2025",empresa:"CAIXA LOTERIAS S.A.",cnpj:"24.038.490/0001-83",marca:"BETCAIXA",dominio:"betcaixa.bet.br"},
      {req:"0104/2024",portaria:"SPA/MF nº 1.666, de 29/07/2025",empresa:"DEFY LTDA",cnpj:"47.974.569/0001-11",marca:"1XBET",dominio:"1xbet.bet.br"},
      {req:"0105/2024",portaria:"SPA/MF nº 264, de 07/02/2025",empresa:"OLAVIR LTDA",cnpj:"56.873.267/0001-48",marca:"RIVALO",dominio:"rivalo.bet.br"}
    ];

    this.dados = this.consolidarDados(dadosManuais);
    this.dadosFiltrados = [...this.dados];
  }

  consolidarDados(dadosManuais) {
    const map = new Map();
    
    for (const r of dadosManuais) {
      const key = `${r.req}__${r.cnpj}__${r.portaria}`;
      if (!map.has(key)) {
        map.set(key, {
          req: r.req,
          portaria: r.portaria,
          empresa: r.empresa,
          cnpj: r.cnpj,
          marcas: [],
          dominios: []
        });
      }
      
      const item = map.get(key);
      if (r.marca && !item.marcas.find(m => m.nome === r.marca)) {
        item.marcas.push({nome: r.marca, obs: r.obs || ""});
      }
      if (r.dominio && !item.dominios.includes(r.dominio)) {
        item.dominios.push(r.dominio);
      }
    }
    
    return [...map.values()].sort((a, b) => {
      const nr = a.req.localeCompare(b.req, 'pt-BR');
      if (nr !== 0) return nr;
      return (a.empresa || "").localeCompare((b.empresa || ""), 'pt-BR');
    });
  }

  render() {
    const container = document.querySelector('#panel-3 #casas-content');
    if (!container) return;

    container.innerHTML = `
      <div class="calc-header">
        <h1 style="font-size: 1.75rem; font-weight: 800; background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 0.5rem; text-align: center;">Casas Regulamentadas</h1>
        <p style="color: var(--text-secondary); font-size: 0.875rem; text-align: center;">
          Empresas autorizadas a explorar a modalidade lotérica de aposta de quota fixa a partir de 1º de janeiro de 2025 em âmbito nacional
        </p>
      </div>

      <div class="card">
        <div class="toolbar-casas">
          <input id="searchInput" type="search" class="form-input" placeholder="Buscar por empresa, CNPJ, marca, domínio ou portaria..."/>
          <select id="marcaFilter" class="form-select" title="Filtrar por marca">
            <option value="">Todas as marcas</option>
          </select>
          <button id="exportBtn" class="btn btn-secondary">📊 Exportar CSV</button>
        </div>

        <div class="stats-grid" style="margin: 1rem 0;">
          <div class="stat-card">
            <div class="stat-value" id="totalEmpresas">0</div>
            <div class="stat-label">Empresas</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" id="totalMarcas">0</div>
            <div class="stat-label">Marcas</div>
          </div>
          <div class="stat-card">
            <div class="stat-value" id="registrosVisiveis">0</div>
            <div class="stat-label">Registros Visíveis</div>
          </div>
        </div>

        <div class="table-container">
          <table class="casas-table">
            <thead>
              <tr>
                <th>Nº/Ano do Requerimento</th>
                <th>Portaria</th>
                <th>Empresa (CNPJ)</th>
                <th>Marcas</th>
                <th>Domínios</th>
              </tr>
            </thead>
            <tbody id="casasTableBody"></tbody>
          </table>
        </div>

        <div class="casas-footer">
          Base compilada do PDF oficial publicado pela Secretaria de Prêmios e Apostas/MF.
          <span class="badge-info">Última atualização: <span id="lastUpdate"></span></span>
        </div>
      </div>
    `;

    // Atualiza data
    document.getElementById('lastUpdate').textContent = new Date().toLocaleString('pt-BR');
  }

  bindEvents() {
    const searchInput = document.getElementById('searchInput');
    const marcaFilter = document.getElementById('marcaFilter');
    const exportBtn = document.getElementById('exportBtn');

    if (searchInput) {
      searchInput.addEventListener('input', () => this.filtrarDados());
    }

    if (marcaFilter) {
      marcaFilter.addEventListener('change', () => this.filtrarDados());
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportarCSV());
    }
  }

  popularFiltroMarcas() {
    this.marcasSet = new Set();
    for (const linha of this.dados) {
      for (const marca of (linha.marcas || [])) {
        if (marca?.nome) {
          this.marcasSet.add(marca.nome.trim());
        }
      }
    }

    const select = document.getElementById('marcaFilter');
    if (!select) return;

    const valorAtual = select.value;
    select.innerHTML = '<option value="">Todas as marcas</option>';
    
    [...this.marcasSet].sort((a, b) => a.localeCompare(b, 'pt-BR')).forEach(marca => {
      const option = document.createElement('option');
      option.value = marca;
      option.textContent = marca;
      select.appendChild(option);
    });

    if ([...select.options].some(o => o.value === valorAtual)) {
      select.value = valorAtual;
    }
  }

  filtrarDados() {
    const searchInput = document.getElementById('searchInput');
    const marcaFilter = document.getElementById('marcaFilter');
    
    if (!searchInput || !marcaFilter) return;

    const busca = searchInput.value.trim().toLowerCase();
    const marcaFiltro = marcaFilter.value.trim();

    this.dadosFiltrados = this.dados.filter(linha => {
      const textoCompleto = [
        linha.req,
        linha.portaria,
        linha.empresa,
        linha.cnpj,
        ...(linha.marcas || []).map(x => x.nome),
        ...(linha.dominios || [])
      ].join(' ').toLowerCase();

      const matchBusca = !busca || textoCompleto.includes(busca);
      const matchMarca = !marcaFiltro || (linha.marcas || []).some(m => (m?.nome || '') === marcaFiltro);

      return matchBusca && matchMarca;
    });

    this.renderTabela();
    this.atualizarEstatisticas();
  }

  renderTabela() {
    const tbody = document.getElementById('casasTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (this.dadosFiltrados.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">
          Nenhum resultado encontrado com os filtros atuais
        </td>
      `;
      tbody.appendChild(tr);
      return;
    }

    this.dadosFiltrados.forEach(linha => {
      const tr = document.createElement('tr');

      // Coluna Requerimento
      const tdReq = document.createElement('td');
      tdReq.className = 'text-muted';
      tdReq.textContent = linha.req || '';
      tr.appendChild(tdReq);

      // Coluna Portaria
      const tdPortaria = document.createElement('td');
      tdPortaria.textContent = linha.portaria || '';
      tr.appendChild(tdPortaria);

      // Coluna Empresa
      const tdEmpresa = document.createElement('td');
      tdEmpresa.innerHTML = `
        <div style="margin-bottom: 0.5rem;">
          <strong>${linha.empresa || ''}</strong>
        </div>
        <div class="cnpj-chip">${linha.cnpj || ''}</div>
      `;
      tr.appendChild(tdEmpresa);

      // Coluna Marcas
      const tdMarcas = document.createElement('td');
      if (linha.marcas?.length) {
        const marcasHtml = linha.marcas.map(m => {
          let html = `<span class="marca-chip">${m.nome}</span>`;
          if (m.obs) {
            html += `<div class="marca-obs">${m.obs}</div>`;
          }
          return html;
        }).join('');
        tdMarcas.innerHTML = marcasHtml;
      } else {
        tdMarcas.innerHTML = '<span class="text-muted">—</span>';
      }
      tr.appendChild(tdMarcas);

      // Coluna Domínios
      const tdDominios = document.createElement('td');
      if (linha.dominios?.length) {
        const dominiosHtml = linha.dominios.map(d => {
          if (d && d !== 'a definir') {
            const url = d.startsWith('http') ? d : `https://${d}`;
            return `<a href="${url}" target="_blank" rel="noopener" class="dominio-link">${d}</a>`;
          } else {
            return `<span class="dominio-pendente">${d}</span>`;
          }
        }).join('');
        tdDominios.innerHTML = dominiosHtml;
      } else {
        tdDominios.innerHTML = '<span class="text-muted">—</span>';
      }
      tr.appendChild(tdDominios);

      tbody.appendChild(tr);
    });
  }

  atualizarEstatisticas() {
    const totalEmpresas = document.getElementById('totalEmpresas');
    const totalMarcas = document.getElementById('totalMarcas');
    const registrosVisiveis = document.getElementById('registrosVisiveis');

    if (totalEmpresas) {
      const empresasUnicas = new Set(this.dados.map(d => d.cnpj)).size;
      totalEmpresas.textContent = empresasUnicas.toString();
    }

    if (totalMarcas) {
      totalMarcas.textContent = this.marcasSet.size.toString();
    }

    if (registrosVisiveis) {
      registrosVisiveis.textContent = this.dadosFiltrados.length.toString();
    }
  }

  exportarCSV() {
    const headers = ['Requerimento', 'Portaria', 'Empresa', 'CNPJ', 'Marcas', 'Domínios'];
    const rows = [headers.join(';')];

    this.dadosFiltrados.forEach(linha => {
      const row = [
        linha.req || '',
        (linha.portaria || '').replace(/;/g, ','),
        (linha.empresa || '').replace(/;/g, ','),
        linha.cnpj || '',
        (linha.marcas || []).map(x => x.nome).join(', ').replace(/;/g, ','),
        (linha.dominios || []).join(', ').replace(/;/g, ',')
      ];
      rows.push(row.join(';'));
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'casas-regulamentadas-spa.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }
}
