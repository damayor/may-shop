import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment.development';

const baseUrl = environment.baseUrl

@Pipe({
  name: 'productImage'
})

export class ProductImagePipe implements PipeTransform {
  transform(value: null | string | string[]): string {

    const noImagePath = './assets/images/no-image.jpg'

    if(value == null ) {
      return noImagePath;
    }

    //array > 1
    //si es string

    if(value.length == 0 )
        return noImagePath;
    else if(typeof value == 'string')
      return `${baseUrl}/files/product/${value}`

    return `${baseUrl}/files/product/${value.at(0)}`;

  }
}
