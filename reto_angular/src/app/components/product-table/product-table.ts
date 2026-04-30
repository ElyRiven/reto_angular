import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Product } from '@core/product.model';
import { ContextMenuComponent, MenuItem } from '@components/context-menu/context-menu';

@Component({
  selector: 'app-product-table',
  imports: [DatePipe, ContextMenuComponent],
  templateUrl: './product-table.html',
  styleUrl: './product-table.css',
})
export class ProductTableComponent {
  readonly products = input<Product[]>([]);
  readonly editProduct = output<string>();

  readonly menuItems: MenuItem[] = [{ label: 'Editar Producto', action: 'edit' }];

  onMenuAction(item: MenuItem, productId: string): void {
    if (item.action === 'edit') {
      this.editProduct.emit(productId);
    }
  }
}
