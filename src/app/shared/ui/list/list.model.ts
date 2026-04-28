export interface ListConfig {
  readonly items: readonly ListItemConfig[];
  readonly emptyMessage?: string;
}

export interface ListItemConfig {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly route?: string | unknown[];
  readonly ariaLabel?: string;
}
