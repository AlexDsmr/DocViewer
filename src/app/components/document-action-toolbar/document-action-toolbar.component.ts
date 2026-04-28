import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { DocumentActionToolbarConfig } from 'src/app/components/document-action-toolbar/document-action-toolbar.model';
import { ToolbarComponent } from 'src/app/shared/ui/toolbar/toolbar.component';
import { ToolbarConfig } from 'src/app/shared/ui/toolbar/toolbar.model';

@Component({
  selector: 'app-document-action-toolbar',
  imports: [ToolbarComponent],
  templateUrl: './document-action-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentActionToolbarComponent {
  public readonly config = input.required<DocumentActionToolbarConfig>();

  protected readonly toolbarConfig = computed<ToolbarConfig>(() => {
    const config = this.config();

    return {
      groups: [
        {
          id: 'page-navigation',
          ariaLabel: 'Page navigation',
          items: [
            {
              type: 'button',
              id: 'previous-page',
              label: 'Prev',
              disabled: !config.canGoPrevious,
              action: () => config.previousPage()
            },
            {
              type: 'text',
              id: 'page-status',
              label: `Page ${config.currentPageNumber} / ${config.totalPages}`
            },
            {
              type: 'button',
              id: 'next-page',
              label: 'Next',
              disabled: !config.canGoNext,
              action: () => config.nextPage()
            }
          ]
        },
        {
          id: 'zoom-controls',
          ariaLabel: 'Zoom controls',
          items: [
            {
              type: 'button',
              id: 'zoom-out',
              label: '-',
              disabled: !config.canZoomOut,
              action: () => config.zoomOut()
            },
            {
              type: 'text',
              id: 'zoom-status',
              label: `${config.zoom}%`
            },
            {
              type: 'button',
              id: 'zoom-in',
              label: '+',
              disabled: !config.canZoomIn,
              action: () => config.zoomIn()
            },
            {
              type: 'button',
              id: 'fit-to-view',
              label: 'Fit',
              variant: 'primary',
              action: () => config.fitToView()
            }
          ]
        }
      ]
    };
  });
}
