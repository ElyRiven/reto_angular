import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PaginationComponent } from '@components/pagination/pagination';
import { ProductTableComponent } from '@components/product-table/product-table';
import { SearchBarComponent } from '@components/search-bar/search-bar';
import { PageSize, ProductsStore } from '@core/products-store';

@Component({
  selector: 'app-products-page',
  imports: [SearchBarComponent, ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-page.html',
  styleUrl: './products-page.css',
})
export class ProductsPage implements OnInit {
  readonly store = inject(ProductsStore);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.store.loadProducts();
  }

  onSearch(term: string): void {
    this.store.setSearchTerm(term);
  }

  onPageSizeChange(size: PageSize): void {
    this.store.setPageSize(size);
  }

  onEditProduct(productId: string): void {
    this.router.navigate(['/products/update', productId]);
  }
}
