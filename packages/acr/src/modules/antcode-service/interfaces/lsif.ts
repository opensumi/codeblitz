export interface LSIFPosition {
  line: number;
  character: number;
}

export interface LSIFRange {
  start: LSIFPosition;
  end: LSIFPosition;
}

export interface LSIFBaseParams {
  commit: string;
  path: string;
  position: LSIFPosition;
  repository: string;
}
