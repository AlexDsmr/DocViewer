import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { BreadcrumbService } from 'src/app/shared/services/breadcrumb.service';

@Component({
  selector: 'app-navigation-panel',
  imports: [RouterLink],
  templateUrl: './navigation-panel.component.html',
  styleUrl: './navigation-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationPanelComponent {
  private readonly breadcrumbService = inject(BreadcrumbService);

  protected readonly breadcrumbs = this.breadcrumbService.breadcrumbs;
}
