import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { DocumentSummary } from 'src/app/shared/models/document.model';
import { ListComponent } from 'src/app/shared/ui/list/list.component';
import { ListConfig } from 'src/app/shared/ui/list/list.model';

@Component({
  selector: 'app-document-list',
  imports: [ListComponent],
  templateUrl: './document-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentListComponent {
  public readonly documents = input.required<readonly DocumentSummary[]>();

  protected readonly listConfig = computed<ListConfig>(() => ({
    emptyMessage: 'No documents found.',
    items: this.documents().map((document) => ({
      id: document.id,
      title: document.name,
      description: `${document.pageCount} pages`,
      route: ['/documents', document.id],
      ariaLabel: `Open document ${document.name}`
    }))
  }));
}
