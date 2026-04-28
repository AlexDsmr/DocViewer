import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { PageAnnotationComponent } from 'src/app/components/page-annotation/page-annotation.component';
import { PageMode } from 'src/app/shared/models/annotation.model';
import { DocumentPage } from 'src/app/shared/models/document-page.model';
import { PageImageSize } from 'src/app/shared/models/viewer-state.model';
import { PageEditStateService } from 'src/app/shared/services/page-edit-state.service';

@Component({
  selector: 'app-document-page-viewer',
  imports: [PageAnnotationComponent],
  templateUrl: './document-page-viewer.component.html',
  styleUrl: './document-page-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentPageViewerComponent {
  public readonly page = input.required<DocumentPage>();
  public readonly zoom = input.required<number>();
  public readonly imageSize = input.required<PageImageSize | null>();
  public readonly mode = input.required<PageMode>();
  public readonly imageLoaded = output<PageImageSize>();

  protected readonly fallbackImageWidth = 768;
  protected readonly fallbackImageHeight = 1024;
  protected readonly zoomMultiplier = 100;

  private readonly pageEditState = inject(PageEditStateService);
  private pointerDownPosition: { readonly x: number; readonly y: number } | null = null;
  private readonly clickThreshold = 4;

  protected readonly annotations = computed(() =>
    this.mode() === 'edit'
      ? this.pageEditState.getPageAnnotations(this.page().id)
      : this.page().annotations
  );
  protected readonly activeAnnotationId = this.pageEditState.activeAnnotationId;

  protected get imageWidth(): number {
    return ((this.imageSize()?.width ?? this.fallbackImageWidth) * this.zoom()) / this.zoomMultiplier;
  }

  protected get imageHeight(): number {
    return (
      ((this.imageSize()?.height ?? this.fallbackImageHeight) * this.zoom()) / this.zoomMultiplier
    );
  }

  protected onImageLoad(event: Event): void {
    const image = event.target as HTMLImageElement;

    this.imageLoaded.emit({
      width: image.naturalWidth,
      height: image.naturalHeight
    });
  }

  protected onPagePointerDown(event: PointerEvent): void {
    if (this.mode() !== 'edit' || event.button !== 0 || this.shouldIgnorePageClick(event)) {
      this.pointerDownPosition = null;
      return;
    }

    this.pointerDownPosition = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  protected onPagePointerUp(event: PointerEvent): void {
    if (this.mode() !== 'edit' || !this.pointerDownPosition || this.shouldIgnorePageClick(event)) {
      this.pointerDownPosition = null;
      return;
    }

    const deltaX = Math.abs(event.clientX - this.pointerDownPosition.x);
    const deltaY = Math.abs(event.clientY - this.pointerDownPosition.y);

    this.pointerDownPosition = null;

    if (deltaX > this.clickThreshold || deltaY > this.clickThreshold) {
      return;
    }

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    this.pageEditState.addAnnotation(this.page().id, x, y);
  }

  private shouldIgnorePageClick(event: PointerEvent): boolean {
    return Boolean((event.target as HTMLElement | null)?.closest('[data-pan-ignore="true"]'));
  }
}
