import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import * as AOS from 'aos';
import { Brand } from 'src/app/models/brand';
import { Category } from 'src/app/models/category';
import { NavigationItem } from 'src/app/models/navigation';
import { HomeService } from 'src/app/services/home.service';
import { environment } from 'src/environments/environment.prod';
import { RestService } from 'src/app/services/rest.service';

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

  constructor(private primengConfig: PrimeNGConfig, private _rest : RestService , private _homeService : HomeService) { 
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

  // navSpy(){
  //   const options = {threshold: 1, rootMargin: '0px 0px -50% 0px'};
  //   const headers = document.querySelectorAll('.content .header');
  //   const links = document.querySelectorAll('nav .links li a');

  //   const observer = new IntersectionObserver((entries, observer)=>{
  //     entries.forEach((entry)=>{
  //       if(entry.isIntersecting){
  //         const id = `#${entry.target.id}`;
  //         history.pushState({},"",id);
  //       }
  //     });
  //   },options);

  //   headers.forEach((header)=>{
  //     observer.observe(header);
  //   })
  // }

  getAllCategories() {
    this.loading = true;
    this._rest.getCategories()
    .subscribe((response : Category[]) =>{
      this.categories = Object.values(response);
      this.categories = this.categories.sort(this.sortCategories);
      this.categories = this.categories.filter(i => i.category_status == 1 && i.category_name !='NO DEFINIDO');
      this.loading = false;
    });
  }

  getAllBrands(){
    this._rest.getBrands()
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
}
