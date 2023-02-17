import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feature } from 'src/app/core/models/feature';

@Injectable({
  providedIn: 'root'
})
export class FeaturesService {

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

  addFeature(feature: Feature): Observable<any> {
    let currentFeaturesStr: string = localStorage.getItem('features')!;
    if (currentFeaturesStr) {
      try {
        let currentFeaturesArr: any[] = JSON.parse(currentFeaturesStr);
        currentFeaturesArr.push({
          id: +currentFeaturesArr.at(-1).id + 1,
          name: feature.name
        });
        localStorage.setItem('features', JSON.stringify(currentFeaturesArr));
      } catch (error) {
        let currentFeaturesArr: any[] = [{ id: 1, name: feature.name }];
        localStorage.setItem('features', JSON.stringify(currentFeaturesArr));
      }
    } else {
      let currentFeaturesArr: any[] = [{ id: 1, name: feature.name }];
      localStorage.setItem('features', JSON.stringify(currentFeaturesArr));
    }
    return new Observable((observer) => {
      observer.next({ code: 200, message: 'Feature added successfully!' });
    });
  }

}
