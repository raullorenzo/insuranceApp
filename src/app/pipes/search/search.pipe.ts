import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  // transform(items: any[], terms: string): any[] {
  //   if (!items) { return []; }
  //   if (!terms) { return items; }
  //   terms = terms.toLowerCase();
  //   return items.filter(it => {
  //     return it.name.toLowerCase().includes(terms);
  //   });
  // }
  transform(items: any[], field: string, value: string): any[] {
    console.log('Pipe Search:', value);
    if (!items) {
        return [];
    }
    if (!field || !value) {
        return items;
    }

    return items.filter(singleItem =>
        singleItem[field].toLowerCase().includes(value.toLowerCase())
    );
  }
}
