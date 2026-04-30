import { Routes } from '@angular/router';
import { ProductsPage } from './pages/products-page/products-page';
import { ProductFormPage } from './pages/product-form-page/product-form-page';
import { ProductEditPage } from './pages/product-edit-page/product-edit-page';

export const routes: Routes = [
  {
    path: 'products/new',
    component: ProductFormPage,
  },
  {
    path: 'products/update/:productId',
    component: ProductEditPage,
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
