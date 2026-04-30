import { Component, inject, OnInit } from '@angular/core';
import { FormField } from '@angular/forms/signals';
import { ProductFormStore } from '@core/product-form-store';

@Component({
  selector: 'app-product-form-page',
  imports: [FormField],
  templateUrl: './product-form-page.html',
  styleUrl: './product-form-page.css',
})
export class ProductFormPage implements OnInit {
  readonly store = inject(ProductFormStore);

  ngOnInit(): void {
    this.store.resetForm();
  }
}
