import { Injectable } from '@angular/core';
import { ISailOrder } from '@models/interfaces';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public notificationSubject = new Subject<ISailOrder>();

  constructor() { }

  sendNotification(data: any){
    this.notificationSubject.next(data);
  }

  receivedNotification(): Observable<any>{
    return this.notificationSubject.asObservable();
  }
}
