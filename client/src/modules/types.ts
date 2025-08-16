export type RectId = string;

export interface Rectangle {
  id: RectId;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}
