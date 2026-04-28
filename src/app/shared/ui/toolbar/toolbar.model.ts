import { ButtonSize, ButtonVariant } from 'src/app/shared/ui/button/button.component';

export interface ToolbarButtonConfig {
  readonly type: 'button';
  readonly id: string;
  readonly label: string;
  readonly ariaLabel?: string;
  readonly disabled?: boolean;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly action: () => void;
}

export interface ToolbarTextConfig {
  readonly type: 'text';
  readonly id: string;
  readonly label: string;
}

export type ToolbarItemConfig = ToolbarButtonConfig | ToolbarTextConfig;

export interface ToolbarGroupConfig {
  readonly id: string;
  readonly ariaLabel?: string;
  readonly items: readonly ToolbarItemConfig[];
}

export interface ToolbarConfig {
  readonly groups: readonly ToolbarGroupConfig[];
}
