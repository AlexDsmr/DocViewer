import { Injectable, signal } from '@angular/core';

export interface BreadcrumbItem {
  readonly label: string;
  readonly route?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private readonly breadcrumbsSignal = signal<readonly BreadcrumbItem[]>([]);
  public readonly breadcrumbs = this.breadcrumbsSignal.asReadonly();

  /**
   * Replaces the current breadcrumb trail.
   *
   * @param breadcrumbs New breadcrumb trail.
   */
  public setBreadcrumbs(breadcrumbs: readonly BreadcrumbItem[]): void {
    this.breadcrumbsSignal.set(breadcrumbs);
  }

  /** Clears the current breadcrumb trail. */
  public clear(): void {
    this.breadcrumbsSignal.set([]);
  }
}
