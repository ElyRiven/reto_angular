import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductFormStore } from './product-form-store';
import { ProductsApi } from './products-api';

describe('ProductFormStore', () => {
  let store: ProductFormStore;

  const apiMock = {
    createProduct: vi.fn(),
    verifyProductId: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    apiMock.verifyProductId.mockReturnValue(of(false));

    TestBed.configureTestingModule({
      providers: [
        ProductFormStore,
        { provide: ProductsApi, useValue: apiMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    store = TestBed.inject(ProductFormStore);
  });

  it('starts with initial state', () => {
    expect(store.loading()).toBe(false);
    expect(store.submitError()).toBeNull();
    expect(store.productModel()).toEqual({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
    });
    expect(store.dateRevision()).toBe('');
  });

  it('calculates dateRevision as one year after date_release', () => {
    store.productModel.update((prev) => ({ ...prev, date_release: '2026-06-15' }));

    expect(store.dateRevision()).toBe('2027-06-15');
  });

  it('does not submit when form is invalid', async () => {
    store.onSubmit();

    await Promise.resolve();

    expect(apiMock.createProduct).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('submits valid form successfully and navigates to products list', async () => {
    apiMock.createProduct.mockReturnValue(
      of({
        id: 'abc123',
        name: 'Cuenta Premium',
        description: 'Producto financiero premium',
        logo: 'https://example.com/logo.png',
        date_release: '2026-05-01',
        date_revision: '2027-05-01',
      }),
    );

    store.productModel.set({
      id: 'abc123',
      name: 'Cuenta Premium',
      description: 'Producto financiero premium',
      logo: 'https://example.com/logo.png',
      date_release: '2026-05-01',
    });

    store.onSubmit();

    await vi.waitFor(() => {
      expect(apiMock.createProduct).toHaveBeenCalledWith({
        id: 'abc123',
        name: 'Cuenta Premium',
        description: 'Producto financiero premium',
        logo: 'https://example.com/logo.png',
        date_release: '2026-05-01',
        date_revision: '2027-05-01',
      });
    });

    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
    expect(store.loading()).toBe(false);
    expect(store.submitError()).toBeNull();
    expect(store.productModel().id).toBe('');
  });

  it('sets submitError and keeps data when submit fails', async () => {
    apiMock.createProduct.mockReturnValue(throwError(() => new Error('server error')));

    store.productModel.set({
      id: 'abc123',
      name: 'Cuenta Premium',
      description: 'Producto financiero premium',
      logo: 'https://example.com/logo.png',
      date_release: '2026-05-01',
    });

    store.onSubmit();

    await vi.waitFor(() => {
      expect(store.submitError()).toBe(
        'Error al crear el producto. Por favor, intenta nuevamente.',
      );
    });

    expect(store.loading()).toBe(false);
    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(store.productModel().id).toBe('abc123');
  });

  it('resetForm clears model and errors', () => {
    store.productModel.set({
      id: 'abc123',
      name: 'Cuenta Premium',
      description: 'Producto financiero premium',
      logo: 'https://example.com/logo.png',
      date_release: '2026-05-01',
    });
    store.submitError.set('error');

    store.resetForm();

    expect(store.productModel()).toEqual({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
    });
    expect(store.submitError()).toBeNull();
  });
});
