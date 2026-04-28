import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';

import { PageAnnotation, PageMode } from 'src/app/shared/models/annotation.model';
import { MoveDelta, MovableDirective } from 'src/app/shared/directives/movable.directive';
import { PageEditStateService } from 'src/app/shared/services/page-edit-state.service';
import { ButtonComponent } from 'src/app/shared/ui/button/button.component';

@Component({
  selector: 'app-page-annotation',
  imports: [ButtonComponent, MovableDirective],
  templateUrl: './page-annotation.component.html',
  styleUrl: './page-annotation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageAnnotationComponent {
  private readonly textarea = viewChild<ElementRef<HTMLTextAreaElement>>('textarea');

  public readonly annotation = input.required<PageAnnotation>();
  public readonly mode = input.required<PageMode>();
  public readonly pageWidth = input.required<number>();
  public readonly pageHeight = input.required<number>();
  public readonly isActive = input(false);

  private readonly pageEditState = inject(PageEditStateService);

  constructor() {
    effect(() => {
      const textarea = this.textarea()?.nativeElement;

      if (this.mode() === 'edit' && this.isActive() && textarea) {
        queueMicrotask(() => {
          textarea.focus();
          textarea.select();
        });
      }
    });
  }

  protected onDelete(): void {
    this.pageEditState.deleteAnnotation(this.annotation().id);
  }

  protected onTextChange(value: string): void {
    this.pageEditState.updateAnnotation(this.annotation().id, value);
  }

  protected onTextBlur(): void {
    const annotation = this.annotation();

    if (!annotation.description.trim()) {
      this.pageEditState.deleteAnnotation(annotation.id);
      return;
    }

    this.pageEditState.setActiveAnnotation(null);
  }

  protected onTextKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.pageEditState.deleteAnnotation(this.annotation().id);
      return;
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onTextBlur();
    }
  }

  protected onDoubleClick(): void {
    if (this.mode() === 'edit') {
      this.pageEditState.setActiveAnnotation(this.annotation().id);
    }
  }

  protected onMove(delta: MoveDelta): void {
    const annotation = this.annotation();
    const nextX = annotation.x + delta.dx / this.pageWidth();
    const nextY = annotation.y + delta.dy / this.pageHeight();

    this.pageEditState.moveAnnotation(annotation.id, nextX, nextY);
  }
}
