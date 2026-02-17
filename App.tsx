import React, { useState } from 'react';

function App() {
  const [ancho, setAncho] = useState('');
  const [alto, setAlto] = useState('');
  const [resultado, setResultado] = useState<string | null>(null);

  const calcular = () => {
    const res = (Number(ancho) * Number(alto)) / 10; // Ejemplo de cálculo
    setResultado(`El área total es: ${res} unidades.`);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <h1>📐 Calculadora de Corte</h1>
      <div style={{ marginBottom: '15px' }}>
        <input type="number" placeholder="Ancho" value={ancho} onChange={(e) => setAncho(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: 'none' }} />
      </div>
      <div style={{ marginBottom: '15px' }}>
        <input type="number" placeholder="Alto" value={alto} onChange={(e) => setAlto(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: 'none' }} />
      </div>
      <button onClick={calcular} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        CALCULAR
      </button>
      {resultado && <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #4CAF50', borderRadius: '10px' }}>{resultado}</div>}
    </div>
  );
}

export default App;
