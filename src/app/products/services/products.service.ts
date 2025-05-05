import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { User } from '@products/interfaces/user.interface';


const baseUrl = environment.baseUrl;

interface Options {
  limit?: number;
  gender?: string;
  offset?: number;
}

const emptyProduct: Product = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Men,
  tags: [],
  images: [],
  user: {} as User
}

@Injectable({providedIn: 'root'})
export class ProductsService {


  private http= inject(HttpClient)

  private productsCache = new Map<string, ProductsResponse>();
  private productCache = new Map<string, Product>();

  // constructor(private httpClient: HttpClient) { }

  getProducts(options: Options) : Observable<ProductsResponse> {

    const {limit = 9, offset = 0, gender = ''} = options;

    const key = `${limit}-${offset}-${gender}`
    if(this.productsCache.has(key)){
      return of(this.productsCache.get(key)!);
    }

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


  getProductByIdSlug(idSlug: string) : Observable<Product> {

    return this.http
      .get<Product>(`${baseUrl}/products/${idSlug}`)
      .pipe(tap((resp) => console.log(resp)))

  }

  getProductById(id: string): Observable<Product> {

    if(id === 'new'){
      return of(emptyProduct);
    }

    //cache check

    return this.http
      .get<Product>(`${baseUrl}/products/${id}`)
      .pipe(tap((resp) => console.log(resp)))
  }

  createProduct(productLike: Partial<Product>): Observable<Product> {
    return this.http
      .post<Product>(`${baseUrl}/products`, productLike)
      .pipe( tap((product) => this.updateProductCache(product)))

  }

  updateProduct(id: string, productLike : Partial<Product>): Observable<Product>{
    console.log('Actualziando producto');

    return this.http
      .patch<Product>(`${baseUrl}/products/${id}`, productLike)
        .pipe(  tap((product) => this.updateProductCache(product) )     )

  }

  updateProductCache(product: Product) {
    const productId = product.id;

    this.productCache.set(productId, product) //ToDo pongalo en el cache q esto no lo habia hecho

    this.productsCache.forEach(productsResponse => {
      productsResponse.products = productsResponse.products.map(
        (currentProduct) => {
          return currentProduct.id == productId ? product : currentProduct
      })

    })

  }



}
