import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { describe, beforeEach, expect, it, vi } from 'vitest';
import { ConfirmDeleteModal } from './confirm-delete-modal';

describe('ConfirmDeleteModal', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteModal],
    }).compileComponents();
  });

  it('renders product name when modal is open', () => {
    const fixture = TestBed.createComponent(ConfirmDeleteModal);
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('productName', 'Cuenta Nómina');

    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.modal-title') as HTMLElement;
    expect(title.textContent).toContain('Cuenta Nómina');
  });

  it('does not render modal when isOpen is false', () => {
    const fixture = TestBed.createComponent(ConfirmDeleteModal);
    fixture.componentRef.setInput('isOpen', false);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.modal-overlay')).toBeNull();
  });

  it('emits cancelled when clicking Cancelar button', () => {
    const fixture = TestBed.createComponent(ConfirmDeleteModal);
    const component = fixture.componentInstance;
    const cancelledSpy = vi.spyOn(component.cancelled, 'emit');

    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const cancelButton = fixture.debugElement.query(By.css('.btn-cancel'));
    cancelButton.nativeElement.click();

    expect(cancelledSpy).toHaveBeenCalledTimes(1);
  });

  it('emits cancelled when clicking on overlay background', () => {
    const fixture = TestBed.createComponent(ConfirmDeleteModal);
    const component = fixture.componentInstance;
    const cancelledSpy = vi.spyOn(component.cancelled, 'emit');

    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.modal-overlay'));
    overlay.nativeElement.click();

    expect(cancelledSpy).toHaveBeenCalledTimes(1);
  });

  it('emits confirmed when clicking Confirmar button', () => {
    const fixture = TestBed.createComponent(ConfirmDeleteModal);
    const component = fixture.componentInstance;
    const confirmedSpy = vi.spyOn(component.confirmed, 'emit');

    fixture.componentRef.setInput('isOpen', true);
    fixture.detectChanges();

    const confirmButton = fixture.debugElement.query(By.css('.btn-confirm'));
    confirmButton.nativeElement.click();

    expect(confirmedSpy).toHaveBeenCalledTimes(1);
  });

  it('shows loading text and disables actions while deleting', () => {
    const fixture = TestBed.createComponent(ConfirmDeleteModal);
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput('isLoading', true);

    fixture.detectChanges();

    const cancelButton = fixture.debugElement.query(By.css('.btn-cancel'))
      .nativeElement as HTMLButtonElement;
    const confirmButton = fixture.debugElement.query(By.css('.btn-confirm'))
      .nativeElement as HTMLButtonElement;

    expect(cancelButton.disabled).toBe(true);
    expect(confirmButton.disabled).toBe(true);
    expect(confirmButton.textContent).toContain('Eliminando...');
  });

  it('shows API error message when errorMessage input is provided', () => {
    const fixture = TestBed.createComponent(ConfirmDeleteModal);
    fixture.componentRef.setInput('isOpen', true);
    fixture.componentRef.setInput(
      'errorMessage',
      'No se pudo eliminar el producto. Intenta nuevamente.',
    );

    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.modal-error') as HTMLElement;
    expect(error).not.toBeNull();
    expect(error.textContent).toContain('No se pudo eliminar el producto. Intenta nuevamente.');
  });
});
