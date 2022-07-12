import { Component, OnInit } from '@angular/core';
import { RestService } from 'src/app/services/rest.service';
import {ConfirmationService, ConfirmEventType, MessageService} from 'primeng/api';
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { Canvas, Cell, Columns, Img, ITable, Line, PdfMakeWrapper, QR, Rect, Stack, Table, Toc, Txt  } from 'pdfmake-wrapper';
import { GeneratePdfFacturaService } from 'src/app/services/pdf/generate-pdf-factura.service';

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
  dataAux : any;
  subtotal : any;
  iva : any;
  total : any;
  
  constructor(
    private _rest : RestService,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    private generatePDF : GeneratePdfFacturaService
  ) { }

  ngOnInit(): void {
    this.getPedidos();
  }

  getPedidos(){
    this.loading = true;
    this._rest.getPendingOrders().subscribe((response) =>{
      this.groupOrderByIdOrder(response);
    })
  }

  groupOrderByIdOrder(response : any){
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

    this.loading = false;
  }

  complete(pedido : any){
    const data = {
      id_order : pedido.orders[0].i.id_order
    }

    this.confirmationService.confirm({
      message: `¿Está seguro de completar el pedido de: ${pedido.orders[0].i.order.user.user_name} ${pedido.orders[0].i.order.user.user_lastName}?`,
      header: 'Completar Pedido',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel : "Confirmar",
      accept: () => {
          this._rest.changeStateOrder(data).subscribe((response)=>{
            if(response.status == 200 || response.message == "Orden completada"){
              this.messageService.add({severity:'success', summary:'Completado', detail:`El pedido de ${pedido.orders[0].i.order.user.user_name} ${pedido.orders[0].i.order.user.user_lastName} ha sido completado`, life: 3000});
            }else if(response.status == 500 && response.message == "Ocurrio un error interno en el servidor"){
              this.messageService.add({severity:'error', summary:'Error', detail:`${response.message}`,life : 3000});
            }else if(response.status == 500){
              console.log(response.message);
            }else if(response.status == 401){
              console.log(response.message);
            }

            this.getPedidos();
          })
      }
  });
  }

  viewOrder(pedido : any){
    this.generatePDF.generateFacturePDF(pedido);
  }
}
