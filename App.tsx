import React, { useState, useCallback } from 'react';
import { FundaDimensions, PliegoDimensions, CalculationResults } from './types';
import { calculateOptimization } from './lib/calculator';
import InputForm from './components/InputForm';
import ResultsView from './components/ResultsView';

type View = 'input' | 'results';

const App: React.FC = () => {
  const [view, setView] = useState<View>('input');
  const [funda, setFunda] = useState<FundaDimensions>({ alto: 0, ancho: 0, fuelle: 0 });
  const [pliego, setPliego] = useState<PliegoDimensions>({ ancho: 0, alto: 0 });
  const [cantidad, setCantidad] = useState<number>(0);
  const [results, setResults] = useState<CalculationResults | null>(null);

  const handleCalculate = useCallback((f: FundaDimensions, p: PliegoDimensions, c: number) => {
    setFunda(f);
    setPliego(p);
    setCantidad(c);
    const res = calculateOptimization(f, p, c);
    setResults(res);
    setView('results');
  }, []);

  // Función para volver atrás manteniendo los valores actuales
  const handleBack = () => {
    setView('input');
  };

  // Función para iniciar un proyecto desde cero
  const handleNewProject = () => {
    setFunda({ alto: 0, ancho: 0, fuelle: 0 });
    setPliego({ ancho: 0, alto: 0 });
    setCantidad(0);
    setResults(null);
    setView('input');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {view === 'input' ? (
        <InputForm 
          onCalculate={handleCalculate} 
          initialFunda={funda}
          initialPliego={pliego}
          initialCantidad={cantidad}
        />
      ) : (
        results && (
          <ResultsView 
            results={results} 
            onBack={handleBack} 
            onNewProject={handleNewProject} 
          />
        )
      )}
    </div>
  );
};

export default App;