import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
  ProductsResponse,
} from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductsApi {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.apiUrl}/bp/products`).pipe(timeout(5000));
  }

  createProduct(data: ProductCreateRequest): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/bp/products`, data);
  }

  verifyProductId(id: string): Observable<boolean> {
    return this.http
      .get<boolean>(`${this.apiUrl}/bp/products/verification/${encodeURIComponent(id)}`)
      .pipe(timeout(5000));
  }

  updateProduct(id: string, data: ProductUpdateRequest): Observable<Product> {
    return this.http
      .put<Product>(`${this.apiUrl}/bp/products/${encodeURIComponent(id)}`, data)
      .pipe(timeout(5000));
  }

  deleteProduct(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/bp/products/${encodeURIComponent(id)}`)
      .pipe(timeout(5000));
  }
}
