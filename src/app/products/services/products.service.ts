import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Gender, Product, ProductsResponse } from '@products/interfaces/product.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
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

    //ToDo cache check

    return this.http
      .get<Product>(`${baseUrl}/products/${id}`)
      .pipe(tap((resp) => console.log(resp)))
  }

  //ToDo, cargue las imagenes  con el switchMap
  createProduct(productLike: Partial<Product>, imageFileList?: FileList): Observable<Product> {

    const currentImages = productLike.images ?? []; //si hay imagenes antes? ps total lo va a crear...

    return this.uploadImages(imageFileList)
      .pipe(
        map(imageNames => ({
          ...productLike,
          images: [...currentImages, ...imageNames ]
        })),
        switchMap((updatedProduct) =>
          this.http.post<Product>(`${baseUrl}/products`, updatedProduct)
        ),
        tap((product) => this.updateProductCache(product))
      )

    // return this.http
    //   .post<Product>(`${baseUrl}/products`, productLike)
    //   .pipe( tap((product) => this.updateProductCache(product)))

  }

  updateProduct(id: string, productLike : Partial<Product>, imageFileList?: FileList): Observable<Product>{
    console.log('Actualziando producto');

    const currentImages = productLike.images ?? [];

    return this.uploadImages(imageFileList)
      .pipe(
        map(imageNames => ({
          ...productLike,
          images: [...currentImages, ...imageNames ]
        })),
        switchMap((updatedProduct) =>
          this.http.patch<Product>(`${baseUrl}/products/${id}`, updatedProduct)
        ),
        tap((product) => this.updateProductCache(product))
      )

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

  //Tome un FileList y subalo!

  // POST api/files/product

  uploadImages(images?: FileList): Observable<string[]> {
    if(!images) return of([]);

    const uploadObservables =  Array.from(images).map( imageFile =>
      this.uploadImage(imageFile)
    );

    return forkJoin(uploadObservables).pipe(
      tap((imageNames) => console.log("Imagenes subidas: ",{imageNames}))
    );

  }

  uploadImage(imageFile: File): Observable<string> {

    const formData = new FormData();
    formData.append('file', imageFile)

    return this.http.post<{fileName: string}>(`${baseUrl}/files/product`, formData)
      .pipe(
        map(resp => resp.fileName)
      )

  }

}
