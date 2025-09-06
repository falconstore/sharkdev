// PASSO 12 - assets/js/calculators/freepro-content.js
// HTML completo da calculadora FreePro que roda no iframe

export function getFreeProfHTML() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FreePro</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      background: transparent;
      color: #f9fafb;
      font-family: system-ui, sans-serif;
      padding: 1rem;
      line-height: 1.5;
    }

    .title {
      text-align: center;
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #3b82f6, #22c55e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .card {
      background: rgba(31, 41, 59, 0.8);
      border: 1px solid #4b5563;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .label {
      display: block;
      font-size: 0.75rem;
      color: #d1d5db;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      font-weight: 600;
    }

    .input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #4b5563;
      border-radius: 6px;
      background: rgba(17, 24, 39, 0.8);
      color: #f9fafb;
      font-size: 0.875rem;
    }

    .input:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.75rem;
      text-transform: uppercase;
      margin: 0.25rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6, #22c55e);
      color: white;
    }

    .btn-secondary {
      background: rgba(55, 65, 81, 0.8);
      color: #f9fafb;
      border: 2px solid #4b5563;
    }

    .total {
      text-align: center;
      padding: 1.5rem;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(34, 197, 94, 0.05));
      border: 2px solid #3b82f6;
      border-radius: 8px;
      margin: 1rem 0;
    }

    .total-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #3b82f6;
      font-family: monospace;
    }

    .actions {
      text-align: center;
      margin: 1rem 0;
    }

    .alert {
      padding: 1rem;
      border-radius: 6px;
      margin: 1rem 0;
      background: rgba(245, 158, 11, 0.1);
      border: 2px solid #f59e0b;
      color: #fbbf24;
      display: none;
    }

    /* Tema claro */
    [data-theme="light"] body { color: #1e293b; }
    [data-theme="light"] .card { background: rgba(255, 255, 255, 0.9); border-color: #e2e8f0; }
    [data-theme="light"] .input { background: rgba(255, 255, 255, 0.9); color: #1e293b; border-color: #e2e8f0; }
    [data-theme="light"] .btn-secondary { background: rgba(255, 255, 255, 0.9); color: #1e293b; }
  </style>
</head>
<body>
  <h1 class="title">Calculadora Shark FreePro</h1>
  
  <div class="card">
    <div class="form-group">
      <label class="label">Número de Entradas</label>
      <select id="num" class="input">
        <option value="2">2 Mercados</option>
        <option value="3" selected>3 Mercados</option>
        <option value="4">4 Mercados</option>
        <option value="5">5 Mercados</option>
        <option value="6">6 Mercados</option>
      </select>
    </div>
  </div>

  <div class="card">
    <h3 style="margin-bottom: 1rem; color: #3b82f6;">Casa Promoção</h3>
    
    <div class="form-group">
      <label class="label">Odd da Casa</label>
      <input id="odd" class="input" type="text" placeholder="ex: 3.00">
    </div>
    
    <div class="form-group">
      <label class="label">Stake Qualificação</label>
      <input id="stake" class="input" type="text" placeholder="ex: 50">
    </div>
    
    <div class="form-group">
      <label class="label">Valor da Freebet</label>
      <input id="freebet" class="input" type="text" placeholder="ex: 50">
    </div>
    
    <div class="form-group">
      <label class="label">Taxa de Extração (%)</label>
      <input id="rate" class="input" type="text" placeholder="ex: 70" value="70">
    </div>
  </div>

  <div class="total">
    <div style="font-size: 0.75rem; color: #d1d5db; margin-bottom: 0.5rem;">STAKE TOTAL</div>
    <div class="total-value" id="result">R$ 0,00</div>
  </div>

  <div class="actions">
    <button id="calc" class="btn btn-primary">Calcular Estratégia</button>
    <button id="clear" class="btn btn-secondary">Limpar Dados</button>
  </div>

  <div id="alert" class="alert"></div>

  <script>
    console.log('🚀 FreePro iniciando...');
    
    // Sincronização de tema simplificada
    function syncTheme() {
      try {
        if (parent && parent.document) {
          const theme = parent.document.body.getAttribute('data-theme');
          if (theme === 'light') {
            document.body.setAttribute('data-theme', 'light');
          } else {
            document.body.removeAttribute('data-theme');
          }
        }
      } catch (e) {
        // Ignora erros de acesso cross-origin
      }
    }
    
    // Elementos
    const elements = {
      odd: document.getElementById('odd'),
      stake: document.getElementById('stake'),
      freebet: document.getElementById('freebet'),
      rate: document.getElementById('rate'),
      result: document.getElementById('result'),
      alert: document.getElementById('alert'),
      calc: document.getElementById('calc'),
      clear: document.getElementById('clear')
    };
    
    // Função para converter números brasileiros
    function parseNumber(str) {
      if (!str) return 0;
      return parseFloat(str.replace(',', '.')) || 0;
    }
    
    // Função para formatar moeda
    function formatMoney(value) {
      return 'R$ ' + value.toFixed(2).replace('.', ',');
    }
    
    // Mostrar alerta
    function showAlert(msg) {
      elements.alert.textContent = msg;
      elements.alert.style.display = 'block';
      setTimeout(() => elements.alert.style.display = 'none', 3000);
    }
    
    // Cálculo principal
    function calculate() {
      try {
        const odd = parseNumber(elements.odd.value);
        const stake = parseNumber(elements.stake.value);
        const freebet = parseNumber(elements.freebet.value);
        const rate = parseNumber(elements.rate.value) || 70;
        
        // Validações básicas
        if (odd <= 1) {
          showAlert('Odd deve ser maior que 1.00');
          return;
        }
        
        if (stake <= 0) {
          showAlert('Stake deve ser maior que zero');
          return;
        }
        
        if (freebet <= 0) {
          showAlert('Valor da freebet deve ser maior que zero');
          return;
        }
        
        // Cálculo simplificado FreePro
        const extractionRate = rate / 100;
        const extractedValue = freebet * extractionRate;
        const qualificationLoss = stake - (stake * odd * 0.7); // Aproximação
        const totalStake = stake + Math.abs(qualificationLoss);
        
        elements.result.textContent = formatMoney(totalStake);
        elements.alert.style.display = 'none';
        
        console.log('✅ Cálculo realizado:', { odd, stake, freebet, rate, totalStake });
        
      } catch (error) {
        console.error('❌ Erro no cálculo:', error);
        showAlert('Erro no cálculo: ' + error.message);
      }
    }
    
    // Limpar campos
    function clearFields() {
      elements.odd.value = '';
      elements.stake.value = '';
      elements.freebet.value = '';
      elements.rate.value = '70';
      elements.result.textContent = 'R$ 0,00';
      elements.alert.style.display = 'none';
      console.log('🧹 Campos limpos');
    }
    
    // Event listeners
    if (elements.calc) {
      elements.calc.addEventListener('click', calculate);
      console.log('✅ Botão calcular conectado');
    }
    
    if (elements.clear) {
      elements.clear.addEventListener('click', clearFields);
      console.log('✅ Botão limpar conectado');
    }
    
    // Inicialização
    syncTheme();
    setInterval(syncTheme, 2000);
    
    console.log('✅ FreePro carregado com sucesso!');
    
    // Debug info
    setTimeout(() => {
      console.log('📊 FreePro Debug:', {
        elementos: Object.keys(elements).length,
        temParent: !!parent,
        temDocument: !!document,
        bodyTheme: document.body.getAttribute('data-theme')
      });
    }, 1000);
  </script>
</body>
</html>`;
