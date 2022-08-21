import { Component, Host, Input, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@models/interfaces';
import { PrimeNGConfig } from 'primeng/api';
import { EncriptedCredentialService } from 'src/app/auth/service/encripted-credential.service';
import { PurchaseOrderComponent } from 'src/app/pages/admin/purchase_order/page/purchase-order.component';
import { CartServiceService } from 'src/app/pages/cart/service/cart-service.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-overlay-request',
  templateUrl: './overlay-request.component.html',
  styleUrls: ['./overlay-request.component.css']
})
export class OverlayRequestComponent implements OnInit {

  @Input() showOverlay: boolean = false;
  @Input() loadRequest: boolean = false;
  @Input() textOverlay: string = "";
  @Input() textResponse: string = "";
  @Input() url?: string = "";
  @Input() showButtons : boolean = false;
  @Input() showButtonDynamic? : boolean = false;
  @Input() iconResponse : string = "";
  @Input() textButton? : string = "";
  @Input() iconButton? : string = "";
  @Input() productsError? : any[] = [];
  @Input() isButtonHome? : boolean = false;
  @Input() existProducstError?: boolean = false;
  @Input() isChangePromotion?: boolean = false;
  @Input() isStockError?: boolean = false;
  @Input() textHeaderModal?: string = "";
  @Input() isPurchaseOrder?: boolean = false;
  @Input() changePassword?: boolean = false;

  display : boolean = false;
  iconDetail: string = "";
  user : User = {};

  overImage : string = "assets/img/not_image.jpg";
  host : string = environment.URL;

  constructor(
    private router : Router, private cartService : CartServiceService,
    @Host() @Optional() private purchaseComponent: PurchaseOrderComponent,
    private encriptedService: EncriptedCredentialService,
    private primengConfig : PrimeNGConfig,
    ) { }

  ngOnInit(): void {
    this.iconDetail = "pi pi-angle-down";
    this.primengConfig.ripple = true;
    this.getData();
  }

  goHome(){
    this.router.navigate(['/shop']);
  }

  getData(){
    const data = localStorage.getItem('user');

    this.user = this.encriptedService.decrypt(data!);
  }

  redirection(){
    let data: any = {}

    if(this.productsError!.length == 0) {
      if(this.changePassword){
        localStorage.clear();
      }

      this.router.navigate([this.url]);
      return;
    }

    const sizeProducts = (this.productsError!.length - 1 );

    this.productsError!.forEach((i : any, index) =>{
      data = {
        id_user : this.user.id_user,
        id_product : i.id
      }
      
      if(index == sizeProducts){
        this.router.navigate([this.url]);
      }

      if(i.stock.split('.')[0] != 0) return ;

      this.cartService.deleteProductCart(data).subscribe((r : any)=>{
        if(r.status >= 400){
          console.log(r);
        }
      })

    })
  }

  showDetails(){
    this.display = true;
  }

  closeOverlay(){
    this.showOverlay = false;
    this.purchaseComponent!.showOverlay = false;
  }

  goLogin(){
    this.router.navigate(['/login']);
  }
}
