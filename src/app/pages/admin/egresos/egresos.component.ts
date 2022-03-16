import { Component, OnInit } from '@angular/core';
import { Egreso } from 'src/app/models/egreso';
import { RestService } from 'src/app/services/rest.service';
import { Canvas, Cell, Columns, Img, ITable, Line, PdfMakeWrapper, QR, Stack, Table, Toc, Txt  } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { User } from 'src/app/models/user';
import { TokenService } from 'src/app/services/token.service';
import { Product } from 'src/app/models/product';
import { EgresoAux } from 'src/app/models/egresoAuxilia';
import { MessageService } from 'primeng/api';

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
  displayNewModal : boolean = false;
  submitted : boolean = false;
  descriptionOption : any;
  maxAmountProduct : number = 0;
  inventory_description : any = "";
  inventory_description_aux : any ="";

  constructor(
    private _rest : RestService,
    private _token : TokenService,
    private messageService: MessageService
  ) { 
    this.descriptionOption = [
      {label : 'REGALO A EMPLEADO' , icon : 'pi pi-user'},
      {label : 'DONACIÓN A FUNDACIÓN O INSTITUCIÓN', icon : 'pi pi-building'},
      {label : 'MERCADERÍA REGALADA', icon : 'pi pi-box'},
      {label : 'OTRO', icon : 'pi pi-paperclip'},
    ]
  }

  ngOnInit(): void {
    this.getProducts();
    this.getEgresos();
    this.getDataProfile();
  }

  getProducts(){
    this._rest.getProducts().subscribe((response : Product[])=>{
      this.products = Object.values(response);
      this.products = this.products.filter((i) => i.product_status == 1 && i.product_stock! > 0);
    })
  }

  getEgresos(){
    this.loading = true;
    this._rest.getEgresos().subscribe((response : Egreso[])=>{
      this.egresos = Object.values(response);
      this.loading = false;
      console.log(response);
    })
  }

  getDataProfile(){
    const data = this._token.getTokenDataUser() as string;
    this.user = JSON.parse(data);
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

  openModal(egreso : any){
   
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
    this.egresoAux.inventory_stock_amount = this.egresoAux.inventory_stock_amount.toFixed(2);
    this.saveData();
  }

  saveData(){
    this._rest.createEgreso(this.egresoAux).subscribe((response)=>{
      if(response.status === 200 || response.message == "Guardado con exito"){
        this.getEgresos();
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
    console.log($event.value);
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
    this.egresosAux = [];

    this.egresosAux = this.egresos.filter((i)=> new Date(i.create_date).setHours(0,0,0,0).valueOf() >= (this.fechaInicio).valueOf() && new Date(i.create_date).setHours(0,0,0,0).valueOf() <= (this.fechaFin).valueOf() );
    
    const fecha = new Date();
    const pdf = new PdfMakeWrapper();
    pdf.info({
        title: 'Reporte de Egresos',
        author: '@Yebba',
        subject: 'Mostrar los Egresos',
    });
    pdf.pageSize('A4');
    pdf.pageOrientation('portrait'); // 'portrait'
    pdf.add(
      new Stack([
        new Columns([
          await new Img('assets/img/log_app_pdf.svg').width(100).build(),
          new Columns([
            new Stack([
              new Columns([ 
                new Txt('Reporte de Egresos').fontSize(14).bold().end,
              ]).color('#3f3f3f').end,
              new Columns([ 
                new Txt('Módulo de Egresos  \n\n').fontSize(11).end,
              ]).color('#3f3f3f').end,
              new Columns([ 
                new Txt('').alignment('right').width('*').bold().end,
                new Txt('Usuario: ').alignment('right').width('*').bold().end,
                new Txt(`${this.user.user_name} ${this.user.user_lastName}`).width(60).alignment('right').end,
                new Txt('Fecha: ').alignment('right').width(40).bold().end,
                new Txt(`${fecha.getFullYear()}/${(fecha.getMonth()+1) < 10 ? '0'+(fecha.getMonth()+1) : (fecha.getMonth()+1)}/${fecha.getDate() < 10 ? '0'+fecha.getDate() : fecha.getDate()} `).width(55).alignment('right').end,
                new Txt('Hora:').alignment('right').width(30).bold().end,
                new Txt(`${fecha.getHours() < 10 ? '0'+fecha.getHours() : fecha.getHours()}:${fecha.getMinutes() < 10 ? '0'+fecha.getMinutes() : fecha.getMinutes()} \n\n`).width(30).alignment('right').end,
              ]).end,
            ]).width('*').color('#3f3f3f').alignment('right').fontSize(10).end
          ]).end
        ]).end
      ]).end
    );
    pdf.add(
      '\n'
    )
    pdf.add(
      new Columns([
        new Canvas([
            new Line([0,0], [515,0]).lineColor('#ccc').end
        ]).end,
      ]).width('*').end
    );
    pdf.add(
      '\n\n'
    )
    pdf.add(
      this.createDetailsPDF()
    );
    pdf.add(
      new Txt(`\n ${this.egresosAux.length} ${this.egresos.length < 2 ? 'Egreso' : 'Egresos'}`).alignment('right').bold().fontSize(10).margin(10).end
    );  
    pdf.add(this.createTable(this.egresosAux));
    pdf.footer((currentPage : any, pageCount : any)=>{
      return new Txt(`Pág. ${currentPage}/${pageCount}`).color('#3f3f3f').margin([20,5,40,20]).alignment('right').fontSize(10).end;
    });
    pdf.create().open();
  }

  createTable(data : any): ITable{
    return new Table([
      [ 'N° Orden','Cliente','Descripción', 'Número De Comprobante','Total','Fecha de Creación'],
      ...this.extractData(data),
    ]).widths([ 55,100,80,70,'*',100]).color('#3f3f3f').layout('lightHorizontalLines').fontSize(10).end;
  }

  createDetailsPDF(){
    return new Stack([
      new Columns([ 
        new Txt('').bold().width('*').alignment('center').end,
        new Txt('Inicio: ').bold().width(30).alignment('center').end,
        new Txt(`${this.fechaInicio.getFullYear()}/${(this.fechaInicio.getMonth()+1) < 10 ? '0'+(this.fechaInicio.getMonth()+1) : (this.fechaInicio.getMonth()+1)}/${this.fechaInicio.getDate() < 10 ? '0'+this.fechaInicio.getDate() : this.fechaInicio.getDate()} `).width(65).alignment('center').end,
        new Txt('Fin: ').bold().width(20).alignment('center').end,
        new Txt(`${this.fechaFin.getFullYear()}/${(this.fechaFin.getMonth()+1) < 10 ? '0'+(this.fechaFin.getMonth()+1) : (this.fechaFin.getMonth()+1)}/${this.fechaFin.getDate() < 10 ? '0'+this.fechaFin.getDate() : this.fechaFin.getDate()} `).width(65).alignment('center').end,
        new Txt('Movimiento: ').width(55).bold().alignment('center').end,
        new Txt('Egresos').width(55).alignment('center').end,
        new Txt('').bold().width('*').alignment('center').end,
      ]).alignment('center').end,
    ]).color('#3f3f3f').alignment('center').fontSize(10).end
  }

  extractData(data : any) : TableRow{
    return data.map((row : any) => [
      row.id_order, row.order.user.user_name+" "+row.order.user.user_lastName, row.inventory_description , row.order.voucher_number, row.order.order_price_total, row.create_date
    ])
  }
}
