import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginate'
})
export class PaginatePipe implements PipeTransform {

  transform(items: any[], pageObject: { pageIndex: number, pageSize: number }|null): any[] {
    if (!items || !pageObject) {
      return [];
    }
    
    const startIndex = pageObject.pageIndex * pageObject.pageSize;
    const endIndex = startIndex + pageObject.pageSize;
    return items.slice(startIndex, endIndex);
  }


}
