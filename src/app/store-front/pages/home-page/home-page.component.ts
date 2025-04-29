import { Component, computed, inject, signal } from '@angular/core';
import { ProductsService } from '@products/services/products.service';
import { ProductCardComponent } from '@store-front/components/product-card/product-card.component';
import {rxResource} from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {

  productsService = inject(ProductsService);
  // products = signal<Product[]>([]);

  productsResource = rxResource({
    request: () => ({}),
    loader: ({request}) => {
      return this.productsService.getProducts({
        limit:5,
        gender: "women"
      });
    }
  })


}
