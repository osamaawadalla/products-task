import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  { path: '', loadChildren: () => import('./features/home/home-routes') },
  { path: 'products', loadChildren: () => import('./features/products/products-routes') },
  { path: 'features', loadChildren: () => import('./features/features/features-routes') }
];
