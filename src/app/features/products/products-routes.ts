import { Route } from "@angular/router";
import { ProductsComponent } from "./products.component";

export default [
    { path: '', component: ProductsComponent },
    { path: 'add', loadChildren: () => import('../../features/add-product/add-product-routes') },
    { path: 'edit/:id', loadChildren: () => import('../../features/add-product/add-product-routes') }
] as Route[];