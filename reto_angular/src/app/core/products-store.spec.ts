import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { describe, beforeEach, expect, it, vi } from 'vitest';
import { ProductsApi } from './products-api';
import { ProductsStore } from './products-store';
import { Product } from './product.model';

describe('ProductsStore', () => {
  let store: ProductsStore;
  const apiMock = {
    getProducts: vi.fn(),
    deleteProduct: vi.fn(),
  };

  const products: Product[] = [
    {
      id: 'prod-001',
      name: 'Cuenta Nómina',
      description: 'Descripción 1',
      logo: 'https://example.com/1.png',
      date_release: '2026-01-01',
      date_revision: '2027-01-01',
    },
    {
      id: 'prod-002',
      name: 'Tarjeta Crédito',
      description: 'Descripción 2',
      logo: 'https://example.com/2.png',
      date_release: '2026-02-01',
      date_revision: '2027-02-01',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [ProductsStore, { provide: ProductsApi, useValue: apiMock }],
    });

    store = TestBed.inject(ProductsStore);
  });

  it('starts with initial signal state', () => {
    expect(store.allProducts()).toEqual([]);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
    expect(store.deleteLoading()).toBe(false);
    expect(store.deleteError()).toBeNull();
    expect(store.deleteSuccess()).toBe(false);
  });

  it('loads products successfully and updates state', () => {
    apiMock.getProducts.mockReturnValue(of({ data: products }));

    store.loadProducts();

    expect(apiMock.getProducts).toHaveBeenCalledTimes(1);
    expect(store.allProducts()).toEqual(products);
    expect(store.loading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('sets error when loadProducts fails', () => {
    apiMock.getProducts.mockReturnValue(throwError(() => new Error('network')));

    store.loadProducts();

    expect(store.loading()).toBe(false);
    expect(store.error()).toBe('Error al cargar los productos. Por favor, intenta nuevamente.');
    expect(store.allProducts()).toEqual([]);
  });

  it('deletes product and updates state on success', () => {
    store.allProducts.set(products);
    apiMock.deleteProduct.mockReturnValue(of(void 0));

    store.deleteProduct('prod-001');

    expect(apiMock.deleteProduct).toHaveBeenCalledWith('prod-001');
    expect(store.allProducts()).toEqual([products[1]]);
    expect(store.deleteLoading()).toBe(false);
    expect(store.deleteError()).toBeNull();
    expect(store.deleteSuccess()).toBe(true);
  });

  it('sets delete error and keeps list when delete fails', () => {
    store.allProducts.set(products);
    apiMock.deleteProduct.mockReturnValue(throwError(() => new Error('delete-failed')));

    store.deleteProduct('prod-001');

    expect(store.allProducts()).toEqual(products);
    expect(store.deleteLoading()).toBe(false);
    expect(store.deleteSuccess()).toBe(false);
    expect(store.deleteError()).toBe('No se pudo eliminar el producto. Intenta nuevamente.');
  });

  it('resets delete state when resetDeleteState is called', () => {
    store.deleteLoading.set(true);
    store.deleteError.set('error');
    store.deleteSuccess.set(true);

    store.resetDeleteState();

    expect(store.deleteLoading()).toBe(false);
    expect(store.deleteError()).toBeNull();
    expect(store.deleteSuccess()).toBe(false);
  });

  it('filteredProducts returns all products when searchTerm is empty', () => {
    store.allProducts.set(products);

    expect(store.filteredProducts()).toEqual(products.slice(0, 5));
  });

  it('filteredProducts filters by name when searchTerm is set', () => {
    store.allProducts.set(products);
    store.setSearchTerm('nómina');

    expect(store.filteredProducts()).toHaveLength(1);
    expect(store.filteredProducts()[0].id).toBe('prod-001');
  });

  it('filteredProducts returns empty array when search matches nothing', () => {
    store.allProducts.set(products);
    store.setSearchTerm('zzz-no-match');

    expect(store.filteredProducts()).toHaveLength(0);
  });

  it('filteredProducts slices to pageSize', () => {
    const manyProducts: Product[] = Array.from({ length: 10 }, (_, i) => ({
      id: `prod-00${i}`,
      name: `Producto ${i}`,
      description: `Desc ${i}`,
      logo: `https://example.com/${i}.png`,
      date_release: '2026-01-01',
      date_revision: '2027-01-01',
    }));
    store.allProducts.set(manyProducts);
    store.setPageSize(5);

    expect(store.filteredProducts()).toHaveLength(5);
  });

  it('totalCount reflects filteredProducts length', () => {
    store.allProducts.set(products);
    store.setSearchTerm('Tarjeta');

    expect(store.totalCount()).toBe(1);
  });

  it('setPageSize updates pageSize signal', () => {
    store.setPageSize(10);

    expect(store.pageSize()).toBe(10);
  });
});
