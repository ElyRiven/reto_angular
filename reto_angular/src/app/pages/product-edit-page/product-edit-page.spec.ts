import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError, NEVER } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductEditPage } from './product-edit-page';
import { ProductsApi } from '@core/products-api';

describe('ProductEditPage', () => {
  const product = {
    id: 'prod-001',
    name: 'Cuenta Nómina',
    description: 'Descripción base para edición',
    logo: 'https://example.com/logo.png',
    date_release: '2026-06-01',
    date_revision: '2027-06-01',
  };

  const apiMock = {
    getProducts: vi.fn(),
    updateProduct: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: vi.fn(() => 'prod-001'),
      },
    },
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    apiMock.getProducts.mockReturnValue(of({ data: [product] }));

    await TestBed.configureTestingModule({
      imports: [ProductEditPage],
      providers: [
        { provide: ProductsApi, useValue: apiMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();
  });

  it('loads product by route param on init', () => {
    const fixture = TestBed.createComponent(ProductEditPage);

    fixture.detectChanges();

    expect(activatedRouteMock.snapshot.paramMap.get).toHaveBeenCalledWith('productId');
    expect(apiMock.getProducts).toHaveBeenCalledTimes(1);
  });

  it('renders loading state while product data is pending', () => {
    apiMock.getProducts.mockReturnValue(NEVER);
    const fixture = TestBed.createComponent(ProductEditPage);

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Cargando producto...');
  });

  it('renders error state when loading product fails', () => {
    apiMock.getProducts.mockReturnValue(throwError(() => new Error('network')));
    const fixture = TestBed.createComponent(ProductEditPage);

    fixture.detectChanges();

    const content = fixture.nativeElement.textContent as string;
    expect(content).toContain('Error al cargar el producto. Por favor, intenta nuevamente.');
    expect(content).toContain('Reintentar');
    expect(content).toContain('Volver');
  });

  it('renders edit form with update title and disabled id input on successful load', () => {
    const fixture = TestBed.createComponent(ProductEditPage);

    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.page-title') as HTMLElement;
    const idInput = fixture.nativeElement.querySelector('#product-id') as HTMLInputElement;

    expect(title.textContent).toContain('Formulario de Actualización de Producto');
    expect(idInput.disabled).toBe(true);
    expect(idInput.value).toBe('prod-001');
  });

  it('retries loading when clicking Reintentar', () => {
    apiMock.getProducts.mockReturnValue(throwError(() => new Error('network')));
    const fixture = TestBed.createComponent(ProductEditPage);

    fixture.detectChanges();

    const retryButton = fixture.nativeElement.querySelector('.btn-retry') as HTMLButtonElement;
    retryButton.click();
    fixture.detectChanges();

    expect(apiMock.getProducts).toHaveBeenCalledTimes(2);
  });

  it('keeps Guardar button disabled when no changes exist', () => {
    const fixture = TestBed.createComponent(ProductEditPage);

    fixture.detectChanges();

    const saveButton = fixture.nativeElement.querySelector('.btn-submit') as HTMLButtonElement;
    expect(saveButton.disabled).toBe(true);
  });

  it('enables Guardar and saves changes when form is dirty and valid', async () => {
    apiMock.updateProduct.mockReturnValue(of({ ...product, name: 'Cuenta Editada' }));
    const fixture = TestBed.createComponent(ProductEditPage);
    const component = fixture.componentInstance;

    fixture.detectChanges();

    component.store.editModel.update((prev) => ({
      ...prev,
      name: 'Cuenta Editada',
      description: 'Descripción actualizada para el producto',
      logo: 'https://example.com/logo-editado.png',
      date_release: '2026-08-02',
    }));
    fixture.detectChanges();

    const saveButton = fixture.nativeElement.querySelector('.btn-submit') as HTMLButtonElement;
    expect(saveButton.disabled).toBe(false);

    saveButton.click();

    await vi.waitFor(() => {
      expect(apiMock.updateProduct).toHaveBeenCalledWith('prod-001', {
        name: 'Cuenta Editada',
        description: 'Descripción actualizada para el producto',
        logo: 'https://example.com/logo-editado.png',
        date_release: '2026-08-02',
        date_revision: '2027-08-02',
      });
    });

    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
  });
});
