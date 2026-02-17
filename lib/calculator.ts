import { FundaDimensions, PliegoDimensions, CalculationResults, LayoutBlock } from '../types';

export const calculateOptimization = (
  funda: FundaDimensions,
  pliego: PliegoDimensions,
  cantidadDeseada: number
): CalculationResults => {
  // Fórmulas específicas de fabricación de fundas
  const cutH = funda.alto + 2.5 + (funda.fuelle / 2);
  const cutW = (2 * funda.ancho) + (2 * funda.fuelle) + 2;

  if (cutH <= 0 || cutW <= 0 || pliego.ancho <= 0 || pliego.alto <= 0) {
    return {
      cutHeight: cutH, cutWidth: cutW, pliegoAncho: pliego.ancho, pliegoAlto: pliego.alto,
      piezasPorPliego: 0, totalPliegos: 0, totalPiezas: 0, sobrantes: 0, desperdicio: 100,
      layoutBlocks: []
    };
  }

  interface Solution {
    total: number;
    blocks: LayoutBlock[];
  }

  const findBestFit = (pW: number, pH: number, cW: number, cH: number, xOff = 0, yOff = 0, depth = 0): Solution => {
    if (pW <= 0 || pH <= 0 || depth > 4) return { total: 0, blocks: [] };

    // 1. Orientación Normal
    const colsV = Math.floor(pW / cW);
    const rowsV = Math.floor(pH / cH);
    const totalV = colsV > 0 && rowsV > 0 ? colsV * rowsV : 0;

    // 2. Orientación Rotada
    const colsR = Math.floor(pW / cH);
    const rowsR = Math.floor(pH / cW);
    const totalR = colsR > 0 && rowsR > 0 ? colsR * rowsR : 0;

    let best: Solution = { total: 0, blocks: [] };

    // IMPORTANTE: Se usa el ancho/alto REAL usado (cols * cW) para que el gráfico no se estire
    if (totalV >= totalR && totalV > 0) {
      best = {
        total: totalV,
        blocks: [{ x: xOff, y: yOff, width: colsV * cW, height: rowsV * cH, cols: colsV, rows: rowsV, cutW: cW, cutH: cH, rotated: false }]
      };
    } else if (totalR > 0) {
      best = {
        total: totalR,
        blocks: [{ x: xOff, y: yOff, width: colsR * cH, height: rowsR * cW, cols: colsR, rows: rowsR, cutW: cH, cutH: cW, rotated: true }]
      };
    }

    // Estrategia de división recursiva (Nesting Mixto)
    if (totalV > 0) {
      const usedW = colsV * cW;
      const usedH = rowsV * cH;

      const solRight = findBestFit(pW - usedW, pH, cW, cH, xOff + usedW, yOff, depth + 1);
      const solBottom = findBestFit(usedW, pH - usedH, cW, cH, xOff, yOff + usedH, depth + 1);

      const totalA = totalV + solRight.total + solBottom.total;
      if (totalA > best.total) {
        best = {
          total: totalA,
          blocks: [
            { x: xOff, y: yOff, width: usedW, height: usedH, cols: colsV, rows: rowsV, cutW: cW, cutH: cH, rotated: false },
            ...solRight.blocks,
            ...solBottom.blocks
          ]
        };
      }
    }

    if (totalR > 0) {
      const usedW = colsR * cH;
      const usedH = rowsR * cW;

      const solRight = findBestFit(pW - usedW, pH, cW, cH, xOff + usedW, yOff, depth + 1);
      const solBottom = findBestFit(usedW, pH - usedH, cW, cH, xOff, yOff + usedH, depth + 1);

      const totalB = totalR + solRight.total + solBottom.total;
      if (totalB > best.total) {
        best = {
          total: totalB,
          blocks: [
            { x: xOff, y: yOff, width: usedW, height: usedH, cols: colsR, rows: rowsR, cutW: cH, cutH: cW, rotated: true },
            ...solRight.blocks,
            ...solBottom.blocks
          ]
        };
      }
    }

    return best;
  };

  const finalResult = findBestFit(pliego.ancho, pliego.alto, cutW, cutH);
  
  const piezasPorPliego = finalResult.total;
  const totalPliegos = piezasPorPliego > 0 ? Math.ceil(cantidadDeseada / piezasPorPliego) : 0;
  const totalPiezas = totalPliegos * piezasPorPliego;
  const areaUtilizada = piezasPorPliego * (cutH * cutW);
  const areaPliego = pliego.ancho * pliego.alto;
  const desperdicio = areaPliego > 0 ? (1 - (areaUtilizada / areaPliego)) * 100 : 0;

  return {
    cutHeight: Number(cutH.toFixed(2)),
    cutWidth: Number(cutW.toFixed(2)),
    pliegoAncho: pliego.ancho,
    pliegoAlto: pliego.alto,
    piezasPorPliego,
    totalPliegos,
    totalPiezas,
    sobrantes: Math.max(0, totalPiezas - cantidadDeseada),
    desperdicio: Number(desperdicio.toFixed(2)),
    layoutBlocks: finalResult.blocks
  };
};