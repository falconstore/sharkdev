// PASSO 12 - assets/js/calculators/freepro-content.js
// HTML completo da calculadora FreePro que roda no iframe

export function getFreeProfHTML() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>FreePro</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      padding: 20px; 
      background: transparent; 
      color: #fff; 
    }
    .card { 
      background: rgba(31, 41, 59, 0.8); 
      padding: 15px; 
      margin: 10px 0; 
      border-radius: 8px; 
      border: 1px solid #4b5563; 
    }
    .input { 
      width: 100%; 
      padding: 8px; 
      margin: 5px 0; 
      border: 1px solid #666; 
      border-radius: 4px; 
      background: #374151; 
      color: #fff; 
    }
    .btn { 
      padding: 10px 20px; 
      margin: 5px; 
      border: none; 
      border-radius: 4px; 
      cursor: pointer; 
      font-weight: bold; 
    }
    .btn-primary { background: #3b82f6; color: white; }
    .btn-secondary { background: #6b7280; color: white; }
    .result { 
      text-align: center; 
      font-size: 24px; 
      font-weight: bold; 
      color: #3b82f6; 
      padding: 20px; 
      background: rgba(59, 130, 246, 0.1); 
      border-radius: 8px; 
      margin: 15px 0; 
    }
    h1 { 
      text-align: center; 
      color: #3b82f6; 
      margin-bottom: 20px; 
    }
  </style>
</head>
<body>
  <h1>FreePro Calculator</h1>
  
  <div class="card">
    <label>Odd da Casa:</label>
    <input type="text" id="odd" class="input" placeholder="3.00">
  </div>
  
  <div class="card">
    <label>Stake:</label>
    <input type="text" id="stake" class="input" placeholder="50">
  </div>
  
  <div class="card">
    <label>Freebet:</label>
    <input type="text" id="freebet" class="input" placeholder="50">
  </div>
  
  <div class="result" id="result">R$ 0,00</div>
  
  <div style="text-align: center;">
    <button class="btn btn-primary" onclick="calc()">Calcular</button>
    <button class="btn btn-secondary" onclick="clear()">Limpar</button>
  </div>

  <script>
    console.log('FreePro iniciado');
    
    function calc() {
      console.log('Calculando...');
      try {
        var odd = parseFloat(document.getElementById('odd').value.replace(',', '.')) || 0;
        var stake = parseFloat(document.getElementById('stake').value.replace(',', '.')) || 0;
        var freebet = parseFloat(document.getElementById('freebet').value.replace(',', '.')) || 0;
        
        if (odd <= 1 || stake <= 0 || freebet <= 0) {
          alert('Preencha todos os campos corretamente');
          return;
        }
        
        var total = stake + freebet * 0.7;
        document.getElementById('result').textContent = 'R$ ' + total.toFixed(2).replace('.', ',');
        console.log('Resultado:', total);
      } catch (e) {
        console.error('Erro:', e);
        alert('Erro no cálculo');
      }
    }
    
    function clear() {
      console.log('Limpando...');
      document.getElementById('odd').value = '';
      document.getElementById('stake').value = '';
      document.getElementById('freebet').value = '';
      document.getElementById('result').textContent = 'R$ 0,00';
    }
    
    console.log('FreePro pronto!');
  </script>
</body>
</html>`;
