import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Product } from '@core/product.model';

@Component({
  selector: 'app-product-table',
  imports: [DatePipe],
  templateUrl: './product-table.html',
  styleUrl: './product-table.css',
})
export class ProductTableComponent {
  readonly products = input<Product[]>([]);
}
