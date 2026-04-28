import { computed, Injectable, signal } from '@angular/core';

import { PageAnnotation, PageMode } from 'src/app/shared/models/annotation.model';
import { Document } from 'src/app/shared/models/document.model';
import { DocumentPage } from 'src/app/shared/models/document-page.model';

@Injectable()
export class PageEditStateService {
  private readonly modeSignal = signal<PageMode>('view');
  private readonly draftDocumentSignal = signal<Document | null>(null);
  private readonly snapshotDocumentSignal = signal<Document | null>(null);
  private readonly activeAnnotationIdSignal = signal<string | null>(null);

  public readonly mode = this.modeSignal.asReadonly();
  public readonly draftDocument = this.draftDocumentSignal.asReadonly();
  public readonly activeAnnotationId = this.activeAnnotationIdSignal.asReadonly();
  public readonly isEditMode = computed(() => this.modeSignal() === 'edit');

  /**
   * Starts editing from an immutable document snapshot.
   *
   * @param document Source document.
   */
  public enterEdit(document: Document): void {
    const snapshot = this.cloneDocument(document);

    this.snapshotDocumentSignal.set(snapshot);
    this.draftDocumentSignal.set(this.cloneDocument(document));
    this.activeAnnotationIdSignal.set(null);
    this.modeSignal.set('edit');
  }

  /**
   * Restores the document snapshot and leaves edit mode.
   *
   * @returns Restored document snapshot, if edit mode had one.
   */
  public cancelEdit(): Document | null {
    const snapshot = this.snapshotDocumentSignal();

    this.reset();

    return snapshot ? this.cloneDocument(snapshot) : null;
  }

  /**
   * Completes editing and returns a document ready to persist.
   *
   * @returns Current draft document.
   */
  public completeEdit(): Document | null {
    const draft = this.draftDocumentSignal();

    return draft ? this.cloneDocument(draft) : null;
  }

  /** Leaves edit mode after a successful save. */
  public commitEdit(): void {
    this.reset();
  }

  /**
   * Returns annotations for a page from the current draft.
   *
   * @param pageId Page identifier.
   * @returns Page annotations from draft state.
   */
  public getPageAnnotations(pageId: string): readonly PageAnnotation[] {
    return this.findDraftPage(pageId)?.annotations ?? [];
  }

  /**
   * Adds a new annotation to a page.
   *
   * @param pageId Page identifier.
   * @param x Normalized x coordinate.
   * @param y Normalized y coordinate.
   * @returns Created annotation.
   */
  public addAnnotation(pageId: string, x: number, y: number): PageAnnotation | null {
    const annotation: PageAnnotation = {
      id: crypto.randomUUID(),
      pageId,
      description: '',
      x: this.clampRatio(x),
      y: this.clampRatio(y),
    };

    this.updatePage(pageId, (page) => ({
      ...page,
      annotations: [...page.annotations, annotation],
    }));
    this.activeAnnotationIdSignal.set(annotation.id);

    return annotation;
  }

  /**
   * Updates annotation text.
   *
   * @param id Annotation identifier.
   * @param description New annotation text.
   */
  public updateAnnotation(id: string, description: string): void {
    this.updateAnnotationById(id, (annotation) => ({
      ...annotation,
      description,
    }));
  }

  /**
   * Moves annotation anchor point.
   *
   * @param id Annotation identifier.
   * @param x Normalized x coordinate.
   * @param y Normalized y coordinate.
   */
  public moveAnnotation(id: string, x: number, y: number): void {
    this.updateAnnotationById(id, (annotation) => ({
      ...annotation,
      x: this.clampRatio(x),
      y: this.clampRatio(y),
    }));
  }

  /**
   * Deletes an annotation by id.
   *
   * @param id Annotation identifier.
   */
  public deleteAnnotation(id: string): void {
    this.draftDocumentSignal.update((document) => {
      if (!document) {
        return document;
      }

      return {
        ...document,
        pages: document.pages.map((page) => ({
          ...page,
          annotations: page.annotations.filter((annotation) => annotation.id !== id),
        })),
      };
    });

    if (this.activeAnnotationIdSignal() === id) {
      this.activeAnnotationIdSignal.set(null);
    }
  }

  /**
   * Marks annotation as currently edited.
   *
   * @param id Annotation identifier.
   */
  public setActiveAnnotation(id: string | null): void {
    this.activeAnnotationIdSignal.set(id);
  }

  /** Clears edit state. */
  public reset(): void {
    this.modeSignal.set('view');
    this.draftDocumentSignal.set(null);
    this.snapshotDocumentSignal.set(null);
    this.activeAnnotationIdSignal.set(null);
  }

  private updateAnnotationById(
    id: string,
    updater: (annotation: PageAnnotation) => PageAnnotation,
  ): void {
    this.draftDocumentSignal.update((document) => {
      if (!document) {
        return document;
      }

      return {
        ...document,
        pages: document.pages.map((page) => ({
          ...page,
          annotations: page.annotations.map((annotation) =>
            annotation.id === id ? updater(annotation) : annotation,
          ),
        })),
      };
    });
  }

  private updatePage(pageId: string, updater: (page: DocumentPage) => DocumentPage): void {
    this.draftDocumentSignal.update((document) => {
      if (!document) {
        return document;
      }

      return {
        ...document,
        pages: document.pages.map((page) => (page.id === pageId ? updater(page) : page)),
      };
    });
  }

  private findDraftPage(pageId: string): DocumentPage | undefined {
    return this.draftDocumentSignal()?.pages.find((page) => page.id === pageId);
  }

  private cloneDocument(document: Document): Document {
    return structuredClone(document);
  }

  private clampRatio(value: number): number {
    return Math.min(Math.max(value, 0), 1);
  }
}
