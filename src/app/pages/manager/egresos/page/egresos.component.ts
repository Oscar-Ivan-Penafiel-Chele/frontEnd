import { Component, OnInit } from '@angular/core';
import { Egreso, User, Product, EgresoAux } from '@models/interfaces';
import { PrimeNGConfig, MessageService} from 'primeng/api';
import { Canvas, Columns, Img, ITable, Line, PdfMakeWrapper, Stack, Table, Txt  } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { TokenService } from 'src/app/auth/service/token.service';
import { ProductService } from 'src/app/pages/admin/products/service/product.service';
import { EgresosService } from '../service/egresos.service';
import { GeneratePdfReportEgresosService } from 'src/app/shared/services/pdfs/generate-pdf-report-egresos.service';

PdfMakeWrapper.setFonts(pdfFonts);
type TableRow = [];

@Component({
  selector: 'app-egresos',
  templateUrl: './egresos.component.html',
  styleUrls: ['./egresos.component.css'],
  providers: [MessageService]
})
export class EgresosComponent implements OnInit {

  egresos : Egreso[] = [];
  egresosAux : Egreso[] = [];
  user : User = {};
  products : Product[] = [];

  egreso : Egreso = {} as Egreso;
  egresoAux : EgresoAux = {} as EgresoAux;
  loading : boolean = false;
  fechaInicio : any;
  fechaFin : any;
  dataExtract : any;
  displayNewModal : boolean = false;
  submitted : boolean = false;
  descriptionOption : any;
  maxAmountProduct : number = 0;
  inventory_description : any = "";
  inventory_description_aux : any ="";

  constructor(
    private egresoService : EgresosService,
    private _token : TokenService,
    private config: PrimeNGConfig,
    private messageService: MessageService,
    private productService : ProductService,
    private reportEgresosPDFService: GeneratePdfReportEgresosService
  ) {
    this.descriptionOption = [
      {label : 'REGALO A EMPLEADO' , icon : 'pi pi-user'},
      {label : 'DONACIÓN A FUNDACIÓN O INSTITUCIÓN', icon : 'pi pi-building'},
      {label : 'MERCADERÍA REGALADA', icon : 'pi pi-box'},
      {label : 'OTRO', icon : 'pi pi-paperclip'},
    ];
    this.config.setTranslation({
      "clear" : "Vaciar",
      "today" : "Hoy",
      "dayNamesMin": ["D","L","M","X","J","V","S"],
      "monthNames": ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
      "monthNamesShort": ["Ene", "Feb", "Mar", "Abr", "May", "Jun","Jul", "Ago", "Set", "Oct", "Nov", "Dic"],
    });
  }

  ngOnInit(): void {
    this.getProducts();
    this.getEgresos(false);
    this.getDataProfile();
    this.refreshData();
  }

  refreshData(){
    setInterval(()=>{
      this.getEgresos(true);
    },100000);
  }

  getProducts(){
    this.productService.getProducts().subscribe((response : Product[])=>{
      this.products = Object.values(response);
      this.products = this.products.filter((i) => i.product_status == 1 && i.product_stock! > 0);
    })
  }

  getEgresos(isRefresh: boolean){
    if(!isRefresh) this.loading = true;

    this.egresoService.getEgresos().subscribe((response : any)=>{
      this.egresos = Object.values(response);
      if(!isRefresh) this.loading = false;

      this.dataExtract = this.egresos.map(({order_detail, inventory_description, inventory_movement_type, inventory_stock_amount, create_date})=>{
        return {product_code : order_detail.producto.product_code, product_name : order_detail.producto.product_name, inventory_description, inventory_movement_type, inventory_stock_amount, create_date};
      })
    })
  }

  getDataProfile(){
    const data = this._token.getTokenDataUser();
    this.user = data;
    this.getRoleUser(this.user.id_role!);
  }

  getRoleUser(id_role : number){
    const roles : any= {
      1 : 'Gerente',
      2 : 'Administrador',
      3 : 'Contable',
      4 : 'Vendedor'
    }
  }

  openNewModal(){
    this.egresoAux = {} as EgresoAux;
    this.displayNewModal = true;
  }

  newEgreso(){
    this.submitted = true;

    if(!this.validateData()) return ;

    this.egresoAux.id_user = this.user.id_user!;
    this.egresoAux.inventory_description = this.inventory_description;
    this.egresoAux.inventory_description_aux = this.inventory_description_aux;
    this.inventory_description == "OTRO" ? this.egresoAux.inventory_description = null : this.egresoAux.inventory_description_aux = null;
    this.egresoAux.inventory_stock_amount = this.egresoAux.inventory_stock_amount;
    this.saveData();
  }

  saveData(){
    this.egresoService.createEgreso(this.egresoAux).subscribe((response)=>{
      if(response.status === 200 || response.message == "Guardado con exito"){
        this.getEgresos(false);
        this.messageService.add({severity:'success', summary: 'Completado', detail: 'Registro creado exitosamente'});
        this.hideNewModal();
      }else if(response.status === 400 || response.message == "Ocurrio un error interno al crear la orden"){
        this.messageService.add({severity:'error', summary: 'Error', detail: 'Ocurrió un error'});
      }
    },(error)=>{
      console.log(error);
    })
  }

  hideNewModal(){
    this.displayNewModal = false;
  }

  onChange($event : any){
    this.products.forEach((i)=>{
      if(i.id_product === $event.value) this.maxAmountProduct = i.product_stock!;
    });
  }

  onChangeDescription($event : any){
    if($event.value != "OTRO") this.inventory_description_aux = "";
  }

  validateData(){
    if(!this.egresoAux.id_product || !this.inventory_description || (this.inventory_description == 'OTRO' && !this.inventory_description_aux) || this.egresoAux.inventory_stock_amount == null) return false;

    return true;
  }

  async exportPDF(){
    this.egresosAux = this.dataExtract;

    this.egresosAux = this.egresos.filter((i)=> new Date(i.create_date).setHours(0,0,0,0).valueOf() >= (this.fechaInicio).valueOf() && new Date(i.create_date).setHours(0,0,0,0).valueOf() <= (this.fechaFin).valueOf() );

    if(this.egresosAux.length == 0) {
      this.messageService.add({severity:'info', summary: 'Info', detail: 'No se encontraron registros en el rango de fechas elegidas', life : 4000});
      return ;
    };

    this.reportEgresosPDFService.generatePDF(this.egresosAux, this.user, this.fechaInicio, this.fechaFin);
  }
}
