import { Routes } from '@angular/router';
import { ProductsPage } from './pages/products-page/products-page';

export const routes: Routes = [
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
