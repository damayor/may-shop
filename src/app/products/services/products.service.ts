import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductsResponse } from '@products/interfaces/product.interface';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';


const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  gender: string;
  offset?: number;
}

@Injectable({providedIn: 'root'})
export class ProductsService {

  private http= inject(HttpClient)

  // constructor(private httpClient: HttpClient) { }

  getProducts(options: Options) : Observable<ProductsResponse> {

    const {limit = 9, offset = 0, gender = ''} = options;

    return this.http
      .get<ProductsResponse>(`${baseUrl}/products`, {
        params: {
          limit,
          offset,
          gender
        }
      })
      .pipe(tap((resp) => console.log(resp)));

  }





}
