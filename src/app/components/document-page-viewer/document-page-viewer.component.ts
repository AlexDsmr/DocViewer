import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { DocumentPage } from 'src/app/shared/models/document-page.model';
import { PageImageSize } from 'src/app/shared/models/viewer-state.model';

@Component({
  selector: 'app-document-page-viewer',
  templateUrl: './document-page-viewer.component.html',
  styleUrl: './document-page-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentPageViewerComponent {
  public readonly page = input.required<DocumentPage>();
  public readonly zoom = input.required<number>();
  public readonly imageSize = input.required<PageImageSize | null>();
  public readonly imageLoaded = output<PageImageSize>();

  protected readonly fallbackImageWidth = 768;
  protected readonly zoomMultiplier = 100;

  protected get imageWidth(): number {
    return ((this.imageSize()?.width ?? this.fallbackImageWidth) * this.zoom()) / this.zoomMultiplier;
  }

  protected onImageLoad(event: Event): void {
    const image = event.target as HTMLImageElement;

    this.imageLoaded.emit({
      width: image.naturalWidth,
      height: image.naturalHeight
    });
  }
}
