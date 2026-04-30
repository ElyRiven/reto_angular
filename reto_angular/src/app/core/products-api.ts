import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ProductsResponse } from './product.model';

@Injectable({ providedIn: 'root' })
export class ProductsApi {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.apiUrl}/bp/products`).pipe(timeout(5000));
  }
}
