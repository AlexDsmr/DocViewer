import { DocumentPage } from 'src/app/shared/models/document-page.model';

export interface Document {
  readonly id: string;
  readonly name: string;
  readonly pages: readonly DocumentPage[];
}

export interface DocumentSummary {
  readonly id: string;
  readonly name: string;
  readonly pageCount: number;
}
