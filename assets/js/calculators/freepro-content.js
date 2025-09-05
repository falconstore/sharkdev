// PASSO 12 - assets/js/calculators/freepro-content.js
// HTML completo da calculadora FreePro que roda no iframe

export function getFreeProfHTML() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Calculadora FreePro</title>
  <style>
    :root {
      --primary: #3b82f6;
      --secondary: #22c55e;
      --accent: #8b5cf6;
      --warning: #f59e0b;
      --danger: #dc2626;
      --success: #22c55e;
      --bg-primary: #111827;
      --bg-secondary: #1f2937;
      --bg-card: #374151;
      --text-primary: #f9fafb;
      --text-secondary: #d1d5db;
      --text-muted: #9ca3af;
      --border: #4b5563;
    }

    [data-theme="light"] {
      --bg-primary: #f8fafc;
      --bg-secondary: #f1f5f9;
      --bg-card: #ffffff;
      --text-primary: #1e293b;
      --text-secondary: #475569;
      --text-muted: #64748b;
      --border: #e2e8f0;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    html, body {
      background: transparent;
      color: var(--text-primary);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.5;
      padding: 1rem;
      margin: 0;
      overflow: visible;
      height: auto;
      transition: color 0.3s ease;
    }

    .calc-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .calc-title {
      font-size: 1.75rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }

    .calc-subtitle {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .card {
      background: rgba(31, 41, 59, 0.8);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 1rem;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
    }

    [data-theme="light"] .card {
      background: rgba(255, 255, 255, 0.9);
    }

    .form-group {
      margin-bottom: 0.75rem;
    }

    .form-label {
      display: block;
      font-weight: 600;
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-bottom: 0.375rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid var(--border);
      border-radius: 8px;
      background: rgba(17, 24, 39, 0.8);
      color: var(--text-primary);
      font-size: 0.875rem;
      transition: all 0.2s ease;
    }

    [data-theme="light"] .form-control {
      background: rgba(255, 255, 255, 0.9);
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-transform: uppercase;
      font-size: 0.75rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      color: white;
    }

    .btn-secondary {
      background: rgba(55, 65, 81, 0.8);
      color: var(--text-primary);
      border: 2px solid var(--border);
      transition: all 0.3s ease;
    }

    [data-theme="light"] .btn-secondary {
      background: rgba(255, 255, 255, 0.9);
    }

    .actions {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      margin: 1.5rem 0;
    }

    .alert {
      padding: 1rem;
      border-radius: 8px;
      margin: 1rem 0;
      font-weight: 600;
      display: none;
    }

    .alert-warning {
      background: rgba(245, 158, 11, 0.1);
      border: 2px solid var(--warning);
      color: #fbbf24;
    }

    .total-display {
      text-align: center;
      padding: 1.5rem;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(34, 197, 94, 0.05));
      border: 2px solid var(--primary);
      border-radius: 12px;
      margin: 1rem 0;
    }

    .total-value {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--primary);
      font-family: ui-monospace, monospace;
    }
  </style>
</head>
<body>
  <div class="calc-header">
    <h1 class="calc-title">Calculadora Shark FreePro</h1>
    <p class="calc-subtitle">Otimize seus lucros com freebets de apostas seguras</p>
  </div>

  <div class="card">
    <div class="form-group">
      <label class="form-label" for="numEntradas">Número de Entradas</label>
      <select id="numEntradas" class="form-control">
        <option value="2">2 Mercados</option>
        <option value="3" selected>3 Mercados</option>
        <option value="4">4 Mercados</option>
        <option value="5">5 Mercados</option>
        <option value="6">6 Mercados</option>
      </select>
    </div>
  </div>

  <div class="card">
    <h3>Casa Promoção</h3>
    <div class="form-group">
      <label class="form-label" for="o1">Odd da Casa</label>
      <input id="o1" class="form-control" placeholder="ex: 3.00" />
    </div>
    <div class="form-group">
      <label class="form-label" for="F">Valor da Freebet</label>
      <input id="F" class="form-control" placeholder="ex: 50" />
    </div>
  </div>

  <div class="total-display">
    <div style="font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 0.375rem;">Stake Total</div>
    <div class="total-value" id="k_S">R$ 0,00</div>
  </div>

  <div class="actions">
    <button class="btn btn-primary" id="calcBtn">Calcular</button>
    <button class="btn btn-secondary" id="clearBtn">Limpar</button>
  </div>

  <div id="status" class="alert alert-warning"></div>

<script>
'use strict';

// Sincronização de tema
(function() {
  function syncTheme() {
    try {
      const parentTheme = parent.document.body.getAttribute('data-theme');
      if (parentTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
      } else {
        document.body.removeAttribute('data-theme');
      }
    } catch (e) {
      // Fallback
    }
  }
  
  syncTheme();
  setInterval(syncTheme, 1000);
})();

// JavaScript simples
function $(id) { return document.getElementById(id); }

function calc() {
  try {
    const o1 = parseFloat($("o1").value) || 0;
    const F = parseFloat($("F").value) || 0;
    
    if (o1 <= 1) {
      $("status").style.display = 'block';
      $("status").textContent = 'Informe uma odd válida';
      return;
    }
    
    if (F <= 0) {
      $("status").style.display = 'block';
      $("status").textContent = 'Informe o valor da freebet';
      return;
    }
    
    $("status").style.display = 'none';
    
    const total = F * o1;
    $("k_S").textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
    
  } catch (error) {
    console.error('Erro no cálculo:', error);
    $("status").style.display = 'block';
    $("status").textContent = 'Erro no cálculo';
  }
}

function clear() {
  $("o1").value = '';
  $("F").value = '';
  $("k_S").textContent = 'R$ 0,00';
  $("status").style.display = 'none';
}

// Event listeners
$("calcBtn").addEventListener('click', calc);
$("clearBtn").addEventListener('click', clear);

console.log('FreePro carregado com sucesso');
</script>
</body>
</html>`;
