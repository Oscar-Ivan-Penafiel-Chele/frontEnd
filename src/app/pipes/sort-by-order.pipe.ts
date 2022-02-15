import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '../models/category';
import * as _ from 'underscore';

@Pipe({
  name: 'sortByOrder'
})
export class SortByOrderPipe implements PipeTransform {

  transform(value: Array<any>): Array<any> {
    if(!value) return [];
    return _.sortBy(value, function(i){ return i.name})
  }

}
