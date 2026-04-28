import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ListItemComponent } from 'src/app/shared/ui/list/list-item/list-item.component';
import { ListConfig } from 'src/app/shared/ui/list/list.model';

@Component({
  selector: 'app-list',
  imports: [ListItemComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent {
  public readonly config = input.required<ListConfig>();
}
