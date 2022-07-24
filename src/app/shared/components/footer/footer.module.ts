import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './page/footer.component';
import { PrimengComponentsModule } from '../primeng-components/primeng-components.module';

@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
    CommonModule,
    PrimengComponentsModule,
  ],
  exports : [
    FooterComponent
  ]
})
export class FooterModule { }
