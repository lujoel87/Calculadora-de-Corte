import React, { useState } from 'react';
import { FundaDimensions, PliegoDimensions } from '../types';

interface InputFormProps {
  onCalculate: (funda: FundaDimensions, pliego: PliegoDimensions, cantidad: number) => void;
  initialFunda: FundaDimensions;
  initialPliego: PliegoDimensions;
  initialCantidad: number;
}

const InputForm: React.FC<InputFormProps> = ({ onCalculate, initialFunda, initialPliego, initialCantidad }) => {
  const [funda, setFunda] = useState<FundaDimensions>(initialFunda);
  const [pliego, setPliego] = useState<PliegoDimensions>(initialPliego);
  const [cantidad, setCantidad] = useState<number>(initialCantidad);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(funda, pliego, cantidad);
  };

  const updateFunda = (field: keyof FundaDimensions, val: string) => {
    setFunda(prev => ({ ...prev, [field]: parseFloat(val) || 0 }));
  };

  const updatePliego = (field: keyof PliegoDimensions, val: string) => {
    setPliego(prev => ({ ...prev, [field]: parseFloat(val) || 0 }));
  };

  // Clase común para los títulos en blanco (11px black weight)
  const titleClasses = "text-[11px] font-black text-white uppercase tracking-widest";

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark min-h-screen">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 ios-blur border-b border-slate-200 dark:border-white/10 px-4 py-3 flex items-center justify-between">
        <button className="p-2 -ml-2 text-primary opacity-30 cursor-not-allowed">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h1 className={`${titleClasses} text-center flex-1`}>
          CALCULADORA DE CORTE
        </h1>
        <button className="p-2 -mr-2 text-primary">
          <span className="material-symbols-outlined">info</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-8 max-w-md mx-auto w-full pb-32">
        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="space-y-4">
            <h2 className={titleClasses}>Tamaño de Funda</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">Alto (cm)</label>
                <input 
                  className="w-full bg-transparent border border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-3 py-4 text-lg font-semibold transition-all outline-none" 
                  type="number" 
                  value={funda.alto || ''}
                  onChange={(e) => updateFunda('alto', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">Ancho (cm)</label>
                <input 
                  className="w-full bg-transparent border border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-3 py-4 text-lg font-semibold transition-all outline-none" 
                  type="number" 
                  value={funda.ancho || ''}
                  onChange={(e) => updateFunda('ancho', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">Fuelle (cm)</label>
                <input 
                  className="w-full bg-transparent border border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-3 py-4 text-lg font-semibold transition-all outline-none" 
                  type="number" 
                  value={funda.fuelle || ''}
                  onChange={(e) => updateFunda('fuelle', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </section>

          <div className="h-px bg-slate-200 dark:bg-white/10"></div>

          <section className="space-y-4">
            <h2 className={titleClasses}>Tamaño de Pliego</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">Ancho (cm)</label>
                <input 
                  className="w-full bg-transparent border border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-4 text-xl font-semibold transition-all outline-none" 
                  type="number" 
                  value={pliego.ancho || ''}
                  onChange={(e) => updatePliego('ancho', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">Alto (cm)</label>
                <input 
                  className="w-full bg-transparent border border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-4 text-xl font-semibold transition-all outline-none" 
                  type="number" 
                  value={pliego.alto || ''}
                  onChange={(e) => updatePliego('alto', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </section>

          <div className="h-px bg-slate-200 dark:bg-white/10"></div>

          <section className="space-y-4">
            <h2 className={titleClasses}>Cantidad de Piezas Totales</h2>
            <div className="space-y-2">
              <input 
                className="w-full bg-transparent border border-slate-200 dark:border-slate-800 focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-4 text-xl font-semibold transition-all outline-none" 
                type="number" 
                value={cantidad || ''}
                onChange={(e) => setCantidad(parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </section>

          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/90 dark:bg-background-dark/90 ios-blur border-t border-slate-200 dark:border-white/10">
            <div className="max-w-md mx-auto">
              <button 
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center"
              >
                <span>Calcular</span>
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default InputForm;