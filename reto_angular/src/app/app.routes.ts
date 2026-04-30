import { Routes } from '@angular/router';
import { ProductsPage } from './pages/products-page/products-page';
import { ProductFormPage } from './pages/product-form-page/product-form-page';

export const routes: Routes = [
  {
    path: 'products/new',
    component: ProductFormPage,
  },
  {
    path: 'products',
    component: ProductsPage,
  },
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'products',
  },
];
