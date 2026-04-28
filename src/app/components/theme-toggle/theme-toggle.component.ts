import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ThemeService } from 'src/app/shared/services/theme.service';
import { ButtonComponent } from 'src/app/shared/ui/button/button.component';

@Component({
  selector: 'app-theme-toggle',
  imports: [ButtonComponent],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  private readonly themeService = inject(ThemeService);

  protected readonly isDarkTheme = this.themeService.isDarkTheme;

  protected get icon(): string {
    return this.isDarkTheme() ? 'bi-moon' : 'bi-sun';
  }

  protected onThemeToggle(): void {
    this.themeService.toggleTheme();
  }
}
