import { PageMode } from 'src/app/shared/models/annotation.model';

export interface DocumentActionToolbarConfig {
  readonly mode: PageMode;
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
  readonly edit: () => void;
  readonly save: () => void;
  readonly cancel: () => void;
}
