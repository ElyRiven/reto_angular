import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PaginationComponent } from '@components/pagination/pagination';
import { ProductTableComponent } from '@components/product-table/product-table';
import { ConfirmDeleteModal } from '@components/confirm-delete-modal/confirm-delete-modal';
import { SearchBarComponent } from '@components/search-bar/search-bar';
import { PageSize, ProductsStore } from '@core/products-store';
import { DeleteProductEvent } from '@components/product-table/product-table';

@Component({
  selector: 'app-products-page',
  imports: [
    SearchBarComponent,
    ProductTableComponent,
    PaginationComponent,
    RouterLink,
    ConfirmDeleteModal,
  ],
  templateUrl: './products-page.html',
  styleUrl: './products-page.css',
})
export class ProductsPage implements OnInit {
  readonly store = inject(ProductsStore);
  private readonly router = inject(Router);

  readonly showDeleteModal = signal(false);
  readonly selectedProduct = signal<DeleteProductEvent | null>(null);

  constructor() {
    effect(() => {
      if (this.store.deleteSuccess()) {
        this.showDeleteModal.set(false);
        this.selectedProduct.set(null);
        this.store.resetDeleteState();
      }
    });
  }

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

  onDeleteProduct(event: DeleteProductEvent): void {
    this.store.resetDeleteState();
    this.selectedProduct.set(event);
    this.showDeleteModal.set(true);
  }

  cancelDelete(): void {
    this.showDeleteModal.set(false);
    this.selectedProduct.set(null);
    this.store.resetDeleteState();
  }

  confirmDelete(): void {
    const product = this.selectedProduct();
    if (product) {
      this.store.deleteProduct(product.id);
    }
  }
}
