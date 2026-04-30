import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, beforeEach, expect, it, vi } from 'vitest';
import { ProductsPage } from './products-page';
import { ProductsStore } from '@core/products-store';
import { Product } from '@core/product.model';

describe('ProductsPage', () => {
  const products: Product[] = [
    {
      id: 'prod-001',
      name: 'Cuenta Nómina',
      description: 'Descripción',
      logo: 'https://example.com/logo.png',
      date_release: '2026-01-01',
      date_revision: '2027-01-01',
    },
  ];

  const storeMock = {
    allProducts: signal<Product[]>(products),
    filteredProducts: signal<Product[]>(products),
    totalCount: signal(1),
    pageSize: signal(5),
    searchTerm: signal(''),
    loading: signal(false),
    error: signal<string | null>(null),
    deleteLoading: signal(false),
    deleteError: signal<string | null>(null),
    deleteSuccess: signal(false),
    loadProducts: vi.fn(),
    setSearchTerm: vi.fn(),
    setPageSize: vi.fn(),
    deleteProduct: vi.fn(),
    resetDeleteState: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    storeMock.deleteSuccess.set(false);
    storeMock.loading.set(false);
    storeMock.error.set(null);
    storeMock.deleteLoading.set(false);
    storeMock.deleteError.set(null);
    storeMock.filteredProducts.set(products);
    storeMock.totalCount.set(1);
    storeMock.pageSize.set(5);

    await TestBed.configureTestingModule({
      imports: [ProductsPage],
      providers: [provideRouter([]), { provide: ProductsStore, useValue: storeMock }],
    }).compileComponents();
  });

  it('loads products on init', () => {
    const fixture = TestBed.createComponent(ProductsPage);

    fixture.detectChanges();

    expect(storeMock.loadProducts).toHaveBeenCalledTimes(1);
  });

  it('opens delete modal when delete action is triggered from product table', () => {
    const fixture = TestBed.createComponent(ProductsPage);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    component.onDeleteProduct({ id: 'prod-001', name: 'Cuenta Nómina' });
    fixture.detectChanges();

    expect(component.showDeleteModal()).toBe(true);
    expect(component.selectedProduct()).toEqual({ id: 'prod-001', name: 'Cuenta Nómina' });
    expect(storeMock.resetDeleteState).toHaveBeenCalled();
  });

  it('calls store deleteProduct when user confirms deletion', () => {
    const fixture = TestBed.createComponent(ProductsPage);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    component.onDeleteProduct({ id: 'prod-001', name: 'Cuenta Nómina' });
    component.confirmDelete();

    expect(storeMock.deleteProduct).toHaveBeenCalledWith('prod-001');
  });

  it('does not call deleteProduct when confirmDelete is triggered without selected product', () => {
    const fixture = TestBed.createComponent(ProductsPage);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    component.confirmDelete();

    expect(storeMock.deleteProduct).not.toHaveBeenCalled();
  });

  it('closes modal and resets state when user cancels deletion', () => {
    const fixture = TestBed.createComponent(ProductsPage);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    component.onDeleteProduct({ id: 'prod-001', name: 'Cuenta Nómina' });
    component.cancelDelete();

    expect(component.showDeleteModal()).toBe(false);
    expect(component.selectedProduct()).toBeNull();
    expect(storeMock.resetDeleteState).toHaveBeenCalled();
  });

  it('renders loading state when store is loading', () => {
    storeMock.loading.set(true);

    const fixture = TestBed.createComponent(ProductsPage);
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent as string;
    expect(content).toContain('Cargando productos...');
  });

  it('renders error state when store has an error', () => {
    storeMock.loading.set(false);
    storeMock.error.set('Error al cargar los productos. Por favor, intenta nuevamente.');

    const fixture = TestBed.createComponent(ProductsPage);
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent as string;
    expect(content).toContain('Error al cargar los productos. Por favor, intenta nuevamente.');
    expect(content).toContain('Reintentar');
  });

  it('closes modal automatically when deleteSuccess changes to true', () => {
    const fixture = TestBed.createComponent(ProductsPage);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    component.onDeleteProduct({ id: 'prod-001', name: 'Cuenta Nómina' });

    storeMock.deleteSuccess.set(true);
    fixture.detectChanges();

    expect(component.showDeleteModal()).toBe(false);
    expect(component.selectedProduct()).toBeNull();
    expect(storeMock.resetDeleteState).toHaveBeenCalled();
  });

  it('keeps modal open and renders delete error message when deletion fails', () => {
    const fixture = TestBed.createComponent(ProductsPage);
    const component = fixture.componentInstance;

    fixture.detectChanges();
    component.onDeleteProduct({ id: 'prod-001', name: 'Cuenta Nómina' });
    storeMock.deleteError.set('No se pudo eliminar el producto. Intenta nuevamente.');
    fixture.detectChanges();

    expect(component.showDeleteModal()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain(
      'No se pudo eliminar el producto. Intenta nuevamente.',
    );
  });
});
