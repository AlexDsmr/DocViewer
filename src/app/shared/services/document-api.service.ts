import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Document, DocumentSummary } from 'src/app/shared/models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';

  /**
   * Loads available document summaries.
   *
   * @returns Stream with documents prepared for list rendering.
   */
  public getDocuments(): Observable<readonly DocumentSummary[]> {
    return this.http.get<readonly Document[]>(`${this.apiUrl}/documents`).pipe(
      map((documents) =>
        documents.map((document) => ({
          id: document.id,
          name: document.name,
          pageCount: document.pages.length
        }))
      )
    );
  }

  /**
   * Loads a document by its identifier.
   *
   * @param id Document identifier from the route.
   * @returns Stream with a single document.
   */
  public getDocument(id: string): Observable<Document> {
    return this.http.get<Document>(`${this.apiUrl}/documents/${id}`);
  }

  /**
   * Replaces a document with updated data.
   *
   * @param document Document with persisted changes.
   * @returns Stream with the updated document.
   */
  public updateDocument(document: Document): Observable<Document> {
    return this.http.put<Document>(`${this.apiUrl}/documents/${document.id}`, document);
  }
}
