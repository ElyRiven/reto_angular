import { Component, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';

export interface MenuItem {
  label: string;
  action: string;
}

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.html',
  styleUrl: './context-menu.css',
})
export class ContextMenuComponent {
  private readonly elementRef = inject(ElementRef);

  readonly items = input<MenuItem[]>([]);
  readonly itemSelected = output<MenuItem>();

  readonly open = signal(false);

  toggle(): void {
    this.open.update((v) => !v);
  }

  select(item: MenuItem): void {
    this.itemSelected.emit(item);
    this.open.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.open.set(false);
    }
  }
}
