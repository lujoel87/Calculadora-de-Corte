
export interface FundaDimensions {
  alto: number;
  ancho: number;
  fuelle: number;
}

export interface PliegoDimensions {
  ancho: number;
  alto: number;
}

export interface LayoutBlock {
  width: number;
  height: number;
  x: number;
  y: number;
  cols: number;
  rows: number;
  cutW: number;
  cutH: number;
  rotated: boolean;
}

export interface CalculationResults {
  cutHeight: number;
  cutWidth: number;
  pliegoAncho: number;
  pliegoAlto: number;
  piezasPorPliego: number;
  totalPliegos: number;
  totalPiezas: number;
  sobrantes: number;
  desperdicio: number;
  layoutBlocks: LayoutBlock[];
}
