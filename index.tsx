import React, { useState } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askGemini = async () => {
    setLoading(true);
    // Nota: Aquí iría la conexión con la API Key que configuraremos luego
    setResponse("Conectando con Gemini... (Aquí verás la respuesta)");
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>🤖 Mi IA Personal</h1>
      <textarea 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe tu duda aquí..."
        style={{ width: '100%', height: '100px', borderRadius: '10px', padding: '10px' }}
      />
      <br />
      <button 
        onClick={askGemini}
        style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}
      >
        {loading ? 'Pensando...' : 'Preguntar a la IA'}
      </button>
      <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
        <strong>Respuesta:</strong>
        <p>{response}</p>
      </div>
    </div>
  );
}

export default App;
