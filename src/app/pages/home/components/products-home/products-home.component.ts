import { Component, OnInit } from '@angular/core';
import { Category } from '@models/interfaces';
import { CategoryService } from 'src/app/pages/admin/category/service/category.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: ['./products-home.component.css']
})
export class ProductsHomeComponent implements OnInit {
  categories  : Category [] = [];
  loading : boolean = false;
  host: string = environment.URL;
  overImage: string = "assets/img/not_image.png";

  constructor( private categoriesService : CategoryService) { }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.loading = true;
    this.categoriesService.getCategories()
    .subscribe((response : Category[]) =>{
      this.categories = Object.values(response);
      this.categories = this.categories.sort(this.sortCategories);
      this.categories = this.categories.filter(i => i.category_status == 1 && i.category_name !='NO DEFINIDO');
      this.loading = false;
    });
  }

  sortCategories(x : any ,y : any){
    if(x.category_name < y.category_name) return -1;
    if(x.category_name > y.category_name) return 1;
    return 0;
  }
}
