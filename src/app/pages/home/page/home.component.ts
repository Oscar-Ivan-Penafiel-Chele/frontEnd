import { Component, HostListener, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import * as AOS from 'aos';
import { Brand, Category, NavigationItem } from '@models/interfaces';
import { environment } from 'src/environments/environment.prod';
import { HomeService } from '../service/home.service';
import { CategoryService } from '../../admin/category/service/category.service';
import { BrandService } from '../../admin/brand/service/brand.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  responsiveOptions: any;
  brands : Brand [] = [];
  categories  : Category [] = [];
  itemNavigation : NavigationItem [] = [];
  host : string = environment.URL;
  overImage : string = "assets/img/not_image.png";
  loading : boolean = false;

  constructor(
    private primengConfig: PrimeNGConfig, 
    private _homeService : HomeService,
    private categoriesService : CategoryService,
    private brandService : BrandService
    ) { 
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
    ];
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    AOS.init({
      duration : 2000,
      once : true,
    });
    // this.navSpy();
    this.getAllCategories();
    this.getAllItemNavigation();
    this.getAllBrands();
  }

  isActive(){
    const iconBurger = document.querySelector('.icon-burger');
    iconBurger?.classList.toggle("active");
  }

  getAllItemNavigation(){
    this._homeService.getAllItemNavigation()
    .subscribe((response) =>{
      this.itemNavigation = response;
    });
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

  getAllBrands(){
    this.brandService.getBrands()
    .subscribe((response : Brand[]) => {
      this.brands = Object.values(response);
      this.brands = this.brands.filter(i => i.brand_status == 1 && i.brand_name != 'NO_DEFINIDO');
    })
  }

  sortCategories(x : any ,y : any){
    if(x.category_name < y.category_name) return -1;
    if(x.category_name > y.category_name) return 1;
    return 0;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event : any) {
      if(!this.getKeepSession()){
          localStorage.clear();
      }
  }

  getKeepSession(){
    const data = localStorage.getItem('keepSession');

    if(data!.toString() == "true"){
        return true;
    }else{
        return false;
    }
  }
}
