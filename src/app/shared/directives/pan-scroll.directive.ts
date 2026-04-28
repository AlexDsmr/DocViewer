import { Directive, ElementRef, inject, input, OnDestroy, output } from '@angular/core';

@Directive({
  selector: '[appPanScroll]',
  host: {
    '[class.is-panning]': 'isPanning',
    '(pointerdown)': 'onPointerDown($event)',
  },
})
export class PanScrollDirective implements OnDestroy {
  public readonly disabled = input(false);
  public readonly panCompleted = output<void>();

  protected isPanning = false;

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private pointerId: number | null = null;
  private startX = 0;
  private startY = 0;
  private startScrollLeft = 0;
  private startScrollTop = 0;
  private hasMoved = false;
  private readonly moveThreshold = 4;
  private readonly pointerMoveListener = (event: PointerEvent): void => this.onPointerMove(event);
  private readonly pointerUpListener = (event: PointerEvent): void => this.onPointerUp(event);

  public ngOnDestroy(): void {
    this.removeWindowListeners();
  }

  protected onPointerDown(event: PointerEvent): void {
    if (this.disabled() || event.button !== 0 || this.shouldIgnoreEvent(event)) {
      return;
    }

    const element = this.elementRef.nativeElement;

    this.pointerId = event.pointerId;
    this.startX = event.clientX;
    this.startY = event.clientY;
    this.startScrollLeft = element.scrollLeft;
    this.startScrollTop = element.scrollTop;
    this.hasMoved = false;
    this.isPanning = false;
    this.addWindowListeners();
  }

  protected onPointerMove(event: PointerEvent): void {
    if (this.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - this.startX;
    const deltaY = event.clientY - this.startY;

    if (
      !this.hasMoved &&
      (Math.abs(deltaX) > this.moveThreshold || Math.abs(deltaY) > this.moveThreshold)
    ) {
      this.hasMoved = true;
      this.isPanning = true;
    }

    if (!this.hasMoved) {
      return;
    }

    const element = this.elementRef.nativeElement;

    element.scrollLeft = this.startScrollLeft - deltaX;
    element.scrollTop = this.startScrollTop - deltaY;
    event.preventDefault();
  }

  protected onPointerUp(event: PointerEvent): void {
    if (this.pointerId !== event.pointerId) {
      return;
    }

    if (this.hasMoved) {
      this.panCompleted.emit();
    }

    this.removeWindowListeners();
    this.pointerId = null;
    this.isPanning = false;
    this.hasMoved = false;
  }

  private shouldIgnoreEvent(event: PointerEvent): boolean {
    return Boolean(
      (event.target as HTMLElement | null)?.closest(
        'button, a, textarea, input, select, [data-pan-ignore="true"]',
      ),
    );
  }

  private addWindowListeners(): void {
    window.addEventListener('pointermove', this.pointerMoveListener);
    window.addEventListener('pointerup', this.pointerUpListener);
    window.addEventListener('pointercancel', this.pointerUpListener);
  }

  private removeWindowListeners(): void {
    window.removeEventListener('pointermove', this.pointerMoveListener);
    window.removeEventListener('pointerup', this.pointerUpListener);
    window.removeEventListener('pointercancel', this.pointerUpListener);
  }
}
