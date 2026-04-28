export type DocumentPageType = 'image';

export interface DocumentPage {
  readonly number: number;
  readonly type: DocumentPageType;
  readonly imageUrl: string;
}
