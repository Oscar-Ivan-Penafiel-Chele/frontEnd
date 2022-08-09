import { Component, Input, OnInit } from '@angular/core';
import { Message, MessageService } from 'primeng/api';

@Component({
  selector: 'app-messages-error',
  templateUrl: './messages-error.component.html',
  styleUrls: ['./messages-error.component.css']
})
export class MessagesErrorComponent implements OnInit {
  @Input() arrayMessageError: any[] = [];

  msgs1: Message[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  getMessagesError(){
    this.arrayMessageError.forEach((item)=>{
      this.msgs1.push({severity:'error', summary: 'Error', detail: `${item}`});
    })
  }
}
