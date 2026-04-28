import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { ButtonComponent } from 'src/app/shared/ui/button/button.component';
import { ToolbarButtonConfig, ToolbarConfig } from 'src/app/shared/ui/toolbar/toolbar.model';

@Component({
  selector: 'app-toolbar',
  imports: [ButtonComponent],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
  public readonly config = input.required<ToolbarConfig>();

  /**
   * Executes a toolbar button action.
   *
   * @param button Button configuration with action callback.
   */
  protected onButtonClick(button: ToolbarButtonConfig): void {
    if (button.disabled) {
      return;
    }

    button.action();
  }
}
