import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { map } from 'rxjs';
import { ProductCardComponent } from "../../components/product-card/product-card.component";

@Component({
  selector: 'app-gender-page',
  imports: [ProductCardComponent],
  templateUrl: './gender-page.component.html',
})
export class GenderPageComponent {

  route = inject(ActivatedRoute)
  productsService = inject(ProductsService);

  gender = toSignal(this.route.params.pipe(map(({gender}) => gender)));

  productsResource = rxResource({
    request: () => ({gender: this.gender()}),
    loader: ({request}) => {
      return this.productsService.getProducts({
        limit:9,
        gender: this.gender()
      });
    }
  })

}
