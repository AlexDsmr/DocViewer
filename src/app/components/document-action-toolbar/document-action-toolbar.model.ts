export interface DocumentActionToolbarConfig {
  readonly currentPageNumber: number;
  readonly totalPages: number;
  readonly zoom: number;
  readonly canGoPrevious: boolean;
  readonly canGoNext: boolean;
  readonly canZoomOut: boolean;
  readonly canZoomIn: boolean;
  readonly previousPage: () => void;
  readonly nextPage: () => void;
  readonly zoomOut: () => void;
  readonly zoomIn: () => void;
  readonly fitToView: () => void;
}
