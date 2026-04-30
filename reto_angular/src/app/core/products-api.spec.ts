import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, beforeEach, afterEach, expect, it, vi } from 'vitest';
import { ProductsApi } from './products-api';
import { environment } from '../../environments/environment';
import { ProductCreateRequest, ProductUpdateRequest } from './product.model';

describe('ProductsApi', () => {
  let api: ProductsApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [ProductsApi, provideHttpClient(), provideHttpClientTesting()],
    });

    api = TestBed.inject(ProductsApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches all products via GET request', () => {
    const mockResponse = {
      data: [
        {
          id: 'prod-001',
          name: 'Cuenta Nómina',
          description: 'Descripción 1',
          logo: 'https://example.com/1.png',
          date_release: '2026-01-01',
          date_revision: '2027-01-01',
        },
      ],
    };

    api.getProducts().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/bp/products`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('builds DELETE url with encoded id when deleting a product', () => {
    api.deleteProduct('prod 001').subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/bp/products/prod%20001`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });

  it('builds verification url with encoded id', () => {
    api.verifyProductId('id con espacios').subscribe((response) => {
      expect(response).toBe(true);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/bp/products/verification/id%20con%20espacios`,
    );
    expect(req.request.method).toBe('GET');

    req.flush(true);
  });

  it('builds POST url with expected body when creating a product', () => {
    const payload: ProductCreateRequest = {
      id: 'prod-100',
      name: 'Cuenta Ahorro Plus',
      description: 'Producto de ahorro con beneficios',
      logo: 'https://example.com/logo.png',
      date_release: '2026-05-10',
      date_revision: '2027-05-10',
    };

    api.createProduct(payload).subscribe((response) => {
      expect(response).toEqual(payload);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/bp/products`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush(payload);
  });

  it('builds PUT url with encoded id and expected body when updating a product', () => {
    const payload: ProductUpdateRequest = {
      name: 'Cuenta Ahorro Editada',
      description: 'Descripción actualizada del producto',
      logo: 'https://example.com/logo-editado.png',
      date_release: '2026-08-01',
      date_revision: '2027-08-01',
    };

    api.updateProduct('prod 200', payload).subscribe((response) => {
      expect(response).toEqual({ id: 'prod 200', ...payload });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/bp/products/prod%20200`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);

    req.flush({ id: 'prod 200', ...payload });
  });
});
