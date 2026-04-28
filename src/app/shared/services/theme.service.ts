import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';

export type AppTheme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storageKey = 'docviewer-theme';

  public readonly theme = signal<AppTheme>(this.getInitialTheme());
  public readonly isDarkTheme = computed(() => this.theme() === 'dark');

  constructor() {
    this.applyTheme(this.theme());
  }

  /** Toggles the application color theme. */
  public toggleTheme(): void {
    const nextTheme = this.theme() === 'dark' ? 'light' : 'dark';

    this.theme.set(nextTheme);
    this.saveTheme(nextTheme);
    this.applyTheme(nextTheme);
  }

  private getInitialTheme(): AppTheme {
    const savedTheme = this.readSavedTheme();

    if (savedTheme) {
      return savedTheme;
    }

    return this.prefersDarkTheme() ? 'dark' : 'light';
  }

  private readSavedTheme(): AppTheme | null {
    const savedTheme = this.document.defaultView?.localStorage.getItem(this.storageKey);

    return savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : null;
  }

  private saveTheme(theme: AppTheme): void {
    this.document.defaultView?.localStorage.setItem(this.storageKey, theme);
  }

  private prefersDarkTheme(): boolean {
    return Boolean(this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  private applyTheme(theme: AppTheme): void {
    this.document.documentElement.dataset['theme'] = theme;
  }
}
