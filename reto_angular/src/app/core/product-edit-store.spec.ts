import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductEditStore } from './product-edit-store';
import { ProductsApi } from './products-api';

describe('ProductEditStore', () => {
  let store: ProductEditStore;

  const apiMock = {
    getProducts: vi.fn(),
    updateProduct: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  const product = {
    id: 'prod-001',
    name: 'Cuenta Nómina',
    description: 'Descripción base para edición',
    logo: 'https://example.com/logo.png',
    date_release: '2026-06-01',
    date_revision: '2027-06-01',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        ProductEditStore,
        { provide: ProductsApi, useValue: apiMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    store = TestBed.inject(ProductEditStore);
  });

  it('starts with initial state', () => {
    expect(store.loading()).toBe(false);
    expect(store.loadError()).toBeNull();
    expect(store.submitError()).toBeNull();
    expect(store.originalValues()).toBeNull();
    expect(store.editModel()).toEqual({
      id: '',
      name: '',
      description: '',
      logo: '',
      date_release: '',
    });
  });

  it('computes dateRevision from editModel date_release', () => {
    store.editModel.update((prev) => ({ ...prev, date_release: '2026-12-25' }));

    expect(store.dateRevision()).toBe('2027-12-25');
  });

  it('keeps isDirty false for unchanged loaded values and true when user edits a field', () => {
    apiMock.getProducts.mockReturnValue(of({ data: [product] }));

    store.loadProduct('prod-001');

    expect(store.isDirty()).toBe(false);

    store.editModel.update((prev) => ({ ...prev, name: 'Cuenta Nómina Editada' }));

    expect(store.isDirty()).toBe(true);
  });

  it('loads product data successfully by id and resets form state', () => {
    apiMock.getProducts.mockReturnValue(of({ data: [product] }));

    store.loadProduct('prod-001');

    expect(apiMock.getProducts).toHaveBeenCalledTimes(1);
    expect(store.loadError()).toBeNull();
    expect(store.originalValues()).toEqual({
      name: 'Cuenta Nómina',
      description: 'Descripción base para edición',
      logo: 'https://example.com/logo.png',
      date_release: '2026-06-01',
    });
    expect(store.editModel()).toEqual({
      id: 'prod-001',
      name: 'Cuenta Nómina',
      description: 'Descripción base para edición',
      logo: 'https://example.com/logo.png',
      date_release: '2026-06-01',
    });
    expect(store.loading()).toBe(false);
  });

  it('redirects to products list when product id is not found', () => {
    apiMock.getProducts.mockReturnValue(of({ data: [product] }));

    store.loadProduct('missing-id');

    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('sets loadError when loading product fails', () => {
    apiMock.getProducts.mockReturnValue(throwError(() => new Error('network')));

    store.loadProduct('prod-001');

    expect(store.loading()).toBe(false);
    expect(store.loadError()).toBe('Error al cargar el producto. Por favor, intenta nuevamente.');
  });

  it('sends update request and redirects on successful save', async () => {
    apiMock.getProducts.mockReturnValue(of({ data: [product] }));
    apiMock.updateProduct.mockReturnValue(of({ ...product, name: 'Cuenta Editada' }));

    store.loadProduct('prod-001');
    store.editModel.update((prev) => ({
      ...prev,
      name: 'Cuenta Editada',
      description: 'Descripción de producto editado',
      logo: 'https://example.com/logo-editado.png',
      date_release: '2026-08-01',
    }));

    store.onSave();

    await vi.waitFor(() => {
      expect(apiMock.updateProduct).toHaveBeenCalledWith('prod-001', {
        name: 'Cuenta Editada',
        description: 'Descripción de producto editado',
        logo: 'https://example.com/logo-editado.png',
        date_release: '2026-08-01',
        date_revision: '2027-08-01',
      });
    });

    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
    expect(store.submitError()).toBeNull();
    expect(store.loading()).toBe(false);
  });

  it('sets submitError when save fails', async () => {
    apiMock.getProducts.mockReturnValue(of({ data: [product] }));
    apiMock.updateProduct.mockReturnValue(throwError(() => new Error('update failed')));

    store.loadProduct('prod-001');
    store.editModel.update((prev) => ({ ...prev, name: 'Cuenta Editada' }));

    store.onSave();

    await vi.waitFor(() => {
      expect(store.submitError()).toBe(
        'Error al actualizar el producto. Por favor, intenta nuevamente.',
      );
    });

    expect(routerMock.navigate).not.toHaveBeenCalled();
    expect(store.loading()).toBe(false);
  });
});
