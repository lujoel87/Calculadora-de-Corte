import React from 'react';
import { CalculationResults } from '../types';

interface ResultsViewProps {
  results: CalculationResults;
  onBack: () => void;
  onNewProject: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ results, onBack, onNewProject }) => {
  const {
    cutHeight,
    cutWidth,
    pliegoAncho,
    pliegoAlto,
    piezasPorPliego,
    totalPliegos,
    totalPiezas,
    desperdicio,
    layoutBlocks
  } = results;

  const realAspectRatio = pliegoAncho / pliegoAlto;
  const cutSizeBadgeClasses = "text-[16px] font-black dark:text-white bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 tabular-nums min-w-[60px] text-center";
  const highlightValueClasses = "text-[16px] font-black leading-none tracking-tight tabular-nums";
  const titleClasses = "text-[11px] font-black text-white uppercase tracking-widest";

  // Variable para controlar que solo se muestre la medida en una pieza
  let hasShownLabel = false;

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark min-h-screen">
      <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 ios-blur border-b border-slate-200 dark:border-white/10 px-4 py-3 flex items-center justify-between text-slate-900 dark:text-white">
        <button 
          onClick={onBack} 
          className="p-2 -ml-2 text-primary active:opacity-50 transition-opacity"
          aria-label="Volver y editar"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h1 className={`${titleClasses} text-center flex-1`}>
          RESULTADO DEL CORTE
        </h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 max-w-md mx-auto w-full pb-44">
        
        {/* Gráfico a Escala Real */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] uppercase tracking-widest font-black text-white">Distribución del Corte</span>
            <span className="text-[11px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20 tabular-nums">
              {pliegoAncho} × {pliegoAlto} cm
            </span>
          </div>

          <div className="relative w-full h-[320px] bg-white dark:bg-[#090e14] rounded-3xl border border-slate-200 dark:border-white/5 p-12 flex items-center justify-center shadow-inner sheet-grid-pattern overflow-hidden">
            <div 
              className="relative transition-all duration-500 ease-out flex items-center justify-center"
              style={{
                aspectRatio: `${realAspectRatio}`,
                maxWidth: '100%',
                maxHeight: '100%',
                width: realAspectRatio > 1 ? '100%' : 'auto',
                height: realAspectRatio > 1 ? 'auto' : '100%'
              }}
            >
              {/* Dimensiones del Pliego */}
              <div className="absolute -top-7 left-0 right-0 flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-600 pointer-events-none">
                 <div className="h-2 w-px bg-current"></div>
                 <div className="flex-1 border-t border-dashed border-current mx-2 flex items-center justify-center">
                   <span className="px-1 tabular-nums whitespace-nowrap">{pliegoAncho} cm</span>
                 </div>
                 <div className="h-2 w-px bg-current"></div>
              </div>

              <div className="absolute top-0 bottom-0 -left-7 flex flex-col items-center justify-between text-[10px] font-bold text-slate-400 dark:text-slate-600 pointer-events-none">
                 <div className="w-2 h-px bg-current"></div>
                 <div className="flex-1 border-l border-dashed border-current my-2 flex items-center justify-center">
                   <span className="py-1 [writing-mode:vertical-lr] rotate-180 tabular-nums whitespace-nowrap">{pliegoAlto} cm</span>
                 </div>
                 <div className="w-2 h-px bg-current"></div>
              </div>

              {/* El Pliego con los Cortes */}
              <div className="w-full h-full relative bg-slate-50 dark:bg-white/5 border-[1.5px] border-slate-400 dark:border-slate-500 shadow-2xl overflow-hidden">
                {layoutBlocks.map((block, bIdx) => (
                  <div 
                    key={bIdx}
                    className="absolute"
                    style={{
                      left: `${(block.x / pliegoAncho) * 100}%`,
                      top: `${(block.y / pliegoAlto) * 100}%`,
                      width: `${(block.width / pliegoAncho) * 100}%`,
                      height: `${(block.height / pliegoAlto) * 100}%`,
                      display: 'grid',
                      gridTemplateColumns: `repeat(${block.cols}, 1fr)`,
                      gridTemplateRows: `repeat(${block.rows}, 1fr)`,
                    }}
                  >
                    {Array.from({ length: block.cols * block.rows }).map((_, i) => {
                      // Solo mostramos la medida en la primera pieza horizontal que encontremos
                      const showLabel = !hasShownLabel && !block.rotated;
                      if (showLabel) hasShownLabel = true;

                      return (
                        <div 
                          key={i} 
                          className={`flex flex-col items-center justify-center border-[0.5px] border-white/30 dark:border-black/30 relative ${block.rotated ? 'bg-indigo-500/50' : 'bg-primary/50'}`}
                        >
                          {showLabel && (
                            <div className="flex flex-col items-center justify-center pointer-events-none text-center p-0.5 overflow-hidden">
                              <span className="text-[7px] sm:text-[9px] font-black text-white leading-none tracking-tighter truncate w-full">
                                {block.cutW}×{block.cutH}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Resumen de Cálculo */}
        <section className="bg-white dark:bg-card-dark border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/20 dark:shadow-none">
          <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
             <span className={titleClasses}>Resumen de Cálculo</span>
          </div>
          
          <div className="divide-y divide-slate-100 dark:divide-white/5 px-6">
            <div className="flex justify-between items-center py-5">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 font-medium">Tamaño del corte</span>
              <span className={cutSizeBadgeClasses}>
                {cutHeight} × {cutWidth} <span className="text-[10px] text-slate-400 font-bold ml-1">cm</span>
              </span>
            </div>
            
            <div className="flex justify-between items-center py-5">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 font-medium">Tamaños por pliego</span>
              <span className={`${highlightValueClasses} text-primary`}>
                {piezasPorPliego}
              </span>
            </div>

            <div className="flex justify-between items-center py-5">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 font-medium">Pliegos necesarios</span>
              <span className={`${highlightValueClasses} text-primary`}>
                {totalPliegos}
              </span>
            </div>

            <div className="flex justify-between items-center py-5">
              <span className="text-[15px] text-slate-600 dark:text-slate-400 font-medium">Total tamaños</span>
              <span className={`${highlightValueClasses} text-primary`}>
                {totalPiezas}
              </span>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background-light/90 dark:bg-background-dark/90 ios-blur border-t border-slate-200 dark:border-white/5">
        <div className="max-w-md mx-auto">
          <button 
            onClick={onNewProject}
            className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center"
          >
            <span>Nuevo Cálculo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;