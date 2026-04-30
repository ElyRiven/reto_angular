import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, of } from 'rxjs';
import { ProductsApi } from './products-api';
import { Product } from './product.model';

export type PageSize = 5 | 10 | 20;

@Injectable({ providedIn: 'root' })
export class ProductsStore {
  private readonly api = inject(ProductsApi);

  readonly allProducts = signal<Product[]>([]);
  readonly searchTerm = signal<string>('');
  readonly pageSize = signal<PageSize>(5);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly filteredProducts = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const all = this.allProducts();
    const size = this.pageSize();
    const filtered = search ? all.filter((p) => p.name.toLowerCase().includes(search)) : all;
    return filtered.slice(0, size);
  });

  readonly totalCount = computed(() => this.filteredProducts().length);

  loadProducts(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api
      .getProducts()
      .pipe(
        catchError(() => {
          this.error.set('Error al cargar los productos. Por favor, intenta nuevamente.');
          this.loading.set(false);
          return of(null);
        }),
      )
      .subscribe((response) => {
        if (response) {
          this.allProducts.set(response.data);
        }
        this.loading.set(false);
      });
  }

  setSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }

  setPageSize(size: PageSize): void {
    this.pageSize.set(size);
  }
}
