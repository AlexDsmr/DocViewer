import { PageAnnotation } from 'src/app/shared/models/annotation.model';

export type DocumentPageType = 'image';

export interface DocumentPage {
  readonly id: string;
  readonly number: number;
  readonly type: DocumentPageType;
  readonly imageUrl: string;
  readonly annotations: readonly PageAnnotation[];
}
