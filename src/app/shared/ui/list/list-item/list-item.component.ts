import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ListItemConfig } from 'src/app/shared/ui/list/list.model';

@Component({
  selector: 'app-list-item',
  imports: [NgTemplateOutlet, RouterLink],
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListItemComponent {
  public readonly item = input.required<ListItemConfig>();
}
