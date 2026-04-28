import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of } from 'rxjs';

import { DocumentListComponent } from 'src/app/components/document-list/document-list.component';
import { DocumentSummary } from 'src/app/shared/models/document.model';
import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';
import { DocumentApiService } from 'src/app/shared/services/document-api.service';

type DocumentsListState =
  | { readonly status: 'loading' }
  | { readonly status: 'loaded'; readonly documents: readonly DocumentSummary[] }
  | { readonly status: 'error'; readonly message: string };

@Component({
  selector: 'app-documents-list-page',
  imports: [DocumentListComponent],
  templateUrl: './documents-list-page.component.html',
  styleUrl: './documents-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsListPageComponent {
  protected readonly documentsState = toSignal(
    inject(DocumentApiService).getDocuments().pipe(
      map((documents): DocumentsListState => ({ status: 'loaded', documents })),
      catchError(() =>
        of<DocumentsListState>({
          status: 'error',
          message: 'Documents are unavailable. Check that mock API is running.'
        })
      )
    ),
    { initialValue: { status: 'loading' } satisfies DocumentsListState }
  );

  protected readonly documents = computed(() => {
    const state = this.documentsState();

    return state.status === 'loaded' ? state.documents : [];
  });
  protected readonly errorMessage = computed(() => {
    const state = this.documentsState();

    return state.status === 'error' ? state.message : '';
  });

  private readonly breadcrumbService = inject(BreadcrumbService);

  constructor() {
    this.breadcrumbService.setBreadcrumbs([{ label: 'Documents' }]);
  }
}
