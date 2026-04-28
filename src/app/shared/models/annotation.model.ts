export type PageMode = 'view' | 'edit';

export interface PageAnnotation {
  readonly id: string;
  readonly pageId: string;
  readonly description: string;
  readonly x: number;
  readonly y: number;
}
