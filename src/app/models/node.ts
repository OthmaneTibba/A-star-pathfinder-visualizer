export interface Node {
  row: number;
  col: number;
  normal: boolean;
  target: boolean;
  obstacle: boolean;
  start: boolean;
  path: boolean;
}
