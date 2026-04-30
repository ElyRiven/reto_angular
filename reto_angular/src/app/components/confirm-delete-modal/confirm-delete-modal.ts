import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-delete-modal',
  templateUrl: './confirm-delete-modal.html',
  styleUrl: './confirm-delete-modal.css',
})
export class ConfirmDeleteModal {
  readonly isOpen = input<boolean>(false);
  readonly productName = input<string>('');
  readonly isLoading = input<boolean>(false);
  readonly errorMessage = input<string | null>(null);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
