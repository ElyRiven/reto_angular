import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { FormField } from '@angular/forms/signals';
import { ProductEditStore } from '@core/product-edit-store';

@Component({
  selector: 'app-product-edit-page',
  imports: [FormField, RouterLink],
  templateUrl: './product-edit-page.html',
  styleUrl: './product-edit-page.css',
})
export class ProductEditPage implements OnInit {
  readonly store = inject(ProductEditStore);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('productId') ?? '';
    this.store.loadProduct(productId);
  }
}
