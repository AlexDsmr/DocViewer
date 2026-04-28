import { Routes } from '@angular/router';

import { DocumentViewerPageComponent } from 'src/app/components/document-viewer-page/document-viewer-page.component';
import { DocumentsListPageComponent } from 'src/app/components/documents-list-page/documents-list-page.component';
import { NotFoundPageComponent } from 'src/app/components/not-found-page/not-found-page.component';

export const routes: Routes = [
  {
    path: '',
    component: DocumentsListPageComponent,
    title: 'Documents'
  },
  {
    path: 'documents/:id',
    component: DocumentViewerPageComponent,
    title: 'Document viewer'
  },
  {
    path: '**',
    component: NotFoundPageComponent,
    title: 'Page not found'
  }
];
