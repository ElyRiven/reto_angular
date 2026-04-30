import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductFormPage } from './product-form-page';
import { ProductsApi } from '@core/products-api';

describe('ProductFormPage', () => {
  const apiMock = {
    createProduct: vi.fn(),
    verifyProductId: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    apiMock.verifyProductId.mockReturnValue(of(false));

    await TestBed.configureTestingModule({
      imports: [ProductFormPage],
      providers: [
        { provide: ProductsApi, useValue: apiMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();
  });

  it('calls resetForm on init', () => {
    const fixture = TestBed.createComponent(ProductFormPage);
    const component = fixture.componentInstance;
    const resetSpy = vi.spyOn(component.store, 'resetForm');

    fixture.detectChanges();

    expect(resetSpy).toHaveBeenCalledTimes(1);
  });

  it('renders key form fields and actions', () => {
    const fixture = TestBed.createComponent(ProductFormPage);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#product-id')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#product-name')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#product-description')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#product-logo')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#product-release-date')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#product-check-date')).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Reiniciar');
    expect(fixture.nativeElement.textContent).toContain('Enviar');
  });

  it('renders readonly check date input with computed value', () => {
    const fixture = TestBed.createComponent(ProductFormPage);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    component.store.productModel.update((prev) => ({ ...prev, date_release: '2026-04-30' }));
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('#product-check-date') as HTMLInputElement;
    expect(input.readOnly).toBe(true);
    expect(input.value).toBe('2027-04-30');
  });

  it('shows submit error block when store has submitError', () => {
    const fixture = TestBed.createComponent(ProductFormPage);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    component.store.submitError.set('Error al crear el producto. Por favor, intenta nuevamente.');
    fixture.detectChanges();

    const errorBlock = fixture.nativeElement.querySelector('.submit-error') as HTMLElement;
    expect(errorBlock).not.toBeNull();
    expect(errorBlock.textContent).toContain(
      'Error al crear el producto. Por favor, intenta nuevamente.',
    );
  });

  it('keeps submit button disabled when form is invalid', () => {
    const fixture = TestBed.createComponent(ProductFormPage);

    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('.btn-submit') as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);
  });
});
