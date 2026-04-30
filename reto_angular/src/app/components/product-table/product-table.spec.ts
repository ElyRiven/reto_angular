import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, expect, it, vi } from 'vitest';
import { ProductTableComponent } from './product-table';
import { Product } from '@core/product.model';

describe('ProductTableComponent', () => {
  const product: Product = {
    id: 'prod-001',
    name: 'Tarjeta Black',
    description: 'Producto premium',
    logo: 'https://example.com/logo.png',
    date_release: '2026-01-01',
    date_revision: '2027-01-01',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      imports: [ProductTableComponent],
    });
  });

  it('includes Eliminar Producto in menu items', () => {
    const fixture = TestBed.createComponent(ProductTableComponent);
    const component = fixture.componentInstance;

    expect(component.menuItems).toEqual([
      { label: 'Editar Producto', action: 'edit' },
      { label: 'Eliminar Producto', action: 'delete' },
    ]);
  });

  it('emits editProduct with product id when edit action is selected', () => {
    const fixture = TestBed.createComponent(ProductTableComponent);
    const component = fixture.componentInstance;
    const editSpy = vi.spyOn(component.editProduct, 'emit');

    component.onMenuAction({ label: 'Editar Producto', action: 'edit' }, product);

    expect(editSpy).toHaveBeenCalledWith('prod-001');
    expect(editSpy).toHaveBeenCalledTimes(1);
  });

  it('emits deleteProduct with product id and name when delete action is selected', () => {
    const fixture = TestBed.createComponent(ProductTableComponent);
    const component = fixture.componentInstance;
    const deleteSpy = vi.spyOn(component.deleteProduct, 'emit');

    component.onMenuAction({ label: 'Eliminar Producto', action: 'delete' }, product);

    expect(deleteSpy).toHaveBeenCalledWith({ id: 'prod-001', name: 'Tarjeta Black' });
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('does not emit edit or delete events for an unknown action', () => {
    const fixture = TestBed.createComponent(ProductTableComponent);
    const component = fixture.componentInstance;
    const editSpy = vi.spyOn(component.editProduct, 'emit');
    const deleteSpy = vi.spyOn(component.deleteProduct, 'emit');

    component.onMenuAction({ label: 'Otra acción', action: 'other' }, product);

    expect(editSpy).not.toHaveBeenCalled();
    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it('renders empty state message when products list is empty', () => {
    const fixture = TestBed.createComponent(ProductTableComponent);

    fixture.detectChanges();

    const emptyCell = fixture.nativeElement.querySelector('.empty-state') as HTMLElement;
    expect(emptyCell).not.toBeNull();
    expect(emptyCell.textContent).toContain('No se encontraron productos');
  });

  it('renders one row per product with name, description, and dates', () => {
    const products = [
      {
        id: 'prod-001',
        name: 'Tarjeta Black',
        description: 'Producto premium',
        logo: 'https://example.com/logo.png',
        date_release: '2026-01-01',
        date_revision: '2027-01-01',
      },
      {
        id: 'prod-002',
        name: 'Cuenta Ahorro',
        description: 'Cuenta de ahorro básica',
        logo: 'https://example.com/logo2.png',
        date_release: '2026-03-15',
        date_revision: '2027-03-15',
      },
    ];
    const fixture = TestBed.createComponent(ProductTableComponent);
    fixture.componentRef.setInput('products', products);

    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Tarjeta Black');
    expect(text).toContain('Producto premium');
    expect(text).toContain('Cuenta Ahorro');
    expect(text).toContain('Cuenta de ahorro básica');
  });

  it('renders product logo image with correct src and alt attributes', () => {
    const fixture = TestBed.createComponent(ProductTableComponent);
    fixture.componentRef.setInput('products', [product]);

    fixture.detectChanges();

    const img = fixture.nativeElement.querySelector('img.product-logo') as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.src).toContain('example.com/logo.png');
    expect(img.alt).toBe('Tarjeta Black');
  });

  it('does not render empty-state row when products are provided', () => {
    const fixture = TestBed.createComponent(ProductTableComponent);
    fixture.componentRef.setInput('products', [product]);

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.empty-state')).toBeNull();
  });
});
