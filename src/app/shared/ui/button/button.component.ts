import { ChangeDetectionStrategy, Component, input } from '@angular/core';

type ButtonType = 'button' | 'submit' | 'reset';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'default' | 'compact';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  public readonly type = input<ButtonType>('button');
  public readonly disabled = input(false);
  public readonly variant = input<ButtonVariant>('secondary');
  public readonly size = input<ButtonSize>('default');
  public readonly ariaLabel = input<string | null>(null);
  public readonly icon = input<string | null>(null);
  public readonly label = input<string | null>(null);
}
