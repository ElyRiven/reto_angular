import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Product } from '@core/product.model';
import { ContextMenuComponent, MenuItem } from '@components/context-menu/context-menu';

export interface DeleteProductEvent {
  id: string;
  name: string;
}

@Component({
  selector: 'app-product-table',
  imports: [DatePipe, ContextMenuComponent],
  templateUrl: './product-table.html',
  styleUrl: './product-table.css',
})
export class ProductTableComponent {
  readonly products = input<Product[]>([]);
  readonly editProduct = output<string>();
  readonly deleteProduct = output<DeleteProductEvent>();

  readonly menuItems: MenuItem[] = [
    { label: 'Editar Producto', action: 'edit' },
    { label: 'Eliminar Producto', action: 'delete' },
  ];

  onMenuAction(item: MenuItem, product: Product): void {
    if (item.action === 'edit') {
      this.editProduct.emit(product.id);
    } else if (item.action === 'delete') {
      this.deleteProduct.emit({ id: product.id, name: product.name });
    }
  }
}
