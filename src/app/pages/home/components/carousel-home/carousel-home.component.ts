import { Component, OnInit } from '@angular/core';
import { Brand } from '@models/interfaces';
import { BrandService } from 'src/app/pages/admin/brand/service/brand.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-carousel-home',
  templateUrl: './carousel-home.component.html',
  styleUrls: ['./carousel-home.component.css']
})
export class CarouselHomeComponent implements OnInit {
  brands: Brand [] = [];
  host: string = environment.URL;
  overImage: string = "assets/img/not_image.png";
  responsiveOptions: any[];

  constructor( private brandService : BrandService) {
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '800px',
          numVisible: 1,
          numScroll: 1
      },
    ];
  }

  ngOnInit(): void {
    this.getAllBrands();
  }

  getAllBrands(){
    this.brandService.getBrands()
    .subscribe((response : Brand[]) => {
      this.brands = Object.values(response);
      this.brands = this.brands.filter(i => i.brand_status == 1 && i.brand_name != 'NO_DEFINIDO');
    })
  }


}
