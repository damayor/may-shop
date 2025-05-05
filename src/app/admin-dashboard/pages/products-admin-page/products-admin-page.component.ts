import { Component, inject, signal } from '@angular/core';
import { ProductTableComponent } from "../../../products/components/product-table/product-table.component";
import { RouterLink, RouterLinkActive } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsService } from '@products/services/products.service';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {

  productsService = inject(ProductsService);

  productsPerPage = signal(10);

  productsResource = rxResource({
    request: () => ({limit: this.productsPerPage()}),
    loader: ({request}) => {
      return this.productsService.getProducts({
        limit: request.limit,
      });
    }
  })

}
