import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { ProductCarouselComponent } from "../../components/product-carousel/product-carousel.component";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarouselComponent],
  templateUrl: './product-page.component.html',
})
export class ProductPageComponent {


  productIdSlug = inject(ActivatedRoute).snapshot.params['idSlug']
  productsService = inject(ProductsService);


  productsResource = rxResource({
    request: () => ({productIdSlug: this.productIdSlug}),
    loader:({request}) => this.productsService.getProductByIdSlug(request.productIdSlug)
  })
}
