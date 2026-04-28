import { Directive, ElementRef, inject, input, output } from '@angular/core';

export interface MoveDelta {
  readonly dx: number;
  readonly dy: number;
}

@Directive({
  selector: '[appMovable]',
  host: {
    '(pointerdown)': 'onPointerDown($event)',
    '(pointermove)': 'onPointerMove($event)',
    '(pointerup)': 'onPointerUp($event)',
    '(pointercancel)': 'onPointerUp($event)',
  },
})
export class MovableDirective {
  public readonly disabled = input(false);
  public readonly moveDelta = output<MoveDelta>();

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private pointerId: number | null = null;
  private previousX = 0;
  private previousY = 0;

  protected onPointerDown(event: PointerEvent): void {
    if (this.disabled() || event.button !== 0 || this.shouldIgnoreEvent(event)) {
      return;
    }

    this.pointerId = event.pointerId;
    this.previousX = event.clientX;
    this.previousY = event.clientY;
    this.elementRef.nativeElement.setPointerCapture(event.pointerId);
    event.preventDefault();
    event.stopPropagation();
  }

  protected onPointerMove(event: PointerEvent): void {
    if (this.pointerId !== event.pointerId) {
      return;
    }

    const dx = event.clientX - this.previousX;
    const dy = event.clientY - this.previousY;

    this.previousX = event.clientX;
    this.previousY = event.clientY;
    this.moveDelta.emit({ dx, dy });
    event.preventDefault();
    event.stopPropagation();
  }

  protected onPointerUp(event: PointerEvent): void {
    if (this.pointerId !== event.pointerId) {
      return;
    }

    const element = this.elementRef.nativeElement;

    if (element.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }

    this.pointerId = null;
    event.stopPropagation();
  }

  private shouldIgnoreEvent(event: PointerEvent): boolean {
    return Boolean((event.target as HTMLElement | null)?.closest('button, textarea, input, select'));
  }
}
