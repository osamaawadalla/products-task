import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feature } from 'src/app/core/models/feature';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor() { }

  getFeatures(): Observable<any> {
    try {
      let currentFeaturesStr: string = localStorage.getItem('features')!;
      if (currentFeaturesStr) {
        let currentFeaturesArr: any[] = JSON.parse(currentFeaturesStr);
        return new Observable((observer) => {
          observer.next({ code: 200, message: 'Done!', data: currentFeaturesArr });
        });
      } else {
        return new Observable((observer) => {
          observer.next({ code: 200, message: 'Done!', data: [] });
        });
      }
    } catch (error) {
      return new Observable((observer) => {
        observer.error({ code: 500, message: 'Something went wrong!' });
      });
    }
  }

  getProducts(): Observable<any> {
    try {
      let currentProductsStr: string = localStorage.getItem('products')!;
      if (currentProductsStr) {
        let currentProductsArr: any[] = JSON.parse(currentProductsStr);
        return new Observable((observer) => {
          observer.next({ code: 200, message: 'Done!', data: currentProductsArr });
        });
      } else {
        return new Observable((observer) => {
          observer.next({ code: 200, message: 'Done!', data: [] });
        });
      }
    } catch (error) {
      return new Observable((observer) => {
        observer.error({ code: 500, message: 'Something went wrong!' });
      });
    }
  }

  deleteProduct(ids: any[]): Observable<any> {
    let currentProductsStr: string = localStorage.getItem('products')!;
    if (currentProductsStr) {
      try {
        let currentProductsArr: any[] = JSON.parse(currentProductsStr);
        currentProductsArr = currentProductsArr.filter(product => !ids.includes(product.id));
        localStorage.setItem('products', JSON.stringify(currentProductsArr));
        return new Observable((observer) => {
          observer.next({ code: 200, message: 'Product deleted successfully!' });
        });
      } catch (error) {
        return new Observable((observer) => {
          observer.error({ code: 500, message: 'Something went wrong!' });
        });
      }
    } else {
      return new Observable((observer) => {
        observer.error({ code: 400, message: 'Not Found!' });
      });
    }
  }

}
