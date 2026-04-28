import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavigationPanelComponent } from 'src/app/components/navigation-panel/navigation-panel.component';

@Component({
  selector: 'app-root',
  imports: [NavigationPanelComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
