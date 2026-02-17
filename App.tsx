import React, { useState } from 'react';

function App() {
  const [ancho, setAncho] = useState('');
  const [alto, setAlto] = useState('');
  const [resultado, setResultado] = useState('');

  const calcular = () => {
    if(!ancho || !alto) return;
    const res = (Number(ancho) * Number(alto));
    setResultado(`Área total: ${res} cm²`);
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', background: '#222', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#4CAF50' }}>📐 CALCULADORA DE CORTE</h1>
      <div style={{ margin: '20px 0' }}>
        <input 
          type="number" 
          placeholder="Ancho (cm)" 
          value={ancho} 
          onChange={(e) => setAncho(e.target.value)} 
          style={{ padding: '15px', borderRadius: '8px', width: '80%', marginBottom: '10px' }} 
        />
        <input 
          type="number" 
          placeholder="Alto (cm)" 
          value={alto} 
          onChange={(e) => setAlto(e.target.value)} 
          style={{ padding: '15px', borderRadius: '8px', width: '80%' }} 
        />
      </div>
      <button 
        onClick={calcular} 
        style={{ padding: '15px 30px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold' }}
      >
        CALCULAR AHORA
      </button>
      {resultado && (
        <div style={{ marginTop: '30px', fontSize: '24px', border: '2px solid #4CAF50', padding: '20px', borderRadius: '10px' }}>
          {resultado}
        </div>
      )}
    </div>
  );
}

export default App;
