import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

import { PageAnnotation, PageMode } from 'src/app/shared/models/annotation.model';
import { MoveDelta, MovableDirective } from 'src/app/shared/directives/movable.directive';
import { PageEditStateService } from 'src/app/shared/services/page-edit-state.service';
import { ButtonComponent } from 'src/app/shared/ui/button/button.component';

@Component({
  selector: 'app-page-annotation',
  imports: [ButtonComponent, MovableDirective, NgOptimizedImage],
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
  private readonly imageLoadErrorUrl = signal<string | null>(null);

  protected readonly hasImageLoadError = computed(() => {
    const imageUrl = this.annotation().imageUrl;

    return Boolean(imageUrl && this.imageLoadErrorUrl() === imageUrl);
  });

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

  protected onImageUrlChange(value: string): void {
    this.imageLoadErrorUrl.set(null);
    this.pageEditState.updateAnnotationImageUrl(this.annotation().id, value);
  }

  protected onImageUrlBlur(event: FocusEvent): void {
    this.closeOrDeleteIfEmpty(event);
  }

  protected onImageLoad(): void {
    this.imageLoadErrorUrl.set(null);
  }

  protected onImageError(): void {
    const imageUrl = this.annotation().imageUrl;

    if (imageUrl) {
      this.imageLoadErrorUrl.set(imageUrl);
    }
  }

  protected onTextChange(value: string): void {
    this.pageEditState.updateAnnotation(this.annotation().id, value);
  }

  protected onTextBlur(event: FocusEvent): void {
    this.closeOrDeleteIfEmpty(event);
  }

  protected onTextKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.pageEditState.deleteAnnotation(this.annotation().id);
      return;
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.closeOrDeleteIfEmpty(event);
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

  private closeOrDeleteIfEmpty(event: Event): void {
    if (event instanceof FocusEvent && this.isFocusInsideAnnotation(event)) {
      return;
    }

    const annotation = this.annotation();

    if (!annotation.description.trim() && !annotation.imageUrl) {
      this.pageEditState.deleteAnnotation(annotation.id);
      return;
    }

    this.pageEditState.setActiveAnnotation(null);
  }

  private isFocusInsideAnnotation(event: FocusEvent): boolean {
    const currentElement = event.currentTarget as HTMLElement | null;
    const relatedTarget = event.relatedTarget as Node | null;

    return Boolean(
      currentElement?.closest('.page-annotation')?.contains(relatedTarget),
    );
  }
}
