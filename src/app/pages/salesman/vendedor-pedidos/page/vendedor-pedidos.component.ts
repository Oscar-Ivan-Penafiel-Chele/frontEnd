import { Component, OnInit } from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { PdfMakeWrapper} from 'pdfmake-wrapper';
import { VendedorServiceService } from '../service/vendedor-service.service';
import { GeneratePdfFacturaService } from 'src/app/shared/services/pdfs/generate-pdf-factura.service';
import { ISailOrder } from '@models/interfaces';

PdfMakeWrapper.setFonts(pdfFonts);
@Component({
  selector: 'app-vendedor-pedidos',
  templateUrl: './vendedor-pedidos.component.html',
  styleUrls: ['./vendedor-pedidos.component.css'],
  providers: [ConfirmationService,MessageService]
})
export class VendedorPedidosComponent implements OnInit {

  pedidos : any;
  loading : boolean = false;
  products: any;
  pedidosAux : any;
  dataAux : ISailOrder[] = [];
  options : any [] = [];
  selectedOptionFilter : any;
  dataAuxFilter : ISailOrder[] = [];
  isShowModalDetail : boolean = false;
  dataModal : any;
  timeResponse : any = {};
  isComplete: boolean = false;

  constructor(
    private vendedorService : VendedorServiceService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private generatePDF : GeneratePdfFacturaService
  ) {
    this.options = [
      {id: '1', name : 'Completado'},
      {id: '2', name : 'Pendiente'},
      {id: '3', name : 'Todos'},
    ]
  }

  ngOnInit(): void {
    this.getPedidos(false);
    this.refreshData();
  }

  refreshData(){
    setInterval(()=>{
      this.getPedidos(true);
    },100000);
  }

  getPedidos(isRefresh: boolean){
    this.selectedOptionFilter = 2;
    if(!isRefresh) this.loading = true;
    this.vendedorService.getPendingOrders().subscribe((response) =>{
      this.groupOrderByIdOrder(response, isRefresh);
    })
  }

  groupOrderByIdOrder(response : any, isRefresh: boolean){
    this.pedidos = {};

    let data : any = {};

    response.forEach((i : any)=>{
      if(!data.hasOwnProperty(i.id_order)){
        data[i.id_order] = {
          orders : []
        }
      }

      data[i.id_order].orders.push({i});
    });

    this.pedidos = Object.values(data)
    this.createInterfaceTable(this.pedidos, isRefresh);
  }

  createInterfaceTable(pedidos : any, isRefresh: boolean){
    this.dataAux = [];
    this.dataAuxFilter = [];
    pedidos.forEach((pedido : any) =>{
      this.dataAuxFilter.push(
        {
          id_order : pedido.orders[0].i.order.id_order,
          name : `${pedido.orders[0].i.order.user.user_name} ${pedido.orders[0].i.order.user.user_lastName}` ,
          order_date : pedido.orders[0].i.create_date,
          update_date : pedido.orders[0].i.updated_at,
          total : pedido.orders[0].i.order.order_price_total,
          status : pedido.orders[0].i.order.order_status.order_status_description,
          recent_order: pedido.orders[0].i.order.recent_order,
          information : pedido.orders
        }
      );
    });

    if(!isRefresh) this.loading = false;
    this.dataAuxFilter = Object.values(this.dataAuxFilter);
    this.dataAux = this.dataAuxFilter.filter(i => i.status == 'Pendiente');
    console.log(this.dataAux);
  }

  complete(pedido : any){
    const data = {
      id_order : pedido.id_order,
    }

    this.confirmationService.confirm({
      message: `¿Está seguro de completar el pedido de: ${pedido.name}?`,
      header: 'Completar Pedido',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel : "Confirmar",
      accept: () => {
          this.vendedorService.changeStateOrder(data).subscribe((response)=>{
            if(response.status == 200 || response.message == "Orden completada"){
              this.getPedidos(false);
              this.messageService.add({severity:'success', summary:'Completado', detail:`El pedido de ${pedido.name} ha sido completado`, life: 3000});
            }else if( response.status >= 400 && response.status <= 500 || response.message == "Ocurrio un error interno en el servidor"){
              this.messageService.add({severity:'error', summary:'Error', detail:`${response.message}`,life : 3000});
            }
          })
      }
  });
  }

  viewOrder(pedido : any){
    this.generatePDF.generateFacturePDF({orders : pedido});
  }

  change($event : any){
    let filter = 0;

    filter = $event.path[2].attributes[1].value

    if(filter == 1){
      this.dataAux = this.dataAuxFilter.filter( i => i.status == 'Completada')
    }else if( filter == 2){
      this.dataAux = this.dataAuxFilter.filter( i => i.status == 'Pendiente')
    }else if(filter == 3){
      this.dataAux = this.dataAuxFilter;
    }
  }

  showModal(pedido : ISailOrder){
    this.vendedorService.getDateOrderComplete(pedido.id_order).subscribe((response: any)=>{
      this.dataModal = response;
      this.isShowModalDetail = true
    });
  }


}
