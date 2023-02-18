import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feature } from 'src/app/core/models/feature';
import { Product } from 'src/app/core/models/product';

@Injectable({
  providedIn: 'root'
})
export class AddProductService {

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

  getProductById(id: number): Observable<any> {
    let currentProductsStr: string = localStorage.getItem('products')!;
    if (currentProductsStr) {
      try {
        let currentProductsArr: any[] = JSON.parse(currentProductsStr);
        const product = currentProductsArr.find(product => product.id == id);
        if (product) {
          return new Observable((observer) => {
            observer.next({ code: 200, message: 'Done!', item: product });
          });
        } else {
          return new Observable((observer) => {
            observer.error({ code: 400, message: 'Not Found!' });
          });
        }
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

  addProduct(product: Product): Observable<any> {
    let currentProductsStr: string = localStorage.getItem('products')!;
    if (currentProductsStr) {
      try {
        let currentProductsArr: any[] = JSON.parse(currentProductsStr);
        product.lastupdated = new Date();
        product.id = +currentProductsArr.at(-1).id + 1;
        !product.code ? product.code = product.id.toString() : null;
        currentProductsArr.push(product);
        localStorage.setItem('products', JSON.stringify(currentProductsArr));
      } catch (error) {
        product.lastupdated = new Date();
        product.id = 1;
        !product.code ? product.code = '1' : null;
        let currentProductsArr: any[] = [product];
        localStorage.setItem('products', JSON.stringify(currentProductsArr));
      }
    } else {
      product.lastupdated = new Date();
      product.id = 1;
      !product.code ? product.code = '1' : null;
      let currentProductsArr: any[] = [product];
      localStorage.setItem('products', JSON.stringify(currentProductsArr));
    }
    return new Observable((observer) => {
      observer.next({ code: 200, message: 'Product added successfully!' });
    });
  }

  updateProduct(id: number, data: any): Observable<any> {
    let currentProductsStr: string = localStorage.getItem('products')!;
    if (currentProductsStr) {
      try {
        let currentProductsArr: any[] = JSON.parse(currentProductsStr);
        const productIndex = currentProductsArr.findIndex(product => product.id == id);
        if (productIndex == -1) {
          return new Observable((observer) => {
            observer.error({ code: 400, message: 'Not Found!' });
          });
        } else {
          data.lastupdated = new Date();
          data.id = id;
          currentProductsArr[productIndex] = data;
          localStorage.setItem('products', JSON.stringify(currentProductsArr));
          return new Observable((observer) => {
            observer.next({ code: 200, message: 'Product updated successfully!' });
          });
        }
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
