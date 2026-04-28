import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, concat, map, of, switchMap, tap } from 'rxjs';

import { DocumentActionToolbarComponent } from 'src/app/components/document-action-toolbar/document-action-toolbar.component';
import { DocumentActionToolbarConfig } from 'src/app/components/document-action-toolbar/document-action-toolbar.model';
import { DocumentPageViewerComponent } from 'src/app/components/document-page-viewer/document-page-viewer.component';
import { PanScrollDirective } from 'src/app/shared/directives/pan-scroll.directive';
import { Document } from 'src/app/shared/models/document.model';
import { PageImageSize } from 'src/app/shared/models/viewer-state.model';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { DocumentApiService } from 'src/app/shared/services/document-api.service';
import { PageEditStateService } from 'src/app/shared/services/page-edit-state.service';

type DocumentViewerState =
  | { readonly status: 'loading' }
  | { readonly status: 'loaded'; readonly document: Document }
  | { readonly status: 'error'; readonly message: string };

@Component({
  selector: 'app-document-viewer-page',
  imports: [DocumentActionToolbarComponent, DocumentPageViewerComponent, PanScrollDirective],
  templateUrl: './document-viewer-page.component.html',
  styleUrl: './document-viewer-page.component.scss',
  providers: [PageEditStateService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewerPageComponent implements AfterViewInit {
  private readonly viewerArea = viewChild<ElementRef<HTMLElement>>('viewerArea');

  public readonly id = input.required<string>();

  protected readonly currentPageIndex = signal(0);
  protected readonly imageSize = signal<PageImageSize | null>(null);
  protected readonly isFitMode = signal(true);
  protected readonly savedDocument = signal<Document | null>(null);
  protected readonly zoom = signal(100);

  private readonly documentApi = inject(DocumentApiService);
  private readonly breadcrumbService = inject(BreadcrumbService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly pageEditState = inject(PageEditStateService);

  protected readonly documentState = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) =>
        concat(
          of<DocumentViewerState>({ status: 'loading' }),
          this.documentApi.getDocument(id).pipe(
            tap((document) => this.setLoadedDocumentState(document)),
            map((document): DocumentViewerState => ({ status: 'loaded', document })),
            catchError(() =>
              of<DocumentViewerState>({
                status: 'error',
                message: `Document "${id}" was not found. Check that mock API is running.`,
              }),
            ),
          ),
        ),
      ),
    ),
    { initialValue: { status: 'loading' } satisfies DocumentViewerState },
  );

  protected readonly document = computed(() => {
    const state = this.documentState();

    if (this.pageEditState.draftDocument()) {
      return this.pageEditState.draftDocument();
    }

    return state.status === 'loaded' ? this.savedDocument() ?? state.document : null;
  });
  protected readonly errorMessage = computed(() => {
    const state = this.documentState();

    return state.status === 'error' ? state.message : '';
  });
  protected readonly totalPages = computed(() => this.document()?.pages.length ?? 0);
  protected readonly currentPage = computed(() => {
    const document = this.document();

    return document?.pages[this.currentPageIndex()] ?? null;
  });
  protected readonly currentPageNumber = computed(() => this.currentPage()?.number ?? 0);
  protected readonly canGoPrevious = computed(() => this.currentPageIndex() > 0);
  protected readonly canGoNext = computed(() => this.currentPageIndex() < this.totalPages() - 1);
  protected readonly canZoomOut = computed(() => this.zoom() > this.minZoom);
  protected readonly canZoomIn = computed(() => this.zoom() < this.maxZoom);
  protected readonly actionToolbarConfig = computed<DocumentActionToolbarConfig>(() => ({
    mode: this.pageEditState.mode(),
    currentPageNumber: this.currentPageNumber(),
    totalPages: this.totalPages(),
    zoom: this.zoom(),
    canGoPrevious: this.canGoPrevious() && !this.pageEditState.isEditMode(),
    canGoNext: this.canGoNext() && !this.pageEditState.isEditMode(),
    canZoomOut: this.canZoomOut(),
    canZoomIn: this.canZoomIn(),
    previousPage: () => this.previousPage(),
    nextPage: () => this.nextPage(),
    zoomOut: () => this.zoomOut(),
    zoomIn: () => this.zoomIn(),
    fitToView: () => this.fitToView(),
    edit: () => this.edit(),
    save: () => this.save(),
    cancel: () => this.cancel(),
  }));

  private readonly minZoom = 50;
  private readonly maxZoom = 300;
  private readonly zoomStep = 25;

  public ngAfterViewInit(): void {
    const viewerArea = this.viewerArea()?.nativeElement;

    if (!viewerArea) {
      return;
    }

    const observer = new ResizeObserver(() => {
      if (this.isFitMode()) {
        this.updateFitZoom();
      }
    });

    observer.observe(viewerArea);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private previousPage(): void {
    if (!this.canGoPrevious() || this.pageEditState.isEditMode()) {
      return;
    }

    this.currentPageIndex.update((index) => index - 1);
    this.imageSize.set(null);
  }

  private nextPage(): void {
    if (!this.canGoNext() || this.pageEditState.isEditMode()) {
      return;
    }

    this.currentPageIndex.update((index) => index + 1);
    this.imageSize.set(null);
  }

  private zoomOut(): void {
    this.isFitMode.set(false);
    this.zoom.update((zoom) => this.clampZoom(zoom - this.zoomStep));
  }

  private zoomIn(): void {
    this.isFitMode.set(false);
    this.zoom.update((zoom) => this.clampZoom(zoom + this.zoomStep));
  }

  private fitToView(): void {
    this.isFitMode.set(true);
    this.updateFitZoom();
  }

  private edit(): void {
    const document = this.document();

    if (document) {
      this.pageEditState.enterEdit(document);
    }
  }

  private save(): void {
    const document = this.pageEditState.completeEdit();

    if (!document) {
      return;
    }

    this.documentApi
      .updateDocument(document)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((savedDocument) => {
        this.savedDocument.set(savedDocument);
        this.pageEditState.commitEdit();
      });
  }

  private cancel(): void {
    this.pageEditState.cancelEdit();
  }

  protected onPageImageLoaded(size: PageImageSize): void {
    this.imageSize.set(size);

    if (this.isFitMode()) {
      this.updateFitZoom();
    }
  }

  protected onPageWheel(event: WheelEvent): void {
    event.preventDefault();
    this.isFitMode.set(false);

    if (event.deltaY < 0) {
      this.zoom.update((zoom) => this.clampZoom(zoom + this.zoomStep));
      return;
    }

    this.zoom.update((zoom) => this.clampZoom(zoom - this.zoomStep));
  }

  private setLoadedDocumentState(document: Document): void {
    this.currentPageIndex.set(0);
    this.imageSize.set(null);
    this.isFitMode.set(true);
    this.savedDocument.set(null);
    this.pageEditState.reset();
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Documents', route: '/' },
      { label: document.name },
    ]);
  }

  private updateFitZoom(): void {
    const viewerArea = this.viewerArea()?.nativeElement;
    const imageSize = this.imageSize();

    if (!viewerArea || !imageSize) {
      return;
    }

    const computedStyle = getComputedStyle(viewerArea);
    const horizontalPadding =
      Number.parseFloat(computedStyle.paddingLeft) + Number.parseFloat(computedStyle.paddingRight);
    const verticalPadding =
      Number.parseFloat(computedStyle.paddingTop) + Number.parseFloat(computedStyle.paddingBottom);
    const availableWidth = Math.max(viewerArea.clientWidth - horizontalPadding, 1);
    const availableHeight = Math.max(viewerArea.clientHeight - verticalPadding, 1);
    const widthZoom = (availableWidth / imageSize.width) * 100;
    const heightZoom = (availableHeight / imageSize.height) * 100;

    this.zoom.set(this.clampZoom(Math.floor(Math.min(widthZoom, heightZoom))));
  }

  private clampZoom(zoom: number): number {
    return Math.min(Math.max(zoom, this.minZoom), this.maxZoom);
  }
}
